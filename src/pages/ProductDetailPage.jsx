import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useProductReviewStats } from '../hooks/useProductReviewStats'
import { formatReviewCountShort } from '../utils/reviewHelpers'
import { isProductSoldOut, ProductBadge, ProductStockLabel } from '../components/product/ProductBadge'
import ProductBenefitsStrip from '../components/product/ProductBenefitsStrip'
import ProductCard from '../components/product/ProductCard'
import { GlowingCard, GlowingCards } from '../components/ui/GlowingCards'
import ProductDetailTabs from '../components/product/ProductDetailTabs'
import ProductGallery from '../components/product/ProductGallery'
import { Button, ButtonLink } from '../components/ui/Button'
import { IconHeart } from '../components/ui/Icons'
import SectionHeading from '../components/ui/SectionHeading'
import Stars from '../components/ui/Stars'
import { relatedProducts } from '../data/productCatalog'
import { useProductIndex } from '../hooks/useProductIndex'
import { resolveProductDetail } from '../data/productDetails'
import { cn } from '../utils/cn'

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const productIndex = useProductIndex()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const base = productId ? productIndex[productId] : undefined
  const reviewStats = useProductReviewStats(productId, base?.rating, base?.reviews)

  const detail = useMemo(
    () => (productId && base ? resolveProductDetail(productId, base) : null),
    [productId, base],
  )

  const [qty, setQty] = useState(1)
  const [colorIx, setColorIx] = useState(0)
  const [sizeIx, setSizeIx] = useState(0)

  if (!productId || !base || !detail) {
    return <Navigate to="/" replace />
  }

  const related = relatedProducts(productId, 4)

  const lineTotal = base.price * qty
  const lineOldTotal = base.oldPrice != null ? base.oldPrice * qty : null
  const soldOut = isProductSoldOut(base.badge)

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap gap-2 text-sm text-exclusive-muted">
        {detail.trail.map((crumb, i) => (
          <span key={`${crumb}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {i < detail.trail.length - 1 ? (
              <Link to={i === 0 ? '/' : '#'} className="hover:text-exclusive-dark">
                {crumb}
              </Link>
            ) : (
              <span className="text-exclusive-dark">{crumb}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16 xl:grid-cols-[minmax(0,560px)_minmax(0,460px)]">
        <ProductGallery images={detail.gallery} title={base.title} />

        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{base.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <Stars rating={reviewStats.rating} />
            <span className="text-exclusive-muted">
              ({formatReviewCountShort(reviewStats.reviewCount)})
            </span>
            <span className="text-exclusive-muted" aria-hidden>
              |
            </span>
            {base.badge === 'sold-out' ? (
              <ProductBadge badge="sold-out" />
            ) : (
              <>
                {base.badge === 'new' || base.badge === 'sale' ? (
                  <ProductBadge badge={base.badge} />
                ) : null}
                <ProductStockLabel badge={base.badge} />
              </>
            )}
          </div>

          <div className="mt-6 border-y border-app-border py-6">
            <p className="font-display text-2xl font-medium">
              <span className="text-exclusive-red">${lineTotal}</span>
              {lineOldTotal != null ? (
                <span className="ml-2 text-xl font-normal text-exclusive-muted line-through">${lineOldTotal}</span>
              ) : null}
            </p>
            {qty > 1 ? (
              <p className="mt-2 text-sm text-exclusive-muted">
                ${base.price} each × {qty}
              </p>
            ) : null}
          </div>

          <p className="mt-6 leading-relaxed text-exclusive-muted">{detail.description}</p>

          {detail.colorOptions?.length ? (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">Colours:</p>
              <div className="flex flex-wrap gap-3">
                {detail.colorOptions.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setColorIx(i)}
                    aria-label={c.label}
                    className={[
                      'h-8 w-8 rounded-full ring-2 ring-offset-2',
                      colorIx === i ? 'ring-exclusive-red' : 'ring-transparent hover:ring-app-border-strong',
                    ].join(' ')}
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex.toUpperCase() === '#FFFFFF' ? '1px solid rgba(0,0,0,.15)' : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {detail.sizes?.length ? (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">Size:</p>
              <div className="flex flex-wrap gap-3">
                {detail.sizes.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeIx(i)}
                    className={[
                      'min-w-[3rem] rounded-md border px-4 py-2 text-sm font-medium transition',
                      sizeIx === i
                        ? 'border-exclusive-red bg-exclusive-red text-white'
                        : 'border-app-border-strong hover:border-exclusive-red/40',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center overflow-hidden rounded-md border border-app-border-strong">
              <button
                type="button"
                className="px-4 py-2 text-lg leading-none hover:bg-app-muted disabled:opacity-40"
                disabled={soldOut || qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[52px] border-x border-app-border-strong py-2 text-center tabular-nums">
                {qty.toString().padStart(2, '0')}
              </span>
              <button
                type="button"
                className="px-4 py-2 text-lg leading-none hover:bg-app-muted disabled:opacity-40"
                disabled={soldOut}
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={soldOut}
                onClick={() => {
                  if (soldOut) return
                  navigate('/checkout', {
                    state: { buyNow: { productId, qty: Math.max(1, qty) } },
                  })
                }}
              >
                {soldOut ? 'Sold out' : 'Buy Now'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-app-border-heavy px-8"
                disabled={soldOut}
                onClick={() => {
                  if (soldOut || !productId) return
                  addToCart(productId, Math.max(1, qty))
                }}
              >
                Add to cart
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className={cn(
                  'gap-2 border-app-border-heavy px-8',
                  isInWishlist(productId) && 'border-exclusive-red/50 text-exclusive-red',
                )}
                onClick={() => toggleWishlist(productId)}
                aria-pressed={isInWishlist(productId)}
              >
                <IconHeart className={cn('h-5 w-5', isInWishlist(productId) && 'fill-current')} />
                {isInWishlist(productId) ? 'Saved' : 'Wishlist'}
              </Button>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-12">
        <ProductBenefitsStrip />
      </div>

      <ProductDetailTabs productId={productId} productTitle={base.title} />

      <section className="mt-20 border-t border-app-border pt-16">
        <SectionHeading
          eyebrow="Related Items"
          title="Related Products"
          action={
            <ButtonLink to="/" variant="outline" size="sm">
              View All
            </ButtonLink>
          }
        />
        <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
          {related.map((p) => (
            <GlowingCard
              key={p.id}
              className="w-full min-w-0 shrink-0 basis-full p-0 sm:max-w-[calc(50%-0.75rem)] sm:basis-[calc(50%-0.75rem)] lg:max-w-[calc((100%-4.5rem)/4)] lg:basis-[calc((100%-4.5rem)/4)]"
              glowColor="#db4444"
            >
              <ProductCard embedded {...p} productLink={`/product/${p.id}`} />
            </GlowingCard>
          ))}
        </GlowingCards>
      </section>
    </div>
  )
}
