import { useId, useMemo, useState } from 'react'
import CountdownStrip from '../../components/ui/CountdownStrip'
import { ButtonLink } from '../../components/ui/Button'
import { useCountdown } from '../../hooks/useCountdown'
import { defaultCountdownEnd } from '../../data/promoBannerDefaults'
import { getMergedPromoBanner, setMergedPromoBanner } from '../../site/siteStore'
import { readFileAsDataUrl } from '../../utils/readDataUrlFile'
import { adminCardClass, adminInputClass } from './adminFieldClasses'
import { AdminFlash, AdminPageHeader } from './AdminUi'

function toDatetimeLocalValue(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminPromoBannerPage() {
  const baseId = useId()
  const initial = getMergedPromoBanner()

  const [enabled, setEnabled] = useState(initial.enabled)
  const [eyebrow, setEyebrow] = useState(initial.eyebrow)
  const [titleLine1, setTitleLine1] = useState(initial.titleLine1)
  const [titleLine2, setTitleLine2] = useState(initial.titleLine2)
  const [description, setDescription] = useState(initial.description)
  const [image, setImage] = useState(initial.image)
  const [countdownLocal, setCountdownLocal] = useState(() => toDatetimeLocalValue(initial.countdownEndsAt))
  const [ctaLabel, setCtaLabel] = useState(initial.ctaLabel)
  const [ctaHref, setCtaHref] = useState(initial.ctaHref)
  const [secondaryLabel, setSecondaryLabel] = useState(initial.secondaryLabel)
  const [secondaryHref, setSecondaryHref] = useState(initial.secondaryHref)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const previewEnd = useMemo(() => {
    const parsed = Date.parse(countdownLocal)
    return Number.isFinite(parsed) ? new Date(parsed) : new Date(defaultCountdownEnd())
  }, [countdownLocal])

  const cd = useCountdown(previewEnd)

  function handleSave() {
    setError('')
    setMessage('')

    if (!titleLine1.trim()) {
      setError('Heading line 1 is required.')
      return
    }
    if (!image.trim()) {
      setError('Product image URL is required (or upload an image).')
      return
    }

    const endsMs = Date.parse(countdownLocal)
    if (!Number.isFinite(endsMs)) {
      setError('Set a valid countdown end date and time.')
      return
    }

    setMergedPromoBanner({
      enabled,
      eyebrow: eyebrow.trim(),
      titleLine1: titleLine1.trim(),
      titleLine2: titleLine2.trim(),
      description: description.trim(),
      image: image.trim(),
      countdownEndsAt: new Date(endsMs).toISOString(),
      ctaLabel: ctaLabel.trim() || 'Buy Now!',
      ctaHref: ctaHref.trim() || '/#explore-products',
      secondaryLabel: secondaryLabel.trim(),
      secondaryHref: secondaryHref.trim() || '/#browse-by-category',
    })
    setMessage('Music promo banner saved. Open the home page to verify.')
  }

  function handleHide() {
    setError('')
    setMessage('')
    setEnabled(false)
    setMergedPromoBanner({
      ...getMergedPromoBanner(),
      enabled: false,
    })
    setMessage('Banner hidden on the home page. Save again with “Show on homepage” to restore.')
  }

  async function onImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await readFileAsDataUrl(file)
      setImage(url)
      setMessage('')
      setError('')
    } catch {
      setError('Could not read that image file.')
    }
    e.target.value = ''
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Homepage"
        title="Music promo banner"
        description="Dark “Enhance Your Music Experience” block with countdown, CTA, and product image — shown on the home page above services."
      />

      <AdminFlash variant="success">{message}</AdminFlash>
      <AdminFlash variant="error">{error}</AdminFlash>

      <section className={`${adminCardClass} mt-8`}>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked)
              setMessage('')
              setError('')
            }}
            className="h-4 w-4 rounded border-app-border-strong text-exclusive-red focus:ring-exclusive-red/30"
          />
          <span className="text-sm font-medium text-exclusive-dark">Show on homepage</span>
        </label>
      </section>

      <section className={`${adminCardClass} mt-6`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Copy & links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${baseId}-eyebrow`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Eyebrow
            </label>
            <input
              id={`${baseId}-eyebrow`}
              className={adminInputClass}
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-countdown`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Countdown ends
            </label>
            <input
              id={`${baseId}-countdown`}
              type="datetime-local"
              className={adminInputClass}
              value={countdownLocal}
              onChange={(e) => setCountdownLocal(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-t1`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Heading line 1
            </label>
            <input
              id={`${baseId}-t1`}
              className={adminInputClass}
              value={titleLine1}
              onChange={(e) => setTitleLine1(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-t2`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Heading line 2
            </label>
            <input
              id={`${baseId}-t2`}
              className={adminInputClass}
              value={titleLine2}
              onChange={(e) => setTitleLine2(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${baseId}-desc`} className="mb-2 block text-sm font-medium text-exclusive-dark">
            Description
          </label>
          <textarea
            id={`${baseId}-desc`}
            rows={3}
            className={adminInputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${baseId}-cta`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Primary button label
            </label>
            <input
              id={`${baseId}-cta`}
              className={adminInputClass}
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-cta-href`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Primary button link
            </label>
            <input
              id={`${baseId}-cta-href`}
              className={adminInputClass}
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/#explore-products"
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-sec`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Secondary link label
            </label>
            <input
              id={`${baseId}-sec`}
              className={adminInputClass}
              value={secondaryLabel}
              onChange={(e) => setSecondaryLabel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${baseId}-sec-href`} className="mb-2 block text-sm font-medium text-exclusive-dark">
              Secondary link URL
            </label>
            <input
              id={`${baseId}-sec-href`}
              className={adminInputClass}
              value={secondaryHref}
              onChange={(e) => setSecondaryHref(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={`${adminCardClass} mt-6`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Product image</h2>
        <p className="mt-1 text-sm text-exclusive-muted">Paste a URL or upload (stored in this browser).</p>
        <input
          className={`${adminInputClass} mt-4`}
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://…"
        />
        <input type="file" accept="image/*" className="mt-3 block text-sm" onChange={onImageFile} />
        {image ? (
          <img
            src={image}
            alt=""
            className="mt-4 max-h-40 rounded-lg border border-app-border object-contain"
          />
        ) : null}
      </section>

      <section className={`${adminCardClass} mt-6`}>
        <h2 className="font-display text-lg font-semibold text-exclusive-dark">Preview</h2>
        <div className="mt-4 overflow-hidden rounded-2xl bg-neutral-950 p-6 text-white ring-1 ring-white/10">
          <span className="text-xs font-semibold uppercase tracking-widest text-exclusive-green">{eyebrow}</span>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            {titleLine1}
            {titleLine2 ? <span className="mt-1 block text-white/90">{titleLine2}</span> : null}
          </h3>
          {description ? <p className="mt-2 text-sm text-white/60">{description}</p> : null}
          <CountdownStrip parts={cd} theme="dark" className="my-6" />
          <div className="flex flex-wrap gap-3">
            <span className="rounded-md bg-exclusive-green px-4 py-2 text-sm font-semibold text-black">
              {ctaLabel || 'Buy Now!'}
            </span>
            {secondaryLabel ? (
              <span className="text-sm text-white/70 underline">{secondaryLabel}</span>
            ) : null}
          </div>
          {image ? (
            <img src={image} alt="" className="mx-auto mt-6 max-h-32 object-contain" />
          ) : null}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-exclusive-red px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          Save banner
        </button>
        <button
          type="button"
          onClick={handleHide}
          className="rounded-xl border border-app-border-strong px-6 py-3 text-sm font-medium transition hover:bg-app-muted"
        >
          Hide on homepage
        </button>
        <ButtonLink to="/" variant="outline" size="sm" className="self-center">
          View storefront
        </ButtonLink>
      </div>
    </div>
  )
}
