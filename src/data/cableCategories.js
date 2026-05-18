/** @typedef {{ slug: string; label: string }} CableCategory */

/** @type {CableCategory[]} */
export const cableCategories = [
  { slug: 'usb-c', label: 'USB-C Cables' },
  { slug: 'lightning', label: 'Lightning Cables' },
  { slug: 'micro-usb', label: 'Micro USB Cables' },
  { slug: 'fast-charge', label: 'Fast Charging Cables' },
  { slug: 'braided', label: 'Braided Cables' },
  { slug: 'aux', label: 'Aux / Audio Cables' },
  { slug: 'all', label: 'All Cables' },
]

/** @param {string | null | undefined} slug */
export function normalizeCableTypeSlug(slug) {
  const s = (slug ?? '').trim().toLowerCase()
  if (!s || s === 'all') return 'all'
  return cableCategories.some((c) => c.slug === s) ? s : 'all'
}

/** @param {string | null | undefined} slug */
export function getCableCategoryLabel(slug) {
  const key = normalizeCableTypeSlug(slug)
  return cableCategories.find((c) => c.slug === key)?.label ?? 'All Cables'
}

/**
 * @param {import('./products').Product[]} products
 * @param {string | null | undefined} typeSlug
 */
export function filterCablesByType(products, typeSlug) {
  const type = normalizeCableTypeSlug(typeSlug)
  if (type === 'all') return products
  return products.filter((p) => p.cableType === type)
}
