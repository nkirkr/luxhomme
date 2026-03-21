# Bazasite — Modular Next.js Base Template

Bazasite is a production-ready, modular base template for building any type of website: landing pages, corporate sites, or full e-commerce stores. It is built on **Next.js 16** with the App Router and uses a **feature flags** system to activate only the modules you need.

## Tech Stack

| Layer          | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack, React Compiler, React 19)     |
| Language       | TypeScript 5.x (strict mode)                                     |
| Styling        | Tailwind CSS 4.x + shadcn/ui (42 components pre-installed)       |
| Database       | Drizzle ORM + PostgreSQL                                         |
| Authentication | Better Auth v1.2+ (self-hosted)                                  |
| CMS            | Adapter layer: WordPress (WPGraphQL) / Payload CMS v3 / none     |
| Payment        | Adapter layer: Stripe / YooKassa / none                          |
| Chat           | Adapter layer: Tawk.to / Intercom / none                         |
| Email          | Adapter layer: Resend / mock                                     |
| Animations     | Motion v12, GSAP, AOS, AutoAnimate, Lottie, Magic UI, Aceternity |
| Analytics      | Google Analytics + Yandex Metrika (feature-flagged)              |
| Monitoring     | Sentry (errors), Pino (logs), Web Vitals (perf metrics)          |
| i18n           | next-intl v4 (en/ru)                                             |
| Dark Mode      | next-themes                                                      |
| Testing        | Vitest (unit/integration), Playwright (E2E)                      |
| Code Quality   | ESLint + Prettier + Husky + lint-staged                          |
| CI/CD          | GitHub Actions + Dependabot                                      |
| Deploy         | Docker + nginx (self-hosted)                                     |

## Quick Start

```bash
# 1. Install dependencies (shadcn/ui components already included)
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set site URL, enable features, add API keys

# 3. Start dev server
npm run dev
```

The site will be available at `http://localhost:3000`.

All 42 shadcn/ui components are pre-installed — no need for `npx shadcn@latest add`. If you need additional components later:

```bash
npx shadcn@latest add [component-name]
```

## Preset Configurations

Edit `.env.local` to match your site type:

### Landing Page (default)

All modules off. Pure marketing pages with animations.

```env
NEXT_PUBLIC_FEATURE_BLOG=false
NEXT_PUBLIC_FEATURE_AUTH=false
NEXT_PUBLIC_FEATURE_DASHBOARD=false
NEXT_PUBLIC_FEATURE_SHOP=false
NEXT_PUBLIC_FEATURE_CHAT=false
NEXT_PUBLIC_FEATURE_PAYMENT=false
NEXT_PUBLIC_FEATURE_I18N=false
CMS_PROVIDER=none
```

### Corporate Site

Blog, CMS, analytics, and internationalization.

```env
NEXT_PUBLIC_FEATURE_BLOG=true
NEXT_PUBLIC_FEATURE_AUTH=false
NEXT_PUBLIC_FEATURE_SHOP=false
NEXT_PUBLIC_FEATURE_CHAT=false
NEXT_PUBLIC_FEATURE_PAYMENT=false
NEXT_PUBLIC_FEATURE_I18N=true
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
CMS_PROVIDER=wordpress
```

### E-Commerce Store

Full stack: shop, auth, dashboard, payments, chat, Sentry, analytics.

```env
NEXT_PUBLIC_FEATURE_BLOG=true
NEXT_PUBLIC_FEATURE_AUTH=true
NEXT_PUBLIC_FEATURE_DASHBOARD=true
NEXT_PUBLIC_FEATURE_SHOP=true
NEXT_PUBLIC_FEATURE_CHAT=true
NEXT_PUBLIC_FEATURE_PAYMENT=true
NEXT_PUBLIC_FEATURE_I18N=true
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_SENTRY=true
CMS_PROVIDER=payload
PAYMENT_PROVIDER=stripe
CHAT_PROVIDER=tawkto
EMAIL_PROVIDER=resend
DATABASE_URL=postgresql://bazasite:changeme@localhost:5432/bazasite
```

## All Scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Dev server (Turbopack)                    |
| `npm run build`        | Production build                          |
| `npm run start`        | Start after build                         |
| `npm run lint`         | ESLint check                              |
| `npm run format`       | Prettier — format all files               |
| `npm run format:check` | Prettier — check without changes          |
| `npm run test`         | Vitest — run unit tests                   |
| `npm run test:watch`   | Vitest — watch mode                       |
| `npm run test:e2e`     | Playwright — E2E tests                    |
| `npm run test:e2e:ui`  | Playwright — interactive UI mode          |
| `npm run db:generate`  | Drizzle — generate migrations from schema |
| `npm run db:migrate`   | Drizzle — apply migrations                |
| `npm run db:push`      | Drizzle — push schema to DB (dev)         |
| `npm run db:studio`    | Drizzle Studio — visual DB browser        |

## Documentation Index

| Document                              | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| [Architecture](architecture.md)       | File structure, route groups, data flow diagrams             |
| [Modules](modules.md)                 | All modules: auth, blog, shop, payment, chat, email, i18n    |
| [Feature Flags](feature-flags.md)     | How modules are enabled/disabled via .env                    |
| [Database](database.md)               | Drizzle ORM, schema, migrations, queries                     |
| [Testing](testing.md)                 | Vitest (unit), Playwright (E2E), writing tests               |
| [Code Quality](code-quality.md)       | ESLint, Prettier, Husky, lint-staged, CI                     |
| [Monitoring](monitoring.md)           | Sentry, Pino logging, analytics, Web Vitals                  |
| [Security](security.md)               | HTTP headers, rate limiting, env validation, GDPR            |
| [CMS Integration](cms-integration.md) | WordPress, Payload CMS, adapter interface                    |
| [Design Workflow](design-workflow.md) | Figma import, custom components, shadcn/ui mapping           |
| [Deployment](deployment.md)           | Docker, nginx, PostgreSQL, environment variables             |
| [SEO / GEO](seo-geo.md)               | Metadata, JSON-LD, sitemaps, AI crawler rules                |
| [Animations](animations.md)           | Motion, GSAP, AOS, AutoAnimate, Lottie, Magic UI, Aceternity |

## Key Principles

1. **Modular**: every feature is a separate module, toggled by a single env var.
2. **Abstracted**: CMS, payment, chat, and email use adapter interfaces — swap backends without changing pages.
3. **Tested**: unit tests with Vitest, E2E tests with Playwright, CI on every PR.
4. **Secure**: security headers, rate limiting, env validation, cookie consent out of the box.
5. **Observable**: Sentry errors, Pino structured logs, Web Vitals, analytics — all feature-flagged.
6. **Responsive**: every component works from 320px mobile to 1440px+ desktop.
7. **Dark mode**: full light/dark support via CSS variables.
8. **SEO-first**: metadata, JSON-LD, sitemaps, and AI crawler optimization.
9. **Figma-ready**: cursor rules and skills for importing designs directly from Figma.
