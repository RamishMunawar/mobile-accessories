import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ThemeContext } from './themeContext.js'

const STORAGE_KEY = 'exclusive-theme'

function subscribeSystemTheme(callback) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSystemDarkSnapshot() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getSystemDarkServerSnapshot() {
  return false
}

function readStoredTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    /* ignore */
  }
  return 'system'
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveTheme(mode) {
  if (mode === 'dark' || mode === 'light') return mode
  return systemPrefersDark() ? 'dark' : 'light'
}

function applyDocumentTheme(mode) {
  const resolved = resolveTheme(mode)
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)
  const systemDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemDarkSnapshot,
    getSystemDarkServerSnapshot,
  )

  const setTheme = useCallback((next) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    applyDocumentTheme(next)
  }, [])

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      applyDocumentTheme(next)
      return next
    })
  }, [])

  useEffect(() => {
    applyDocumentTheme(theme)
  }, [theme, systemDark])

  const resolved = useMemo(
    () => (theme === 'system' ? (systemDark ? 'dark' : 'light') : theme),
    [theme, systemDark],
  )

  const value = useMemo(
    () => ({ theme, setTheme, resolved, cycleTheme }),
    [theme, resolved, setTheme, cycleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
