import { useReviews } from '../../context/ReviewsContext'
import ReviewCard from '../reviews/ReviewCard'
import { formatReviewDate, getReviewInitials } from '../../utils/reviewHelpers'
import ProductReviewForm from './ProductReviewForm'

export default function ProductReviewsPanel({ productId, productTitle }) {
  const { getReviewsForProduct } = useReviews()
  const productReviews = getReviewsForProduct(productId)

  return (
    <div className="space-y-10">
      <ProductReviewForm productId={productId} productTitle={productTitle} />

      <div>
        <h3 className="mb-4 text-lg font-semibold text-exclusive-dark">
          Customer reviews ({productReviews.length})
        </h3>
        {productReviews.length === 0 ? (
          <p className="text-sm text-exclusive-muted">
            No reviews for this product yet. Be the first to share your feedback.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {productReviews.map((r) => (
              <ReviewCard
                key={r.id}
                name={r.name}
                initials={getReviewInitials(r.name)}
                date={formatReviewDate(r.createdAt)}
                rating={r.rating}
                body={r.body}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
