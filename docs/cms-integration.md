# CMS Integration

## Overview

The project uses an adapter pattern for CMS integration. All CMS access goes through the `CMSAdapter` interface defined in `src/lib/cms/types.ts`. The active adapter is selected by the `CMS_PROVIDER` environment variable.

## CMSAdapter Interface

```typescript
interface CMSAdapter {
  getPosts(options?: { limit?: number; offset?: number; category?: string }): Promise<{ posts: CMSPost[]; total: number }>
  getPostBySlug(slug: string, draft?: boolean): Promise<CMSPost | null>
  getPages(): Promise<CMSPage[]>
  getPageBySlug(slug: string, draft?: boolean): Promise<CMSPage | null>
  getCategories(): Promise<CMSCategory[]>
}
```

Shared types: `CMSPost` (id, slug, title, content, excerpt, date, featuredImage, categories), `CMSPage` (id, slug, title, content, featuredImage), `CMSImage` (url, alt, width, height), `CMSCategory` (id, name, slug).

## Providers

### None (CMS_PROVIDER=none)

Returns empty arrays for all methods. The app works without any CMS. Use this for landing pages or when content is hardcoded.

### WordPress (CMS_PROVIDER=wordpress)

File: `src/lib/cms/wordpress.ts`

Uses **WPGraphQL** (WordPress plugin required). Communicates via GraphQL queries.

Required env vars:
- `WORDPRESS_GRAPHQL_URL` -- e.g. `https://your-wp-site.com/graphql`
- `WP_APPLICATION_USER` -- WordPress username (for draft previews)
- `WP_APPLICATION_PASSWORD` -- Application password (for draft previews)
- `WP_PREVIEW_SECRET` -- Secret token for preview mode

Required WordPress plugins:
- WPGraphQL (https://www.wpgraphql.com/)
- WPGraphQL for ACF (if using Advanced Custom Fields)

### Payload CMS (CMS_PROVIDER=payload)

File: `src/lib/cms/payload.ts`

Uses **Payload REST API**. Communicates via fetch to `/api/posts`, `/api/pages`, `/api/categories`.

Required env vars:
- `PAYLOAD_API_URL` -- e.g. `https://your-payload-site.com`
- `PAYLOAD_API_KEY` -- API key for authentication

## Factory Function

`src/lib/cms/index.ts` exports `getCMS()` which lazy-loads the correct adapter based on `CMS_PROVIDER`:

```typescript
const cms = await getCMS()
const { posts } = await cms.getPosts({ limit: 20 })
```

The adapter is cached after first load (singleton pattern).

## Usage in Pages

All pages use the same code regardless of CMS provider:

```typescript
import { getCMS } from '@/lib/cms'

export default async function BlogPage() {
  const cms = await getCMS()
  const { posts } = await cms.getPosts({ limit: 20 })
  // render posts...
}
```

## Draft Preview

Two API routes handle content previews:

### `/api/draft` (GET)

Enables Next.js draft mode. Called from the CMS "Preview" button.

Parameters: `?secret=<REVALIDATION_SECRET>&slug=<page-slug>&type=post|page`

Flow: validates secret -> enables draftMode -> redirects to the page.

### `/api/revalidate` (POST)

On-demand revalidation. Called via webhook when CMS content changes.

Headers: `x-revalidate-secret: <REVALIDATION_SECRET>`
Body: `{ "tag": "posts" }` (or "pages", "categories", "all")

## Adding a New CMS Adapter

1. Create `src/lib/cms/mynewcms.ts` implementing `CMSAdapter`
2. Add a new case to the switch in `src/lib/cms/index.ts`
3. Add `CMS_PROVIDER=mynewcms` to `.env.example`
4. Add required env vars
