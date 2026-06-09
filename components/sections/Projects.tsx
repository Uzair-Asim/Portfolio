'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, GitBranch, Star, X, ChevronRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { IProject } from '@/models/Portfolio'

const PROJECT_GRADIENTS = [
  'from-orange-100 via-amber-50 to-yellow-50',
  'from-blue-50 via-indigo-50 to-purple-50',
  'from-green-50 via-emerald-50 to-teal-50',
  'from-rose-50 via-pink-50 to-fuchsia-50',
  'from-sky-50 via-cyan-50 to-blue-50',
  'from-violet-50 via-purple-50 to-indigo-50',
]

// ── Project Detail Modal ──
function ProjectModal({
  project,
  gradient,
  onClose,
}: {
  project:  IProject
  gradient: string
  onClose:  () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-[var(--color-clay-navy)]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="
          relative w-full max-w-lg
          bg-white rounded-2xl
          border border-[var(--color-cream-300)]
          shadow-2xl overflow-hidden
          max-h-[85vh] flex flex-col
        "
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${gradient} p-6 flex-shrink-0`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{project.emoji}</span>
              <div>
                <h2 className="text-xl font-black text-[var(--color-clay-navy)]">
                  {project.title}
                </h2>
                {project.featured && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="text-[var(--color-clay-orange)] fill-[var(--color-clay-orange)]" />
                    <span className="font-mono text-xs font-bold text-[var(--color-clay-orange)] uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/10 text-[var(--color-clay-muted)] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-3 text-sm font-semibold text-[var(--color-clay-muted)] leading-relaxed">
            {project.description}
          </p>

          {/* Links */}
          <div className="flex gap-2 mt-4">
            {project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--color-clay-navy)] bg-white/70 hover:bg-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <GitBranch size={13} />
                GitHub
              </a>
            )}
            {project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs font-bold text-white bg-[var(--color-clay-orange)] hover:bg-[var(--color-clay-orange-dark)] px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-6">
          {/* All features */}
          {project.features.length > 0 && (
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-3">
                Features
              </h3>
              <ul className="flex flex-col gap-2.5">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-clay-muted)] font-semibold">
                    <span className="text-[var(--color-clay-orange)] mt-0.5 shrink-0 text-xs">→</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          {project.tech.length > 0 && (
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-clay-muted)] mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <Badge key={t} variant="navy">{t}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Tilt Card ──
function TiltCard({
  project,
  index,
  onExpand,
}: {
  project:  IProject
  index:    number
  onExpand: () => void
}) {
  const ref     = useRef<HTMLDivElement>(null)
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8,  8])
  const rotateX = useTransform(springY, [-0.5, 0.5], [ 8, -8])

  const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length]

  /**
   * WHY show only first 3 features on the card:
   * The card is a teaser — enough to show the project has depth
   * without overwhelming the grid. Clicking opens the modal
   * with all features. This keeps the grid scannable.
   */
  const previewFeatures = project.features.slice(0, 3)
  const hasMore         = project.features.length > 3

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' as const }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="
          relative rounded-2xl overflow-hidden
          border border-[var(--color-cream-300)]
          hover:border-[var(--color-clay-orange)]/40
          hover:shadow-2xl hover:shadow-orange-100/60
          transition-shadow duration-300
          cursor-pointer h-full
        "
        onClick={onExpand}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />

        <div className="relative p-7 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{project.emoji}</span>
              <div>
                <h3 className="text-xl font-black text-[var(--color-clay-navy)]">
                  {project.title}
                </h3>
                {project.featured && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="text-[var(--color-clay-orange)] fill-[var(--color-clay-orange)]" />
                    <span className="font-mono text-xs font-bold text-[var(--color-clay-orange)] uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Links — stop propagation so clicking links doesn't open modal */}
            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              {project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/70 hover:bg-white text-[var(--color-clay-navy)] transition-colors"
                >
                  <GitBranch size={16} />
                </a>
              )}
              {project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/70 hover:bg-white text-[var(--color-clay-orange)] transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed font-semibold text-[var(--color-clay-muted)] mb-5">
            {project.description}
          </p>

          {/* Preview features */}
          <ul className="flex flex-col gap-2 mb-4 flex-1">
            {previewFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-clay-muted)] font-semibold">
                <span className="text-[var(--color-clay-orange)] mt-0.5 shrink-0 text-xs">→</span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Show more indicator */}
          {hasMore && (
            <div className="flex items-center gap-1 text-xs font-bold font-mono text-[var(--color-clay-orange)] mb-4">
              <ChevronRight size={12} />
              {project.features.length - 3} more {project.features.length - 3 === 1 ? 'feature' : 'features'}... click to expand
            </div>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/60">
            {project.tech.map(t => (
              <Badge key={t} variant="navy">{t}</Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Section ──
export default function Projects({
  projects,
  githubUrl = '#',
}: {
  projects:  IProject[]
  githubUrl?: string
}) {
  const [expandedProject, setExpandedProject] = useState<{ project: IProject; gradient: string } | null>(null)

  const sorted = [...projects].sort((a, b) => {
    if (a.featured === b.featured) return a.order - b.order
    return a.featured ? -1 : 1
  })

  return (
    <section id="projects" className="py-24 px-6 md:px-12 bg-[var(--color-cream-100)]">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-[var(--color-clay-orange)] mb-3">
            // work
          </p>
          <div className="flex items-end flex-wrap gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-clay-navy)] tracking-tight">
              Projects
            </h2>
            <div className="hidden md:block flex-1 max-w-xs h-px mb-3 ml-6 bg-gradient-to-r from-[var(--color-clay-orange)] to-transparent" />
          </div>
          <p className="mt-4 text-[var(--color-clay-muted)] font-semibold max-w-xl">
            Shipped products that solve real problems — click any card to explore details.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((project, index) => {
            const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length]
            return (
              <TiltCard
                key={project.title}
                project={project}
                index={index}
                onExpand={() => setExpandedProject({ project, gradient })}
              />
            )
          })}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--color-clay-muted)] font-semibold mb-4">
            More projects on GitHub
          </p>
          <Button
            variant="outline"
            size="md"
            onClick={() => window.open(githubUrl, '_blank')}
          >
            <GitBranch size={16} className="mr-2" />
            View GitHub Profile
          </Button>
        </motion.div>
      </div>

      {/* Modal */}
      {expandedProject && (
        <ProjectModal
          project={expandedProject.project}
          gradient={expandedProject.gradient}
          onClose={() => setExpandedProject(null)}
        />
      )}
    </section>
  )
}