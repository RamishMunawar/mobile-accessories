import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { IconMail, IconMapPin, IconPhone } from '../components/ui/Icons'

const inputClass =
  'mt-2 w-full rounded-md bg-app-muted px-4 py-3 text-base text-exclusive-dark outline-none ring-1 ring-transparent transition placeholder:text-exclusive-muted focus:bg-app-card focus:ring-2 focus:ring-exclusive-red/25'

const channels = [
  {
    icon: IconPhone,
    title: 'Call To Us',
    lines: ['We are available 24/7.', 'Phone: +88017-88888-9999'],
    href: 'tel:+8801710888888',
    linkLabel: '+88017-88888-9999',
  },
  {
    icon: IconMail,
    title: 'Write To US',
    lines: ['Fill out our form and we will contact you within 24 hours.'],
    href: 'mailto:exclusive@gmail.com',
    linkLabel: 'exclusive@gmail.com',
  },
  {
    icon: IconMapPin,
    title: 'Visit Us',
    lines: ['111 Bijoy sarani, Dhaka,', 'DH 1515, Bangladesh.'],
    href: 'https://maps.google.com/?q=Dhaka+Bangladesh',
    linkLabel: null,
  },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-exclusive-muted">
        <Link to="/" className="hover:text-exclusive-dark">
          Home
        </Link>
        <span aria-hidden>/</span>
        <span className="text-exclusive-dark">Contact</span>
      </nav>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Get In Touch With Us
        </h1>
        <p className="mt-4 text-exclusive-muted">
          We&apos;d love to hear from you—our team is always here to chat and help with any questions.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start xl:gap-20">
        <div className="space-y-6">
          {channels.map(({ icon: Icon, title, lines, href, linkLabel }) => (
            <div
              key={title}
              className="rounded-md border border-app-border bg-app-card p-6 shadow-sm ring-1 ring-app-ring"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-exclusive-red/10 text-exclusive-red">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              {lines.map((line) => (
                <p key={line} className="mt-2 text-sm leading-relaxed text-exclusive-muted">
                  {line}
                </p>
              ))}
              {linkLabel ? (
                <a
                  href={href}
                  className="mt-4 inline-block text-sm font-medium text-exclusive-dark underline underline-offset-4 hover:text-exclusive-red"
                >
                  {linkLabel}
                </a>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-exclusive-dark underline underline-offset-4 hover:text-exclusive-red"
                >
                  View on map
                </a>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-app-border bg-app-card p-6 shadow-sm ring-1 ring-app-ring md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-medium md:col-span-2">
              Your Name<span className="text-exclusive-red">*</span>
              <input name="name" required autoComplete="name" className={inputClass} placeholder="Name" />
            </label>
            <label className="block text-sm font-medium md:col-span-2">
              Your Email<span className="text-exclusive-red">*</span>
              <input
                name="email"
                required
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="Email"
              />
            </label>
            <label className="block text-sm font-medium md:col-span-2">
              Your Phone<span className="text-exclusive-red">*</span>
              <input name="phone" required type="tel" autoComplete="tel" className={inputClass} placeholder="Phone" />
            </label>
            <label className="block text-sm font-medium md:col-span-2">
              Your Message<span className="text-exclusive-red">*</span>
              <textarea
                name="message"
                required
                rows={6}
                className={`${inputClass} min-h-[160px] resize-y`}
                placeholder="Your Message"
              />
            </label>
          </div>
          {sent ? (
            <p className="mt-6 text-sm font-medium text-exclusive-green" role="status">
              Thanks — your message was sent (demo).
            </p>
          ) : (
            <Button type="submit" variant="primary" className="mt-8 px-12 py-3 font-medium">
              Send Message
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
