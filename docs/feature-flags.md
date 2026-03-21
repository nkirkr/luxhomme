# Feature Flags

## How It Works

The feature flags system lives in `src/lib/features.ts`. It reads `NEXT_PUBLIC_FEATURE_*` environment variables and exposes a typed object:

```typescript
export const features = {
  blog: process.env.NEXT_PUBLIC_FEATURE_BLOG === 'true',
  auth: process.env.NEXT_PUBLIC_FEATURE_AUTH === 'true',
  dashboard: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD === 'true',
  shop: process.env.NEXT_PUBLIC_FEATURE_SHOP === 'true',
  chat: process.env.NEXT_PUBLIC_FEATURE_CHAT === 'true',
  payment: process.env.NEXT_PUBLIC_FEATURE_PAYMENT === 'true',
  i18n: process.env.NEXT_PUBLIC_FEATURE_I18N === 'true',
  analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
  sentry: process.env.NEXT_PUBLIC_FEATURE_SENTRY === 'true',
} as const
```

The `NEXT_PUBLIC_` prefix makes these available on both server and client.

All flags are also validated via Zod in `src/lib/env.ts` at build time.

## All Flags

| Flag      | Module         | Route Group               | Dependencies                  |
| --------- | -------------- | ------------------------- | ----------------------------- |
| BLOG      | Blog           | `(blog)`                  | CMS_PROVIDER != none          |
| AUTH      | Auth           | `(auth)`                  | Standalone                    |
| DASHBOARD | Dashboard      | `(dashboard)`             | Requires AUTH                 |
| SHOP      | Shop           | `(shop)`                  | Requires PAYMENT for checkout |
| CHAT      | Chat           | No route group (widget)   | Standalone                    |
| PAYMENT   | Payment        | No route group (API only) | Standalone                    |
| I18N      | I18N           | Modifies all routes       | Standalone                    |
| ANALYTICS | Analytics      | No route group (provider) | Standalone                    |
| SENTRY    | Error Tracking | No route group (configs)  | Standalone                    |

## Where Flags Are Checked

1. **Route group layouts** — each module's `layout.tsx` calls `notFound()` if the flag is false
2. **Navigation** — `components/layout/header.tsx` and `footer.tsx` conditionally render nav links based on `features.blog`, `features.shop`, `features.auth`
3. **Sitemap** — `app/sitemap.ts` only includes routes for enabled modules
4. **Middleware** — `middleware.ts` only enforces auth redirects when `FEATURE_AUTH=true`
5. **Dashboard sidebar** — `(dashboard)/layout.tsx` shows "Orders" link only if `features.shop` is true
6. **Chat widget** — `components/chat/chat-widget.tsx` returns null if chat is disabled
7. **Analytics** — `components/providers/analytics-provider.tsx` renders nothing if analytics disabled
8. **Sentry** — `sentry.*.config.ts` files skip initialization if sentry disabled
9. **Cookie consent** — shown on all pages (in `AppProviders`)
10. **Web Vitals** — always active, sends data to GA if available

## Preset Configurations

Three presets (set in `.env.local`):

### Landing Page

All flags false, CMS_PROVIDER=none. Minimal build.

### Corporate Site

BLOG=true, I18N=true, ANALYTICS=true, CMS_PROVIDER=wordpress.

### E-Commerce

BLOG=true, AUTH=true, DASHBOARD=true, SHOP=true, CHAT=true, PAYMENT=true, I18N=true, ANALYTICS=true, SENTRY=true.

## Adding a New Feature Flag

1. Add `NEXT_PUBLIC_FEATURE_MYMODULE=false` to `.env.example` and `.env.local`
2. Add to `features` object in `src/lib/features.ts`
3. Add Zod validation in `src/lib/env.ts` (client schema): `NEXT_PUBLIC_FEATURE_MYMODULE: booleanFlag`
4. Create route group `src/app/(mymodule)/` with layout that checks the flag
5. Add navigation links conditionally in header/footer
6. Add routes to `sitemap.ts` conditionally

## Helper Functions

```typescript
import { isEnabled, getEnabledFeatures } from '@/lib/features'

// Check a single flag
if (isEnabled('analytics')) {
  // load tracking
}

// Get all enabled features
const enabled = getEnabledFeatures() // ['blog', 'auth', 'analytics']
```
