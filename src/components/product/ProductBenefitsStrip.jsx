import { IconDelivery, IconHeadset } from '../ui/Icons'

const items = [
  {
    icon: IconDelivery,
    title: 'Free Delivery',
    desc: 'Enter your postal code for Delivery Availability',
  },
  {
    icon: IconHeadset,
    title: 'Return Delivery',
    desc: 'Free 30 Days Delivery Details',
  },
]

export default function ProductBenefitsStrip() {
  return (
    <div className="grid gap-4 rounded-md border border-app-border md:grid-cols-2">
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex items-start gap-4 border-app-border px-6 py-8 md:border-r md:last:border-r-0"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-app-muted">
            <Icon className="h-10 w-10" />
          </span>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-exclusive-muted underline">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
