import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'

export default function SignUpPage() {
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
        <p className="mt-3 text-exclusive-muted">Enter your details below</p>

        <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <TextField required type="text" name="name" placeholder="Name" autoComplete="name" />
          <TextField
            required
            type="text"
            name="emailOrPhone"
            placeholder="Email or Phone Number"
            autoComplete="email"
          />
          <TextField
            required
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
          />

          <Button type="submit" variant="primary" size="md" fullWidth>
            Create Account
          </Button>

          <Button type="button" variant="secondary" fullWidth>
            Sign up with Google
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
