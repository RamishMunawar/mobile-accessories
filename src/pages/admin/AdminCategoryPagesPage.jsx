import { useId, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { SMART_WATCH_CATEGORY_SLUGS, smartWatchCategoryMeta } from '../../data/smartWatchProducts'
import {
  getMergedProducts,
  getMergedCablesPage,
  getMergedBatteriesPage,
  getMergedSmartWatchPagesAll,
  setMergedCablesPage,
  setMergedBatteriesPage,
  setMergedSmartWatchCategoryPage,
} from '../../site/siteStore'
import AdminProductGalleryFields from '../../components/admin/AdminProductGalleryFields'
import { uploadAdminImage } from '../../utils/uploadAdminImage'
import { patchProductMainImage } from '../../utils/productGallery'
import { batteryCategories } from '../../data/batteryCategories'
import { cableCategories } from '../../data/cableCategories'
import { smartWatchCategories } from '../../data/smartWatchCategories'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader, AdminSegmentedTabs } from './AdminUi'

/** @typedef {'cables' | 'batteries' | 'smart-watches'} CatKey */

/** @param {unknown} bundle */
function cloneBundle(bundle) {
  const b = bundle
  return {
    meta: { title: String(b.meta?.title ?? ''), blurb: String(b.meta?.blurb ?? '') },
    heroSlides: Array.isArray(b.heroSlides)
      ? b.heroSlides.map((s) => ({ ...structuredClone(Object(s ?? {})) }))
      : [],
    products: Array.isArray(b.products) ? b.products.map((p) => ({ ...structuredClone(Object(p ?? {})) })) : [],
  }
}

/** @returns {import('../../data/products').Product} */
/**
 * @param {{ defaultCableType?: string; defaultBatteryType?: string; defaultWatchCategory?: string }} [opts]
 */
function emptyProduct(opts) {
  const defaultCableType = opts?.defaultCableType
  const defaultBatteryType = opts?.defaultBatteryType
  const defaultWatchCategory = opts?.defaultWatchCategory
  return {
    id: `new-${Date.now()}`,
    title: 'New product',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    price: 99,
    rating: 4,
    reviews: 0,
    ...(defaultCableType ? { cableType: defaultCableType } : {}),
    ...(defaultBatteryType ? { batteryType: defaultBatteryType } : {}),
    ...(defaultWatchCategory ? { watchCategory: defaultWatchCategory } : {}),
  }
}

function emptyHeroSlide() {
  return {
    id: `slide-${Date.now()}`,
    brandApple: false,
    fullBleed: true,
    series: '',
    titleLine1: '',
    titleLine2: '',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=700&fit=crop',
  }
}

/** @param {CatKey} category @param {*} cables @param {*} batteries @param {string | null} swSlug @param {Record<string, any>} swDrafts */
function forbiddenProductIds(category, cables, batteries, swSlug, swDrafts) {
  const { flash, best, explore } = getMergedProducts()
  const forbid = new Set()
  ;[...flash, ...best, ...explore].forEach((p) => {
    const id = p.id?.trim()
    if (id) forbid.add(id)
  })

  const smartWatchProductsFromDrafts = SMART_WATCH_CATEGORY_SLUGS.flatMap(
    (s) => swDrafts[s]?.products ?? [],
  )

  if (category === 'cables') {
    batteries.products.forEach((p) => {
      const id = p.id?.trim()
      if (id) forbid.add(id)
    })
    smartWatchProductsFromDrafts.forEach((p) => {
      const id = p.id?.trim()
      if (id) forbid.add(id)
    })
  } else if (category === 'batteries') {
    cables.products.forEach((p) => {
      const id = p.id?.trim()
      if (id) forbid.add(id)
    })
    smartWatchProductsFromDrafts.forEach((p) => {
      const id = p.id?.trim()
      if (id) forbid.add(id)
    })
  } else {
    cables.products.forEach((p) => {
      const id = p.id?.trim()
      if (id) forbid.add(id)
    })
    batteries.products.forEach((p) => {
      const id = p.id?.trim()
      if (id) forbid.add(id)
    })
    for (const s of SMART_WATCH_CATEGORY_SLUGS) {
      if (s === swSlug) continue
      const prods = swDrafts[s]?.products ?? []
      prods.forEach((p) => {
        const id = p.id?.trim()
        if (id) forbid.add(id)
      })
    }
  }
  return forbid
}

/** @param {unknown[]} slides @returns {string} */
function validateSlides(slides) {
  if (!slides.length) return ''
  for (const s of slides) {
    const sl = /** @type {Record<string, unknown>} */ (s)
    const id = String(sl.id ?? '').trim()
    const image = String(sl.image ?? '').trim()
    const fullBleed = Boolean(sl.fullBleed)
    if (!id || !image) return 'Each slide needs an ID and image URL.'
    if (!fullBleed && !(String(sl.series ?? '').trim())) {
      return 'Split-layout slides need a series label — or enable full-width banner.'
    }
  }
  const ids = slides.map((s) => String(/** @type {any} */ (s).id).trim())
  if (ids.length !== new Set(ids).size) return 'Slide IDs must be unique.'
  return ''
}

/** @param {import('../../data/products').Product[]} products @param {Set<string>} externalIds */
function validateProducts(products, externalIds) {
  const ids = []
  for (const p of products) {
    const id = p.id?.trim()
    const title = p.title?.trim()
    const image = p.image?.trim()
    if (!id || !title || !image) return 'Each product needs ID, title, and image.'
    if (Number.isNaN(Number(p.price)) || Number(p.rating) < 0) return 'Check price, rating, and reviews.'
    if (externalIds.has(id)) return `Product ID "${id}" is already used elsewhere in the storefront.`
    ids.push(id)
  }
  if (ids.length !== new Set(ids).size) return 'Product IDs must be unique in this category.'
  return ''
}

/** @param {unknown} s */
function normalizeHeroSlideSave(s) {
  const raw = /** @type {Record<string, unknown>} */ (s)
  return {
    id: String(raw.id ?? '').trim(),
    series: String(raw.series ?? '').trim(),
    titleLine1: String(raw.titleLine1 ?? '').trim() || (raw.fullBleed ? '' : 'Promotion'),
    titleLine2: String(raw.titleLine2 ?? '').trim(),
    image: String(raw.image ?? '').trim(),
    brandApple: Boolean(raw.brandApple),
    fullBleed: Boolean(raw.fullBleed),
  }
}

/** @param {import('../../data/products').Product} p */
function normalizeCatalogProductSave(p) {
  const next = {
    id: p.id.trim(),
    title: p.title.trim(),
    image: p.image.trim(),
    price: Number(p.price),
    rating: Number(p.rating),
    reviews: Number(p.reviews),
  }
  if (p.oldPrice != null && !Number.isNaN(Number(p.oldPrice))) next.oldPrice = Number(p.oldPrice)
  if (p.discount != null && !Number.isNaN(Number(p.discount))) next.discount = Number(p.discount)
  if (p.badge === 'new' || p.badge === 'sale' || p.badge === 'sold-out') next.badge = p.badge
  if (p.colors?.length) next.colors = p.colors
  if (p.freeShip === true) next.freeShip = true
  const gallery = Array.isArray(p.gallery)
    ? p.gallery.map((s) => String(s).trim()).filter(Boolean)
    : []
  if (gallery.length > 1) next.gallery = gallery
  const cableType = typeof p.cableType === 'string' ? p.cableType.trim().toLowerCase() : ''
  if (cableType && cableType !== 'all' && cableCategories.some((c) => c.slug === cableType)) {
    next.cableType = cableType
  }
  const batteryType = typeof p.batteryType === 'string' ? p.batteryType.trim().toLowerCase() : ''
  if (batteryType && batteryType !== 'all' && batteryCategories.some((c) => c.slug === batteryType)) {
    next.batteryType = batteryType
  }
  const watchCategory = typeof p.watchCategory === 'string' ? p.watchCategory.trim().toLowerCase() : ''
  if (watchCategory && smartWatchCategories.some((c) => c.slug === watchCategory)) {
    next.watchCategory = watchCategory
  }
  return next
}

/** @param {ReturnType<typeof cloneBundle>} draft */
function buildNormalizedCategoryBundle(draft) {
  return {
    meta: {
      title: draft.meta.title.trim(),
      blurb: draft.meta.blurb.trim(),
    },
    heroSlides: draft.heroSlides.map(normalizeHeroSlideSave),
    products: draft.products.map(normalizeCatalogProductSave),
  }
}

/**
 * @param {CatKey} tab
 * @param {*} cablesState
 * @param {*} batteriesState
 * @param {string | null} swSlugVal
 * @param {Record<string, any>} swDraftsMap
 * @param {*} draft
 */
function validateCategoryDraft(tab, cablesState, batteriesState, swSlugVal, swDraftsMap, draft) {
  if (!draft.meta.title?.trim()) return 'Page title is required for this category.'
  if (!draft.meta.blurb?.trim()) return 'Page description blurb is required.'
  const slideErr = validateSlides(draft.heroSlides)
  if (slideErr) return slideErr
  const ext = forbiddenProductIds(tab, cablesState, batteriesState, swSlugVal, swDraftsMap)
  const prodErr = validateProducts(draft.products, ext)
  if (prodErr) return prodErr
  return null
}

function buildInitialSwDrafts() {
  const all = getMergedSmartWatchPagesAll()
  /** @type {Record<string, ReturnType<typeof cloneBundle>>} */
  const o = {}
  for (const slug of SMART_WATCH_CATEGORY_SLUGS) {
    o[slug] = cloneBundle(all[slug])
  }
  return o
}

export default function AdminCategoryPagesPage() {
  const baseId = useId()
  const [tab, setTab] = useState(/** @type {CatKey} */ ('cables'))
  const [cables, setCables] = useState(() => cloneBundle(getMergedCablesPage()))
  const [batteries, setBatteries] = useState(() => cloneBundle(getMergedBatteriesPage()))
  const [swSlug, setSwSlug] = useState(
    /** @type {(typeof SMART_WATCH_CATEGORY_SLUGS)[number]} */ (SMART_WATCH_CATEGORY_SLUGS[0]),
  )
  const [swDrafts, setSwDrafts] = useState(() => buildInitialSwDrafts())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isCables = tab === 'cables'
  const isBatteries = tab === 'batteries'
  const isSmartWatches = tab === 'smart-watches'
  const draft = isCables ? cables : isBatteries ? batteries : swDrafts[swSlug]
  const editKey = isSmartWatches ? swSlug : tab

  /** @template T @param {(prev: typeof draft) => T} updater */
  function patchDraft(updater) {
    if (isCables) {
      setCables((prev) => updater(prev))
    } else if (isBatteries) {
      setBatteries((prev) => updater(prev))
    } else {
      setSwDrafts((prev) => ({
        ...prev,
        [swSlug]: updater(prev[swSlug]),
      }))
    }
    setMessage('')
    setError('')
  }

  /**
   * @param {CatKey} tabKey
   * @param {*} cablesState
   * @param {*} batteriesState
   * @param {Record<string, any>} swDraftsMap
   * @param {*} draftToPersist
   * @param {string | null} swSlugForTab
   */
  function commitDraft(tabKey, cablesState, batteriesState, swDraftsMap, draftToPersist, swSlugForTab) {
    const err = validateCategoryDraft(
      tabKey,
      cablesState,
      batteriesState,
      tabKey === 'smart-watches' ? swSlugForTab : null,
      swDraftsMap,
      draftToPersist,
    )
    if (err) {
      setError(err)
      setMessage('')
      return false
    }
    const bundle = buildNormalizedCategoryBundle(draftToPersist)
    if (tabKey === 'cables') setMergedCablesPage(bundle)
    else if (tabKey === 'batteries') setMergedBatteriesPage(bundle)
    else setMergedSmartWatchCategoryPage(/** @type {string} */ (swSlugForTab), bundle)
    setError('')
    return true
  }

  function removeHeroSlideAt(index) {
    setError('')
    setMessage('')
    if (isCables) {
      const next = { ...cables, heroSlides: cables.heroSlides.filter((_, i) => i !== index) }
      setCables(next)
      if (commitDraft('cables', next, batteries, swDrafts, next, swSlug)) {
        setMessage('Cables page updated on the site.')
      }
      return
    }
    if (isBatteries) {
      const next = { ...batteries, heroSlides: batteries.heroSlides.filter((_, i) => i !== index) }
      setBatteries(next)
      if (commitDraft('batteries', cables, next, swDrafts, next, swSlug)) {
        setMessage('Batteries page updated on the site.')
      }
      return
    }
    const cur = swDrafts[swSlug]
    const next = { ...cur, heroSlides: cur.heroSlides.filter((_, i) => i !== index) }
    const nextMap = { ...swDrafts, [swSlug]: next }
    setSwDrafts(nextMap)
    if (commitDraft('smart-watches', cables, batteries, nextMap, next, swSlug)) {
      setMessage('Smart watches page updated on the site.')
    }
  }

  function removeProductAt(index) {
    setError('')
    setMessage('')
    if (isCables) {
      const next = { ...cables, products: cables.products.filter((_, i) => i !== index) }
      setCables(next)
      if (commitDraft('cables', next, batteries, swDrafts, next, swSlug)) {
        setMessage('Cables updated on the site.')
      }
      return
    }
    if (isBatteries) {
      const next = { ...batteries, products: batteries.products.filter((_, i) => i !== index) }
      setBatteries(next)
      if (commitDraft('batteries', cables, next, swDrafts, next, swSlug)) {
        setMessage('Batteries updated on the site.')
      }
      return
    }
    const cur = swDrafts[swSlug]
    const next = { ...cur, products: cur.products.filter((_, i) => i !== index) }
    const nextMap = { ...swDrafts, [swSlug]: next }
    setSwDrafts(nextMap)
    if (commitDraft('smart-watches', cables, batteries, nextMap, next, swSlug)) {
      setMessage('Smart watches updated on the site.')
    }
  }

  function parseColors(str) {
    const parts = str.split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean)
    return parts.length ? parts : undefined
  }

  /**
   * @param {Record<string, ReturnType<typeof cloneBundle>>} map
   * @param {string} slug
   */
  function persistSmartWatchBundle(map, slug) {
    const err = validateCategoryDraft('smart-watches', cables, batteries, slug, map, map[slug])
    if (err) {
      setError(err)
      setMessage('')
      return false
    }
    setMergedSmartWatchCategoryPage(slug, buildNormalizedCategoryBundle(map[slug]))
    return true
  }

  /** @param {number} productIndex @param {string} targetSlug */
  function moveProductWatchCategory(productIndex, targetSlug) {
    if (targetSlug === swSlug) return
    setError('')
    setMessage('')
    const source = swDrafts[swSlug]
    const product = source.products[productIndex]
    if (!product) return
    const nextMap = {
      ...swDrafts,
      [swSlug]: {
        ...source,
        products: source.products.filter((_, i) => i !== productIndex),
      },
      [targetSlug]: {
        ...swDrafts[targetSlug],
        products: [...swDrafts[targetSlug].products, { ...product, watchCategory: targetSlug }],
      },
    }
    setSwDrafts(nextMap)
    const label = smartWatchCategoryMeta[targetSlug]?.title ?? targetSlug
    if (persistSmartWatchBundle(nextMap, swSlug) && persistSmartWatchBundle(nextMap, targetSlug)) {
      setMessage(`Product moved to “${label}” and saved.`)
    }
  }

  function handleSave() {
    setError('')
    setMessage('')
    const ok =
      tab === 'cables'
        ? commitDraft('cables', cables, batteries, swDrafts, cables, swSlug)
        : tab === 'batteries'
          ? commitDraft('batteries', cables, batteries, swDrafts, batteries, swSlug)
          : commitDraft('smart-watches', cables, batteries, swDrafts, swDrafts[swSlug], swSlug)
    if (!ok) return
    if (tab === 'cables') {
      setMessage('Cables saved. Open /cables on the storefront to verify.')
    } else if (tab === 'batteries') {
      setMessage('Batteries saved. Open /batteries on the storefront to verify.')
    } else {
      setMessage(
        `Smart watches (${smartWatchCategoryMeta[swSlug]?.title ?? swSlug}) saved. Open /smart-watches/${swSlug} to verify.`,
      )
    }
  }

  const tabs = /** @type {{ key: CatKey; label: string }}[] */ ([
    { key: 'cables', label: 'Cables' },
    { key: 'batteries', label: 'Batteries' },
    { key: 'smart-watches', label: 'Smart Watches' },
  ])

  const saveButtonLabel =
    tab === 'cables' ? 'Cables' : tab === 'batteries' ? 'Batteries' : `Smart watches · ${swSlug}`

  return (
    <div>
      <AdminPageHeader
        eyebrow="Storefront routes"
        title="Category pages"
        description={
          <>
            Edit <strong className="font-semibold text-exclusive-dark">/cables</strong>,{' '}
            <strong className="font-semibold text-exclusive-dark">/batteries</strong>, and{' '}
            <strong className="font-semibold text-exclusive-dark">/smart-watches/…</strong> — hero
            carousel, intro copy, and product grids (same patterns as homepage sections).
          </>
        }
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <div className="mt-2">
        <AdminSegmentedTabs activeKey={tab} onChange={(k) => setTab(/** @type {CatKey} */ (k))} tabs={tabs} />
      </div>

      {isSmartWatches ? (
        <div className="mt-4 max-w-xl">
          <label htmlFor={`${baseId}-sw-route`} className="mb-2 block text-sm font-medium text-exclusive-dark">
            Watch category route
          </label>
          <select
            id={`${baseId}-sw-route`}
            className={adminInputClass}
            value={swSlug}
            onChange={(e) => {
              setSwSlug(/** @type {(typeof SMART_WATCH_CATEGORY_SLUGS)[number]} */ (e.target.value))
              setMessage('')
              setError('')
            }}
          >
            {smartWatchCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-exclusive-muted">
            Same list as the Smart Watches dropdown in the storefront header — hero and products for{' '}
            <span className="font-medium text-exclusive-dark">/smart-watches/{swSlug}</span>.
          </p>
        </div>
      ) : null}

      <section className={`${adminCardClass} mt-10`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Page heading & intro</h2>
        <p className="mt-1 text-sm leading-relaxed text-exclusive-muted">
          Shown below the hero slider on this category route.
        </p>
        <div className="mt-4">
          <label htmlFor={`${baseId}-title`} className="mb-2 block text-sm font-medium text-exclusive-dark">
            Section title (H2)
          </label>
          <input
            id={`${baseId}-title`}
            className={adminInputClass}
            value={draft.meta.title}
            onChange={(e) => patchDraft((p) => ({ ...p, meta: { ...p.meta, title: e.target.value } }))}
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${baseId}-blurb`} className="mb-2 block text-sm font-medium text-exclusive-dark">
            Blurb
          </label>
          <textarea
            id={`${baseId}-blurb`}
            rows={3}
            className={`${adminInputClass} resize-y`}
            value={draft.meta.blurb}
            onChange={(e) => patchDraft((p) => ({ ...p, meta: { ...p.meta, blurb: e.target.value } }))}
          />
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-exclusive-dark">Hero carousel</h2>
          <p className="mt-1 text-sm leading-relaxed text-exclusive-muted">
            Same fields as Homepage hero admin — prefer &quot;Full-width image banner&quot; for category art.
          </p>
        </div>

        {draft.heroSlides.map((slide, index) => {
          const s = /** @type {Record<string, unknown>} */ (slide)
          return (
            <div key={`${String(s.id)}-${index}`} className={adminCardClass}>
              <div className={adminCardMetaClass}>
                <span className="text-exclusive-dark/80 dark:text-exclusive-muted">
                  Slide {index + 1}
                </span>
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                  onClick={() => removeHeroSlideAt(index)}
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${baseId}-sid-${editKey}-${index}`}
                    className="mb-2 block text-sm font-medium text-exclusive-dark"
                  >
                    Slide ID
                  </label>
                  <input
                    id={`${baseId}-sid-${editKey}-${index}`}
                    className={adminInputClass}
                    value={String(s.id ?? '')}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        heroSlides: p.heroSlides.map((row, i) =>
                          i === index ? { .../** @type {object} */ (row), id: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-3 pt-8 text-sm font-medium sm:pt-10">
                  <input
                    type="checkbox"
                    checked={Boolean(s.brandApple)}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        heroSlides: p.heroSlides.map((row, i) =>
                          i === index ? { .../** @type {object} */ (row), brandApple: e.target.checked } : row,
                        ),
                      }))
                    }
                    className="h-4 w-4 rounded border-app-border-strong"
                  />
                  Apple-style badge + series row
                </label>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(s.fullBleed)}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      heroSlides: p.heroSlides.map((row, i) =>
                        i === index ? { .../** @type {object} */ (row), fullBleed: e.target.checked } : row,
                      ),
                    }))
                  }
                  className="h-4 w-4 rounded border-app-border-strong"
                />
                Full-width image banner
              </label>

              <div className="mt-4">
                <label
                  htmlFor={`${baseId}-series-${editKey}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Series / badge text {!s.fullBleed ? <span className="text-exclusive-muted">(required)</span> : null}
                </label>
                <input
                  id={`${baseId}-series-${editKey}-${index}`}
                  className={adminInputClass}
                  value={String(s.series ?? '')}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      heroSlides: p.heroSlides.map((row, i) =>
                        i === index ? { .../** @type {object} */ (row), series: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${baseId}-ht1-${editKey}-${index}`}
                    className="mb-2 block text-sm font-medium text-exclusive-dark"
                  >
                    Headline line 1
                  </label>
                  <input
                    id={`${baseId}-ht1-${editKey}-${index}`}
                    className={adminInputClass}
                    value={String(s.titleLine1 ?? '')}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        heroSlides: p.heroSlides.map((row, i) =>
                          i === index ? { .../** @type {object} */ (row), titleLine1: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${baseId}-ht2-${editKey}-${index}`}
                    className="mb-2 block text-sm font-medium text-exclusive-dark"
                  >
                    Headline line 2
                  </label>
                  <input
                    id={`${baseId}-ht2-${editKey}-${index}`}
                    className={adminInputClass}
                    value={String(s.titleLine2 ?? '')}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        heroSlides: p.heroSlides.map((row, i) =>
                          i === index ? { .../** @type {object} */ (row), titleLine2: e.target.value } : row,
                        ),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor={`${baseId}-himg-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Image URL
                </label>
                <input
                  id={`${baseId}-himg-${editKey}-${index}`}
                  className={adminInputClass}
                  value={String(s.image ?? '')}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      heroSlides: p.heroSlides.map((row, i) =>
                        i === index ? { .../** @type {object} */ (row), image: e.target.value } : row,
                      ),
                    }))
                  }
                />
                <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-3 text-sm text-exclusive-muted">
                  <span className="font-medium text-exclusive-dark">Or upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="max-w-full text-sm"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      e.target.value = ''
                      if (!file) return
                      try {
                        const url = await uploadAdminImage(file)
                        patchDraft((p) => ({
                          ...p,
                          heroSlides: p.heroSlides.map((row, i) =>
                            i === index ? { .../** @type {object} */ (row), image: url } : row,
                          ),
                        }))
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Upload failed')
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() => patchDraft((p) => ({ ...p, heroSlides: [...p.heroSlides, emptyHeroSlide()] }))}
        >
          Add hero slide
        </Button>
      </section>

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="font-display text-lg font-semibold text-exclusive-dark">Products grid</h2>
          <p className="mt-1 text-sm leading-relaxed text-exclusive-muted">
            {isSmartWatches
              ? 'IDs must not duplicate homepage sections, cables, batteries, or other smart-watch categories.'
              : 'IDs must not duplicate homepage sections, smart watches, or the other category.'}
          </p>
        </div>

        {draft.products.map((product, index) => (
          <div key={`${product.id}-${index}`} className={adminCardClass}>
            <div className={adminCardMetaClass}>
              <span className="text-exclusive-dark/80 dark:text-exclusive-muted">
                Product {index + 1}
              </span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                onClick={() => removeProductAt(index)}
              >
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-pid-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Product ID
                </label>
                <input
                  id={`${baseId}-pid-${editKey}-${index}`}
                  className={adminInputClass}
                  value={product.id}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) => (i === index ? { ...x, id: e.target.value } : x)),
                    }))
                  }
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-ptitle-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Title
                </label>
                <input
                  id={`${baseId}-ptitle-${editKey}-${index}`}
                  className={adminInputClass}
                  value={product.title}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) => (i === index ? { ...x, title: e.target.value } : x)),
                    }))
                  }
                />
              </div>
            </div>

            {isCables ? (
              <div className="mt-4">
                <label
                  htmlFor={`${baseId}-ctype-${editKey}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Cable menu category
                </label>
                <select
                  id={`${baseId}-ctype-${editKey}-${index}`}
                  className={adminInputClass}
                  value={product.cableType ?? 'usb-c'}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, cableType: e.target.value } : x,
                      ),
                    }))
                  }
                >
                  {cableCategories
                    .filter((c) => c.slug !== 'all')
                    .map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                </select>
                <p className="mt-1.5 text-xs text-exclusive-muted">
                  Matches the Cables dropdown in the header — only this type shows when that menu item is
                  clicked.
                </p>
              </div>
            ) : null}

            {isBatteries ? (
              <div className="mt-4">
                <label
                  htmlFor={`${baseId}-btype-${editKey}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Battery menu category
                </label>
                <select
                  id={`${baseId}-btype-${editKey}-${index}`}
                  className={adminInputClass}
                  value={product.batteryType ?? 'iphone'}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, batteryType: e.target.value } : x,
                      ),
                    }))
                  }
                >
                  {batteryCategories
                    .filter((c) => c.slug !== 'all')
                    .map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                </select>
                <p className="mt-1.5 text-xs text-exclusive-muted">
                  Matches the Batteries dropdown in the header — only this type shows when that menu item is
                  clicked.
                </p>
              </div>
            ) : null}

            {isSmartWatches ? (
              <div className="mt-4">
                <label
                  htmlFor={`${baseId}-wcat-${editKey}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Watch menu category
                </label>
                <select
                  id={`${baseId}-wcat-${editKey}-${index}`}
                  className={adminInputClass}
                  value={product.watchCategory ?? swSlug}
                  onChange={(e) => moveProductWatchCategory(index, e.target.value)}
                >
                  {smartWatchCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-exclusive-muted">
                  Matches the Smart Watches dropdown in the header — product appears on{' '}
                  <span className="font-medium text-exclusive-dark">/smart-watches/…</span> for the chosen
                  category.
                </p>
              </div>
            ) : null}

            <div className="mt-4">
              <label htmlFor={`${baseId}-pimg-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                Image URL
              </label>
              <input
                id={`${baseId}-pimg-${editKey}-${index}`}
                className={adminInputClass}
                value={product.image}
                onChange={(e) =>
                  patchDraft((p) => ({
                    ...p,
                    products: p.products.map((x, i) =>
                      i === index ? { ...x, ...patchProductMainImage(x, e.target.value) } : x,
                    ),
                  }))
                }
              />
              <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-3 text-sm text-exclusive-muted">
                <span className="font-medium text-exclusive-dark">Or upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="max-w-full text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    if (!file) return
                    try {
                      const url = await uploadAdminImage(file)
                      patchDraft((p) => ({
                        ...p,
                        products: p.products.map((x, i) =>
                          i === index ? { ...x, ...patchProductMainImage(x, url) } : x,
                        ),
                      }))
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Upload failed')
                    }
                  }}
                />
              </label>
            </div>

            <AdminProductGalleryFields
              fieldIdPrefix={`${editKey}-p-${index}`}
              gallery={product.gallery}
              image={product.image}
              onChange={(patch) =>
                patchDraft((p) => ({
                  ...p,
                  products: p.products.map((x, i) => (i === index ? { ...x, ...patch } : x)),
                }))
              }
              onError={setError}
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor={`${baseId}-price-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Price
                </label>
                <input
                  id={`${baseId}-price-${editKey}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={String(product.price)}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, price: Number(e.target.value) } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-old-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Old price (optional)
                </label>
                <input
                  id={`${baseId}-old-${editKey}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={product.oldPrice != null ? String(product.oldPrice) : ''}
                  onChange={(e) => {
                    const v = e.target.value
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, oldPrice: v === '' ? undefined : Number(v) } : x,
                      ),
                    }))
                  }}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-disc-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Discount %
                </label>
                <input
                  id={`${baseId}-disc-${editKey}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={product.discount != null ? String(product.discount) : ''}
                  onChange={(e) => {
                    const v = e.target.value
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, discount: v === '' ? undefined : Number(v) } : x,
                      ),
                    }))
                  }}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-rating-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Rating (0–5)
                </label>
                <input
                  id={`${baseId}-rating-${editKey}-${index}`}
                  type="number"
                  min={0}
                  max={5}
                  step={1}
                  className={adminInputClass}
                  value={String(product.rating)}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, rating: Number(e.target.value) } : x,
                      ),
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor={`${baseId}-rev-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Reviews count
                </label>
                <input
                  id={`${baseId}-rev-${editKey}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={String(product.reviews)}
                  onChange={(e) =>
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, reviews: Number(e.target.value) } : x,
                      ),
                    }))
                  }
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-badge-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Badge
                </label>
                <select
                  id={`${baseId}-badge-${editKey}-${index}`}
                  value={product.badge ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    const nextBadge =
                      v === 'new' || v === 'sale' || v === 'sold-out' ? /** @type {'new'|'sale'|'sold-out'} */ (v) : undefined
                    patchDraft((p) => ({
                      ...p,
                      products: p.products.map((x, i) =>
                        i === index ? { ...x, badge: nextBadge } : x,
                      ),
                    }))
                  }}
                  className={adminInputClass}
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="sold-out">Sold Out</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-exclusive-dark">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-app-border-strong text-exclusive-red focus:ring-exclusive-red"
                    checked={Boolean(product.freeShip)}
                    onChange={(e) =>
                      patchDraft((p) => ({
                        ...p,
                        products: p.products.map((x, i) =>
                          i === index ? { ...x, freeShip: e.target.checked ? true : undefined } : x,
                        ),
                      }))
                    }
                  />
                  <span>Free shipping on card</span>
                </label>
                <p className="mt-1.5 text-xs text-exclusive-muted">Shows a “Free ship” tag on the storefront card.</p>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor={`${baseId}-colors-${editKey}-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                Color swatches (comma-separated)
              </label>
              <input
                id={`${baseId}-colors-${editKey}-${index}`}
                className={adminInputClass}
                value={product.colors?.join(', ') ?? ''}
                onChange={(e) =>
                  patchDraft((p) => ({
                    ...p,
                    products: p.products.map((x, i) =>
                      i === index ? { ...x, colors: parseColors(e.target.value) } : x,
                    ),
                  }))
                }
              />
            </div>
          </div>
        ))}
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-app-border-subtle pt-10">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            patchDraft((p) => ({
              ...p,
              products: [
                ...p.products,
                emptyProduct(
                  isCables
                    ? { defaultCableType: 'usb-c' }
                    : isBatteries
                      ? { defaultBatteryType: 'iphone' }
                      : isSmartWatches
                        ? { defaultWatchCategory: swSlug }
                        : undefined,
                ),
              ],
            }))
          }
        >
          Add product
        </Button>
        <Button
          type="button"
          variant="primary"
          className="min-h-11 px-8 font-semibold shadow-md shadow-exclusive-red/20"
          onClick={handleSave}
        >
          Save {saveButtonLabel}
        </Button>
      </div>
    </div>
  )
}
