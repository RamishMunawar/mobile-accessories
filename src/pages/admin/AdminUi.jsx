import { Link } from 'react-router-dom'

/**
 * Shared presentation for admin routes — keeps layout, alerts, and tabs consistent.
 */

/** @param {{ eyebrow?: string; title: string; description?: import('react').ReactNode }} props */
export function AdminPageHeader({ eyebrow = 'Admin', title, description }) {
  return (
    <header className="mb-10 border-b border-app-border-subtle pb-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-exclusive-red">{eyebrow}</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-exclusive-dark md:text-[2rem] md:leading-tight">
        {title}
      </h1>
      {description ? (
        <div className="mt-3 max-w-2xl text-[15px] leading-relaxed text-exclusive-muted">{description}</div>
      ) : null}
    </header>
  )
}

/** @param {{ variant: 'success' | 'error'; children: import('react').ReactNode }} props */
export function AdminFlash({ variant, children }) {
  if (!children) return null
  const wrap =
    variant === 'success'
      ? 'border-emerald-200/90 bg-gradient-to-r from-emerald-50/95 to-emerald-50/70 text-emerald-950 dark:border-emerald-900/60 dark:from-emerald-950/55 dark:to-emerald-950/30 dark:text-emerald-50'
      : 'border-red-200/90 bg-gradient-to-r from-red-50/95 to-red-50/70 text-red-950 dark:border-red-900/60 dark:from-red-950/50 dark:to-red-950/25 dark:text-red-50'

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`mb-8 flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-snug shadow-sm ${wrap}`}
    >
      {variant === 'success' ? (
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
          <IconCheck />
        </span>
      ) : (
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-700 dark:bg-red-400/20 dark:text-red-200">
          <IconAlert />
        </span>
      )}
      <div className="min-w-0 pt-0.5">{children}</div>
    </div>
  )
}

/**
 * Segmented control pill group for admin tabs.
 * @param {{ activeKey: string; onChange: (key: string) => void; tabs: { key: string; label: string }[] }} props
 */
export function AdminSegmentedTabs({ activeKey, onChange, tabs }) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-2xl border border-app-border-strong/80 bg-app-muted/50 p-1.5 shadow-inner dark:bg-app-muted/25"
      role="tablist"
    >
      {tabs.map(({ key, label }) => {
        const active = key === activeKey
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={[
              'rounded-xl px-4 py-2 text-sm font-medium transition duration-200',
              active
                ? 'bg-app-card text-exclusive-dark shadow-sm ring-1 ring-app-border-strong/60 dark:bg-app-card dark:ring-white/10'
                : 'text-exclusive-muted hover:bg-app-card/70 hover:text-exclusive-dark dark:hover:bg-app-card/40',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function IconCheck() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** @param {{ to: string; title: string; description: string; icon: import('react').ReactNode }} props */
export function AdminDashLinkCard({ to, title, description, icon }) {
  return (
    <li>
      <Link
        to={to}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-app-border bg-app-card p-6 text-left shadow-[0_2px_8px_-2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-exclusive-red/35 hover:shadow-[0_12px_28px_-12px_rgb(219_68_68/0.35)] dark:ring-white/[0.04] dark:hover:shadow-[0_12px_32px_-14px_rgb(0_0_0/0.7)]"
      >
        <span
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-exclusive-red/70 via-exclusive-red/40 to-orange-400/50 opacity-90 transition group-hover:opacity-100"
          aria-hidden
        />
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-exclusive-red/[0.08] text-exclusive-red ring-1 ring-exclusive-red/15 transition group-hover:bg-exclusive-red/[0.12] dark:bg-exclusive-red/15">
          {icon}
        </span>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark group-hover:text-exclusive-red">{title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-exclusive-muted">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-exclusive-red">
          Configure
          <svg
            className="h-4 w-4 transition group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M5 12h14m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </li>
  )
}

function IconAlert() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 9v4m0 4h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
