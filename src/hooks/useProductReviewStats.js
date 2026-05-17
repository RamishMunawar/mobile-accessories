import { useMemo } from 'react'
import { useReviews } from '../context/ReviewsContext'
import { mergeProductRating } from '../utils/reviewHelpers'

/** Live rating + review count for a product (catalog + user submissions). */
export function useProductReviewStats(productId, catalogRating = 0, catalogReviewCount = 0) {
  const { getReviewsForProduct } = useReviews()

  return useMemo(() => {
    const userReviews = productId ? getReviewsForProduct(productId) : []
    return mergeProductRating(catalogRating, catalogReviewCount, userReviews)
  }, [productId, catalogRating, catalogReviewCount, getReviewsForProduct])
}
