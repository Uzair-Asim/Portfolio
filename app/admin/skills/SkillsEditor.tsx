'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import type { ISkillCategory } from '@/models/Portfolio'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * WHY useSortable for each draggable item:
 * @dnd-kit uses a hook-based API. Each draggable element
 * calls useSortable with a unique ID. The hook returns
 * transform values and event listeners we apply to the DOM.
 * The DndContext + SortableContext above handle the
 * coordination between all draggable items.
 */

// ── Sortable Category Card ──
function SortableCategoryCard({
  category,
  catIndex,
  totalCategories,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
  onReorderSkills,
}: {
  category:        ISkillCategory
  catIndex:        number
  totalCategories: number
  onUpdate:        (field: keyof ISkillCategory, value: any) => void
  onRemove:        () => void
  onMoveUp:        () => void
  onMoveDown:      () => void
  onAddSkill:      () => void
  onUpdateSkill:   (skillIndex: number, value: string) => void
  onRemoveSkill:   (skillIndex: number) => void
  onReorderSkills: (oldIndex: number, newIndex: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `category-${catIndex}` })

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    /**
     * WHY zIndex when dragging:
     * During drag the card needs to appear above other cards.
     * Without this it renders behind adjacent cards and looks broken.
     */
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.85 : 1,
  }

  // Skills use their own DndContext scoped inside each category
  const skillSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleSkillDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = category.skills.findIndex((_, i) => `skill-${catIndex}-${i}` === active.id)
    const newIndex = category.skills.findIndex((_, i) => `skill-${catIndex}-${i}` === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderSkills(oldIndex, newIndex)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-2xl
        border border-[var(--color-cream-300)]
        overflow-hidden
        ${isDragging ? 'shadow-xl' : ''}
        transition-shadow duration-200
      `}
    >
      {/* Category header */}
      <div className="
        flex items-center gap-3 p-4
        border-b border-[var(--color-cream-300)]
        bg-[var(--color-cream-50)]
      ">
        {/**
         * WHY separate drag handle from arrow controls:
         * The drag handle (grip icon) initiates free drag-and-drop.
         * Arrow buttons handle precise keyboard-friendly reordering.
         * Both controls exist for different user preferences —
         * mouse users prefer drag, keyboard users prefer arrows.
         */}

        {/* Drag handle */}
        <button
          className="cursor-grab active:cursor-grabbing p-1 rounded text-[var(--color-clay-muted)] hover:text-[var(--color-clay-navy)] touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        {/* Arrow controls */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={catIndex === 0}
            className="p-1 rounded hover:bg-[var(--color-cream-200)] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronUp size={14} className="text-[var(--color-clay-muted)]" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={catIndex === totalCategories - 1}
            className="p-1 rounded hover:bg-[var(--color-cream-200)] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronDown size={14} className="text-[var(--color-clay-muted)]" />
          </button>
        </div>

        {/* Icon */}
        <input
          type="text"
          value={category.icon}
          onChange={e => onUpdate('icon', e.target.value)}
          className="
            w-12 text-center text-xl
            border border-[var(--color-cream-300)]
            rounded-lg py-1.5
            bg-white focus:outline-none
            focus:border-[var(--color-clay-orange)]
          "
        />

        {/* Title */}
        <input
          type="text"
          value={category.title}
          onChange={e => onUpdate('title', e.target.value)}
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

        {/* Skill count */}
        <span className="
          font-mono text-xs font-bold
          bg-[var(--color-cream-200)]
          text-[var(--color-clay-muted)]
          px-2.5 py-1 rounded-full whitespace-nowrap
        ">
          {category.skills.length} skills
        </span>

        {/* Delete */}
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Skills — draggable horizontally */}
      <div className="p-4">
        <DndContext
          sensors={skillSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSkillDragEnd}
        >
          <SortableContext
            items={category.skills.map((_, i) => `skill-${catIndex}-${i}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <SortableSkillChip
                  key={`skill-${catIndex}-${skillIndex}`}
                  id={`skill-${catIndex}-${skillIndex}`}
                  skill={skill}
                  onUpdate={val => onUpdateSkill(skillIndex, val)}
                  onRemove={() => onRemoveSkill(skillIndex)}
                />
              ))}

              <button
                onClick={onAddSkill}
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
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

// ── Sortable Skill Chip ──
function SortableSkillChip({
  id,
  skill,
  onUpdate,
  onRemove,
}: {
  id:       string
  skill:    string
  onUpdate: (val: string) => void
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    zIndex:  isDragging ? 10 : undefined,
    opacity: isDragging ? 0.75 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 bg-[var(--color-cream-50)] border border-[var(--color-cream-300)] rounded-lg overflow-hidden"
    >
      {/* Skill drag handle */}
      <button
        className="pl-2 cursor-grab active:cursor-grabbing text-[var(--color-clay-muted)] touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={12} />
      </button>

      <input
        type="text"
        value={skill}
        onChange={e => onUpdate(e.target.value)}
        placeholder="Skill"
        className="
          px-2 py-1.5
          font-semibold text-sm
          text-[var(--color-clay-navy)]
          bg-transparent focus:outline-none
          w-24
        "
      />
      <button
        onClick={onRemove}
        className="pr-2 text-red-300 hover:text-red-500 transition-colors cursor-pointer"
      >
        ×
      </button>
    </div>
  )
}

// ── Main Editor ──
export default function SkillsEditor({
  initialData,
}: {
  initialData: ISkillCategory[]
}) {
  const router = useRouter()

  const [categories, setCategories] = useState<ISkillCategory[]>(
    [...initialData].sort((a, b) => a.order - b.order)
  )
  const [saving, setSaving] = useState(false)

  /**
   * WHY PointerSensor with activation constraint:
   * Without a distance constraint, clicking inputs inside
   * draggable cards immediately triggers drag instead of
   * letting you type. The 8px distance means you have to
   * actually move the mouse before drag activates.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setCategories(prev => {
      const oldIndex = prev.findIndex((_, i) => `category-${i}` === active.id)
      const newIndex = prev.findIndex((_, i) => `category-${i}` === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev

      /**
       * WHY arrayMove then reassign order:
       * arrayMove reorders the array positions correctly.
       * We then reassign order values 1..n to match the
       * new positions so the DB reflects the visual order.
       */
      const reordered = arrayMove(prev, oldIndex, newIndex)
      return reordered.map((cat, i) => ({ ...cat, order: i + 1 }))
    })
  }

  function updateCategory(index: number, field: keyof ISkillCategory, value: any) {
    setCategories(prev =>
      prev.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    )
  }

  function removeCategory(index: number) {
    setCategories(prev => prev.filter((_, i) => i !== index))
  }

  function moveCategory(index: number, direction: 'up' | 'down') {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= categories.length) return

    setCategories(prev => {
      const updated = prev.map(cat => ({ ...cat }))
      const tempOrder          = updated[index].order
      updated[index].order     = updated[swapIndex].order
      updated[swapIndex].order = tempOrder
      const tempCat            = updated[index]
      updated[index]           = updated[swapIndex]
      updated[swapIndex]       = tempCat
      return updated
    })
  }

  function addCategory() {
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0)
    setCategories(prev => [
      ...prev,
      { icon: '🔧', title: '', skills: [], order: maxOrder + 1 },
    ])
  }

  function addSkill(catIndex: number) {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIndex ? { ...cat, skills: [...cat.skills, ''] } : cat
      )
    )
  }

  function updateSkill(catIndex: number, skillIndex: number, value: string) {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, skills: cat.skills.map((s, si) => si === skillIndex ? value : s) }
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

  function reorderSkills(catIndex: number, oldIndex: number, newIndex: number) {
    setCategories(prev =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, skills: arrayMove(cat.skills, oldIndex, newIndex) }
          : cat
      )
    )
  }

  async function handleSave() {
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
            Drag categories or skills to reorder. Use arrows for precise control.
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

      {/* Categories — draggable */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={categories.map((_, i) => `category-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-5">
            {categories.map((category, catIndex) => (
              <SortableCategoryCard
                key={`category-${catIndex}`}
                category={category}
                catIndex={catIndex}
                totalCategories={categories.length}
                onUpdate={(field, value) => updateCategory(catIndex, field, value)}
                onRemove={() => removeCategory(catIndex)}
                onMoveUp={() => moveCategory(catIndex, 'up')}
                onMoveDown={() => moveCategory(catIndex, 'down')}
                onAddSkill={() => addSkill(catIndex)}
                onUpdateSkill={(si, val) => updateSkill(catIndex, si, val)}
                onRemoveSkill={si => removeSkill(catIndex, si)}
                onReorderSkills={(oi, ni) => reorderSkills(catIndex, oi, ni)}
              />
            ))}

            {categories.length === 0 && (
              <div className="
                text-center py-16 bg-white rounded-2xl
                border border-dashed border-[var(--color-cream-300)]
              ">
                <p className="font-semibold text-[var(--color-clay-muted)] mb-3">
                  No skill categories yet.
                </p>
                <button
                  onClick={addCategory}
                  className="font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:underline cursor-pointer"
                >
                  Add your first category →
                </button>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Save */}
      <div className="mt-6">
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
  )
}