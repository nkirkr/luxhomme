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
