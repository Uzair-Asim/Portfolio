import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'

/**
 * WHY GET is a server-side function:
 * This runs on Vercel's servers, never in the browser.
 * The MongoDB connection string never reaches the client.
 * The browser just gets back clean JSON.
 */
export async function GET() {
  try {
    await connectDB()

    /**
     * WHY findOne with no filter:
     * Your portfolio has exactly one document — yours.
     * findOne() returns the first (and only) document.
     * No need for complex queries.
     */
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

/**
 * WHY PATCH not PUT:
 * PUT replaces the entire document.
 * PATCH updates only the fields you send.
 * For an admin editing just the skills section,
 * PATCH is safer — it can't accidentally wipe
 * experience data by forgetting to include it.
 */
export async function PATCH(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: body },
      /**
       * WHY new: true:
       * Returns the updated document instead of the original.
       * Without this you'd get back the old data even after
       * a successful update — confusing to debug.
       *
       * WHY upsert: true:
       * Creates the document if it doesn't exist yet.
       * Useful during initial setup — the first PATCH
       * creates the portfolio document automatically.
       */
      { new: true, upsert: true, runValidators: true }
    ).lean()

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('PATCH /api/content error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio data' },
      { status: 500 }
    )
  }
}