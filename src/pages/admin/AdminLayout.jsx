import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logoutMock } from '../../auth/mockAuth'
import { clearAdminSession } from '../../site/adminAuth'
import { cn } from '../../utils/cn'

const nav = [
  { to: '/admin', label: 'Overview', end: true, icon: IconGauge },
  { to: '/admin/hero', label: 'Hero banners', icon: IconImage },
  { to: '/admin/products', label: 'Products', icon: IconCart },
  { to: '/admin/categories', label: 'Categories & watches', icon: IconLayers },
  { to: '/admin/featured-arrival', label: 'Featured arrival', icon: IconSparkles },
  { to: '/admin/promo-banner', label: 'Music promo banner', icon: IconMegaphone },
  { to: '/admin/story-carousel', label: '3D story carousel', icon: IconCarousel },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  function logout() {
    clearAdminSession()
    logoutMock()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-muted/50 via-app-bg to-app-bg dark:from-zinc-950 dark:via-app-bg dark:to-app-bg">
      <div className="mx-auto flex max-w-[1280px] gap-0 lg:gap-8 lg:px-4 lg:py-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl border border-app-border bg-app-card shadow-[0_8px_30px_-12px_rgb(0_0_0/0.12)] ring-1 ring-app-ring dark:shadow-[0_8px_40px_-12px_rgb(0_0_0/0.55)] dark:ring-white/[0.06]">
            <div className="border-b border-app-border-subtle bg-gradient-to-br from-exclusive-red/[0.07] via-transparent to-transparent px-5 py-6 dark:from-exclusive-red/[0.12]">
              <Link to="/admin" className="block transition hover:opacity-90">
                <p className="font-display text-xl font-bold tracking-tight text-exclusive-dark">Exclusive</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-exclusive-muted">
                  Store admin
                </p>
              </Link>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-app-border-subtle bg-app-muted/50 px-2.5 py-1 text-[11px] font-medium text-exclusive-muted dark:bg-app-muted/30">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/75 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Local preview
              </div>
            </div>

            <nav className="flex flex-col gap-0.5 p-3" aria-label="Admin">
              {nav.map(({ to, label, end, icon: Icon }) => (
                <NavLink key={to} to={to} end={end} className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-exclusive-red/35">
                  {({ isActive }) => (
                    <span
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200',
                        isActive
                          ? 'bg-exclusive-red/[0.1] text-exclusive-red shadow-sm ring-1 ring-exclusive-red/15 dark:bg-exclusive-red/15 dark:ring-exclusive-red/20'
                          : 'text-exclusive-muted hover:bg-app-muted hover:text-exclusive-dark dark:hover:bg-app-muted/60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition',
                          isActive
                            ? 'border-exclusive-red/25 bg-app-card text-exclusive-red shadow-sm dark:border-exclusive-red/30 dark:bg-zinc-900'
                            : 'border-transparent bg-app-muted/70 text-exclusive-muted dark:bg-app-muted/50',
                        )}
                        aria-hidden
                      >
                        <Icon />
                      </span>
                      <span className="leading-snug">{label}</span>
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-app-border-subtle p-3">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-exclusive-muted transition hover:bg-app-muted hover:text-exclusive-dark dark:hover:bg-app-muted/50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-app-muted/60 dark:bg-app-muted/40">
                  <IconStorefront className="h-4 w-4 text-exclusive-muted" />
                </span>
                View storefront
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-exclusive-muted transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-app-muted/60 dark:bg-app-muted/40">
                  <IconLogout className="h-4 w-4 text-exclusive-muted" />
                </span>
                Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-8 sm:px-5 lg:px-2 lg:py-2">
          <header className="mb-8 rounded-2xl border border-app-border bg-app-card/80 px-4 py-4 shadow-sm backdrop-blur-sm dark:bg-app-card/90 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg font-bold text-exclusive-dark">Exclusive</p>
                <p className="text-xs text-exclusive-muted">Admin</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-exclusive-red ring-1 ring-exclusive-red/25 transition hover:bg-exclusive-red/10"
                >
                  Store
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-exclusive-muted underline-offset-4 hover:underline"
                >
                  Out
                </button>
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {nav.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition',
                      isActive
                        ? 'bg-exclusive-red text-white shadow-md shadow-exclusive-red/25'
                        : 'border border-app-border-strong bg-app-muted/40 text-exclusive-muted hover:border-app-border hover:bg-app-muted',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </header>

          <div className="rounded-2xl border border-app-border/80 bg-app-card/70 p-6 shadow-[0_1px_3px_rgb(0_0_0/0.04)] backdrop-blur-sm dark:border-app-border dark:bg-app-card/50 sm:p-8 lg:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

function IconCarousel() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M8 10v4M16 10v4" strokeLinecap="round" />
      <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconMegaphone() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <path d="M4 10v4h4l5 5V5L8 10H4z" strokeLinejoin="round" />
      <path d="M15 9a4 4 0 010 6M17 7a7 7 0 010 10" strokeLinecap="round" />
    </svg>
  )
}

function IconSparkles() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3" strokeLinecap="round" />
      <path
        d="M12 8c-1.5 2-3 3.5-5 5 2 1.5 3.5 3 5 5 1.5-2 3-3.5 5-5-2-1.5-3.5-3-5-5Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGauge() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 14V8m-4 9l4-9 4 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.65" />
      <path d="m21 16-6-6-12 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <path d="M6 20h14l-3-13H9.5m0 0L8 7H4m5.5 2h8.5m-13 13a1 1 0 101.5 1.5 1 1 0 00-1.5-1.5Zm12 0a1 1 0 101.5 1.5 1 1 0 00-1.5-1.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <path d="M12 4 3 9l9 5 9-5-9-5Zm0 15L4 17l8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 12 8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconStorefront({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <path d="M4 21V10l8-7 8 7v11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9M3 21h18" strokeLinecap="round" />
    </svg>
  )
}

function IconLogout({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.85">
      <path d="M10 21H5a2 2 0 01-2-2V5a2 2 0 012-2h5M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
