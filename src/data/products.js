/** @typedef {{ id: string; title: string; image: string; price: number; oldPrice?: number; discount?: number; rating: number; reviews: number; badge?: 'new' | 'sale' | 'sold-out'; colors?: string[]; freeShip?: boolean }} Product */

/** @type {Product[]} — populated via Admin → Homepage sections (localStorage). */
export const flashSaleProducts = []

/** @type {Product[]} */
export const bestSellingProducts = []

/** @type {Product[]} */
export const exploreProducts = []
