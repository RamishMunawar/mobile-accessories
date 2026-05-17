import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { cn } from '../../utils/cn'

const cardVariants = {
  offHover: (angle) => ({
    rotateY: angle,
    z: 60,
    opacity: 0.9,
    scale: 1,
    zIndex: 30,
    transition: {
      type: 'spring',
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  }),
  onHover: (hoverScale) => ({
    rotateY: 0,
    z: 120,
    opacity: 1,
    scale: hoverScale,
    zIndex: 50,
    transition: {
      type: 'spring',
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  }),
}

function AngledCard({ item, angle, hoverScale, cardWidth }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative flex-shrink-0 cursor-pointer overflow-visible"
      style={{
        width: cardWidth,
        height: '100%',
        transformStyle: 'preserve-3d',
      }}
      custom={isHovered ? hoverScale : angle}
      variants={cardVariants}
      initial="offHover"
      animate={isHovered ? 'onHover' : 'offHover'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full min-h-[300px] w-full overflow-hidden border border-white/10 bg-app-muted shadow-2xl">
        <img
          src={item.url}
          alt={item.alt || 'Slider image'}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.title ? (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="text-lg font-bold">{item.title}</h3>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

/**
 * @param {object} props
 * @param {{ id: string | number, url: string, alt?: string, title?: string }[]} props.items
 * @param {number} [props.speed]
 * @param {'left' | 'right'} [props.direction]
 * @param {string} [props.containerHeight]
 * @param {string} [props.cardWidth]
 * @param {string} [props.gap]
 * @param {number} [props.angle]
 * @param {number} [props.hoverScale]
 * @param {string} [props.className]
 */
export function AngledSlider({
  items,
  speed = 40,
  direction = 'left',
  containerHeight = '400px',
  cardWidth = '300px',
  gap = '40px',
  angle = 20,
  hoverScale = 1.05,
  className,
}) {
  const [width, setWidth] = useState(0)
  const containerRef = useRef(null)
  const x = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)

  const duplicatedItems = [...items, ...items, ...items]

  useEffect(() => {
    const calculateWidth = () => {
      const numWidth = parseInt(String(cardWidth).replace('px', '') || '300', 10)
      const numGap = parseInt(String(gap).replace('px', '') || '40', 10)

      if (!Number.isNaN(numWidth) && !Number.isNaN(numGap)) {
        const calculatedWidth = (numWidth + numGap) * items.length
        setWidth(calculatedWidth)
      } else if (containerRef.current) {
        const scrollWidth = containerRef.current.scrollWidth
        setWidth(scrollWidth / 3)
      }
    }

    calculateWidth()
    window.addEventListener('resize', calculateWidth)
    return () => window.removeEventListener('resize', calculateWidth)
  }, [items, cardWidth, gap])

  useEffect(() => {
    if (width <= 0) return

    const startX = direction === 'left' ? 0 : -width
    const endX = direction === 'left' ? -width : 0

    if (isHovered) return undefined

    const runAnimation = () => {
      const currentX = x.get()
      const totalDist = width
      const dist = Math.abs(endX - currentX)
      const duration = speed * (dist / totalDist)

      const controls = animate(x, endX, {
        duration,
        ease: 'linear',
        onComplete: () => {
          x.set(startX)
          runAnimation()
        },
      })
      return controls
    }

    const animation = runAnimation()

    return () => {
      animation.stop()
    }
  }, [width, speed, direction, isHovered, x])

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-app-bg py-10', className)}
      style={{
        height: containerHeight,
        perspective: '1000px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex items-center"
        style={{ x, gap, transformStyle: 'preserve-3d' }}
      >
        {duplicatedItems.map((item, index) => (
          <AngledCard
            key={`${item.id}-${index}`}
            item={item}
            angle={angle}
            hoverScale={hoverScale}
            cardWidth={cardWidth}
          />
        ))}
      </motion.div>
    </div>
  )
}
