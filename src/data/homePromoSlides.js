/**
 * Home hero promo carousel — premium card slides (headphones / earbuds).
 * Images are high-res placeholders; swap URLs in Admin later if wired to CMS.
 */

/** @typedef {{ id: string; badge?: string; badgeAccent?: boolean; model: string; title: string; titleGradient?: boolean; tags: string[]; image: string; bgClass: string; imageOverlap?: boolean }} HomePromoSlide */

/** @type {HomePromoSlide[]} */
export const homePromoSlides = [
  {
    id: 'magnus',
    badge: 'Software Based Headphones',
    badgeAccent: true,
    model: 'R-1520',
    title: 'MAGNUS',
    tags: ['Active Noise Cancellation', 'Mood Tuned Sound'],
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop&q=85',
    bgClass:
      'bg-gradient-to-br from-amber-900/95 via-neutral-900 to-stone-950 ring-1 ring-white/[0.08]',
    imageOverlap: true,
  },
  {
    id: 'hurricane',
    badge: 'Software Based Headphones',
    model: 'R-1515',
    title: 'HURRICANE',
    tags: ['Ultra Low Latency', 'USB+Type-C Dongle'],
    image:
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=900&h=900&fit=crop&q=85',
    bgClass:
      'bg-gradient-to-br from-orange-950 via-neutral-950 to-orange-950/80 ring-1 ring-orange-500/25',
    imageOverlap: true,
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
    bgClass:
      'bg-gradient-to-r from-neutral-50 via-neutral-50 to-fuchsia-200 ring-1 ring-neutral-200/90',
    imageOverlap: true,
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
    bgClass:
      'bg-[radial-gradient(ellipse_at_70%_20%,rgba(180,124,62,0.25),transparent_50%)] bg-neutral-950 ring-1 ring-white/[0.1]',
    imageOverlap: true,
  },
]
