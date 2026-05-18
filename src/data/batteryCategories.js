/** @typedef {{ slug: string; label: string }} BatteryCategory */

/** @type {BatteryCategory[]} */
export const batteryCategories = [
  { slug: 'iphone', label: 'iPhone Batteries' },
  { slug: 'samsung', label: 'Samsung Batteries' },
  { slug: 'vivo', label: 'Vivo Batteries' },
  { slug: 'oppo', label: 'OPPO Batteries' },
  { slug: 'tecno', label: 'Tecno Batteries' },
  { slug: 'infinix', label: 'Infinix Batteries' },
  { slug: 'xiaomi-redmi', label: 'Xiaomi Redmi Batteries' },
  { slug: 'huawei', label: 'Huawei Batteries' },
  { slug: 'all', label: 'All Batteries' },
]

/** @param {string | null | undefined} slug */
export function normalizeBatteryTypeSlug(slug) {
  const s = (slug ?? '').trim().toLowerCase()
  if (!s || s === 'all') return 'all'
  return batteryCategories.some((c) => c.slug === s) ? s : 'all'
}

/** @param {string | null | undefined} slug */
export function getBatteryCategoryLabel(slug) {
  const key = normalizeBatteryTypeSlug(slug)
  return batteryCategories.find((c) => c.slug === key)?.label ?? 'All Batteries'
}

/**
 * @param {import('./products').Product[]} products
 * @param {string | null | undefined} typeSlug
 */
export function filterBatteriesByType(products, typeSlug) {
  const type = normalizeBatteryTypeSlug(typeSlug)
  if (type === 'all') return products
  return products.filter((p) => p.batteryType === type)
}
