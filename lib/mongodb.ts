import mongoose from 'mongoose'

/**
 * WHY this caching pattern:
 * Next.js in development hot-reloads modules constantly.
 * Without caching, each hot reload would create a new
 * database connection while the old one stays open.
 * After a few reloads you'd hit MongoDB's connection limit.
 *
 * We store the connection on the global object because
 * it persists across hot reloads in development.
 * In production (Vercel serverless) global also helps
 * reuse connections across invocations of the same function.
 *
 * This is the official Next.js recommended pattern for
 * Mongoose connections.
 */

declare global {
  var mongoose: {
    conn:    mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI is not defined in .env.local. ' +
    'Please add it before running the app.'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached!.conn) {
    return cached!.conn
  }

  // Create new connection if none exists
  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      /**
       * WHY bufferCommands: false:
       * By default Mongoose buffers commands when not connected.
       * Disabling this means operations fail immediately if
       * there's no connection - making errors visible right away
       * instead of silently queuing and timing out later.
       */
      bufferCommands: false,
      dbName: 'uzair-portfolio',
    }

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m.connection)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    // Reset promise so next call tries again
    cached!.promise = null
    throw e
  }

  return cached!.conn
}