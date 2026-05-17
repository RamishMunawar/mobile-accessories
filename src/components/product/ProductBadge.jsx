import { cn } from '../../utils/cn'

const badgeStyles = {
  new: 'bg-exclusive-green text-black',
  sale: 'bg-amber-500 text-white',
  'sold-out': 'bg-neutral-700 text-white dark:bg-neutral-600',
}

const badgeLabels = {
  new: 'NEW',
  sale: 'Sale',
  'sold-out': 'Sold out',
}

/** @param {'new' | 'sale' | 'sold-out' | undefined} badge */
export function isProductSoldOut(badge) {
  return badge === 'sold-out'
}

/** Pill badge for product cards & detail (matches admin Badge field). */
export function ProductBadge({ badge, className }) {
  if (!badge || !badgeStyles[badge]) return null

  return (
    <span
      className={cn(
        'inline-flex rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm',
        badge === 'new' && 'font-medium normal-case tracking-normal',
        badgeStyles[badge],
        className,
      )}
    >
      {badgeLabels[badge]}
    </span>
  )
}

/** Green “In Stock” line from product detail mock — hidden when sold out. */
export function ProductStockLabel({ badge, className }) {
  if (badge === 'sold-out') {
    return (
      <span className={cn('text-sm font-medium text-exclusive-muted', className)}>Out of stock</span>
    )
  }

  return (
    <span className={cn('text-sm font-medium text-exclusive-green', className)}>In Stock</span>
  )
}
