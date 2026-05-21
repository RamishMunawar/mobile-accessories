/**
 * @param {string | undefined} token
 * @param {number} [skewSeconds] Refresh this many seconds before exp.
 */
export function isAccessTokenExpired(token, skewSeconds = 30) {
  if (!token || typeof token !== 'string') return true
  try {
    const parts = token.split('.')
    if (parts.length < 2) return false
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    const exp = payload.exp
    if (typeof exp !== 'number') return false
    return Date.now() >= (exp - skewSeconds) * 1000
  } catch {
    return false
  }
}
