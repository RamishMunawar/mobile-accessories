import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAuthErrorMessage, verifyEmail } from '../api/auth'
import { isApiConfigured } from '../config/env'
import { ButtonLink } from '../components/ui/Button'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState(/** @type {'idle' | 'loading' | 'success' | 'error'} */ ('idle'))
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token. Open the full link from your email.')
      return
    }
    if (!isApiConfigured()) {
      setStatus('error')
      setMessage('API is not configured. Set VITE_API_BASE_URL in .env and restart the dev server.')
      return
    }

    let cancelled = false
    setStatus('loading')

    verifyEmail(token)
      .then(() => {
        if (cancelled) return
        setStatus('success')
        setMessage('Your email has been verified. You can log in now.')
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('error')
        setMessage(getAuthErrorMessage(err, 'verify'))
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-app-border-subtle bg-app-card p-8 shadow-sm ring-1 ring-app-ring">
        <h1 className="font-display text-2xl font-semibold text-exclusive-dark">Verify email</h1>

        {status === 'loading' ? (
          <p className="mt-4 text-sm text-exclusive-muted">Verifying your email…</p>
        ) : null}

        {status === 'success' ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-200">
            {message}
          </p>
        ) : null}

        {status === 'error' ? (
          <p
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/35 dark:text-red-200"
            role="alert"
          >
            {message}
          </p>
        ) : null}

        {status !== 'loading' ? (
          <div className="mt-8">
            <ButtonLink to="/login" variant="primary" size="md" fullWidth>
              Go to login
            </ButtonLink>
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-exclusive-muted">
          <Link to="/" className="font-medium text-exclusive-dark underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
