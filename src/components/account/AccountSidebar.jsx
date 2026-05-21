import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../api/auth'
import { Button } from '../ui/Button'

function linkClass(isActive) {
  return [
    'block rounded-md px-3 py-2 text-sm transition',
    isActive ? 'bg-exclusive-red/10 font-medium text-exclusive-red' : 'text-exclusive-dark hover:bg-app-muted',
  ].join(' ')
}

function Placeholder({ children }) {
  return (
    <span className="block cursor-not-allowed rounded-md px-3 py-2 text-sm text-exclusive-muted">{children}</span>
  )
}

export default function AccountSidebar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav aria-label="Account" className="lg:sticky lg:top-28">
      <div className="space-y-8 rounded-md border border-app-border bg-app-card p-4 shadow-sm ring-1 ring-app-ring md:p-6">
        <div>
          <p className="mb-3 text-base font-semibold text-exclusive-dark">Manage My Account</p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/account" end className={({ isActive }) => linkClass(isActive)}>
                My Profile
              </NavLink>
            </li>
            <li>
              <Placeholder>Address Book</Placeholder>
            </li>
            <li>
              <Placeholder>My Payment Options</Placeholder>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-base font-semibold text-exclusive-dark">My Orders</p>
          <ul className="space-y-1">
            <li>
              <Placeholder>My Returns</Placeholder>
            </li>
            <li>
              <Placeholder>My Cancellations</Placeholder>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-base font-semibold text-exclusive-dark">My Wishlist</p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/wishlist" className={({ isActive }) => linkClass(isActive)}>
                My Wishlist
              </NavLink>
            </li>
          </ul>
        </div>

        <Button type="button" variant="outline" fullWidth className="text-sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </nav>
  )
}
