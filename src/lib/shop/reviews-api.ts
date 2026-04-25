export interface Review {
  id: number
  rating: number
  text: string
  author_name: string
  source: 'site' | 'wb' | 'ozon'
  photos: string[]
  date: string
  product_id: number
}

export interface ReviewStats {
  average_rating: number
  total_count: number
  with_photos_count: number
  distribution: Record<'1' | '2' | '3' | '4' | '5', number>
}

export interface ReviewsPage {
  reviews: Review[]
  total: number
  pages: number
}

export type ReviewFilter = 'all' | 'with_photo' | 'positive' | 'negative'

export interface SubmitReviewPayload {
  product_id: string
  rating: number
  text: string
  author_name: string
  photos: File[]
}

export interface SubmitReviewResult {
  success: boolean
  review_id?: number
  message: string
  errors?: Record<string, string>
}

export async function fetchReviews(
  productId: string,
  page = 1,
  perPage = 10,
  source?: 'site' | 'wb' | 'ozon',
): Promise<ReviewsPage> {
  const params = new URLSearchParams({
    product_id: productId,
    page: String(page),
    per_page: String(perPage),
  })
  if (source) params.set('source', source)

  const res = await fetch(`/api/reviews?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.status}`)
  }
  return res.json() as Promise<ReviewsPage>
}

export async function fetchReviewStats(productId: string): Promise<ReviewStats> {
  const res = await fetch(`/api/reviews/stats?product_id=${productId}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch review stats: ${res.status}`)
  }
  return res.json() as Promise<ReviewStats>
}

export async function submitReview(payload: SubmitReviewPayload): Promise<SubmitReviewResult> {
  const fd = new FormData()
  fd.set('product_id', payload.product_id)
  fd.set('rating', String(payload.rating))
  fd.set('text', payload.text)
  fd.set('author_name', payload.author_name)
  for (const photo of payload.photos) {
    fd.append('photos[]', photo)
  }

  const res = await fetch('/api/reviews', { method: 'POST', body: fd })
  const data = (await res.json()) as SubmitReviewResult
  if (!res.ok) {
    throw Object.assign(new Error(data.message ?? 'Submit failed'), {
      errors: data.errors,
    })
  }
  return data
}
