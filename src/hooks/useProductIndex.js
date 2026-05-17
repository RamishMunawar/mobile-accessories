import { getProductIndex } from '../data/productCatalog'
import { useSiteUpdate } from './useSiteUpdate'

export function useProductIndex() {
  useSiteUpdate()
  return getProductIndex()
}
