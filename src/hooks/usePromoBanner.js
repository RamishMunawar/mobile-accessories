import { getMergedPromoBanner } from '../site/siteStore'
import { useSiteUpdate } from './useSiteUpdate'

export function usePromoBanner() {
  useSiteUpdate()
  return getMergedPromoBanner()
}
