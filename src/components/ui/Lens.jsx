import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const SHADOW_CLASSES = {
  none: '',
  light: 'shadow-sm',
  medium: 'shadow-md',
  heavy: 'shadow-xl',
}

/**
 * Hover magnifier lens. Mirrors the Lightswind `Lens` API.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.zoomFactor]
 * @param {number} [props.lensSize]
 * @param {{ x: number, y: number }} [props.position]
 * @param {boolean} [props.isStatic]
 * @param {boolean} [props.hovering]
 * @param {(hovering: boolean) => void} [props.setHovering]
 * @param {string} [props.className]
 * @param {string} [props.borderRadius] tailwind suffix (e.g. `lg`, `md`, `none`)
 * @param {number} [props.borderWidth]
 * @param {string} [props.borderColor] tailwind class (e.g. `border-app-border`)
 * @param {'none' | 'light' | 'medium' | 'heavy'} [props.shadowIntensity]
 * @param {number} [props.animationDuration]
 * @param {string} [props.animationEasing]
 * @param {'circle' | 'square'} [props.maskShape]
 * @param {number} [props.opacity]
 * @param {boolean} [props.blurEdge]
 * @param {boolean} [props.smoothFollow]
 * @param {boolean} [props.disabled]
 */
export function Lens({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
  className,
  borderRadius = 'lg',
  borderWidth = 0,
  borderColor = 'border-gray-300',
  shadowIntensity = 'medium',
  animationDuration = 0.3,
  animationEasing = 'easeOut',
  maskShape = 'circle',
  opacity = 1,
  blurEdge = false,
  smoothFollow = true,
  disabled = false,
  /** Keep lens fully inside the container by clamping its center to [radius, size-radius]. */
  clampToBounds = true,
}) {
  const containerRef = useRef(null)
  const [localIsHovering, setLocalIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 })

  const isHovering = hovering !== undefined ? hovering : localIsHovering
  const setIsHovering = setHovering || setLocalIsHovering

  const clamp = (value, min, max) => {
    if (max < min) return (min + max) / 2
    return Math.min(max, Math.max(min, value))
  }

  const handleMouseMove = (e) => {
    if (disabled || isStatic) return

    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    if (clampToBounds) {
      const radius = lensSize / 2
      x = clamp(x, radius, rect.width - radius)
      y = clamp(y, radius, rect.height - radius)
    }

    if (smoothFollow) {
      setMousePosition({ x, y })
    } else {
      const gridSize = 20
      setMousePosition({
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
      })
    }
  }

  const getMaskImage = (x, y) => {
    const radius = lensSize / 2
    const shape =
      maskShape === 'circle'
        ? `circle ${radius}px at ${x}px ${y}px`
        : `ellipse ${radius}px ${radius}px at ${x}px ${y}px`

    return blurEdge
      ? `radial-gradient(${shape}, black 60%, transparent 100%)`
      : `radial-gradient(${shape}, black 100%, transparent 100%)`
  }

  const currentX = isStatic ? position.x : mousePosition.x
  const currentY = isStatic ? position.y : mousePosition.y

  const lensContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.58 }}
      animate={{ opacity, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: animationDuration, ease: animationEasing }}
      className={cn(
        'absolute inset-0 overflow-hidden',
        borderWidth > 0 && `border-${borderWidth} ${borderColor}`,
        SHADOW_CLASSES[shadowIntensity],
      )}
      style={{
        maskImage: getMaskImage(currentX, currentY),
        WebkitMaskImage: getMaskImage(currentX, currentY),
        transformOrigin: `${currentX}px ${currentY}px`,
        zIndex: 50,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoomFactor})`,
          transformOrigin: `${currentX}px ${currentY}px`,
        }}
      >
        {children}
      </div>
    </motion.div>
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative z-20 h-full w-full overflow-hidden',
        `rounded-${borderRadius}`,
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      onMouseEnter={() => !disabled && setIsHovering(true)}
      onMouseLeave={() => !disabled && setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic ? (
        <div>{lensContent}</div>
      ) : (
        <AnimatePresence>
          {isHovering && !disabled ? <div>{lensContent}</div> : null}
        </AnimatePresence>
      )}
    </div>
  )
}
