import { SMART_WATCH_CATEGORY_SLUGS, smartWatchCategoryMeta } from './smartWatchProducts'

/** @typedef {{ slug: string; label: string; to: string }} SmartWatchCategory */

/** @type {SmartWatchCategory[]} — matches header Smart Watches dropdown. */
export const smartWatchCategories = SMART_WATCH_CATEGORY_SLUGS.map((slug) => ({
  slug,
  label: smartWatchCategoryMeta[slug]?.title ?? slug,
  to: `/smart-watches/${slug}`,
}))

/** @param {string | null | undefined} slug */
export function normalizeWatchCategorySlug(slug) {
  const s = (slug ?? '').trim().toLowerCase()
  return SMART_WATCH_CATEGORY_SLUGS.includes(/** @type {typeof SMART_WATCH_CATEGORY_SLUGS[number]} */ (s))
    ? s
    : SMART_WATCH_CATEGORY_SLUGS[0]
}

/** @param {string | null | undefined} slug */
export function getSmartWatchCategoryLabel(slug) {
  const key = normalizeWatchCategorySlug(slug)
  return smartWatchCategoryMeta[key]?.title ?? key
}
