import { batteryCategories } from './batteryCategories'

/** Main nav "Batteries" dropdown — each link filters the batteries page. */
export const batteriesNavDropdownItems = batteryCategories.map((c) => ({
  label: c.label,
  type: c.slug,
  to: c.slug === 'all' ? '/batteries' : `/batteries?type=${c.slug}`,
}))
