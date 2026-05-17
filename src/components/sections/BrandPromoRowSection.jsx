import { HomePromoCarousel } from './HomePromoCarousel'

/**
 * Premium product-card Swiper carousel (replaces the old `brandPromoCards` static row).
 */
export default function BrandPromoRowSection() {
  return (
    <section
      className="overflow-x-clip border-t border-app-border-subtle bg-app-muted/40 py-8 lg:py-12"
      aria-label="Featured launches"
    >
      <HomePromoCarousel />
    </section>
  )
}
