import { NextRequest, NextResponse } from 'next/server'

const WP_REST_BASE =
  (process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? '') + '/wp-json/luxhomme/v1'

/**
 * GET /api/reviews/stats — proxy public stats endpoint to WP REST.
 */
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('product_id')
  if (!productId) {
    return NextResponse.json(
      { code: 'validation_error', message: 'product_id is required' },
      { status: 400 },
    )
  }

  const wpUrl = new URL(`${WP_REST_BASE}/reviews/stats`)
  wpUrl.searchParams.set('product_id', productId)

  const wpRes = await fetch(wpUrl.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 0 },
  })

  const data = await wpRes.json()
  return NextResponse.json(data, { status: wpRes.status })
}
