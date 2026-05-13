'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

const contactItems = [
  {
    icon:    Mail,
    label:   'Email',
    value:   'uzairasim2001@outlook.com',
    href:    'mailto:uzairasim2001@outlook.com',
    color:   'hover:border-orange-300 hover:shadow-orange-100',
    iconBg:  'bg-orange-50 text-[var(--color-clay-orange)]',
  },
  {
    icon:    Phone,
    label:   'Phone',
    value:   '+92-336-508-2595',
    href:    'tel:+923365082595',
    color:   'hover:border-green-300 hover:shadow-green-100',
    iconBg:  'bg-green-50 text-green-600',
  },
  {
    icon:    LinkedInIcon,
    label:   'LinkedIn',
    value:   'Connect with me',
    href:    'https://linkedin.com/in/YOUR-LINKEDIN',
    color:   'hover:border-blue-300 hover:shadow-blue-100',
    iconBg:  'bg-blue-50 text-blue-600',
  },
  {
    icon:    MapPin,
    label:   'Location',
    value:   'Islamabad, Pakistan',
    href:    'https://maps.google.com/?q=Islamabad,Pakistan',
    color:   'hover:border-purple-300 hover:shadow-purple-100',
    iconBg:  'bg-purple-50 text-purple-600',
  },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export default function Contact() {
  return (
    <section
      id="contact"
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
            // connect
          </p>
          <div className="flex items-end flex-wrap gap-4">
            <h2 className="
              text-4xl md:text-5xl font-black
              text-[var(--color-clay-navy)] tracking-tight
            ">
              Get In Touch
            </h2>
            <div className="
              hidden md:block flex-1 max-w-xs h-px mb-3 ml-6
              bg-gradient-to-r from-[var(--color-clay-orange)] to-transparent
            " />
          </div>
          <p className="mt-4 text-[var(--color-clay-muted)] font-semibold max-w-xl">
            Open to new opportunities, interesting projects, and good
            conversations about tech. Response time is usually within 24 hours.
          </p>
        </motion.div>

        {/* Two column layout,  contact cards left, CTA right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT,  Contact cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {contactItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.label}
                  variants={cardVariants}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`
                    flex items-center gap-4
                    p-5 rounded-2xl
                    bg-[var(--color-cream-50)]
                    border border-[var(--color-cream-300)]
                    ${item.color}
                    hover:shadow-lg
                    transition-all duration-300
                    group
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-11 h-11 rounded-xl
                    flex items-center justify-center
                    shrink-0
                    ${item.iconBg}
                  `}>
                    <Icon size={20} />
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <p className="
                      font-mono text-xs font-bold uppercase
                      tracking-wider text-[var(--color-clay-muted)]
                      mb-0.5
                    ">
                      {item.label}
                    </p>
                    <p className="
                      text-sm font-bold text-[var(--color-clay-navy)]
                      truncate
                    ">
                      {item.value}
                    </p>
                  </div>

                  {/* Arrow icon,  appears on hover */}
                  <ArrowRight
                    size={16}
                    className="
                      ml-auto shrink-0
                      text-[var(--color-clay-muted)]
                      opacity-0 group-hover:opacity-100
                      -translate-x-2 group-hover:translate-x-0
                      transition-all duration-200
                    "
                  />
                </motion.a>
              )
            })}
          </motion.div>

          {/* RIGHT,  CTA card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              relative p-8 md:p-10
              rounded-3xl overflow-hidden
              bg-[var(--color-clay-navy)]
              text-white
            "
          >
            {/**
             * WHY decorative blobs inside the dark card:
             * The navy card would look flat without them.
             * Subtle orange blobs echo the portfolio's accent color
             * and add depth to an otherwise solid background.
             * pointer-events-none so they never block the text.
             */}
            <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="
                absolute -top-10 -right-10
                w-48 h-48 rounded-full
                bg-[var(--color-clay-orange)] opacity-10 blur-2xl
              " />
              <div className="
                absolute -bottom-10 -left-10
                w-48 h-48 rounded-full
                bg-[var(--color-clay-orange)] opacity-5 blur-2xl
              " />
            </div>

            <div className="relative">
              {/* Status badge */}
              <div className="
                inline-flex items-center gap-2
                bg-white/10 rounded-full
                px-4 py-2 mb-6
              ">
                <span className="
                  w-2 h-2 rounded-full
                  bg-green-400
                  animate-[blink_2s_infinite]
                " />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-green-400">
                  Available for opportunities
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                Let's build something
                <span className="text-[var(--color-clay-orange)]"> great </span>
                together.
              </h3>

              <p className="text-white/70 font-semibold leading-relaxed mb-8">
                Whether it's a full-time role, a freelance project, or just
                a conversation about tech,  I'm always open to connecting
                with the right people.
              </p>

              {/* Email CTA */}
              <a
                href="mailto:uzairasim2001@outlook.com"
                className="
                  inline-flex items-center gap-3
                  bg-[var(--color-clay-orange)]
                  hover:bg-[var(--color-clay-orange-dark)]
                  text-white font-bold
                  px-6 py-3 rounded-full
                  transition-all duration-200
                  hover:scale-105
                  shadow-lg shadow-orange-900/30
                "
              >
                <Mail size={18} />
                Send me an email
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="
            mt-20 pt-8
            border-t border-[var(--color-cream-300)]
            flex flex-col sm:flex-row
            items-center justify-between
            gap-4
          "
        >
          <p className="font-mono text-xs text-[var(--color-clay-muted)] font-bold">
            © 2025 Uzair Asim. Built with Next.js & ☕
          </p>
          <p className="font-mono text-xs text-[var(--color-clay-muted)] font-bold">
            Islamabad, Pakistan 🇵🇰
          </p>
        </motion.div>
      </div>
    </section>
  )
}