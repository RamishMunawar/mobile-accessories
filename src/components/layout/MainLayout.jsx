import { Outlet } from 'react-router-dom'
import { WishlistProvider } from '../../context/WishlistContext'
import { CartProvider } from '../../context/CartContext'
import { ReviewsProvider } from '../../context/ReviewsContext'
import { useHashScroll } from '../../hooks/useHashScroll'
import { useScrollRevealLayout } from '../../hooks/useScrollRevealLayout'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout() {
  useHashScroll()
  useScrollRevealLayout()

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
