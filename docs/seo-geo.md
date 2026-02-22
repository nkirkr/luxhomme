# SEO and GEO Optimization

## Overview

The project includes comprehensive SEO and GEO (Generative Engine Optimization) support. GEO optimizes content for AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews) in addition to traditional search.

## Metadata

### Root Layout (`src/app/layout.tsx`)

Sets default metadata for the entire site:
- `metadataBase` -- base URL for resolving relative paths
- `title.template` -- `%s | Site Name` pattern for child pages
- OpenGraph and Twitter card defaults
- Google bot directives (index, follow, max image/video/snippet)
- Viewport configuration with theme-color for light/dark

### Dynamic Metadata (`generateMetadata`)

Used on pages with dynamic content (blog posts, products, CMS pages):

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await cms.getPostBySlug(slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { ... },
  }
}
```

## JSON-LD Structured Data

File: `src/components/seo/json-ld.tsx`

Available components:

| Component | Schema Type | Used On |
|-----------|------------|---------|
| `OrganizationJsonLd` | Organization | Homepage |
| `WebSiteJsonLd` | WebSite | Homepage |
| `ArticleJsonLd` | Article | Blog posts |
| `ProductJsonLd` | Product + Offer | Product pages |
| `BreadcrumbJsonLd` | BreadcrumbList | All pages with breadcrumbs |
| `FAQJsonLd` | FAQPage | FAQ sections |

Usage:
```typescript
<ArticleJsonLd
  title={post.title}
  description={post.excerpt}
  url={absoluteUrl(`/blog/${slug}`)}
  image={post.featuredImage?.url}
  datePublished={post.date}
  authorName="Author"
  publisherName={siteName}
  publisherLogo={`${siteUrl}/logo.png`}
/>
```

## Sitemap (`src/app/sitemap.ts`)

Dynamically generated. Includes:
- Static routes: `/`, `/about`, `/contact`
- Blog routes (if `FEATURE_BLOG=true`): `/blog`
- Shop routes (if `FEATURE_SHOP=true`): `/products`
- CMS content routes can be added by fetching from the CMS adapter

## Robots.txt (`src/app/robots.ts`)

Configured with AI crawler awareness:

| User-Agent | Rule | Reason |
|-----------|------|--------|
| `*` | Allow `/`, Disallow `/api/`, `/dashboard/`, `/admin/` | Standard crawling |
| `ChatGPT-User` | Allow `/` | Citations link back to site |
| `PerplexityBot` | Allow `/` | Citations link back to site |
| `GPTBot` | Disallow `/` | Training only, no attribution |
| `Google-Extended` | Disallow `/` | Training only |
| `ClaudeBot` | Disallow `/` | Training only |

## OG Image Generation (`src/app/opengraph-image.tsx`)

Edge-rendered dynamic Open Graph image (1200x630px). Shows site name with gradient background. Can be extended per-page by creating `opengraph-image.tsx` in any route segment.

## Core Web Vitals Optimizations

- **LCP**: Hero images use `priority` prop, fonts use `display: swap`
- **CLS**: Images always have width/height, skeleton loading states
- **INP**: Minimal client JavaScript (Server Components by default), React Compiler for auto-memoization
- **TTFB**: Standalone output, streaming with Suspense

## Breadcrumbs (`src/components/seo/breadcrumbs.tsx`)

Renders visible breadcrumb navigation with paired `BreadcrumbList` JSON-LD markup. Used on blog posts, products, and CMS pages.
