/** @typedef {{
 *   enabled: boolean
 *   eyebrow: string
 *   titleLine1: string
 *   titleLine2: string
 *   description: string
 *   image: string
 *   countdownEndsAt: string
 *   ctaLabel: string
 *   ctaHref: string
 *   secondaryLabel: string
 *   secondaryHref: string
 * }} PromoBannerBundle */

const defaultCountdownEnd = () =>
  new Date(Date.now() + 86400000 * 2 + 3600000 * 8).toISOString()

/** Bundled defaults when admin has not saved yet. */
export const defaultPromoBanner = /** @type {PromoBannerBundle} */ ({
  enabled: true,
  eyebrow: 'Categories',
  titleLine1: 'Enhance Your',
  titleLine2: 'Music Experience',
  description:
    'Premium speakers and headphones at special prices. Offer ends when the timer hits zero.',
  image:
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e2?w=800&h=800&fit=crop&q=80',
  countdownEndsAt: defaultCountdownEnd(),
  ctaLabel: 'Buy Now!',
  ctaHref: '/#explore-products',
  secondaryLabel: 'Browse categories',
  secondaryHref: '/#browse-by-category',
})

export { defaultCountdownEnd }
