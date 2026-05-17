import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { batteriesNavDropdownItems } from '../../data/batteriesNavDropdown'

export function BatteriesNavPanel({ open, onEnter, onLeave, onClose }) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
        aria-hidden
        onClick={onClose}
      />
      <div
        id="batteries-nav-dropdown-panel"
        data-batteries-nav="panel"
        role="menu"
        aria-label="Battery categories"
        className="fixed left-1/2 top-[4.75rem] z-50 w-[min(calc(100vw-2rem),260px)] -translate-x-1/2 rounded-lg border border-app-border-subtle bg-app-card py-2 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/5 md:top-[5.25rem]"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <ul className="m-0 list-none p-0">
          {batteriesNavDropdownItems.map((item) => (
            <li key={item.label} role="none">
              <Link
                role="menuitem"
                to={item.to}
                onClick={onClose}
                className="block px-4 py-2.5 text-sm font-medium text-exclusive-dark transition hover:bg-app-muted hover:text-exclusive-red"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function useBatteriesNavMenu() {
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
      if (t instanceof Node && !t.closest?.('[data-batteries-nav]')) close()
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
