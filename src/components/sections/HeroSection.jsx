import { useCallback, useEffect, useState } from 'react'
import { useSiteUpdate } from '../../hooks/useSiteUpdate'
import { getHeroSlides } from '../../site/siteStore'

function HeroSlideImage({ src }) {
  return (
    <div className="relative flex max-h-[340px] min-h-[220px] flex-1 items-center justify-center overflow-hidden md:max-h-[380px]">
      <img
        src={src}
        alt=""
        className="relative z-10 max-h-[280px] w-auto max-w-full object-contain drop-shadow-2xl select-none md:max-h-[340px]"
        loading="eager"
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(219,68,68,0.35),transparent_55%)]"
        aria-hidden
      />
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
      <section className="border-b border-app-border-subtle bg-black/90">
        <div className="mx-auto flex min-h-[220px] max-w-[1440px] items-center justify-center px-4 py-12 text-center text-sm text-white/60">
          <p>Add hero slides from the admin panel to show the homepage carousel.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-app-border-subtle">
      <div className="w-full max-w-none px-0">
        <div
          className="relative w-full max-w-none overflow-hidden bg-black"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
        >
          <div
            className="flex w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="max-w-full min-w-0 shrink-0 grow-0 basis-full"
                aria-hidden={activeSlide.id !== slide.id}
              >
                {slide.fullBleed ? (
                  <div className="relative isolate aspect-[820/312] min-h-[200px] w-full bg-black md:min-h-[240px]">
                    <img
                      src={slide.image}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full min-w-full bg-black object-cover object-center"
                      loading="eager"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-8 md:grid-cols-2 md:px-8 md:py-12 lg:px-10">
                    <div className="relative z-10 max-w-md text-white">
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
                        ) : (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                            {slide.series}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                        {slide.titleLine1 ?? 'Promotion'}
                        <br />
                        {slide.titleLine2 ?? ''}
                      </h2>
                      <a
                        href={shopNowHref}
                        className="mt-8 inline-flex items-center gap-2 border-b border-white pb-1 text-base font-medium hover:opacity-90"
                      >
                        Shop Now <span aria-hidden>→</span>
                      </a>
                    </div>
                    <div className="relative flex justify-center md:justify-end">
                      <HeroSlideImage key={slide.id} src={slide.image} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="absolute top-1/2 left-2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25 md:flex"
            aria-label="Previous slide"
            onClick={() => go(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/25 md:flex"
            aria-label="Next slide"
            onClick={() => go(1)}
          >
            <ChevronRight />
          </button>

          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
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
        </div>
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
