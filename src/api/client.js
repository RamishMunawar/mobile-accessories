import { getSession } from '../auth/mockAuth'
import { getApiBaseUrl, getApiToken } from '../config/env'

export class ApiError extends Error {
  /** @param {number} status @param {string} message @param {unknown} [body] */
  constructor(status, message, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * @param {string} path e.g. `/products` or `health`
 * @returns {string}
 */
export function apiUrl(path) {
  const base = getApiBaseUrl()
  if (!base) throw new Error('VITE_API_BASE_URL is not set. Add it to your .env file.')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 * @param {boolean} [allowRefreshRetry]
 */
export async function apiRequest(path, init = {}, allowRefreshRetry = true) {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const isAuthRoute = path.startsWith('/auth/')
  if (allowRefreshRetry && !isAuthRoute && getApiBaseUrl() && !getApiToken()) {
    const session = getSession()
    if (session?.refreshToken || session?.token) {
      const { ensureApiAccessToken } = await import('./auth.js')
      await ensureApiAccessToken()
    }
  }

  const token = getApiToken() ?? getSession()?.token
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(apiUrl(path), { ...init, headers, credentials: 'include' })
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

  if (res.status === 401 && allowRefreshRetry && !path.startsWith('/auth/')) {
    const { refreshSessionIfNeeded, logout } = await import('./auth.js')
    const session = getSession()
    if (session?.refreshToken) {
      const refreshed = await refreshSessionIfNeeded({ force: true })
      if (refreshed) return apiRequest(path, init, false)
    }
    if (!getSession()?.refreshToken) {
      await logout()
    }
  }

  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data !== null && 'message' in data
        ? String(/** @type {{ message: unknown }} */ (data).message)
        : typeof data === 'string'
          ? data
          : res.statusText || `Request failed (${res.status})`
    throw new ApiError(res.status, msg, data)
  }

  return data
}

/** @param {string} path */
export function apiGet(path) {
  return apiRequest(path, { method: 'GET' })
}

/**
 * @param {string} path
 * @param {unknown} body
 */
export function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

/**
 * @param {string} path
 * @param {unknown} body
 */
export function apiPut(path, body) {
  return apiRequest(path, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

/**
 * @param {string} path
 * @param {unknown} [body]
 */
export function apiPatch(path, body) {
  return apiRequest(path, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

/** @param {string} path */
export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' })
}

/** @returns {Promise<{ ok: boolean; status?: number; error?: string }>} */
export async function pingApi() {
  if (!getApiBaseUrl()) return { ok: false, error: 'VITE_API_BASE_URL not set' }
  const probes = ['/health', '/ping', '']
  for (const probe of probes) {
    try {
      await apiGet(probe)
      return { ok: true, status: 200 }
    } catch (err) {
      if (err instanceof ApiError && err.status > 0 && err.status < 500) {
        return { ok: true, status: err.status }
      }
    }
  }
  return {
    ok: false,
    error: 'Could not reach API. Is the backend running on port 3000?',
  }
}
