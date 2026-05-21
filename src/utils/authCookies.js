/** Cookie names for auth tokens (readable by JS on this origin). */
export const ACCESS_TOKEN_COOKIE = 'exclusive_access_token'
export const REFRESH_TOKEN_COOKIE = 'exclusive_refresh_token'

/** Survives manual cookie delete in DevTools (refresh only). */
const REFRESH_BACKUP_KEY = 'exclusive_refresh_token_backup'

/** 7 days */
const ACCESS_MAX_AGE = 60 * 60 * 24 * 7
/** 30 days */
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30

/**
 * @param {number} [maxAgeSeconds]
 * @returns {string}
 */
function cookieAttributes(maxAgeSeconds) {
  const parts = ['path=/', 'SameSite=Lax']
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    parts.push('Secure')
  }
  if (maxAgeSeconds != null && maxAgeSeconds > 0) {
    parts.push(`max-age=${maxAgeSeconds}`)
  } else {
    parts.push('max-age=0')
  }
  return parts.join('; ')
}

/**
 * @param {string} name
 * @returns {string | null}
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * @param {string} name
 * @param {string} value
 * @param {number} maxAgeSeconds
 */
export function setCookie(name, value, maxAgeSeconds) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieAttributes(maxAgeSeconds)}`
}

/** @param {string} name */
export function deleteCookie(name) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; ${cookieAttributes(0)}`
}

/** @returns {string | null} */
export function getAccessTokenFromCookie() {
  return getCookie(ACCESS_TOKEN_COOKIE)
}

function readRefreshBackup() {
  if (typeof sessionStorage === 'undefined') return null
  const v = sessionStorage.getItem(REFRESH_BACKUP_KEY)
  return v && v.trim() ? v : null
}

function writeRefreshBackup(token) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(REFRESH_BACKUP_KEY, token)
}

function clearRefreshBackup() {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(REFRESH_BACKUP_KEY)
}

/** Cookie first, then sessionStorage backup (if user deleted cookie in DevTools). */
export function getRefreshTokenFromCookie() {
  const fromCookie = getCookie(REFRESH_TOKEN_COOKIE)
  if (fromCookie) return fromCookie
  const backup = readRefreshBackup()
  if (backup) {
    setRefreshTokenCookie(backup)
    return backup
  }
  return null
}

/** @param {string} token */
export function setAccessTokenCookie(token) {
  setCookie(ACCESS_TOKEN_COOKIE, token, ACCESS_MAX_AGE)
}

/** @param {string} token */
export function setRefreshTokenCookie(token) {
  setCookie(REFRESH_TOKEN_COOKIE, token, REFRESH_MAX_AGE)
  writeRefreshBackup(token)
}

export function clearAuthTokenCookies() {
  deleteCookie(ACCESS_TOKEN_COOKIE)
  deleteCookie(REFRESH_TOKEN_COOKIE)
  clearRefreshBackup()
}
