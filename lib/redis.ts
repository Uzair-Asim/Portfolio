import { Redis } from '@upstash/redis'

/**
 * WHY Redis.fromEnv():
 * Upstash's fromEnv() automatically reads KV_REST_API_URL
 * and KV_REST_API_TOKEN which Vercel injects automatically
 * when you connect an Upstash database to your project.
 * No manual env var configuration needed.
 *
 * WHY return null when env vars missing:
 * In local development without Redis configured the chat
 * still works - rate limiting is simply skipped.
 */
export function getRedis(): Redis | null {
  if (
    !process.env.KV_REST_API_URL ||
    !process.env.KV_REST_API_TOKEN
  ) {
    return null
  }

  return Redis.fromEnv()
}