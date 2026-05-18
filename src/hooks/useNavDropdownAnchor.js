import { useEffect, useState } from 'react'

/**
 * Positions a fixed dropdown under its nav trigger button.
 * @param {React.RefObject<HTMLElement | null>} anchorRef
 * @param {boolean} open
 * @param {number} [panelWidth]
 */
export function useNavDropdownAnchor(anchorRef, open, panelWidth = 280) {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open) return undefined

    function update() {
      const el = anchorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const margin = 8
      let left = rect.left
      const maxLeft = window.innerWidth - panelWidth - margin
      if (left > maxLeft) left = Math.max(margin, maxLeft)
      if (left < margin) left = margin
      setPosition({
        top: rect.bottom + 6,
        left,
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRef, panelWidth])

  return position
}
