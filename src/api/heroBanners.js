import { apiDelete, apiGet, apiPatch, apiPost, ApiError } from './client'
import { getApiBaseUrl } from '../config/env'
import { getHeroSlides, setHeroSlides } from '../site/siteStore'

/**
 * @typedef {{
 *   badgeText?: string
 *   headline1: string
 *   headline2?: string
 *   imageFile?: File
 * }} HeroBannerCreatePayload
 */

/**
 * @typedef {{
 *   id: string
 *   serverId?: string
 *   brandApple: boolean
 *   fullBleed: boolean
 *   series: string
 *   titleLine1: string
 *   titleLine2: string
 *   image: string
 *   imageFile?: File
 *   previewUrl?: string
 *   sortOrder?: number
 *   isActive?: boolean
 * }} AdminHeroSlide
 */

/** Backend origin (without `/api/v1`) for relative image paths. */
export function getApiOrigin() {
  const base = getApiBaseUrl()
  if (!base) return ''
  return base.replace(/\/api\/v1$/i, '') || base
}

/**
 * @param {string} path
 * @returns {string}
 */
export function resolveHeroImageUrl(path) {
  if (!path || typeof path !== 'string') return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  if (path.startsWith('/')) {
    const origin = getApiOrigin()
    if (origin) return `${origin}${path}`
    if (typeof window !== 'undefined') return `${window.location.origin}${path}`
    return path
  }
  return path
}

/**
 * @param {unknown} data
 * @returns {unknown[]}
 */
export function normalizeHeroBannerList(data) {
  const root = data && typeof data === 'object' ? /** @type {Record<string, unknown>} */ (data) : {}
  const inner = root.data
  /** @type {unknown[]} */
  let list = []
  if (Array.isArray(inner)) list = inner
  else if (inner && typeof inner === 'object') {
    const block = /** @type {Record<string, unknown>} */ (inner)
    if (Array.isArray(block.items)) list = block.items
    else if (Array.isArray(block.heroBanners)) list = block.heroBanners
  } else if (Array.isArray(root.heroBanners)) list = root.heroBanners
  else if (Array.isArray(root)) list = root

  return list
    .filter((item) => {
      if (!item || typeof item !== 'object') return false
      const row = /** @type {Record<string, unknown>} */ (item)
      return row.isActive !== false
    })
    .sort((a, b) => {
      const ao = Number(/** @type {Record<string, unknown>} */ (a).sortOrder ?? 0)
      const bo = Number(/** @type {Record<string, unknown>} */ (b).sortOrder ?? 0)
      return ao - bo
    })
}

/**
 * @param {unknown} item
 * @param {Partial<AdminHeroSlide>} [local]
 * @returns {AdminHeroSlide}
 */
export function mapApiHeroBannerToSlide(item, local = {}) {
  const root =
    item && typeof item === 'object'
      ? /** @type {Record<string, unknown>} */ (
          /** @type {Record<string, unknown>} */ (item).data &&
          typeof /** @type {Record<string, unknown>} */ (item).data === 'object'
            ? /** @type {Record<string, unknown>} */ (/** @type {Record<string, unknown>} */ (item).data)
            : /** @type {Record<string, unknown>} */ (item)
        )
      : {}

  const serverId = String(root.id ?? root._id ?? local.serverId ?? '').trim()
  const badgeText = String(root.badgeText ?? root.badge_text ?? '').trim()
  const headline1 = String(root.headline1 ?? root.headline_1 ?? '').trim()
  const headline2 = String(root.headline2 ?? root.headline_2 ?? '').trim()
  const imageRaw = String(
    root.imageUrl ?? root.image_url ?? root.imagePath ?? root.image_path ?? root.image ?? '',
  ).trim()

  const fullBleed = Boolean(local.fullBleed)
  const sortOrder = Number(root.sortOrder ?? local.sortOrder ?? 0)
  const isActive = root.isActive !== false

  return {
    id: local.id || (serverId ? `hero-${serverId}` : `hero-${Date.now()}`),
    serverId: serverId || undefined,
    brandApple: Boolean(local.brandApple),
    fullBleed,
    series: badgeText || local.series || '',
    titleLine1: headline1 || local.titleLine1 || '',
    titleLine2: headline2 || local.titleLine2 || '',
    image: resolveHeroImageUrl(imageRaw) || local.image || '',
    sortOrder,
    isActive,
  }
}

/**
 * @param {AdminHeroSlide} slide
 * @returns {HeroBannerCreatePayload}
 */
export function slideToApiPayload(slide) {
  const headline1 = slide.fullBleed
    ? slide.titleLine1?.trim() || 'Banner'
    : slide.titleLine1?.trim() || 'Promotion'

  if (!headline1) {
    throw new Error('Headline line 1 is required for the API.')
  }

  return {
    badgeText: slide.series?.trim() || '',
    headline1,
    headline2: slide.titleLine2?.trim() || '',
    imageFile: slide.imageFile,
  }
}

/**
 * @param {AdminHeroSlide} slide
 * @returns {Promise<File>}
 */
/** @param {AdminHeroSlide} slide */
export function hasHeroSlideImage(slide) {
  if (slide.imageFile instanceof File) return true
  if (slide.previewUrl) return true
  const src = slide.image?.trim()
  return Boolean(src && !src.startsWith('blob:'))
}

/** @param {AdminHeroSlide} slide */
export function getHeroSlidePreviewSrc(slide) {
  return slide.previewUrl || slide.image || ''
}

/** Revoke blob preview URLs before replacing slide list. */
export function revokeHeroSlidePreviews(slides) {
  for (const slide of slides) {
    if (slide.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(slide.previewUrl)
    }
  }
}

export async function resolveHeroBannerImageFile(slide) {
  if (slide.imageFile instanceof File) return slide.imageFile

  const src = slide.image?.trim()
  if (!src) {
    throw new Error('Each slide needs an image (upload a file or paste a URL).')
  }

  if (src.startsWith('blob:')) {
    throw new Error('Image is not on the server yet. Choose the file again, then click Save to API.')
  }

  if (src.startsWith('data:')) {
    const res = await fetch(src)
    const blob = await res.blob()
    return new File([blob], 'banner.jpg', { type: blob.type || 'image/jpeg' })
  }

  const absolute =
    src.startsWith('http://') || src.startsWith('https://')
      ? src
      : `${typeof window !== 'undefined' ? window.location.origin : getApiOrigin()}${src.startsWith('/') ? src : `/${src}`}`

  const res = await fetch(absolute)
  if (!res.ok) {
    throw new Error(`Could not load image (${res.status}). Upload the file again or use a valid URL.`)
  }
  const blob = await res.blob()
  const name = src.split('/').pop()?.split('?')[0] || 'banner.jpg'
  return new File([blob], name.includes('.') ? name : 'banner.jpg', {
    type: blob.type || 'image/jpeg',
  })
}

/**
 * @param {HeroBannerCreatePayload} payload
 * @param {{ includeImage?: boolean }} [opts]
 */
function buildHeroBannerFormData(payload, opts = {}) {
  const includeImage = opts.includeImage !== false
  const fd = new FormData()
  fd.append('badgeText', payload.badgeText ?? '')
  fd.append('headline1', payload.headline1)
  fd.append('headline2', payload.headline2 ?? '')
  if (includeImage && payload.imageFile) {
    fd.append('image', payload.imageFile)
  }
  return fd
}

let heroBannersInflight = /** @type {Promise<AdminHeroSlide[]> | null} */ (null)

/** Clears GET cache after admin create/update/delete. */
export function invalidateHeroBannersCache() {
  heroBannersInflight = null
}

/** GET /api/v1/hero-banners — `{ success, data: [...] }` (deduped in-flight) */
export async function fetchHeroBanners() {
  if (heroBannersInflight) return heroBannersInflight

  heroBannersInflight = (async () => {
    const data = await apiGet('/hero-banners')
    return normalizeHeroBannerList(data).map((item) => mapApiHeroBannerToSlide(item))
  })().finally(() => {
    heroBannersInflight = null
  })

  return heroBannersInflight
}

/**
 * Create (POST) or update (PATCH) one banner, then return fresh GET list.
 * @param {AdminHeroSlide} slide
 */
export async function upsertHeroBannerAndReload(slide) {
  invalidateHeroBannersCache()
  const payload = slideToApiPayload(slide)
  const hasNewFile = slide.imageFile instanceof File

  if (slide.serverId) {
    if (hasNewFile) {
      await updateHeroBanner(slide.serverId, { ...payload, imageFile: slide.imageFile }, {
        includeImage: true,
      })
    } else {
      await updateHeroBanner(slide.serverId, { ...payload, imageFile: undefined }, {
        includeImage: false,
      })
    }
    return fetchHeroBanners()
  }

  const imageFile = hasNewFile ? slide.imageFile : await resolveHeroBannerImageFile(slide)
  if (!(imageFile instanceof File)) {
    throw new Error('Upload an image file before creating a banner.')
  }
  await createHeroBanner({ ...payload, imageFile })
  return fetchHeroBanners()
}

/** DELETE one banner, then GET list. */
export async function deleteHeroBannerAndReload(id) {
  invalidateHeroBannersCache()
  await deleteHeroBanner(id)
  return fetchHeroBanners()
}

/**
 * Keep admin-only UI flags after GET (API does not store them).
 * @param {AdminHeroSlide[]} fromApi
 * @param {AdminHeroSlide[]} edited
 */
export function mergeLocalHeroSlideMeta(fromApi, edited) {
  const byServer = new Map(
    edited.filter((s) => s.serverId).map((s) => [String(s.serverId), s]),
  )
  const unmatchedLocal = edited.filter((s) => !s.serverId)

  const merged = fromApi.map((api, index) => {
    const local = api.serverId ? byServer.get(String(api.serverId)) : unmatchedLocal[index]
    if (!local) return api
    if (local.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(local.previewUrl)
    return {
      ...api,
      id: local.id || api.id,
      brandApple: local.brandApple,
      fullBleed: local.fullBleed,
      imageFile: undefined,
      previewUrl: undefined,
    }
  })

  return merged
}

/**
 * Apply GET /hero-banners to localStorage while keeping admin-only flags (e.g. fullBleed).
 * @param {AdminHeroSlide[]} fromApi
 * @returns {AdminHeroSlide[]}
 */
export function persistHeroSlidesFromApi(fromApi) {
  const local = /** @type {AdminHeroSlide[]} */ (getHeroSlides())
  const merged = mergeLocalHeroSlideMeta(fromApi, local)
  setHeroSlides(merged)
  return merged
}

/**
 * POST /api/v1/hero-banners (multipart)
 * @param {Omit<HeroBannerCreatePayload, 'imageFile'> & { imageFile: File }} payload
 */
export async function createHeroBanner(payload) {
  const data = await apiPost('/hero-banners', buildHeroBannerFormData(payload))
  return mapApiHeroBannerToSlide(data)
}

/**
 * PATCH /api/v1/hero-banners/:id (multipart) — image optional on update
 * @param {string} id
 * @param {HeroBannerCreatePayload} payload
 * @param {{ includeImage?: boolean }} [opts]
 */
export async function updateHeroBanner(id, payload, opts = {}) {
  const data = await apiPatch(
    `/hero-banners/${encodeURIComponent(id)}`,
    buildHeroBannerFormData(payload, opts),
  )
  return mapApiHeroBannerToSlide(data)
}

/** DELETE /api/v1/hero-banners/:id */
export async function deleteHeroBanner(id) {
  return apiDelete(`/hero-banners/${encodeURIComponent(id)}`)
}

/**
 * @param {unknown} err
 */
export function getHeroBannerErrorMessage(err) {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return 'Unauthorized (401) — log in again as admin. Your access token may have expired.'
    }
    if (err.status === 403) {
      return 'Forbidden (403) — this action requires an ADMIN account.'
    }
    return err.message
  }
  if (err instanceof Error) return err.message
  return 'Hero banner request failed.'
}
