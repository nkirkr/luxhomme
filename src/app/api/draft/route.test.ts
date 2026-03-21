import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMockRequest, withEnv } from '@/test/helpers'

// Mock Next.js server APIs
const mockEnable = vi.fn()
vi.mock('next/headers', () => ({
  draftMode: vi.fn().mockResolvedValue({ enable: mockEnable }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
}))

describe('GET /api/draft', () => {
  let cleanup: () => void

  beforeEach(() => {
    vi.clearAllMocks()
    cleanup = withEnv({ REVALIDATION_SECRET: 'test-secret' })
  })

  afterEach(() => {
    cleanup()
  })

  it('rejects invalid secret', async () => {
    const { GET } = await import('./route')
    const request = createMockRequest('/api/draft?secret=wrong&slug=test')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  it('rejects missing slug', async () => {
    const { GET } = await import('./route')
    const request = createMockRequest('/api/draft?secret=test-secret')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('enables draft mode and redirects for page', async () => {
    const { redirect } = await import('next/navigation')
    const { GET } = await import('./route')
    const request = createMockRequest('/api/draft?secret=test-secret&slug=about')

    try {
      await GET(request)
    } catch {
      // redirect throws
    }

    expect(mockEnable).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/about')
  })

  it('redirects to blog path for post type', async () => {
    const { redirect } = await import('next/navigation')
    const { GET } = await import('./route')
    const request = createMockRequest('/api/draft?secret=test-secret&slug=my-post&type=post')

    try {
      await GET(request)
    } catch {
      // redirect throws
    }

    expect(redirect).toHaveBeenCalledWith('/blog/my-post')
  })
})
