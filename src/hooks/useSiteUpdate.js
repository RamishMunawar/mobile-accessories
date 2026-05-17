import { useEffect, useState } from 'react'
import { subscribeSite } from '../site/siteStore'

/** Increments when hero/products overrides change so components can re-read merged catalog. */
export function useSiteUpdate() {
  const [v, setV] = useState(0)
  useEffect(() => {
    const bump = () => setV((n) => n + 1)
    return subscribeSite(bump)
  }, [])
  return v
}
