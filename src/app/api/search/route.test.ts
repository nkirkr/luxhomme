import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockRequest } from '@/test/helpers'

vi.mock('@/lib/cms', () => ({
  getCMS: vi.fn().mockResolvedValue({
    getPosts: vi.fn().mockResolvedValue({ posts: [], total: 0 }),
  }),
}))

vi.mock('@/lib/rate-limit', () => ({
  apiLimiter: {
    check: vi.fn().mockReturnValue({ success: true, remaining: 29 }),
  },
}))

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty results for empty query', async () => {
    const { GET } = await import('./route')
    const request = createMockRequest('/api/search')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toEqual([])
  })

  it('returns empty results for whitespace-only query', async () => {
    const { GET } = await import('./route')
    const request = createMockRequest('/api/search?q=%20%20')
    const response = await GET(request)
    const data = await response.json()

    expect(data.results).toEqual([])
  })

  it('matches static pages', async () => {
    const { GET } = await import('./route')
    const request = createMockRequest('/api/search?q=about')
    const response = await GET(request)
    const data = await response.json()

    expect(data.results).toHaveLength(1)
    expect(data.results[0].title).toBe('About')
    expect(data.results[0].url).toBe('/about')
    expect(data.results[0].type).toBe('page')
  })

  it('matches case-insensitively', async () => {
    const { GET } = await import('./route')
    const request = createMockRequest('/api/search?q=HOME')
    const response = await GET(request)
    const data = await response.json()

    expect(data.results.some((r: { title: string }) => r.title === 'Home')).toBe(true)
  })

  it('returns 429 when rate limited', async () => {
    const { apiLimiter } = await import('@/lib/rate-limit')
    vi.mocked(apiLimiter.check).mockReturnValueOnce({ success: false, remaining: 0 })

    const { GET } = await import('./route')
    const request = createMockRequest('/api/search?q=test')
    const response = await GET(request)

    expect(response.status).toBe(429)
  })

  it('includes CMS posts in results', async () => {
    const { getCMS } = await import('@/lib/cms')
    vi.mocked(getCMS).mockResolvedValueOnce({
      getPosts: vi.fn().mockResolvedValue({
        posts: [
          {
            id: '1',
            slug: 'test-post',
            title: 'Test Article',
            excerpt: 'A test article',
            content: '',
            date: '2025-01-15',
            categories: [],
          },
        ],
        total: 1,
      }),
      getPostBySlug: vi.fn(),
      getPages: vi.fn(),
      getPageBySlug: vi.fn(),
      getCategories: vi.fn(),
    })

    const { GET } = await import('./route')
    const request = createMockRequest('/api/search?q=test')
    const response = await GET(request)
    const data = await response.json()

    const postResult = data.results.find((r: { type: string }) => r.type === 'post')
    expect(postResult).toBeDefined()
    expect(postResult.url).toBe('/blog/test-post')
  })
})
