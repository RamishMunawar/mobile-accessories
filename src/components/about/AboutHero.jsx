import { Link } from 'react-router-dom'

const heroImg =
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&h=700&fit=crop'

export default function AboutHero() {
  return (
    <section className="border-b border-app-border-subtle">
      <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap gap-2 text-sm text-exclusive-muted">
          <Link to="/" className="hover:text-exclusive-dark">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-exclusive-dark">About</span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Our Story</h1>
            <div className="mt-8 space-y-6 text-exclusive-muted leading-relaxed">
              <p>
                Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace with an
                active presence in Bangladesh. Supported by a wide range of tailored marketing, data, and
                service solutions, Exclusive partners with over 10,500 sellers and serves millions of
                consumers and businesses across the region.
              </p>
              <p>
                Exclusive has more than 1 million products to offer, growing at a very fast pace.
                Exclusive offers a diverse assortment in categories ranging from consumer electronics to
                fashion and lifestyle products.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-app-muted lg:min-h-[420px]">
            <img
              src={heroImg}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
