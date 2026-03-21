import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('rateLimit', () => {
  // The rateLimitMap is module-level, so use unique keys per test to avoid leaking state
  let testId = 0

  function key() {
    return `test-${testId}`
  }

  beforeEach(() => {
    vi.useFakeTimers()
    testId++
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests within limit', async () => {
    const { rateLimit } = await import('.')
    const limiter = rateLimit({ interval: 60_000, limit: 3 })
    const k = key()

    expect(limiter.check(k).success).toBe(true)
    expect(limiter.check(k).success).toBe(true)
    expect(limiter.check(k).success).toBe(true)
  })

  it('blocks requests over limit', async () => {
    const { rateLimit } = await import('.')
    const limiter = rateLimit({ interval: 60_000, limit: 2 })
    const k = key()

    limiter.check(k)
    limiter.check(k)

    const result = limiter.check(k)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('tracks remaining correctly', async () => {
    const { rateLimit } = await import('.')
    const limiter = rateLimit({ interval: 60_000, limit: 3 })
    const k = key()

    expect(limiter.check(k).remaining).toBe(2)
    expect(limiter.check(k).remaining).toBe(1)
    expect(limiter.check(k).remaining).toBe(0)
  })

  it('resets after interval', async () => {
    const { rateLimit } = await import('.')
    const limiter = rateLimit({ interval: 60_000, limit: 1 })
    const k = key()

    limiter.check(k)
    expect(limiter.check(k).success).toBe(false)

    vi.advanceTimersByTime(60_001)

    expect(limiter.check(k).success).toBe(true)
  })

  it('tracks separate keys independently', async () => {
    const { rateLimit } = await import('.')
    const limiter = rateLimit({ interval: 60_000, limit: 1 })
    const k1 = `${key()}-a`
    const k2 = `${key()}-b`

    limiter.check(k1)
    expect(limiter.check(k1).success).toBe(false)
    expect(limiter.check(k2).success).toBe(true)
  })

  it('uses default config', async () => {
    const { rateLimit } = await import('.')
    const limiter = rateLimit()
    const result = limiter.check(key())
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(9)
  })
})
