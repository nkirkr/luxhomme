import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMockRequest, withEnv } from '@/test/helpers'

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}))

describe('POST /api/revalidate', () => {
  let cleanup: () => void

  beforeEach(() => {
    vi.clearAllMocks()
    cleanup = withEnv({ REVALIDATION_SECRET: 'test-secret' })
  })

  afterEach(() => {
    cleanup()
  })

  it('rejects invalid secret', async () => {
    const { POST } = await import('./route')
    const request = createMockRequest('/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': 'wrong-secret' },
      body: { tag: 'posts' },
    })
    const response = await POST(request)

    expect(response.status).toBe(401)
  })

  it('revalidates with correct secret', async () => {
    const { revalidateTag } = await import('next/cache')
    const { POST } = await import('./route')

    const request = createMockRequest('/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': 'test-secret' },
      body: { tag: 'posts' },
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.revalidated).toBe(true)
    expect(data.tag).toBe('posts')
    expect(revalidateTag).toHaveBeenCalledWith('posts', 'default')
  })

  it('defaults tag to "all"', async () => {
    const { revalidateTag } = await import('next/cache')
    const { POST } = await import('./route')

    const request = createMockRequest('/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': 'test-secret' },
      body: {},
    })
    const response = await POST(request)
    const data = await response.json()

    expect(data.tag).toBe('all')
    expect(revalidateTag).toHaveBeenCalledWith('all', 'default')
  })
})
