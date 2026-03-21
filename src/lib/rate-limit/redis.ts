import type { RateLimitAdapter, RateLimitConfig } from './types'

/**
 * Redis-based rate limiter stub.
 *
 * TODO: Implement with your preferred Redis client:
 *
 * - **Vercel / serverless**: `@upstash/redis` (HTTP-based, no connection pool)
 *   npm install @upstash/redis
 *
 * - **Docker / long-running server**: `ioredis` (TCP connection pool)
 *   npm install ioredis
 *
 * Implementation approach: sliding window counter
 * - Key: `rate-limit:{key}:{window}`
 * - Use INCR + EXPIRE for simple counting per window
 * - Or ZRANGEBYSCORE for precise sliding window
 *
 * Example with @upstash/redis:
 * ```ts
 * import { Redis } from '@upstash/redis'
 * import { Ratelimit } from '@upstash/ratelimit'
 *
 * const redis = Redis.fromEnv()
 * const ratelimit = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(config.limit, `${config.interval}ms`),
 * })
 *
 * // In check():
 * const { success, remaining } = await ratelimit.limit(key)
 * ```
 */
export function createRedisRateLimiter(_config: RateLimitConfig): RateLimitAdapter {
  throw new Error(
    'Redis rate limiter not implemented. ' +
      'Install a Redis client (@upstash/redis or ioredis) and implement this adapter. ' +
      'See src/lib/rate-limit/redis.ts for instructions.',
  )
}
