import SectionHeading from '../ui/SectionHeading'

const members = [
  {
    name: 'Tom Cruise',
    role: 'Founder & Chairman',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=750&fit=crop&crop=face',
  },
  {
    name: 'Emma Watson',
    role: 'Managing Director',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&crop=face',
  },
  {
    name: 'Will Smith',
    role: 'Product Designer',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face',
  },
]

function SocialLinks() {
  return (
    <div className="mt-4 flex justify-center gap-6 text-lg text-exclusive-muted">
      <a href="#" className="transition hover:text-exclusive-red" aria-label="Twitter">
        𝕏
      </a>
      <a href="#" className="transition hover:text-exclusive-red" aria-label="Instagram">
        ◎
      </a>
      <a href="#" className="transition hover:text-exclusive-red" aria-label="LinkedIn">
        in
      </a>
    </div>
  )
}

export default function AboutTeam() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading eyebrow="Team" title="Meet Our Team" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {members.map((m) => (
            <article key={m.name} className="flex flex-col items-center text-center">
              <div className="aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-md bg-app-muted shadow-sm ring-1 ring-app-ring">
                <img src={m.image} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
              <h3 className="mt-8 font-display text-xl font-semibold">{m.name}</h3>
              <p className="mt-2 text-base text-exclusive-muted">{m.role}</p>
              <SocialLinks />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
