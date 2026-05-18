import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import ProductCard from '../components/product/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'
import { GlowingCard, GlowingCards } from '../components/ui/GlowingCards'
import { useSiteUpdate } from '../hooks/useSiteUpdate'
import {
  filterCablesByType,
  getCableCategoryLabel,
  normalizeCableTypeSlug,
} from '../data/cableCategories'
import { getMergedCablesPage } from '../site/siteStore'

export default function CablesPage() {
  useSiteUpdate()
  const [searchParams] = useSearchParams()
  const typeSlug = normalizeCableTypeSlug(searchParams.get('type'))
  const { products, heroSlides, meta } = getMergedCablesPage()

  const filteredProducts = useMemo(
    () => filterCablesByType(products, typeSlug),
    [products, typeSlug],
  )

  const pageTitle = typeSlug === 'all' ? meta.title?.trim() || 'Add page title in Admin' : getCableCategoryLabel(typeSlug)
  const pageBlurb =
    typeSlug === 'all'
      ? meta.blurb?.trim() ?? ''
      : `Showing ${getCableCategoryLabel(typeSlug).toLowerCase()} from our catalog.`

  return (
    <div className="bg-app-bg">
      <HeroSection
        slides={heroSlides}
        ariaLabel="Cables and connectors"
        shopNowHref="#cables-products"
      />

      <section
        id="cables-products"
        className="scroll-mt-28 mx-auto max-w-[1440px] px-4 py-12 lg:px-8 lg:py-16"
      >
        <SectionHeading
          eyebrow="Cables"
          title={pageTitle}
          className={typeSlug === 'all' && !meta.title?.trim() ? '[&_h2]:text-exclusive-muted' : ''}
        />
        {pageBlurb ? (
          <p className="-mt-4 mb-10 max-w-2xl text-sm leading-relaxed text-exclusive-muted md:text-base">
            {pageBlurb}
          </p>
        ) : typeSlug === 'all' ? (
          <p className="-mt-4 mb-10 max-w-2xl rounded-md border border-dashed border-app-border-strong px-4 py-3 text-sm leading-relaxed text-exclusive-muted md:text-base">
            Add a short description in{' '}
            <span className="font-medium text-exclusive-dark">Admin → Categories & watches → Cables</span>.
          </p>
        ) : null}
        {products.length === 0 ? (
          <p className="rounded-md border border-dashed border-app-border-strong py-16 text-center text-exclusive-muted">
            No products in this category yet. Add them in{' '}
            <span className="font-medium text-exclusive-dark">Admin → Categories & watches → Cables</span>.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="rounded-md border border-dashed border-app-border-strong py-16 text-center text-exclusive-muted">
            No products for <span className="font-medium text-exclusive-dark">{pageTitle}</span> yet. Pick
            another type in the Cables menu or assign a cable type in admin.
          </p>
        ) : (
          <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
            {filteredProducts.map((p) => (
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
