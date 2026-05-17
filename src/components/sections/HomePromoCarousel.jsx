import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { homePromoSlides } from '../../data/homePromoSlides'
import { cn } from '../../utils/cn'

/** Premium product-card carousel (Brand promo row on the home page). */
export function HomePromoCarousel() {
  return (
    <>
      <div className="relative mx-auto max-w-[1440px] overflow-hidden px-4 sm:px-5 lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          centeredSlides
          loop
          speed={650}
          spaceBetween={16}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 12 },
            480: { slidesPerView: 1.05, spaceBetween: 14 },
            768: { slidesPerView: 1.35, spaceBetween: 16 },
            1024: { slidesPerView: 1.85, spaceBetween: 16 },
            1280: { slidesPerView: 2.2, spaceBetween: 16 },
          }}
          pagination={{ clickable: true, dynamicBullets: false }}
          navigation
          className={cn(
            'home-promo-swiper overflow-hidden pb-12',
            '[--swiper-pagination-bullet-horizontal-gap:6px]',
          )}
        >
          {homePromoSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="!h-auto py-3">
              <PromoCard slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <p className="sr-only">
        Carousel of featured headphone and earbud products. Use arrows or swipe to browse.
      </p>
    </>
  )
}

/** @param {{ slide: (typeof homePromoSlides)[number] }} props */
function PromoCard({ slide }) {
  const darkCard = slide.id !== 'glacier'

  const textMain = darkCard ? 'text-white' : 'text-neutral-950'
  const textMuted = darkCard ? 'text-white/65' : 'text-neutral-600'
  const tagClass = darkCard
    ? 'border-white/35 text-white/90 hover:bg-white/10'
    : 'border-fuchsia-500/40 text-fuchsia-950 hover:bg-fuchsia-500/10'

  return (
    <article
      className={cn(
        slide.bgClass,
        'relative isolate flex min-h-[min(72vw,340px)] flex-col overflow-hidden rounded-[1.75rem]',
        'shadow-[0_24px_64px_-20px_rgba(0,0,0,0.45)] sm:min-h-[320px] md:flex-row md:items-stretch',
        'outline outline-1 -outline-offset-1 outline-white/5',
      )}
    >
      <div className="relative z-20 flex flex-1 flex-col justify-end gap-3 p-6 sm:p-8 md:justify-center md:py-10 md:pr-4 md:pl-10 lg:gap-4">
        {slide.badge ? (
          <div
            className={cn(
              'inline-flex w-fit max-w-[95%] items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px]',
              darkCard
                ? 'border-white/35 bg-black/35 text-white'
                : 'border-neutral-900/90 bg-neutral-900 text-white',
            )}
          >
            {slide.badgeAccent ? (
              <span
                className="h-1.5 w-1.5 rounded-full bg-exclusive-red shadow-[0_0_10px_rgb(219,68,68)]"
                aria-hidden
              />
            ) : null}
            {slide.badge}
          </div>
        ) : null}

        {slide.model ? (
          <p className={cn('text-[11px] font-medium tracking-[0.2em]', textMuted)}>{slide.model}</p>
        ) : null}

        <h2
          className={cn(
            'font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-[2.85rem]',
            slide.titleGradient
              ? 'bg-gradient-to-r from-violet-700 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent'
              : textMain,
          )}
        >
          {slide.title}
        </h2>

        <div className="flex flex-wrap gap-2">
          {slide.tags.map((tag) =>
            slide.id === 'eminence' ? (
              <span
                key={tag}
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-semibold',
                  darkCard ? 'border-white/40 text-white' : '',
                )}
              >
                {tag}
              </span>
            ) : (
              <span
                key={tag}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[10px] font-medium sm:text-[11px]',
                  tagClass,
                )}
              >
                {tag}
              </span>
            ),
          )}
        </div>

        <Link
          to="/#explore-products"
          className={cn(
            'group mt-1 inline-flex w-fit items-center gap-2 border-b pb-1 text-sm font-semibold transition',
            darkCard ? 'border-white/50 text-white' : 'border-neutral-800 text-neutral-900',
          )}
        >
          Shop now{' '}
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      <div
        className={cn(
          'relative flex flex-[1.05] items-end justify-center overflow-hidden md:justify-end md:pr-6 md:pl-4',
          'min-h-[200px] sm:min-h-[240px] md:min-h-0',
        )}
      >
        <div
          className={cn(
            'relative h-full min-h-[200px] w-full overflow-hidden md:min-h-[280px]',
            slide.imageOverlap && 'pointer-events-none',
          )}
        >
          <img
            src={slide.image}
            alt=""
            className={cn(
              'absolute right-0 bottom-0 h-full max-h-[115%] w-auto max-w-full object-contain object-bottom object-right drop-shadow-[0_28px_55px_rgba(0,0,0,0.38)]',
              slide.id === 'glacier' &&
                'drop-shadow-[0_24px_50px_rgba(112,26,117,0.22)] contrast-[1.02]',
            )}
            loading={slide.id === 'magnus' ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-24 rounded-t-[1.75rem] bg-gradient-to-b from-white/[0.07] to-transparent opacity-70 md:inset-x-6"
        aria-hidden
      />
    </article>
  )
}
