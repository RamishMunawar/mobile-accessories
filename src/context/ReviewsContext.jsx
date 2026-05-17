import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  persistProductReviews,
  PRODUCT_REVIEWS_STORAGE_KEY,
  readProductReviewsFromStorage,
} from '../utils/productReviewsStorage'
import { averageRating } from '../utils/reviewHelpers'

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => readProductReviewsFromStorage())

  useEffect(() => {
    const sync = (e) => {
      if (e.key != null && e.key !== PRODUCT_REVIEWS_STORAGE_KEY) return
      setReviews(readProductReviewsFromStorage())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    persistProductReviews(reviews)
  }, [reviews])

  const addReview = useCallback(({ productId, productTitle, name, rating, body }) => {
    const trimmedName = (name ?? '').trim()
    const trimmedBody = (body ?? '').trim()
    const r = Math.min(5, Math.max(1, Math.round(Number(rating))))
    if (!productId || !trimmedName || !trimmedBody) return false

    const entry = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId,
      productTitle: productTitle ?? '',
      name: trimmedName,
      rating: r,
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    }

    setReviews((prev) => [entry, ...prev])
    return true
  }, [])

  const getReviewsForProduct = useCallback(
    (productId) =>
      reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [reviews],
  )

  const sortedAll = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [reviews],
  )

  const getReviewCountForProduct = useCallback(
    (productId) => reviews.filter((r) => r.productId === productId).length,
    [reviews],
  )

  const stats = useMemo(() => {
    const ratings = reviews.map((r) => r.rating)
    return {
      count: reviews.length,
      average: averageRating(ratings),
    }
  }, [reviews])

  const value = useMemo(
    () => ({
      reviews: sortedAll,
      addReview,
      getReviewsForProduct,
      getReviewCountForProduct,
      stats,
    }),
    [sortedAll, addReview, getReviewsForProduct, getReviewCountForProduct, stats],
  )

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) {
    throw new Error('useReviews must be used within ReviewsProvider')
  }
  return ctx
}
