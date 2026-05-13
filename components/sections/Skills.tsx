/**
 * WHY 'use client':
 * Framer Motion's whileInView and hover animations need
 * the browser to detect scroll position and mouse events.
 * Server components can't do either of those things.
 */
'use client'

import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'

/**
 * WHY define data outside the component:
 * This data never changes during runtime so there's no reason
 * to recreate it on every render. Keeping it outside means
 * it's created once when the module loads and reused forever.
 *
 * Later in Phase 3 we'll replace this hardcoded array with
 * data fetched from MongoDB — but the component structure
 * stays exactly the same. That's the beauty of separating
 * data from presentation.
 */
const skillCategories = [
  {
    icon: '⚙️',
    title: 'Backend & Languages',
    color: 'from-blue-50 to-blue-100/50',
    borderColor: 'hover:border-blue-200',
    skills: ['C#', '.NET Core', 'ASP.NET MVC', 'Entity Framework', 'REST APIs'],
  },
  {
    icon: '🎨',
    title: 'Frontend',
    color: 'from-orange-50 to-orange-100/50',
    borderColor: 'hover:border-orange-200',
    skills: ['React', 'Angular', 'Vue', 'TypeScript', 'JavaScript', 'Tailwind', 'Bootstrap'],
  },
  {
    icon: '☁️',
    title: 'Cloud & Databases',
    color: 'from-sky-50 to-sky-100/50',
    borderColor: 'hover:border-sky-200',
    skills: ['Azure Blob', 'Azure Functions', 'Cosmos DB', 'SQL Server', 'PostgreSQL', 'MongoDB'],
  },
  {
    icon: '🏗️',
    title: 'Architecture',
    color: 'from-purple-50 to-purple-100/50',
    borderColor: 'hover:border-purple-200',
    skills: ['Microservices', 'Event-Driven', 'RESTful API', 'Cloud Automation', 'Fault-Tolerant'],
  },
  {
    icon: '🛠️',
    title: 'Tools & Platforms',
    color: 'from-green-50 to-green-100/50',
    borderColor: 'hover:border-green-200',
    skills: ['Git', 'GitHub', 'Azure DevOps', 'Postman', 'VS Code', 'Stripe', 'Sanity.io'],
  },
  {
    icon: '🤖',
    title: 'AI & Methodology',
    color: 'from-rose-50 to-rose-100/50',
    borderColor: 'hover:border-rose-200',
    skills: ['Gemini API', 'MS Copilot', 'AI Integration', 'Agile', 'Scrum', 'MVVM'],
  },
]

/**
 * WHY this variant pattern:
 * 'container' with staggerChildren means each child card
 * animates in one after another with a 0.1s delay between them.
 * Without stagger all 6 cards would animate simultaneously —
 * less visually interesting and harder to follow.
 */
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

export default function Skills() {
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
          /**
           * WHY viewport={{ once: true }}:
           * We only want the animation to play once — the first
           * time the section scrolls into view. Without this it
           * replays every time you scroll up and back down,
           * which feels cheap and annoying.
           */
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* Section label */}
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

            {/* Decorative line */}
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
            3 years building across the full stack — from .NET APIs
            to React frontends to Azure cloud infrastructure.
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          /**
           * WHY whileInView here instead of animate:
           * animate triggers immediately on page load even if
           * the element is off-screen. whileInView waits until
           * the element enters the viewport — so the animation
           * only plays when the user actually sees it.
           */
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-5
          "
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              /**
               * WHY whileHover:
               * Subtle lift effect on hover makes cards feel
               * interactive and tactile — like physical cards
               * being picked up. Small details like this are
               * what separate good portfolios from great ones.
               */
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`
                relative p-6
                bg-white rounded-2xl
                border border-[var(--color-cream-300)]
                ${category.borderColor}
                shadow-sm hover:shadow-md
                transition-shadow duration-300
                cursor-default
                overflow-hidden
              `}
            >
              {/* Card background gradient */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${category.color}
                opacity-40 pointer-events-none
              `} />

              {/* Card content */}
              <div className="relative">
                {/* Icon + title */}
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

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}