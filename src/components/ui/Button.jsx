import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'group relative overflow-hidden bg-exclusive-red font-medium text-white shadow-sm',
  secondary:
    'border border-app-border-strong bg-transparent font-medium hover:bg-app-muted',
  outline: 'border border-app-border bg-transparent font-medium hover:bg-app-muted',
  accent: 'bg-exclusive-green font-semibold text-black hover:brightness-110',
  ghost:
    'rounded-none bg-transparent p-0 font-normal text-exclusive-red shadow-none hover:underline',
  /** Black primary (e.g. order success CTA) */
  black:
    'group relative overflow-hidden bg-black font-medium text-white dark:bg-zinc-100 dark:text-black',
}

const sizes = {
  sm: 'px-8 py-2.5 text-sm',
  md: 'px-10 py-3 text-base',
  lg: 'px-12 py-3 text-base',
  icon: 'p-2',
  iconMd: 'px-3 py-2',
}

const base =
  'inline-flex items-center justify-center rounded-md transition disabled:pointer-events-none disabled:opacity-50'
const animatedVariants = new Set(['primary', 'black'])

function useButtonClassName({ variant, size, fullWidth, className }) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, children, ...props },
  ref,
) {
  const animated = animatedVariants.has(variant)
  return (
    <button
      ref={ref}
      className={useButtonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {animated ? <AnimatedButtonInner>{children}</AnimatedButtonInner> : children}
    </button>
  )
})

export const ButtonLink = forwardRef(function ButtonLink(
  { variant = 'primary', size = 'md', fullWidth, className, children, ...props },
  ref,
) {
  const animated = animatedVariants.has(variant)
  return (
    <Link
      ref={ref}
      className={useButtonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {animated ? <AnimatedButtonInner>{children}</AnimatedButtonInner> : children}
    </Link>
  )
})

function AnimatedButtonInner({ children }) {
  return (
    <>
      <span className="absolute top-0 right-0 inline-block h-4 w-4 rounded bg-black/20 transition-all duration-500 ease-in-out group-hover:-mt-4 group-hover:-mr-4 dark:bg-black/15">
        <span className="absolute top-0 right-0 h-5 w-5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/90 dark:bg-white/60" />
      </span>
      <span className="absolute bottom-0 left-0 inline-block h-4 w-4 rotate-180 rounded bg-black/20 transition-all duration-500 ease-in-out group-hover:-mb-4 group-hover:-ml-4 dark:bg-black/15">
        <span className="absolute top-0 right-0 h-5 w-5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/90 dark:bg-white/60" />
      </span>
      <span className="absolute bottom-0 left-0 h-full w-full -translate-x-full rounded-md bg-black/12 transition-all duration-500 ease-in-out delay-150 group-hover:translate-x-0 dark:bg-black/18" />
      <span className="relative z-[1] w-full text-center transition-colors duration-200 ease-in-out">
        {children}
      </span>
    </>
  )
}
