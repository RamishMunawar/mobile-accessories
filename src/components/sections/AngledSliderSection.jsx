import { useMergedProducts } from '../../hooks/useMergedProducts'
import { AngledSlider } from '../ui/AngledSlider'
import SectionHeading from '../ui/SectionHeading'

export default function AngledSliderSection() {
  const { flash } = useMergedProducts()
  const items = flash.map((p) => ({
    id: p.id,
    url: p.image,
    alt: p.title,
    title: p.title,
  }))

  return (
    <section
      className="scroll-mt-28 border-t border-app-border-subtle pt-12 lg:pt-16"
      aria-label="Latest News"
    >
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading title="Latest News" />
      </div>
      {items.length > 0 ? (
        <AngledSlider items={items} speed={40} direction="left" />
      ) : (
        <div className="mx-auto max-w-[1440px] px-4 py-10 text-center text-sm text-app-muted lg:px-8">
          Add products to the Flash section in Admin to populate this strip.
        </div>
      )}
    </section>
  )
}
