import { getApiBaseUrl } from '../config/env'
import {
  ACCESS_TOKEN_COOKIE,
  clearAuthTokenCookies,
  deleteCookie,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '../utils/authCookies'

const STORAGE_KEY = 'exclusive-mock-session'

/** Fixed demo account — change here if you want different mock credentials */
export const MOCK_CREDENTIALS = {
  email: 'demo@gmail.com',
  password: '123',
}

/**
 * @typedef {{
 *   email: string
 *   name: string
 *   token?: string
 *   refreshToken?: string
 *   firstName?: string
 *   lastName?: string
 *   phone?: string
 *   role?: string
 * }} AuthSession
 */

/** Only sets cookies that are provided — never clears the other token on login. */
function writeTokenCookies(tokens) {
  if (tokens.token) setAccessTokenCookie(tokens.token)
  if (tokens.refreshToken) setRefreshTokenCookie(tokens.refreshToken)
}

/** @param {AuthSession} session @returns {Record<string, unknown>} */
function profileForStorage(session) {
  return {
    email: session.email,
    name: session.name,
    ...(session.firstName ? { firstName: session.firstName } : {}),
    ...(session.lastName ? { lastName: session.lastName } : {}),
    ...(session.phone ? { phone: session.phone } : {}),
    ...(session.role ? { role: session.role } : {}),
  }
}

/** @param {AuthSession | null | undefined} [session] */
export function isAdminUser(session = getSession()) {
  return String(session?.role ?? '').toUpperCase() === 'ADMIN'
}

/**
 * @param {string} [from]
 * @param {AuthSession | null} [session]
 */
export function getPostLoginPath(from = '/', session = getSession()) {
  if (isAdminUser(session)) return '/admin'
  if (from && from !== '/login' && !from.startsWith('/admin')) return from
  return '/'
}

/** Migrate legacy localStorage tokens into cookies once. */
function migrateLegacyTokensInStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return
    let changed = false
    if (typeof o.token === 'string' && o.token && !getAccessTokenFromCookie()) {
      setAccessTokenCookie(o.token)
      delete o.token
      changed = true
    }
    if (typeof o.refreshToken === 'string' && o.refreshToken && !getRefreshTokenFromCookie()) {
      setRefreshTokenCookie(o.refreshToken)
      delete o.refreshToken
      changed = true
    }
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(o))
  } catch {
    // ignore
  }
}

/** @returns {AuthSession | null} */
export function getSession() {
  if (typeof window === 'undefined') return null
  migrateLegacyTokensInStorage()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw)
    if (!o || typeof o.email !== 'string') return null

    return {
      email: o.email,
      name: o.name ?? 'User',
      token: getAccessTokenFromCookie() ?? undefined,
      refreshToken: getRefreshTokenFromCookie() ?? undefined,
      firstName: typeof o.firstName === 'string' ? o.firstName : undefined,
      lastName: typeof o.lastName === 'string' ? o.lastName : undefined,
      phone: typeof o.phone === 'string' ? o.phone : undefined,
      role: typeof o.role === 'string' ? o.role : undefined,
    }
  } catch {
    return null
  }
}

/** @param {AuthSession} session */
export function setAuthSession(session) {
  if (typeof window === 'undefined') return

  writeTokenCookies({
    token: session.token,
    refreshToken: session.refreshToken,
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profileForStorage(session)))
  window.dispatchEvent(new CustomEvent('exclusive-mock-auth'))
}

/**
 * After successful API login.
 * @param {{ email: string; name: string; token?: string; firstName?: string; lastName?: string; phone?: string; role?: string }} user
 * @param {{ token?: string; refreshToken?: string } | string} [tokens]
 */
export function setAuthSessionFromApi(user, tokens) {
  const access =
    typeof tokens === 'string' ? tokens : typeof tokens?.token === 'string' ? tokens.token : undefined
  const refresh =
    typeof tokens === 'object' && tokens !== null && typeof tokens.refreshToken === 'string'
      ? tokens.refreshToken
      : undefined

  setAuthSession({
    email: user.email,
    name: user.name,
    token: access,
    refreshToken: refresh,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
  })
}

/** @param {{ token?: string; refreshToken?: string }} tokens */
export function updateAuthTokens(tokens) {
  const session = getSession()
  if (!session) return

  if (tokens.token !== undefined) {
    if (tokens.token) setAccessTokenCookie(tokens.token)
    else deleteCookie(ACCESS_TOKEN_COOKIE)
  }
  if (tokens.refreshToken !== undefined) {
    if (tokens.refreshToken) setRefreshTokenCookie(tokens.refreshToken)
    else deleteCookie(REFRESH_TOKEN_COOKIE)
  }

  window.dispatchEvent(new CustomEvent('exclusive-mock-auth'))
}

/**
 * Logged in when profile exists. With API: need access or refresh cookie (access alone may be restored via refresh).
 */
export function isLoggedIn() {
  const session = getSession()
  if (!session) return false
  if (!getApiBaseUrl()) return true
  return Boolean(session.token || session.refreshToken)
}

/** @returns {{ ok: true } | { ok: false; error: string }} */
export function loginMock(email, password) {
  const e = (email ?? '').trim().toLowerCase()
  const p = password ?? ''
  if (e === MOCK_CREDENTIALS.email.toLowerCase() && p === MOCK_CREDENTIALS.password) {
    setAuthSession({ email: MOCK_CREDENTIALS.email, name: 'Demo Shopper' })
    return { ok: true }
  }
  return { ok: false, error: 'Invalid email or password. Use the demo credentials below.' }
}

export function logoutMock() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  clearAuthTokenCookies()
  window.dispatchEvent(new CustomEvent('exclusive-mock-auth'))
}
