import { useState } from 'react'
import ProductReviewsPanel from './ProductReviewsPanel'

const staticTabs = [
  {
    id: 'desc',
    label: 'Video Description',
    body:
      'See product highlights and setup guidance in the embedded overview—perfect for getting started quickly with ideal ergonomics and compatibility.',
  },
  {
    id: 'info',
    label: 'Additional Info',
    body:
      'Materials: durable polymer shell · Connectivity: USB-C / wireless options · Warranty: 1-year manufacturer · Package contents: device, cable, quick-start guide.',
  },
]

export default function ProductDetailTabs({ productId, productTitle }) {
  const [tab, setTab] = useState('desc')
  const tabs = [...staticTabs, { id: 'reviews', label: 'Reviews' }]

  const activeStatic = staticTabs.find((t) => t.id === tab)

  return (
    <div className="mt-14 border-t border-app-border pt-10">
      <div className="flex flex-wrap gap-8 border-b border-app-border pb-4">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              'relative pb-4 text-base transition',
              tab === id
                ? 'font-medium text-exclusive-dark after:absolute after:inset-x-0 after:bottom-[-17px] after:h-[3px] after:bg-exclusive-red'
                : 'text-exclusive-muted hover:text-exclusive-dark',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'reviews' ? (
        <div className="mt-8">
          <ProductReviewsPanel productId={productId} productTitle={productTitle} />
        </div>
      ) : (
        <p className="mt-8 max-w-4xl leading-relaxed text-exclusive-muted">{activeStatic?.body}</p>
      )}
    </div>
  )
}
