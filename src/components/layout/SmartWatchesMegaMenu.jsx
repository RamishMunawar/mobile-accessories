import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { smartWatchMegaGrid } from '../../data/smartWatchesMegaMenu'

function MegaWatchCard({ label, to, image, onNavigate }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="group/card relative flex min-h-[168px] flex-col items-stretch overflow-visible rounded-[1.35rem] bg-[color:var(--app-mega-glass)] px-3 pb-3 pt-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-[color:var(--app-mega-ring)] backdrop-blur-md transition hover:bg-[color:var(--app-mega-glass-hover)] hover:ring-[color:var(--app-mega-ring)] md:min-h-[186px]"
    >
      <div className="relative -mt-7 mb-1 flex min-h-[96px] flex-1 items-start justify-center pt-2 md:-mt-8 md:min-h-[108px]">
        <img
          src={image}
          alt=""
          className="relative z-[1] h-[88px] w-auto max-w-[95%] object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.42)] transition duration-300 group-hover/card:-translate-y-1 md:h-[100px]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="relative z-[1] px-0.5 pb-1 text-center text-[11px] font-semibold leading-snug tracking-tight text-[color:var(--app-mega-label)] md:text-xs md:leading-tight">
        {label}
      </p>
    </Link>
  )
}

export function SmartWatchesMegaTrigger({ open, onEnter, onLeave, onToggle }) {
  const location = useLocation()
  const pathActive = location.pathname.startsWith('/smart-watches/')
  const hashActive =
    location.pathname === '/' &&
    ['#category-watch', '#explore-products', '#featured-arrival'].includes(location.hash)

  return (
    <div
      data-smart-watches-mega="trigger"
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="smart-watches-mega-panel"
        onClick={onToggle}
        className={[
          'inline-flex items-center gap-1 border-b-2 border-transparent pb-0.5 text-base transition hover:text-exclusive-red',
          open || pathActive || hashActive ? 'text-exclusive-red' : 'text-exclusive-dark',
        ].join(' ')}
      >
        Smart Watches
        <svg
          className={['h-4 w-4 opacity-70 transition md:rotate-0', open ? 'rotate-180' : ''].join(' ')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export function SmartWatchesMegaPanel({ open, onEnter, onLeave, onClose }) {
  const [gender, setGender] = useState('men')
  const closeIfNavigate = () => onClose()

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/45 backdrop-blur-[2px] md:hidden"
        aria-hidden
        onClick={onClose}
      />
      <div
        id="smart-watches-mega-panel"
        data-smart-watches-mega="panel"
        role="region"
        aria-label="Smart watches categories"
        className={[
          'fixed inset-x-0 bottom-0 top-auto z-50 max-h-[min(92vh,820px)] overflow-y-auto rounded-t-3xl shadow-[0_-8px_60px_rgba(0,0,0,0.35)] md:absolute md:bottom-auto md:top-full md:max-h-none md:overflow-visible md:rounded-t-none md:rounded-b-[1.75rem] md:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.55)]',
        ].join(' ')}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div className="relative overflow-hidden md:rounded-b-[1.75rem]">
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: "url('/smart-watches-mega-bg.png')" }}
          />
          <div className="absolute inset-0 bg-neutral-950/72 backdrop-blur-md" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/[0.22] via-white/[0.06] to-transparent" />

          <div className="relative z-[1] mx-auto flex max-w-[1440px] gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-10 lg:gap-12 lg:px-10">
            <aside className="flex w-[4.5rem] shrink-0 flex-col gap-8 border-r border-white/[0.42] pr-6 sm:w-[5.5rem] sm:pr-8 md:w-28">
              {(['men', 'women']).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={[
                    'relative text-left text-sm font-medium tracking-wide transition sm:text-base',
                    gender === g
                      ? 'pl-3 text-white before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:rounded-full before:bg-white'
                      : 'text-white/55 hover:text-white/85',
                  ].join(' ')}
                >
                  {g === 'men' ? 'Men' : 'Women'}
                </button>
              ))}
            </aside>

            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:gap-5">
                {smartWatchMegaGrid.top.map((card) => (
                  <MegaWatchCard
                    key={card.slug}
                    label={card.label}
                    to={card.to}
                    image={card.image}
                    onNavigate={closeIfNavigate}
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-4 sm:gap-4 md:gap-5">
                <div className="hidden sm:block" aria-hidden />
                {smartWatchMegaGrid.bottom.map((card) => (
                  <MegaWatchCard
                    key={card.slug}
                    label={card.label}
                    to={card.to}
                    image={card.image}
                    onNavigate={closeIfNavigate}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/** Hook: hover-delay open/close + click toggle + outside click + Escape */
export function useSmartWatchesMegaMenu() {
  const [open, setOpen] = useState(false)
  const leaveTimerRef = useRef(null)

  const cancelLeave = useCallback(() => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
  }, [])

  const close = useCallback(() => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    setOpen(false)
  }, [])

  const enter = useCallback(() => {
    cancelLeave()
    setOpen(true)
  }, [cancelLeave])

  const leave = useCallback(() => {
    cancelLeave()
    leaveTimerRef.current = window.setTimeout(() => setOpen(false), 220)
  }, [cancelLeave])

  const toggle = useCallback(() => {
    cancelLeave()
    setOpen((o) => !o)
  }, [cancelLeave])

  useEffect(() => () => cancelLeave(), [cancelLeave])

  useEffect(() => {
    if (!open) return undefined
    function onDocDown(e) {
      const t = e.target
      if (t instanceof Node && !t.closest?.('[data-smart-watches-mega]')) close()
    }
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDocDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return { open, enter, leave, toggle, close }
}
