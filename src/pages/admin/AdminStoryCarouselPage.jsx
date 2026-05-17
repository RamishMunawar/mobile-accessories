import { useId, useState } from 'react'
import { Button } from '../../components/ui/Button'
import {
  clearMergedStoryCarousel,
  getMergedStoryCarousel,
  setMergedStoryCarousel,
} from '../../site/siteStore'
import { readFileAsDataUrl } from '../../utils/readDataUrlFile'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader } from './AdminUi'

function emptyCard() {
  return {
    id: `story-${Date.now()}`,
    title: '',
    brand: '',
    description: '',
    tagsText: '',
    imageUrl: '',
    link: '#',
  }
}

function cardToForm(card) {
  return {
    id: card.id || '',
    title: card.title || '',
    brand: card.brand || '',
    description: card.description || '',
    tagsText: Array.isArray(card.tags) ? card.tags.join(', ') : '',
    imageUrl: card.imageUrl || '',
    link: card.link || '#',
  }
}

export default function AdminStoryCarouselPage() {
  const baseId = useId()
  const initial = getMergedStoryCarousel()
  const [autoRotate, setAutoRotate] = useState(initial.autoRotate)
  const [rotateInterval, setRotateInterval] = useState(String(initial.rotateInterval))
  const [cards, setCards] = useState(() =>
    initial.items.length ? initial.items.map(cardToForm) : [emptyCard()],
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function patchCard(index, partial) {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, ...partial } : c)))
    setMessage('')
    setError('')
  }

  function handleSave() {
    setError('')
    setMessage('')
    const interval = Number(rotateInterval)
    if (!Number.isFinite(interval) || interval < 2000) {
      setError('Auto-rotate interval must be at least 2000 ms.')
      return
    }

    const toSave = cards
      .map((c, i) => ({
        id: (c.id || '').trim() || `story-${i}`,
        title: (c.title || '').trim(),
        brand: (c.brand || '').trim(),
        description: (c.description || '').trim(),
        tags: (c.tagsText || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl: (c.imageUrl || '').trim(),
        link: (c.link || '').trim() || '#',
      }))
      .filter((c) => c.title && c.brand && c.imageUrl)

    if (!toSave.length) {
      setError('Add at least one card with title, brand, and image URL (or upload).')
      return
    }

    setMergedStoryCarousel({
      items: toSave,
      autoRotate,
      rotateInterval: interval,
    })
    setCards(toSave.map((c) => cardToForm({ ...c, tags: c.tags })))
    setMessage('3D story carousel saved. Open the home page to verify.')
  }

  function handleResetToDefaults() {
    setError('')
    setMessage('')
    clearMergedStoryCarousel()
    const fresh = getMergedStoryCarousel()
    setAutoRotate(fresh.autoRotate)
    setRotateInterval(String(fresh.rotateInterval))
    setCards(fresh.items.map(cardToForm))
    setMessage('Restored bundled default cards on the storefront.')
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Homepage"
        title="3D story carousel"
        description="Center-focused card stack with image overlay (brand + headline), body copy, tags, and Learn more link — matches the featured stories section on the home page."
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <section className={`${adminCardClass} mt-8`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Carousel behavior</h2>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-exclusive-dark">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-app-border-strong text-exclusive-red focus:ring-exclusive-red/30"
              checked={autoRotate}
              onChange={(e) => {
                setAutoRotate(e.target.checked)
                setMessage('')
                setError('')
              }}
            />
            Auto-rotate slides
          </label>
          <div className="min-w-[200px]">
            <label htmlFor={`${baseId}-interval`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Interval (ms)
            </label>
            <input
              id={`${baseId}-interval`}
              type="number"
              min={2000}
              step={500}
              className={adminInputClass}
              value={rotateInterval}
              onChange={(e) => {
                setRotateInterval(e.target.value)
                setMessage('')
                setError('')
              }}
            />
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-8">
        {cards.map((card, index) => (
          <div key={`${card.id}-${index}`} className={adminCardClass}>
            <div className={adminCardMetaClass}>
              <span className="text-exclusive-dark/80 dark:text-exclusive-muted">Card {index + 1}</span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                onClick={() => {
                  const next = cards.filter((_, i) => i !== index)
                  setCards(next.length ? next : [emptyCard()])
                  setMessage('')
                  setError('')
                }}
              >
                Remove
              </button>
            </div>

            <p className="mt-2 text-xs text-exclusive-muted">
              Image overlay shows <strong className="font-medium text-exclusive-dark">brand</strong> in caps with{' '}
              <strong className="font-medium text-exclusive-dark">title</strong> below the line. The card body repeats
              title and brand with description, tags, and link.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-id-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Card ID (internal)
                </label>
                <input
                  id={`${baseId}-id-${index}`}
                  className={adminInputClass}
                  value={card.id}
                  onChange={(e) => patchCard(index, { id: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-link-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Learn more link
                </label>
                <input
                  id={`${baseId}-link-${index}`}
                  className={adminInputClass}
                  value={card.link}
                  onChange={(e) => patchCard(index, { link: e.target.value })}
                  placeholder="/product/… or https://…"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-brand-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Brand (image overlay, uppercase)
                </label>
                <input
                  id={`${baseId}-brand-${index}`}
                  className={adminInputClass}
                  value={card.brand}
                  onChange={(e) => patchCard(index, { brand: e.target.value })}
                  placeholder="Herman Miller"
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-title-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Title (overlay + card heading)
                </label>
                <input
                  id={`${baseId}-title-${index}`}
                  className={adminInputClass}
                  value={card.title}
                  onChange={(e) => patchCard(index, { title: e.target.value })}
                  placeholder="Smart Ergonomics"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor={`${baseId}-desc-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                Description
              </label>
              <textarea
                id={`${baseId}-desc-${index}`}
                rows={3}
                className={`${adminInputClass} resize-y`}
                value={card.description}
                onChange={(e) => patchCard(index, { description: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label htmlFor={`${baseId}-tags-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                Tags (comma-separated)
              </label>
              <input
                id={`${baseId}-tags-${index}`}
                className={adminInputClass}
                value={card.tagsText}
                onChange={(e) => patchCard(index, { tagsText: e.target.value })}
                placeholder="Office, Health, Furniture"
              />
            </div>

            <div className="mt-4">
              <label htmlFor={`${baseId}-img-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                Background image URL
              </label>
              <input
                id={`${baseId}-img-${index}`}
                className={adminInputClass}
                value={card.imageUrl}
                onChange={(e) => patchCard(index, { imageUrl: e.target.value })}
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
                      patchCard(index, { imageUrl: url })
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Upload failed')
                    }
                  }}
                />
              </label>
            </div>

            {card.imageUrl ? (
              <div className="mt-4">
                <p className="text-xs text-exclusive-muted">Preview</p>
                <div className="relative mt-2 overflow-hidden rounded-lg bg-black">
                  <div
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.imageUrl})` }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center text-white">
                    <p className="text-lg font-bold">{card.brand ? card.brand.toUpperCase() : 'BRAND'}</p>
                    <div className="my-2 h-0.5 w-10 bg-white" />
                    <p className="text-sm">{card.title || 'Title'}</p>
                  </div>
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
          onClick={() => {
            setCards((prev) => [...prev, emptyCard()])
            setMessage('')
            setError('')
          }}
        >
          Add card
        </Button>
        <Button
          type="button"
          variant="primary"
          className="min-h-11 px-8 font-semibold shadow-md shadow-exclusive-red/20"
          onClick={handleSave}
        >
          Save carousel
        </Button>
        <Button type="button" variant="outline" onClick={handleResetToDefaults}>
          Reset to defaults
        </Button>
      </div>
    </div>
  )
}
