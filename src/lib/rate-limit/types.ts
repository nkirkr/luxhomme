export interface RateLimitResult {
  success: boolean
  remaining: number
}

export interface RateLimitConfig {
  /** Time window in milliseconds */
  interval: number
  /** Maximum requests per interval */
  limit: number
}

export interface RateLimitAdapter {
  check(key: string): RateLimitResult | Promise<RateLimitResult>
}
