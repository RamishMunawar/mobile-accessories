import Stars from '../ui/Stars'

export default function ReviewCard({ name, initials, date, rating, body, productTitle }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-white dark:bg-neutral-600"
            aria-hidden
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-exclusive-dark">{name}</p>
            <p className="text-xs text-exclusive-muted">{date}</p>
          </div>
        </div>
        <Stars rating={rating} className="shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5" />
      </div>

      {productTitle ? (
        <p className="mt-2 truncate text-xs font-medium text-exclusive-red">{productTitle}</p>
      ) : null}

      <p className="mt-3 flex-1 text-sm leading-relaxed text-exclusive-dark/90">{body}</p>

      <div className="mt-5 flex items-center justify-end gap-2 text-xs text-exclusive-muted">
        <span>Was this review helpful?</span>
        <button
          type="button"
          className="rounded p-1 text-exclusive-muted transition hover:bg-app-muted hover:text-exclusive-dark"
          aria-label="Mark review as helpful"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M7 11v10M7 11l-4-1.5V8l4-1.5V4a2 2 0 012-2h4.5a2 2 0 011.9 1.4L17 11h4l-1 7h-6l-1 7H9v-7H7z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}
