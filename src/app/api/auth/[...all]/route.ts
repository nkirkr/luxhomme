import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest, NextResponse } from 'next/server'
import { authLimiter } from '@/lib/rate-limit'

const handler = toNextJsHandler(auth)

export const GET = handler.GET

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await authLimiter.check(`auth:${ip}`)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  return handler.POST(request)
}
