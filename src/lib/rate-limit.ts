const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  interval: number
  limit: number
}

export function rateLimit(config: RateLimitConfig = { interval: 60_000, limit: 10 }) {
  return {
    check(key: string): { success: boolean; remaining: number } {
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

export const authLimiter = rateLimit({ interval: 60_000, limit: 5 })
export const apiLimiter = rateLimit({ interval: 60_000, limit: 30 })
