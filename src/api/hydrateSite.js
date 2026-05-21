import { apiGet } from './client'
import {
  fetchHeroBanners,
  mapApiHeroBannerToSlide,
  normalizeHeroBannerList,
  persistHeroSlidesFromApi,
} from './heroBanners'
import { isApiConfigured } from '../config/env'
import {
  setHeroSlides,
  setMergedBatteriesPage,
  setMergedCablesPage,
  setMergedFeaturedArrival,
  setMergedHomePromoCarousel,
  setMergedProducts,
  setMergedPromoBanner,
  setMergedSmartWatchCategoryPage,
  setMergedStoryCarousel,
  notifySite,
} from '../site/siteStore'
import { SMART_WATCH_CATEGORY_SLUGS } from '../data/smartWatchProducts'

/** @typedef {{ ok: boolean; applied: string[]; error?: string }} HydrateResult */

let hydrateInflight = /** @type {Promise<HydrateResult> | null} */ (null)

/** Call after admin CMS changes if you need a fresh pull on next hydrate. */
export function invalidateSiteHydration() {
  hydrateInflight = null
}

/**
 * Pull CMS bundles from backend into localStorage so existing `getMerged*` keep working.
 * In-flight requests are deduped (avoids double GET in React Strict Mode dev).
 *
 * @returns {Promise<HydrateResult>}
 */
export async function hydrateSiteFromApi() {
  if (!isApiConfigured()) {
    return { ok: false, applied: [], error: 'API not configured' }
  }

  if (hydrateInflight) return hydrateInflight

  hydrateInflight = runHydrate().finally(() => {
    hydrateInflight = null
  })

  return hydrateInflight
}

/** @returns {Promise<HydrateResult>} */
async function runHydrate() {
  const applied = []

  try {
    /** @type {Record<string, unknown> | null} */
    let bootstrap = null
    try {
      bootstrap = /** @type {Record<string, unknown>} */ (await apiGet('/site'))
      applied.push('/site')
    } catch {
      try {
        bootstrap = /** @type {Record<string, unknown>} */ (await apiGet('/cms'))
        applied.push('/cms')
      } catch {
        bootstrap = null
      }
    }

    if (bootstrap && typeof bootstrap === 'object') {
      applyBootstrap(bootstrap, applied)
      notifySite()
      return { ok: true, applied }
    }

    await hydratePiecemeal(applied)
    notifySite()
    return { ok: applied.length > 0, applied }
  } catch (err) {
    return {
      ok: false,
      applied,
      error: err instanceof Error ? err.message : 'Hydration failed',
    }
  }
}

/** @param {Record<string, unknown>} data @param {string[]} applied */
function applyBootstrap(data, applied) {
  if (Array.isArray(data.heroBanners)) {
    persistHeroSlidesFromApi(
      normalizeHeroBannerList({ data: data.heroBanners }).map((item) => mapApiHeroBannerToSlide(item)),
    )
    applied.push('/hero-banners')
  } else if (Array.isArray(data.hero) || Array.isArray(data.heroSlides)) {
    setHeroSlides(/** @type {unknown[]} */ (data.hero ?? data.heroSlides))
    applied.push('/hero')
  }

  if (data.products && typeof data.products === 'object') {
    setMergedProducts(/** @type {{ flash: unknown[]; best: unknown[]; explore: unknown[] }} */ (data.products))
  }
  if (data.cables) setMergedCablesPage(/** @type {import('../site/siteStore').CategoryPageBundle} */ (data.cables))
  if (data.batteries) setMergedBatteriesPage(/** @type {import('../site/siteStore').CategoryPageBundle} */ (data.batteries))
  if (data.featuredArrival) setMergedFeaturedArrival(/** @type {import('../site/siteStore').FeaturedArrivalBundle} */ (data.featuredArrival))
  if (data.promoBanner) setMergedPromoBanner(/** @type {import('../data/promoBannerDefaults').PromoBannerBundle} */ (data.promoBanner))
  if (data.storyCarousel) setMergedStoryCarousel(/** @type {import('../site/siteStore').StoryCarouselBundle} */ (data.storyCarousel))
  if (data.homePromoCarousel) setMergedHomePromoCarousel(/** @type {import('../site/siteStore').HomePromoCarouselBundle} */ (data.homePromoCarousel))

  const sw = data.smartWatches ?? data.smartWatchesPages
  if (sw && typeof sw === 'object') {
    for (const slug of SMART_WATCH_CATEGORY_SLUGS) {
      if (/** @type {Record<string, unknown>} */ (sw)[slug]) {
        setMergedSmartWatchCategoryPage(slug, /** @type {import('../site/siteStore').CategoryPageBundle} */ (/** @type {Record<string, unknown>} */ (sw)[slug]))
      }
    }
  }
}

/** @param {string[]} applied */
async function hydratePiecemeal(applied) {
  try {
    const slides = await fetchHeroBanners()
    persistHeroSlidesFromApi(slides)
    applied.push('/hero-banners')
  } catch {
    // optional
  }

  const tries = [
    ['products', async (d) => setMergedProducts(/** @type {{ flash: unknown[]; best: unknown[]; explore: unknown[] }} */ (d))],
    ['cables', async (d) => setMergedCablesPage(/** @type {import('../site/siteStore').CategoryPageBundle} */ (d))],
    ['batteries', async (d) => setMergedBatteriesPage(/** @type {import('../site/siteStore').CategoryPageBundle} */ (d))],
    ['featured-arrival', async (d) => setMergedFeaturedArrival(/** @type {import('../site/siteStore').FeaturedArrivalBundle} */ (d))],
    ['promo-banner', async (d) => setMergedPromoBanner(/** @type {import('../data/promoBannerDefaults').PromoBannerBundle} */ (d))],
    ['story-carousel', async (d) => setMergedStoryCarousel(/** @type {import('../site/siteStore').StoryCarouselBundle} */ (d))],
    ['home-promo-carousel', async (d) => setMergedHomePromoCarousel(/** @type {import('../site/siteStore').HomePromoCarouselBundle} */ (d))],
  ]

  for (const [path, apply] of tries) {
    try {
      const data = await apiGet(`/${path}`)
      if (data != null) {
        await apply(data)
        applied.push(`/${path}`)
      }
    } catch {
      // endpoint optional
    }
  }

  try {
    const sw = await apiGet('/smart-watches')
    if (sw && typeof sw === 'object') {
      for (const slug of SMART_WATCH_CATEGORY_SLUGS) {
        if (/** @type {Record<string, unknown>} */ (sw)[slug]) {
          setMergedSmartWatchCategoryPage(
            slug,
            /** @type {import('../site/siteStore').CategoryPageBundle} */ (/** @type {Record<string, unknown>} */ (sw)[slug]),
          )
        }
      }
      applied.push('/smart-watches')
    }
  } catch {
    // optional
  }
}
