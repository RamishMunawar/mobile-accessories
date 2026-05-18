import { useId, useState } from 'react'
import { uploadAdminImage } from '../../utils/uploadAdminImage'
import { adminInputClass } from '../../pages/admin/adminFieldClasses'
import { productGalleryList } from '../../utils/productGallery'

/**
 * @param {{
 *   gallery?: string[]
 *   image: string
 *   onChange: (patch: { gallery?: string[]; image?: string }) => void
 *   onError?: (message: string) => void
 *   fieldIdPrefix: string
 * }} props
 */
export default function AdminProductGalleryFields({
  gallery,
  image,
  onChange,
  onError,
  fieldIdPrefix,
}) {
  const baseId = useId()
  const [urlDraft, setUrlDraft] = useState('')
  const items = productGalleryList(gallery, image)

  function emit(nextGallery) {
    const cleaned = nextGallery.map((s) => s.trim()).filter(Boolean)
    onChange({
      gallery: cleaned.length ? cleaned : undefined,
      image: cleaned[0] ?? image,
    })
  }

  function addUrl(raw) {
    const url = raw.trim()
    if (!url) return
    emit([...items, url])
    setUrlDraft('')
  }

  async function uploadFile(file) {
    const url = await uploadAdminImage(file)
    emit([...items, url])
  }

  return (
    <div className="mt-6 rounded-xl border border-app-border-subtle bg-app-muted/30 p-4 dark:bg-app-muted/15">
      <h3 className="text-sm font-semibold text-exclusive-dark">Product page gallery</h3>
      <p className="mt-1 text-xs text-exclusive-muted">
        Extra design images for the detail page — left thumbnails, large preview on the right (first image is also
        the shop card image).
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {items.map((src, i) => (
          <div key={`${fieldIdPrefix}-${i}-${src.slice(0, 24)}`} className="relative">
            <img
              src={src}
              alt=""
              className="h-24 w-24 rounded-lg border border-app-border-strong object-cover shadow-sm"
            />
            {i === 0 ? (
              <span className="absolute -top-2 left-1 rounded bg-exclusive-red px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Card
              </span>
            ) : null}
            <button
              type="button"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-exclusive-dark text-xs text-white shadow hover:bg-exclusive-red"
              aria-label={`Remove gallery image ${i + 1}`}
              onClick={() => emit(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor={`${baseId}-gurl`} className="mb-2 block text-sm font-medium text-exclusive-dark">
          Add gallery image URL
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={`${baseId}-gurl`}
            className={`${adminInputClass} min-w-[200px] flex-1`}
            value={urlDraft}
            placeholder="https://… or /uploads/…"
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl(urlDraft)
              }
            }}
          />
          <button
            type="button"
            className="rounded-lg border border-app-border-strong bg-app-card px-4 py-2 text-sm font-medium text-exclusive-dark hover:bg-app-muted"
            onClick={() => addUrl(urlDraft)}
          >
            Add
          </button>
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-3 text-sm text-exclusive-muted">
        <span className="font-medium text-exclusive-dark">Or upload design image</span>
        <input
          type="file"
          accept="image/*"
          className="max-w-full text-sm"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            try {
              await uploadFile(file)
            } catch (err) {
              onError?.(err instanceof Error ? err.message : 'Upload failed')
            }
          }}
        />
      </label>
    </div>
  )
}
