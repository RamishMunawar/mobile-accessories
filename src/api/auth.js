import { getApiBaseUrl } from '../config/env'
import { getSession, isLoggedIn, logoutMock, updateAuthTokens } from '../auth/mockAuth'
import { isAccessTokenExpired } from '../utils/jwt'
import { apiPost, ApiError } from './client'

/**
 * @typedef {{
 *   email: string
 *   password: string
 *   firstName: string
 *   lastName: string
 *   phone: string
 * }} RegisterPayload
 */

/**
 * @typedef {{ email: string; password: string }} LoginPayload
 */

/**
 * @typedef {{
 *   token?: string
 *   refreshToken?: string
 *   user: { email: string; firstName?: string; lastName?: string; phone?: string; name: string; role?: string }
 *   raw: unknown
 * }} AuthResult
 */

/**
 * @param {unknown} data
 * @returns {AuthResult}
 */
function normalizeAuthResponse(data) {
  const root = data && typeof data === 'object' ? /** @type {Record<string, unknown>} */ (data) : {}
  const inner =
    root.data && typeof root.data === 'object'
      ? /** @type {Record<string, unknown>} */ (root.data)
      : root

  const userRaw =
    inner.user && typeof inner.user === 'object'
      ? /** @type {Record<string, unknown>} */ (inner.user)
      : inner

  const email = String(userRaw.email ?? '').trim()
  const firstName = String(userRaw.firstName ?? userRaw.first_name ?? '').trim()
  const lastName = String(userRaw.lastName ?? userRaw.last_name ?? '').trim()
  const phone = String(userRaw.phone ?? '').trim()
  const name =
    [firstName, lastName].filter(Boolean).join(' ') ||
    String(userRaw.name ?? '').trim() ||
    email.split('@')[0] ||
    'User'

  const tokensBlock =
    inner.tokens && typeof inner.tokens === 'object'
      ? /** @type {Record<string, unknown>} */ (inner.tokens)
      : inner.auth && typeof inner.auth === 'object'
        ? /** @type {Record<string, unknown>} */ (inner.auth)
        : null

  const pickString = (...vals) => {
    for (const v of vals) {
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
    return undefined
  }

  const token = pickString(
    inner.token,
    inner.accessToken,
    inner.access_token,
    tokensBlock?.token,
    tokensBlock?.accessToken,
    tokensBlock?.access_token,
    root.token,
    root.accessToken,
    root.access_token,
  )

  const refreshToken = pickString(
    inner.refreshToken,
    inner.refresh_token,
    tokensBlock?.refreshToken,
    tokensBlock?.refresh_token,
    root.refreshToken,
    root.refresh_token,
  )

  const role = pickString(userRaw.role, inner.role, root.role)

  return {
    token,
    refreshToken,
    user: { email, firstName, lastName, phone, name, role },
    raw: data,
  }
}

/**
 * POST /api/v1/auth/register
 * @param {RegisterPayload} payload
 * @returns {Promise<AuthResult>}
 */
export async function registerUser(payload) {
  const body = {
    email: payload.email.trim(),
    password: payload.password,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    phone: payload.phone.trim(),
  }

  const data = await apiPost('/auth/register', body)
  return normalizeAuthResponse(data)
}

/**
 * POST /api/v1/auth/login
 * @param {LoginPayload} payload
 * @returns {Promise<AuthResult>}
 */
export async function loginUser(payload) {
  const body = {
    email: payload.email.trim(),
    password: payload.password,
  }

  const data = await apiPost('/auth/login', body)
  return normalizeAuthResponse(data)
}

/**
 * POST /api/v1/auth/refresh — body and/or httpOnly cookies (credentials: include).
 * @param {string} [refreshToken]
 * @returns {Promise<AuthResult>}
 */
export async function refreshAuth(refreshToken) {
  const base = getApiBaseUrl()
  if (!base) throw new Error('VITE_API_BASE_URL is not set.')

  const init = {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }

  if (refreshToken) {
    const res = await fetch(`${base}/auth/refresh`, {
      ...init,
      body: JSON.stringify({ refreshToken }),
    })
    return parseRefreshResponse(res)
  }

  const res = await fetch(`${base}/auth/refresh`, {
    ...init,
    body: JSON.stringify({}),
  })
  return parseRefreshResponse(res)
}

/** @param {Response} res */
async function parseRefreshResponse(res) {

  const text = await res.text()
  /** @type {unknown} */
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data !== null && 'message' in data
        ? String(/** @type {{ message: unknown }} */ (data).message)
        : res.statusText || `Refresh failed (${res.status})`
    throw new ApiError(res.status, msg, data)
  }

  return normalizeAuthResponse(data)
}

function isAuthFailureStatus(status) {
  return status === 401 || status === 403
}

/**
 * POST /api/v1/auth/logout
 * @param {string} refreshToken
 */
export async function logoutAuth(refreshToken) {
  const base = getApiBaseUrl()
  if (!base) throw new Error('VITE_API_BASE_URL is not set.')

  const res = await fetch(`${base}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  })

  const text = await res.text()
  /** @type {unknown} */
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data !== null && 'message' in data
        ? String(/** @type {{ message: unknown }} */ (data).message)
        : res.statusText || `Logout failed (${res.status})`
    throw new ApiError(res.status, msg, data)
  }

  return data
}

/**
 * Calls backend logout (if refresh token exists), then clears local session.
 */
export async function logout() {
  const session = getSession()
  if (session?.refreshToken && getApiBaseUrl()) {
    try {
      await logoutAuth(session.refreshToken)
    } catch {
      // Always clear local session even if API logout fails
    }
  }
  logoutMock()
}

/**
 * Uses stored refresh token to get a new access token.
 * @param {{ force?: boolean }} [options] When true, refresh even if a token cookie exists (e.g. expired JWT).
 * @returns {Promise<boolean>}
 */
export async function refreshSessionIfNeeded(options = {}) {
  const session = getSession()
  if (!session?.refreshToken || !getApiBaseUrl()) return false

  const needsRefresh =
    options.force || !session.token || isAccessTokenExpired(session.token)

  if (!needsRefresh) return true

  try {
    let result = await refreshAuth(session.refreshToken)
    if (!result.token) {
      try {
        result = await refreshAuth()
      } catch {
        // cookie-only refresh not supported
      }
    }
    updateAuthTokens({
      token: result.token ?? session.token,
      refreshToken: result.refreshToken ?? session.refreshToken,
    })
    return Boolean(result.token)
  } catch (err) {
    if (err instanceof ApiError && isAuthFailureStatus(err.status)) {
      try {
        const fallback = await refreshAuth()
        updateAuthTokens({
          token: fallback.token,
          refreshToken: fallback.refreshToken ?? session.refreshToken,
        })
        return Boolean(fallback.token)
      } catch {
        return false
      }
    }
    return Boolean(getSession()?.token)
  }
}

/**
 * On load / tab focus: if access cookie is missing but refresh exists, verify refresh and restore access.
 * Logs out only when refresh is missing or invalid.
 * @returns {Promise<boolean>}
 */
export async function bootstrapAuthSession() {
  if (!getApiBaseUrl()) return isLoggedIn()

  const session = getSession()
  if (!session) return false

  if (session.token && !isAccessTokenExpired(session.token)) return true

  if (!session.refreshToken) {
    logoutMock()
    return false
  }

  try {
    const ok = await refreshSessionIfNeeded({ force: true })
    if (!ok) {
      const after = getSession()
      if (!after?.refreshToken) logoutMock()
      else if (!after?.token) return isLoggedIn()
      else return true
    }
    return ok || isLoggedIn()
  } catch (err) {
    if (err instanceof ApiError && isAuthFailureStatus(err.status)) {
      logoutMock()
      return false
    }
    return isLoggedIn()
  }
}

/**
 * GET /api/v1/auth/verify-email?token=...
 * @param {string} token
 */
export async function verifyEmail(token) {
  const q = new URLSearchParams({ token: token.trim() })
  const base = getApiBaseUrl()
  if (!base) throw new Error('VITE_API_BASE_URL is not set.')

  const res = await fetch(`${base}/auth/verify-email?${q}`, { method: 'GET', credentials: 'include' })
  const text = await res.text()
  /** @type {unknown} */
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data !== null && 'message' in data
        ? String(/** @type {{ message: unknown }} */ (data).message)
        : res.statusText || `Email verification failed (${res.status})`
    throw new ApiError(res.status, msg, data)
  }

  return data
}

/**
 * Refreshes access token when missing or expired (fixes 401 on DELETE/PATCH/POST).
 * @returns {Promise<boolean>}
 */
export async function ensureApiAccessToken() {
  const session = getSession()
  if (!getApiBaseUrl()) return true
  if (!session) return false
  if (session.token && !isAccessTokenExpired(session.token)) return true
  if (!session.refreshToken) return false
  return refreshSessionIfNeeded({ force: true })
}

/**
 * @param {unknown} err
 * @param {'login' | 'register' | 'refresh' | 'verify'} [action]
 * @returns {string}
 */
export function getAuthErrorMessage(err, action = 'register') {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  if (action === 'login') return 'Login failed. Check your email and password.'
  if (action === 'refresh') return 'Session expired. Please log in again.'
  if (action === 'verify') return 'Email verification failed. The link may be invalid or expired.'
  return 'Registration failed. Please try again.'
}
