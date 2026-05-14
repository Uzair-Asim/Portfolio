/**
 * WHY no 'use client' here: This is a Server Component.
 * It renders on the server and sends complete HTML to the browser.
 * Each section component handles its own client/server decision.
 *
 * WHY import each section separately: Separation of concerns.
 * Each section is self-contained. If Skills breaks, Hero still works.
 * It also makes the code readable — you can see the page structure
 * at a glance just by reading this file.
 */

import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'

/**
 * WHY dynamic import for sections below the fold:
 * The user can't see Skills, Experience, Projects, or Contact
 * on page load — they require scrolling to reach.
 * Loading them lazily means the browser focuses all resources
 * on the Hero section first (the most important part).
 * Each section loads only when the user is about to scroll to it.
 * This is called "below the fold lazy loading" and it's one of
 * the most impactful performance techniques for long pages.
 */
const Skills = dynamic(() => import('@/components/sections/Skills'), {
  loading: () => <div className="py-24" />,
})

const Experience = dynamic(() => import('@/components/sections/Experience'), {
  loading: () => <div className="py-24" />,
})

const Projects = dynamic(() => import('@/components/sections/Projects'), {
  loading: () => <div className="py-24" />,
})

const Contact = dynamic(() => import('@/components/sections/Contact'), {
  loading: () => <div className="py-24" />,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-cream-100)]">
      <Navbar />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </main>
  )
}