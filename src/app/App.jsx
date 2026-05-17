import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import SignUpPage from '../pages/SignUpPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import OrderSuccessPage from '../pages/OrderSuccessPage'
import AboutPage from '../pages/AboutPage'
import AccountPage from '../pages/AccountPage'
import ContactPage from '../pages/ContactPage'
import WishlistPage from '../pages/WishlistPage'
import SmartWatchesCategoryPage from '../pages/SmartWatchesCategoryPage'
import CablesPage from '../pages/CablesPage'
import BatteriesPage from '../pages/BatteriesPage'
import RequireAuth from '../components/auth/RequireAuth'
import RequireAdmin from '../components/admin/RequireAdmin'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminHeroPage from '../pages/admin/AdminHeroPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
import AdminCategoryPagesPage from '../pages/admin/AdminCategoryPagesPage'
import AdminFeaturedArrivalPage from '../pages/admin/AdminFeaturedArrivalPage'
import AdminPromoBannerPage from '../pages/admin/AdminPromoBannerPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="smart-watches/:categoryId" element={<SmartWatchesCategoryPage />} />
            <Route path="cables" element={<CablesPage />} />
            <Route path="batteries" element={<BatteriesPage />} />
            <Route path="order/success" element={<OrderSuccessPage />} />
          </Route>
        </Route>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/login"
          element={<Navigate to="/login" replace state={{ from: '/admin' }} />}
        />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="hero" element={<AdminHeroPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoryPagesPage />} />
            <Route path="featured-arrival" element={<AdminFeaturedArrivalPage />} />
            <Route path="promo-banner" element={<AdminPromoBannerPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
