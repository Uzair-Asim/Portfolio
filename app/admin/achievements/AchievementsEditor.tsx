'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, X } from 'lucide-react'
import type { IAchievement, ICertification } from '@/models/Portfolio'
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

// ── Achievement Card ──
function AchievementCard({
  item, onUpdate, onRemove, fieldErrors,
}: {
  item:        IAchievement
  onUpdate:    (field: keyof IAchievement, value: any) => void
  onRemove:    () => void
  fieldErrors: Record<string, string>
}) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-cream-300)]">
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1">
          <p className="font-black text-[var(--color-clay-navy)] text-sm">
            {item.title || 'New Achievement'}
          </p>
          <p className="font-mono text-xs text-[var(--color-clay-muted)]">
            {item.issuer || 'No issuer set'} {item.date ? `· ${item.date}` : ''}
          </p>
        </div>
        <button onClick={onRemove} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="flex gap-4 items-end">
          <div>
            <label className={labelCls}>Icon</label>
            <EmojiPicker value={item.icon} onChange={val => onUpdate('icon', val)} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={item.title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Silver Medalist"
              className={`${inputCls} ${fieldErrors.title ? 'border-red-400' : ''}`}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{fieldErrors.title}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={item.description}
            onChange={e => onUpdate('description', e.target.value)}
            rows={2}
            placeholder="Brief description..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Issuer</label>
            <input
              type="text"
              value={item.issuer}
              onChange={e => onUpdate('issuer', e.target.value)}
              placeholder="IIUI / XtremeLabs"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input
              type="text"
              value={item.date}
              onChange={e => onUpdate('date', e.target.value)}
              placeholder="2023"
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Certification Card ──
function CertificationCard({
  item, onUpdate, onRemove, fieldErrors,
}: {
  item:        ICertification
  onUpdate:    (field: keyof ICertification, value: any) => void
  onRemove:    () => void
  fieldErrors: Record<string, string>
}) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-cream-300)]">
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1">
          <p className="font-black text-[var(--color-clay-navy)] text-sm">
            {item.title || 'New Certification'}
          </p>
          <p className="font-mono text-xs text-[var(--color-clay-muted)]">
            {item.issuer || 'No issuer set'} {item.date ? `· ${item.date}` : ''}
          </p>
        </div>
        <button onClick={onRemove} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="flex gap-4 items-end">
          <div>
            <label className={labelCls}>Icon</label>
            <EmojiPicker value={item.icon} onChange={val => onUpdate('icon', val)} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={item.title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="AWS Solutions Architect"
              className={`${inputCls} ${fieldErrors.title ? 'border-red-400' : ''}`}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{fieldErrors.title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Issuer</label>
            <input
              type="text"
              value={item.issuer}
              onChange={e => onUpdate('issuer', e.target.value)}
              placeholder="Amazon / Microsoft / Google"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input
              type="text"
              value={item.date}
              onChange={e => onUpdate('date', e.target.value)}
              placeholder="2024"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Verify URL</label>
          <input
            type="text"
            value={item.url}
            onChange={e => onUpdate('url', e.target.value)}
            placeholder="https://credential-link.com"
            className={inputCls}
          />
          <p className="mt-1 font-mono text-[10px] text-[var(--color-clay-muted)]">
            Leave empty to hide the Verify button on the portfolio.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── New Achievement Modal ──
function NewAchievementModal({ onClose, onAdd, nextOrder }: {
  onClose: () => void
  onAdd:   (item: IAchievement) => void
  nextOrder: number
}) {
  const [title,  setTitle]  = useState('')
  const [emoji,  setEmoji]  = useState('🏆')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleAdd() {
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return }
    onAdd({ icon: emoji, title, description: '', issuer: '', date: '', order: nextOrder })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-clay-navy)]/40 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[var(--color-cream-300)] shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
          <h2 className="text-lg font-black text-[var(--color-clay-navy)]">Add Achievement</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-cream-200)] text-[var(--color-clay-muted)] cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex gap-4 items-end">
            <div>
              <label className={labelCls}>Icon</label>
              <EmojiPicker value={emoji} onChange={setEmoji} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors({}) }}
                placeholder="Silver Medalist"
                autoFocus
                className={`${inputCls} ${errors.title ? 'border-red-400' : ''}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--color-cream-300)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-[var(--color-clay-muted)] hover:bg-[var(--color-cream-100)] cursor-pointer">Cancel</button>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[var(--color-clay-orange)] hover:bg-[var(--color-clay-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ── New Certification Modal ──
function NewCertificationModal({ onClose, onAdd, nextOrder }: {
  onClose: () => void
  onAdd:   (item: ICertification) => void
  nextOrder: number
}) {
  const [title,  setTitle]  = useState('')
  const [emoji,  setEmoji]  = useState('📜')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleAdd() {
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return }
    onAdd({ icon: emoji, title, issuer: '', date: '', url: '', order: nextOrder })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-clay-navy)]/40 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[var(--color-cream-300)] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-cream-300)] bg-[var(--color-cream-50)]">
          <h2 className="text-lg font-black text-[var(--color-clay-navy)]">Add Certification</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-cream-200)] text-[var(--color-clay-muted)] cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex gap-4 items-end">
            <div>
              <label className={labelCls}>Icon</label>
              <EmojiPicker value={emoji} onChange={setEmoji} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors({}) }}
                placeholder="AWS Solutions Architect"
                autoFocus
                className={`${inputCls} ${errors.title ? 'border-red-400' : ''}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--color-cream-300)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-[var(--color-clay-muted)] hover:bg-[var(--color-cream-100)] cursor-pointer">Cancel</button>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[var(--color-clay-orange)] hover:bg-[var(--color-clay-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Editor ──
export default function AchievementsEditor({
  initialAchievements,
  initialCertifications,
}: {
  initialAchievements:   IAchievement[]
  initialCertifications: ICertification[]
}) {
  const router = useRouter()

  const [tab,            setTab]            = useState<'achievements' | 'certifications'>('achievements')
  const [achievements,   setAchievements]   = useState<IAchievement[]>([...initialAchievements].sort((a, b) => a.order - b.order))
  const [certifications, setCertifications] = useState<ICertification[]>([...initialCertifications].sort((a, b) => a.order - b.order))
  const [saving,         setSaving]         = useState(false)
  const [isDirty,        setIsDirty]        = useState(false)
  const [showModal,      setShowModal]      = useState(false)
  const [achErrors,      setAchErrors]      = useState<Record<number, Record<string, string>>>({})
  const [certErrors,     setCertErrors]     = useState<Record<number, Record<string, string>>>({})

  // ── Achievement handlers ──
  function updateAchievement(index: number, field: keyof IAchievement, value: any) {
    setIsDirty(true)
    setAchievements(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function removeAchievement(index: number) {
    setIsDirty(true)
    setAchievements(prev => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i + 1 })))
  }

  function addAchievement(item: IAchievement) {
    setIsDirty(true)
    setAchievements(prev => [...prev, item])
    toast.success(`${item.title} added.`)
  }

  // ── Certification handlers ──
  function updateCertification(index: number, field: keyof ICertification, value: any) {
    setIsDirty(true)
    setCertifications(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function removeCertification(index: number) {
    setIsDirty(true)
    setCertifications(prev => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i + 1 })))
  }

  function addCertification(item: ICertification) {
    setIsDirty(true)
    setCertifications(prev => [...prev, item])
    toast.success(`${item.title} added.`)
  }

  // ── Save ──
  async function handleSave() {
    // Validate achievements
    const aErrors: Record<number, Record<string, string>> = {}
    achievements.forEach((item, i) => {
      if (!item.title.trim()) aErrors[i] = { title: 'Title is required' }
    })

    // Validate certifications
    const cErrors: Record<number, Record<string, string>> = {}
    certifications.forEach((item, i) => {
      if (!item.title.trim()) cErrors[i] = { title: 'Title is required' }
    })

    if (Object.keys(aErrors).length > 0 || Object.keys(cErrors).length > 0) {
      setAchErrors(aErrors)
      setCertErrors(cErrors)
      toast.error('Please fix the highlighted fields before saving.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievements:   achievements.map((item, i) => ({ ...item, order: i + 1 })),
          certifications: certifications.map((item, i) => ({ ...item, order: i + 1 })),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Save failed')
      }
      toast.success('Saved!')
      setIsDirty(false)
      setAchErrors({})
      setCertErrors({})
      router.refresh()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const isAchievementsTab  = tab === 'achievements'
  const isCertTab          = tab === 'certifications'

  return (
    <div className="max-w-3xl">
      <Toaster position="top-right" />

      {showModal && isAchievementsTab && (
        <NewAchievementModal
          onClose={() => setShowModal(false)}
          onAdd={addAchievement}
          nextOrder={achievements.length + 1}
        />
      )}
      {showModal && isCertTab && (
        <NewCertificationModal
          onClose={() => setShowModal(false)}
          onAdd={addCertification}
          nextOrder={certifications.length + 1}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--color-clay-muted)] hover:text-[var(--color-clay-navy)] transition-colors">
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <span className="text-[var(--color-clay-muted)]">/</span>
        <span className="font-mono text-xs font-bold text-[var(--color-clay-navy)]">
          Achievements & Certifications
        </span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-clay-navy)] tracking-tight mb-1">
            🏆 Achievements & Certifications
          </h1>
          <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
            Each section is hidden on the portfolio when empty.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 font-mono text-xs font-bold bg-[var(--color-clay-navy)] text-white px-4 py-2.5 rounded-xl hover:bg-[var(--color-clay-navy-light)] transition-colors cursor-pointer"
        >
          <Plus size={14} />
          {isAchievementsTab ? 'Add Achievement' : 'Add Certification'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-cream-200)] rounded-xl mb-8">
        {(['achievements', 'certifications'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              flex-1 py-2.5 px-4 rounded-lg
              font-mono text-xs font-bold
              transition-all duration-200 cursor-pointer
              ${tab === t
                ? 'bg-white text-[var(--color-clay-navy)] shadow-sm'
                : 'text-[var(--color-clay-muted)] hover:text-[var(--color-clay-navy)]'
              }
            `}
          >
            {t === 'achievements'
              ? `Key Achievements (${achievements.length})`
              : `Certifications (${certifications.length})`
            }
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 pb-28">
        {isAchievementsTab && (
          <>
            {achievements.map((item, index) => (
              <AchievementCard
                key={`ach-${index}`}
                item={item}
                onUpdate={(field, value) => updateAchievement(index, field, value)}
                onRemove={() => removeAchievement(index)}
                fieldErrors={achErrors[index] ?? {}}
              />
            ))}
            {achievements.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[var(--color-cream-300)]">
                <p className="font-semibold text-[var(--color-clay-muted)] mb-3">
                  No achievements yet. Section will be hidden on the portfolio.
                </p>
                <button onClick={() => setShowModal(true)} className="font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:underline cursor-pointer">
                  Add your first achievement →
                </button>
              </div>
            )}
          </>
        )}

        {isCertTab && (
          <>
            {certifications.map((item, index) => (
              <CertificationCard
                key={`cert-${index}`}
                item={item}
                onUpdate={(field, value) => updateCertification(index, field, value)}
                onRemove={() => removeCertification(index)}
                fieldErrors={certErrors[index] ?? {}}
              />
            ))}
            {certifications.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[var(--color-cream-300)]">
                <p className="font-semibold text-[var(--color-clay-muted)] mb-3">
                  No certifications yet. Section will be hidden on the portfolio.
                </p>
                <button onClick={() => setShowModal(true)} className="font-mono text-xs font-bold text-[var(--color-clay-orange)] hover:underline cursor-pointer">
                  Add your first certification →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-[var(--color-cream-300)] px-6 py-4 flex items-center justify-between shadow-lg">
        <p className="font-mono text-xs font-bold text-[var(--color-clay-muted)]">
          {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} · {certifications.length} certification{certifications.length !== 1 ? 's' : ''}
          {isDirty
            ? <span className="ml-2 text-[var(--color-clay-orange)]">· unsaved changes</span>
            : <span className="ml-2 text-green-600">· all saved</span>
          }
        </p>
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 bg-[var(--color-clay-orange)] hover:bg-[var(--color-clay-orange-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}