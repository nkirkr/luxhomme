import type { RateLimitAdapter, RateLimitConfig, RateLimitResult } from './types'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function createMemoryRateLimiter(config: RateLimitConfig): RateLimitAdapter {
  return {
    check(key: string): RateLimitResult {
      const now = Date.now()
      const entry = rateLimitMap.get(key)

      if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + config.interval })
        return { success: true, remaining: config.limit - 1 }
      }

      if (entry.count >= config.limit) {
        return { success: false, remaining: 0 }
      }

      entry.count++
      return { success: true, remaining: config.limit - entry.count }
    },
  }
}
