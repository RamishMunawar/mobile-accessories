import { useRef, useEffect, useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

const defaultItems = [
  {
    id: 1,
    title: 'Active Wear Innovation',
    brand: 'Nike',
    description:
      'Integrating flexible sensors into performance gear to monitor muscle fatigue and heart rate in real-time.',
    tags: ['Sports', 'Health', 'IoT'],
    imageUrl:
      'https://images.unsplash.com/photo-1515243061678-14fc18b93935?q=80&w=2940&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 2,
    title: 'Smart Ergonomics',
    brand: 'Herman Miller',
    description:
      'Pressure-sensitive fabrics in office chairs that analyze posture and suggest adjustments for optimal health.',
    tags: ['Office', 'Health', 'Furniture'],
    imageUrl:
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2938&auto=format&fit=crop',
    link: '#',
  },
  {
    id: 3,
    title: 'Automotive Comfort',
    brand: 'Tesla',
    description:
      'Intelligent car seats that adapt to passenger position and monitor vital signs for enhanced safety.',
    tags: ['Auto', 'Safety', 'Smart'],
    imageUrl:
      'https://images.unsplash.com/photo-1561580125-028ce3bfcb25?q=80&w=2940&auto=format&fit=crop',
    link: '#',
  },
]

function ChevronLeftIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function ArrowRightIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default function ThreeDCarousel({
  items = defaultItems,
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 500,
  isMobileSwipe = true,
}) {
  const [active, setActive] = useState(0)
  const carouselRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const isMobile = useIsMobile()
  const minSwipeDistance = 50

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length)
      }, rotateInterval)
      return () => clearInterval(interval)
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.2,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const onTouchStart = (e) => {
    if (!isMobileSwipe) return
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
  }

  const onTouchMove = (e) => {
    if (!isMobileSwipe) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length)
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length)
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const getCardAnimationClass = (index) => {
    if (index === active) return 'scale-100 opacity-100 z-20'
    if (index === (active + 1) % items.length) return 'translate-x-[40%] scale-95 opacity-60 z-10'
    if (index === (active - 1 + items.length) % items.length)
      return 'translate-x-[-40%] scale-95 opacity-60 z-10'
    return 'scale-90 opacity-0'
  }

  return (
    <section
      id="ThreeDCarousel"
      className="mx-auto flex w-full max-w-full items-center justify-center overflow-x-clip bg-transparent"
    >
      <div className="w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div
          className="relative h-[550px] overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(index)}`}
              >
                <div
                  className="flex flex-col overflow-hidden rounded-lg border border-app-border-subtle bg-app-card shadow-sm hover:shadow-md"
                  style={{ minHeight: cardHeight }}
                >
                  <div
                    className="relative flex h-48 items-center justify-center overflow-hidden bg-black p-6"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 text-center text-white">
                      <h3 className="mb-2 text-2xl font-bold">{item.brand.toUpperCase()}</h3>
                      <div className="mx-auto mb-2 h-1 w-12 bg-white" />
                      <p className="text-sm">{item.title}</p>
                    </div>
                  </div>

                  <div className="flex flex-grow flex-col p-6">
                    <h3 className="mb-1 text-xl font-bold text-exclusive-dark">{item.title}</h3>
                    <p className="mb-2 text-sm font-medium text-exclusive-muted">{item.brand}</p>
                    <p className="flex-grow text-sm text-exclusive-muted">{item.description}</p>

                    <div className="mt-4">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="animate-pulse-slow rounded-full bg-app-muted px-2 py-1 text-xs text-exclusive-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={item.link}
                        className="group relative flex items-center text-exclusive-muted hover:underline"
                        onClick={() => {
                          if (item.link.startsWith('/')) {
                            window.scrollTo(0, 0)
                          }
                        }}
                      >
                        <span className="relative z-10">Learn more</span>
                        <ArrowRightIcon className="relative z-10 ml-2 transition-transform group-hover:translate-x-1" />
                        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-exclusive-muted transition-all duration-300 group-hover:w-full" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isMobile && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-exclusive-muted shadow-md transition-all hover:scale-110 hover:bg-white"
                onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)}
                aria-label="Previous"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-exclusive-muted shadow-md transition-all hover:scale-110 hover:bg-white"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center space-x-3">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === idx ? 'w-5 bg-exclusive-muted' : 'w-2 bg-app-border hover:bg-app-border-strong'
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
