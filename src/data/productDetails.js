/**
 * PDP-specific fields merged over catalog rows — aligns with Exclusive/Figma layout patterns.
 * Images reuse catalogue hero plus alternate crops where helpful.
 */

/** @typedef {{ trail: string[]; gallery: string[]; description: string; sizes?: string[]; colorOptions?: { label: string; hex: string }[] }} ProductDetailExtra */

/** @type {Record<string, ProductDetailExtra>} */
export const productDetailExtras = {
  f1: {
    trail: ['Home', 'Gaming', 'Havit HV-G69 Gamepad'],
    gallery: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592840496694-26d035b32b12?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1578318518879-e073163816bc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540380738299-ac098bfecf53?w=800&h=800&fit=crop',
    ],
    description:
      'Elevate your play experience with ergonomic grips, responsive buttons, and long-lasting wireless connectivity — tuned for competitive titles.',
    sizes: ['S', 'M', 'L', 'XL'],
    colorOptions: [
      { label: 'Black', hex: '#000000' },
      { label: 'White', hex: '#FFFFFF' },
    ],
  },
  f2: {
    trail: ['Home', 'Electronics', 'AK-900 Wired Keyboard'],
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dcc79888602d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1618384887929-f16fd994edb8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=800&fit=crop',
    ],
    description:
      'Mechanical-feeling keystrokes with whisper-quiet caps—perfect for office productivity by day and gaming by night.',
  },
  f3: {
    trail: ['Home', 'Electronics', 'IPS LCD Gaming Monitor'],
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585792814688-f559bffcec81?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1537439877179-cebbf726498d?w=800&h=800&fit=crop',
    ],
    description:
      'Ultra-clear IPS panel with low latency modes built for smooth FPS sessions.',
    sizes: ['21"', '24"', '27"'],
  },
  f4: {
    trail: ['Home', 'Lifestyle', 'S-Series Comfort Chair'],
    gallery: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop',
    ],
    description:
      'Ergonomic lumbar support and breathable mesh keep you comfortable during long sessions.',
    colorOptions: [
      { label: 'Grey', hex: '#9CA3AF' },
      { label: 'Black', hex: '#111827' },
    ],
  },
}

/**
 * @param {string} productId
 * @param {import('./products').Product | undefined} base
 */
export function resolveProductDetail(productId, base) {
  const extra = productDetailExtras[productId]
  const gallery =
    extra?.gallery ?? (base?.image ? [base.image, base.image, base.image] : [])
  const trail =
    extra?.trail ??
    (base?.title ? ['Home', base.title] : ['Home', 'Product'])

  return {
    trail,
    gallery,
    description:
      extra?.description ??
      'Premium quality built for everyday life—crafted with durable materials and thoughtful details.',
    sizes: extra?.sizes,
    colorOptions: extra?.colorOptions,
  }
}
