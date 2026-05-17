import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductReviewForm from '../product/ProductReviewForm'
import { IconTrash } from '../ui/Icons'

/**
 * @param {{
 *   product: { id: string; title: string; image: string; price: number }
 *   qty: number
 *   onQtyChange: (next: number) => void
 *   onRemove: () => void
 * }} props
 */
export default function CartLineRow({ product, qty, onQtyChange, onRemove }) {
  const [reviewOpen, setReviewOpen] = useState(false)
  const lineTotal = product.price * qty

  return (
    <div className="border-b border-app-border py-6 last:border-b-0">
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] md:items-center md:gap-6">
        <div className="flex gap-4">
          <Link
            to={`/product/${product.id}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-app-muted md:h-14 md:w-14"
          >
            <img src={product.image} alt="" className="h-full w-full object-cover" loading="lazy" />
          </Link>
          <div className="min-w-0 flex flex-col justify-center">
            <Link
              to={`/product/${product.id}`}
              className="font-medium text-exclusive-dark hover:text-exclusive-red"
            >
              {product.title}
            </Link>
            <button
              type="button"
              onClick={() => setReviewOpen((open) => !open)}
              className="mt-1.5 w-fit text-sm font-medium text-exclusive-red underline underline-offset-2 hover:text-exclusive-red-soft"
            >
              {reviewOpen ? 'Hide review form' : 'Write a review'}
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="mt-2 flex w-fit items-center gap-1 text-sm text-exclusive-red underline underline-offset-2 md:hidden"
            >
              <IconTrash className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between md:block md:text-center">
          <span className="text-sm text-exclusive-muted md:hidden">Price</span>
          <span className="font-medium">${product.price}</span>
        </div>

        <div className="flex items-center justify-between gap-4 md:justify-center">
          <span className="text-sm text-exclusive-muted md:hidden">Quantity</span>
          <div className="flex items-center overflow-hidden rounded-md border border-app-border-strong">
            <button
              type="button"
              className="px-3 py-2 text-lg leading-none hover:bg-app-muted disabled:opacity-40"
              disabled={qty <= 1}
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[44px] border-x border-app-border-strong py-2 text-center tabular-nums">
              {qty.toString().padStart(2, '0')}
            </span>
            <button
              type="button"
              className="px-3 py-2 text-lg leading-none hover:bg-app-muted"
              onClick={() => onQtyChange(qty + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between md:text-center">
          <span className="text-sm text-exclusive-muted md:hidden">Subtotal</span>
          <span className="font-medium">${lineTotal}</span>
        </div>

        <div className="hidden md:flex md:justify-end">
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full p-2 text-exclusive-muted transition hover:bg-app-muted hover:text-exclusive-red"
            aria-label={`Remove ${product.title}`}
          >
            <IconTrash className="h-5 w-5" />
          </button>
        </div>
      </div>

      {reviewOpen ? (
        <div className="mt-4 md:ml-[4.5rem] md:max-w-lg">
          <ProductReviewForm
            productId={product.id}
            productTitle={product.title}
            compact
            onSuccess={() => setReviewOpen(false)}
          />
        </div>
      ) : null}
    </div>
  )
}
