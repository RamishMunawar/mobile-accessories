import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Smooth-scroll to `#id` on home when hash is present (works with header nav links). */
export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname !== '/' || !hash || hash === '#') return
    const id = hash.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    const t = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(t)
  }, [pathname, hash])
}
