import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { logout } from '../../api/auth'
import { getSession } from '../../auth/mockAuth'
import { mainNav } from '../../data/navigation'
import { batteriesNavDropdownItems } from '../../data/batteriesNavDropdown'
import { cablesNavDropdownItems } from '../../data/cablesNavDropdown'
import { smartWatchesNavDropdownItems } from '../../data/smartWatchesNavDropdown'
import { cn } from '../../utils/cn'
import { SmartWatchesNavPanel, useSmartWatchesNavMenu } from './SmartWatchesNavDropdown'
import { CablesNavPanel, useCablesNavMenu } from './CablesNavDropdown'
import { BatteriesNavPanel, useBatteriesNavMenu } from './BatteriesNavDropdown'
import SparkleNavbar from './SparkleNavbar'
import { IconCart, IconHeart, IconSearch, IconUser } from '../ui/Icons'
import ThemeToggle from '../ui/ThemeToggle'
import { TextField } from '../ui/TextField'

/** Past this while collapsed → expand to floating pill (hysteresis avoids flicker). */
const SCROLL_FLOAT_PX = 48
/** Past this while floating → return to full-width bar */
const SCROLL_FULL_PX = 20

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const watchNav = useSmartWatchesNavMenu()
  const cableNav = useCablesNavMenu()
  const batteryNav = useBatteriesNavMenu()
  const watchTriggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const cableTriggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const batteryTriggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileSwOpen, setMobileSwOpen] = useState(false)
  const [mobileCablesOpen, setMobileCablesOpen] = useState(false)
  const [mobileBatteriesOpen, setMobileBatteriesOpen] = useState(false)
  const [floatNav, setFloatNav] = useState(false)
  const floatNavRef = useRef(false)
  const accountWrapRef = useRef(null)

  const session = getSession()
  const { ids: wishlistIds } = useWishlist()
  const { itemCount: cartItemCount } = useCart()

  useEffect(() => {
    watchNav.close()
    cableNav.close()
    batteryNav.close()
    setMobileNavOpen(false)
    setMobileSwOpen(false)
    setMobileCablesOpen(false)
    setMobileBatteriesOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return undefined

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const isFloat = floatNavRef.current
      const next = isFloat ? y > SCROLL_FULL_PX : y >= SCROLL_FLOAT_PX
      if (next !== isFloat) {
        floatNavRef.current = next
        setFloatNav(next)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!accountOpen) return undefined

    function onPointerDown(e) {
      if (accountWrapRef.current && !accountWrapRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') setAccountOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  async function handleLogout() {
    await logout()
    setAccountOpen(false)
    setMobileNavOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header
      className={cn(
        'z-40 flex items-center justify-center border-b border-app-border-subtle bg-app-header backdrop-blur-md ring-1 ring-app-ring',
        'will-change-[top,width,max-width,border-radius,box-shadow]',
        'transition-[top,width,max-width,border-radius,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:duration-200 motion-reduce:ease-out motion-reduce:will-change-auto',
        floatNav
          ? [
              'sticky top-4 mx-auto w-[min(1440px,calc(100%-2rem))] max-w-none rounded-[50px] shadow-none',
            ].join(' ')
          : ['sticky top-0 w-full max-w-none rounded-none shadow-none'].join(' '),
      )}
    >
      {/*
        Equal 1fr side columns so the middle column sits on the true horizontal center
        (flex + flex-1 + justify-center bias when left/right widths differ).
      */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 sm:px-4  lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-8">
        <div className="flex items-center gap-2 lg:justify-self-start">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-app-border-subtle bg-app-card text-exclusive-dark transition hover:bg-app-muted lg:hidden"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-sidebar-menu"
            onClick={() => {
              setMobileNavOpen((o) => !o)
              watchNav.close()
              cableNav.close()
              batteryNav.close()
              setAccountOpen(false)
            }}
          >
            {mobileNavOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight sm:text-2xl lg:justify-self-start"
          >
            Exclusive
          </Link>
        </div>

        <div className="hidden min-w-0 justify-center justify-self-center lg:flex lg:max-w-[min(100%,52rem)]">
          <SparkleNavbar
            entries={mainNav}
            color="#db4444"
            watchPanelOpen={watchNav.open}
            cablePanelOpen={cableNav.open}
            batteryPanelOpen={batteryNav.open}
            onWatchEnter={() => {
              cableNav.close()
              batteryNav.close()
              watchNav.enter()
            }}
            onWatchLeave={watchNav.leave}
            onCableEnter={() => {
              watchNav.close()
              batteryNav.close()
              cableNav.enter()
            }}
            onCableLeave={cableNav.leave}
            onBatteryEnter={() => {
              watchNav.close()
              cableNav.close()
              batteryNav.enter()
            }}
            onBatteryLeave={batteryNav.leave}
            onWatchToggle={() => watchNav.toggle()}
            onCableToggle={() => cableNav.toggle()}
            onBatteryToggle={() => batteryNav.toggle()}
            watchTriggerRef={watchTriggerRef}
            cableTriggerRef={cableTriggerRef}
            batteryTriggerRef={batteryTriggerRef}
            navigate={(to) => navigate(to)}
          />
        </div>

        <div className="flex items-center justify-end gap-1.5 justify-self-end sm:gap-2 lg:gap-4">
          <ThemeToggle />
          <div className="relative hidden min-w-[240px] sm:block">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <TextField
              id="site-search"
              variant="search"
              type="search"
              placeholder="What are you looking for?"
            />
            <IconSearch className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-exclusive-muted" />
          </div>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              [
                'relative inline-flex items-center justify-center rounded-full p-2 transition hover:bg-app-muted',
                isActive ? 'text-exclusive-red' : 'text-exclusive-dark',
              ].join(' ')
            }
            aria-label={`Wishlist${wishlistIds.length ? `, ${wishlistIds.length} items` : ''}`}
          >
            <IconHeart className="h-6 w-6" />
            {wishlistIds.length > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-exclusive-red px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
                {wishlistIds.length > 99 ? '99+' : wishlistIds.length}
              </span>
            ) : null}
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              [
                'relative inline-flex items-center justify-center rounded-full p-2 transition hover:bg-app-muted',
                isActive ? 'text-exclusive-red' : 'text-exclusive-dark',
              ].join(' ')
            }
            aria-label={`Cart${cartItemCount ? `, ${cartItemCount} items` : ''}`}
          >
            <IconCart className="h-6 w-6" />
            {cartItemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-exclusive-red px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            ) : null}
          </NavLink>

          <div className="relative" ref={accountWrapRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              aria-controls="account-menu"
              className={[
                'inline-flex h-10 w-10 items-center justify-center rounded-full bg-exclusive-red text-white transition hover:bg-exclusive-red-soft',
                accountOpen ? 'ring-2 ring-exclusive-red/40 ring-offset-2 ring-offset-app-bg' : '',
              ].join(' ')}
              aria-label="Account menu"
            >
              <IconUser className="h-5 w-5" />
            </button>

            {accountOpen ? (
              <div
                id="account-menu"
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-lg border border-app-border bg-app-card py-1 shadow-lg ring-1 ring-app-ring"
              >
                {session?.email ? (
                  <div className="border-b border-app-border-subtle px-4 py-2.5">
                    <p className="text-xs font-medium text-exclusive-muted">Signed in</p>
                    <p className="truncate text-sm font-medium text-exclusive-dark">{session.email}</p>
                  </div>
                ) : null}
                <Link
                  role="menuitem"
                  to="/account"
                  className="block px-4 py-2.5 text-sm text-exclusive-dark transition hover:bg-app-muted"
                  onClick={() => setAccountOpen(false)}
                >
                  My account
                </Link>
                <button
                  role="menuitem"
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-exclusive-red transition hover:bg-red-50 dark:hover:bg-red-950/35"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobileNavOpen && typeof document !== 'undefined'
        ? createPortal(
            <>
              <button
                type="button"
                aria-label="Close menu overlay"
                className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] lg:hidden"
                onClick={() => setMobileNavOpen(false)}
              />
              <aside
                id="mobile-sidebar-menu"
                className="fixed inset-y-0 left-0 z-50 w-[min(86vw,360px)] overflow-y-auto border-r border-app-border bg-app-card/95 px-4 py-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
                role="dialog"
                aria-label="Mobile navigation"
                aria-modal="true"
              >
                <div className="mb-5 flex items-center justify-between border-b border-app-border-subtle pb-4">
                  <p className="font-display text-xl font-bold text-exclusive-dark">Menu</p>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-app-border-subtle bg-app-card text-exclusive-dark transition hover:bg-app-muted"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close menu"
                  >
                    <IconClose className="h-4 w-4" />
                  </button>
                </div>

                <nav className="space-y-1.5" aria-label="Mobile main navigation">
                  <MobileNavLink to="/" label="Home" onClick={() => setMobileNavOpen(false)} />
                  <MobileNavAccordion
                    label="Smart Watches"
                    open={mobileSwOpen}
                    onToggle={() => setMobileSwOpen((v) => !v)}
                  >
                    {smartWatchesNavDropdownItems.map((item) => (
                      <MobileSubLink
                        key={item.slug}
                        to={item.to}
                        label={item.label}
                        onClick={() => setMobileNavOpen(false)}
                      />
                    ))}
                  </MobileNavAccordion>
                  <MobileNavAccordion
                    label="Cables"
                    open={mobileCablesOpen}
                    onToggle={() => setMobileCablesOpen((v) => !v)}
                  >
                    {cablesNavDropdownItems.map((item) => (
                      <MobileSubLink
                        key={item.label}
                        to={item.to}
                        label={item.label}
                        onClick={() => setMobileNavOpen(false)}
                      />
                    ))}
                  </MobileNavAccordion>
                  <MobileNavAccordion
                    label="Batteries"
                    open={mobileBatteriesOpen}
                    onToggle={() => setMobileBatteriesOpen((v) => !v)}
                  >
                    {batteriesNavDropdownItems.map((item) => (
                      <MobileSubLink
                        key={item.label}
                        to={item.to}
                        label={item.label}
                        onClick={() => setMobileNavOpen(false)}
                      />
                    ))}
                  </MobileNavAccordion>
                  <MobileNavLink to="/contact" label="Contact" onClick={() => setMobileNavOpen(false)} />
                  <MobileNavLink to="/about" label="About" onClick={() => setMobileNavOpen(false)} />
                </nav>

                <div className="mt-6 border-t border-app-border-subtle pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-exclusive-muted">
                    Account
                  </p>
                  <Link
                    to="/account"
                    className="mb-2 block rounded-xl border border-app-border-subtle px-3 py-2.5 text-sm font-medium text-exclusive-dark transition hover:bg-app-muted"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    My account
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-xl border border-red-300/60 px-3 py-2.5 text-left text-sm font-medium text-exclusive-red transition hover:bg-red-50 dark:hover:bg-red-950/35"
                  >
                    Log out
                  </button>
                </div>
              </aside>
            </>,
            document.body,
          )
        : null}

      <SmartWatchesNavPanel
        open={watchNav.open}
        onEnter={watchNav.enter}
        onLeave={watchNav.leave}
        onClose={watchNav.close}
        anchorRef={watchTriggerRef}
      />
      <CablesNavPanel
        open={cableNav.open}
        onEnter={cableNav.enter}
        onLeave={cableNav.leave}
        onClose={cableNav.close}
        anchorRef={cableTriggerRef}
      />
      <BatteriesNavPanel
        open={batteryNav.open}
        onEnter={batteryNav.enter}
        onLeave={batteryNav.leave}
        onClose={batteryNav.close}
        anchorRef={batteryTriggerRef}
      />
    </header>
  )
}

function MobileNavLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'block rounded-xl border px-3 py-2.5 text-sm font-medium transition',
          isActive
            ? 'border-exclusive-red/30 bg-exclusive-red/10 text-exclusive-red'
            : 'border-app-border-subtle text-exclusive-dark hover:bg-app-muted',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

function MobileNavAccordion({ label, open, onToggle, children }) {
  return (
    <div className="rounded-xl border border-app-border-subtle">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-exclusive-dark transition hover:bg-app-muted"
      >
        <span>{label}</span>
        <svg
          className={['h-4 w-4 transition', open ? 'rotate-180' : 'rotate-0'].join(' ')}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open ? <div className="space-y-1 border-t border-app-border-subtle p-2">{children}</div> : null}
    </div>
  )
}

function MobileSubLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'block rounded-lg px-2.5 py-2 text-xs font-medium transition',
          isActive
            ? 'bg-exclusive-red/10 text-exclusive-red'
            : 'text-exclusive-muted hover:bg-app-muted hover:text-exclusive-dark',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

function IconMenu({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
