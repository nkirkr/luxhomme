import { getSessionOrThrow, resolveWpUser, wpDashboardFetch } from '@/lib/dashboard/wp-user'
import type { DashboardReview } from '@/lib/dashboard/types'
import { NextRequest, NextResponse } from 'next/server'

interface WpReviewRaw {
  id: number
  rating: number
  text: string
  source: 'site' | 'wb' | 'ozon'
  photos?: string[]
  date: string
  product_id: number
}

interface WpReviewsResult {
  reviews: WpReviewRaw[]
  total: number
}

const formatReviewDate = (iso: string): string => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const GET = async () => {
  let session
  try {
    session = await getSessionOrThrow()
  } catch {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Необходимо авторизоваться' },
      { status: 401 },
    )
  }

  let wpUser
  try {
    wpUser = await resolveWpUser(session)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось получить данные пользователя' },
      { status: 502 },
    )
  }

  try {
    const data = await wpDashboardFetch<WpReviewsResult>(`reviews?author_id=${wpUser.wp_user_id}`)

    const reviews: DashboardReview[] = data.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      text: review.text,
      source: review.source,
      product_id: review.product_id,
      date: formatReviewDate(review.date),
      photo: review.photos?.[0] || '',
      photos: review.photos || [],
    }))

    return NextResponse.json({ reviews, total: reviews.length })
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось загрузить отзывы' },
      { status: 502 },
    )
  }
}

export const PUT = async (request: NextRequest) => {
  let session
  try {
    session = await getSessionOrThrow()
  } catch {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Необходимо авторизоваться' },
      { status: 401 },
    )
  }

  let body: { id: number; rating: number; text: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { code: 'validation_error', message: 'Невалидный JSON' },
      { status: 400 },
    )
  }

  if (!body.id || !body.rating || !body.text) {
    return NextResponse.json(
      { code: 'validation_error', message: 'Требуются поля id, rating, text' },
      { status: 400 },
    )
  }

  let wpUser
  try {
    wpUser = await resolveWpUser(session)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Пользователь не найден' },
      { status: 502 },
    )
  }

  try {
    const result = await wpDashboardFetch<{ success: boolean }>(`reviews/${body.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author_email: wpUser.email,
        rating: body.rating,
        text: body.text,
      }),
    })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось обновить отзыв' },
      { status: 502 },
    )
  }
}
