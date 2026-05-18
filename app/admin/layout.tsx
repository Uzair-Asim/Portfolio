import { auth }    from '@/lib/auth'
import { signOut } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen bg-[var(--color-cream-100)]">
      {session && (
        <nav className="
          bg-[var(--color-clay-navy)]
          px-6 py-4
          flex items-center justify-between
        ">
          <div className="flex items-center gap-3">
            <div className="
              w-8 h-8 rounded-lg bg-white/10
              flex items-center justify-center
              font-mono text-white text-xs font-bold
            ">
              {'</>'}
            </div>
            <span className="font-mono text-sm font-bold text-white">
              Portfolio Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-white/60">
              {session.user?.name}
            </span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/admin/login' })
              }}
            >
              <button
                type="submit"
                className="
                  font-mono text-xs font-bold
                  text-white/70 hover:text-white
                  transition-colors duration-200
                  cursor-pointer
                "
              >
                Sign out
              </button>
            </form>
            <a
              href="/"
              target="_blank"
              className="
                font-mono text-xs font-bold
                bg-[var(--color-clay-orange)]
                hover:bg-[var(--color-clay-orange-dark)]
                text-white px-3 py-1.5 rounded-lg
                transition-colors duration-200
              "
            >
              View Portfolio ↗
            </a>
          </div>
        </nav>
      )}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </div>
    </div>
  )
}