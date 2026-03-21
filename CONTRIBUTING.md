# Contributing to Bazasite

## Setup

```bash
# Clone and install
git clone <repo-url>
cd baza-site
npm install

# Copy environment
cp .env.example .env.local

# Start dev server
npm run dev
```

## Development Workflow

1. Create a feature branch from `main`
2. Make changes
3. Run checks: `npm run lint && npm run test`
4. Commit (pre-commit hook runs lint-staged automatically)
5. Open a PR

## Scripts

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start dev server (Turbopack) |
| `npm run build`       | Production build             |
| `npm run lint`        | Lint with ESLint             |
| `npm run test`        | Run unit tests (Vitest)      |
| `npm run test:watch`  | Watch mode for tests         |
| `npm run test:e2e`    | Run E2E tests (Playwright)   |
| `npm run format`      | Format with Prettier         |
| `npm run db:generate` | Generate Drizzle migrations  |
| `npm run db:migrate`  | Run Drizzle migrations       |
| `npm run db:studio`   | Open Drizzle Studio          |

## Code Style

- ESLint + Prettier enforced via pre-commit hooks
- TypeScript strict mode
- Single quotes, trailing commas, 100 char print width
- Tailwind class sorting via prettier-plugin-tailwindcss

## Testing

- **Unit tests**: Vitest in `src/**/*.test.{ts,tsx}`
- **E2E tests**: Playwright in `e2e/`
- **Coverage**: `npx vitest run --coverage` (threshold for `src/lib/`)
- Use factories from `src/test/factories.ts` for mock data
- Use helpers from `src/test/helpers.ts` (`createMockRequest`, `withEnv`)

## Architecture: Adapter Pattern

All external integrations follow the same pattern:

```
src/lib/{module}/
  types.ts        # Interface definition
  index.ts        # Factory function with provider switch
  provider-a.ts   # Implementation A
  provider-b.ts   # Implementation B
```

### Adding a New Provider

1. Define your adapter implementing the interface in `types.ts`
2. Create `your-provider.ts` with the implementation
3. Add the provider to the factory switch in `index.ts`
4. Add any new env vars to `src/lib/env.ts` and `.env.example`
5. Write tests

### Existing Modules

| Module     | Interface          | Providers                |
| ---------- | ------------------ | ------------------------ |
| CMS        | `CMSAdapter`       | WordPress, Payload, mock |
| Payment    | `PaymentAdapter`   | Stripe, YooKassa, mock   |
| Chat       | `ChatAdapter`      | Tawk.to, Intercom, mock  |
| Email      | `EmailAdapter`     | Resend, mock             |
| Rate Limit | `RateLimitAdapter` | Memory, Redis (stub)     |
| Shop       | `ProductAdapter`   | mock                     |

## Feature Flags

Toggle modules via `.env.local`:

```env
NEXT_PUBLIC_FEATURE_BLOG=true
NEXT_PUBLIC_FEATURE_AUTH=true
NEXT_PUBLIC_FEATURE_SHOP=true
```

See `docs/feature-flags.md` for full list and presets.

## Animation Libraries

- **Motion** (default, active) - used in all pages
- **GSAP, AOS, AutoAnimate, Lottie** - opt-in, see `docs/animations.md`
