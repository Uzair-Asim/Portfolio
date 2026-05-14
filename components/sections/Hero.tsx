'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { MapPin, Mail, ExternalLink } from 'lucide-react'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--color-clay-orange)] border-t-transparent animate-spin" />
        <p className="font-mono text-sm text-[var(--color-clay-muted)]">
          Loading 3D scene...
        </p>
      </div>
    </div>
  ),
})

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
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
  const splineRef       = useRef<any>(null)
  const animFrameRef    = useRef<number>(0)
  const lastFrameRef    = useRef<number>(0)
  const isHoveredRef    = useRef<boolean>(false)
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isHovered,      setIsHovered]      = useState(false)
  const [splineMounted,  setSplineMounted]  = useState(false)
  const [isSplineLoaded, setIsSplineLoaded] = useState(false)

  /**
   * WHY delayed unmount:
   * When hover ends we want to:
   * 1. Immediately fade the image back in (CSS transition)
   * 2. Wait for the fade to finish (350ms)
   * 3. THEN fully unmount Spline from the DOM
   *
   * This gives the user a smooth visual transition while
   * still completely freeing the GPU after hover ends.
   * No more background WebGL rendering draining resources.
   *
   * WHY clear the timer on hover-in:
   * If the user quickly moves out then back in, we cancel
   * the pending unmount so Spline stays mounted and ready.
   * This prevents a flicker where Spline unmounts and
   * immediately needs to remount again.
   */
  function handleMouseEnter() {
    isHoveredRef.current = true
    if (unmountTimerRef.current) {
      clearTimeout(unmountTimerRef.current)
      unmountTimerRef.current = null
    }
    setIsHovered(true)
    setSplineMounted(true)
  }

  function handleMouseLeave() {
    isHoveredRef.current = false
    setIsHovered(false)

    // Wait for fade animation to finish, then fully unmount Spline
    unmountTimerRef.current = setTimeout(() => {
      setSplineMounted(false)
      /**
       * WHY also clear splineRef:
       * Once unmounted the Spline app object is invalid.
       * Clearing the ref prevents the animation loop from
       * trying to call methods on a destroyed scene.
       */
      splineRef.current = null
      setIsSplineLoaded(false)
    }, 400)
    /**
     * WHY 400ms:
     * Our CSS fade transition is 350ms. 400ms gives it
     * a tiny buffer to fully complete before we remove
     * the element from the DOM. If we unmount too early
     * the fade gets cut off and looks like a glitch.
     */
  }

  function onSplineLoad(splineApp: any) {
    splineRef.current = splineApp
    setIsSplineLoaded(true)
  }

  const startTracking = useCallback(() => {
    let targetX  = 0
    let targetY  = 0
    let currentX = 0
    let currentY = 0

    const HEAD_OBJECT_NAME = 'Head'

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function handleMouseMove(e: MouseEvent) {
      const now = Date.now()
      if (now - lastFrameRef.current < 16) return
      lastFrameRef.current = now
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    function animate() {
      if (!isHoveredRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        return
      }
      currentX = lerp(currentX, targetX, 0.05)
      currentY = lerp(currentY, targetY, 0.05)

      if (splineRef.current) {
        const head = splineRef.current.findObjectByName(HEAD_OBJECT_NAME)
        if (head) {
          head.rotation.y = currentX * 0.3
          head.rotation.x = currentY * -0.2
        }
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isHovered || !isSplineLoaded) return
    const cleanup = startTracking()
    return () => cleanup?.()
  }, [isHovered, isSplineLoaded, startTracking])

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background decorative circles */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-clay-orange)] opacity-[0.06] blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-[var(--color-clay-navy)] opacity-[0.04] blur-3xl" />
      </div>

      <div className="
        relative w-full max-w-7xl mx-auto
        px-6 md:px-12
        grid grid-cols-1 lg:grid-cols-2
        gap-12 lg:gap-6
        items-center
      ">
        {/* LEFT: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <span className="
              inline-flex items-center gap-2
              bg-white rounded-full px-4 py-2
              text-sm font-bold text-[var(--color-clay-orange)]
              shadow-md shadow-orange-100
            ">
              <span className="w-2 h-2 rounded-full bg-[var(--color-clay-orange)] animate-[blink_2s_infinite]" />
              Available for hire
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="
              text-5xl md:text-6xl lg:text-7xl
              font-black leading-[1.1] tracking-tight
              text-[var(--color-clay-navy)]
            ">
              Hi, my<br />
              name is{' '}
              <span className="text-[var(--color-clay-orange)]">Uzair.</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <p className="text-xl font-bold text-[var(--color-clay-muted)]">
              Full Stack Engineer .NET · Azure · React
            </p>
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-clay-muted)]">
              <MapPin size={14} />
              <span>Islamabad, Pakistan</span>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-[var(--color-clay-muted)] max-w-md"
          >
            I build scalable full-stack applications with .NET and Azure,
            and craft intuitive user experiences with modern JS frameworks.
            Currently at{' '}
            <span className="font-bold text-[var(--color-clay-navy)]">XtremeLabs LLC</span>
            , automating cloud infrastructure and shipping AI-powered tools.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail size={18} className="mr-2" />
              Get in touch
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ExternalLink size={18} className="mr-2" />
              View Projects
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 pt-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                  flex flex-col items-center bg-white
                  rounded-2xl px-5 py-4
                  shadow-md shadow-orange-100/50 min-w-[80px]
                "
              >
                <span className="text-2xl font-black text-[var(--color-clay-navy)]">
                  {stat.number}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-clay-muted)] mt-0.5 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT: Scene container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative h-[480px] lg:h-[600px] w-full rounded-3xl"
        >
          {/* LAYER 1 — Static PNG — always in DOM */}
          <motion.div
            animate={{ opacity: isHovered && isSplineLoaded ? 0 : 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              pointerEvents: isHovered && isSplineLoaded ? 'none' : 'auto',
              zIndex: 1,
            }}
          >
            <Image
              src="/images/desk-scene.png"
              alt="Uzair's 3D desk setup"
              fill
              className="object-cover object-center scale-121"
              priority
            />
            {/* Always-visible hover hint */}
            <div className="
              absolute inset-0 flex items-end
              justify-center pb-6 pointer-events-none
            ">
              <span className="
                font-mono text-xs font-bold
                text-[var(--color-clay-navy)]/70
                bg-white/80 backdrop-blur-sm
                px-3 py-1.5 rounded-full shadow-sm
              ">
                Hover to interact ✦
              </span>
            </div>
          </motion.div>

          {/**
           * LAYER 2 — Spline
           * Only mounted while hovered (or fading out).
           * Fully removed from DOM after 400ms delay.
           * GPU is completely free when not hovered.
           */}
          {splineMounted && (
            <motion.div
              animate={{ opacity: isHovered && isSplineLoaded ? 1 : 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{
                pointerEvents: isHovered && isSplineLoaded ? 'auto' : 'none',
                zIndex: 2,
              }}
            >
              <Spline
                scene="https://prod.spline.design/lEFhySrerrKDJmTY/scene.splinecode"
                onLoad={onSplineLoad}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </motion.div>
          )}

          {/* Gradient — always on top */}
          <div className="
            absolute bottom-0 left-0 right-0 h-24
            bg-gradient-to-t from-[var(--color-cream-100)] to-transparent
            pointer-events-none z-10
          " />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-clay-muted)]"
      >
        <span className="text-xs font-mono font-bold uppercase tracking-widest">Scroll</span>
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