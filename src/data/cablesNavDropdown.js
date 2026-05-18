import { cableCategories } from './cableCategories'

/** Main nav "Cables" dropdown — each link filters the cables page. */
export const cablesNavDropdownItems = cableCategories.map((c) => ({
  label: c.label,
  type: c.slug,
  to: c.slug === 'all' ? '/cables' : `/cables?type=${c.slug}`,
}))
