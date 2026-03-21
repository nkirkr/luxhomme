# Security — Headers, Rate Limiting, Env Validation, GDPR

## HTTP Security Headers

Configured in `next.config.ts` and `docker/nginx.conf` for all routes:

| Header                      | Value                                          | Purpose                  |
| --------------------------- | ---------------------------------------------- | ------------------------ |
| `X-DNS-Prefetch-Control`    | `on`                                           | Speeds up DNS lookups    |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years |
| `X-Frame-Options`           | `SAMEORIGIN`                                   | Prevents clickjacking    |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevents MIME sniffing   |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Controls referrer info   |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | Restricts browser APIs   |

These apply automatically to every response — no code changes needed.

## Rate Limiting

### How it works

`src/lib/rate-limit.ts` provides an in-memory rate limiter with two preconfigured instances:

| Limiter       | Limit       | Window     | Used for                     |
| ------------- | ----------- | ---------- | ---------------------------- |
| `authLimiter` | 5 requests  | 60 seconds | Auth endpoints               |
| `apiLimiter`  | 30 requests | 60 seconds | API endpoints (search, etc.) |

### Usage in API routes

```typescript
import { apiLimiter } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = apiLimiter.check(`endpoint:${ip}`)

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // ... handle request
}
```

### Where it's applied

- `/api/auth/[...all]` — `authLimiter` on POST (login/register brute force protection)
- `/api/search` — `apiLimiter` (prevents abuse)

### Creating a custom limiter

```typescript
import { rateLimit } from '@/lib/rate-limit'

const contactLimiter = rateLimit({
  interval: 300_000, // 5 minutes
  limit: 3, // 3 submissions
})
```

### Production note

The built-in limiter is in-memory — it resets on server restart and doesn't share state across instances. For multi-instance deployments, replace with Redis-backed rate limiting (e.g., `@upstash/ratelimit`).

## Environment Variable Validation

### How it works

`src/lib/env.ts` validates all environment variables at build time using Zod schemas:

- **Server schema**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, provider configs, API keys
- **Client schema**: `NEXT_PUBLIC_*` flags, IDs, URLs

Validation runs when `next.config.ts` imports `./src/lib/env.js`. If any required variable is invalid or missing, the build fails with a clear error message showing which variables are wrong.

### Example error

```
Invalid server environment variables:
{
  DATABASE_URL: ['Invalid url']
}
Error: Invalid server environment variables
```

### Adding new env vars

1. Add the variable to `.env.example` with a description
2. Add Zod validation to `src/lib/env.ts`:

```typescript
// In serverSchema or clientSchema:
MY_NEW_VAR: z.string().min(1),                    // required string
MY_OPTIONAL_VAR: z.string().optional(),            // optional
MY_FEATURE_FLAG: booleanFlag,                      // 'true'/'false' → boolean
MY_URL: z.string().url().optional(),               // validated URL
MY_ENUM: z.enum(['a', 'b', 'c']).default('a'),    // enum with default
```

3. The variable will be validated on the next `npm run build` or `npm run dev`.

## GDPR / Cookie Consent

### Component

`src/components/cookie-consent.tsx` renders a bottom banner with **Accept** and **Decline** buttons. It:

- Shows only if no consent has been stored
- Stores consent in `localStorage` under `cookie-consent`
- Values: `'accepted'` or `'declined'`
- Included in `AppProviders` — shows on every page automatically

### Customizing

To conditionally load analytics/tracking scripts based on consent:

```typescript
const consent = localStorage.getItem('cookie-consent')
if (consent === 'accepted') {
  // Load tracking scripts
}
```

### For Russian sites

The cookie banner satisfies the requirements of 152-FZ (Russian data protection law) for cookie/analytics consent disclosure.

## Middleware (Route Protection)

`middleware.ts` handles:

- Auth route protection (redirects unauthenticated users)
- i18n locale detection

Protected route groups:

- `/(dashboard)/*` — requires authentication
- `/(admin)/*` — requires authentication (add admin role check as needed)

## File Upload Security

`src/components/file-upload.tsx` includes:

- File type restriction via `accept` prop
- Max file size validation (`maxSize` prop, default 5MB)
- Client-side validation before upload
