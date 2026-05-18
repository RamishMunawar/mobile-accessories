import { useEffect, useMemo, useState } from 'react'
import { useMergedProducts } from '../../hooks/useMergedProducts'
import { useCountdown } from '../../hooks/useCountdown'
import ProductCard from '../product/ProductCard'
import { GlowingCard, GlowingCards } from '../ui/GlowingCards'
import { Button } from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'
import CountdownStrip from '../ui/CountdownStrip'

const ROWS_PER_STEP = 3

/** Matches product grid: 1 col → 2 (sm) → 4 (lg). */
function useFlashGridColumns() {
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 4
    const w = window.innerWidth
    if (w >= 1024) return 4
    if (w >= 640) return 2
    return 1
  })

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)')
    const mqSm = window.matchMedia('(min-width: 640px)')
    const sync = () => {
      if (mqLg.matches) setColumns(4)
      else if (mqSm.matches) setColumns(2)
      else setColumns(1)
    }
    sync()
    mqLg.addEventListener('change', sync)
    mqSm.addEventListener('change', sync)
    return () => {
      mqLg.removeEventListener('change', sync)
      mqSm.removeEventListener('change', sync)
    }
  }, [])

  return columns
}

export default function FlashSalesSection() {
  const { flash: flashSaleProducts } = useMergedProducts()
  const [end] = useState(() => new Date(Date.now() + 3 * 86400000 + 5 * 3600000))
  const cd = useCountdown(end)
  const columns = useFlashGridColumns()
  const stepSize = columns * ROWS_PER_STEP

  const [visibleCount, setVisibleCount] = useState(stepSize)

  useEffect(() => {
    setVisibleCount(stepSize)
  }, [flashSaleProducts.length, stepSize])

  const visibleProducts = useMemo(
    () => flashSaleProducts.slice(0, visibleCount),
    [flashSaleProducts, visibleCount],
  )

  const hasMore = visibleCount < flashSaleProducts.length

  function loadMoreRows() {
    setVisibleCount((n) => Math.min(n + stepSize, flashSaleProducts.length))
  }

  return (
    <section id="flash" className="scroll-mt-28 py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading
          eyebrow="Today's"
          title="Flash Sales"
          action={<CountdownStrip parts={cd} />}
        />

        <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
          {visibleProducts.map((p) => (
            <GlowingCard
              key={p.id}
              className="w-full min-w-0 shrink-0 basis-full p-0 sm:max-w-[calc(50%-0.75rem)] sm:basis-[calc(50%-0.75rem)] lg:max-w-[calc((100%-4.5rem)/4)] lg:basis-[calc((100%-4.5rem)/4)]"
              glowColor="#db4444"
            >
              <ProductCard embedded {...p} productLink={`/product/${p.id}`} />
            </GlowingCard>
          ))}
        </GlowingCards>

        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Button type="button" variant="primary" size="lg" onClick={loadMoreRows}>
              View All Products
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
