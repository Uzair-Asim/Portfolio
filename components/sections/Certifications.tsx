'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { ICertification } from '@/models/Portfolio'

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function Certifications({ certifications }: { certifications: ICertification[] }) {
  /**
   * WHY return null when empty:
   * Certifications are future-proofed - the section only
   * appears when you actually have credentials to show.
   * Empty section = no section. No placeholder, no heading,
   * no wasted space.
   */
  if (!certifications || certifications.length === 0) return null

  const sorted = [...certifications].sort((a, b) => a.order - b.order)

  return (
    <section id="certifications" className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-[var(--color-clay-orange)] mb-3">
            // credentials
          </p>
          <div className="flex items-end flex-wrap gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-clay-navy)] tracking-tight">
              Certifications
            </h2>
            <div className="hidden md:block flex-1 max-w-xs h-px mb-3 ml-6 bg-gradient-to-r from-[var(--color-clay-orange)] to-transparent" />
          </div>
          <p className="mt-4 text-[var(--color-clay-muted)] font-semibold max-w-xl">
            Verified credentials and professional certifications.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {sorted.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="
                flex flex-col gap-3 p-6 rounded-2xl
                bg-[var(--color-cream-50)]
                border border-[var(--color-cream-300)]
                hover:border-blue-200
                hover:shadow-lg hover:shadow-blue-50
                transition-all duration-300
              "
            >
              {/* Icon + verify link */}
              <div className="flex items-start justify-between">
                <span className="text-3xl">{item.icon}</span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-1
                      font-mono text-[10px] font-bold
                      text-blue-500 hover:text-blue-700
                      transition-colors
                    "
                  >
                    <ExternalLink size={11} />
                    Verify
                  </a>
                )}
              </div>

              <h3 className="font-black text-[var(--color-clay-navy)] leading-tight">
                {item.title}
              </h3>

              {(item.issuer || item.date) && (
                <div className="
                  flex items-center justify-between
                  pt-3 mt-auto
                  border-t border-[var(--color-cream-300)]
                ">
                  {item.issuer && (
                    <span className="font-mono text-xs font-bold text-[var(--color-clay-muted)]">
                      {item.issuer}
                    </span>
                  )}
                  {item.date && (
                    <span className="font-mono text-xs font-bold text-[var(--color-clay-muted)]">
                      {item.date}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}