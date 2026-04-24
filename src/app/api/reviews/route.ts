import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const WP_REST_BASE =
  (process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? '') + '/wp-json/luxhomme/v1'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? ''
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? ''

function wpAuthHeader(): string {
  return 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
}

/**
 * GET /api/reviews — proxy public read to WP REST.
 * No auth required (reviews are public).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const productId = searchParams.get('product_id')
  if (!productId) {
    return NextResponse.json(
      { code: 'validation_error', message: 'product_id is required' },
      { status: 400 },
    )
  }

  const wpUrl = new URL(`${WP_REST_BASE}/reviews`)
  wpUrl.searchParams.set('product_id', productId)

  const page = searchParams.get('page')
  if (page) wpUrl.searchParams.set('page', page)

  const perPage = searchParams.get('per_page')
  if (perPage) wpUrl.searchParams.set('per_page', perPage)

  const source = searchParams.get('source')
  if (source) wpUrl.searchParams.set('source', source)

  const wpRes = await fetch(wpUrl.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 0 },
  })

  const data = await wpRes.json()
  return NextResponse.json(data, { status: wpRes.status })
}

/**
 * POST /api/reviews — authenticated proxy.
 * Validates Better Auth session, then forwards FormData to WP REST.
 */
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Необходимо авторизоваться' },
      { status: 401 },
    )
  }

  const formData = await request.formData()
  formData.set('session_token', 'validated')

  const formName = (formData.get('author_name') as string | null)?.trim()
  if (!formName) {
    formData.set('author_name', session.user.name || 'Пользователь')
  }

  const wpRes = await fetch(`${WP_REST_BASE}/reviews`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: wpAuthHeader(),
    },
  })

  const data = await wpRes.json()
  return NextResponse.json(data, { status: wpRes.status })
}
