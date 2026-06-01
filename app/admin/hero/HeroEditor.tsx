'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import type { IHero } from '@/models/Portfolio'
import Toggle from '@/components/ui/Toggle'

export default function HeroEditor({
  initialData,
}: {
  initialData: IHero
}) {
  const router  = useRouter()
  const [form,   setForm]   = useState<IHero>({ ...initialData })
  const [saving, setSaving] = useState(false)

  function handleField(field: keyof IHero, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  /**
   * WHY separate stat handlers:
   * Stats is an array of objects — updating it requires
   * replacing the whole array with a new one that has the
   * changed item. This is the standard React immutable
   * update pattern for arrays.
   */
  function handleStatChange(
    index: number,
    field: 'number' | 'label',
    value: string
  ) {
    const updated = form.stats.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    )
    setForm(prev => ({ ...prev, stats: updated }))
  }

  function addStat() {
    setForm(prev => ({
      ...prev,
      stats: [...prev.stats, { number: '', label: '' }],
    }))
  }

  function removeStat(index: number) {
    setForm(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ hero: form }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Hero section saved!')
      router.refresh()
    } catch {
      toast.error('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
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
          Hero
        </span>
      </div>

      <div className="mb-8">
        <h1 className="
          text-2xl font-black
          text-[var(--color-clay-navy)]
          tracking-tight mb-1
        ">
          👋 Hero Section
        </h1>
        <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
          The first thing visitors see — your name, title, and intro.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Basic fields */}
        <div className="bg-white rounded-2xl border border-[var(--color-cream-300)] p-6 flex flex-col gap-5">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)]">
            Basic Info
          </h2>

          {/* Name */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleField('name', e.target.value)}
              placeholder="Uzair Asim"
              className="
                w-full px-4 py-3 rounded-xl
                border border-[var(--color-cream-300)]
                focus:border-[var(--color-clay-orange)]
                focus:outline-none
                font-semibold text-sm
                text-[var(--color-clay-navy)]
                bg-[var(--color-cream-50)]
                transition-colors duration-200
              "
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1.5">
              Title / Role
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleField('title', e.target.value)}
              placeholder="Full-Stack Engineer — .NET · Azure · React"
              className="
                w-full px-4 py-3 rounded-xl
                border border-[var(--color-cream-300)]
                focus:border-[var(--color-clay-orange)]
                focus:outline-none
                font-semibold text-sm
                text-[var(--color-clay-navy)]
                bg-[var(--color-cream-50)]
                transition-colors duration-200
              "
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => handleField('location', e.target.value)}
              placeholder="Islamabad, Pakistan"
              className="
                w-full px-4 py-3 rounded-xl
                border border-[var(--color-cream-300)]
                focus:border-[var(--color-clay-orange)]
                focus:outline-none
                font-semibold text-sm
                text-[var(--color-clay-navy)]
                bg-[var(--color-cream-50)]
                transition-colors duration-200
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => handleField('description', e.target.value)}
              placeholder="I build scalable full-stack applications..."
              rows={4}
              className="
                w-full px-4 py-3 rounded-xl
                border border-[var(--color-cream-300)]
                focus:border-[var(--color-clay-orange)]
                focus:outline-none
                font-semibold text-sm
                text-[var(--color-clay-navy)]
                bg-[var(--color-cream-50)]
                transition-colors duration-200
                resize-none
              "
            />
          </div>

          {/* Available toggle */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-2">
              Availability Status
            </label>
            <Toggle
              value={form.available}
              onChange={val => handleField('available', val)}
              labelOn="Available for hire"
              labelOff="Not available"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-[var(--color-cream-300)] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)]">
              Stats ({form.stats.length})
            </h2>
            <button
              type="button"
              onClick={addStat}
              className="
                flex items-center gap-1.5
                font-mono text-xs font-bold
                text-[var(--color-clay-orange)]
                hover:text-[var(--color-clay-orange-dark)]
                transition-colors cursor-pointer
              "
            >
              <Plus size={14} />
              Add Stat
            </button>
          </div>

          {form.stats.length === 0 && (
            <p className="text-sm font-semibold text-[var(--color-clay-muted)] text-center py-4">
              No stats yet. Click "Add Stat" to add one.
            </p>
          )}

          {form.stats.map((stat, index) => (
            <div
              key={index}
              className="
                flex gap-3 items-start
                p-4 rounded-xl
                bg-[var(--color-cream-50)]
                border border-[var(--color-cream-300)]
              "
            >
              <div className="flex-1 flex gap-3">
                <div className="flex-1">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={e => handleStatChange(index, 'number', e.target.value)}
                    placeholder="3+"
                    className="
                      w-full px-3 py-2 rounded-lg
                      border border-[var(--color-cream-300)]
                      focus:border-[var(--color-clay-orange)]
                      focus:outline-none
                      font-bold text-sm
                      text-[var(--color-clay-navy)]
                      bg-white
                      transition-colors
                    "
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => handleStatChange(index, 'label', e.target.value)}
                    placeholder="Years Exp"
                    className="
                      w-full px-3 py-2 rounded-lg
                      border border-[var(--color-cream-300)]
                      focus:border-[var(--color-clay-orange)]
                      focus:outline-none
                      font-bold text-sm
                      text-[var(--color-clay-navy)]
                      bg-white
                      transition-colors
                    "
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="
                  mt-5 p-2 rounded-lg
                  text-red-400 hover:text-red-600
                  hover:bg-red-50
                  transition-colors cursor-pointer
                "
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Save */}
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