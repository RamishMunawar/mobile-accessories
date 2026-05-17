import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const fieldVariants = {
  underline:
    'w-full border-b border-app-border-strong bg-transparent py-2 text-base outline-none focus:border-exclusive-red',
  search:
    'w-full rounded-md bg-app-muted py-2 pl-3 pr-10 text-sm outline-none ring-1 ring-transparent transition placeholder:text-exclusive-muted focus:bg-app-card focus:ring-exclusive-red/40',
  footer:
    'min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500',
}

export const TextField = forwardRef(function TextField(
  { variant = 'underline', className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(fieldVariants[variant], className)} {...props} />
})
