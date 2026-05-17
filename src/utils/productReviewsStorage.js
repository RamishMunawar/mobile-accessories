const STORAGE_KEY = 'exclusive-product-reviews'

/** @typedef {{ id: string; productId: string; productTitle: string; name: string; rating: number; body: string; createdAt: string }} StoredProductReview */

/** @returns {StoredProductReview[]} */
export function readProductReviewsFromStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r) =>
        r &&
        typeof r.id === 'string' &&
        typeof r.productId === 'string' &&
        typeof r.name === 'string' &&
        typeof r.body === 'string' &&
        typeof r.rating === 'number' &&
        typeof r.createdAt === 'string',
    )
  } catch {
    return []
  }
}

/** @param {StoredProductReview[]} reviews */
export function persistProductReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  } catch {
    /* ignore */
  }
}

export const PRODUCT_REVIEWS_STORAGE_KEY = STORAGE_KEY
