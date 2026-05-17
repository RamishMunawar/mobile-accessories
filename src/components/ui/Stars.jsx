import { IconStar } from './Icons'

export default function Stars({ rating, className = '' }) {
  return (
    <div
      className={`flex items-center gap-0.5 text-[#FFAD33] ${className}`}
      aria-label={`Rating ${rating} of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <IconStar key={i} className="h-4 w-4" filled={i < Math.round(rating)} />
      ))}
    </div>
  )
}
