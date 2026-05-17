import { useState } from 'react'
import { useMergedProducts } from '../../hooks/useMergedProducts'
import { useCountdown } from '../../hooks/useCountdown'
import ProductCard from '../product/ProductCard'
import { GlowingCard, GlowingCards } from '../ui/GlowingCards'
import { ButtonLink } from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'
import CountdownStrip from '../ui/CountdownStrip'

export default function FlashSalesSection() {
  const { flash: flashSaleProducts } = useMergedProducts()
  const [end] = useState(() => new Date(Date.now() + 3 * 86400000 + 5 * 3600000))
  const cd = useCountdown(end)

  return (
    <section id="flash" className="scroll-mt-28 py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading
          eyebrow="Today's"
          title="Flash Sales"
          action={<CountdownStrip parts={cd} />}
        />

        <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
          {flashSaleProducts.map((p) => (
            <GlowingCard
              key={p.id}
              className="w-full min-w-0 shrink-0 basis-full p-0 sm:max-w-[calc(50%-0.75rem)] sm:basis-[calc(50%-0.75rem)] lg:max-w-[calc((100%-4.5rem)/4)] lg:basis-[calc((100%-4.5rem)/4)]"
              glowColor="#db4444"
            >
              <ProductCard embedded {...p} productLink={`/product/${p.id}`} />
            </GlowingCard>
          ))}
        </GlowingCards>

        <div className="mt-12 flex justify-center">
          <ButtonLink to="/" variant="primary" size="lg">
            View All Products
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
