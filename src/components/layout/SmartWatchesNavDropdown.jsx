import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavDropdownAnchor } from '../../hooks/useNavDropdownAnchor'
import { smartWatchesNavDropdownItems } from '../../data/smartWatchesNavDropdown'
import { cn } from '../../utils/cn'

const PANEL_WIDTH = 300

/**
 * @param {{
 *   open: boolean
 *   onEnter: () => void
 *   onLeave: () => void
 *   onClose: () => void
 *   anchorRef: React.RefObject<HTMLElement | null>
 * }} props
 */
export function SmartWatchesNavPanel({ open, onEnter, onLeave, onClose, anchorRef }) {
  const location = useLocation()
  const position = useNavDropdownAnchor(anchorRef, open, PANEL_WIDTH)

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
        aria-hidden
        onClick={onClose}
      />
      <div
        id="smart-watches-nav-dropdown-panel"
        data-smart-watches-nav="panel"
        role="menu"
        aria-label="Smart watch categories"
        className="fixed z-50 max-h-[min(70vh,420px)] overflow-y-auto rounded-lg border border-app-border-subtle bg-app-card py-2 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
        style={{
          top: position.top,
          left: position.left,
          width: PANEL_WIDTH,
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <ul className="m-0 list-none p-0">
          {smartWatchesNavDropdownItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <li key={item.slug} role="none">
                <Link
                  role="menuitem"
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-exclusive-red/10 text-exclusive-red'
                      : 'text-exclusive-dark hover:bg-app-muted hover:text-exclusive-red',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export function useSmartWatchesNavMenu() {
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
      if (t instanceof Node && !t.closest?.('[data-smart-watches-nav]')) close()
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
