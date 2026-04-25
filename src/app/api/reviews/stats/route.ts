import { fetchReviewStatsFromWp } from '@/lib/shop/reviews-wp'
import { NextRequest, NextResponse } from 'next/server'

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

  const data = await fetchReviewStatsFromWp(productId)
  if (!data) {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Reviews stats unavailable' },
      { status: 502 },
    )
  }
  return NextResponse.json(data)
}
