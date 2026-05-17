const SESSION_KEY = 'exclusive-admin-auth'

export function isAdminSession() {
  return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1'
}

export function setAdminSession() {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function verifyAdminPassword(password) {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123'
  return password === expected
}
