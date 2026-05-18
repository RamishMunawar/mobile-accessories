import { useId, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { getMergedProducts, setMergedProducts } from '../../site/siteStore'
import AdminProductGalleryFields from '../../components/admin/AdminProductGalleryFields'
import { uploadAdminImage } from '../../utils/uploadAdminImage'
import { patchProductMainImage } from '../../utils/productGallery'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader, AdminSegmentedTabs } from './AdminUi'

/** @typedef {'flash' | 'best' | 'explore'} SectionKey */

/** @returns {import('../../data/products').Product} */
function emptyProduct() {
  return {
    id: `new-${Date.now()}`,
    title: 'New product',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    price: 99,
    rating: 4,
    reviews: 0,
  }
}

/** @param {import('../../data/products').Product} p */
function cloneProduct(p) {
  return {
    ...p,
    colors: p.colors ? [...p.colors] : undefined,
    gallery: p.gallery ? [...p.gallery] : undefined,
  }
}

export default function AdminProductsPage() {
  const baseId = useId()
  const [tab, setTab] = useState(/** @type {SectionKey} */ ('flash'))
  const [flash, setFlash] = useState(() => getMergedProducts().flash.map(cloneProduct))
  const [best, setBest] = useState(() => getMergedProducts().best.map(cloneProduct))
  const [explore, setExplore] = useState(() => getMergedProducts().explore.map(cloneProduct))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const list = tab === 'flash' ? flash : tab === 'best' ? best : explore
  const setList = tab === 'flash' ? setFlash : tab === 'best' ? setBest : setExplore

  function updateAt(index, patch) {
    setList((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
    setMessage('')
    setError('')
  }

  function removeAt(index) {
    setList((prev) => prev.filter((_, i) => i !== index))
    setMessage('')
    setError('')
  }

  function validateUniqueIds() {
    const all = [...flash, ...best, ...explore]
    const ids = all.map((p) => p.id.trim()).filter(Boolean)
    if (ids.length !== new Set(ids).size) return 'Every product ID must be unique across all sections.'
    return ''
  }

  function parseColors(str) {
    const parts = str
      .split(/[,;\s]+/)
      .map((x) => x.trim())
      .filter(Boolean)
    return parts.length ? parts : undefined
  }

  function handleSave() {
    setError('')
    const idErr = validateUniqueIds()
    if (idErr) {
      setError(idErr)
      return
    }
    for (const p of [...flash, ...best, ...explore]) {
      if (!p.id?.trim() || !p.title?.trim() || !p.image?.trim()) {
        setError('Each product needs ID, title, and image.')
        return
      }
      if (Number.isNaN(Number(p.price)) || Number(p.rating) < 0) {
        setError('Check numeric fields (price, rating, reviews).')
        return
      }
    }
    setMergedProducts({
      flash: flash.map(normalizeProduct),
      best: best.map(normalizeProduct),
      explore: explore.map(normalizeProduct),
    })
    setMessage('Products saved. Open the storefront to see updates.')
  }

  const tabs = /** @type {{ key: SectionKey; label: string }[]} */ ([
    { key: 'flash', label: "Flash sales" },
    { key: 'best', label: 'Best selling' },
    { key: 'explore', label: 'Explore' },
  ])

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description={
          <>
            Three homepage sections. Product IDs must stay unique everywhere so links like{' '}
            <code className="rounded-md bg-app-muted px-1.5 py-0.5 font-mono text-[13px] text-exclusive-dark dark:bg-zinc-800">
              /product/:id
            </code>{' '}
            resolve correctly.
          </>
        }
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <div className="mt-6">
        <AdminSegmentedTabs activeKey={tab} onChange={(k) => setTab(/** @type {SectionKey} */ (k))} tabs={tabs} />
      </div>

      <div className="mt-10 space-y-8">
        {list.map((product, index) => (
          <div key={`${product.id}-${index}`} className={adminCardClass}>
            <div className={adminCardMetaClass}>
              <span className="capitalize text-exclusive-dark/90 dark:text-exclusive-muted">
                {tab} · {index + 1}
              </span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                onClick={() => removeAt(index)}
              >
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-pid-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Product ID
                </label>
                <input
                  id={`${baseId}-pid-${tab}-${index}`}
                  className={adminInputClass}
                  value={product.id}
                  onChange={(e) => updateAt(index, { id: e.target.value })}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-title-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Title
                </label>
                <input
                  id={`${baseId}-title-${tab}-${index}`}
                  className={adminInputClass}
                  value={product.title}
                  onChange={(e) => updateAt(index, { title: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`${baseId}-img-${tab}-${index}`}
                className="mb-2 block text-sm font-medium text-exclusive-dark"
              >
                Image URL
              </label>
              <input
                id={`${baseId}-img-${tab}-${index}`}
                className={adminInputClass}
                value={product.image}
                onChange={(e) => updateAt(index, patchProductMainImage(product, e.target.value))}
              />
              <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-3 text-sm text-exclusive-muted">
                <span className="font-medium text-exclusive-dark">Or upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="max-w-full text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    if (!file) return
                    try {
                      const url = await uploadAdminImage(file)
                      updateAt(index, patchProductMainImage(product, url))
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Upload failed')
                    }
                  }}
                />
              </label>
            </div>

            <AdminProductGalleryFields
              fieldIdPrefix={`${tab}-${index}`}
              gallery={product.gallery}
              image={product.image}
              onChange={(patch) => updateAt(index, patch)}
              onError={setError}
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor={`${baseId}-price-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Price (PKR)
                </label>
                <input
                  id={`${baseId}-price-${tab}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={String(product.price)}
                  onChange={(e) => updateAt(index, { price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-old-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Old price PKR (optional)
                </label>
                <input
                  id={`${baseId}-old-${tab}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={product.oldPrice != null ? String(product.oldPrice) : ''}
                  onChange={(e) => {
                    const v = e.target.value
                    updateAt(index, { oldPrice: v === '' ? undefined : Number(v) })
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-disc-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Discount % (optional)
                </label>
                <input
                  id={`${baseId}-disc-${tab}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={product.discount != null ? String(product.discount) : ''}
                  onChange={(e) => {
                    const v = e.target.value
                    updateAt(index, { discount: v === '' ? undefined : Number(v) })
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-rating-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Rating (0–5)
                </label>
                <input
                  id={`${baseId}-rating-${tab}-${index}`}
                  type="number"
                  min={0}
                  max={5}
                  step={1}
                  className={adminInputClass}
                  value={String(product.rating)}
                  onChange={(e) => updateAt(index, { rating: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label
                  htmlFor={`${baseId}-rev-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Reviews count
                </label>
                <input
                  id={`${baseId}-rev-${tab}-${index}`}
                  type="number"
                  min={0}
                  step={1}
                  className={adminInputClass}
                  value={String(product.reviews)}
                  onChange={(e) => updateAt(index, { reviews: Number(e.target.value) })}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-badge-${tab}-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Badge
                </label>
                <select
                  id={`${baseId}-badge-${tab}-${index}`}
                  value={product.badge ?? ''}
                  onChange={(e) =>
                    updateAt(index, {
                      badge:
                        e.target.value === 'new' || e.target.value === 'sale' || e.target.value === 'sold-out'
                          ? e.target.value
                          : undefined,
                    })
                  }
                  className={adminInputClass}
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="sold-out">Sold Out</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-exclusive-dark">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-app-border-strong text-exclusive-red focus:ring-exclusive-red"
                    checked={Boolean(product.freeShip)}
                    onChange={(e) => updateAt(index, { freeShip: e.target.checked ? true : undefined })}
                  />
                  <span>Free shipping on card</span>
                </label>
                <p className="mt-1.5 text-xs text-exclusive-muted">Shows a “Free ship” tag on the storefront card.</p>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`${baseId}-colors-${tab}-${index}`}
                className="mb-2 block text-sm font-medium text-exclusive-dark"
              >
                Color swatches (hex, comma-separated)
              </label>
              <input
                id={`${baseId}-colors-${tab}-${index}`}
                className={adminInputClass}
                value={product.colors?.join(', ') ?? ''}
                onChange={(e) => updateAt(index, { colors: parseColors(e.target.value) })}
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-exclusive-muted">Preview</p>
              <img
                src={product.image}
                alt=""
                className="mt-2 h-32 w-32 rounded-xl border border-app-border-strong object-cover shadow-inner"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-app-border-subtle pt-10">
        <Button type="button" variant="outline" onClick={() => setList((prev) => [...prev, emptyProduct()])}>
          Add product in this section
        </Button>
        <Button type="button" variant="primary" className="min-h-11 px-8 font-semibold shadow-md shadow-exclusive-red/20" onClick={handleSave}>
          Save all sections
        </Button>
      </div>
    </div>
  )
}

/** @param {import('../../data/products').Product} p */
function normalizeProduct(p) {
  const next = {
    id: p.id.trim(),
    title: p.title.trim(),
    image: p.image.trim(),
    price: Number(p.price),
    rating: Number(p.rating),
    reviews: Number(p.reviews),
  }
  if (p.oldPrice != null && !Number.isNaN(Number(p.oldPrice))) next.oldPrice = Number(p.oldPrice)
  if (p.discount != null && !Number.isNaN(Number(p.discount))) next.discount = Number(p.discount)
  if (p.badge === 'new' || p.badge === 'sale' || p.badge === 'sold-out') next.badge = p.badge
  if (p.colors?.length) next.colors = p.colors
  if (p.freeShip === true) next.freeShip = true
  const gallery = Array.isArray(p.gallery)
    ? p.gallery.map((s) => String(s).trim()).filter(Boolean)
    : []
  if (gallery.length > 1) next.gallery = gallery
  return next
}
