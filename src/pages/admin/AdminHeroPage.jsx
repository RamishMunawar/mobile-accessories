import { useId, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { getHeroSlides, setHeroSlides } from '../../site/siteStore'
import { readFileAsDataUrl } from '../../utils/readDataUrlFile'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader } from './AdminUi'

function emptySlide() {
  return {
    id: `slide-${Date.now()}`,
    brandApple: false,
    fullBleed: false,
    series: 'Product line',
    titleLine1: 'Promotion line 1',
    titleLine2: 'Promotion line 2',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=700&fit=crop',
  }
}

/** @param {Record<string, unknown>[]} slides */
function serializeHeroSlides(slides) {
  if (!slides.length) return []
  return slides.map((s) => ({
    ...s,
    id: s.id.trim(),
    series: (s.series ?? '').trim(),
    titleLine1: (s.titleLine1 ?? '').trim() || (s.fullBleed ? '' : 'Promotion'),
    titleLine2: (s.titleLine2 ?? '').trim(),
    image: s.image.trim(),
    brandApple: Boolean(s.brandApple),
    fullBleed: Boolean(s.fullBleed),
  }))
}

/** @returns {string} Error message, or empty string if valid (including empty list). */
function validateHeroSlides(slides) {
  if (!slides.length) return ''
  for (const s of slides) {
    if (!s.id?.trim() || !s.image?.trim()) {
      return 'Each slide needs an ID and image URL.'
    }
    if (!s.fullBleed && !s.series?.trim()) {
      return 'Each split-layout slide needs a series label — or enable "Full-width image banner" for image-only slides.'
    }
  }
  const ids = slides.map((s) => s.id.trim())
  if (new Set(ids).size !== ids.length) {
    return 'Slide IDs must be unique.'
  }
  return ''
}

export default function AdminHeroPage() {
  const baseId = useId()
  const [slides, setSlides] = useState(() => getHeroSlides())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function persist(next) {
    setSlides(next)
    setMessage('')
    setError('')
  }

  /** Writes hero to localStorage and notifies the storefront when validation passes. */
  function commitHeroToStore(nextSlides, successMessage) {
    const err = validateHeroSlides(nextSlides)
    if (err) {
      setError(err)
      setMessage('')
      return false
    }
    setHeroSlides(serializeHeroSlides(nextSlides))
    setError('')
    setMessage(successMessage)
    return true
  }

  function handleSave() {
    commitHeroToStore(
      slides,
      slides.length === 0
        ? 'Hero cleared. Homepage shows no carousel until you add slides again.'
        : 'Hero saved. Check the home page.',
    )
  }

  function handleRemoveAt(index) {
    const next = slides.filter((_, i) => i !== index)
    persist(next)
    if (!commitHeroToStore(next, next.length === 0 ? 'Hero cleared on the site.' : 'Slide removed. Homepage updated.')) {
      // Invalid remaining slides: keep form state, site unchanged until fixed + Save hero.
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Homepage"
        title="Hero banners"
        description="Carousel slides: headline lines, series label, Apple-style badge optional — image URL or upload."
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <div className="mt-8 space-y-8">
        {slides.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className={adminCardClass}>
            <div className={adminCardMetaClass}>
              <span className="text-exclusive-dark/80 dark:text-exclusive-muted">
                Slide {index + 1}
              </span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                onClick={() => handleRemoveAt(index)}
              >
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-slide-id-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Slide ID (internal)
                </label>
                <input
                  id={`${baseId}-slide-id-${index}`}
                  className={adminInputClass}
                  value={slide.id}
                  onChange={(e) => {
                    const v = e.target.value
                    persist(slides.map((s, i) => (i === index ? { ...s, id: v } : s)))
                  }}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 pt-8 text-sm font-medium sm:pt-10">
                <input
                  type="checkbox"
                  checked={slide.brandApple}
                  onChange={(e) => {
                    const checked = e.target.checked
                    persist(slides.map((s, i) => (i === index ? { ...s, brandApple: checked } : s)))
                  }}
                  className="h-4 w-4 rounded border-app-border-strong"
                />
                Apple-style badge + series row
              </label>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={Boolean(slide.fullBleed)}
                onChange={(e) => {
                  const checked = e.target.checked
                  persist(slides.map((s, i) => (i === index ? { ...s, fullBleed: checked } : s)))
                }}
                className="h-4 w-4 rounded border-app-border-strong"
              />
              Full-width image banner (no headline column; image fills the carousel)
            </label>

            <div className="mt-4">
              <label
                htmlFor={`${baseId}-series-${index}`}
                className="mb-2 block text-sm font-medium text-exclusive-dark"
              >
                Series / badge text {!slide.fullBleed ? <span className="text-exclusive-muted">(required)</span> : null}
              </label>
              <input
                id={`${baseId}-series-${index}`}
                className={adminInputClass}
                value={slide.series}
                onChange={(e) =>
                  persist(slides.map((s, i) => (i === index ? { ...s, series: e.target.value } : s)))
                }
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-t1-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Headline line 1
                </label>
                <input
                  id={`${baseId}-t1-${index}`}
                  className={adminInputClass}
                  value={slide.titleLine1 ?? ''}
                  onChange={(e) =>
                    persist(slides.map((s, i) => (i === index ? { ...s, titleLine1: e.target.value } : s)))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-t2-${index}`}
                  className="mb-2 block text-sm font-medium text-exclusive-dark"
                >
                  Headline line 2
                </label>
                <input
                  id={`${baseId}-t2-${index}`}
                  className={adminInputClass}
                  value={slide.titleLine2 ?? ''}
                  onChange={(e) =>
                    persist(slides.map((s, i) => (i === index ? { ...s, titleLine2: e.target.value } : s)))
                  }
                />
              </div>
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
                value={slide.image}
                onChange={(e) =>
                  persist(slides.map((s, i) => (i === index ? { ...s, image: e.target.value } : s)))
                }
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
                      persist(slides.map((s, i) => (i === index ? { ...s, image: url } : s)))
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Upload failed')
                    }
                  }}
                />
              </label>
            </div>

            <div className="mt-4">
              <p className="text-xs text-exclusive-muted">Preview</p>
              <div className="mt-2 overflow-hidden rounded-lg bg-black p-4">
                <img src={slide.image} alt="" className="mx-auto max-h-40 object-contain" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-app-border-subtle pt-10">
        <Button type="button" variant="outline" onClick={() => persist([...slides, emptySlide()])}>
          Add slide
        </Button>
        <Button type="button" variant="primary" className="min-h-11 px-8 font-semibold shadow-md shadow-exclusive-red/20" onClick={handleSave}>
          Save hero
        </Button>
      </div>
    </div>
  )
}
