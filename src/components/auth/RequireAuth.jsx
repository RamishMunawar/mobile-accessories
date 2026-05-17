import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLoggedIn } from '../../auth/mockAuth'

/** Customer storefront: must pass mock login before seeing MainLayout routes. */
export default function RequireAuth() {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)

  function sync() {
    setAllowed(isLoggedIn())
    setReady(true)
  }

  useEffect(() => {
    sync()
    const onStorage = () => sync()
    const onAuth = () => sync()
    window.addEventListener('storage', onStorage)
    window.addEventListener('exclusive-mock-auth', onAuth)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('exclusive-mock-auth', onAuth)
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-exclusive-muted">
        Loading…
      </div>
    )
  }

  if (!allowed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
