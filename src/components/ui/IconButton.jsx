import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const variants = {
  ghost: 'rounded-full p-2 hover:bg-app-muted',
  elevated:
    'h-9 w-9 rounded-full bg-app-card shadow ring-1 ring-app-ring hover:bg-app-muted',
}

export const IconButton = forwardRef(function IconButton(
  { variant = 'ghost', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center transition disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
})
