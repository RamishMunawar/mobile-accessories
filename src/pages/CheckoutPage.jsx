import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useProductIndex } from '../hooks/useProductIndex'
import { formatPrice } from '../utils/formatPrice'
import { readCartLinesFromStorage } from '../utils/readCartLines'

const inputClass =
  'mt-2 w-full rounded-md bg-app-muted px-4 py-3 text-base text-exclusive-dark outline-none ring-1 ring-transparent transition placeholder:text-exclusive-muted focus:bg-app-card focus:ring-2 focus:ring-exclusive-red/25'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const productIndex = useProductIndex()
  const [lines] = useState(() => {
    const buy = state?.buyNow
    if (buy && typeof buy.productId === 'string' && typeof buy.qty === 'number') {
      return [{ productId: buy.productId, qty: Math.max(1, buy.qty) }]
    }
    return readCartLinesFromStorage()
  })

  const resolved = useMemo(() => {
    return lines
      .map((line) => {
        const product = productIndex[line.productId]
        return product ? { ...line, product } : null
      })
      .filter(Boolean)
  }, [lines, productIndex])

  const subtotal = resolved.reduce((s, l) => s + l.product.price * l.qty, 0)
  const shipping = 0
  const total = subtotal + shipping

  const [payment, setPayment] = useState('card')

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/order/success')
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-exclusive-muted">
        <Link to="/" className="hover:text-exclusive-dark">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link to="/cart" className="hover:text-exclusive-dark">
          Cart
        </Link>
        <span aria-hidden>/</span>
        <span className="text-exclusive-dark">Checkout</span>
      </nav>

      <h1 className="font-display text-2xl font-semibold md:text-3xl">Billing Details</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start xl:gap-16"
      >
        <div className="space-y-12">
          <section aria-labelledby="billing-heading">
            <h2 id="billing-heading" className="sr-only">
              Billing address
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                First Name<span className="text-exclusive-red">*</span>
                <input name="firstName" required autoComplete="given-name" className={inputClass} />
              </label>
              <label className="block text-sm font-medium">
                Last Name<span className="text-exclusive-red">*</span>
                <input name="lastName" required autoComplete="family-name" className={inputClass} />
              </label>
            </div>
            <label className="mt-6 block text-sm font-medium">
              Company Name
              <input name="company" autoComplete="organization" className={inputClass} />
            </label>
            <label className="mt-6 block text-sm font-medium">
              Street Address<span className="text-exclusive-red">*</span>
              <input name="street" required autoComplete="street-address" className={inputClass} />
            </label>
            <label className="mt-6 block text-sm font-medium">
              Apartment, floor, suite, etc. (optional)
              <input name="apartment" autoComplete="address-line2" className={inputClass} />
            </label>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Town / City<span className="text-exclusive-red">*</span>
                <input name="city" required autoComplete="address-level2" className={inputClass} />
              </label>
              <label className="block text-sm font-medium">
                Phone Number<span className="text-exclusive-red">*</span>
                <input name="phone" required type="tel" autoComplete="tel" className={inputClass} />
              </label>
            </div>
            <label className="mt-6 block text-sm font-medium">
              Email Address<span className="text-exclusive-red">*</span>
              <input name="email" required type="email" autoComplete="email" className={inputClass} />
            </label>
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
              <input
                name="saveInfo"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-app-border-strong text-exclusive-red focus:ring-exclusive-red"
              />
              <span>Save this information for faster check-out next time</span>
            </label>
          </section>

          <section aria-labelledby="payment-heading" className="border-t border-app-border pt-12">
            <h2 id="payment-heading" className="font-display text-xl font-semibold">
              Payment Method
            </h2>
            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-center gap-4 rounded-md border border-app-border-strong p-4 has-[:checked]:border-exclusive-red has-[:checked]:ring-1 has-[:checked]:ring-exclusive-red/30">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={payment === 'card'}
                  onChange={() => setPayment('card')}
                  className="h-4 w-4 border-app-border-heavy text-exclusive-red focus:ring-exclusive-red"
                />
                <span className="font-medium">Bank card (Visa / Mastercard)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-4 rounded-md border border-app-border-strong p-4 has-[:checked]:border-exclusive-red has-[:checked]:ring-1 has-[:checked]:ring-exclusive-red/30">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                  className="h-4 w-4 border-app-border-heavy text-exclusive-red focus:ring-exclusive-red"
                />
                <span className="font-medium">Cash on delivery</span>
              </label>
            </div>

            {payment === 'card' ? (
              <div className="mt-8 space-y-6 border-t border-app-border pt-8">
                <label className="block text-sm font-medium">
                  Name on card<span className="text-exclusive-red">*</span>
                  <input name="cardName" required={payment === 'card'} className={inputClass} />
                </label>
                <label className="block text-sm font-medium">
                  Card Number<span className="text-exclusive-red">*</span>
                  <input
                    name="cardNumber"
                    required={payment === 'card'}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className={inputClass}
                  />
                </label>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Expiry (MM/YY)<span className="text-exclusive-red">*</span>
                    <input
                      name="cardExpiry"
                      required={payment === 'card'}
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    CVC<span className="text-exclusive-red">*</span>
                    <input
                      name="cardCvc"
                      required={payment === 'card'}
                      autoComplete="cc-csc"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-md border border-app-border p-6 shadow-sm ring-1 ring-app-ring">
            <h2 className="font-display text-xl font-semibold">Order Summary</h2>
            <ul className="mt-6 space-y-4 border-b border-app-border pb-6">
              {resolved.length === 0 ? (
                <li className="text-sm text-exclusive-muted">No items. Add products from the cart.</li>
              ) : (
                resolved.map((line) => (
                  <li key={line.productId} className="flex gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-app-muted">
                      <img
                        src={line.product.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{line.product.title}</p>
                      <p className="mt-1 text-sm text-exclusive-muted">
                        {line.qty} × {formatPrice(line.product.price)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatPrice(line.product.price * line.qty)}
                    </span>
                  </li>
                ))
              )}
            </ul>
            <div className="mt-6 space-y-4 text-base">
              <div className="flex justify-between gap-4">
                <span className="text-exclusive-muted">Subtotal:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-exclusive-muted">Shipping:</span>
                <span className="font-medium text-exclusive-green">Free</span>
              </div>
              <div className="border-t border-app-border pt-4">
                <div className="flex justify-between gap-4 text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-8 justify-center py-3"
              disabled={resolved.length === 0}
            >
              Place Order
            </Button>
          </div>
        </aside>
      </form>
    </div>
  )
}
