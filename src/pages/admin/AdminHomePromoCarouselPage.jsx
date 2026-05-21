import { useId, useState } from 'react'
import { Button } from '../../components/ui/Button'
import {
  bgPresetIdFromClass,
  homePromoBgPresets,
} from '../../data/homePromoCarouselDefaults'
import {
  clearMergedHomePromoCarousel,
  getMergedHomePromoCarousel,
  setMergedHomePromoCarousel,
} from '../../site/siteStore'
import { uploadAdminImage } from '../../utils/uploadAdminImage'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader } from './AdminUi'

function emptySlide() {
  return {
    id: `promo-${Date.now()}`,
    badge: '',
    badgeAccent: false,
    model: '',
    title: '',
    titleGradient: false,
    tagsText: '',
    image: '',
    bgPreset: 'dark-amber',
    bgClassCustom: '',
    shopNowLink: '/#explore-products',
  }
}

/** @param {import('../../data/homePromoCarouselDefaults').HomePromoSlide} slide */
function slideToForm(slide) {
  const preset = bgPresetIdFromClass(slide.bgClass)
  return {
    id: slide.id || '',
    badge: slide.badge || '',
    badgeAccent: Boolean(slide.badgeAccent),
    model: slide.model || '',
    title: slide.title || '',
    titleGradient: Boolean(slide.titleGradient),
    tagsText: Array.isArray(slide.tags) ? slide.tags.join(', ') : '',
    image: slide.image || '',
    bgPreset: preset,
    bgClassCustom: preset === 'custom' ? slide.bgClass : '',
    shopNowLink: slide.shopNowLink || '/#explore-products',
  }
}

/** @param {ReturnType<typeof slideToForm>} form */
function resolveBgClass(form) {
  if (form.bgPreset === 'custom') {
    return (form.bgClassCustom || '').trim() || homePromoBgPresets[0].bgClass
  }
  return homePromoBgPresets.find((p) => p.id === form.bgPreset)?.bgClass ?? homePromoBgPresets[0].bgClass
}

export default function AdminHomePromoCarouselPage() {
  const baseId = useId()
  const initial = getMergedHomePromoCarousel()
  const [autoplayDelay, setAutoplayDelay] = useState(String(initial.autoplayDelay))
  const [slides, setSlides] = useState(() =>
    initial.slides.length ? initial.slides.map(slideToForm) : [emptySlide()],
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function patchSlide(index, partial) {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...partial } : s)))
    setMessage('')
    setError('')
  }

  function handleSave() {
    setError('')
    setMessage('')
    const delay = Number(autoplayDelay)
    if (!Number.isFinite(delay) || delay < 2000) {
      setError('Autoplay delay must be at least 2000 ms.')
      return
    }

    const toSave = slides
      .map((s, i) => ({
        id: (s.id || '').trim() || `promo-${i}`,
        badge: (s.badge || '').trim() || undefined,
        badgeAccent: s.badgeAccent,
        model: (s.model || '').trim(),
        title: (s.title || '').trim(),
        titleGradient: s.titleGradient,
        tags: (s.tagsText || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image: (s.image || '').trim(),
        bgClass: resolveBgClass(s),
        imageOverlap: true,
        shopNowLink: (s.shopNowLink || '').trim() || '/#explore-products',
      }))
      .filter((s) => s.title && s.image)

    if (!toSave.length) {
      setError('Add at least one slide with title and product image (or upload).')
      return
    }

    setMergedHomePromoCarousel({ slides: toSave, autoplayDelay: delay })
    setSlides(toSave.map((s) => slideToForm(s)))
    setMessage('Headphone promo carousel saved. Open the home page to verify.')
  }

  function handleResetToDefaults() {
    setError('')
    setMessage('')
    clearMergedHomePromoCarousel()
    const fresh = getMergedHomePromoCarousel()
    setAutoplayDelay(String(fresh.autoplayDelay))
    setSlides(fresh.slides.map(slideToForm))
    setMessage('Restored bundled default slides on the storefront.')
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Homepage"
        title="Headphone promo carousel"
        description="Swiper row with premium product cards — category badge, model, title, feature tags, Shop now link, and product image (MAGNUS / HURRICANE style section on the home page)."
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <section className={`${adminCardClass} mt-8`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Carousel behavior</h2>
        <div className="mt-4 min-w-[200px] max-w-xs">
          <label htmlFor={`${baseId}-delay`} className="mb-2 block text-sm font-medium text-exclusive-dark">
            Autoplay delay (ms)
          </label>
          <input
            id={`${baseId}-delay`}
            type="number"
            min={2000}
            step={500}
            className={adminInputClass}
            value={autoplayDelay}
            onChange={(e) => {
              setAutoplayDelay(e.target.value)
              setMessage('')
              setError('')
            }}
          />
        </div>
      </section>

      <div className="mt-10 space-y-8">
        {slides.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className={adminCardClass}>
            <div className={adminCardMetaClass}>
              <span className="text-exclusive-dark/80 dark:text-exclusive-muted">Slide {index + 1}</span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10"
                onClick={() => {
                  const next = slides.filter((_, i) => i !== index)
                  setSlides(next.length ? next : [emptySlide()])
                  setMessage('')
                  setError('')
                }}
              >
                Remove
              </button>
            </div>

            <p className="mt-2 text-xs text-exclusive-muted">
              Matches the storefront card: top badge (optional red dot), model line, large title, tag pills, Shop
              now, and product image on the right.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-id-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Slide ID (internal)
                </label>
                <input
                  id={`${baseId}-id-${index}`}
                  className={adminInputClass}
                  value={slide.id}
                  onChange={(e) => patchSlide(index, { id: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-link-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Shop now link
                </label>
                <input
                  id={`${baseId}-link-${index}`}
                  className={adminInputClass}
                  value={slide.shopNowLink}
                  onChange={(e) => patchSlide(index, { shopNowLink: e.target.value })}
                  placeholder="/#explore-products or /product/…"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-badge-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Category badge
                </label>
                <input
                  id={`${baseId}-badge-${index}`}
                  className={adminInputClass}
                  value={slide.badge}
                  onChange={(e) => patchSlide(index, { badge: e.target.value })}
                  placeholder="SOFTWARE BASED HEADPHONES"
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-exclusive-dark">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-app-border-strong text-exclusive-red"
                    checked={slide.badgeAccent}
                    onChange={(e) => patchSlide(index, { badgeAccent: e.target.checked })}
                  />
                  Red status dot on badge
                </label>
              </div>
              <div>
                <label htmlFor={`${baseId}-model-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Model number
                </label>
                <input
                  id={`${baseId}-model-${index}`}
                  className={adminInputClass}
                  value={slide.model}
                  onChange={(e) => patchSlide(index, { model: e.target.value })}
                  placeholder="R-1520"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-title-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Product name (headline)
                </label>
                <input
                  id={`${baseId}-title-${index}`}
                  className={adminInputClass}
                  value={slide.title}
                  onChange={(e) => patchSlide(index, { title: e.target.value })}
                  placeholder="MAGNUS"
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-exclusive-dark">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-app-border-strong text-exclusive-red"
                    checked={slide.titleGradient}
                    onChange={(e) => patchSlide(index, { titleGradient: e.target.checked })}
                  />
                  Gradient title (light cards)
                </label>
              </div>
              <div>
                <label htmlFor={`${baseId}-tags-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Feature tags (comma-separated)
                </label>
                <input
                  id={`${baseId}-tags-${index}`}
                  className={adminInputClass}
                  value={slide.tagsText}
                  onChange={(e) => patchSlide(index, { tagsText: e.target.value })}
                  placeholder="Active Noise Cancellation, Mood Tuned Sound"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${baseId}-bg-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                  Card background style
                </label>
                <select
                  id={`${baseId}-bg-${index}`}
                  className={adminInputClass}
                  value={slide.bgPreset}
                  onChange={(e) => patchSlide(index, { bgPreset: e.target.value })}
                >
                  {homePromoBgPresets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                  <option value="custom">Custom (advanced)</option>
                </select>
              </div>
              {slide.bgPreset === 'custom' ? (
                <div>
                  <label
                    htmlFor={`${baseId}-bgcustom-${index}`}
                    className="mb-2 block text-sm font-medium text-exclusive-dark"
                  >
                    Custom Tailwind classes
                  </label>
                  <input
                    id={`${baseId}-bgcustom-${index}`}
                    className={adminInputClass}
                    value={slide.bgClassCustom}
                    onChange={(e) => patchSlide(index, { bgClassCustom: e.target.value })}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <label htmlFor={`${baseId}-img-${index}`} className="mb-2 block text-sm font-medium text-exclusive-dark">
                Product image URL
              </label>
              <input
                id={`${baseId}-img-${index}`}
                className={adminInputClass}
                value={slide.image}
                onChange={(e) => patchSlide(index, { image: e.target.value })}
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
                      const url = await uploadAdminImage(file)
                      patchSlide(index, { image: url })
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Upload failed')
                    }
                  }}
                />
              </label>
            </div>

            {slide.image ? (
              <div className="mt-4">
                <p className="text-xs text-exclusive-muted">Preview</p>
                <div
                  className={`mt-2 overflow-hidden rounded-[1.25rem] p-4 ${resolveBgClass(slide)}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-white/90">
                    {slide.badge || 'Badge'}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{slide.title || 'Title'}</p>
                  <img
                    src={slide.image}
                    alt=""
                    className="mt-3 max-h-28 w-auto object-contain"
                  />
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
            setSlides((prev) => [...prev, emptySlide()])
            setMessage('')
            setError('')
          }}
        >
          Add slide
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
