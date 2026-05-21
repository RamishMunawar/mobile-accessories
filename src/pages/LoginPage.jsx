import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage, loginUser } from '../api/auth'
import { isApiConfigured } from '../config/env'
import {
  MOCK_CREDENTIALS,
  getPostLoginPath,
  getSession,
  isLoggedIn,
  loginMock,
  setAuthSessionFromApi,
} from '../auth/mockAuth'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = typeof location.state?.from === 'string' ? location.state.from : '/'
  const registeredEmail =
    typeof location.state?.registeredEmail === 'string' ? location.state.registeredEmail : ''
  const successMessage =
    typeof location.state?.message === 'string' ? location.state.message : ''

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const useApi = isApiConfigured()

  if (isLoggedIn()) {
    return <Navigate to={getPostLoginPath(from, getSession())} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')

    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }

    setSubmitting(true)
    try {
      if (useApi) {
        const result = await loginUser({ email, password })
        if (!result.user.email) {
          setError('Login succeeded but no user email was returned from the API.')
          return
        }
        if (!result.token) {
          setError(
            'Please verify your email before logging in. Check your inbox for the verification link.',
          )
          return
        }
        if (!result.refreshToken) {
          console.warn(
            '[auth] Login response has no refreshToken — deleting the access cookie will end the session until you log in again.',
          )
        }
        setAuthSessionFromApi(result.user, {
          token: result.token,
          refreshToken: result.refreshToken,
        })
        navigate(getPostLoginPath(from, getSession()), { replace: true })
        return
      } else {
        const result = loginMock(email, password)
        if (!result.ok) {
          setError(result.error)
          return
        }
      }

      navigate(getPostLoginPath(from, getSession()), { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err, 'login'))
    } finally {
      setSubmitting(false)
    }
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
        <p className="mt-3 text-exclusive-muted">Enter your email and password</p>

        {successMessage || registeredEmail ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-200">
            {successMessage ||
              `Account created for ${registeredEmail}. Please log in with your password.`}
          </p>
        ) : null}

        {!useApi ? (
          <p className="mt-4 rounded-lg bg-app-muted px-4 py-3 text-sm text-exclusive-dark">
            <span className="font-medium">Demo login</span> (no API in .env):{' '}
            <span className="tabular-nums">{MOCK_CREDENTIALS.email}</span> /{' '}
            <span className="tabular-nums">{MOCK_CREDENTIALS.password}</span>
          </p>
        ) : null}

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
            name="email"
            placeholder="Email"
            autoComplete="username"
            defaultValue={registeredEmail || (useApi ? '' : MOCK_CREDENTIALS.email)}
          />
          <TextField
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            defaultValue={useApi ? '' : MOCK_CREDENTIALS.password}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log In'}
            </Button>
            <Button type="button" variant="ghost">
              Forgot Password?
            </Button>
          </div>
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
