import { useMergedProducts } from '../../hooks/useMergedProducts'
import ProductCard from '../product/ProductCard'
import { GlowingCard, GlowingCards } from '../ui/GlowingCards'
import { ButtonLink } from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'

export default function BestSellingSection() {
  const { best: bestSellingProducts } = useMergedProducts()
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading
          eyebrow="This Month"
          title="Best Selling Products"
          action={
            <ButtonLink to="/" variant="outline" size="sm">
              View All
            </ButtonLink>
          }
        />

        <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
          {bestSellingProducts.map((p) => (
            <GlowingCard
              key={p.id}
              className="w-full min-w-0 shrink-0 basis-full p-0 sm:max-w-[calc(50%-0.75rem)] sm:basis-[calc(50%-0.75rem)] lg:max-w-[calc((100%-4.5rem)/4)] lg:basis-[calc((100%-4.5rem)/4)]"
              glowColor="#db4444"
            >
              <ProductCard embedded {...p} productLink={`/product/${p.id}`} />
            </GlowingCard>
          ))}
        </GlowingCards>
      </div>
    </section>
  )
}
