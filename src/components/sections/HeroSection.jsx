import { useCallback, useEffect, useState } from 'react'
import { useSiteUpdate } from '../../hooks/useSiteUpdate'
import { getHeroSlides } from '../../site/siteStore'

/** @param {{ slide: Record<string, unknown>; shopNowHref: string }} props */
function HeroSlideContent({ slide, shopNowHref }) {
  const showCopy =
    !slide.fullBleed &&
    (slide.series || slide.titleLine1 || slide.titleLine2)

  if (!showCopy) return null

  return (
    <div className="absolute inset-0 z-10 flex items-center">
      <div className="mx-auto flex w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-xl text-white">
        <div className="mb-4 flex items-center gap-2 text-sm">
          {slide.brandApple ? (
            <>
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </span>
              <span>{slide.series}</span>
            </>
          ) : slide.series ? (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide">
              {slide.series}
            </span>
          ) : null}
        </div>
        <h2 className="font-display text-4xl font-semibold leading-[1.1] md:text-5xl lg:text-6xl">
          {slide.titleLine1 ?? 'Promotion'}
          {slide.titleLine2 ? (
            <>
              <br />
              {slide.titleLine2}
            </>
          ) : null}
        </h2>
        <a
          href={shopNowHref}
          className="mt-8 inline-flex items-center gap-2 border-b border-white pb-1 text-base font-medium hover:opacity-90"
        >
          Shop Now <span aria-hidden>→</span>
        </a>
      </div>
      </div>
    </div>
  )
}

/** @param {{ slide: Record<string, unknown>; shopNowHref: string }} props */
function HeroSlidePanel({ slide, shopNowHref }) {
  const src = String(slide.image ?? '')
  const showCopy =
    !slide.fullBleed &&
    (slide.series || slide.titleLine1 || slide.titleLine2)

  return (
    <div className="relative min-h-[clamp(280px,52vw,620px)] w-full overflow-hidden bg-black">
      {src ? (
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute top-1/2 left-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-[center_center]"
          loading="eager"
          draggable={false}
        />
      ) : null}
      {showCopy ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15 md:via-black/45"
          aria-hidden
        />
      ) : null}
      <HeroSlideContent slide={slide} shopNowHref={shopNowHref} />
    </div>
  )
}

/** @param {{ slides?: unknown[]; ariaLabel?: string; shopNowHref?: string }} [props] */
export default function HeroSection({
  slides: slidesProp,
  ariaLabel = 'Featured promotions',
  shopNowHref = '#flash',
} = {}) {
  useSiteUpdate()
  const slides = slidesProp ?? getHeroSlides()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const len = slides.length
  const slideIndex = len > 0 ? active % len : 0
  const activeSlide = slides[slideIndex]

  const go = useCallback(
    (dir) => {
      setActive((i) => (i + dir + len) % len)
    },
    [len],
  )

  useEffect(() => {
    if (paused || !len) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % len)
    }, 5500)
    return () => window.clearInterval(id)
  }, [paused, len])

  if (!len) {
    return (
      <section className="w-full border-b border-app-border-subtle bg-black">
        <div className="flex min-h-[220px] w-full items-center justify-center px-4 py-12 text-center text-sm text-white/60">
          <p>Add hero slides from the admin panel to show the homepage carousel.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      data-hero="true"
      className="relative w-full max-w-none border-b border-app-border-subtle"
      aria-label={ariaLabel}
    >
      <div
        className="relative w-full overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-roledescription="carousel"
      >
        <div
          className="flex w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full max-w-full shrink-0 grow-0 basis-full"
              aria-hidden={activeSlide.id !== slide.id}
            >
              <HeroSlidePanel slide={slide} shopNowHref={shopNowHref} />
            </div>
          ))}
        </div>

        {len > 1 ? (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-3 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25 md:left-6 md:flex"
              aria-label="Previous slide"
              onClick={() => go(-1)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25 md:right-6 md:flex"
              aria-label="Next slide"
              onClick={() => go(1)}
            >
              <ChevronRight />
            </button>

            <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  className={[
                    'h-2 rounded-full transition-all',
                    i === slideIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70',
                  ].join(' ')}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === slideIndex}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

function ChevronLeft() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
