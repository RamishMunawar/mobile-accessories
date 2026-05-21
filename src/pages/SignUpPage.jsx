import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage, registerUser } from '../api/auth'
import { isApiConfigured } from '../config/env'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isApiConfigured()) {
      setError('API is not configured. Set VITE_API_BASE_URL in your .env file and restart the dev server.')
      return
    }

    const fd = new FormData(e.currentTarget)
    const firstName = String(fd.get('firstName') ?? '').trim()
    const lastName = String(fd.get('lastName') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const phone = String(fd.get('phone') ?? '').trim()
    const password = String(fd.get('password') ?? '')

    if (!firstName || !lastName || !email || !phone || !password) {
      setError('Please fill in all fields.')
      return
    }

    setSubmitting(true)
    try {
      await registerUser({ email, password, firstName, lastName, phone })
      navigate('/login', {
        replace: true,
        state: {
          registeredEmail: email,
          message: 'Account created successfully. Please log in.',
        },
      })
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden bg-[#CBE4E8] md:flex md:items-center md:justify-center">
        <div className="relative mx-auto max-w-lg p-12">
          <div
            className="aspect-square max-h-[420px] rounded-full bg-gradient-to-br from-sky-200/80 to-teal-100"
            aria-hidden
          />
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=640&h=640&fit=crop"
            alt=""
            className="absolute bottom-8 left-1/2 w-[min(90%,420px)] -translate-x-1/2 drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Create an account
        </h1>
        <p className="mt-3 text-exclusive-muted">Register with your backend account</p>

        {error ? (
          <p
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/35 dark:text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              required
              type="text"
              name="firstName"
              placeholder="First name"
              autoComplete="given-name"
            />
            <TextField
              required
              type="text"
              name="lastName"
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>
          <TextField required type="email" name="email" placeholder="Email" autoComplete="email" />
          <TextField
            required
            type="tel"
            name="phone"
            placeholder="Phone"
            autoComplete="tel"
          />
          <TextField
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            minLength={8}
          />

          <Button type="submit" variant="primary" size="md" fullWidth disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-10 text-center text-exclusive-muted">
          Already have account?{' '}
          <Link to="/login" className="font-medium text-exclusive-dark underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
