'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, GitBranch, Star } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const projects = [
  {
    title:       'Picture Pulse',
    emoji:       '📌',
    description: 'A social networking web app for sharing and organizing images — think Pinterest reimagined with smart recommendations.',
    tech:        ['ReactJS', 'Node.js', 'Google OAuth', 'MongoDB'],
    features: [
      'Google OAuth for secure authentication',
      'Search & filtering for content discoverability',
      'Recommendation system for similar pin suggestions',
    ],
    liveUrl:  '#',
    githubUrl: '#',
    featured:  true,
    gradient: 'from-orange-100 via-amber-50 to-yellow-50',
  },
  {
    title:       'PRIME',
    emoji:       '🛒',
    description: 'A full-featured eCommerce platform enabling store customization, product management, and secure payments.',
    tech:        ['MongoDB', 'Express', 'React', 'Node.js', 'Stripe'],
    features: [
      'Encryption-based auth with secure token management',
      'Store customization with products, text & image support',
      'Stripe integration for seamless payment processing',
      'Responsive UI with advanced search & filtering',
    ],
    liveUrl:   '#',
    githubUrl: '#',
    featured:  true,
    gradient:  'from-blue-50 via-indigo-50 to-purple-50',
  },
]

/**
 * WHY a separate TiltCard component:
 * The 3D tilt logic (mouse tracking, spring physics, transforms)
 * is complex enough to deserve its own component.
 * If we put it inline in the map() it would be hard to read
 * and impossible to reuse elsewhere.
 *
 * This is the single responsibility principle — each component
 * does one thing well.
 */
function TiltCard({ project, index }: {
  project: typeof projects[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  /**
   * WHY useMotionValue:
   * Like useState but for animation values. The difference is
   * that updating a MotionValue does NOT cause a React re-render.
   * This is critical for performance — mouse move fires 60+ times
   * per second and we can't re-render the whole component each time.
   * MotionValue updates go directly to the DOM via Framer Motion.
   */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  /**
   * WHY useSpring:
   * Spring physics makes the tilt feel physical and natural.
   * Without spring the card snaps instantly to follow the mouse.
   * With spring it lags slightly behind like a real physical object
   * with mass and momentum.
   *
   * stiffness: how quickly it reaches the target (higher = faster)
   * damping: how much it oscillates before settling (higher = less bounce)
   */
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  /**
   * WHY useTransform:
   * Converts the raw mouse position values into rotation degrees.
   * [-0.5, 0.5] input range maps to [-8, 8] degree output range.
   * So moving the mouse from left to right rotates the card
   * from -8 degrees to +8 degrees.
   * Note X mouse movement controls Y rotation and vice versa —
   * that's how 3D perspective works.
   */
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8])
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    /**
     * WHY normalize to -0.5 to 0.5:
     * We calculate where the mouse is within the card as a
     * fraction. 0 = left/top edge, 1 = right/bottom edge.
     * Subtracting 0.5 centers it so 0 = middle of card.
     * This means the card tilts toward the mouse position
     * relative to the card center, not the page.
     */
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  function handleMouseLeave() {
    /**
     * WHY set back to 0:
     * When the mouse leaves we reset to flat (no tilt).
     * The spring physics handles the smooth transition back.
     */
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' as const }}
      /**
       * WHY perspective style on the outer div:
       * CSS perspective defines the "camera distance" from the card.
       * Lower values = more dramatic tilt effect.
       * Higher values = subtler tilt.
       * 1000px is a good balance for a card this size.
       * Perspective must be on the PARENT of the element being
       * transformed — not on the element itself.
       */
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="
          relative rounded-2xl overflow-hidden
          border border-[var(--color-cream-300)]
          hover:border-[var(--color-clay-orange)]/40
          hover:shadow-2xl hover:shadow-orange-100/60
          transition-shadow duration-300
          cursor-default
          h-full
        "
      >
        {/* Card gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`} />

        {/* Card content */}
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

            {/* Links */}
            <div className="flex gap-2">
              {project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2 rounded-lg
                    bg-white/70 hover:bg-white
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
                    p-2 rounded-lg
                    bg-white/70 hover:bg-white
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
          <p className="
            text-sm leading-relaxed font-semibold
            text-[var(--color-clay-muted)]
            mb-5
          ">
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

export default function Projects() {
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
          {projects.map((project, index) => (
            <TiltCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* More projects note */}
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
            onClick={() => window.open('https://github.com/YOUR-USERNAME', '_blank')}
          >
            <GitBranch size={16} className="mr-2" />
            View GitHub Profile
          </Button>
        </motion.div>
      </div>
    </section>
  )
}