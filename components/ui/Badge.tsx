/**
 * WHY: Badges are used for skill tags, tech stack labels,
 * and status indicators throughout the portfolio.
 * One component, consistent look everywhere.
 */
import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'orange' | 'navy'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-bold',
        {
          'bg-[var(--color-cream-200)] text-[var(--color-clay-navy)]':
            variant === 'default',
          'bg-[var(--color-clay-orange)] text-white':
            variant === 'orange',
          'bg-[var(--color-clay-navy)] text-white':
            variant === 'navy',
        },
        className
      )}
    >
      {children}
    </span>
  )
}