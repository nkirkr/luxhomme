# Monitoring — Sentry, Pino, Analytics, Web Vitals

## Overview

| System           | Purpose                  | Feature Flag                         |
| ---------------- | ------------------------ | ------------------------------------ |
| Sentry           | Error tracking           | `NEXT_PUBLIC_FEATURE_SENTRY=true`    |
| Pino             | Structured logging       | Always on                            |
| Google Analytics | Page views / events      | `NEXT_PUBLIC_FEATURE_ANALYTICS=true` |
| Yandex Metrika   | Page views / events      | `NEXT_PUBLIC_FEATURE_ANALYTICS=true` |
| Web Vitals       | Core performance metrics | Always on (sends to GA if available) |

## Sentry

### Setup

1. Set env vars in `.env.local`:

```env
NEXT_PUBLIC_FEATURE_SENTRY=true
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

2. That's it. Sentry auto-initializes via:
   - `sentry.client.config.ts` — browser errors
   - `sentry.server.config.ts` — server-side errors
   - `sentry.edge.config.ts` — middleware/edge errors
   - `src/instrumentation.ts` — Next.js instrumentation hook

### Files

| File                       | Purpose                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `sentry.client.config.ts`  | Client-side Sentry init (replays enabled)                       |
| `sentry.server.config.ts`  | Server-side Sentry init                                         |
| `sentry.edge.config.ts`    | Edge runtime Sentry init                                        |
| `src/instrumentation.ts`   | Next.js instrumentation hook                                    |
| `src/app/global-error.tsx` | Root error boundary (reports to Sentry)                         |
| `src/app/error.tsx`        | Route-level error boundary (reports to Sentry)                  |
| `src/lib/sentry.ts`        | Helper functions: `initSentry()`, `captureError()`, `setUser()` |

### Using helpers manually

```typescript
import { captureError, setUser } from '@/lib/sentry'

// Report an error with context
captureError(new Error('Payment failed'), { orderId: '123', amount: 4999 })

// Set user context (after login)
setUser({ id: 'user_123', email: 'user@example.com' })

// Clear user (after logout)
setUser(null)
```

### Conditional wrapping

`next.config.ts` wraps the config with `withSentryConfig()` only when Sentry is enabled. When disabled, the build is not affected.

### Disabling

Set `NEXT_PUBLIC_FEATURE_SENTRY=false` in `.env.local`. All Sentry code becomes no-ops; error boundaries fall back to `console.error`.

## Pino (Structured Logging)

### Why Pino

- JSON output in production — compatible with log aggregators (Datadog, Grafana, CloudWatch)
- Pretty-printed in development — readable colored output
- Child loggers for module-scoped context

### Usage

```typescript
import { createLogger } from '@/lib/logger'

const log = createLogger('payment:webhook')

log.info({ orderId: '123' }, 'Payment received')
log.error({ err: error }, 'Webhook processing failed')
log.debug({ payload }, 'Raw webhook payload')
```

### Log levels

| Level   | When to use                           |
| ------- | ------------------------------------- |
| `debug` | Detailed info for development         |
| `info`  | Normal operations (requests, events)  |
| `warn`  | Something unexpected but not an error |
| `error` | Something broke                       |

### Config

`src/lib/logger.ts`:

- **Development**: pretty-printed via `pino-pretty`, level `debug`
- **Production**: JSON output, level `info`
- Override with `LOG_LEVEL` env var

### Where it's used

- `src/app/api/payment/webhook/route.ts` — webhook errors
- `src/lib/email/index.ts` — mock email sends
- Add to any new API route or server action

## Analytics

### Setup

```env
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics (optional)
NEXT_PUBLIC_YM_ID=12345678            # Yandex Metrika (optional)
```

Both are optional — set whichever you use.

### How it works

`src/components/providers/analytics-provider.tsx` loads GA/YM scripts conditionally:

- Only when `NEXT_PUBLIC_FEATURE_ANALYTICS=true`
- Scripts load with `strategy="afterInteractive"` (no render blocking)

### Tracking events

```typescript
import { trackEvent, trackPageView } from '@/components/providers/analytics-provider'

// Track a custom event
trackEvent('add_to_cart', { productId: '123', price: 29.99 })

// Track a page view (automatically handled by GA, but can be called manually)
trackPageView('/checkout')
```

### Cookie Consent

`src/components/cookie-consent.tsx` shows a GDPR-compliant banner. Users can Accept or Decline. Consent is stored in `localStorage` under the key `cookie-consent`.

## Web Vitals

### What's measured

| Metric | Description               |
| ------ | ------------------------- |
| LCP    | Largest Contentful Paint  |
| FCP    | First Contentful Paint    |
| CLS    | Cumulative Layout Shift   |
| INP    | Interaction to Next Paint |
| TTFB   | Time to First Byte        |

### How it works

`src/components/web-vitals-reporter.tsx` is included in `AppProviders`. On page load, it initializes `web-vitals` library which measures all Core Web Vitals and sends them to:

1. **Google Analytics** (if `gtag` is available) — as custom events
2. **Console** (in development) — for debugging

### Viewing results

- **Google Analytics**: Reports → Web Vitals (or custom events with name `LCP`, `CLS`, etc.)
- **Development**: open browser console, look for `[Web Vitals]` messages
- **PageSpeed Insights**: validates real-world performance

### Customizing

Edit `src/lib/web-vitals.ts` to send metrics to your backend, Sentry, or any other analytics service:

```typescript
function sendToAnalytics(metric: Metric) {
  // Send to your custom endpoint
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  })
}
```
