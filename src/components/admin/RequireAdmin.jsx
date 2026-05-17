import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLoggedIn } from '../../auth/mockAuth'

export default function RequireAdmin() {
  const location = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
