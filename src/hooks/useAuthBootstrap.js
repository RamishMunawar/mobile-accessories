import { useEffect, useState } from 'react'
import { bootstrapAuthSession } from '../api/auth'
import { isLoggedIn } from '../auth/mockAuth'

/** Restores access from refresh cookie when needed; re-checks on auth events and tab focus. */
export function useAuthBootstrap() {
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(() => isLoggedIn())

  useEffect(() => {
    let cancelled = false

    async function run() {
      await bootstrapAuthSession()
      if (!cancelled) {
        setAllowed(isLoggedIn())
        setReady(true)
      }
    }

    run()

    const sync = () => {
      setAllowed(isLoggedIn())
      setReady(true)
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') run()
    }

    window.addEventListener('storage', sync)
    window.addEventListener('exclusive-mock-auth', sync)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      window.removeEventListener('storage', sync)
      window.removeEventListener('exclusive-mock-auth', sync)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return { ready, allowed }
}
