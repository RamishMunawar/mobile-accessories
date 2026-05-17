const STORAGE_KEY = 'exclusive-cart-lines'

export function persistCartLines(lines) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    /* ignore */
  }
}

export function readCartLinesFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (
      Array.isArray(parsed) &&
      parsed.every((l) => l && typeof l.productId === 'string' && typeof l.qty === 'number')
    ) {
      return parsed
    }
  } catch {
    /* ignore */
  }
  return []
}
