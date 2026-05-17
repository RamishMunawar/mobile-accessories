/** @typedef {import('./products').Product} Product */

/** @type {Product[]} */
export const defaultFlashProducts = [
  {
    id: 'flash-wireless-earbuds',
    title: 'Pro Wireless Earbuds',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&q=80',
    price: 89,
    oldPrice: 129,
    discount: 31,
    rating: 4.8,
    reviews: 214,
    badge: 'sale',
    colors: ['#111', '#f5f5f5'],
    freeShip: true,
  },
  {
    id: 'flash-usb-c-cable',
    title: '100W USB-C Braided Cable',
    image:
      'https://images.unsplash.com/photo-1583863788437-e58a162be1e5?w=600&h=600&fit=crop&q=80',
    price: 19,
    oldPrice: 29,
    discount: 34,
    rating: 4.6,
    reviews: 98,
    badge: 'sale',
    freeShip: true,
  },
  {
    id: 'flash-power-bank',
    title: '20,000mAh Power Bank',
    image:
      'https://images.unsplash.com/photo-1609091839319-d692648f7042?w=600&h=600&fit=crop&q=80',
    price: 49,
    oldPrice: 69,
    discount: 29,
    rating: 4.7,
    reviews: 156,
    badge: 'new',
    freeShip: true,
  },
  {
    id: 'flash-phone-case',
    title: 'Shockproof Clear Case',
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07ae3f7?w=600&h=600&fit=crop&q=80',
    price: 24,
    rating: 4.5,
    reviews: 72,
    badge: 'new',
  },
]

/** @type {Product[]} */
export const defaultBestProducts = [
  {
    id: 'best-smart-watch',
    title: 'Series X Smart Watch',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
    price: 199,
    rating: 4.9,
    reviews: 412,
    freeShip: true,
  },
  {
    id: 'best-over-ear',
    title: 'Studio Over-Ear Headphones',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
    price: 149,
    oldPrice: 189,
    discount: 21,
    rating: 4.8,
    reviews: 287,
    badge: 'sale',
    freeShip: true,
  },
  {
    id: 'best-charger',
    title: 'GaN 65W Fast Charger',
    image:
      'https://images.unsplash.com/photo-1591290619769-c588f185457b?w=600&h=600&fit=crop&q=80',
    price: 39,
    rating: 4.7,
    reviews: 163,
  },
  {
    id: 'best-screen-protector',
    title: 'Tempered Glass 2-Pack',
    image:
      'https://images.unsplash.com/photo-1601784551446-20c9e07ae3f7?w=600&h=600&fit=crop&q=80',
    price: 14,
    rating: 4.4,
    reviews: 89,
  },
]

/** @type {Product[]} */
export const defaultExploreProducts = [
  {
    id: 'explore-magsafe',
    title: 'MagSafe Wireless Charger',
    image:
      'https://images.unsplash.com/photo-1591290619769-c588f185457b?w=600&h=600&fit=crop&q=80',
    price: 34,
    rating: 4.6,
    reviews: 201,
    freeShip: true,
  },
  {
    id: 'explore-car-mount',
    title: 'Magnetic Car Mount',
    image:
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&q=80',
    price: 22,
    rating: 4.5,
    reviews: 134,
  },
  {
    id: 'explore-buds-lite',
    title: 'Buds Lite — Midnight',
    image:
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop&q=80',
    price: 59,
    oldPrice: 79,
    discount: 25,
    rating: 4.7,
    reviews: 178,
    badge: 'sale',
  },
  {
    id: 'explore-laptop-stand',
    title: 'Aluminum Laptop Stand',
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91d51a46e?w=600&h=600&fit=crop&q=80',
    price: 45,
    rating: 4.8,
    reviews: 96,
    freeShip: true,
  },
]

/** @returns {{ flash: Product[]; best: Product[]; explore: Product[] }} */
export function getDefaultProductsBundle() {
  return {
    flash: defaultFlashProducts.map((p) => ({ ...p })),
    best: defaultBestProducts.map((p) => ({ ...p })),
    explore: defaultExploreProducts.map((p) => ({ ...p })),
  }
}
