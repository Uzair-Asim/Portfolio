'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * WHY a curated list not a full emoji library:
 * Full emoji pickers (emoji-mart etc.) are 200KB+ and include
 * thousands of irrelevant emojis. For a professional portfolio
 * we only need tech/work/project relevant ones. A curated grid
 * loads instantly and is faster to use - no searching needed.
 */
const PROFESSIONAL_EMOJIS = [
  // Tech & Development
  '💻', '🖥️', '⌨️', '🖱️', '📱', '⚙️', '🔧', '🛠️', '🔩', '🔌',
  '💡', '🔋', '📡', '🖨️', '💾', '📀', '🗄️', '🖧', '📲', '⌚',
  // Code & Data
  '👨‍💻', '👩‍💻', '🧑‍💻', '📊', '📈', '📉', '🗃️', '🗂️', '📋', '📌',
  '📍', '🔖', '🏷️', '📎', '🖇️', '📐', '📏', '✂️', '🗒️', '📝',
  // Cloud & Security
  '☁️', '🔐', '🔒', '🔑', '🛡️', '🔓', '🌐', '📶', '🛰️', '🔭',
  // Projects & Products
  '🚀', '🎯', '🏗️', '🏛️', '🏢', '🏭', '🔬', '🧪', '🧬', '⚗️',
  '🎨', '🖌️', '✏️', '📐', '🗺️', '🧭', '📦', '📫', '📬', '📮',
  // Finance & Commerce
  '💳', '💰', '💵', '🏦', '🛒', '🛍️', '📊', '💹', '🏪', '🏬',
  // Communication & Social
  '💬', '📢', '📣', '📞', '📟', '📠', '✉️', '📧', '💌', '🗨️',
  // Achievement & Work
  '🏆', '🥇', '🎖️', '🏅', '🎗️', '🎓', '📜', '🤝', '👔', '💼',
  '🗓️', '📅', '⏰', '⏱️', '⌛', '🔄', '♻️', '✅', '☑️', '🆕',
  // AI & Automation
  '🤖', '🧠', '👁️', '🔮', '⚡', '🌊', '🔥', '💎', '🎮', '🕹️',
]

interface EmojiPickerProps {
  value:    string
  onChange: (emoji: string) => void
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open,    setOpen]    = useState(false)
  const containerRef          = useRef<HTMLDivElement>(null)

  /**
   * WHY close on outside click:
   * Standard dropdown behaviour - clicking anywhere outside
   * the picker closes it without requiring an explicit close button.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(emoji: string) {
    onChange(emoji)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="
          w-16 h-12 rounded-xl
          border border-[var(--color-cream-300)]
          hover:border-[var(--color-clay-orange)]
          bg-[var(--color-cream-50)]
          flex items-center justify-center
          text-2xl
          transition-colors duration-200
          cursor-pointer
          focus:outline-none
          focus:border-[var(--color-clay-orange)]
        "
        title="Pick an emoji"
      >
        {value || '📁'}
      </button>

      {/* Dropdown grid */}
      {open && (
        <div className="
          absolute top-14 left-0 z-50
          bg-white rounded-2xl
          border border-[var(--color-cream-300)]
          shadow-xl
          p-3
          w-64
          max-h-72
          overflow-y-auto
        ">
          <p className="
            font-mono text-[10px] font-bold uppercase
            tracking-wider text-[var(--color-clay-muted)]
            mb-2 px-1
          ">
            Professional Emojis
          </p>
          <div className="grid grid-cols-7 gap-1">
            {PROFESSIONAL_EMOJIS.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(emoji)}
                className={`
                  w-8 h-8 rounded-lg
                  flex items-center justify-center
                  text-lg
                  transition-colors duration-150
                  cursor-pointer
                  hover:bg-[var(--color-cream-100)]
                  ${value === emoji
                    ? 'bg-[var(--color-clay-orange)]/10 ring-1 ring-[var(--color-clay-orange)]'
                    : ''
                  }
                `}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}