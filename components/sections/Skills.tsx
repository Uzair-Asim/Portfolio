'use client'

import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import type { ISkillCategory } from '@/models/Portfolio'

/**
 * WHY color and borderColor are derived here not in the schema:
 * These are purely presentational - they're Tailwind classes
 * that control how each card looks. They have nothing to do
 * with the actual skill data. Storing Tailwind classes in a
 * database is an anti-pattern - if you ever change your design
 * system you'd have to update the DB instead of just CSS.
 * We map category titles to colors here in the component
 * where presentation decisions belong.
 */
const CATEGORY_STYLES: Record<string, { color: string; borderColor: string }> = {
  'Backend & Languages': {
    color:       'from-blue-50 to-blue-100/50',
    borderColor: 'hover:border-blue-200',
  },
  'Frontend': {
    color:       'from-orange-50 to-orange-100/50',
    borderColor: 'hover:border-orange-200',
  },
  'Cloud & Databases': {
    color:       'from-sky-50 to-sky-100/50',
    borderColor: 'hover:border-sky-200',
  },
  'Architecture': {
    color:       'from-purple-50 to-purple-100/50',
    borderColor: 'hover:border-purple-200',
  },
  'Tools & Platforms': {
    color:       'from-green-50 to-green-100/50',
    borderColor: 'hover:border-green-200',
  },
  'AI & Methodology': {
    color:       'from-rose-50 to-rose-100/50',
    borderColor: 'hover:border-rose-200',
  },
}

/**
 * WHY a default style fallback:
 * If you add a new skill category in the admin panel with a
 * title that doesn't match the map above, it won't crash —
 * it just gets a neutral gray style. This makes the component
 * resilient to new data without requiring a code change.
 */
const DEFAULT_STYLE = {
  color:       'from-gray-50 to-gray-100/50',
  borderColor: 'hover:border-gray-200',
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export default function Skills({ skills }: { skills: ISkillCategory[] }) {
  return (
    <section
      id="skills"
      className="py-24 px-6 md:px-12"
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
            text-[var(--color-clay-orange)]
            mb-3
          ">
            // expertise
          </p>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="
              text-4xl md:text-5xl font-black
              text-[var(--color-clay-navy)]
              tracking-tight
            ">
              Skills &amp; Stack
            </h2>
            <div className="
              hidden md:block flex-1 max-w-xs
              h-px mb-3 ml-6
              bg-gradient-to-r from-[var(--color-clay-orange)] to-transparent
            " />
          </div>

          <p className="
            mt-4 text-[var(--color-clay-muted)]
            font-semibold max-w-xl
          ">
            3 years building across the full stack - from .NET APIs
            to React frontends to Azure cloud infrastructure.
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-5
          "
        >
          {/**
           * WHY sort by order:
           * MongoDB doesn't guarantee document array order.
           * The order field we defined in the schema lets you
           * control exactly which category appears first, second,
           * etc. from the admin panel.
           */}
          {[...skills]
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              const style = CATEGORY_STYLES[category.title] ?? DEFAULT_STYLE
              return (
                <motion.div
                  key={category.title}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`
                    relative p-6
                    bg-white rounded-2xl
                    border border-[var(--color-cream-300)]
                    ${style.borderColor}
                    shadow-sm hover:shadow-md
                    transition-shadow duration-300
                    cursor-default
                    overflow-hidden
                  `}
                >
                  {/* Card background gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${style.color}
                    opacity-40 pointer-events-none
                  `} />

                  {/* Card content */}
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="
                        font-mono text-xs font-bold
                        uppercase tracking-wider
                        text-[var(--color-clay-navy)]
                      ">
                        {category.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </motion.div>
      </div>
    </section>
  )
}