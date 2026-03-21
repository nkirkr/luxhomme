import type { RateLimitAdapter, RateLimitConfig } from './types'
import { createMemoryRateLimiter } from './memory'

export type { RateLimitAdapter, RateLimitConfig, RateLimitResult } from './types'

/**
 * Create a rate limiter.
 *
 * Uses in-memory storage by default.
 * Set REDIS_URL environment variable to use Redis (requires implementation in redis.ts).
 */
export function rateLimit(
  config: RateLimitConfig = { interval: 60_000, limit: 10 },
): RateLimitAdapter {
  if (process.env.REDIS_URL) {
    // Lazy import to avoid pulling in Redis deps when not needed
    const { createRedisRateLimiter } = require('./redis')
    return createRedisRateLimiter(config)
  }

  return createMemoryRateLimiter(config)
}

export const authLimiter = rateLimit({ interval: 60_000, limit: 5 })
export const apiLimiter = rateLimit({ interval: 60_000, limit: 30 })
