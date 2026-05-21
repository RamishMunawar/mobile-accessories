import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminUser } from '../../auth/mockAuth'
import { useAuthBootstrap } from '../../hooks/useAuthBootstrap'

export default function RequireAdmin() {
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

  if (!isAdminUser()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
