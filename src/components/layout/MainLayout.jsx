import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { hydrateSiteFromApi } from '../../api/hydrateSite'
import { WishlistProvider } from '../../context/WishlistContext'
import { CartProvider } from '../../context/CartContext'
import { ReviewsProvider } from '../../context/ReviewsContext'
import { isApiConfigured } from '../../config/env'
import { useHashScroll } from '../../hooks/useHashScroll'
import { useScrollRevealLayout } from '../../hooks/useScrollRevealLayout'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout() {
  useHashScroll()
  useScrollRevealLayout()

  useEffect(() => {
    if (!isApiConfigured()) return undefined
    let cancelled = false
    hydrateSiteFromApi().catch(() => {
      if (!cancelled) {
        // Storefront still works from localStorage defaults
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <WishlistProvider>
      <CartProvider>
        <ReviewsProvider>
          <Header />
          <main className="overflow-x-clip">
            <Outlet />
          </main>
          <Footer />
        </ReviewsProvider>
      </CartProvider>
    </WishlistProvider>
  )
}
