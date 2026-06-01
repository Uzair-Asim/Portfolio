'use client'

/**
 * WHY a shared Toggle component:
 * The same toggle UI appears in Hero editor, Experience editor,
 * and potentially more places. One source of truth means
 * fixing the style once fixes it everywhere.
 */
interface ToggleProps {
  value:    boolean
  onChange: (val: boolean) => void
  labelOn:  string
  labelOff: string
  className?: string
}

export default function Toggle({
  value,
  onChange,
  labelOn,
  labelOff,
  className = '',
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`
        inline-flex items-center gap-3
        px-4 py-2.5 rounded-xl
        border transition-all duration-200
        font-semibold text-sm cursor-pointer
        ${value
          ? 'bg-green-50 border-green-300 text-green-700'
          : 'bg-[var(--color-cream-100)] border-[var(--color-cream-300)] text-[var(--color-clay-muted)]'
        }
        ${className}
      `}
    >
      {/* Track */}
      <span className={`
        relative inline-flex w-9 h-5 rounded-full flex-shrink-0
        transition-colors duration-200
        ${value ? 'bg-green-400' : 'bg-gray-300'}
      `}>
        {/* Thumb */}
        <span className={`
          absolute top-0.5 w-4 h-4 rounded-full
          bg-white shadow-sm
          transition-transform duration-200
          ${value ? 'translate-x-4' : 'translate-x-0.5'}
        `} />
      </span>
      {value ? labelOn : labelOff}
    </button>
  )
}