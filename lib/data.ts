import { IPortfolio } from '@/models/Portfolio'

/**
 * WHY a separate data fetching utility:
 * We could call fetch() directly in page.tsx but having
 * a dedicated function means:
 * 1. One place to update if the API route changes
 * 2. Easy to add caching, error handling, or fallbacks
 * 3. Can be reused in other server components later
 *
 * WHY fetch() instead of importing connectDB directly:
 * In Next.js App Router, server components CAN import
 * database code directly. However using fetch() gives us
 * Next.js's built-in caching layer for free.
 * revalidate: 3600 means the data is cached for 1 hour —
 * so if 1000 people visit in the same hour, only ONE
 * database query is made. The rest get the cached response.
 */
export async function getPortfolioData(): Promise<IPortfolio | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/content`, {
      /**
       * WHY next.revalidate:
       * This is Next.js's ISR (Incremental Static Regeneration).
       * The page is cached and served statically.
       * Every 3600 seconds (1 hour) Next.js regenerates it
       * in the background with fresh data.
       * For a portfolio this is perfect - content doesn't
       * change every second, but you want changes to appear
       * within a reasonable time after editing.
       *
       * When you update content in the admin panel later,
       * we'll add a cache revalidation call so changes
       * appear immediately instead of waiting an hour.
       */
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    return res.json()
  } catch (error) {
    console.error('Failed to fetch portfolio data:', error)
    return null
  }
}