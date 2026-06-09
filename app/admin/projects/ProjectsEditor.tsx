'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import {
  ArrowLeft, Save, Plus, Trash2,
  GripVertical, X, ExternalLink,
} from 'lucide-react'
import type { IProject } from '@/models/Portfolio'
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
import EmojiPicker from '@/components/ui/EmojiPicker'

const inputCls = `
  w-full px-4 py-3 rounded-xl
  border border-[var(--color-cream-300)]
  focus:border-[var(--color-clay-orange)]
  focus:outline-none font-semibold text-sm
  text-[var(--color-clay-navy)]
  bg-[var(--color-cream-50)]
  transition-colors duration-200
`

const labelCls = `
  block font-mono text-xs font-bold uppercase
  tracking-wider text-[var(--color-clay-muted)] mb-1.5
`

// ── Sortable feature bullet ──
function SortableFeature({ id, value, onUpdate, onRemove }: {
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
      className="flex items-center gap-2"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-[var(--color-clay-muted)] hover:text-[var(--color-clay-navy)] touch-none flex-shrink-0"
        {...attributes} {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <input
        type="text"
        value={value}
        onChange={e => onUpdate(e.target.value)}
        placeholder="Describe a feature..."
        className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-cream-300)] focus:border-[var(--color-clay-orange)] focus:outline-none font-semibold text-sm text-[var(--color-clay-navy)] bg-[var(--color-cream-50)] transition-colors"
      />
      <button
        onClick={onRemove}
        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
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
        placeholder="Tech"
        className="px-2 py-1.5 font-semibold text-sm text-[var(--color-clay-navy)] bg-transparent focus:outline-none w-24"
      />
      <button onClick={onRemove} className="pr-2 text-red-300 hover:text-red-500 transition-colors cursor-pointer">
        ×
      </button>
    </div>
  )
}

// ── Project card ──
function ProjectCard({
  project, projIndex, onUpdate, onRemove, fieldErrors,
}: {
  project:     IProject
  projIndex:   number
  onUpdate:    (field: keyof IProject, value: any) => void
  onRemove:    () => void
  fieldErrors: Record<string, string>
}) {
  const featureSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const techSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleFeatureDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = project.features.findIndex((_, i) => `feature-${projIndex}-${i}` === active.id)
    const newIndex = project.features.findIndex((_, i) => `feature-${projIndex}-${i}` === over.id)
    if (oldIndex !== -1 && newIndex !== -1)
      onUpdate('features', arrayMove(project.features, oldIndex, newIndex))
  }

  function handleTechDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = project.tech.findIndex((_, i) => `ptech-${projIndex}-${i}` === active.id)
    const newIndex = project.tech.findIndex((_, i) => `ptech-${projIndex}-${i}` === over.id)
    if (oldIndex !== -1 && newIndex !== -1)
      onUpdate('tech', arrayMove(project.tech, oldIndex, newIndex))
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-cream-300)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
        <span className="text-2xl">{project.emoji || '📁'}</span>
        <div className="flex-1">
          <p className="font-black text-[var(--color-clay-navy)] text-sm">
            {project.title || 'New Project'}
          </p>
          <p className="font-mono text-xs text-[var(--color-clay-muted)]">
            {project.tech.slice(0, 3).join(' · ') || 'No tech added yet'}
          </p>
        </div>
        {project.featured && (
          <span className="font-mono text-xs font-bold bg-[var(--color-clay-orange)]/10 text-[var(--color-clay-orange)] px-2.5 py-1 rounded-full">
            Featured
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

        {/* Title + Emoji */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={project.title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Picture Pulse"
              className={`${inputCls} ${fieldErrors.title ? 'border-red-400' : ''}`}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{fieldErrors.title}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Emoji</label>
            <EmojiPicker
              value={project.emoji}
              onChange={val => onUpdate('emoji', val)}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description *</label>
          <textarea
            value={project.description}
            onChange={e => onUpdate('description', e.target.value)}
            rows={3}
            placeholder="A short description of what this project does..."
            className={`${inputCls} resize-none ${fieldErrors.description ? 'border-red-400' : ''}`}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{fieldErrors.description}</p>
          )}
        </div>

        {/* Live URL + GitHub URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Live URL</label>
            <div className="relative">
              <input
                type="text"
                value={project.liveUrl === '#' ? '' : project.liveUrl}
                onChange={e => onUpdate('liveUrl', e.target.value || '#')}
                placeholder="https://yourproject.com"
                className={inputCls + ' pr-10'}
              />
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-clay-muted)] hover:text-[var(--color-clay-orange)]"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <div>
            <label className={labelCls}>GitHub URL</label>
            <div className="relative">
              <input
                type="text"
                value={project.githubUrl === '#' ? '' : project.githubUrl}
                onChange={e => onUpdate('githubUrl', e.target.value || '#')}
                placeholder="https://github.com/you/project"
                className={inputCls + ' pr-10'}
              />
              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-clay-muted)] hover:text-[var(--color-clay-orange)]"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Featured toggle */}
        <div>
          <label className={labelCls}>Visibility</label>
          <Toggle
            value={project.featured}
            onChange={val => onUpdate('featured', val)}
            labelOn="Featured project"
            labelOff="Not featured"
          />
        </div>

        {/* Tech stack - draggable */}
        <div>
          <label className={labelCls}>Tech Stack</label>
          <DndContext
            sensors={techSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTechDragEnd}
          >
            <SortableContext
              items={project.tech.map((_, i) => `ptech-${projIndex}-${i}`)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, ti) => (
                  <SortableTechChip
                    key={`ptech-${projIndex}-${ti}`}
                    id={`ptech-${projIndex}-${ti}`}
                    value={t}
                    onUpdate={val => onUpdate('tech', project.tech.map((x, i) => i === ti ? val : x))}
                    onRemove={() => onUpdate('tech', project.tech.filter((_, i) => i !== ti))}
                  />
                ))}
                <button
                  onClick={() => onUpdate('tech', [...project.tech, ''])}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-clay-orange)]/40 text-[var(--color-clay-orange)] font-mono text-xs font-bold hover:border-[var(--color-clay-orange)] hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  Add tech
                </button>
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Features - draggable */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={labelCls + ' mb-0'}>Features</label>
            <button
              onClick={() => onUpdate('features', [...project.features, ''])}
              className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:text-[var(--color-clay-orange-dark)] transition-colors cursor-pointer"
            >
              <Plus size={12} />
              Add feature
            </button>
          </div>
          <DndContext
            sensors={featureSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFeatureDragEnd}
          >
            <SortableContext
              items={project.features.map((_, i) => `feature-${projIndex}-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {project.features.map((feature, fi) => (
                  <SortableFeature
                    key={`feature-${projIndex}-${fi}`}
                    id={`feature-${projIndex}-${fi}`}
                    value={feature}
                    onUpdate={val => onUpdate('features', project.features.map((f, i) => i === fi ? val : f))}
                    onRemove={() => onUpdate('features', project.features.filter((_, i) => i !== fi))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {project.features.length === 0 && (
            <p className="text-sm font-semibold text-[var(--color-clay-muted)] text-center py-4 border border-dashed border-[var(--color-cream-300)] rounded-xl">
              No features yet. Click "Add feature" to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── New Project Modal ──
function NewProjectModal({
  onClose, onAdd, nextOrder,
}: {
  onClose:   () => void
  onAdd:     (p: IProject) => void
  nextOrder: number
}) {
  const [title,   setTitle]   = useState('')
  const [emoji,   setEmoji]   = useState('📁')
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Project title is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleAdd() {
    if (!validate()) return
    onAdd({
      title,
      emoji,
      description: '',
      tech:        [],
      features:    [],
      liveUrl:     '#',
      githubUrl:   '#',
      featured:    false,
      order:       nextOrder,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--color-clay-navy)]/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[var(--color-cream-300)] shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
          <div>
            <h2 className="text-lg font-black text-[var(--color-clay-navy)]">Add New Project</h2>
            <p className="font-mono text-xs text-[var(--color-clay-muted)] mt-0.5">
              Fill in the basics - add features and tech after.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-cream-200)] text-[var(--color-clay-muted)] transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })) }}
                placeholder="Picture Pulse"
                autoFocus
                className={`${inputCls} ${errors.title ? 'border-red-400' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Emoji</label>
              <EmojiPicker
                value={emoji}
                onChange={setEmoji}
              />
            </div>
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
            Add Project
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Validation ──
function validateProjects(projects: IProject[]) {
  const errors: Record<number, Record<string, string>> = {}
  projects.forEach((p, i) => {
    const e: Record<string, string> = {}
    if (!p.title.trim())       e.title       = 'Title is required'
    if (!p.description.trim()) e.description = 'Description is required'
    if (Object.keys(e).length > 0) errors[i] = e
  })
  return errors
}

// ── Main editor ──
export default function ProjectsEditor({
  initialData,
}: {
  initialData: IProject[]
}) {
  const router = useRouter()

  const [projects, setProjects] = useState<IProject[]>(
  [...initialData].sort((a, b) => {
    /**
     * WHY sort featured first then by order:
     * Featured projects always appear at the top of the grid.
     * Within featured and non-featured groups, order field
     * determines the sequence.
     */
    if (a.featured === b.featured) return a.order - b.order
    return a.featured ? -1 : 1
  })
)
  const [saving,      setSaving]      = useState(false)
  const [showModal,   setShowModal]   = useState(false)
  const [isDirty,     setIsDirty]     = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<number, Record<string, string>>>({})

  function updateProject(index: number, field: keyof IProject, value: any) {
    setIsDirty(true)
    setProjects(prev => {
      const updated = prev.map((p, i) => i === index ? { ...p, [field]: value } : p)
      if (field === 'featured') {
        return updated.sort((a, b) => {
          if (a.featured === b.featured) return a.order - b.order
          return a.featured ? -1 : 1
        })
      }
      return updated
    })
    setFieldErrors(prev => {
      if (!prev[index]?.[field as string]) return prev
      const updated = { ...prev }
      updated[index] = { ...updated[index] }
      delete updated[index][field as string]
      return updated
    })
  }

  function removeProject(index: number) {
    setIsDirty(true)
    setProjects(prev =>
      prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i + 1 }))
    )
  }

  function addProject(p: IProject) {
    setIsDirty(true)
    setProjects(prev => [...prev, p])
    toast.success(`${p.title} added. Fill in the details below.`)
  }

  async function handleSave() {
    const errors = validateProjects(projects)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const totalErrors = Object.values(errors).reduce((sum, e) => sum + Object.keys(e).length, 0)
      const projCount   = Object.keys(errors).length
      toast.error(
        `${totalErrors} field${totalErrors !== 1 ? 's' : ''} need attention across ${projCount} project${projCount !== 1 ? 's' : ''}.`
      )
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          projects: projects.map((p, i) => ({ ...p, order: i + 1 })),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Save failed')
      }
      toast.success('Projects saved!')
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
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onAdd={addProject}
          nextOrder={projects.length + 1}
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
          Projects
        </span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-clay-navy)] tracking-tight mb-1">
            🚀 Projects
          </h1>
          <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
            Drag features and tech to reorder within each project.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 font-mono text-xs font-bold bg-[var(--color-clay-navy)] text-white px-4 py-2.5 rounded-xl hover:bg-[var(--color-clay-navy-light)] transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      <div className="flex flex-col gap-6 pb-28">
        {projects.map((project, projIndex) => (
          <ProjectCard
            key={`proj-${project.title}-${projIndex}`}
            project={project}
            projIndex={projIndex}
            onUpdate={(field, value) => updateProject(projIndex, field, value)}
            onRemove={() => removeProject(projIndex)}
            fieldErrors={fieldErrors[projIndex] ?? {}}
          />
        ))}

        {projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[var(--color-cream-300)]">
            <p className="font-semibold text-[var(--color-clay-muted)] mb-3">
              No projects yet.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:underline cursor-pointer"
            >
              Add your first project →
            </button>
          </div>
        )}
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-[var(--color-cream-300)] px-6 py-4 flex items-center justify-between shadow-lg">
        <p className="font-mono text-xs font-bold text-[var(--color-clay-muted)]">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
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