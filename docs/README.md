# Bazasite -- Modular Next.js Base Template

Bazasite is a production-ready, modular base template for building any type of website: landing pages, corporate sites, or full e-commerce stores. It is built on **Next.js 16** with the App Router and uses a **feature flags** system to activate only the modules you need.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.x (App Router, Turbopack, React Compiler, React 19) |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS 4.x + shadcn/ui (New York style) |
| Authentication | Better Auth v1.2+ (self-hosted) |
| CMS | Abstraction layer: WordPress (WPGraphQL) / Payload CMS v3 / none |
| Animations | Motion v12 (ex Framer Motion) + GSAP v3.13 |
| i18n | next-intl v4 |
| Dark Mode | next-themes |
| Deploy | Docker + nginx (self-hosted) |
| Package Manager | npm |

## Quick Start

```bash
# 1. Install dependencies
cd bazasite
npm install

# 2. Install shadcn/ui components
npx shadcn@latest add button input card dialog sheet navigation-menu sidebar \
  form sonner skeleton tabs accordion badge avatar dropdown-menu tooltip \
  breadcrumb separator scroll-area table select checkbox textarea label \
  popover progress alert

# 3. Copy environment file (already created as .env.local)
# Edit .env.local to configure your site

# 4. Start dev server
npm run dev
```

The site will be available at `http://localhost:3000`.

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

Blog, CMS, and optional internationalization.

```env
NEXT_PUBLIC_FEATURE_BLOG=true
NEXT_PUBLIC_FEATURE_AUTH=false
NEXT_PUBLIC_FEATURE_DASHBOARD=false
NEXT_PUBLIC_FEATURE_SHOP=false
NEXT_PUBLIC_FEATURE_CHAT=false
NEXT_PUBLIC_FEATURE_PAYMENT=false
NEXT_PUBLIC_FEATURE_I18N=true
CMS_PROVIDER=wordpress
```

### E-Commerce Store

Full stack: shop, auth, dashboard, payments, chat.

```env
NEXT_PUBLIC_FEATURE_BLOG=true
NEXT_PUBLIC_FEATURE_AUTH=true
NEXT_PUBLIC_FEATURE_DASHBOARD=true
NEXT_PUBLIC_FEATURE_SHOP=true
NEXT_PUBLIC_FEATURE_CHAT=true
NEXT_PUBLIC_FEATURE_PAYMENT=true
NEXT_PUBLIC_FEATURE_I18N=true
CMS_PROVIDER=payload
PAYMENT_PROVIDER=stripe
```

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | File structure, route groups, data flow diagrams |
| [Feature Flags](feature-flags.md) | How modules are enabled/disabled via .env |
| [Modules](modules.md) | Reference for all 7 modules (AUTH, BLOG, DASHBOARD, SHOP, CHAT, PAYMENT, I18N) |
| [CMS Integration](cms-integration.md) | WordPress, Payload CMS, and the adapter interface |
| [Design Workflow](design-workflow.md) | Figma import, custom components, shadcn/ui mapping |
| [Deployment](deployment.md) | Docker, nginx, PostgreSQL, environment variables |
| [SEO / GEO](seo-geo.md) | Metadata, JSON-LD, sitemaps, AI crawler rules |
| [Animations](animations.md) | Motion + GSAP system, variants, page transitions |

## Key Principles

1. **Modular**: every feature is a separate module, toggled by a single env var.
2. **Abstracted**: CMS, payment, and chat use adapter interfaces -- swap backends without changing pages.
3. **Responsive**: every component works from 320px mobile to 1440px+ desktop.
4. **Dark mode**: full light/dark support via CSS variables.
5. **SEO-first**: metadata, JSON-LD, sitemaps, and AI crawler optimization out of the box.
6. **Figma-ready**: cursor rules and skills for importing designs directly from Figma.
