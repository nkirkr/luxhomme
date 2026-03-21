import { NextResponse } from 'next/server'

export async function GET() {
  const health: {
    status: string
    timestamp: string
    uptime: number
    database?: string
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }

  // Optional: check database connectivity
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db')
      await db.execute('SELECT 1')
      health.database = 'connected'
    } catch {
      health.database = 'disconnected'
    }
  }

  return NextResponse.json(health)
}
