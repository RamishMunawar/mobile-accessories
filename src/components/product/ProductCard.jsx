import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { IconButton } from '../ui/IconButton'
import { IconCart, IconEye, IconHeart } from '../ui/Icons'
import Stars from '../ui/Stars'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/formatPrice'
import { useProductReviewStats } from '../../hooks/useProductReviewStats'
import { isProductSoldOut, ProductBadge } from './ProductBadge'

export default function ProductCard({
  id,
  title,
  image,
  price,
  oldPrice,
  discount,
  rating,
  reviews,
  badge,
  colors,
  freeShip,
  productLink,
  /** When nested in `GlowingCard`, skips outer chrome so glow frame shows correctly. */
  embedded = false,
}) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { rating: displayRating, reviewCount } = useProductReviewStats(id, rating, reviews)
  const inWishlist = id ? isInWishlist(id) : false
  const soldOut = isProductSoldOut(badge)
  const hasTextBadge = badge === 'new' || badge === 'sale' || badge === 'sold-out'
  const showTopBadges = Boolean(discount || hasTextBadge || freeShip)

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col bg-app-card',
        embedded
          ? 'overflow-hidden rounded-2xl shadow-none ring-0'
          : 'rounded-md shadow-sm ring-1 ring-app-ring transition hover:shadow-md',
      )}
    >
      <div
        className={cn(
          'relative aspect-square overflow-hidden bg-app-muted',
          embedded ? 'rounded-t-2xl' : 'rounded-t-md',
        )}
      >
        {productLink ? (
          <Link
            to={productLink}
            className="absolute inset-0 z-[1]"
            aria-label={`View ${title}`}
          />
        ) : null}
        {showTopBadges ? (
          <div className="absolute left-3 top-3 z-[2] flex max-w-[calc(100%-4rem)] flex-col items-start gap-1.5">
            {discount ? (
              <span className="rounded bg-exclusive-red px-2 py-1 text-xs font-medium text-white shadow-sm">
                -{discount}%
              </span>
            ) : null}
            {freeShip ? (
              <span className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-sky-500">
                Free ship
              </span>
            ) : null}
            <ProductBadge badge={badge} />
          </div>
        ) : null}
        <img
          src={image}
          alt=""
          className="relative z-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute right-2 top-2 z-[2] flex flex-col gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          {id ? (
            <IconButton
              variant="elevated"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(inWishlist && 'text-exclusive-red')}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(id)
              }}
            >
              <IconHeart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
            </IconButton>
          ) : null}
          {id ? (
            <IconButton
              variant="elevated"
              aria-label={soldOut ? 'Sold out' : 'Add to cart'}
              disabled={soldOut}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (soldOut) return
                addToCart(id, 1)
              }}
            >
              <IconCart className="h-4 w-4" />
            </IconButton>
          ) : null}
          {productLink ? (
            <Link
              to={productLink}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-app-card shadow ring-1 ring-app-ring transition hover:bg-app-muted"
              aria-label="Quick view"
            >
              <IconEye className="h-4 w-4" />
            </Link>
          ) : (
            <IconButton variant="elevated" aria-label="Quick view">
              <IconEye className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>
      <div
        className={cn(
          'relative z-[2] flex flex-1 flex-col gap-2 p-4',
          embedded && 'rounded-b-2xl',
        )}
      >
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug">
          {productLink ? (
            <Link to={productLink} className="hover:text-exclusive-red">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-exclusive-red">{formatPrice(price)}</span>
          {oldPrice ? (
            <span className="text-sm text-exclusive-muted line-through">{formatPrice(oldPrice)}</span>
          ) : null}
        </div>
        {colors?.length ? (
          <div className="flex gap-2 pt-1">
            {colors.map((c) => (
              <span
                key={c}
                className="h-5 w-5 rounded-full ring-2 ring-app-card ring-offset-1 ring-offset-app-muted"
                style={{ backgroundColor: c }}
                aria-hidden
              />
            ))}
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Stars rating={displayRating} />
          <span className="text-xs text-exclusive-muted">({reviewCount})</span>
        </div>
      </div>
    </article>
  )
}
