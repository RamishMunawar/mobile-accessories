import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { IconSend } from '../ui/Icons'
import { TextField } from '../ui/TextField'

const colTitle = 'mb-6 text-xl font-medium text-white'

export default function Footer() {
  return (
    <footer id="contact" className="bg-black text-neutral-300">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-1">
          <h3 className={`${colTitle} font-display`}>Exclusive</h3>
          <p className="mb-4 text-lg font-medium text-white">Subscribe</p>
          <p className="mb-4 text-sm">Get 10% off your first order</p>
          <form
            className="flex max-w-xs overflow-hidden rounded border border-white/30"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="footer-email" className="sr-only">
              Email
            </label>
            <TextField
              id="footer-email"
              variant="footer"
              type="email"
              placeholder="Enter your email"
            />
            <Button
              type="submit"
              variant="primary"
              size="iconMd"
              className="shrink-0 rounded-none rounded-r-sm border-l border-white/30"
              aria-label="Subscribe"
            >
              <IconSend className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div>
          <h3 className={colTitle}>Support</h3>
          <address className="not-italic text-sm leading-relaxed">
            <p>111 Bijoy sarani, Dhaka,</p>
            <p>DH 1515, Bangladesh.</p>
            <p className="mt-3">
              <a className="hover:text-white" href="mailto:exclusive@gmail.com">
                exclusive@gmail.com
              </a>
            </p>
            <p className="mt-1">
              <a className="hover:text-white" href="tel:+8801710888888">
                +88017-88888-9999
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className={colTitle}>Account</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link className="hover:text-white" to="/account">
                My Account
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/login">
                Login / Register
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/cart">
                Cart
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/wishlist">
                Wishlist
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                Shop
              </Link>
            </li>
          </ul>
        </div>

        <div id="footer-quick-links">
          <h3 className={colTitle}>Quick Link</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a className="hover:text-white" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#">
                Terms Of Use
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#">
                FAQ
              </a>
            </li>
            <li>
              <Link className="hover:text-white" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={colTitle}>Download App</h3>
          <p className="mb-3 text-xs text-neutral-400">Save $3 with App New User Only</p>
          <div className="flex flex-wrap items-start gap-4">
            <div
              className="grid h-24 w-24 place-items-center rounded border border-white/20 bg-app-card text-[10px] font-semibold text-exclusive-dark"
              role="img"
              aria-label="QR code placeholder"
            >
              QR
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="rounded bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20"
              >
                Google Play
              </a>
              <a
                href="#"
                className="rounded bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20"
              >
                App Store
              </a>
            </div>
          </div>
          <div className="mt-6 flex gap-4 text-lg">
            {['f', '𝕏', 'in', '◎'].map((s) => (
              <a key={s} href="#" className="hover:text-white" aria-label="social">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1440px] px-4 py-6 text-center text-sm text-neutral-500">
          © Copyright Rimel {new Date().getFullYear()}. All rights reserved
        </p>
      </div>
    </footer>
  )
}
