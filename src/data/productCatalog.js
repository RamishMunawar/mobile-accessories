import { getMergedProducts, getMergedCablesPage, getMergedBatteriesPage, getMergedSmartWatchProductsFlat } from '../site/siteStore'

/** @returns {import('./products').Product[]} */
export function listProducts() {
  const { flash, best, explore } = getMergedProducts()
  const { products: cables } = getMergedCablesPage()
  const { products: batteries } = getMergedBatteriesPage()
  return [...flash, ...best, ...explore, ...getMergedSmartWatchProductsFlat(), ...cables, ...batteries]
}

/** @returns {Record<string, import('./products').Product>} */
export function getProductIndex() {
  return Object.fromEntries(listProducts().map((p) => [p.id, p]))
}

/** @param {string} id @param {number} limit */
export function relatedProducts(id, limit = 4) {
  return listProducts()
    .filter((p) => p.id !== id)
    .slice(0, limit)
}
