import { useState } from 'react'
import { Link } from 'react-router-dom'
import AccountSidebar from '../components/account/AccountSidebar'
import { Button } from '../components/ui/Button'

const inputClass =
  'mt-2 w-full rounded-md bg-app-muted px-4 py-3 text-base text-exclusive-dark outline-none ring-1 ring-transparent transition placeholder:text-exclusive-muted focus:bg-app-card focus:ring-2 focus:ring-exclusive-red/25'

const initial = {
  firstName: 'Md',
  lastName: 'Rimel',
  email: 'rimel1111@gmail.com',
  address: 'Kingston, 5236, United State',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export default function AccountPage() {
  const [form, setForm] = useState(initial)
  const [saved, setSaved] = useState(false)

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setSaved(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSaved(true)
  }

  function handleCancel() {
    setForm(initial)
    setSaved(false)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-exclusive-muted">
          <Link to="/" className="hover:text-exclusive-dark">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-exclusive-dark">My Account</span>
        </nav>
        <p className="text-base text-exclusive-dark">
          Welcome!{' '}
          <span className="font-semibold text-exclusive-red">
            {form.firstName} {form.lastName}
          </span>
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:items-start xl:gap-16">
        <AccountSidebar />

        <div className="rounded-md border border-app-border bg-app-card p-6 shadow-sm ring-1 ring-app-ring md:p-8 lg:p-10">
          <h1 className="font-display text-xl font-semibold text-exclusive-red md:text-2xl">Edit Your Profile</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-medium text-exclusive-dark">
                First Name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={update('firstName')}
                  autoComplete="given-name"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-exclusive-dark">
                Last Name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={update('lastName')}
                  autoComplete="family-name"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-exclusive-dark md:col-span-2">
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  autoComplete="email"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-exclusive-dark md:col-span-2">
                Address
                <input
                  name="address"
                  value={form.address}
                  onChange={update('address')}
                  autoComplete="street-address"
                  className={inputClass}
                />
              </label>
            </div>

            <div>
              <h2 className="text-base font-semibold text-exclusive-dark">Password Changes</h2>
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-exclusive-dark">
                  Current Password
                  <input
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={form.currentPassword}
                    onChange={update('currentPassword')}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-exclusive-dark">
                  New Password
                  <input
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.newPassword}
                    onChange={update('newPassword')}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-exclusive-dark">
                  Confirm New Password
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-4 border-t border-app-border pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="text-base font-medium text-exclusive-dark underline underline-offset-4 hover:text-exclusive-red"
              >
                Cancel
              </button>
              <Button type="submit" variant="primary" className="min-w-[160px] px-8 py-3">
                Save Changes
              </Button>
            </div>
            {saved ? (
              <p className="text-end text-sm font-medium text-exclusive-green" role="status">
                Profile saved (demo).
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}
