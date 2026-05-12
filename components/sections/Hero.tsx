/**
 * WHY 'use client': This component uses:
 * 1. Framer Motion animations (need browser to run)
 * 2. Spline 3D scene (needs WebGL, browser only)
 * 3. Dynamic import (we control when JS loads)
 *
 * WHY dynamic import for Spline:
 * Spline is a heavy 3D library. If we import it normally it
 * blocks the entire page from loading until Spline downloads.
 * dynamic() with ssr:false means:
 * - Server renders the page immediately without waiting for Spline
 * - Spline loads in the browser after the page is visible
 * - User sees your name and text instantly, 3D loads after
 * This is called "code splitting" — a key performance technique.
 */
'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { MapPin, Mail, ExternalLink } from 'lucide-react'

/**
 * WHY ssr: false for Spline:
 * Spline uses WebGL which only exists in the browser.
 * If Next.js tries to render it on the server it crashes
 * because the server has no WebGL context.
 * ssr: false tells Next.js "only render this in the browser".
 */
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-[var(--color-clay-orange)] border-t-transparent animate-spin" />
        <p className="font-mono text-sm text-[var(--color-clay-muted)]">
          Loading 3D scene...
        </p>
      </div>
    </div>
  ),
})

/**
 * WHY define animation variants outside the component:
 * If defined inside, they get recreated on every render.
 * Outside means they're created once and reused.
 *
 * 'container' staggers children — each child animates
 * after the previous one with a 0.15s delay.
 * This creates the cascading fade-up effect.
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const stats = [
  { number: '3+',   label: 'Years Exp'   },
  { number: '80%',  label: 'Efficiency↑' },
  { number: '40%',  label: 'DB Gain'     },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative min-h-screen
        flex items-center
        overflow-hidden
        pt-20
      "
    >
      {/* ── Background decorative circles ── */}
      {/**
       * WHY: Subtle background shapes add depth to the
       * flat cream background without distracting from content.
       * pointer-events-none means they never block clicks.
       * aria-hidden means screen readers skip them.
       */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="
          absolute -top-40 -right-40
          w-96 h-96 rounded-full
          bg-[var(--color-clay-orange)]
          opacity-[0.06] blur-3xl
        " />
        <div className="
          absolute top-1/2 -left-20
          w-72 h-72 rounded-full
          bg-[var(--color-clay-navy)]
          opacity-[0.04] blur-3xl
        " />
      </div>

      {/* ── Main content ── */}
      <div className="
        relative w-full max-w-7xl mx-auto
        px-6 md:px-12
        grid grid-cols-1 lg:grid-cols-2
        gap-12 lg:gap-6
        items-center
      ">

        {/* ── LEFT: Text content ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Available badge */}
          <motion.div variants={itemVariants}>
            <span className="
              inline-flex items-center gap-2
              bg-white rounded-full
              px-4 py-2
              text-sm font-bold
              text-[var(--color-clay-orange)]
              shadow-md shadow-orange-100
            ">
              <span className="
                w-2 h-2 rounded-full
                bg-[var(--color-clay-orange)]
                animate-[blink_2s_infinite]
              " />
              Available for hire
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants}>
            <h1 className="
              text-5xl md:text-6xl lg:text-7xl
              font-black leading-[1.1]
              tracking-tight
              text-[var(--color-clay-navy)]
            ">
              Hi, my<br />
              name is{' '}
              <span className="text-[var(--color-clay-orange)]">
                Uzair.
              </span>
            </h1>
          </motion.div>

          {/* Title + location */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <p className="
              text-xl font-bold
              text-[var(--color-clay-muted)]
            ">
              Full Stack Engineer  .NET · Azure · React
            </p>
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-clay-muted)]">
              <MapPin size={14} />
              <span>Islamabad, Pakistan</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="
              text-base leading-relaxed
              text-[var(--color-clay-muted)]
              max-w-md
            "
          >
            I build scalable full-stack applications with .NET and Azure,
            and craft intuitive user experiences with modern JS frameworks.
            Currently at{' '}
            <span className="font-bold text-[var(--color-clay-navy)]">
              XtremeLabs LLC
            </span>
            , automating cloud infrastructure and shipping AI-powered tools.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <Mail size={18} className="mr-2" />
              Get in touch
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() =>
                document
                  .getElementById('projects')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ExternalLink size={18} className="mr-2" />
              View Projects
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex gap-4 pt-2"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                  flex flex-col items-center
                  bg-white rounded-2xl
                  px-5 py-4
                  shadow-md shadow-orange-100/50
                  min-w-[80px]
                "
              >
                <span className="
                  text-2xl font-black
                  text-[var(--color-clay-navy)]
                ">
                  {stat.number}
                </span>
                <span className="
                  text-xs font-bold uppercase tracking-wide
                  text-[var(--color-clay-muted)]
                  mt-0.5 text-center
                ">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: 3D Spline Scene ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="
            relative
            h-[480px] lg:h-[600px]
            w-full
            rounded-3xl
            overflow-hidden
          "
        >
          {/**
           * WHY this specific Spline URL:
           * This is a public clay-style developer scene from
           * Spline's community. We'll replace this URL with
           * your own custom scene in a later step once you
           * create your Spline account and customize it.
           * For now it proves the integration works.
           */}
          {/* Temporary placeholder until Spline scene is set up */}
          <div className="w-full h-full bg-[var(--color-cream-200)] rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">👨‍💻</div>
              <Spline scene="https://prod.spline.design/lEFhySrerrKDJmTY/scene.splinecode"/>
            </div>
          </div>

          {/* Gradient fade at bottom so scene blends into page */}
          <div className="
            absolute bottom-0 left-0 right-0 h-24
            bg-gradient-to-t from-[var(--color-cream-100)] to-transparent
            pointer-events-none
          " />
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="
          absolute bottom-8 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-2
          text-[var(--color-clay-muted)]
        "
      >
        <span className="text-xs font-mono font-bold uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border-2 border-[var(--color-clay-muted)] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[var(--color-clay-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  )
}