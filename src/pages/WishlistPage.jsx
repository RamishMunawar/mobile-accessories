import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import { GlowingCard, GlowingCards } from '../components/ui/GlowingCards'
import { Button, ButtonLink } from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import WishlistItemCard from '../components/wishlist/WishlistItemCard'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useMergedProducts } from '../hooks/useMergedProducts'
import { useProductIndex } from '../hooks/useProductIndex'

export default function WishlistPage() {
  const productIndex = useProductIndex()
  const { explore: exploreProducts } = useMergedProducts()
  const { ids, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [movedNotice, setMovedNotice] = useState(false)

  const items = useMemo(
    () => ids.map((id) => productIndex[id]).filter(Boolean),
    [ids, productIndex],
  )

  const justForYou = useMemo(() => {
    const set = new Set(ids)
    return exploreProducts.filter((p) => !set.has(p.id)).slice(0, 4)
  }, [ids, exploreProducts])

  function moveAllToBag() {
    if (ids.length === 0) return
    ids.forEach((id) => addToCart(id, 1))
    setMovedNotice(true)
    clearWishlist()
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-exclusive-muted">
        <Link to="/" className="hover:text-exclusive-dark">
          Home
        </Link>
        <span aria-hidden>/</span>
        <span className="text-exclusive-dark">Wishlist</span>
      </nav>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">
          Wishlist ({items.length})
        </h1>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={items.length === 0}
          onClick={moveAllToBag}
          className="border-app-border-strong"
        >
          Move All To Bag
        </Button>
      </div>

      {movedNotice ? (
        <p className="mb-8 rounded-md bg-app-muted px-4 py-3 text-sm text-exclusive-dark">
          All wishlist items were added to your cart.
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="py-16 text-center text-exclusive-muted">
          Your wishlist is empty.{' '}
          <Link to="/" className="font-medium text-exclusive-red underline underline-offset-2">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <WishlistItemCard
              key={p.id}
              {...p}
              onRemove={() => removeFromWishlist(p.id)}
              onAddToCart={() => addToCart(p.id, 1)}
            />
          ))}
        </div>
      )}

      <section className="mt-20 border-t border-app-border pt-16">
        <SectionHeading
          title="Just For You"
          action={
            <ButtonLink to="/" variant="outline" size="sm" className="border-app-border-strong">
              See All
            </ButtonLink>
          }
        />
        <GlowingCards maxWidth="100%" padding="0" gap="1.5rem" responsive={false} glowRadius={20}>
          {justForYou.map((p) => (
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
