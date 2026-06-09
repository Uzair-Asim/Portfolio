import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import { getPortfolioData } from '@/lib/data'

/**
 * WHY async:
 * Server components can be async - they await data before
 * rendering. The client never sees this await, only the
 * finished HTML with data already in it.
 */

const Skills          = dynamic(() => import('@/components/sections/Skills'),          { loading: () => <div className="py-24" /> })
const Experience      = dynamic(() => import('@/components/sections/Experience'),      { loading: () => <div className="py-24" /> })
const Achievements    = dynamic(() => import('@/components/sections/Achievements'),    { loading: () => <div className="py-24" /> })
const Projects        = dynamic(() => import('@/components/sections/Projects'),        { loading: () => <div className="py-24" /> })
const Certifications  = dynamic(() => import('@/components/sections/Certifications'), { loading: () => <div className="py-24" /> })
const Contact         = dynamic(() => import('@/components/sections/Contact'),         { loading: () => <div className="py-24" /> })

export default async function Home() {
  const portfolio = await getPortfolioData()

  return (
    <main className="min-h-screen bg-[var(--color-cream-100)]">
      <Navbar
        hasAchievements={!!portfolio?.achievements?.length}
        hasCertifications={!!portfolio?.certifications?.length}
      />
      <Hero           hero={portfolio?.hero                  ?? null} />
      <Skills         skills={portfolio?.skills              ?? []}   />
      <Experience     experience={portfolio?.experience      ?? []}   />
      <Achievements   achievements={portfolio?.achievements  ?? []}   />
      <Projects       projects={portfolio?.projects          ?? []}   />
      <Certifications certifications={portfolio?.certifications ?? []} />
      <Contact        contact={portfolio?.contact            ?? null} />
    </main>
  )
}