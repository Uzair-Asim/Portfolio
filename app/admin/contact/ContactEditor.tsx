'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import type { IContact } from '@/models/Portfolio'

export default function ContactEditor({
  initialData,
}: {
  initialData: IContact
}) {
  const router = useRouter()

  /**
   * WHY spread initialData into state:
   * We copy the initial values into local state so the form
   * is controlled — React manages every field value.
   * Changes stay local until the user clicks Save,
   * at which point we send them all to the API at once.
   */
  const [form, setForm] = useState<IContact>({ ...initialData })
  const [saving, setSaving] = useState(false)

  function handleChange(field: keyof IContact, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        /**
         * WHY wrap in { contact: form }:
         * The PATCH route uses $set on whatever we send.
         * Sending { contact: form } updates only the contact
         * field without touching skills, experience, etc.
         */
        body: JSON.stringify({ contact: form }),
      })

      if (!res.ok) throw new Error('Save failed')

      toast.success('Contact info saved!')
      router.refresh()
    } catch {
      toast.error('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const fields: { key: keyof IContact; label: string; placeholder: string; type?: string }[] = [
    { key: 'email',    label: 'Email',         placeholder: 'you@example.com',              type: 'email' },
    { key: 'phone',    label: 'Phone',         placeholder: '+92-300-000-0000'                            },
    { key: 'linkedin', label: 'LinkedIn URL',  placeholder: 'https://linkedin.com/in/yourname'            },
    { key: 'github',   label: 'GitHub URL',    placeholder: 'https://github.com/yourusername'             },
    { key: 'website',  label: 'Website (opt)', placeholder: 'https://yourwebsite.com'                     },
    { key: 'location', label: 'Location',      placeholder: 'Islamabad, Pakistan'                         },
  ]

  return (
    <div className="max-w-2xl">
      <Toaster position="top-right" />

      {/* Header */}
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
          Contact
        </span>
      </div>

      <div className="mb-8">
        <h1 className="
          text-2xl font-black
          text-[var(--color-clay-navy)]
          tracking-tight mb-1
        ">
          📬 Contact Info
        </h1>
        <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
          These details appear in the Contact section and footer.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-[var(--color-cream-300)] p-6 flex flex-col gap-5">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="
              block font-mono text-xs font-bold uppercase
              tracking-wider text-[var(--color-clay-muted)]
              mb-1.5
            ">
              {field.label}
            </label>
            <input
              type={field.type ?? 'text'}
              value={form[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="
                w-full px-4 py-3 rounded-xl
                border border-[var(--color-cream-300)]
                focus:border-[var(--color-clay-orange)]
                focus:outline-none
                font-semibold text-sm
                text-[var(--color-clay-navy)]
                bg-[var(--color-cream-50)]
                transition-colors duration-200
                placeholder:text-[var(--color-clay-muted)]/50
              "
            />
          </div>
        ))}

        {/* Save button */}
        <div className="pt-2 border-t border-[var(--color-cream-300)]">
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