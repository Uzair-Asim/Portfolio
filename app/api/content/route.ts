import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'
import { auth } from '@/lib/auth'

/**
 * WHY auth check in API routes:
 * The proxy protects pages but API routes need their own
 * auth check. Without this anyone could call PATCH /api/content
 * directly from a terminal and modify your portfolio data.
 * Defense in depth - protect both the UI and the API.
 */
export async function GET() {
  try {
    await connectDB()
    const portfolio = await Portfolio.findOne().lean()
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio data not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('GET /api/content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    /**
     * WHY check session in PATCH but not GET:
     * GET is public - anyone can read your portfolio data,
     * that's the whole point. PATCH modifies data so only
     * you should be able to call it.
     */
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const body = await req.json()

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean()

    /**
     * WHY revalidatePath after update:
     * Next.js caches the portfolio page for 1 hour (revalidate: 3600).
     * After saving changes we want them to appear immediately,
     * not an hour later. revalidatePath tells Next.js to throw
     * away the cached version of '/' and rebuild it fresh
     * on the next request.
     */
    revalidatePath('/')

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('PATCH /api/content error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio data' },
      { status: 500 }
    )
  }
}