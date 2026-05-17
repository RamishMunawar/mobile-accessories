/** @param {string} name */
export function getReviewInitials(name) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

/** @param {string} iso */
export function formatReviewDate(iso) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

/** @param {number} count */
export function formatReviewCountLabel(count) {
  if (count >= 1000) return `${Math.floor(count / 1000)}k+ Reviews`
  if (count === 1) return '1 Review'
  return `${count} Reviews`
}

/** @param {number[]} ratings */
export function averageRating(ratings) {
  if (!ratings.length) return 0
  const sum = ratings.reduce((a, b) => a + b, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

/**
 * Combines catalog rating/count with live user reviews for product headers & cards.
 * @param {{ rating: number }[]} userReviews
 */
export function mergeProductRating(catalogRating, catalogReviewCount, userReviews) {
  const userCount = userReviews.length
  const catalogCount = Math.max(0, Number(catalogReviewCount) || 0)
  const totalCount = catalogCount + userCount

  if (totalCount === 0) {
    return { rating: Number(catalogRating) || 0, reviewCount: 0 }
  }

  const catalogSum = (Number(catalogRating) || 0) * catalogCount
  const userSum = userReviews.reduce((sum, r) => sum + r.rating, 0)
  const rating = Math.round(((catalogSum + userSum) / totalCount) * 10) / 10

  return { rating, reviewCount: totalCount }
}

/** @param {number} count */
export function formatReviewCountShort(count) {
  if (count === 1) return '1 Review'
  return `${count} Reviews`
}
