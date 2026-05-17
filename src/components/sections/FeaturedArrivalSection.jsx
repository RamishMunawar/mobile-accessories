import { Link } from 'react-router-dom'
import { useSiteUpdate } from '../../hooks/useSiteUpdate'
import { getMergedFeaturedArrival } from '../../site/siteStore'
import SectionHeading from '../ui/SectionHeading'

/** @param {{ href: string; className: string; children: import('react').ReactNode }} props */
function ArrivalCta({ href, className, children }) {
  const h = (href ?? '').trim()
  if (h.startsWith('/') && !h.startsWith('//')) {
    return (
      <Link to={h} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={h || '#'}
      className={className}
      {...(h.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/**
 * @param {{
 *   tile: { title: string; description: string; href: string }
 *   titleClass: string
 *   descClass: string
 * }} props
 */
function TileOverlay({ tile, titleClass, descClass }) {
  return (
    <>
      <h3 className={titleClass}>{tile.title}</h3>
      {tile.description ? <p className={descClass}>{tile.description}</p> : null}
      <ArrivalCta
        href={tile.href}
        className="group mt-4 inline-flex items-center gap-2 font-medium text-white underline-offset-4 hover:underline"
      >
        Shop Now{' '}
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          →
        </span>
      </ArrivalCta>
    </>
  )
}

export default function FeaturedArrivalSection() {
  useSiteUpdate()
  const { eyebrow, title, tiles } = getMergedFeaturedArrival()
  const compact = tiles.filter((t) => t.title?.trim() && t.image?.trim())
  if (!compact.length) return null

  const eb = eyebrow?.trim() || 'Featured'
  const ttle = title?.trim() || 'New Arrival'

  if (compact.length === 4) {
    const [a, b, c, d] = compact
    return (
      <section id="featured-arrival" className="scroll-mt-28 py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <SectionHeading eyebrow={eb} title={ttle} />

          <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-6">
            <article className="relative flex min-h-[420px] items-end overflow-hidden rounded-lg bg-black lg:row-span-2">
              <img
                src={a.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                loading="lazy"
              />
              <div className="relative z-10 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-8 pt-24 text-white">
                <TileOverlay
                  tile={a}
                  titleClass="font-display text-2xl font-semibold"
                  descClass="max-w-xs text-sm text-white/80"
                />
              </div>
            </article>

            <article className="relative flex min-h-[200px] items-end overflow-hidden rounded-lg bg-black">
              <img
                src={b.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                loading="lazy"
              />
              <div className="relative z-10 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-8 pt-16 text-white">
                <TileOverlay
                  tile={b}
                  titleClass="font-display text-2xl font-semibold"
                  descClass="max-w-md text-sm text-white/80"
                />
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
              <article className="relative flex min-h-[200px] items-end overflow-hidden rounded-lg bg-black">
                <img
                  src={c.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="lazy"
                />
                <div className="relative z-10 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-6 pt-14 text-white">
                  <TileOverlay
                    tile={c}
                    titleClass="font-display text-xl font-semibold"
                    descClass="text-sm text-white/80"
                  />
                </div>
              </article>

              <article className="relative flex min-h-[200px] items-end overflow-hidden rounded-lg bg-black">
                <img
                  src={d.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="lazy"
                />
                <div className="relative z-10 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-6 pt-14 text-white">
                  <TileOverlay
                    tile={d}
                    titleClass="font-display text-xl font-semibold"
                    descClass="text-sm text-white/80"
                  />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured-arrival" className="scroll-mt-28 py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading eyebrow={eb} title={ttle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {compact.map((tile) => (
            <article
              key={tile.id}
              className="relative flex min-h-[280px] items-end overflow-hidden rounded-lg bg-black"
            >
              <img
                src={tile.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                loading="lazy"
              />
              <div className="relative z-10 w-full space-y-1 bg-gradient-to-t from-black/80 to-transparent p-6 pt-14 text-white">
                <TileOverlay
                  tile={tile}
                  titleClass="font-display text-xl font-semibold"
                  descClass="text-sm text-white/80"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
