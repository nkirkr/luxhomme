# CLAUDE.md

## Project Overview

**Bazasite** — modular Next.js 16 template for building landing pages, corporate sites, and e-commerce stores. Core + Modules architecture: enable only what you need via feature flags.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React Compiler, React 19)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: CSS Modules для кастомного кода + Tailwind CSS 4 только для shadcn/ui компонентов
- **Auth**: Better Auth v1.2+ (self-hosted, email/password + OAuth)
- **CMS**: Adapter pattern — WordPress (WPGraphQL) / Payload CMS / none
- **Payment**: Adapter pattern — Stripe / YooKassa / none
- **Chat**: Adapter pattern — Tawk.to / Intercom / none
- **Email**: Adapter pattern — Resend / mock
- **Animations**: Motion v12 (Framer Motion)
- **Analytics**: Google Analytics + Yandex Metrika (feature-flagged)
- **i18n**: next-intl v4 (en/ru)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: ESLint + Prettier + Husky + lint-staged

## Commands

```bash
npm run dev            # Dev server (Turbopack)
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Vitest unit tests
npm run test:watch     # Vitest watch mode
npm run test:e2e       # Playwright E2E
npm run format         # Prettier format all
```

## Architecture

### Route Groups

| Group         | URL Examples                          | Feature Flag |
| ------------- | ------------------------------------- | ------------ |
| `(marketing)` | `/`, `/about`, `/contact`             | Always on    |
| `(blog)`      | `/blog`, `/blog/[slug]`               | BLOG         |
| `(auth)`      | `/login`, `/register`                 | AUTH         |
| `(dashboard)` | `/dashboard`, `/profile`, `/settings` | DASHBOARD    |
| `(shop)`      | `/products`, `/cart`, `/checkout`     | SHOP         |

### Feature Flags

All flags in `src/lib/features.ts`, validated via Zod in `src/lib/env.ts`. Set in `.env.local`:

```
NEXT_PUBLIC_FEATURE_BLOG=false
NEXT_PUBLIC_FEATURE_AUTH=false
NEXT_PUBLIC_FEATURE_DASHBOARD=false
NEXT_PUBLIC_FEATURE_SHOP=false
NEXT_PUBLIC_FEATURE_CHAT=false
NEXT_PUBLIC_FEATURE_PAYMENT=false
NEXT_PUBLIC_FEATURE_I18N=false
NEXT_PUBLIC_FEATURE_ANALYTICS=false
```

Disabled modules return 404 via layout guards.

### Adapter Pattern

All external integrations follow the same structure:

```
src/lib/{module}/
├── types.ts        # Interface
├── index.ts        # Factory (reads env, returns adapter)
├── provider-a.ts   # Implementation A
└── provider-b.ts   # Implementation B
```

Swap backends by changing env vars, not code.

### Key Files

| File                                         | Purpose                              |
| -------------------------------------------- | ------------------------------------ |
| `src/lib/features.ts`                        | Feature flags object                 |
| `src/lib/env.ts`                             | Zod env validation (server + client) |
| `src/lib/cms/index.ts`                       | CMS adapter factory                  |
| `src/lib/shop/index.ts`                      | Shop adapter factory                 |
| `src/lib/payment/index.ts`                   | Payment adapter factory              |
| `src/lib/auth.ts`                            | Better Auth server config            |
| `middleware.ts`                              | Auth cookie checks, route protection |
| `src/components/providers/app-providers.tsx` | Root providers composition           |

## Code Conventions

- **Tests** next to source: `foo.ts` + `foo.test.ts`
- **Prettier**: single quotes, no semicolons, trailing commas, 100 char width
- **Imports**: `@/` alias for `src/`
- **Components**: shadcn/ui in `src/components/ui/`, custom in `src/components/`
- **Validation**: Zod schemas in `src/lib/validations/`
- **Pre-commit**: Husky runs ESLint + Prettier on staged files automatically

## Styling Rules — IMPORTANT

**Гибридный подход: CSS Modules + Tailwind только для shadcn/ui.**

### Кастомный код (страницы, компоненты) → CSS Modules

- Каждый компонент имеет рядом файл `ComponentName.module.css`
- Стили пишутся через CSS-переменные из `globals.css`: `var(--color-cook)`, `var(--text-h1)` и т.д.
- НЕЛЬЗЯ использовать Tailwind-классы в кастомных компонентах (не в `src/components/ui/`)
- НЕЛЬЗЯ хардкодить цвета, размеры шрифтов — только через CSS-переменные

### shadcn/ui (`src/components/ui/`) → Tailwind остаётся

- Компоненты из `src/components/ui/` используют Tailwind — не трогать
- При использовании shadcn-компонентов в кастомном коде — обёртки стилизуются через CSS Modules

### Дизайн токены

Все токены определены в `src/styles/globals.css`:

- Цвета: `--color-cook`, `--color-clean`, `--color-care`, `--color-site-bg`, `--color-stroke` и др.
- Шрифты: `--font-helvetica`, `--font-gogol`
- Размеры текста: `--text-h1`, `--text-h2`, `--text-h3`, `--text-ls`, `--text-m`, `--text-s` и др.
- Радиусы: `--radius-tag`, `--radius-card`, `--radius-pill`, `--radius-club`
- Градиенты: `--gradient-pink`, `--gradient-blue`, `--gradient-hero`, `--gradient-card`

### Ассеты (Figma)

- Изображения: `public/images/` (hero-bg.jpg, product-card.png, news-home-\*.jpg и др.)
- Иконки/SVG: `public/icons/` (logo.svg, arrow-up-right.svg, profile.svg, basket.svg и др.)

## Module Dependencies

```
Dashboard → requires Auth
Shop → uses Payment (for checkout)
Blog → uses CMS adapter
Payment → uses Email (for confirmations)
```
