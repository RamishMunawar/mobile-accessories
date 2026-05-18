import { smartWatchCategories } from './smartWatchCategories'

/** Main nav "Smart Watches" dropdown — same categories as admin & category pages. */
export const smartWatchesNavDropdownItems = smartWatchCategories.map((c) => ({
  label: c.label,
  slug: c.slug,
  to: c.to,
}))
