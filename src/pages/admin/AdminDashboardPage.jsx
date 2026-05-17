import { Button } from '../../components/ui/Button'
import { clearSiteOverrides } from '../../site/siteStore'
import { AdminDashLinkCard, AdminPageHeader } from './AdminUi'

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Overview"
        description={
          <>
            Changes apply immediately on the public site in this browser. There is no backend — uploads
            live in <span className="font-medium text-exclusive-dark">localStorage</span> as URLs or
            small embedded images.
          </>
        }
      />

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AdminDashLinkCard
          to="/admin/hero"
          title="Hero banners"
          description="Homepage carousel slides, headlines, series badge, and images."
          icon={<IconHero />}
        />
        <AdminDashLinkCard
          to="/admin/products"
          title="Products"
          description="Flash sales, best sellers, and explore grids — unify IDs across sections."
          icon={<IconCube />}
        />
        <AdminDashLinkCard
          to="/admin/categories"
          title="Categories & Smart Watches"
          description="Cables, batteries, and every smart-watch route: hero carousel, copy, and product grids."
          icon={<IconStack />}
        />
        <AdminDashLinkCard
          to="/admin/featured-arrival"
          title="Featured New Arrival"
          description="Homepage grid: large spotlight, wide banner, and two promos — titles, copy, images, and Shop Now links."
          icon={<IconStar />}
        />
        <AdminDashLinkCard
          to="/admin/promo-banner"
          title="Music promo banner"
          description="Countdown banner with headline, CTA, product image, and offer end date."
          icon={<IconMegaphone />}
        />
        <AdminDashLinkCard
          to="/admin/story-carousel"
          title="3D story carousel"
          description="Center-focused cards: image overlay, brand, title, description, tags, and Learn more links."
          icon={<IconCarousel />}
        />
      </ul>

      <section className="relative mt-14 overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50/90 via-white to-orange-50/40 p-6 shadow-inner dark:border-red-900/50 dark:from-red-950/35 dark:via-app-card dark:to-app-card md:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-exclusive-red/[0.12] blur-3xl dark:bg-exclusive-red/20"
          aria-hidden
        />
        <div className="relative">
          <h2 className="font-display text-lg font-semibold text-exclusive-dark dark:text-exclusive-dark">
            Reset storefront data
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-exclusive-muted">
            Clears hero, homepage products, featured arrival, music promo banner, 3D story carousel, cables,
            batteries, and smart-watch category overrides in this browser. The storefront returns to empty defaults
            until you add content again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 border-exclusive-red/45 font-semibold text-exclusive-red hover:bg-exclusive-red/[0.12] hover:text-exclusive-red"
            onClick={() => {
              if (!window.confirm('Reset all admin data to defaults in this browser?')) return
              clearSiteOverrides()
            }}
          >
            Reset everything to defaults
          </Button>
        </div>
      </section>
    </div>
  )
}

function IconCarousel() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M8 10v4M16 10v4" strokeLinecap="round" />
    </svg>
  )
}

function IconHero() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.65" />
      <path d="m21 16-6-6-12 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCube() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.75">
      <path d="M21 15.83V8.23a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4a2 2 0 00-1 1.73v7.6a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m3.3 7.96 8.73 5.09 8.67-5.08M12 22.07V13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMegaphone() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.75">
      <path d="M4 10v4h4l5 5V5L8 10H4z" strokeLinejoin="round" />
      <path d="M15 9a4 4 0 010 6M17 7a7 7 0 010 10" strokeLinecap="round" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.75">
      <path
        d="M12 3.5 14.2 9.2l6 .5-4.6 4 1.4 5.9L12 16.9 6.9 19.6l1.4-5.9-4.6-4 6-.5L12 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconStack() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.75">
      <path d="M12 4 3 9l9 5 9-5-9-5Zm0 15L4 17l8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 12 8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
