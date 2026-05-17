import { getMergedProducts } from '../site/siteStore'
import { useSiteUpdate } from './useSiteUpdate'

export function useMergedProducts() {
  useSiteUpdate()
  return getMergedProducts()
}
