import { useCallback, useEffect, useId, useState } from 'react'
import {
  deleteHeroBannerAndReload,
  fetchHeroBanners,
  getHeroBannerErrorMessage,
  getHeroSlidePreviewSrc,
  hasHeroSlideImage,
  mergeLocalHeroSlideMeta,
  revokeHeroSlidePreviews,
  upsertHeroBannerAndReload,
} from '../../api/heroBanners'
import { isApiConfigured } from '../../config/env'
import { Button } from '../../components/ui/Button'
import { isAdminUser, isLoggedIn } from '../../auth/mockAuth'
import { getHeroSlides, setHeroSlides } from '../../site/siteStore'
import { uploadAdminImage } from '../../utils/uploadAdminImage'
import { adminCardClass, adminCardMetaClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader } from './AdminUi'

/** @typedef {import('../../api/heroBanners').AdminHeroSlide} AdminHeroSlide */

const DEFAULT_HERO_IMAGE = '/uploads/1779050697289-39cb1242-download-1-.jpg'

/** @returns {AdminHeroSlide} */
function newDraftSlide() {
  return {
    id: `draft-${Date.now()}`,
    brandApple: false,
    fullBleed: false,
    series: 'New banner',
    titleLine1: 'Premium Mobile',
    titleLine2: 'Accessories',
    image: '',
  }
}

/** @param {boolean} apiMode @returns {AdminHeroSlide} */
function emptySlide(apiMode = false) {
  return {
    id: `slide-${Date.now()}`,
    brandApple: false,
    fullBleed: false,
    series: 'New banner',
    titleLine1: 'Premium Mobile',
    titleLine2: 'Accessories',
    image: apiMode ? '' : DEFAULT_HERO_IMAGE,
  }
}

/** @param {AdminHeroSlide[]} slides */
function serializeHeroSlides(slides) {
  if (!slides.length) return []
  return slides.map((s) => {
    const { imageFile, previewUrl, ...rest } = s
    void imageFile
    void previewUrl
    const image = rest.image?.trim().startsWith('blob:') ? '' : (rest.image ?? '').trim()
    return {
      ...rest,
      id: rest.id.trim(),
      series: (rest.series ?? '').trim(),
      titleLine1: (rest.titleLine1 ?? '').trim() || (rest.fullBleed ? '' : 'Promotion'),
      titleLine2: (rest.titleLine2 ?? '').trim(),
      image,
      brandApple: Boolean(rest.brandApple),
      fullBleed: Boolean(rest.fullBleed),
    }
  })
}

/** @param {AdminHeroSlide} slide */
function validateOneSlide(slide) {
  if (!hasHeroSlideImage(slide)) {
    return 'Upload an image or paste a valid image URL.'
  }
  if (!slide.fullBleed && !slide.series?.trim()) {
    return 'Badge / series text is required (or enable full-width banner).'
  }
  if (!slide.fullBleed && !slide.titleLine1?.trim()) {
    return 'Headline line 1 is required.'
  }
  return ''
}

/** @param {AdminHeroSlide[]} slides */
function validateHeroSlides(slides) {
  if (!slides.length) return ''
  for (const s of slides) {
    const err = validateOneSlide(s)
    if (err) return err
  }
  const ids = slides.map((s) => s.id.trim())
  if (new Set(ids).size !== ids.length) return 'Slide IDs must be unique.'
  return ''
}

export default function AdminHeroPage() {
  const baseId = useId()
  const useApi = isApiConfigured()
  const [slides, setSlides] = useState(() =>
    useApi ? [] : /** @type {AdminHeroSlide[]} */ (getHeroSlides()),
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(useApi)
  const [busyIndex, setBusyIndex] = useState(/** @type {number | null} */ (null))
  const [refreshing, setRefreshing] = useState(false)

  const applySlidesFromApi = useCallback((fromApi, edited) => {
    const local =
      edited && edited.length > 0 ? edited : /** @type {AdminHeroSlide[]} */ (getHeroSlides())
    const merged = mergeLocalHeroSlideMeta(fromApi, local)
    setSlides((prev) => {
      revokeHeroSlidePreviews(prev)
      return merged
    })
    setHeroSlides(serializeHeroSlides(merged))
  }, [])

  const loadFromApi = useCallback(async () => {
    const fromApi = await fetchHeroBanners()
    applySlidesFromApi(fromApi)
    return fromApi
  }, [applySlidesFromApi])

  useEffect(() => {
    if (!useApi) return undefined
    let cancelled = false
    ;(async () => {
      try {
        const fromApi = await fetchHeroBanners()
        if (!cancelled) applySlidesFromApi(fromApi)
      } catch (err) {
        if (!cancelled) {
          setError(getHeroBannerErrorMessage(err))
          setSlides(/** @type {AdminHeroSlide[]} */ (getHeroSlides()))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [useApi, applySlidesFromApi])

  function requireAdminAuth() {
    if (!useApi) return true
    if (!isLoggedIn()) {
      setError('Log in as admin to create, edit, or delete hero banners.')
      return false
    }
    if (!isAdminUser()) {
      setError('Only ADMIN accounts can manage hero banners. Log in with an admin account.')
      return false
    }
    return true
  }

  /** @param {AdminHeroSlide[]} next */
  function persist(next) {
    setSlides(next)
    setMessage('')
    setError('')
  }

  function handleAddDraft() {
    persist([...slides, useApi ? newDraftSlide() : emptySlide(false)])
    if (useApi) {
      setMessage('New banner form added. Fill fields, upload image, then click Create.')
    }
  }

  async function handleRefresh() {
    if (!useApi) return
    setRefreshing(true)
    setError('')
    try {
      const fromApi = await loadFromApi()
      setMessage(`Loaded ${fromApi.length} banner(s) from GET /hero-banners.`)
    } catch (e) {
      setError(getHeroBannerErrorMessage(e))
    } finally {
      setRefreshing(false)
    }
  }

  /** @param {number} index */
  async function handleCreate(index) {
    if (!requireAdminAuth()) return
    const slide = slides[index]
    const err = validateOneSlide(slide)
    if (err) {
      setError(err)
      return
    }

    setBusyIndex(index)
    setError('')
    try {
      const fromApi = await upsertHeroBannerAndReload(slide)
      applySlidesFromApi(fromApi, slides)
      setMessage('Banner created (POST /hero-banners).')
    } catch (e) {
      setError(getHeroBannerErrorMessage(e))
    } finally {
      setBusyIndex(null)
    }
  }

  /** @param {number} index */
  async function handleUpdate(index) {
    if (!requireAdminAuth()) return
    const slide = slides[index]
    if (!slide.serverId) {
      setError('This banner is not on the server yet. Use Create first.')
      return
    }
    const err = validateOneSlide(slide)
    if (err) {
      setError(err)
      return
    }

    setBusyIndex(index)
    setError('')
    try {
      const fromApi = await upsertHeroBannerAndReload(slide)
      applySlidesFromApi(fromApi, slides)
      setMessage('Banner updated (PATCH /hero-banners/:id).')
    } catch (e) {
      setError(getHeroBannerErrorMessage(e))
    } finally {
      setBusyIndex(null)
    }
  }

  /** @param {number} index */
  async function handleDelete(index) {
    const slide = slides[index]

    if (useApi && slide.serverId) {
      if (!requireAdminAuth()) return
      if (!window.confirm('Delete this hero banner from the server?')) return

      setBusyIndex(index)
      setError('')
      try {
        const fromApi = await deleteHeroBannerAndReload(slide.serverId)
        applySlidesFromApi(fromApi, slides.filter((_, i) => i !== index))
        setMessage('Banner deleted (DELETE /hero-banners/:id).')
      } catch (e) {
        setError(getHeroBannerErrorMessage(e))
      } finally {
        setBusyIndex(null)
      }
      return
    }

    const next = slides.filter((_, i) => i !== index)
    persist(next)
    if (!useApi) {
      const err = validateHeroSlides(next)
      if (err) {
        setError(err)
        setSlides(slides)
        return
      }
      setHeroSlides(serializeHeroSlides(next))
      setMessage(next.length === 0 ? 'All slides removed.' : 'Slide removed.')
    } else {
      setMessage('Draft removed.')
    }
  }

  async function handleSaveAllLocal() {
    const err = validateHeroSlides(slides)
    if (err) {
      setError(err)
      return
    }
    setHeroSlides(serializeHeroSlides(slides))
    setMessage('Hero saved to local preview. Check the home page.')
  }

  const listBusy = busyIndex !== null || refreshing

  return (
    <div>
      <AdminPageHeader
        eyebrow="Homepage"
        title="Hero banners"
        description={
          useApi
            ? 'CRUD: list (GET), create (POST), edit (PATCH), delete (DELETE). Admin login required for API actions.'
            : 'Local carousel editor — saves to browser storage for the storefront preview.'
        }
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={listBusy || loading} onClick={handleAddDraft}>
          + Add banner
        </Button>
        {useApi ? (
          <Button type="button" variant="outline" disabled={listBusy || loading} onClick={handleRefresh}>
            {refreshing ? 'Refreshing…' : 'Refresh list (GET)'}
          </Button>
        ) : (
          <Button type="button" variant="primary" disabled={listBusy} onClick={handleSaveAllLocal}>
            Save all (local)
          </Button>
        )}
      </div>

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      {loading ? (
        <p className="mt-8 text-sm text-exclusive-muted">Loading hero banners…</p>
      ) : slides.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-app-border-subtle px-6 py-12 text-center text-sm text-exclusive-muted">
          No hero banners yet. Click <strong>Add banner</strong> to create one.
        </p>
      ) : null}

      <div className="mt-8 space-y-8">
        {slides.map((slide, index) => {
          const isDraft = useApi && !slide.serverId
          const isBusy = busyIndex === index

          return (
            <div key={`${slide.id}-${index}`} className={adminCardClass}>
              <div className={adminCardMetaClass}>
                <span className="text-exclusive-dark/80 dark:text-exclusive-muted">
                  Banner {index + 1}
                  {slide.serverId ? (
                    <span className="ml-2 text-xs font-normal text-emerald-700 dark:text-emerald-300">
                      Saved · {slide.serverId.slice(0, 8)}…
                    </span>
                  ) : (
                    <span className="ml-2 text-xs font-normal text-amber-700 dark:text-amber-300">
                      New draft
                    </span>
                  )}
                </span>
                <div className="flex flex-wrap gap-2">
                  {useApi && isDraft ? (
                    <button
                      type="button"
                      className="rounded-lg bg-exclusive-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white hover:bg-exclusive-red-hover disabled:opacity-50"
                      disabled={listBusy}
                      onClick={() => handleCreate(index)}
                    >
                      {isBusy ? 'Creating…' : 'Create'}
                    </button>
                  ) : null}
                  {useApi && slide.serverId ? (
                    <button
                      type="button"
                      className="rounded-lg bg-exclusive-dark px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-exclusive-dark"
                      disabled={listBusy}
                      onClick={() => handleUpdate(index)}
                    >
                      {isBusy ? 'Saving…' : 'Save'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wide text-exclusive-red hover:bg-red-500/10 disabled:opacity-50"
                    disabled={listBusy}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
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
                Full-width image banner
              </label>

              <div className="mt-4">
                <label htmlFor={`${baseId}-series-${index}`} className="mb-2 block text-sm font-medium">
                  Badge text (badgeText)
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
                  <label htmlFor={`${baseId}-t1-${index}`} className="mb-2 block text-sm font-medium">
                    Headline 1 (headline1) *
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
                  <label htmlFor={`${baseId}-t2-${index}`} className="mb-2 block text-sm font-medium">
                    Headline 2 (headline2)
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
                <label htmlFor={`${baseId}-img-${index}`} className="mb-2 block text-sm font-medium">
                  Image URL (from server after create)
                </label>
                <input
                  id={`${baseId}-img-${index}`}
                  className={adminInputClass}
                  value={slide.image?.startsWith('blob:') ? '' : (slide.image ?? '')}
                  placeholder="http://localhost:3000/uploads/hero-banners/…"
                  onChange={(e) => {
                    const value = e.target.value
                    persist(
                      slides.map((s, i) => {
                        if (i !== index) return s
                        if (s.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(s.previewUrl)
                        return { ...s, image: value, imageFile: undefined, previewUrl: undefined }
                      }),
                    )
                  }}
                />
                <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-3 text-sm text-exclusive-muted">
                  <span className="font-medium text-exclusive-dark">Upload image (required for Create)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="max-w-full text-sm"
                    disabled={listBusy}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      e.target.value = ''
                      if (!file) return
                      try {
                        if (useApi) {
                          const prev = slides[index] ?? newDraftSlide()
                          if (prev.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.previewUrl)
                          persist(
                            slides.map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    imageFile: file,
                                    previewUrl: URL.createObjectURL(file),
                                    image: s.image?.startsWith('blob:') ? '' : s.image,
                                  }
                                : s,
                            ),
                          )
                          return
                        }
                        const url = await uploadAdminImage(file)
                        persist(
                          slides.map((s, i) =>
                            i === index
                              ? { ...s, image: url, imageFile: undefined, previewUrl: undefined }
                              : s,
                          ),
                        )
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
                  {getHeroSlidePreviewSrc(slide) ? (
                    <img
                      src={getHeroSlidePreviewSrc(slide)}
                      alt=""
                      className="mx-auto max-h-40 object-contain"
                    />
                  ) : (
                    <p className="text-center text-sm text-white/50">No image yet</p>
                  )}
                </div>
              </div>

              {!useApi ? (
                <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={slide.brandApple}
                    onChange={(e) => {
                      persist(
                        slides.map((s, i) => (i === index ? { ...s, brandApple: e.target.checked } : s)),
                      )
                    }}
                    className="h-4 w-4 rounded border-app-border-strong"
                  />
                  Apple-style badge
                </label>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
