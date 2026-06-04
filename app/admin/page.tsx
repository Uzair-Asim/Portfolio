import { auth }            from '@/lib/auth'
import { getPortfolioData } from '@/lib/data'
import Link                from 'next/link'

/**
 * WHY show section cards with item counts:
 * The dashboard gives you a bird's-eye view of your content.
 * Seeing "6 skills categories" or "3 experience entries"
 * tells you at a glance if something is missing without
 * having to open each editor.
 */
export default async function AdminDashboard() {
  const [session, portfolio] = await Promise.all([
    auth(),
    getPortfolioData(),
  ])

  const sections = [
    {
      title:  'Hero',
      href:   '/admin/hero',
      icon:   '👋',
      desc:   'Name, title, description, availability, stats',
      count:  null,
    },
    {
      title:  'Skills',
      href:   '/admin/skills',
      icon:   '⚙️',
      desc:   'Skill categories and individual skills',
      count:  portfolio?.skills?.length ?? 0,
      unit:   'categories',
    },
    {
      title:  'Experience',
      href:   '/admin/experience',
      icon:   '💼',
      desc:   'Work history, roles, bullets, tech stack',
      count:  portfolio?.experience?.length ?? 0,
      unit:   'roles',
    },
    {
      title:  'Projects',
      href:   '/admin/projects',
      icon:   '🚀',
      desc:   'Project cards, links, features, tech',
      count:  portfolio?.projects?.length ?? 0,
      unit:   'projects',
    },
    {
      title: 'Achievements & Certifications',
      href:  '/admin/achievements',
      icon:  '🏆',
      desc:  'Key achievements and certifications',
      count: (portfolio?.achievements?.length ?? 0) + (portfolio?.certifications?.length ?? 0),
      unit:  'entries',
    },
    {
      title:  'Contact',
      href:   '/admin/contact',
      icon:   '📬',
      desc:   'Email, phone, LinkedIn, GitHub, location',
      count:  null,
    },
  ]

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-10">
        <h1 className="
          text-3xl font-black
          text-[var(--color-clay-navy)]
          tracking-tight mb-2
        ">
          Welcome back, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[var(--color-clay-muted)] font-semibold">
          Select a section to edit your portfolio content.
        </p>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="
              block p-6 rounded-2xl
              bg-white
              border border-[var(--color-cream-300)]
              hover:border-[var(--color-clay-orange)]/40
              hover:shadow-lg hover:shadow-orange-100/50
              transition-all duration-200
              group
            "
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{section.icon}</span>
              {section.count !== null && (
                <span className="
                  font-mono text-xs font-bold
                  bg-[var(--color-cream-200)]
                  text-[var(--color-clay-muted)]
                  px-2.5 py-1 rounded-full
                ">
                  {section.count} {section.unit}
                </span>
              )}
            </div>
            <h2 className="
              text-lg font-black
              text-[var(--color-clay-navy)]
              mb-1
              group-hover:text-[var(--color-clay-orange)]
              transition-colors duration-200
            ">
              {section.title}
            </h2>
            <p className="text-sm font-semibold text-[var(--color-clay-muted)]">
              {section.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}