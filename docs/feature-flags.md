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
} as const
```

The `NEXT_PUBLIC_` prefix makes these available on both server and client.

## All Modules

| Flag | Module | Route Group | Dependencies |
|------|--------|-------------|--------------|
| BLOG | Blog | `(blog)` | CMS_PROVIDER != none |
| AUTH | Auth | `(auth)` | Standalone |
| DASHBOARD | Dashboard | `(dashboard)` | Requires AUTH |
| SHOP | Shop | `(shop)` | Requires PAYMENT for checkout |
| CHAT | Chat | No route group (widget) | Standalone |
| PAYMENT | Payment | No route group (API only) | Standalone |
| I18N | I18N | Modifies all routes | Standalone |

## Where Flags Are Checked

1. **Route group layouts** -- each module's `layout.tsx` calls `notFound()` if the flag is false
2. **Navigation** -- `components/layout/header.tsx` and `footer.tsx` conditionally render nav links based on `features.blog`, `features.shop`, `features.auth`
3. **Sitemap** -- `app/sitemap.ts` only includes routes for enabled modules
4. **Proxy** -- `proxy.ts` only enforces auth redirects when `FEATURE_AUTH=true`
5. **Dashboard sidebar** -- `(dashboard)/layout.tsx` shows "Orders" link only if `features.shop` is true
6. **Chat widget** -- `components/chat/chat-widget.tsx` returns null if chat is disabled
7. **Providers** -- `app-providers.tsx` can conditionally wrap with i18n provider

## Preset Configurations

Three presets (set in `.env.local`):

### Landing Page
All flags false, CMS_PROVIDER=none.

### Corporate Site
BLOG=true, I18N=true, CMS_PROVIDER=wordpress.

### E-Commerce
BLOG=true, AUTH=true, DASHBOARD=true, SHOP=true, CHAT=true, PAYMENT=true, I18N=true.

## Adding a New Feature Flag

1. Add `NEXT_PUBLIC_FEATURE_MYMODULE=false` to `.env.example` and `.env.local`
2. Add to `features` object in `src/lib/features.ts`
3. Create route group `src/app/(mymodule)/` with layout that checks the flag
4. Add navigation links conditionally in header/footer
5. Add routes to `sitemap.ts` conditionally
