import { browseCategories } from '../../data/categories'
import SectionHeading from '../ui/SectionHeading'

export default function CategorySection() {
  return (
    <section id="browse-by-category" className="scroll-mt-28 border-t border-app-border-subtle py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading eyebrow="Categories" title="Browse By Category" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {browseCategories.map(({ id, label, icon, active }) => (
            <button
              key={id}
              id={id === 'watch' ? 'category-watch' : undefined}
              type="button"
              className={[
                'flex aspect-square flex-col items-center justify-center gap-3 rounded-md border text-sm font-medium shadow-sm transition',
                active
                  ? 'border-exclusive-red bg-exclusive-red text-white ring-2 ring-exclusive-red/30'
                  : 'border-app-border-subtle bg-app-card hover:border-exclusive-red/40 hover:bg-app-muted',
                id === 'watch' ? 'scroll-mt-28' : '',
              ].join(' ')}
            >
              <span className="text-3xl" aria-hidden>
                {icon}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
