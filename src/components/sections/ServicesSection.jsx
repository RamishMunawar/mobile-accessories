import { IconDelivery, IconHeadset, IconShield } from '../ui/Icons'

const items = [
  {
    icon: IconDelivery,
    title: 'FREE AND FAST DELIVERY',
    text: 'Free delivery for all orders over $140',
  },
  {
    icon: IconHeadset,
    title: '24/7 CUSTOMER SERVICE',
    text: 'Friendly 24/7 customer support',
  },
  {
    icon: IconShield,
    title: 'MONEY BACK GUARANTEE',
    text: 'We return money within 30 days',
  },
]

export default function ServicesSection() {
  return (
    <section className="border-t border-app-border-subtle py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-[84px] w-[84px] items-center justify-center rounded-full border-[10px] border-app-border bg-app-muted">
                <Icon className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 max-w-xs text-sm text-exclusive-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
