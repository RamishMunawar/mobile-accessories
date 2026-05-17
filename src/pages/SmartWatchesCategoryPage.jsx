import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import ProductCard from '../components/product/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'
import { GlowingCard, GlowingCards } from '../components/ui/GlowingCards'
import { useSiteUpdate } from '../hooks/useSiteUpdate'
import { isSmartWatchCategorySlug } from '../data/smartWatchProducts'
import { getMergedSmartWatchCategoryPage } from '../site/siteStore'

export default function SmartWatchesCategoryPage() {
  useSiteUpdate()
  const { categoryId } = useParams()

  const bundle = useMemo(() => {
    if (!categoryId || !isSmartWatchCategorySlug(categoryId)) return null
    return getMergedSmartWatchCategoryPage(categoryId)
  }, [categoryId])

  if (!categoryId || !isSmartWatchCategorySlug(categoryId) || !bundle) {
    return <Navigate to="/" replace />
  }

  const { products, heroSlides, meta } = bundle

  return (
    <div className="bg-app-bg">
      <HeroSection
        slides={heroSlides}
        ariaLabel="Smart watches"
        shopNowHref="#smart-watches-products"
      />

      <section
        id="smart-watches-products"
        className="scroll-mt-28 mx-auto max-w-[1440px] px-4 py-12 lg:px-8 lg:py-16"
      >
        <SectionHeading eyebrow="Smart Watches" title={meta.title} />
        <p className="-mt-4 mb-10 max-w-2xl text-sm leading-relaxed text-exclusive-muted md:text-base">
          {meta.blurb}
        </p>
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
      </section>
    </div>
  )
}
