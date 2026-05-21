/** @returns {string} Normalized API base without trailing slash */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw !== 'string') return ''
  const trimmed = raw.trim()
  return trimmed ? trimmed.replace(/\/$/, '') : ''
}

/** True when `VITE_API_BASE_URL` is set in .env */
export function isApiConfigured() {
  return Boolean(getApiBaseUrl())
}

/** @returns {string | undefined} */
export function getApiToken() {
  const raw = import.meta.env.VITE_API_TOKEN
  return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined
}

/** @returns {string} Path appended to API base for file uploads */
export function getApiUploadPath() {
  const raw = import.meta.env.VITE_API_UPLOAD_PATH
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim().startsWith('/') ? raw.trim() : `/${raw.trim()}`
  }
  return '/upload'
}
