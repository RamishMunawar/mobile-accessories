import { useId, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { getMergedFeaturedArrival, setMergedFeaturedArrival } from '../../site/siteStore'
import { readFileAsDataUrl } from '../../utils/readDataUrlFile'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader } from './AdminUi'

function emptyTile() {
  return {
    id: `tile-${Date.now()}`,
    title: '',
    description: '',
    image: '',
    href: '/',
  }
}

export default function AdminFeaturedArrivalPage() {
  const baseId = useId()
  const initial = getMergedFeaturedArrival()
  const [eyebrow, setEyebrow] = useState(initial.eyebrow || 'Featured')
  const [sectionTitle, setSectionTitle] = useState(initial.title || 'New Arrival')
  const [tiles, setTiles] = useState(
    () => (initial.tiles.length ? initial.tiles.map((t) => ({ ...t })) : [emptyTile()]),
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function patchTile(index, partial) {
    setTiles((prev) => prev.map((t, i) => (i === index ? { ...t, ...partial } : t)))
    setMessage('')
    setError('')
  }

  function handleSave() {
    setError('')
    setMessage('')
    const toSave = tiles
      .map((t, i) => ({
        id: (t.id || '').trim() || `tile-${i}`,
        title: (t.title || '').trim(),
        description: (t.description || '').trim(),
        image: (t.image || '').trim(),
        href: (t.href || '').trim() || '/',
      }))
      .filter((t) => t.title && t.image)
      .slice(0, 4)

    if (!toSave.length) {
      setError('Add at least one tile with a title and image URL (or upload).')
      return
    }

    setMergedFeaturedArrival({
      eyebrow: eyebrow.trim(),
      title: sectionTitle.trim(),
      tiles: toSave,
    })
    setTiles(toSave.map((t) => ({ ...t })))
    setMessage('Featured New Arrival saved. Open the home page to verify.')
  }

  function handleClearFromSite() {
    setError('')
    setMessage('')
    setMergedFeaturedArrival({ eyebrow: '', title: '', tiles: [] })
    setEyebrow('Featured')
    setSectionTitle('New Arrival')
    setTiles([emptyTile()])
    setMessage('Section hidden on the home page until you save tiles again.')
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Homepage"
        title="Featured New Arrival"
        description="Large left tile, wide top-right, and two smaller tiles — same layout as the storefront when you save exactly four complete tiles. One to three tiles use a simple grid instead."
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <section className={`${adminCardClass} mt-8`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Section heading</h2>
        <p className="mt-1 text-sm text-exclusive-muted">Shown above the tile grid (defaults used on the site if left empty).</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${baseId}-eyebrow`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Eyebrow
            </label>
            <input
              id={`${baseId}-eyebrow`}
              className={adminInputClass}
              value={eyebrow}
              onChange={(e) => {
                setEyebrow(e.target.value)
                setMessage('')
                setError('')
              }}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-st`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Title (H2)
            </label>
            <input
              id={`${baseId}-st`}
              className={adminInputClass}
              value={sectionTitle}
              onChange={(e) => {
                setSectionTitle(e.target.value)
                setMessage('')
                setError('')
              }}
            />
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-8">
        {tiles.map((tile, index) => (
          <div key={`${tile.id}-${index}`} className={adminCardClass}>
            <div className={adminCardMetaClass}>
              <span className="text-exclusive-dark/80 dark:text-exclusive-muted">
                Tile {index + 1}
                {index === 0 ? ' — large left (with four tiles saved)' : null}
                {index === 1 ? ' — wide top right' : null}
                {index >= 2 ? ' — bottom row' : null}
              </span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                onClick={() => {
                  const next = tiles.filter((_, i) => i !== index)
                  setTiles(next.length ? next : [emptyTile()])
                  setMessage('')
                  setError('')
                }}
              >
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-tid-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Tile ID (internal)
                </label>
                <input
                  id={`${baseId}-tid-${index}`}
                  className={adminInputClass}
                  value={tile.id}
                  onChange={(e) => patchTile(index, { id: e.target.value })}
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-href-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Shop Now link
                </label>
                <input
                  id={`${baseId}-href-${index}`}
                  className={adminInputClass}
                  value={tile.href}
                  onChange={(e) => patchTile(index, { href: e.target.value })}
                  placeholder="/product/… or https://…"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`${baseId}-ttl-${index}`}
                className="mb-2 block text-sm font-medium text-exclusive-dark"
              >
                Title
              </label>
              <input
                id={`${baseId}-ttl-${index}`}
                className={adminInputClass}
                value={tile.title}
                onChange={(e) => patchTile(index, { title: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor={`${baseId}-desc-${index}`}
                className="mb-2 block text-sm font-medium text-exclusive-dark"
              >
                Description
              </label>
              <textarea
                id={`${baseId}-desc-${index}`}
                rows={2}
                className={`${adminInputClass} resize-y`}
                value={tile.description}
                onChange={(e) => patchTile(index, { description: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor={`${baseId}-img-${index}`}
                className="mb-2 block text-sm font-medium text-exclusive-dark"
              >
                Image URL
              </label>
              <input
                id={`${baseId}-img-${index}`}
                className={adminInputClass}
                value={tile.image}
                onChange={(e) => patchTile(index, { image: e.target.value })}
              />
              <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-3 text-sm text-exclusive-muted">
                <span className="font-medium text-exclusive-dark">Or upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="max-w-full text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    if (!file) return
                    try {
                      const url = await readFileAsDataUrl(file)
                      patchTile(index, { image: url })
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Upload failed')
                    }
                  }}
                />
              </label>
            </div>

            {tile.image ? (
              <div className="mt-4">
                <p className="text-xs text-exclusive-muted">Preview</p>
                <div className="mt-2 overflow-hidden rounded-lg bg-black p-3">
                  <img src={tile.image} alt="" className="mx-auto max-h-36 object-contain" />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-app-border-subtle pt-10">
        <Button
          type="button"
          variant="outline"
          disabled={tiles.length >= 4}
          onClick={() => {
            setTiles((prev) => [...prev, emptyTile()])
            setMessage('')
            setError('')
          }}
        >
          Add tile (max 4)
        </Button>
        <Button
          type="button"
          variant="primary"
          className="min-h-11 px-8 font-semibold shadow-md shadow-exclusive-red/20"
          onClick={handleSave}
        >
          Save section
        </Button>
        <Button type="button" variant="outline" onClick={handleClearFromSite}>
          Clear from storefront
        </Button>
      </div>
    </div>
  )
}
