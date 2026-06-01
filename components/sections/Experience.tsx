'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { IExperience } from '@/models/Portfolio'

const cardVariants = {
  hidden:  { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function Experience({ experience }: { experience: IExperience[] }) {
  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-12 bg-white"
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
            // career
          </p>
          <div className="flex items-end flex-wrap gap-4">
            <h2 className="
              text-4xl md:text-5xl font-black
              text-[var(--color-clay-navy)] tracking-tight
            ">
              Experience
            </h2>
            <div className="
              hidden md:block flex-1 max-w-xs h-px mb-3 ml-6
              bg-gradient-to-r from-[var(--color-clay-orange)] to-transparent
            " />
          </div>
          <p className="mt-4 text-[var(--color-clay-muted)] font-semibold max-w-xl">
            3 years of shipping production software across cloud automation,
            AI integration, and full-stack web development.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="
            absolute left-0 md:left-8
            top-0 bottom-0 w-px
            bg-gradient-to-b from-[var(--color-clay-orange)] via-[var(--color-clay-orange)]/50 to-transparent
          " />

          <div className="flex flex-col gap-10 pl-8 md:pl-24">
            {[...experience]
              .sort((a, b) => a.order - b.order)
              .map((exp, index) => (
                <motion.div
                  key={exp.company}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="
                    absolute -left-[2.15rem] md:-left-[4.41rem]
                    top-6
                    flex items-center justify-center
                  ">
                    {exp.current ? (
                      <div className="relative flex items-center justify-center">
                        <div className="
                          absolute w-5 h-5 rounded-full
                          bg-[var(--color-clay-orange)] opacity-30
                          animate-ping
                        " />
                        <div className="
                          w-3.5 h-3.5 rounded-full
                          bg-[var(--color-clay-orange)]
                          border-2 border-white
                          shadow-md
                        " />
                      </div>
                    ) : (
                      <div className="
                        w-3.5 h-3.5 rounded-full
                        bg-[var(--color-cream-300)]
                        border-2 border-[var(--color-clay-muted)]/30
                      " />
                    )}
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="
                      p-6 md:p-8
                      bg-[var(--color-cream-50)]
                      rounded-2xl
                      border border-[var(--color-cream-300)]
                      hover:border-[var(--color-clay-orange)]/30
                      hover:shadow-lg hover:shadow-orange-100/50
                      transition-all duration-300
                    "
                  >
                    {/* Card header */}
                    <div className="
                      flex flex-col sm:flex-row
                      sm:items-start sm:justify-between
                      gap-3 mb-5
                    ">
                      <div>
                        <h3 className="
                          text-xl font-black
                          text-[var(--color-clay-navy)]
                          mb-1
                        ">
                          {exp.company}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Briefcase
                            size={13}
                            className="text-[var(--color-clay-orange)]"
                          />
                          <span className="
                            font-mono text-sm font-bold
                            text-[var(--color-clay-orange)]
                          ">
                            {exp.role}
                          </span>
                          <Badge variant="default">
                            {exp.type}
                          </Badge>
                          {exp.current && (
                            <Badge variant="orange">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-sm text-[var(--color-clay-muted)] font-semibold">
                          <Calendar size={13} />
                          <span>{exp.period}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1.5 text-sm text-[var(--color-clay-muted)] font-semibold">
                            <MapPin size={13} />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bullet points */}
                    <ul className="flex flex-col gap-2.5 mb-5">
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-[var(--color-clay-muted)] font-semibold leading-relaxed"
                        >
                          <span className="
                            text-[var(--color-clay-orange)]
                            mt-0.5 shrink-0 text-xs
                          ">
                            ▸
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-cream-300)]">
                      {exp.tech.map((t) => (
                        <Badge key={t} variant="navy">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}