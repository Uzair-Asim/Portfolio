'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { MapPin, Mail, ExternalLink } from 'lucide-react'

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const stats = [
  { number: '3+',  label: 'Years Exp'   },
  { number: '80%', label: 'Efficiency↑' },
  { number: '40%', label: 'DB Gain'     },
]

export default function Hero() {
  /**
   * WHY useRef:
   * We need to hold a reference to the Spline app object
   * that persists between renders without triggering a re-render.
   * useState would cause a re-render every time it updates —
   * useRef stores the value silently in the background.
   */
  const splineRef = useRef<any>(null)

  /**
   * WHY this function:
   * Spline calls this when the 3D scene finishes loading.
   * It passes back the splineApp object which gives us
   * programmatic access to every object in the 3D scene.
   * We store it in splineRef so our mouse listener can use it.
   */
  function onSplineLoad(splineApp: any) {
    splineRef.current = splineApp
  }

  useEffect(() => {
    /**
     * WHY global window mousemove listener:
     * Spline's built-in cursor tracking only fires when the
     * mouse is inside the Spline canvas element.
     * By listening on the window instead, we get coordinates
     * from anywhere on the page — navbar, text, buttons, anywhere.
     *
     * WHY lerp (linear interpolation):
     * Without it the head snaps instantly to the cursor position
     * which looks robotic and jarring.
     * Lerp moves from current position toward target by a small
     * fraction each frame — creating smooth, natural lag that
     * makes the character feel alive.
     *
     * WHY requestAnimationFrame:
     * This runs our animation loop in sync with the browser's
     * repaint cycle (~60fps). It's more efficient than setInterval
     * and automatically pauses when the tab is not visible.
     */
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let animFrame: number

    /**
     * ⚠️ IMPORTANT: Replace 'Head' with the exact object name
     * from your Spline scene.
     * How to find it:
     * 1. Open your scene in spline.design editor
     * 2. Click the character's head in the 3D viewport
     * 3. Look at the top of the right panel — that's the name
     * Common names: 'Head', 'head', 'Character_Head', 'Sphere'
     */
    const HEAD_OBJECT_NAME = 'Head'

    /**
     * WHY lerp function:
     * lerp(0, 1, 0.05) returns 0.05
     * lerp(0.05, 1, 0.05) returns 0.097
     * Each frame we get slightly closer to the target.
     * The 0.05 factor controls smoothness:
     * lower = slower/smoother, higher = faster/snappier
     */
    function lerp(start: number, end: number, factor: number) {
      return start + (end - start) * factor
    }

    function handleMouseMove(e: MouseEvent) {
      /**
       * WHY normalize to -1 to 1:
       * Raw pixel coordinates depend on screen size.
       * Normalized values (-1 to 1) work on any screen.
       * 0 = center, -1 = left/top edge, 1 = right/bottom edge
       */
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    function animate() {
      // Smoothly chase the target position
      currentX = lerp(currentX, targetX, 0.05)
      currentY = lerp(currentY, targetY, 0.05)

      if (splineRef.current) {
        const head = splineRef.current.findObjectByName(HEAD_OBJECT_NAME)

        if (head) {
          /**
           * WHY multiply by 0.3 and 0.2:
           * Raw -1 to 1 values rotate the head too far — almost
           * 180 degrees which looks completely broken.
           * 0.3 = about 17 degrees max horizontal rotation
           * 0.2 = about 11 degrees max vertical rotation
           * Less vertical movement looks more natural for a
           * seated character who mostly looks left and right.
           */
          head.rotation.y = currentX * 0.3
          head.rotation.x = currentY * -0.2
        }
      }

      animFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    /**
     * WHY cleanup function:
     * When the component unmounts (user navigates away),
     * we MUST cancel these or they keep running forever —
     * leaking memory and burning CPU in the background.
     * This is one of the most important useEffect patterns.
     */
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrame)
    }
  }, [])
  /**
   * WHY empty dependency array []:
   * We only want this effect to run once when the component
   * mounts — not on every render. Empty array = run once.
   * If we omitted it, it would re-run on every render and
   * add a new event listener each time, causing bugs.
   */

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background decorative circles */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-clay-orange)] opacity-[0.06] blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-[var(--color-clay-navy)] opacity-[0.04] blur-3xl" />
      </div>

      {/* Main content grid */}
      <div className="
        relative w-full max-w-7xl mx-auto
        px-6 md:px-12
        grid grid-cols-1 lg:grid-cols-2
        gap-12 lg:gap-6
        items-center
      ">

        {/* LEFT: Text content */}
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
              px-4 py-2 text-sm font-bold
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
              font-black leading-[1.1] tracking-tight
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
            <p className="text-xl font-bold text-[var(--color-clay-muted)]">
              Full-Stack Engineer — .NET · Azure · React
            </p>
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-clay-muted)]">
              <MapPin size={14} />
              <span>Islamabad, Pakistan</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-[var(--color-clay-muted)] max-w-md"
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
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
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
          <motion.div variants={itemVariants} className="flex gap-4 pt-2">
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
                <span className="text-2xl font-black text-[var(--color-clay-navy)]">
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

        {/* RIGHT: Spline 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="
            relative
            h-[480px] lg:h-[600px]
            w-full
            rounded-3xl
          "
        >
          <Spline
            scene="https://prod.spline.design/lEFhySrerrKDJmTY/scene.splinecode"
            onLoad={onSplineLoad}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          />

          {/* Gradient fade at bottom — blends scene into page */}
          <div className="
            absolute bottom-0 left-0 right-0 h-24
            bg-gradient-to-t from-[var(--color-cream-100)] to-transparent
            pointer-events-none
          " />
        </motion.div>
      </div>

      {/* Scroll indicator */}
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