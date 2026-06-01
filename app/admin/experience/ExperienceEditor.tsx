'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical, X,
} from 'lucide-react'
import type { IExperience } from '@/models/Portfolio'
import Toggle from '@/components/ui/Toggle'
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

// ── Constants ──
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i)

const MONTH_INDEX: Record<string, number> = {
  Jan: 1,  Feb: 2,  Mar: 3,  Apr: 4,  May: 5,  Jun: 6,
  Jul: 7,  Aug: 8,  Sep: 9,  Oct: 10, Nov: 11, Dec: 12,
}

const inputCls = `
  w-full px-4 py-3 rounded-xl
  border border-[var(--color-cream-300)]
  focus:border-[var(--color-clay-orange)]
  focus:outline-none font-semibold text-sm
  text-[var(--color-clay-navy)]
  bg-[var(--color-cream-50)]
  transition-colors duration-200
`

const selectCls = `
  w-full pl-4 pr-4 py-3 rounded-xl
  border border-[var(--color-cream-300)]
  focus:border-[var(--color-clay-orange)]
  focus:outline-none font-semibold text-sm
  text-[var(--color-clay-navy)]
  bg-[var(--color-cream-50)]
  transition-colors duration-200
  cursor-pointer
`

const labelCls = `
  block font-mono text-xs font-bold uppercase
  tracking-wider text-[var(--color-clay-muted)] mb-1.5
`

// ── Sort by end date ──
function parseEndDate(period: string): number {
  const end = period.split(' — ')[1]?.trim() ?? ''
  if (end === 'Present') return Number.MAX_SAFE_INTEGER
  const parts = end.split(' ')
  const month = MONTH_INDEX[parts[0] ?? ''] ?? 0
  const year  = parseInt(parts[1] ?? '0', 10)
  if (year === 0) {
    const start      = period.split(' — ')[0]?.trim() ?? ''
    const startParts = start.split(' ')
    const sm = MONTH_INDEX[startParts[0] ?? ''] ?? 0
    const sy = parseInt(startParts[1] ?? '0', 10)
    return sy * 12 + sm
  }
  return year * 12 + month
}

function sortByDate(exps: IExperience[]): IExperience[] {
  return [...exps]
    .sort((a, b) => parseEndDate(b.period) - parseEndDate(a.period))
    .map((e, i) => ({ ...e, order: i + 1 }))
}

// ── Validation helpers ──
function validatePeriod(period: string, isCurrent: boolean): string | null {
  const parts      = period ? period.split(' — ') : []
  const startStr   = parts[0]?.trim() ?? ''
  const startSplit = startStr.split(' ')
  const validStart = MONTHS.includes(startSplit[0]) && !isNaN(parseInt(startSplit[1]))

  if (!validStart) return 'Start month and year are required'

  if (!isCurrent) {
    const endStr   = parts[1]?.trim() ?? ''
    const endSplit = endStr.split(' ')
    const validEnd = endStr !== '' && MONTHS.includes(endSplit[0]) && !isNaN(parseInt(endSplit[1]))

    if (!validEnd) return 'End month and year are required for past roles'

    /**
     * WHY compare as numeric values:
     * We convert both dates to year * 12 + monthIndex so we
     * can compare them as simple integers.
     * "Mar 2023" = 2023 * 12 + 3 = 24279
     * "Feb 2023" = 2023 * 12 + 2 = 24278
     * If end <= start the experience duration makes no sense.
     */
    const startValue = parseInt(startSplit[1]) * 12 + (MONTH_INDEX[startSplit[0]] ?? 0)
    const endValue   = parseInt(endSplit[1])   * 12 + (MONTH_INDEX[endSplit[0]]   ?? 0)

    if (endValue < startValue) {
      return `End date (${endStr}) cannot be before start date (${startStr})`
    }

    if (endValue === startValue) {
      return `End date cannot be the same month as start date`
    }
  }

  return null
}

function validateExperiences(experiences: IExperience[]) {
  const errors: Record<number, Record<string, string>> = {}

  experiences.forEach((exp, i) => {
    const e: Record<string, string> = {}

    if (!exp.company.trim())
      e.company = 'Company name is required'

    if (!exp.role.trim())
      e.role = 'Role is required'

    const periodError = validatePeriod(exp.period, exp.current)
    if (periodError) e.period = periodError

    if (Object.keys(e).length > 0) errors[i] = e
  })

  return errors
}

// ── Period Picker ──
function PeriodPicker({
  period,
  isCurrent,
  onChange,
  periodError,
}: {
  period:       string
  isCurrent:    boolean
  onChange:     (val: string) => void
  periodError?: string
}) {
  const parts     = period ? period.split(' — ') : []
  const startPart = parts[0]?.trim() ?? ''
  const endPart   = parts[1]?.trim() ?? ''

  const startSplit = startPart ? startPart.split(' ') : []
  const endSplit   = (endPart && endPart !== 'Present') ? endPart.split(' ') : []

  const [startMonth, setStartMonth] = useState(startSplit[0] ?? '')
  const [startYear,  setStartYear]  = useState(startSplit[1] ?? '')
  const [endMonth,   setEndMonth]   = useState(endSplit[0]   ?? '')
  const [endYear,    setEndYear]    = useState(endSplit[1]   ?? '')

  function compose(sm: string, sy: string, em: string, ey: string, current: boolean) {
    const start = sm || sy ? `${sm} ${sy}`.trim() : ''
    const end   = current
      ? 'Present'
      : em || ey ? `${em} ${ey}`.trim() : ''

    if (start && end) onChange(`${start} — ${end}`)
    else if (start)   onChange(start)
    else              onChange('')
  }

  function handleStartMonth(val: string) {
    setStartMonth(val)
    compose(val, startYear, endMonth, endYear, isCurrent)
  }
  function handleStartYear(val: string) {
    setStartYear(val)
    compose(startMonth, val, endMonth, endYear, isCurrent)
  }
  function handleEndMonth(val: string) {
    setEndMonth(val)
    compose(startMonth, startYear, val, endYear, isCurrent)
  }
  function handleEndYear(val: string) {
    setEndYear(val)
    compose(startMonth, startYear, endMonth, val, isCurrent)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Start date */}
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1.5">
          Start Date *
        </p>
        <div className="flex gap-2">
          <select
            value={startMonth}
            onChange={e => handleStartMonth(e.target.value)}
            className={`${selectCls} flex-1`}
          >
            <option value="">Month</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={startYear}
            onChange={e => handleStartYear(e.target.value)}
            className={`${selectCls} flex-1`}
          >
            <option value="">Year</option>
            {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* End date */}
      {!isCurrent && (
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1.5">
            End Date *
          </p>
          <div className="flex gap-2">
            <select
              value={endMonth}
              onChange={e => handleEndMonth(e.target.value)}
              className={`${selectCls} flex-1`}
            >
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={endYear}
              onChange={e => handleEndYear(e.target.value)}
              className={`${selectCls} flex-1`}
            >
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          </div>
        </div>
      )}

      {isCurrent && (
        <p className="font-mono text-xs font-bold text-green-600">
          End date: Present (set automatically)
        </p>
      )}

      {/* Period error */}
      {periodError && (
        <p className="text-xs text-red-500 font-semibold">{periodError}</p>
      )}

      {/* Preview */}
      {period && !periodError && (
        <p className="font-mono text-xs text-[var(--color-clay-muted)]">
          Preview: <span className="text-[var(--color-clay-navy)] font-bold">{period}</span>
        </p>
      )}
    </div>
  )
}

// ── Sortable bullet ──
function SortableBullet({ id, value, onUpdate, onRemove }: {
  id: string; value: string
  onUpdate: (val: string) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.8 : 1 }}
      className="flex items-start gap-2"
    >
      <button
        className="mt-3 cursor-grab active:cursor-grabbing text-[var(--color-clay-muted)] hover:text-[var(--color-clay-navy)] touch-none flex-shrink-0"
        {...attributes} {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <textarea
        value={value}
        onChange={e => onUpdate(e.target.value)}
        rows={2}
        placeholder="Describe what you did and the impact..."
        className="flex-1 px-3 py-2.5 rounded-xl border border-[var(--color-cream-300)] focus:border-[var(--color-clay-orange)] focus:outline-none font-semibold text-sm text-[var(--color-clay-navy)] bg-[var(--color-cream-50)] transition-colors resize-none"
      />
      <button
        onClick={onRemove}
        className="mt-2 p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ── Sortable tech chip ──
function SortableTechChip({ id, value, onUpdate, onRemove }: {
  id: string; value: string
  onUpdate: (val: string) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.75 : 1 }}
      className="flex items-center gap-1 bg-[var(--color-cream-50)] border border-[var(--color-cream-300)] rounded-lg overflow-hidden"
    >
      <button
        className="pl-2 cursor-grab active:cursor-grabbing text-[var(--color-clay-muted)] touch-none"
        {...attributes} {...listeners}
      >
        <GripVertical size={12} />
      </button>
      <input
        type="text"
        value={value}
        onChange={e => onUpdate(e.target.value)}
        placeholder="Technology"
        className="px-2 py-1.5 font-semibold text-sm text-[var(--color-clay-navy)] bg-transparent focus:outline-none w-24"
      />
      <button onClick={onRemove} className="pr-2 text-red-300 hover:text-red-500 transition-colors cursor-pointer">
        ×
      </button>
    </div>
  )
}

// ── Experience card ──
function ExperienceCard({
  exp, expIndex, onUpdate, onRemove, fieldErrors,
}: {
  exp:         IExperience
  expIndex:    number
  onUpdate:    (field: keyof IExperience, value: any) => void
  onRemove:    () => void
  fieldErrors: Record<string, string>
}) {
  const bulletSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const techSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleBulletDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = exp.bullets.findIndex((_, i) => `bullet-${expIndex}-${i}` === active.id)
    const newIndex = exp.bullets.findIndex((_, i) => `bullet-${expIndex}-${i}` === over.id)
    if (oldIndex !== -1 && newIndex !== -1)
      onUpdate('bullets', arrayMove(exp.bullets, oldIndex, newIndex))
  }

  function handleTechDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = exp.tech.findIndex((_, i) => `tech-${expIndex}-${i}` === active.id)
    const newIndex = exp.tech.findIndex((_, i) => `tech-${expIndex}-${i}` === over.id)
    if (oldIndex !== -1 && newIndex !== -1)
      onUpdate('tech', arrayMove(exp.tech, oldIndex, newIndex))
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-cream-300)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
        <div className="flex-1">
          <p className="font-black text-[var(--color-clay-navy)] text-sm">
            {exp.company || 'New Experience'}
          </p>
          <p className="font-mono text-xs text-[var(--color-clay-muted)]">
            {exp.role || 'Role not set'} · {exp.period || 'Period not set'}
          </p>
        </div>
        {exp.current && (
          <span className="font-mono text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            Current
          </span>
        )}
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-5">

        {/* Company + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Company *</label>
            <input
              type="text"
              value={exp.company}
              onChange={e => onUpdate('company', e.target.value)}
              placeholder="XtremeLabs LLC"
              className={`${inputCls} ${fieldErrors.company ? 'border-red-400' : ''}`}
            />
            {fieldErrors.company && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{fieldErrors.company}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Role *</label>
            <input
              type="text"
              value={exp.role}
              onChange={e => onUpdate('role', e.target.value)}
              placeholder="Software Engineer"
              className={`${inputCls} ${fieldErrors.role ? 'border-red-400' : ''}`}
            />
            {fieldErrors.role && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{fieldErrors.role}</p>
            )}
          </div>
        </div>

        {/* Type + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Type</label>
            <select
              value={exp.type}
              onChange={e => onUpdate('type', e.target.value)}
              className={selectCls}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input
              type="text"
              value={exp.location}
              onChange={e => onUpdate('location', e.target.value)}
              placeholder="Islamabad, Pakistan"
              className={inputCls}
            />
          </div>
        </div>

        {/* Current toggle */}
        <div>
          <label className={labelCls}>Status</label>
          <Toggle
            value={exp.current}
            onChange={val => {
              onUpdate('current', val)
              const startPart = exp.period.split(' — ')[0] ?? ''
              if (val) onUpdate('period', startPart ? `${startPart} — Present` : '')
              else     onUpdate('period', startPart)
            }}
            labelOn="Current role"
            labelOff="Past role"
          />
        </div>

        {/* Period */}
        <div>
          <label className={labelCls}>Period *</label>
          <PeriodPicker
            key={`period-${expIndex}-${exp.current}`}
            period={exp.period}
            isCurrent={exp.current}
            onChange={val => onUpdate('period', val)}
            periodError={fieldErrors.period}
          />
        </div>

        {/* Tech — draggable */}
        <div>
          <label className={labelCls}>Tech Stack</label>
          <DndContext
            sensors={techSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTechDragEnd}
          >
            <SortableContext
              items={exp.tech.map((_, i) => `tech-${expIndex}-${i}`)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-2">
                {exp.tech.map((t, ti) => (
                  <SortableTechChip
                    key={`tech-${expIndex}-${ti}`}
                    id={`tech-${expIndex}-${ti}`}
                    value={t}
                    onUpdate={val => onUpdate('tech', exp.tech.map((x, i) => i === ti ? val : x))}
                    onRemove={() => onUpdate('tech', exp.tech.filter((_, i) => i !== ti))}
                  />
                ))}
                <button
                  onClick={() => onUpdate('tech', [...exp.tech, ''])}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-clay-orange)]/40 text-[var(--color-clay-orange)] font-mono text-xs font-bold hover:border-[var(--color-clay-orange)] hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  Add tech
                </button>
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Bullets — draggable */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={labelCls + ' mb-0'}>Bullet Points</label>
            <button
              onClick={() => onUpdate('bullets', [...exp.bullets, ''])}
              className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:text-[var(--color-clay-orange-dark)] transition-colors cursor-pointer"
            >
              <Plus size={12} />
              Add bullet
            </button>
          </div>
          <DndContext
            sensors={bulletSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleBulletDragEnd}
          >
            <SortableContext
              items={exp.bullets.map((_, i) => `bullet-${expIndex}-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {exp.bullets.map((bullet, bi) => (
                  <SortableBullet
                    key={`bullet-${expIndex}-${bi}`}
                    id={`bullet-${expIndex}-${bi}`}
                    value={bullet}
                    onUpdate={val => onUpdate('bullets', exp.bullets.map((b, i) => i === bi ? val : b))}
                    onRemove={() => onUpdate('bullets', exp.bullets.filter((_, i) => i !== bi))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {exp.bullets.length === 0 && (
            <p className="text-sm font-semibold text-[var(--color-clay-muted)] text-center py-4 border border-dashed border-[var(--color-cream-300)] rounded-xl">
              No bullets yet. Click "Add bullet" to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── New Experience Modal ──
function NewExperienceModal({
  onClose, onAdd, nextOrder,
}: {
  onClose:   () => void
  onAdd:     (exp: IExperience) => void
  nextOrder: number
}) {
  const [company, setCompany] = useState('')
  const [role,    setRole]    = useState('')
  const [type,    setType]    = useState('Full-Time')
  const [current, setCurrent] = useState(false)
  const [period,  setPeriod]  = useState('')
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}

    if (!company.trim())
      e.company = 'Company name is required'

    if (!role.trim())
      e.role = 'Role is required'

    const periodError = validatePeriod(period, current)
    if (periodError) e.period = periodError

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleAdd() {
    if (!validate()) return
    onAdd({
      company, role, type, period,
      location: '', current,
      tech: [], bullets: [],
      order: nextOrder,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--color-clay-navy)]/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[var(--color-cream-300)] shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
          <div>
            <h2 className="text-lg font-black text-[var(--color-clay-navy)]">Add New Role</h2>
            <p className="font-mono text-xs text-[var(--color-clay-muted)] mt-0.5">
              Fill in the basics — add bullets and tech after.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-cream-200)] text-[var(--color-clay-muted)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className={labelCls}>Company *</label>
            <input
              type="text"
              value={company}
              onChange={e => { setCompany(e.target.value); setErrors(p => ({ ...p, company: '' })) }}
              placeholder="XtremeLabs LLC"
              autoFocus
              className={`${inputCls} ${errors.company ? 'border-red-400' : ''}`}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.company}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Role *</label>
            <input
              type="text"
              value={role}
              onChange={e => { setRole(e.target.value); setErrors(p => ({ ...p, role: '' })) }}
              placeholder="Software Engineer"
              className={`${inputCls} ${errors.role ? 'border-red-400' : ''}`}
            />
            {errors.role && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.role}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className={selectCls}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <Toggle
              value={current}
              onChange={val => {
                setCurrent(val)
                const startPart = period.split(' — ')[0] ?? ''
                if (val) setPeriod(startPart ? `${startPart} — Present` : '')
                else     setPeriod(startPart)
              }}
              labelOn="Current role"
              labelOff="Past role"
            />
          </div>

          <div>
            <label className={labelCls}>Period *</label>
            <PeriodPicker
              key={`modal-period-${current}`}
              period={period}
              isCurrent={current}
              onChange={val => {
                setPeriod(val)
                setErrors(p => ({ ...p, period: '' }))
              }}
              periodError={errors.period}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--color-cream-300)]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-[var(--color-clay-muted)] hover:bg-[var(--color-cream-100)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[var(--color-clay-orange)] hover:bg-[var(--color-clay-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Role
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main editor ──
export default function ExperienceEditor({
  initialData,
}: {
  initialData: IExperience[]
}) {
  const router = useRouter()

  const [experiences, setExperiences] = useState<IExperience[]>(sortByDate(initialData))
  const [saving,      setSaving]      = useState(false)
  const [showModal,   setShowModal]   = useState(false)
  const [isDirty,     setIsDirty]     = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({})

  function updateExperience(index: number, field: keyof IExperience, value: any) {
    setIsDirty(true)
    setExperiences(prev => {
      const updated = prev.map((e, i) => i === index ? { ...e, [field]: value } : e)
      if (field === 'period') return sortByDate(updated)
      return updated
    })
    // Clear specific field error on change
    setFieldErrors(prev => {
      if (!prev[index]?.[field as string]) return prev
      const updated = { ...prev }
      updated[index] = { ...updated[index] }
      delete updated[index][field as string]
      // Also clear period error when period or current changes
      if (field === 'period' || field === 'current') {
        delete updated[index].period
      }
      return updated
    })
  }

  function removeExperience(index: number) {
    setIsDirty(true)
    setExperiences(prev => sortByDate(prev.filter((_, i) => i !== index)))
    setFieldErrors(prev => {
      const updated: Record<number, Record<string, string>> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const ki = parseInt(k)
        if (ki !== index) updated[ki > index ? ki - 1 : ki] = v
      })
      return updated
    })
  }

  function addExperience(exp: IExperience) {
    setIsDirty(true)
    setExperiences(prev => sortByDate([...prev, exp]))
    toast.success(`${exp.company} added. Fill in the details below.`)
  }

  async function handleSave() {
    const errors = validateExperiences(experiences)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      /**
       * WHY count total errors for the toast message:
       * Instead of a generic "fix errors" message, we tell
       * the user exactly how many fields need attention and
       * which entries have problems — specific and actionable.
       */
      const totalErrors  = Object.values(errors).reduce((sum, e) => sum + Object.keys(e).length, 0)
      const entryCount   = Object.keys(errors).length
      toast.error(
        `${totalErrors} field${totalErrors !== 1 ? 's' : ''} need attention across ${entryCount} entr${entryCount !== 1 ? 'ies' : 'y'}.`
      )
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ experience: experiences }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Save failed')
      }

      toast.success('Experience saved!')
      setIsDirty(false)
      setFieldErrors({})
      router.refresh()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <Toaster position="top-right" />

      {showModal && (
        <NewExperienceModal
          onClose={() => setShowModal(false)}
          onAdd={addExperience}
          nextOrder={experiences.length + 1}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--color-clay-muted)] hover:text-[var(--color-clay-navy)] transition-colors"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <span className="text-[var(--color-clay-muted)]">/</span>
        <span className="font-mono text-xs font-bold text-[var(--color-clay-navy)]">
          Experience
        </span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-clay-navy)] tracking-tight mb-1">
            💼 Experience
          </h1>
          <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
            Entries are automatically sorted by end date, most recent first.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 font-mono text-xs font-bold bg-[var(--color-clay-navy)] text-white px-4 py-2.5 rounded-xl hover:bg-[var(--color-clay-navy-light)] transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Add Role
        </button>
      </div>

      <div className="flex flex-col gap-6 pb-28">
        {experiences.map((exp, expIndex) => (
          <ExperienceCard
            key={`exp-${exp.company}-${exp.period}`}
            exp={exp}
            expIndex={expIndex}
            onUpdate={(field, value) => updateExperience(expIndex, field, value)}
            onRemove={() => removeExperience(expIndex)}
            fieldErrors={fieldErrors[expIndex] ?? {}}
          />
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[var(--color-cream-300)]">
            <p className="font-semibold text-[var(--color-clay-muted)] mb-3">
              No experience entries yet.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:underline cursor-pointer"
            >
              Add your first role →
            </button>
          </div>
        )}
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-[var(--color-cream-300)] px-6 py-4 flex items-center justify-between shadow-lg">
        <p className="font-mono text-xs font-bold text-[var(--color-clay-muted)]">
          {experiences.length} role{experiences.length !== 1 ? 's' : ''}
          {isDirty
            ? <span className="ml-2 text-[var(--color-clay-orange)]">· unsaved changes</span>
            : <span className="ml-2 text-green-600">· all saved</span>
          }
        </p>
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="
            flex items-center gap-2
            bg-[var(--color-clay-orange)]
            hover:bg-[var(--color-clay-orange-dark)]
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-bold px-6 py-3 rounded-xl
            transition-colors duration-200 cursor-pointer
          "
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}