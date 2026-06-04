'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, GitBranch, Star } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { IProject } from '@/models/Portfolio'

/**
 * WHY gradient is derived here not stored in DB:
 * Same reasoning as Skills — Tailwind classes are
 * presentational, not data. We cycle through a palette
 * based on the project's order index so each card
 * automatically gets a distinct color without storing
 * CSS in the database.
 */
const PROJECT_GRADIENTS = [
  'from-orange-100 via-amber-50 to-yellow-50',
  'from-blue-50 via-indigo-50 to-purple-50',
  'from-green-50 via-emerald-50 to-teal-50',
  'from-rose-50 via-pink-50 to-fuchsia-50',
  'from-sky-50 via-cyan-50 to-blue-50',
  'from-violet-50 via-purple-50 to-indigo-50',
]

function TiltCard({ project, index }: {
  project: IProject
  index:   number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX  = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY  = useSpring(mouseY, { stiffness: 300, damping: 30 })
  const rotateY  = useTransform(springX, [-0.5, 0.5], [-8,  8])
  const rotateX  = useTransform(springY, [-0.5, 0.5], [ 8, -8])

  /**
   * WHY index % PROJECT_GRADIENTS.length:
   * Cycles through the gradient palette regardless of how
   * many projects exist. Project 0 gets gradient 0,
   * project 6 wraps back to gradient 0, etc.
   * Adding a 7th project in the admin panel automatically
   * gets a color — no code change needed.
   */
  const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length]

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
          cursor-default h-full
        "
      >
        {/* Card gradient */}
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

            {/* Links — only shown if URL is not placeholder */}
            <div className="flex gap-2">
              {project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2 rounded-lg bg-white/70 hover:bg-white
                    text-[var(--color-clay-navy)]
                    transition-colors duration-200
                  "
                >
                  <GitBranch size={16} />
                </a>
              )}
              {project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2 rounded-lg bg-white/70 hover:bg-white
                    text-[var(--color-clay-orange)]
                    transition-colors duration-200
                  "
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

          {/* Features */}
          <ul className="flex flex-col gap-2 mb-6 flex-1">
            {project.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-[var(--color-clay-muted)] font-semibold"
              >
                <span className="text-[var(--color-clay-orange)] mt-0.5 shrink-0 text-xs">
                  →
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/60">
            {project.tech.map((t) => (
              <Badge key={t} variant="navy">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects({ projects, githubUrl = '#'}: { projects: IProject[]; githubUrl?: string }) {
  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-12 bg-[var(--color-cream-100)]"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="
            font-mono text-sm font-bold uppercase tracking-widest
            text-[var(--color-clay-orange)] mb-3
          ">
            // work
          </p>
          <div className="flex items-end flex-wrap gap-4">
            <h2 className="
              text-4xl md:text-5xl font-black
              text-[var(--color-clay-navy)] tracking-tight
            ">
              Projects
            </h2>
            <div className="
              hidden md:block flex-1 max-w-xs h-px mb-3 ml-6
              bg-gradient-to-r from-[var(--color-clay-orange)] to-transparent
            " />
          </div>
          <p className="mt-4 text-[var(--color-clay-muted)] font-semibold max-w-xl">
            Shipped products that solve real problems — from social platforms
            to eCommerce systems with payment processing.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...projects]
            .sort((a, b) => {
              if (a.featured === b.featured) return a.order - b.order
              return a.featured ? -1 : 1
            })
            .map((project, index) => (
              <TiltCard key={project.title} project={project} index={index} />
            ))}
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
    </section>
  )
}