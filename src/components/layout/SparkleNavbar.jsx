import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLocation } from 'react-router-dom'
import { getSparkleActiveInnerHTML } from './sparkleNavbarMarkup'

/** @typedef {{ label: string, to?: string, watchDropdown?: boolean, cableDropdown?: boolean, batteryDropdown?: boolean }} NavEntry */

/** @param {NavEntry} entry */
function navDropdownKind(entry) {
  if (entry.watchDropdown) return 'watch'
  if (entry.cableDropdown) return 'cable'
  if (entry.batteryDropdown) return 'battery'
  return null
}

function navIndexFromPath(entries, pathname, watchOpen, cableOpen, batteryOpen) {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    if (e.watchDropdown) {
      if (pathname.startsWith('/smart-watches') || watchOpen) return i
      continue
    }
    if (e.cableDropdown) {
      if (pathname.startsWith('/cables') || cableOpen) return i
      continue
    }
    if (e.batteryDropdown) {
      if (pathname.startsWith('/batteries') || batteryOpen) return i
      continue
    }
    if (!e.to) continue
    if (e.to === '/') {
      if (pathname === '/') return i
      continue
    }
    if (pathname === e.to || pathname.startsWith(`${e.to}/`)) return i
  }
  return 0
}

/**
 * Animated underline / sparkle indicator (GSAP).
 * @param {{
 *   entries: NavEntry[],
 *   color?: string,
 *   watchPanelOpen?: boolean,
 *   cablePanelOpen?: boolean,
 *   batteryPanelOpen?: boolean,
 *   onWatchEnter?: () => void,
 *   onWatchLeave?: () => void,
 *   onCableEnter?: () => void,
 *   onCableLeave?: () => void,
 *   onBatteryEnter?: () => void,
 *   onBatteryLeave?: () => void,
 *   navigate: (to: string) => void,
 *   onWatchToggle?: () => void,
 *   onCableToggle?: () => void,
 *   onBatteryToggle?: () => void,
 *   watchTriggerRef?: React.RefObject<HTMLButtonElement | null>,
 *   cableTriggerRef?: React.RefObject<HTMLButtonElement | null>,
 *   batteryTriggerRef?: React.RefObject<HTMLButtonElement | null>,
 * }} props
 */
export default function SparkleNavbar({
  entries,
  color = '#db4444',
  watchPanelOpen = false,
  cablePanelOpen = false,
  batteryPanelOpen = false,
  onWatchEnter,
  onWatchLeave,
  onCableEnter,
  onCableLeave,
  onBatteryEnter,
  onBatteryLeave,
  navigate,
  onWatchToggle,
  onCableToggle,
  onBatteryToggle,
  watchTriggerRef,
  cableTriggerRef,
  batteryTriggerRef,
  className = '',
}) {
  const location = useLocation()
  const labels = entries.map((e) => e.label)

  const derivedIndex = useMemo(
    () => navIndexFromPath(entries, location.pathname, watchPanelOpen, cablePanelOpen, batteryPanelOpen),
    [entries, location.pathname, watchPanelOpen, cablePanelOpen, batteryPanelOpen],
  )

  const [activeIndex, setActiveIndex] = useState(derivedIndex)
  const navRef = useRef(null)
  const activeElementRef = useRef(null)
  const buttonRefs = useRef([])

  const createSVG = useCallback(
    /** @param {HTMLDivElement} element */ (element) => {
      element.innerHTML = getSparkleActiveInnerHTML(color)
    },
    [color],
  )

  const getOffsetLeft = useCallback((/** @type {HTMLButtonElement} */ element) => {
    if (!navRef.current || !activeElementRef.current) return 0
    const elementRect = element.getBoundingClientRect()
    const navRect = navRef.current.getBoundingClientRect()
    const activeElementWidth = activeElementRef.current.offsetWidth
    return elementRect.left - navRect.left + (elementRect.width - activeElementWidth) / 2
  }, [])

  /** Snap indicator to route (no sparkle trail). */
  const snapToIndex = useCallback(
    (index) => {
      const navEl = navRef.current
      const activeEl = activeElementRef.current
      const btn = buttonRefs.current[index]
      if (!navEl || !activeEl || !btn) return
      gsap.killTweensOf(activeEl)
      activeEl.innerHTML = ''
      navEl.classList.remove('before', 'after')
      gsap.set(activeEl, {
        x: getOffsetLeft(btn),
        '--active-element-show': 1,
        rotateY: 0,
      })
      setActiveIndex(index)
    },
    [getOffsetLeft],
  )

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      snapToIndex(derivedIndex)
    })
    return () => cancelAnimationFrame(id)
  }, [derivedIndex, snapToIndex])

  const navStyleTag = `
        .navigation-menu {
          margin: 0;
          position: relative;
          z-index: 2;
          width: auto;
          max-width: 100%;
        }

        .navigation-menu ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          gap: clamp(14px, 2vw, 36px);
        }

        .navigation-menu ul li button {
          -webkit-appearance: none;
          appearance: none;
          border: none;
          cursor: pointer;
          background-color: transparent;
          padding: 0;
          margin: 0;
          font-size: clamp(0.875rem, 0.82rem + 0.2vw, 1rem);
          line-height: 1.375;
          white-space: nowrap;
          transition: color 0.25s;
        }

        .navigation-menu ul li:not(.active):hover button {
          text-shadow: 0 0 10px ${color}, 0 0 20px ${color};
          color: var(--exclusive-red, hsl(355 71% 50%));
        }

        .navigation-menu ul li.active button {
          color: ${color};
        }

        .navigation-menu .active-element {
          --active-element-scale-x: 1;
          --active-element-scale-y: 1;
          --active-element-show: 0;
          --active-element-opacity: 0;
          --active-element-width: 0px;
          --active-element-strike-x: 0%;
          --active-element-mask-position: 0%;
          position: absolute;
          left: 0;
          top: 34px;
          height: 3px;
          width: 36px;
          border-radius: 2px;
          background-color: ${color};
          opacity: var(--active-element-show);
        }

        .navigation-menu .active-element > svg.beam,
        .navigation-menu .active-element .strike {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          opacity: var(--active-element-opacity);
          width: var(--active-element-width);
          mix-blend-mode: multiply;
        }

        .navigation-menu .active-element > svg.beam {
          display: block;
          overflow: visible;
          height: 5px;
          filter: blur(0.5px) drop-shadow(2px 0px 8px ${color}40) drop-shadow(1px 0px 2px ${color}80) drop-shadow(0px 0px 3px ${color}40) drop-shadow(2px 0px 8px ${color}45) drop-shadow(8px 0px 16px ${color}50);
        }

        .navigation-menu .active-element .strike {
          padding: 24px 0;
          -webkit-mask-image: linear-gradient(to right, transparent calc(0% + var(--active-element-mask-position)), black calc(15% + var(--active-element-mask-position)), black 80%, transparent);
          mask-image: linear-gradient(to right, transparent calc(0% + var(--active-element-mask-position)), black calc(15% + var(--active-element-mask-position)), black 80%, transparent);
        }

        .navigation-menu .active-element .strike svg {
          display: block;
          overflow: visible;
          height: 12px;
          width: calc(var(--active-element-width) * 2);
          transform: translate(var(--active-element-strike-x), 30%) scale(var(--active-element-scale-x), var(--active-element-scale-y));
        }

        .navigation-menu .active-element .strike svg:last-child {
          transform: translate(var(--active-element-strike-x), -30%) scale(-1);
        }

        .navigation-menu .active-element .strike svg g path:nth-child(2) {
          filter: blur(2px);
        }

        .navigation-menu .active-element .strike svg g path:nth-child(3) {
          filter: blur(4px);
        }

        .navigation-menu.before .active-element {
          transform: rotateY(180deg);
        }
      `

  const handleClick = (/** @type {number} */ index) => {
    const entry = entries[index]
    if (index === activeIndex) {
      const kind = entry ? navDropdownKind(entry) : null
      if (kind === 'watch') onWatchToggle?.()
      else if (kind === 'cable') onCableToggle?.()
      else if (kind === 'battery') onBatteryToggle?.()
      return
    }

    const navElement = navRef.current
    const activeElement = activeElementRef.current
    const oldButton = buttonRefs.current[activeIndex]
    const newButton = buttonRefs.current[index]

    if (!navElement || !activeElement || !oldButton || !newButton || !entry) {
      return
    }

    const x = getOffsetLeft(newButton)
    const direction = index > activeIndex ? 'after' : 'before'
    const spacing = Math.abs(x - getOffsetLeft(oldButton))

    navElement.classList.add(direction)

    gsap.set(activeElement, {
      rotateY: direction === 'before' ? '180deg' : '0deg',
    })

    gsap.to(activeElement, {
      keyframes: [
        {
          '--active-element-width': `${
            spacing > navElement.offsetWidth - 60 ? navElement.offsetWidth - 60 : spacing
          }px`,
          duration: 0.3,
          ease: 'none',
          onStart: () => {
            createSVG(activeElement)
            gsap.to(activeElement, {
              '--active-element-opacity': 1,
              duration: 0.1,
            })
          },
        },
        {
          '--active-element-scale-x': 0,
          '--active-element-scale-y': '.25',
          '--active-element-width': '0px',
          duration: 0.3,
          onStart: () => {
            gsap.to(activeElement, {
              '--active-element-mask-position': '40%',
              duration: 0.5,
            })
            gsap.to(activeElement, {
              '--active-element-opacity': 0,
              delay: 0.45,
              duration: 0.25,
            })
          },
          onComplete: () => {
            activeElement.innerHTML = ''
            navElement.classList.remove('before', 'after')
            gsap.set(activeElement, {
              x: getOffsetLeft(newButton),
              '--active-element-show': '1',
            })
            setActiveIndex(index)
            const kind = entries[index] ? navDropdownKind(entries[index]) : null
            if (kind === 'watch') onWatchToggle?.()
            else if (kind === 'cable') onCableToggle?.()
            else if (kind === 'battery') onBatteryToggle?.()
            else if (entries[index]?.to) navigate(entries[index].to)
          },
        },
      ],
    })

    gsap.to(activeElement, {
      x,
      '--active-element-strike-x': '-50%',
      duration: 0.6,
      ease: 'none',
    })
  }

  return (
    <>
      <style>{navStyleTag}</style>
      <nav className={`navigation-menu ${className}`.trim()} ref={navRef} aria-label="Main">
        <ul>
          {labels.map((item, index) => {
            const kind = entries[index] ? navDropdownKind(entries[index]) : null
            const hoverEnter =
              kind === 'watch'
                ? onWatchEnter
                : kind === 'cable'
                  ? onCableEnter
                  : kind === 'battery'
                    ? onBatteryEnter
                    : undefined
            const hoverLeave =
              kind === 'watch'
                ? onWatchLeave
                : kind === 'cable'
                  ? onCableLeave
                  : kind === 'battery'
                    ? onBatteryLeave
                    : undefined
            const panelOpen =
              kind === 'watch' ? watchPanelOpen : kind === 'cable' ? cablePanelOpen : kind === 'battery' ? batteryPanelOpen : false
            return (
              <li
                key={item}
                className={index === activeIndex ? 'active' : ''}
                {...(kind
                  ? {
                      onMouseEnter: hoverEnter,
                      onMouseLeave: hoverLeave,
                      ...(kind === 'watch' ? { 'data-smart-watches-nav': 'trigger' } : {}),
                      ...(kind === 'cable' ? { 'data-cables-nav': 'trigger' } : {}),
                      ...(kind === 'battery' ? { 'data-batteries-nav': 'trigger' } : {}),
                    }
                  : {})}
              >
                <button
                  type="button"
                  aria-expanded={kind ? panelOpen : undefined}
                  aria-haspopup={kind ? 'true' : undefined}
                  aria-controls={
                    kind === 'watch'
                      ? 'smart-watches-nav-dropdown-panel'
                      : kind === 'cable'
                        ? 'cables-nav-dropdown-panel'
                        : kind === 'battery'
                          ? 'batteries-nav-dropdown-panel'
                          : undefined
                  }
                  ref={(el) => {
                    buttonRefs.current[index] = el
                    if (kind === 'watch' && watchTriggerRef) watchTriggerRef.current = el
                    if (kind === 'cable' && cableTriggerRef) cableTriggerRef.current = el
                    if (kind === 'battery' && batteryTriggerRef) batteryTriggerRef.current = el
                  }}
                  onClick={() => handleClick(index)}
                >
                  {item}
                  {kind ? (
                    <svg
                      className={`ml-1 inline h-4 w-4 opacity-70 transition md:rotate-0 ${
                        panelOpen ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="active-element" ref={activeElementRef} />
      </nav>
    </>
  )
}
