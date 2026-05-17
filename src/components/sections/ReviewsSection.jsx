import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReviews } from '../../context/ReviewsContext'
import { reviewCategories } from '../../data/homeReviews'
import ReviewCard from '../reviews/ReviewCard'
import { formatReviewCountLabel, formatReviewDate, getReviewInitials } from '../../utils/reviewHelpers'

function LaurelWreath({ className = '' }) {
  return (
    <svg viewBox="0 0 48 64" fill="none" aria-hidden className={className}>
      <path
        d="M24 4c-6 8-14 12-14 22 0 6 4 10 8 12-2-6 2-14 10-18-8 4-12 12-10 18 4-2 8-6 8-12 0-10-8-14-14-22z"
        fill="#C9A227"
        opacity="0.9"
      />
      <path
        d="M8 52c4-8 10-12 16-12s12 4 16 12"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CategoryIcon({ type }) {
  const cn = 'h-7 w-7 text-neutral-700 dark:text-neutral-300'
  if (type === 'content') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cn} aria-hidden>
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'teaching') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cn} aria-hidden>
        <rect x="3" y="5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18M9 5v12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 14.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'platform') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cn} aria-hidden>
        <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 20h8M12 17v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn} aria-hidden>
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const PREVIEW_COUNT = 8

export default function ReviewsSection() {
  const { reviews, stats } = useReviews()
  const [showAll, setShowAll] = useState(false)

  if (reviews.length === 0) return null

  const score = stats.average || 0
  const totalLabel = formatReviewCountLabel(stats.count)
  const visibleReviews = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT)
  const categoryScore = score || 0

  return (
    <section
      id="reviews"
      className="scroll-mt-28 border-t border-app-border-subtle bg-app-bg py-14 lg:py-20"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <LaurelWreath className="h-14 w-10 rotate-180 scale-x-[-1] sm:h-16 sm:w-11" />
            <div>
              <p
                id="reviews-heading"
                className="font-sans text-4xl font-bold tracking-tight text-exclusive-dark sm:text-5xl"
              >
                {score}{' '}
                <span className="text-2xl font-semibold text-exclusive-muted sm:text-3xl">/ 5</span>
              </p>
              <p className="mt-1 text-sm text-exclusive-muted sm:text-base">{totalLabel}</p>
            </div>
            <LaurelWreath className="h-14 w-10 sm:h-16 sm:w-11" />
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-6 sm:gap-0 sm:divide-x sm:divide-app-border">
            {reviewCategories.map(({ label, icon }) => (
              <div
                key={label}
                className="flex min-w-[5.5rem] flex-col items-center px-6 sm:px-10"
              >
                <CategoryIcon type={icon} />
                <p className="mt-2 text-sm font-medium text-exclusive-dark">{label}</p>
                <p className="mt-0.5 text-sm text-exclusive-muted">
                  <span className="font-semibold text-exclusive-dark">{categoryScore}</span>/5
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-[#F5F0E8] px-5 py-5 dark:bg-amber-950/30 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold text-exclusive-dark sm:text-xl">
                What customers are saying
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-exclusive-muted">
                Real reviews from shoppers who purchased products on our store.
              </p>
            </div>
            <p className="flex shrink-0 items-center gap-1.5 text-xs text-exclusive-muted sm:text-sm">
              <span className="inline-flex text-sky-500" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm6 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm-9 5l.8 2.2L12 19l-2.2-.8L9 16l2.2-.8L12 13l.8 2.2L15 16l-2.2.8L12 19l-.8-2.2L9 16z" />
                </svg>
              </span>
              Verified customer reviews
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            to="/#explore-products"
            className="inline-flex items-center gap-2 rounded-lg border border-app-border-strong bg-app-card px-4 py-2.5 text-sm font-medium text-exclusive-dark shadow-sm transition hover:bg-app-muted"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Review a product
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.name}
              initials={getReviewInitials(review.name)}
              date={formatReviewDate(review.createdAt)}
              rating={review.rating}
              body={review.body}
              productTitle={review.productTitle}
            />
          ))}
        </div>

        {reviews.length > PREVIEW_COUNT ? (
          <p className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-base font-medium text-exclusive-red transition hover:underline"
            >
              {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
            </button>
          </p>
        ) : null}
      </div>
    </section>
  )
}
