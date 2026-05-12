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
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'

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