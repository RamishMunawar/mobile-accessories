import { useState } from 'react'
import { getSession } from '../../auth/mockAuth'
import { useReviews } from '../../context/ReviewsContext'
import { Button } from '../ui/Button'
import { IconStar } from '../ui/Icons'

/**
 * @param {{ productId: string; productTitle: string; compact?: boolean; onSuccess?: () => void; className?: string }} props
 */
export default function ProductReviewForm({
  productId,
  productTitle,
  compact = false,
  onSuccess,
  className = '',
}) {
  const { addReview } = useReviews()
  const session = getSession()
  const [name, setName] = useState(session?.name ?? '')
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const ok = addReview({ productId, productTitle, name, rating, body })
    if (!ok) {
      setError('Please enter your name and a review message.')
      return
    }
    setBody('')
    setSubmitted(true)
    if (compact) {
      setTimeout(() => {
        onSuccess?.()
        setSubmitted(false)
      }, 2200)
    } else {
      onSuccess?.()
      setTimeout(() => setSubmitted(false), 4000)
    }
  }

  const starSize = compact ? 'h-5 w-5' : 'h-7 w-7'

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        'rounded-lg border border-app-border bg-app-muted/40',
        compact ? 'p-4' : 'max-w-2xl rounded-xl bg-app-card p-6 shadow-sm',
        className,
      ].join(' ')}
    >
      {!compact ? (
        <>
          <h3 className="text-lg font-semibold text-exclusive-dark">Write a review</h3>
          <p className="mt-1 text-sm text-exclusive-muted">
            Share your experience with {productTitle}. Your review will appear on the home page.
          </p>
        </>
      ) : (
        <p className="text-sm font-medium text-exclusive-dark">Review {productTitle}</p>
      )}

      <label className={compact ? 'mt-3 block text-xs font-medium' : 'mt-6 block text-sm font-medium'}>
        Your rating
        <div className="mt-1.5 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => {
            const value = i + 1
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="rounded p-0.5 text-[#FFAD33] transition hover:scale-110"
                aria-label={`Rate ${value} out of 5`}
              >
                <IconStar className={starSize} filled={value <= rating} />
              </button>
            )
          })}
        </div>
      </label>

      <label className={compact ? 'mt-3 block text-xs font-medium' : 'mt-5 block text-sm font-medium'}>
        Your name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-app-border-strong bg-app-bg px-3 py-2 text-sm outline-none focus:border-exclusive-red"
          placeholder="Your name"
        />
      </label>

      <label className={compact ? 'mt-3 block text-xs font-medium' : 'mt-5 block text-sm font-medium'}>
        Your review
        <textarea
          required
          rows={compact ? 2 : 4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1.5 w-full resize-y rounded-lg border border-app-border-strong bg-app-bg px-3 py-2 text-sm outline-none focus:border-exclusive-red"
          placeholder="What did you like about this product?"
        />
      </label>

      {error ? <p className="mt-2 text-sm text-exclusive-red">{error}</p> : null}
      {submitted ? (
        <p className="mt-2 text-sm font-medium text-exclusive-green">
          Thank you! Your review has been published.
        </p>
      ) : null}

      <Button type="submit" variant="primary" size={compact ? 'sm' : 'md'} className={compact ? 'mt-3' : 'mt-6'}>
        Submit review
      </Button>
    </form>
  )
}
