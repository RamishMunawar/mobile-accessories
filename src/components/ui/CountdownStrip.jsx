import { cn } from '../../utils/cn'

/**
 * @param {{ parts: { days: number; hours: number; minutes: number; seconds: number }; labels?: string[]; theme?: 'light' | 'dark'; className?: string }} props
 */
export default function CountdownStrip({
  parts,
  labels = ['Days', 'Hours', 'Minutes', 'Seconds'],
  theme = 'light',
  className = '',
}) {
  const boxes = [
    String(parts.days).padStart(2, '0'),
    String(parts.hours).padStart(2, '0'),
    String(parts.minutes).padStart(2, '0'),
    String(parts.seconds).padStart(2, '0'),
  ]

  const isDark = theme === 'dark'

  return (
    <div className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}>
      {boxes.map((value, i) => (
        <div key={labels[i]} className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              'flex min-w-[3.5rem] flex-col items-center justify-center rounded-lg px-3 py-2.5 sm:min-w-[4rem] sm:px-4 sm:py-3',
              isDark
                ? 'border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm'
                : 'bg-app-card shadow-sm ring-1 ring-app-ring',
            )}
          >
            <span
              className={cn(
                'text-2xl font-bold leading-none tabular-nums sm:text-3xl',
                isDark ? 'text-white' : 'text-exclusive-dark',
              )}
            >
              {value}
            </span>
            <span
              className={cn(
                'mt-1 text-[10px] font-semibold uppercase tracking-wider sm:text-[11px]',
                isDark ? 'text-white/55' : 'text-exclusive-muted',
              )}
            >
              {labels[i]}
            </span>
          </div>
          {i < boxes.length - 1 ? (
            <span
              className={cn(
                'select-none text-lg font-bold',
                isDark ? 'text-exclusive-green' : 'text-exclusive-red',
              )}
              aria-hidden
            >
              :
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
