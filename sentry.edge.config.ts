import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const sentryEnabled = process.env.NEXT_PUBLIC_FEATURE_SENTRY === 'true' && !!SENTRY_DSN

if (sentryEnabled) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: false,
  })
}
