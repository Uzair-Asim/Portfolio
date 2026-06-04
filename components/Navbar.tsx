/**
 * WHY 'use client': The navbar needs to track scroll position
 * to add a background when the user scrolls down. Scroll events
 * only exist in the browser, not on the server. So this must
 * be a client component.
 *
 * WHY useEffect + useState for scroll: We listen to the window
 * scroll event and update a boolean that controls whether the
 * navbar has a solid background or is transparent.
 */
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from './ui/Button'

/**
 * WHY static base links separate from conditional links:
 * The achievements and certifications links only appear when
 * those sections have content. Keeping the base links static
 * and conditionally appending the rest makes the logic clear
 * and easy to extend — adding a new conditional section is
 * just one more prop and one more push() call.
 */
const BASE_LINKS = [
  { label: 'About',      href: '#hero'       },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
]

const CONTACT_LINK = { label: 'Contact', href: '#contact' }

interface NavbarProps {
  hasAchievements?:   boolean
  hasCertifications?: boolean
}

export default function Navbar({
  hasAchievements   = false,
  hasCertifications = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    /**
     * WHY: We add a scroll listener when the component mounts.
     * When scroll position goes past 20px we set scrolled=true
     * which adds a white background to the navbar.
     * The cleanup function removes the listener when the
     * component unmounts to prevent memory leaks.
     */
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * WHY build navLinks at render time not module level:
   * The conditional links depend on props which aren't
   * available at module load time. Building the array
   * inside the component ensures it always reflects the
   * current prop values. It's a tiny array so the cost
   * of rebuilding it on each render is negligible.
   */
  const navLinks = [
    ...BASE_LINKS,
    ...(hasAchievements   ? [{ label: 'Achievements',    href: '#achievements'    }] : []),
    ...(hasCertifications ? [{ label: 'Certifications',  href: '#certifications'  }] : []),
    CONTACT_LINK,
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-6 md:px-12 py-4
        transition-all duration-300
        ${scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
        }
      `}
    >
      {/* Logo / Name */}
      <Link
        href="/"
        className="flex items-center gap-2 font-mono font-bold text-[var(--color-clay-navy)]"
      >
        <span className="w-9 h-9 rounded-xl bg-[var(--color-clay-navy)] text-white flex items-center justify-center text-sm">
          {'</>'}
        </span>
        <span className="hidden sm:block text-sm">uzair.dev</span>
      </Link>

      {/* Nav links — hidden on mobile */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="
                text-sm font-bold text-[var(--color-clay-muted)]
                hover:text-[var(--color-clay-orange)]
                transition-colors duration-200
              "
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        size="sm"
        onClick={() => {
          document.getElementById('contact')?.scrollIntoView({
            behavior: 'smooth'
          })
        }}
      >
        Hire Me
      </Button>
    </motion.nav>
  )
}