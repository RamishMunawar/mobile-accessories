import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import { isProductSoldOut } from '../product/ProductBadge'
import { IconCart, IconTrash } from '../ui/Icons'

/**
 * @param {{
 *   id: string
 *   title: string
 *   image: string
 *   price: number
 *   oldPrice?: number
 *   discount?: number
 *   badge?: 'new' | 'sale' | 'sold-out'
 *   onRemove: () => void
 *   onAddToCart?: () => void
 * }} props
 */
export default function WishlistItemCard({
  id,
  title,
  image,
  price,
  oldPrice,
  discount,
  badge,
  onRemove,
  onAddToCart,
}) {
  const soldOut = isProductSoldOut(badge)
  const hasTextBadge = badge === 'new' || badge === 'sale' || badge === 'sold-out'

  return (
    <div className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-app-muted">
        {discount || hasTextBadge ? (
          <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-4rem)] flex-col items-start gap-1.5">
            {discount ? (
              <span className="rounded bg-exclusive-red px-2 py-1 text-xs font-medium text-white shadow-sm">
                -{discount}%
              </span>
            ) : null}
            {badge === 'new' ? (
              <span className="rounded bg-exclusive-green px-2 py-1 text-xs font-medium text-black shadow-sm">
                NEW
              </span>
            ) : null}
            {badge === 'sale' ? (
              <span className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                Sale
              </span>
            ) : null}
            {badge === 'sold-out' ? (
              <span className="rounded bg-neutral-700 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                Sold out
              </span>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-app-card shadow ring-1 ring-app-ring transition hover:bg-app-muted"
          aria-label={`Remove ${title} from wishlist`}
        >
          <IconTrash className="h-4 w-4" />
        </button>
        <Link
          to={`/product/${id}`}
          className="absolute inset-x-0 top-0 bottom-11 z-[1] block"
          aria-label={title}
        >
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        </Link>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={soldOut}
          className="absolute inset-x-0 bottom-0 z-10 flex h-11 items-center justify-center gap-2 bg-black text-sm font-medium text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:opacity-80"
        >
          <IconCart className="h-4 w-4" />
          {soldOut ? 'Sold out' : 'Add To Cart'}
        </button>
      </div>
      <div className="mt-4">
        <Link
          to={`/product/${id}`}
          className="line-clamp-2 text-base font-medium text-exclusive-dark hover:text-exclusive-red"
        >
          {title}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-exclusive-red">{formatPrice(price)}</span>
          {oldPrice ? (
            <span className="text-sm text-exclusive-muted line-through">{formatPrice(oldPrice)}</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
