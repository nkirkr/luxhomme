import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { WpUserData } from './types'

const WP_REST_BASE =
  (process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? '') + '/wp-json/luxhomme/v1'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? ''
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? ''

const wpAuthHeader = (): string =>
  'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

export const wpDashboardFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const url = `${WP_REST_BASE}/${path.replace(/^\//, '')}`

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: wpAuthHeader(),
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`WP Dashboard REST ${res.status}: ${text.slice(0, 300)}`)
  }

  return res.json() as Promise<T>
}

export const resolveWpUser = async (session: {
  user: { email: string; name: string }
}): Promise<WpUserData> => {
  const { email, name } = session.user
  const isPhoneUser = email.endsWith('@phone-auth.invalid')

  if (isPhoneUser) {
    const phone = name.replace(/\D/g, '')
    return wpDashboardFetch<WpUserData>(`user/me?phone=${encodeURIComponent(phone)}`)
  }

  return wpDashboardFetch<WpUserData>(`user/me?email=${encodeURIComponent(email)}`)
}

export const getSessionOrThrow = async (): Promise<{
  user: { id: string; email: string; name: string }
}> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('unauthorized')
  }
  return session as { user: { id: string; email: string; name: string } }
}
