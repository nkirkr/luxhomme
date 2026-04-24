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
