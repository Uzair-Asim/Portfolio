/**
 * WHY: A reusable Button component so every button in the app
 * looks consistent. Instead of repeating the same Tailwind classes
 * on every button, we define variants here once.
 *
 * 'variant' controls the style (primary = orange filled, ghost = outlined)
 * 'size' controls the padding and font size
 * We extend React's built-in button props so it works exactly
 * like a normal HTML button plus our custom props.
 */
import { clsx } from 'clsx'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles every button gets
        'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 cursor-pointer',
        // Size variants
        {
          'px-4 py-2 text-sm':    size === 'sm',
          'px-6 py-3 text-base':  size === 'md',
          'px-8 py-4 text-lg':    size === 'lg',
        },
        // Style variants
        {
          // Primary: solid orange button
          'bg-[var(--color-clay-orange)] text-white hover:bg-[var(--color-clay-orange-dark)] hover:scale-105 shadow-lg shadow-orange-200':
            variant === 'primary',
          // Ghost: transparent with orange text
          'bg-white text-[var(--color-clay-navy)] hover:bg-[var(--color-cream-200)] shadow-md':
            variant === 'ghost',
          // Outline: bordered orange
          'border-2 border-[var(--color-clay-orange)] text-[var(--color-clay-orange)] hover:bg-[var(--color-clay-orange)] hover:text-white':
            variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}