import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMockRequest, withEnv } from '@/test/helpers'

vi.mock('@/lib/payment', () => ({
  getPayment: vi.fn().mockResolvedValue({
    verifyWebhook: vi.fn().mockResolvedValue({ event: 'payment.succeeded', data: {} }),
    createCheckout: vi.fn(),
    getPaymentStatus: vi.fn(),
  }),
}))

vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}))

describe('POST /api/payment/webhook', () => {
  let cleanup: () => void

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup?.()
  })

  it('returns 404 when payment feature is disabled', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_PAYMENT: 'false' })
    vi.resetModules()

    const { POST } = await import('./route')
    const request = createMockRequest('/api/payment/webhook', {
      method: 'POST',
      body: '{}',
    })
    const response = await POST(request)

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toContain('disabled')
  })

  it('processes webhook when payment is enabled', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_PAYMENT: 'true' })
    vi.resetModules()

    // Re-mock after module reset
    vi.doMock('@/lib/payment', () => ({
      getPayment: vi.fn().mockResolvedValue({
        verifyWebhook: vi.fn().mockResolvedValue({ event: 'payment.succeeded', data: {} }),
      }),
    }))
    vi.doMock('@/lib/logger', () => ({
      createLogger: () => ({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      }),
    }))

    const { POST } = await import('./route')
    const request = createMockRequest('/api/payment/webhook', {
      method: 'POST',
      body: '{"type":"payment.succeeded"}',
      headers: { 'stripe-signature': 'test-sig' },
    })
    const response = await POST(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.received).toBe(true)
  })

  it('returns 400 when webhook verification fails', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_PAYMENT: 'true' })
    vi.resetModules()

    vi.doMock('@/lib/payment', () => ({
      getPayment: vi.fn().mockResolvedValue({
        verifyWebhook: vi.fn().mockRejectedValue(new Error('Invalid signature')),
      }),
    }))
    vi.doMock('@/lib/logger', () => ({
      createLogger: () => ({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      }),
    }))

    const { POST } = await import('./route')
    const request = createMockRequest('/api/payment/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 'bad-sig' },
    })
    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
