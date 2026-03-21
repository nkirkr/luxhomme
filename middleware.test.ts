import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { withEnv } from '@/test/helpers'

function createRequest(path: string, cookies: Record<string, string> = {}): NextRequest {
  const url = `http://localhost:3000${path}`
  const request = new NextRequest(url)
  for (const [name, value] of Object.entries(cookies)) {
    request.cookies.set(name, value)
  }
  return request
}

describe('middleware', () => {
  let cleanup: () => void

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    cleanup?.()
  })

  it('passes through when auth is disabled', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'false' })

    const { middleware } = await import('./middleware')
    const response = middleware(createRequest('/dashboard'))

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  it('redirects unauthenticated user to login on protected route', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })

    const { middleware } = await import('./middleware')
    const response = middleware(createRequest('/dashboard'))

    expect(response.status).toBe(307)
    const location = response.headers.get('location')!
    expect(location).toContain('/login')
    expect(location).toContain('callbackUrl=%2Fdashboard')
  })

  it('redirects authenticated user away from guest routes', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })

    const { middleware } = await import('./middleware')
    const response = middleware(createRequest('/login', { 'better-auth.session_token': 'abc123' }))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/dashboard')
  })

  it('allows authenticated user on protected routes', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })

    const { middleware } = await import('./middleware')
    const response = middleware(
      createRequest('/dashboard', { 'better-auth.session_token': 'abc123' }),
    )

    expect(response.status).toBe(200)
  })

  it('allows unauthenticated user on guest routes', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })

    const { middleware } = await import('./middleware')
    const response = middleware(createRequest('/login'))

    expect(response.status).toBe(200)
  })

  it('allows unauthenticated user on public routes', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })

    const { middleware } = await import('./middleware')
    const response = middleware(createRequest('/about'))

    expect(response.status).toBe(200)
  })

  it('protects all auth routes', async () => {
    cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })

    const { middleware } = await import('./middleware')
    const protectedPaths = ['/dashboard', '/profile', '/settings', '/orders', '/checkout']

    for (const path of protectedPaths) {
      vi.resetModules()
      cleanup()
      cleanup = withEnv({ NEXT_PUBLIC_FEATURE_AUTH: 'true' })
      const mod = await import('./middleware')
      const response = mod.middleware(createRequest(path))
      expect(response.status).toBe(307)
    }
  })
})
