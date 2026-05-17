import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { persistWishlistIds, readWishlistIdsFromStorage } from '../utils/wishlistStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => readWishlistIdsFromStorage())

  useEffect(() => {
    persistWishlistIds(ids)
  }, [ids])

  const addToWishlist = useCallback((id) => {
    if (!id || typeof id !== 'string') return
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeFromWishlist = useCallback((id) => {
    setIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const toggleWishlist = useCallback((id) => {
    if (!id || typeof id !== 'string') return
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const clearWishlist = useCallback(() => setIds([]), [])

  const isInWishlist = useCallback((id) => Boolean(id && ids.includes(id)), [ids])

  const value = useMemo(
    () => ({
      ids,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      isInWishlist,
    }),
    [ids, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, isInWishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return ctx
}
