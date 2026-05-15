'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { MapPin, Mail, ExternalLink } from 'lucide-react'
import type { IHero } from '@/models/Portfolio'

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

/**
 * WHY fallback stats:
 * If the database is unreachable or hero is null,
 * we still show something meaningful rather than
 * an empty stats row. These match your seed data
 * so in practice the fallback is never visible.
 */
const FALLBACK_STATS = [
  { number: '3+',  label: 'Years Exp'   },
  { number: '80%', label: 'Efficiency↑' },
  { number: '40%', label: 'DB Gain'     },
]

export default function Hero({ hero }: { hero: IHero | null }) {
  const splineRef       = useRef<any>(null)
  const animFrameRef    = useRef<number>(0)
  const lastFrameRef    = useRef<number>(0)
  const isHoveredRef    = useRef<boolean>(false)
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isHovered,      setIsHovered]      = useState(false)
  const [splineMounted,  setSplineMounted]  = useState(false)
  const [isSplineLoaded, setIsSplineLoaded] = useState(false)

  /**
   * WHY derive these from props with fallbacks:
   * If hero is null (DB unreachable) the page still renders
   * with sensible defaults instead of crashing or showing
   * empty strings. Always code defensively around DB calls.
   */
  const stats    = hero?.stats    ?? FALLBACK_STATS
  const title    = hero?.title    ?? 'Full-Stack Engineer — .NET · Azure · React'
  const location = hero?.location ?? 'Islamabad, Pakistan'
  const desc     = hero?.description ?? 'Full-Stack Developer based in Islamabad, Pakistan.'
  const available = hero?.available ?? true

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
    unmountTimerRef.current = setTimeout(() => {
      setSplineMounted(false)
      splineRef.current = null
      setIsSplineLoaded(false)
    }, 400)
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
          {/* Available badge — driven by DB */}
          <motion.div variants={itemVariants}>
            <span className="
              inline-flex items-center gap-2
              bg-white rounded-full px-4 py-2
              text-sm font-bold text-[var(--color-clay-orange)]
              shadow-md shadow-orange-100
            ">
              <span className="
                w-2 h-2 rounded-full
                bg-[var(--color-clay-orange)]
                animate-[blink_2s_infinite]
              " />
              {available ? 'Available for hire' : 'Open to opportunities'}
            </span>
          </motion.div>

          {/* Name — kept hardcoded intentionally */}
          <motion.div variants={itemVariants}>
            <h1 className="
              text-5xl md:text-6xl lg:text-7xl
              font-black leading-[1.1] tracking-tight
              text-[var(--color-clay-navy)]
            ">
              Hi, my<br />
              name is{' '}
              <span className="text-[var(--color-clay-orange)]">
                {hero?.name ?? 'Uzair'}.
              </span>
            </h1>
          </motion.div>

          {/* Title + location — driven by DB */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <p className="text-xl font-bold text-[var(--color-clay-muted)]">
              {title}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-clay-muted)]">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          </motion.div>

          {/* Description — driven by DB */}
          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-[var(--color-clay-muted)] max-w-md"
          >
            {desc}
          </motion.p>

          {/* CTA buttons — static, no need for DB */}
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

          {/* Stats — driven by DB */}
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

        {/* RIGHT: Scene container — completely untouched */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative h-[480px] lg:h-[600px] w-full rounded-3xl"
        >
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
              alt="3D desk setup"
              fill
              className="object-cover object-center scale-121"
              priority
            />
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