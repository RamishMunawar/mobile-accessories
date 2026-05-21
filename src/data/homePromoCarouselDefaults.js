/** @typedef {{ id: string; badge?: string; badgeAccent?: boolean; model: string; title: string; titleGradient?: boolean; tags: string[]; image: string; bgClass: string; imageOverlap?: boolean; shopNowLink?: string }} HomePromoSlide */

/** Card background presets (Tailwind classes used by the storefront carousel). */
export const homePromoBgPresets = [
  {
    id: 'dark-amber',
    label: 'Dark amber gradient',
    bgClass:
      'bg-gradient-to-br from-amber-900/95 via-neutral-900 to-stone-950 ring-1 ring-white/[0.08]',
  },
  {
    id: 'dark-orange',
    label: 'Dark orange gradient',
    bgClass:
      'bg-gradient-to-br from-orange-950 via-neutral-950 to-orange-950/80 ring-1 ring-orange-500/25',
  },
  {
    id: 'light-fuchsia',
    label: 'Light (Glacier style)',
    bgClass:
      'bg-gradient-to-r from-neutral-50 via-neutral-50 to-fuchsia-200 ring-1 ring-neutral-200/90',
  },
  {
    id: 'dark-radial',
    label: 'Dark radial bronze',
    bgClass:
      'bg-[radial-gradient(ellipse_at_70%_20%,rgba(180,124,62,0.25),transparent_50%)] bg-neutral-950 ring-1 ring-white/[0.1]',
  },
]

/** @param {string} bgClass */
export function bgPresetIdFromClass(bgClass) {
  const match = homePromoBgPresets.find((p) => p.bgClass === bgClass)
  return match?.id ?? 'custom'
}

/** @type {HomePromoSlide[]} */
export const defaultHomePromoSlides = [
  {
    id: 'magnus',
    badge: 'Software Based Headphones',
    badgeAccent: true,
    model: 'R-1520',
    title: 'MAGNUS',
    tags: ['Active Noise Cancellation', 'Mood Tuned Sound'],
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop&q=85',
    bgClass: homePromoBgPresets[0].bgClass,
    imageOverlap: true,
    shopNowLink: '/#explore-products',
  },
  {
    id: 'hurricane',
    badge: 'Software Based Headphones',
    model: 'R-1515',
    title: 'HURRICANE',
    tags: ['Ultra Low Latency', 'USB+Type-C Dongle'],
    image:
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=900&h=900&fit=crop&q=85',
    bgClass: homePromoBgPresets[1].bgClass,
    imageOverlap: true,
    shopNowLink: '/#explore-products',
  },
  {
    id: 'glacier',
    badge: 'LIMITED EDITION EARBUDS',
    model: '',
    title: 'GLACIER',
    titleGradient: true,
    tags: ['Wireless Charging', 'Dual Device Connectivity'],
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&h=900&fit=crop&q=85',
    bgClass: homePromoBgPresets[2].bgClass,
    imageOverlap: true,
    shopNowLink: '/#explore-products',
  },
  {
    id: 'eminence',
    badge: 'NEWLY LAUNCH EARBUDS',
    badgeAccent: true,
    model: 'R-7050',
    title: 'EMINENCE',
    tags: ['Beige', 'Black'],
    image:
      'https://images.unsplash.com/photo-1598331668826-20cecccfd8ae?w=900&h=900&fit=crop&q=85',
    bgClass: homePromoBgPresets[3].bgClass,
    imageOverlap: true,
    shopNowLink: '/#explore-products',
  },
]

/** @type {{ autoplayDelay: number }} */
export const defaultHomePromoCarouselSettings = {
  autoplayDelay: 5500,
}
