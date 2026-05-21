import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthBootstrap } from '../../hooks/useAuthBootstrap'

/** Customer storefront: must pass mock login before seeing MainLayout routes. */
export default function RequireAuth() {
  const location = useLocation()
  const { ready, allowed } = useAuthBootstrap()

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
