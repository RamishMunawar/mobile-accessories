/** Full-bleed hero carousel — same slide shape as {@link ../cableProducts.js cablesHeroSlides}. */
export const smartWatchesHeroSlides = []

/** @type {Record<string, { title: string; blurb: string }>} */
export const smartWatchCategoryMeta = {
  amoled: {
    title: 'Amoled + AOD Smart Watches',
    blurb: 'Vivid always-on displays and power-smart AMOLED panels for clarity indoors and out.',
  },
  round: {
    title: 'Round Dial Smart Watches',
    blurb: 'Classic circular faces with modern sensors — timeless style, smart features.',
  },
  square: {
    title: 'Square Dial Smart Watches',
    blurb: 'Bold square silhouettes with maximized touch area for apps and notifications.',
  },
  leather: {
    title: 'Leather Strap Smart Watches',
    blurb: 'Premium leather bands that age beautifully — workdays to weekends.',
  },
  metallic: {
    title: 'Metallic Strap Smart Watches',
    blurb: 'Stainless link bracelets with a jewelry-grade finish.',
  },
  silicon: {
    title: 'Silicon Strap Smart Watches',
    blurb: 'Lightweight, sweat-ready straps built for training and daily wear.',
  },
  luxury: {
    title: 'Luxury Smart Watches',
    blurb: 'Flagship materials, refined cases, and standout craftsmanship.',
  },
}

export const SMART_WATCH_CATEGORY_SLUGS = /** @type {const} */ ([
  'amoled',
  'round',
  'square',
  'leather',
  'metallic',
  'silicon',
  'luxury',
])

/** @param {string} slug */
export function isSmartWatchCategorySlug(slug) {
  return SMART_WATCH_CATEGORY_SLUGS.includes(/** @type {typeof SMART_WATCH_CATEGORY_SLUGS[number]} */ (slug))
}

/** @type {Record<string, import('./products').Product[]>} */
export const smartWatchesByCategory = Object.fromEntries(
  SMART_WATCH_CATEGORY_SLUGS.map((slug) => [slug, []]),
)
