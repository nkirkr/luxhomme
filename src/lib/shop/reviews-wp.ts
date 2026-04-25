import type { ReviewStats, ReviewsPage } from '@/lib/shop/reviews-api'

function wpReviewsRestBase(): string | null {
  const base = process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? ''
  if (!base) return null
  return `${base}/wp-json/luxhomme/v1`
}

/**
 * Fetches a page of reviews from WordPress REST (same contract as GET /api/reviews).
 * Use from Route Handlers and Server Components — not from the browser.
 */
export async function fetchReviewsPageFromWp(
  productId: string,
  page = 1,
  perPage = 10,
  source?: 'site' | 'wb' | 'ozon',
): Promise<ReviewsPage | null> {
  const root = wpReviewsRestBase()
  if (!root) return null

  const wpUrl = new URL(`${root}/reviews`)
  wpUrl.searchParams.set('product_id', productId)
  wpUrl.searchParams.set('page', String(page))
  wpUrl.searchParams.set('per_page', String(perPage))
  if (source) wpUrl.searchParams.set('source', source)

  try {
    const wpRes = await fetch(wpUrl.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 },
    })
    if (!wpRes.ok) return null
    return (await wpRes.json()) as ReviewsPage
  } catch {
    return null
  }
}

/**
 * Fetches review stats from WordPress REST (same contract as GET /api/reviews/stats).
 */
export async function fetchReviewStatsFromWp(productId: string): Promise<ReviewStats | null> {
  const root = wpReviewsRestBase()
  if (!root) return null

  const wpUrl = new URL(`${root}/reviews/stats`)
  wpUrl.searchParams.set('product_id', productId)

  try {
    const wpRes = await fetch(wpUrl.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 },
    })
    if (!wpRes.ok) return null
    return (await wpRes.json()) as ReviewStats
  } catch {
    return null
  }
}

/** First page + stats for product detail SSR */
export async function fetchInitialReviewsBundle(
  productId: string,
  perPage = 10,
): Promise<{ reviewsPage: ReviewsPage; stats: ReviewStats | null } | null> {
  const [reviewsPage, stats] = await Promise.all([
    fetchReviewsPageFromWp(productId, 1, perPage),
    fetchReviewStatsFromWp(productId),
  ])
  if (!reviewsPage) return null
  return { reviewsPage, stats }
}
