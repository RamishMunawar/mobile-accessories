import { ButtonLink } from '../components/ui/Button'
import { IconCheck } from '../components/ui/Icons'

export default function OrderSuccessPage() {
  return (
    <section className="mx-auto flex min-h-[min(70vh,720px)] max-w-[600px] flex-col items-center justify-center px-4 py-20 text-center">
      <div
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-exclusive-green"
        aria-hidden
      >
        <IconCheck className="h-12 w-12 text-black" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-exclusive-dark md:text-4xl">
        Your order is completed!
      </h1>
      <p className="mt-6 text-base leading-relaxed text-exclusive-muted md:text-lg">
        Thank you for your order! Your order is being processed and will be completed within 3–6
        hours. You will receive an email confirmation when your order is completed.
      </p>
      <ButtonLink
        to="/"
        variant="black"
        size="lg"
        className="mt-12 uppercase tracking-wider"
      >
        Continue shopping
      </ButtonLink>
    </section>
  )
}
