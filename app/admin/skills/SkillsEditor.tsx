'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { ISkillCategory } from '@/models/Portfolio'

export default function SkillsEditor({
  initialData,
}: {
  initialData: ISkillCategory[]
}) {
  const router = useRouter()

  /**
   * WHY sort on init:
   * MongoDB doesn't guarantee array order.
   * We sort by the order field immediately so the editor
   * shows categories in the same order as the portfolio.
   */
  const [categories, setCategories] = useState<ISkillCategory[]>(
    [...initialData].sort((a, b) => a.order - b.order)
  )
  const [saving, setSaving] = useState(false)

  function updateCategory(index: number, field: keyof ISkillCategory, value: any) {
    setCategories(prev =>
      prev.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    )
  }

  function addSkill(catIndex: number) {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, skills: [...cat.skills, ''] }
          : cat
      )
    )
  }

  function updateSkill(catIndex: number, skillIndex: number, value: string) {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              skills: cat.skills.map((s, si) => si === skillIndex ? value : s),
            }
          : cat
      )
    )
  }

  function removeSkill(catIndex: number, skillIndex: number) {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, skills: cat.skills.filter((_, si) => si !== skillIndex) }
          : cat
      )
    )
  }

  function addCategory() {
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0)
    setCategories(prev => [
      ...prev,
      { icon: '🔧', title: '', skills: [], order: maxOrder + 1 },
    ])
  }

  function removeCategory(index: number) {
    setCategories(prev => prev.filter((_, i) => i !== index))
  }

  /**
   * WHY swap order values not just array positions:
   * The order field in MongoDB controls rendering order.
   * Swapping array positions without updating order values
   * would look right in the editor but revert on next load
   * when the data is re-sorted by order.
   * We swap both the positions AND the order values together.
   */
  function moveCategory(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= categories.length) return  
    setCategories(prev => {
      /**
       * WHY create a deep copy first:
       * We need to swap order values between two items AND
       * swap their positions in the array. Mutating the array
       * directly causes React to miss the state change.
       * Spreading each item into a new object ensures
       * React sees genuinely new references and re-renders.
       */
      const updated = prev.map(cat => ({ ...cat }))  
      // Swap order values
      const tempOrder          = updated[index].order
      updated[index].order     = updated[swapIndex].order
      updated[swapIndex].order = tempOrder  
      // Swap array positions
      const tempCat        = updated[index]
      updated[index]       = updated[swapIndex]
      updated[swapIndex]   = tempCat  
      return updated
    })
  }

  async function handleSave() {
    // Validate — no empty titles
    const hasEmptyTitle = categories.some(c => !c.title.trim())
    if (hasEmptyTitle) {
      toast.error('All categories must have a title.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ skills: categories }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Skills saved!')
      router.refresh()
    } catch {
      toast.error('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="
            flex items-center gap-1.5
            font-mono text-xs font-bold
            text-[var(--color-clay-muted)]
            hover:text-[var(--color-clay-navy)]
            transition-colors
          "
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <span className="text-[var(--color-clay-muted)]">/</span>
        <span className="font-mono text-xs font-bold text-[var(--color-clay-navy)]">
          Skills
        </span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-clay-navy)] tracking-tight mb-1">
            ⚙️ Skills & Stack
          </h1>
          <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
            Manage your skill categories and individual skills.
          </p>
        </div>
        <button
          onClick={addCategory}
          className="
            flex items-center gap-2
            font-mono text-xs font-bold
            bg-[var(--color-clay-navy)] text-white
            px-4 py-2.5 rounded-xl
            hover:bg-[var(--color-clay-navy-light)]
            transition-colors cursor-pointer
          "
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {categories.map((category, catIndex) => (
          <div
            key={catIndex}
            className="
              bg-white rounded-2xl
              border border-[var(--color-cream-300)]
              overflow-hidden
            "
          >
            {/* Category header */}
            <div className="
              flex items-center gap-3 p-4
              border-b border-[var(--color-cream-300)]
              bg-[var(--color-cream-50)]
            ">
              {/* Order controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveCategory(catIndex, 'up')}
                  disabled={catIndex === 0}
                  className="p-1 rounded hover:bg-[var(--color-cream-200)] disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronUp size={14} className="text-[var(--color-clay-muted)]" />
                </button>
                <button
                  onClick={() => moveCategory(catIndex, 'down')}
                  disabled={catIndex === categories.length - 1}
                  className="p-1 rounded hover:bg-[var(--color-cream-200)] disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronDown size={14} className="text-[var(--color-clay-muted)]" />
                </button>
              </div>

              {/* Icon input */}
              <input
                type="text"
                value={category.icon}
                onChange={e => updateCategory(catIndex, 'icon', e.target.value)}
                className="
                  w-12 text-center text-xl
                  border border-[var(--color-cream-300)]
                  rounded-lg py-1.5
                  bg-white focus:outline-none
                  focus:border-[var(--color-clay-orange)]
                "
              />

              {/* Title input */}
              <input
                type="text"
                value={category.title}
                onChange={e => updateCategory(catIndex, 'title', e.target.value)}
                placeholder="Category title"
                className="
                  flex-1 px-3 py-2 rounded-lg
                  border border-[var(--color-cream-300)]
                  focus:border-[var(--color-clay-orange)]
                  focus:outline-none
                  font-bold text-sm
                  text-[var(--color-clay-navy)]
                  bg-white transition-colors
                "
              />

              {/* Skill count badge */}
              <span className="
                font-mono text-xs font-bold
                bg-[var(--color-cream-200)]
                text-[var(--color-clay-muted)]
                px-2.5 py-1 rounded-full
                whitespace-nowrap
              ">
                {category.skills.length} skills
              </span>

              {/* Delete category */}
              <button
                onClick={() => removeCategory(catIndex)}
                className="
                  p-2 rounded-lg
                  text-red-400 hover:text-red-600
                  hover:bg-red-50
                  transition-colors cursor-pointer
                "
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Skills list */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex items-center gap-1 bg-[var(--color-cream-50)] border border-[var(--color-cream-300)] rounded-lg overflow-hidden"
                  >
                    <input
                      type="text"
                      value={skill}
                      onChange={e => updateSkill(catIndex, skillIndex, e.target.value)}
                      placeholder="Skill name"
                      className="
                        px-3 py-1.5
                        font-semibold text-sm
                        text-[var(--color-clay-navy)]
                        bg-transparent
                        focus:outline-none
                        w-28
                      "
                    />
                    <button
                      onClick={() => removeSkill(catIndex, skillIndex)}
                      className="
                        pr-2 text-red-300
                        hover:text-red-500
                        transition-colors cursor-pointer
                      "
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Add skill button */}
                <button
                  onClick={() => addSkill(catIndex)}
                  className="
                    flex items-center gap-1
                    px-3 py-1.5 rounded-lg
                    border border-dashed border-[var(--color-clay-orange)]/40
                    text-[var(--color-clay-orange)]
                    font-mono text-xs font-bold
                    hover:border-[var(--color-clay-orange)]
                    hover:bg-orange-50
                    transition-colors cursor-pointer
                  "
                >
                  <Plus size={12} />
                  Add skill
                </button>
              </div>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="
            text-center py-16
            bg-white rounded-2xl
            border border-dashed border-[var(--color-cream-300)]
          ">
            <p className="font-semibold text-[var(--color-clay-muted)] mb-3">
              No skill categories yet.
            </p>
            <button
              onClick={addCategory}
              className="
                font-mono text-xs font-bold
                text-[var(--color-clay-orange)]
                hover:underline cursor-pointer
              "
            >
              Add your first category →
            </button>
          </div>
        )}

        {/* Save button */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="
              flex items-center gap-2
              bg-[var(--color-clay-orange)]
              hover:bg-[var(--color-clay-orange-dark)]
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-bold
              px-6 py-3 rounded-xl
              transition-colors duration-200
              cursor-pointer
            "
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}