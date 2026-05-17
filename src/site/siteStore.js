import {
  cablesPageMeta as defaultCablesMeta,
} from '../data/cableProducts'
import {
  batteriesPageMeta as defaultBatteriesMeta,
} from '../data/batteryProducts'
import {
  SMART_WATCH_CATEGORY_SLUGS,
  smartWatchCategoryMeta as defaultSwCategoryMeta,
} from '../data/smartWatchProducts'
import { defaultPromoBanner } from '../data/promoBannerDefaults'
import {
  defaultStoryCarouselCards,
  defaultStoryCarouselSettings,
} from '../data/storyCarouselDefaults'

export const SITE_EVENT = 'exclusive-site-data'

/** Older keys cleared on save/site clear — keeps bundled defaults in sync after new slide URLs ship */
const LEGACY_HERO_SLIDES_KEY = 'exclusive-admin-hero-slides'
const SUPERSEDED_HERO_STORAGE_V2 = 'exclusive-admin-hero-slides-v2'
const SUPERSEDED_HERO_STORAGE_V3 = 'exclusive-admin-hero-slides-v3'

function removeSupersededHeroStorage() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LEGACY_HERO_SLIDES_KEY)
  localStorage.removeItem(SUPERSEDED_HERO_STORAGE_V2)
  localStorage.removeItem(SUPERSEDED_HERO_STORAGE_V3)
}

const KEYS = {
  hero: 'exclusive-admin-hero-slides-v4',
  products: 'exclusive-admin-products',
  cablesPage: 'exclusive-admin-cables-page-v1',
  batteriesPage: 'exclusive-admin-batteries-page-v1',
  smartWatchesPages: 'exclusive-admin-smart-watches-pages-v1',
  featuredArrival: 'exclusive-admin-featured-arrival-v1',
  promoBanner: 'exclusive-admin-promo-banner-v1',
  storyCarousel: 'exclusive-admin-story-carousel-v1',
}

/** @typedef {{ title: string; blurb: string }} CategoryPageMeta */
/** @typedef {{ products: import('../data/products').Product[]; heroSlides: unknown[]; meta: CategoryPageMeta }} CategoryPageBundle */
/** @typedef {{ id: string; title: string; description: string; image: string; href: string }} FeaturedArrivalTile */
/** @typedef {{ eyebrow: string; title: string; tiles: FeaturedArrivalTile[] }} FeaturedArrivalBundle */
/** @typedef {import('../data/promoBannerDefaults').PromoBannerBundle} PromoBannerBundle */
/** @typedef {import('../data/storyCarouselDefaults').StoryCarouselCard} StoryCarouselCard */
/** @typedef {{ items: StoryCarouselCard[]; autoRotate: boolean; rotateInterval: number }} StoryCarouselBundle */

const EMPTY_FEATURED_ARRIVAL = /** @type {const} */ ({
  eyebrow: '',
  title: '',
  tiles: [],
})

/** @returns {FeaturedArrivalBundle} */
export function getMergedFeaturedArrival() {
  if (typeof window === 'undefined') {
    return { eyebrow: '', title: '', tiles: [] }
  }
  try {
    const raw = localStorage.getItem(KEYS.featuredArrival)
    if (!raw) return { ...EMPTY_FEATURED_ARRIVAL }
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return { ...EMPTY_FEATURED_ARRIVAL }
    const tilesRaw = Array.isArray(o.tiles) ? o.tiles : []
    /** @type {FeaturedArrivalTile[]} */
    const tiles = tilesRaw.map((t, i) => {
      const row = /** @type {Record<string, unknown>} */ (t && typeof t === 'object' ? t : {})
      return {
        id: String(row.id ?? `tile-${i}`).trim() || `tile-${i}`,
        title: String(row.title ?? '').trim(),
        description: String(row.description ?? '').trim(),
        image: String(row.image ?? '').trim(),
        href: String(row.href ?? '').trim(),
      }
    })
    return {
      eyebrow: typeof o.eyebrow === 'string' ? o.eyebrow : '',
      title: typeof o.title === 'string' ? o.title : '',
      tiles,
    }
  } catch {
    return { ...EMPTY_FEATURED_ARRIVAL }
  }
}

/** @param {FeaturedArrivalBundle} bundle */
/** @returns {PromoBannerBundle} */
export function getMergedPromoBanner() {
  if (typeof window === 'undefined') {
    return { ...defaultPromoBanner }
  }
  try {
    const raw = localStorage.getItem(KEYS.promoBanner)
    if (!raw) return { ...defaultPromoBanner }
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return { ...defaultPromoBanner }
    const endsRaw = typeof o.countdownEndsAt === 'string' ? o.countdownEndsAt.trim() : ''
    const endsMs = endsRaw ? Date.parse(endsRaw) : NaN
    return {
      enabled: o.enabled !== false,
      eyebrow:
        typeof o.eyebrow === 'string' && o.eyebrow.trim()
          ? o.eyebrow.trim()
          : defaultPromoBanner.eyebrow,
      titleLine1:
        typeof o.titleLine1 === 'string' && o.titleLine1.trim()
          ? o.titleLine1.trim()
          : defaultPromoBanner.titleLine1,
      titleLine2:
        typeof o.titleLine2 === 'string' ? o.titleLine2.trim() : defaultPromoBanner.titleLine2,
      description:
        typeof o.description === 'string' && o.description.trim()
          ? o.description.trim()
          : defaultPromoBanner.description,
      image:
        typeof o.image === 'string' && o.image.trim()
          ? o.image.trim()
          : defaultPromoBanner.image,
      countdownEndsAt: Number.isFinite(endsMs)
        ? new Date(endsMs).toISOString()
        : defaultPromoBanner.countdownEndsAt,
      ctaLabel:
        typeof o.ctaLabel === 'string' && o.ctaLabel.trim()
          ? o.ctaLabel.trim()
          : defaultPromoBanner.ctaLabel,
      ctaHref:
        typeof o.ctaHref === 'string' && o.ctaHref.trim()
          ? o.ctaHref.trim()
          : defaultPromoBanner.ctaHref,
      secondaryLabel:
        typeof o.secondaryLabel === 'string' ? o.secondaryLabel.trim() : defaultPromoBanner.secondaryLabel,
      secondaryHref:
        typeof o.secondaryHref === 'string' && o.secondaryHref.trim()
          ? o.secondaryHref.trim()
          : defaultPromoBanner.secondaryHref,
    }
  } catch {
    return { ...defaultPromoBanner }
  }
}

/** @param {PromoBannerBundle} bundle */
export function setMergedPromoBanner(bundle) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.promoBanner, JSON.stringify(bundle))
  notifySite()
}

export function setMergedFeaturedArrival(bundle) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    KEYS.featuredArrival,
    JSON.stringify({
      eyebrow: bundle.eyebrow.trim(),
      title: bundle.title.trim(),
      tiles: bundle.tiles.map((t) => ({
        id: t.id.trim(),
        title: t.title.trim(),
        description: t.description.trim(),
        image: t.image.trim(),
        href: t.href.trim(),
      })),
    }),
  )
  notifySite()
}

/** @returns {StoryCarouselBundle} */
export function getMergedStoryCarousel() {
  const fallback = {
    items: defaultStoryCarouselCards.map((c) => ({ ...c, tags: [...c.tags] })),
    ...defaultStoryCarouselSettings,
  }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(KEYS.storyCarousel)
    if (!raw) return fallback
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return fallback
    const itemsRaw = Array.isArray(o.items) ? o.items : []
    /** @type {StoryCarouselCard[]} */
    const items =
      itemsRaw.length > 0
        ? itemsRaw.map((row, i) => {
            const t = /** @type {Record<string, unknown>} */ (row && typeof row === 'object' ? row : {})
            const tagsRaw = Array.isArray(t.tags) ? t.tags : []
            return {
              id: String(t.id ?? `story-${i}`).trim() || `story-${i}`,
              title: String(t.title ?? '').trim(),
              brand: String(t.brand ?? '').trim(),
              description: String(t.description ?? '').trim(),
              tags: tagsRaw.map((tag) => String(tag).trim()).filter(Boolean),
              imageUrl: String(t.imageUrl ?? '').trim(),
              link: String(t.link ?? '').trim() || '#',
            }
          })
        : fallback.items
    const interval = Number(o.rotateInterval)
    return {
      items,
      autoRotate: o.autoRotate !== false,
      rotateInterval: Number.isFinite(interval) && interval >= 2000 ? interval : fallback.rotateInterval,
    }
  } catch {
    return fallback
  }
}

/** @param {StoryCarouselBundle} bundle */
export function setMergedStoryCarousel(bundle) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    KEYS.storyCarousel,
    JSON.stringify({
      items: bundle.items.map((c) => ({
        id: c.id.trim(),
        title: c.title.trim(),
        brand: c.brand.trim(),
        description: c.description.trim(),
        tags: c.tags.map((t) => t.trim()).filter(Boolean),
        imageUrl: c.imageUrl.trim(),
        link: c.link.trim() || '#',
      })),
      autoRotate: bundle.autoRotate !== false,
      rotateInterval: bundle.rotateInterval,
    }),
  )
  notifySite()
}

/** Clears admin overrides for the 3D story carousel (storefront uses bundled defaults). */
export function clearMergedStoryCarousel() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.storyCarousel)
  notifySite()
}

const EMPTY_MERGED = /** @type {const} */ ({
  flash: [],
  best: [],
  explore: [],
})

export function getHeroSlides() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEYS.hero)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return []
    return parsed
  } catch {
    return []
  }
}

/** @param {unknown[]} slides */
export function setHeroSlides(slides) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.hero, JSON.stringify(slides))
  removeSupersededHeroStorage()
  notifySite()
}

/** @typedef {{ flash: import('../data/products').Product[]; best: import('../data/products').Product[]; explore: import('../data/products').Product[] }} MergedProducts */

/** @returns {MergedProducts} */
export function getMergedProducts() {
  if (typeof window === 'undefined') return { ...EMPTY_MERGED }
  try {
    const raw = localStorage.getItem(KEYS.products)
    if (!raw) return { ...EMPTY_MERGED }
    const o = JSON.parse(raw)
    return {
      flash: Array.isArray(o.flash) ? o.flash : [],
      best: Array.isArray(o.best) ? o.best : [],
      explore: Array.isArray(o.explore) ? o.explore : [],
    }
  } catch {
    return { ...EMPTY_MERGED }
  }
}

/** @param {MergedProducts} merged */
export function setMergedProducts(merged) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    KEYS.products,
    JSON.stringify({
      flash: merged.flash,
      best: merged.best,
      explore: merged.explore,
    }),
  )
  notifySite()
}

/** @returns {CategoryPageBundle} */
function defaultCablesPageBundle() {
  return {
    products: [],
    heroSlides: [],
    meta: defaultCablesMeta,
  }
}

/** @returns {CategoryPageBundle} */
function defaultBatteriesPageBundle() {
  return {
    products: [],
    heroSlides: [],
    meta: defaultBatteriesMeta,
  }
}

/** @returns {CategoryPageBundle} */
export function getMergedCablesPage() {
  const fallback = defaultCablesPageBundle()
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(KEYS.cablesPage)
    if (!raw) return fallback
    const o = JSON.parse(raw)
    return {
      products: Array.isArray(o.products) ? o.products : [],
      heroSlides: Array.isArray(o.heroSlides) ? o.heroSlides : [],
      meta: {
        title: typeof o.meta?.title === 'string' && o.meta.title.trim() ? o.meta.title : fallback.meta.title,
        blurb: typeof o.meta?.blurb === 'string' && o.meta.blurb.trim() ? o.meta.blurb : fallback.meta.blurb,
      },
    }
  } catch {
    return fallback
  }
}

/** @param {string} slug */
function emptySmartWatchBundleForSlug(slug) {
  const meta = defaultSwCategoryMeta[slug] ?? { title: slug, blurb: '' }
  return {
    products: [],
    heroSlides: [],
    meta: { title: meta.title, blurb: meta.blurb },
  }
}

/** @returns {Record<string, CategoryPageBundle>} */
function defaultAllSmartWatchBundles() {
  /** @type {Record<string, CategoryPageBundle>} */
  const out = {}
  for (const slug of SMART_WATCH_CATEGORY_SLUGS) {
    out[slug] = emptySmartWatchBundleForSlug(slug)
  }
  return out
}

/** @returns {Record<string, CategoryPageBundle>} */
export function getMergedSmartWatchPagesAll() {
  const fallback = defaultAllSmartWatchBundles()
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(KEYS.smartWatchesPages)
    if (!raw) return fallback
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return fallback
    /** @type {Record<string, CategoryPageBundle>} */
    const merged = { ...fallback }
    for (const slug of SMART_WATCH_CATEGORY_SLUGS) {
      const b = o[slug]
      if (!b || typeof b !== 'object') continue
      const fb = fallback[slug]
      merged[slug] = {
        products: Array.isArray(b.products) ? b.products : fb.products,
        heroSlides: Array.isArray(b.heroSlides) ? b.heroSlides : fb.heroSlides,
        meta: {
          title:
            typeof b.meta?.title === 'string' && b.meta.title.trim()
              ? b.meta.title.trim()
              : fb.meta.title,
          blurb:
            typeof b.meta?.blurb === 'string' && b.meta.blurb.trim()
              ? b.meta.blurb.trim()
              : fb.meta.blurb,
        },
      }
    }
    return merged
  } catch {
    return fallback
  }
}

/** @param {string} slug */
export function getMergedSmartWatchCategoryPage(slug) {
  const all = getMergedSmartWatchPagesAll()
  return all[slug] ?? emptySmartWatchBundleForSlug(slug)
}

/** @param {string} slug @param {CategoryPageBundle} bundle */
export function setMergedSmartWatchCategoryPage(slug, bundle) {
  if (typeof window === 'undefined') return
  const all = getMergedSmartWatchPagesAll()
  all[slug] = bundle
  localStorage.setItem(KEYS.smartWatchesPages, JSON.stringify(all))
  notifySite()
}

/** @returns {import('../data/products').Product[]} */
export function getMergedSmartWatchProductsFlat() {
  const pages = getMergedSmartWatchPagesAll()
  return SMART_WATCH_CATEGORY_SLUGS.flatMap((slug) => pages[slug]?.products ?? [])
}

/** @returns {CategoryPageBundle} */
export function getMergedBatteriesPage() {
  const fallback = defaultBatteriesPageBundle()
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(KEYS.batteriesPage)
    if (!raw) return fallback
    const o = JSON.parse(raw)
    return {
      products: Array.isArray(o.products) ? o.products : [],
      heroSlides: Array.isArray(o.heroSlides) ? o.heroSlides : [],
      meta: {
        title: typeof o.meta?.title === 'string' && o.meta.title.trim() ? o.meta.title : fallback.meta.title,
        blurb: typeof o.meta?.blurb === 'string' && o.meta.blurb.trim() ? o.meta.blurb : fallback.meta.blurb,
      },
    }
  } catch {
    return fallback
  }
}

/** @param {CategoryPageBundle} bundle */
export function setMergedCablesPage(bundle) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.cablesPage, JSON.stringify(bundle))
  notifySite()
}

/** @param {CategoryPageBundle} bundle */
export function setMergedBatteriesPage(bundle) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.batteriesPage, JSON.stringify(bundle))
  notifySite()
}

export function clearSiteOverrides() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.hero)
  removeSupersededHeroStorage()
  localStorage.removeItem(KEYS.products)
  localStorage.removeItem(KEYS.cablesPage)
  localStorage.removeItem(KEYS.batteriesPage)
  localStorage.removeItem(KEYS.smartWatchesPages)
  localStorage.removeItem(KEYS.featuredArrival)
  localStorage.removeItem(KEYS.promoBanner)
  localStorage.removeItem(KEYS.storyCarousel)
  notifySite()
}

export function notifySite() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(SITE_EVENT))
}

/** @param {() => void} cb */
export function subscribeSite(cb) {
  if (typeof window === 'undefined') return () => {}
  const storage = () => cb()
  window.addEventListener(SITE_EVENT, cb)
  window.addEventListener('storage', storage)
  return () => {
    window.removeEventListener(SITE_EVENT, cb)
    window.removeEventListener('storage', storage)
  }
}
