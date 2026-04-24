# engineer_output.md — Система отзывов (фронтенд)

## Созданные файлы

### `src/lib/shop/reviews-api.ts`

```typescript
export interface Review {
  id: number
  rating: number
  text: string
  author_name: string
  source: 'site' | 'wb'
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
  source?: 'site' | 'wb',
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
```

### `src/app/api/reviews/route.ts`

```typescript
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
  formData.set('author_name', session.user.name || 'Пользователь')

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
```

### `src/app/api/reviews/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

const WP_REST_BASE =
  (process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? '') + '/wp-json/luxhomme/v1'

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
```

### `src/hooks/use-reviews.ts`

```typescript
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Review, ReviewStats, ReviewFilter } from '@/lib/shop/reviews-api'
import { fetchReviews, fetchReviewStats } from '@/lib/shop/reviews-api'

interface UseReviewsReturn {
  reviews: Review[]
  stats: ReviewStats | null
  isLoading: boolean
  error: string | null
  filter: ReviewFilter
  setFilter: (f: ReviewFilter) => void
  page: number
  totalPages: number
  loadMore: () => void
  hasMore: boolean
}

const PER_PAGE = 10

function applyClientFilter(reviews: Review[], filter: ReviewFilter): Review[] {
  switch (filter) {
    case 'with_photo':
      return reviews.filter((r) => r.photos.length > 0)
    case 'positive':
      return reviews.filter((r) => r.rating >= 4)
    case 'negative':
      return reviews.filter((r) => r.rating <= 2)
    default:
      return reviews
  }
}

export function useReviews(productId: string): UseReviewsReturn {
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!productId) return
    let cancelled = false
    setIsLoading(true)
    setError(null)

    Promise.all([fetchReviews(productId, 1, PER_PAGE), fetchReviewStats(productId)])
      .then(([reviewsPage, statsData]) => {
        if (cancelled || !mountedRef.current) return
        setAllReviews(reviewsPage.reviews)
        setTotalPages(reviewsPage.pages)
        setPage(1)
        setStats(statsData)
      })
      .catch((err: unknown) => {
        if (cancelled || !mountedRef.current) return
        setError(err instanceof Error ? err.message : 'Ошибка загрузки отзывов')
      })
      .finally(() => {
        if (!cancelled && mountedRef.current) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [productId])

  const loadMore = useCallback(() => {
    if (page >= totalPages || isLoading) return
    const nextPage = page + 1
    setIsLoading(true)

    fetchReviews(productId, nextPage, PER_PAGE)
      .then((reviewsPage) => {
        if (!mountedRef.current) return
        setAllReviews((prev) => [...prev, ...reviewsPage.reviews])
        setPage(nextPage)
        setTotalPages(reviewsPage.pages)
      })
      .catch((err: unknown) => {
        if (!mountedRef.current) return
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      })
      .finally(() => {
        if (mountedRef.current) setIsLoading(false)
      })
  }, [productId, page, totalPages, isLoading])

  const filteredReviews = applyClientFilter(allReviews, filter)

  return {
    reviews: filteredReviews,
    stats,
    isLoading,
    error,
    filter,
    setFilter,
    page,
    totalPages,
    loadMore,
    hasMore: page < totalPages,
  }
}
```

### `src/hooks/use-review-submit.ts`

```typescript
'use client'

import { useState, useCallback } from 'react'
import type { SubmitReviewPayload } from '@/lib/shop/reviews-api'
import { submitReview } from '@/lib/shop/reviews-api'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface UseReviewSubmitReturn {
  status: SubmitStatus
  error: string | null
  fieldErrors: Record<string, string>
  submit: (payload: SubmitReviewPayload) => Promise<void>
  reset: () => void
}

export function useReviewSubmit(): UseReviewSubmitReturn {
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const submit = useCallback(async (payload: SubmitReviewPayload) => {
    setStatus('submitting')
    setError(null)
    setFieldErrors({})

    try {
      await submitReview(payload)
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      if (err instanceof Error) {
        setError(err.message)
        const withErrors = err as Error & { errors?: Record<string, string> }
        if (withErrors.errors) setFieldErrors(withErrors.errors)
      } else {
        setError('Произошла ошибка при отправке отзыва')
      }
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setFieldErrors({})
  }, [])

  return { status, error, fieldErrors, submit, reset }
}
```

---

## Изменённые файлы

### `src/lib/shop/product-detail-ui.ts`

- Добавлено поле `productId: string` в тип `ProductDetailForTabs`
- Удалено поле `reviews` из типа и из `buildProductDetailForTabs()`
- В return добавлено `productId: p.id`
- `ratingAvg` оставлен как deprecated fallback

### `src/app/(shop)/products/[slug]/ProductTabs.tsx`

- Добавлены импорты: `useReviews`, `useReviewSubmit`, `useSession`, `ReviewFilter`
- `REVIEW_FILTERS` (массив строк) → `REVIEW_FILTER_OPTIONS` (типизированный массив `{ label, value }`)
- `WriteReviewModal` переработан:
  - Новые пропсы: `productId`, `onSuccess`
  - Поле «Имя» (input)
  - Multi-file upload (max 5) с превью
  - Проверка авторизации через `useSession`
  - Интеграция с `useReviewSubmit()` хуком
  - Статус: success / error / submitting
- Секция отзывов:
  - `useReviews(product.productId)` вместо `product.reviews`
  - Динамический рейтинг из `stats.average_rating`
  - Функциональные фильтры: `setFilter(f.value)` + стиль `filterBtnActive`
  - Бейдж источника: `.sourceBadge` + `.wbBadge` / `.siteBadge`
  - Сетка фотографий: `.reviewPhotos` > `.reviewPhotoThumb`
  - Кнопка «Показать ещё» — `loadMore()`, скрывается при `!hasMore`
  - Состояние загрузки: `.reviewsLoading`

### `src/app/(shop)/products/[slug]/product.module.css`

Добавлены стили:

- `.sourceBadge`, `.wbBadge`, `.siteBadge` — бейджи источника
- `.reviewPhotos`, `.reviewPhotoThumb` — сетка фото в карточке отзыва
- `.filterBtnActive` — активный фильтр
- `.reviewsLoading` — индикатор загрузки
- `.reviewModalNameInput` — поле имени в модалке
- `.reviewModalPhotoPreviews`, `.reviewModalPhotoThumbWrap`, `.reviewModalPhotoThumb`, `.reviewModalPhotoRemove` — превью фото в модалке
- `.reviewSubmitSuccess` — блок успешной отправки
- `.reviewModalError` — ошибка в модалке
- `.reviewModalAuthNotice` — «Войдите чтобы оставить отзыв»

---

## Список TODO: [developer]

1. `src/app/(shop)/products/[slug]/ProductTabs.tsx` ~строка 387 — Реализовать перезагрузку списка отзывов после успешной отправки (refetch или reload)
2. `public/icons/wb-logo.svg` — Создать SVG-иконку логотипа Wildberries для бейджа источника
3. `public/icons/luxhomme-badge.svg` — Создать SVG-иконку бейджа Luxhomme (опционально, текст уже работает)
4. `src/app/(shop)/products/[slug]/page.tsx` — Не требует изменений: `buildProductDetailForTabs(product)` уже возвращает `productId`, `tabsProduct` получит его автоматически
