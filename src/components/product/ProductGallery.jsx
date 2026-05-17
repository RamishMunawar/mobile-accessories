import { useEffect, useState } from 'react'
import { Lens } from '../ui/Lens'

/** @param {{ images: string[]; title: string }} props */
export default function ProductGallery({ images, title }) {
  const safe = images.length ? images : ['']
  const [active, setActive] = useState(0)
  const [finePointer, setFinePointer] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <div className="flex shrink-0 flex-row gap-3 overflow-x-auto pb-1 md:w-[138px] md:flex-col md:gap-3 md:overflow-visible md:pb-0">
        {safe.map((src, i) => (
          <button
            key={`${i}-${src}`}
            type="button"
            onClick={() => setActive(i)}
            className={[
              'h-[114px] w-[114px] shrink-0 overflow-hidden rounded-md bg-app-muted ring-2 ring-transparent md:h-[138px] md:w-[138px]',
              active === i ? 'ring-exclusive-red' : 'hover:ring-app-border',
            ].join(' ')}
          >
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="relative flex min-h-[320px] flex-1 items-center justify-center overflow-hidden rounded-md bg-app-muted md:min-h-[520px]">
        <Lens
          zoomFactor={2}
          lensSize={220}
          shadowIntensity="heavy"
          borderRadius="md"
          smoothFollow
          disabled={!finePointer}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={safe[active]}
            alt={title}
            className="mx-auto max-h-[440px] max-w-full select-none object-contain p-6 md:max-h-[580px]"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </Lens>
      </div>
    </div>
  )
}
