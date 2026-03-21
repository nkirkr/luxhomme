import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? ''
const sentryEnabled = process.env.NEXT_PUBLIC_FEATURE_SENTRY === 'true' && !!SENTRY_DSN

let initialized = false

export function initSentry() {
  if (initialized || !sentryEnabled) return
  initialized = true

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: false,
  })
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (!sentryEnabled) {
    console.error(error, context)
    return
  }
  Sentry.captureException(error, { extra: context })
}

export function setUser(user: { id: string; email?: string } | null) {
  if (!sentryEnabled) return
  Sentry.setUser(user)
}
