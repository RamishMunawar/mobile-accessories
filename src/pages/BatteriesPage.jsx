import HeroSection from '../components/sections/HeroSection'
import ProductCard from '../components/product/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'
import { GlowingCard, GlowingCards } from '../components/ui/GlowingCards'
import { useSiteUpdate } from '../hooks/useSiteUpdate'
import { getMergedBatteriesPage } from '../site/siteStore'

export default function BatteriesPage() {
  useSiteUpdate()
  const { products, heroSlides, meta } = getMergedBatteriesPage()

  return (
    <div className="bg-app-bg">
      <HeroSection
        slides={heroSlides}
        ariaLabel="Batteries and portable power"
        shopNowHref="#batteries-products"
      />

      <section
        id="batteries-products"
        className="scroll-mt-28 mx-auto max-w-[1440px] px-4 py-12 lg:px-8 lg:py-16"
      >
        <SectionHeading eyebrow="Batteries" title={meta.title} />
        <p className="-mt-4 mb-10 max-w-2xl text-sm leading-relaxed text-exclusive-muted md:text-base">
          {meta.blurb}
        </p>
        {products.length === 0 ? (
          <p className="rounded-md border border-dashed border-app-border-strong py-16 text-center text-exclusive-muted">
            No products in this category yet. Add them in{' '}
            <span className="font-medium text-exclusive-dark">Admin → Categories & watches → Batteries</span>.
          </p>
        ) : (
          <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
            {products.map((p) => (
              <GlowingCard
                key={p.id}
                className="w-full min-w-0 shrink-0 basis-full p-0 sm:max-w-[calc(50%-0.75rem)] sm:basis-[calc(50%-0.75rem)] lg:max-w-[calc((100%-4.5rem)/4)] lg:basis-[calc((100%-4.5rem)/4)]"
                glowColor="#db4444"
              >
                <ProductCard embedded {...p} productLink={`/product/${p.id}`} />
              </GlowingCard>
            ))}
          </GlowingCards>
        )}
      </section>
    </div>
  )
}
