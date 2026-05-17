export default function SectionHeading({
  eyebrow,
  title,
  action,
  className = '',
}) {
  return (
    <div
      className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
        <div className="flex items-center gap-4">
          <span className="h-10 w-1.5 shrink-0 rounded-sm bg-exclusive-red" aria-hidden />
          <div>
            {eyebrow ? (
              <p className="text-base font-semibold text-exclusive-red">{eyebrow}</p>
            ) : null}
            <h2
              className={`font-display text-3xl font-semibold tracking-tight md:text-4xl ${eyebrow ? 'mt-1' : ''}`}
            >
              {title}
            </h2>
          </div>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
