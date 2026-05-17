const STORAGE_KEY = 'exclusive-mock-session'

/** Fixed demo account — change here if you want different mock credentials */
export const MOCK_CREDENTIALS = {
  email: 'demo@gmail.com',
  password: '123',
}

/** @returns {{ email: string; name: string } | null} */
export function getSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw)
    if (o && typeof o.email === 'string') return { email: o.email, name: o.name ?? 'User' }
    return null
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return getSession() !== null
}

/** @returns {{ ok: true } | { ok: false; error: string }} */
export function loginMock(email, password) {
  const e = (email ?? '').trim().toLowerCase()
  const p = password ?? ''
  if (e === MOCK_CREDENTIALS.email.toLowerCase() && p === MOCK_CREDENTIALS.password) {
    const session = { email: MOCK_CREDENTIALS.email, name: 'Demo Shopper' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    window.dispatchEvent(new CustomEvent('exclusive-mock-auth'))
    return { ok: true }
  }
  return { ok: false, error: 'Invalid email or password. Use the demo credentials below.' }
}

export function logoutMock() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('exclusive-mock-auth'))
}
