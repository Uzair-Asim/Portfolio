import { Redis } from '@upstash/redis'

/**
 * WHY conditional Redis initialization:
 * During local development we don't have Upstash credentials
 * so we return null instead of crashing. The chat API route
 * checks for null and skips rate limiting gracefully.
 * In production on Vercel the credentials are injected
 * automatically and rate limiting activates.
 */
export function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null
  }

  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}