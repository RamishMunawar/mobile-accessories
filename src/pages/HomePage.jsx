import HeroSection from '../components/sections/HeroSection'
import FlashSalesSection from '../components/sections/FlashSalesSection'
import AngledSliderSection from '../components/sections/AngledSliderSection'
import BrandPromoRowSection from '../components/sections/BrandPromoRowSection'
import CategorySection from '../components/sections/CategorySection'
import ThreeDCarousel from '../components/sections/ThreeDCarousel'
import BestSellingSection from '../components/sections/BestSellingSection'
import PromoBannerSection from '../components/sections/PromoBannerSection'
import FeaturedArrivalSection from '../components/sections/FeaturedArrivalSection'
import ReviewsSection from '../components/sections/ReviewsSection'
import ServicesSection from '../components/sections/ServicesSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlashSalesSection />
      <AngledSliderSection />
      <BrandPromoRowSection />
      <CategorySection />
      <section
        id="stories-carousel"
        className="scroll-mt-28 border-t border-app-border-subtle py-12 lg:py-16"
        aria-label="Featured stories carousel"
      >
        <ThreeDCarousel />
      </section>
      <BestSellingSection />
      <PromoBannerSection />
      <FeaturedArrivalSection />
      <ReviewsSection />
      <ServicesSection />
    </>
  )
}
