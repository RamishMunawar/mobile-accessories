import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MOCK_CREDENTIALS, isLoggedIn, loginMock } from '../auth/mockAuth'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = typeof location.state?.from === 'string' ? location.state.from : '/'

  const [error, setError] = useState('')

  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('emailOrPhone') ?? '')
    const password = String(fd.get('password') ?? '')
    const result = loginMock(email, password)
    if (result.ok) {
      navigate(from === '/login' ? '/' : from, { replace: true })
      return
    }
    setError(result.error)
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden min-h-[240px] overflow-hidden bg-neutral-900 md:block md:min-h-screen">
        <img
          src="https://trendsters.pk/cdn/shop/collections/4_3_11zon.webp?v=1768557750"
          alt="Mobile accessories"
          className="h-full min-h-[240px] w-full object-cover object-center md:min-h-screen"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Log in to Exclusive
        </h1>
        <p className="mt-3 text-exclusive-muted">Enter your details below</p>

        <p className="mt-4 rounded-lg bg-app-muted px-4 py-3 text-sm text-exclusive-dark">
          <span className="font-medium">Demo login:</span>{' '}
          <span className="tabular-nums">{MOCK_CREDENTIALS.email}</span> /{' '}
          <span className="tabular-nums">{MOCK_CREDENTIALS.password}</span>
        </p>

        {error ? (
          <p
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/35 dark:text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <TextField
            required
            type="email"
            name="emailOrPhone"
            placeholder="Email or Phone Number"
            autoComplete="username"
            defaultValue={MOCK_CREDENTIALS.email}
          />
          <TextField
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            defaultValue={MOCK_CREDENTIALS.password}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button type="submit" variant="primary" size="md">
              Log In
            </Button>
            <Button type="button" variant="ghost">
              Forgot Password?
            </Button>
          </div>

          <Button type="button" variant="secondary" fullWidth>
            Continue with Google
          </Button>
        </form>

        <p className="mt-10 text-center text-exclusive-muted">
          Don’t have an account?{' '}
          <Link to="/signup" className="font-medium text-exclusive-dark underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
