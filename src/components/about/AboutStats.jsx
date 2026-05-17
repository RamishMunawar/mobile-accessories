function IconStore(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <path
        d="M12 22h40v28a4 4 0 01-4 4H16a4 4 0 01-4-4V22zm4-8h32l4 8H12l4-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M22 38h20M22 46h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconTrending(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <path
        d="M12 44l12-16 10 10 18-22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M44 12h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <circle cx="24" cy="22" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M8 46c0-8 8-12 16-12s16 4 16 12" stroke="currentColor" strokeWidth="2" />
      <circle cx="44" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M38 46c0-6 5-9 12-9s10 3 10 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconMoney(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2" />
      <path
        d="M32 22v20M28 28h8a4 4 0 010 8h-8a4 4 0 110-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const stats = [
  {
    icon: IconStore,
    value: '10.5k',
    label: 'Sellers active on our site',
  },
  {
    icon: IconTrending,
    value: '$33k',
    label: 'Monthly product sale',
  },
  {
    icon: IconUsers,
    value: '45.5k',
    label: 'Customers active on our site',
  },
  {
    icon: IconMoney,
    value: '$25k',
    label: 'Annual gross sale on our site',
  },
]

export default function AboutStats() {
  return (
    <section className="border-b border-app-border-subtle py-14 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-md border border-app-border-subtle bg-app-card px-6 py-10 text-center shadow-sm ring-1 ring-app-ring"
          >
            <span className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-app-muted text-exclusive-dark">
              <Icon className="h-10 w-10" />
            </span>
            <p className="font-display text-3xl font-semibold tabular-nums">{value}</p>
            <p className="mt-3 max-w-[200px] text-sm leading-snug text-exclusive-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
