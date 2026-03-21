# Testing — Vitest + Playwright

## Overview

| Tool            | Scope                    | Config                   |
| --------------- | ------------------------ | ------------------------ |
| Vitest          | Unit / integration tests | `vitest.config.mts`      |
| Playwright      | E2E browser tests        | `playwright.config.ts`   |
| Testing Library | Component rendering      | `@testing-library/react` |

## Unit Tests (Vitest)

### Running tests

```bash
npm run test          # single run
npm run test:watch    # watch mode (re-run on file changes)
```

### Config

`vitest.config.mts` is configured with:

- `globals: true` — no need to import `describe`, `it`, `expect`
- `environment: 'node'` — default; switch to `jsdom` for component tests
- `@` path alias — mirrors Next.js paths

### Writing a test

Place test files next to the code they test, with `.test.ts` or `.test.tsx` suffix:

```
src/lib/validations/auth.ts        # source
src/lib/validations/auth.test.ts   # test
```

Example — testing Zod validation schemas:

```typescript
// src/lib/validations/auth.test.ts
import { loginSchema, registerSchema } from './auth'

describe('loginSchema', () => {
  it('accepts valid input', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })
})
```

### Testing React components

For component tests, use Testing Library:

```typescript
// src/components/__tests__/cookie-consent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CookieConsent } from '@/components/cookie-consent'

describe('CookieConsent', () => {
  beforeEach(() => localStorage.clear())

  it('shows banner when no consent stored', () => {
    render(<CookieConsent />)
    expect(screen.getByText(/cookies/i)).toBeInTheDocument()
  })

  it('hides on accept', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByText('Accept'))
    expect(localStorage.getItem('cookie-consent')).toBe('accepted')
  })
})
```

## E2E Tests (Playwright)

### Running E2E tests

```bash
npm run test:e2e      # headless
npm run test:e2e:ui   # interactive UI mode
```

Playwright auto-starts the dev server (`npm run dev`) before tests.

### Config

`playwright.config.ts` runs tests in:

- Desktop Chrome
- Desktop Firefox
- Mobile (iPhone 14)

### Writing E2E tests

E2E tests live in the `e2e/` folder:

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads and shows title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/bazasite/i)
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=About')
  await expect(page).toHaveURL(/about/)
})

test('theme toggle switches dark mode', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  await page.click('[data-testid="theme-toggle"]')
  await expect(html).toHaveClass(/dark/)
})
```

### Installing browsers

First time only:

```bash
npx playwright install
```

## CI Integration

Tests run automatically on every push/PR via `.github/workflows/ci.yml`:

1. `npm run lint` — ESLint
2. `npm run test` — Vitest unit tests
3. `npm run build` — Production build

E2E tests can be added to CI by uncommenting the Playwright step in the workflow.

## Best Practices

- Keep unit tests fast — mock external dependencies
- Use `@testing-library/react` for components, not direct DOM manipulation
- E2E tests should cover critical user flows, not every edge case
- Run `npm run test` before committing (enforced via Husky pre-commit hook through lint-staged)
