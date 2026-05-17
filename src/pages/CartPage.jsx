import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CartLineRow from '../components/cart/CartLineRow'
import { Button, ButtonLink } from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import { useProductIndex } from '../hooks/useProductIndex'

export default function CartPage() {
  const productIndex = useProductIndex()
  const { lines, updateLineQty, removeLine } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const resolved = useMemo(() => {
    return lines
      .map((line) => {
        const product = productIndex[line.productId]
        return product ? { ...line, product } : null
      })
      .filter(Boolean)
  }, [lines, productIndex])

  const itemCount = resolved.reduce((s, l) => s + l.qty, 0)

  const subtotal = resolved.reduce((s, l) => s + l.product.price * l.qty, 0)

  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = 0
  const total = Math.max(0, subtotal - discount + shipping)

  function updateQty(productId, next) {
    updateLineQty(productId, next)
  }

  function applyCoupon() {
    if (!coupon.trim()) return
    setCouponApplied(true)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-exclusive-muted">
        <Link to="/" className="hover:text-exclusive-dark">
          Home
        </Link>
        <span aria-hidden>/</span>
        <span className="text-exclusive-dark">Cart</span>
      </nav>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">Cart ({itemCount})</h1>
        <Link to="/" className="text-exclusive-muted underline underline-offset-4 hover:text-exclusive-dark">
          Return To Shop
        </Link>
      </div>

      {resolved.length === 0 ? (
        <div className="rounded-md border border-dashed border-app-border-strong py-20 text-center">
          <p className="text-exclusive-muted">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block font-medium text-exclusive-red underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(280px,380px)] lg:items-start xl:gap-16">
          <div>
            <div className="hidden border-b border-app-border pb-4 md:grid md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] md:gap-6 md:text-xs md:font-medium md:uppercase md:tracking-wide md:text-exclusive-muted">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-center">Subtotal</span>
              <span className="sr-only">Remove</span>
            </div>

            {resolved.map((line) => (
              <CartLineRow
                key={line.productId}
                product={line.product}
                qty={line.qty}
                onQtyChange={(n) => updateQty(line.productId, n)}
                onRemove={() => removeLine(line.productId)}
              />
            ))}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <input
                type="text"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value)
                  setCouponApplied(false)
                }}
                placeholder="Coupon Code"
                className="min-h-[48px] flex-1 rounded-md border border-app-border-strong px-4 text-base outline-none focus:border-exclusive-red/50 focus:ring-2 focus:ring-exclusive-red/20"
              />
              <Button
                type="button"
                variant="outline"
                className="min-h-[48px] shrink-0 border-app-border-heavy px-8"
                onClick={applyCoupon}
              >
                Apply Coupon
              </Button>
            </div>
            {couponApplied ? (
              <p className="mt-3 text-sm text-exclusive-green">Coupon applied (demo −10%).</p>
            ) : null}
          </div>

          <aside className="rounded-md border border-app-border p-6 shadow-sm ring-1 ring-app-ring">
            <h2 className="font-display text-xl font-semibold">Cart Total</h2>
            <div className="mt-6 space-y-4 text-base">
              <div className="flex justify-between gap-4">
                <span className="text-exclusive-muted">Subtotal:</span>
                <span className="font-medium">${subtotal}</span>
              </div>
              {couponApplied ? (
                <div className="flex justify-between gap-4 text-exclusive-green">
                  <span>Discount:</span>
                  <span>−${discount}</span>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <span className="text-exclusive-muted">Shipping:</span>
                <span className="font-medium text-exclusive-green">Free</span>
              </div>
              <div className="border-t border-app-border pt-4">
                <div className="flex justify-between gap-4 text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
            <ButtonLink
              to="/checkout"
              variant="primary"
              fullWidth
              className="mt-8 justify-center py-3"
            >
              Process Checkout
            </ButtonLink>
          </aside>
        </div>
      )}
    </div>
  )
}
