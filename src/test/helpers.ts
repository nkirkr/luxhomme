import { NextRequest } from 'next/server'

/**
 * Create a mock NextRequest for testing API routes.
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string
    headers?: Record<string, string>
    body?: string | object
    ip?: string
  } = {},
): NextRequest {
  const { method = 'GET', headers = {}, body, ip } = options
  const fullUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`

  const init: RequestInit = {
    method,
    headers: new Headers(headers),
  }

  if (body && method !== 'GET' && method !== 'HEAD') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body)
    if (typeof body === 'object' && !headers['content-type']) {
      ;(init.headers as Headers).set('content-type', 'application/json')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = new NextRequest(fullUrl, init as any)

  if (ip) {
    Object.defineProperty(request, 'ip', { value: ip, writable: false })
  }

  return request
}

/**
 * Temporarily override environment variables for a test block.
 * Returns a cleanup function.
 */
export function withEnv(overrides: Record<string, string | undefined>): () => void {
  const originals: Record<string, string | undefined> = {}

  for (const [key, value] of Object.entries(overrides)) {
    originals[key] = process.env[key]
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  return () => {
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  }
}
