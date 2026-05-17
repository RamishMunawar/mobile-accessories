import { Link } from 'react-router-dom'
import { useCountdown } from '../../hooks/useCountdown'
import { usePromoBanner } from '../../hooks/usePromoBanner'
import { ButtonLink } from '../ui/Button'
import CountdownStrip from '../ui/CountdownStrip'

function PromoLink({ href, className, children }) {
  const h = (href ?? '').trim()
  if (h.startsWith('/') && !h.startsWith('//')) {
    return (
      <Link to={h} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={h || '#'}
      className={className}
      {...(h.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export default function PromoBannerSection() {
  const promo = usePromoBanner()
  const cd = useCountdown(promo.countdownEndsAt)

  if (!promo.enabled || !promo.titleLine1) return null

  return (
    <section className="py-8 lg:py-12" aria-labelledby="music-promo-heading">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          <div
            className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-exclusive-red/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-exclusive-green/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(255,255,255,0.06),transparent)]"
            aria-hidden
          />

          <div className="relative grid items-center gap-10 p-8 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(220px,1fr)] md:gap-8 lg:p-14">
            <div className="flex flex-col justify-center">
              {promo.eyebrow ? (
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-exclusive-green/40 bg-exclusive-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-exclusive-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-exclusive-green shadow-[0_0_8px_var(--color-exclusive-green)]" />
                  {promo.eyebrow}
                </span>
              ) : null}

              <h2
                id="music-promo-heading"
                className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              >
                {promo.titleLine1}
                {promo.titleLine2 ? (
                  <span className="mt-1 block text-white/90">{promo.titleLine2}</span>
                ) : null}
              </h2>

              {promo.description ? (
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                  {promo.description}
                </p>
              ) : null}

              <CountdownStrip parts={cd} theme="dark" className="my-8" />

              <div className="flex flex-wrap items-center gap-4">
                <ButtonLink
                  to={promo.ctaHref}
                  variant="accent"
                  size="md"
                  className="px-10 shadow-[0_8px_28px_-6px_rgba(0,255,102,0.45)]"
                >
                  {promo.ctaLabel}
                </ButtonLink>
                {promo.secondaryLabel ? (
                  <PromoLink
                    href={promo.secondaryHref}
                    className="text-sm font-medium text-white/70 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {promo.secondaryLabel}
                  </PromoLink>
                ) : null}
              </div>
            </div>

            {promo.image ? (
              <div className="relative mx-auto flex w-full max-w-sm items-center justify-center md:max-w-none md:justify-end">
                <div
                  className="absolute inset-4 rounded-full bg-exclusive-red/20 blur-2xl"
                  aria-hidden
                />
                <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
                  <div
                    className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent"
                    aria-hidden
                  />
                  <img
                    src={promo.image}
                    alt=""
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_28px_48px_rgba(219,68,68,0.35)]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
