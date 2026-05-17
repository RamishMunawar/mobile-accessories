import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getProductIndex } from '../data/productCatalog'
import { isProductSoldOut } from '../components/product/ProductBadge'
import { persistCartLines, readCartLinesFromStorage } from '../utils/readCartLines'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => readCartLinesFromStorage())

  useEffect(() => {
    persistCartLines(lines)
  }, [lines])

  const addToCart = useCallback((productId, qty = 1) => {
    if (!productId || typeof productId !== 'string') return
    const product = getProductIndex()[productId]
    if (product && isProductSoldOut(product.badge)) return
    const n = Math.max(1, typeof qty === 'number' && !Number.isNaN(qty) ? qty : 1)
    setLines((prev) => {
      const ix = prev.findIndex((l) => l.productId === productId)
      if (ix === -1) return [...prev, { productId, qty: n }]
      const next = [...prev]
      next[ix] = { ...next[ix], qty: next[ix].qty + n }
      return next
    })
  }, [])

  const updateLineQty = useCallback((productId, qty) => {
    const q = Math.max(1, qty)
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty: q } : l)),
    )
  }, [])

  const removeLine = useCallback((productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const itemCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines])

  const value = useMemo(
    () => ({
      lines,
      addToCart,
      updateLineQty,
      removeLine,
      clearCart,
      itemCount,
    }),
    [lines, addToCart, updateLineQty, removeLine, clearCart, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
