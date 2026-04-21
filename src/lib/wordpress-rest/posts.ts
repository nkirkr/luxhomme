/**
 * Чтение записей блога через WordPress REST API (`/wp-json/wp/v2/posts`).
 * Базовый URL: `WORDPRESS_REST_URL` или `WOOCOMMERCE_URL`, иначе origin из `WORDPRESS_GRAPHQL_URL`.
 */

import { cache } from 'react'

const DEFAULT_REVALIDATE = 300

export function stripWpRendered(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripTags(html: string): string {
  return stripWpRendered(html)
}

export function wordpressRestBaseUrl(): string | undefined {
  const explicit = process.env.WORDPRESS_REST_URL?.trim().replace(/\/$/, '')
  if (explicit) return explicit
  const woo = process.env.WOOCOMMERCE_URL?.trim().replace(/\/$/, '')
  if (woo) return woo
  const gql = process.env.WORDPRESS_GRAPHQL_URL?.trim()
  if (gql) {
    try {
      return new URL(gql).origin
    } catch {
      /* ignore */
    }
  }
  return undefined
}

interface WPRenderedField {
  rendered?: string
}

export interface WpRestPostSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  link?: string
  featuredImageUrl?: string
}

interface WPEmbedded {
  'wp:featuredmedia'?: Array<{ source_url?: string }>
}

interface WPRestPostRow {
  id: number
  slug: string
  date?: string
  link?: string
  title?: WPRenderedField
  excerpt?: WPRenderedField
  content?: WPRenderedField
  _embedded?: WPEmbedded
}

function featuredImageFromRow(row: WPRestPostRow): string | undefined {
  const list = row._embedded?.['wp:featuredmedia']
  if (!Array.isArray(list) || list.length === 0) return undefined
  const u = list[0]?.source_url
  return typeof u === 'string' && u.trim() ? u.trim() : undefined
}

function mapPost(row: WPRestPostRow): WpRestPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: stripTags(row.title?.rendered ?? ''),
    excerpt: stripTags(row.excerpt?.rendered ?? ''),
    date: row.date ?? '',
    link: row.link,
    featuredImageUrl: featuredImageFromRow(row),
  }
}

export interface WpRestPostDetail extends WpRestPostSummary {
  /** HTML контента записи */
  contentHtml: string
}

function mapPostDetail(row: WPRestPostRow): WpRestPostDetail {
  const base = mapPost(row)
  return {
    ...base,
    contentHtml: row.content?.rendered ?? '',
  }
}

export type FetchWpPostsOptions = {
  /** per_page для REST (по умолчанию 20, макс. у WP обычно 100) */
  limit?: number
  /** номер страницы REST */
  page?: number
}

/**
 * Список опубликованных записей. Без базового URL возвращает пустой массив.
 */
export async function fetchWpPostsPublished(
  options: FetchWpPostsOptions = {},
): Promise<WpRestPostSummary[]> {
  const base = wordpressRestBaseUrl()
  if (!base) return []

  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100)
  const page = Math.max(options.page ?? 1, 1)

  const url = new URL(`${base}/wp-json/wp/v2/posts`)
  url.searchParams.set('per_page', String(limit))
  url.searchParams.set('page', String(page))
  url.searchParams.set('_embed', '1')
  url.searchParams.set('orderby', 'date')
  url.searchParams.set('order', 'desc')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: DEFAULT_REVALIDATE, tags: ['wordpress-posts'] },
  })

  if (!res.ok) {
    throw new Error(`WP REST posts: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as unknown
  if (!Array.isArray(data)) {
    throw new Error('WP REST posts: expected JSON array')
  }

  return data
    .filter(
      (row): row is WPRestPostRow =>
        row && typeof row === 'object' && typeof (row as WPRestPostRow).id === 'number',
    )
    .map(mapPost)
}

async function fetchWpPostBySlugUncached(slug: string): Promise<WpRestPostDetail | null> {
  const base = wordpressRestBaseUrl()
  if (!base || !slug.trim()) return null

  const url = new URL(`${base}/wp-json/wp/v2/posts`)
  url.searchParams.set('slug', slug.trim())
  url.searchParams.set('_embed', '1')
  url.searchParams.set('per_page', '1')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: DEFAULT_REVALIDATE, tags: ['wordpress-posts', `wordpress-post-${slug}`] },
  })

  if (!res.ok) return null
  const data = (await res.json()) as unknown
  if (!Array.isArray(data) || data.length === 0) return null
  const row = data[0]
  if (!row || typeof row !== 'object' || typeof (row as WPRestPostRow).id !== 'number') return null
  return mapPostDetail(row as WPRestPostRow)
}

/** Дедупликация в рамках одного запроса (metadata + page). */
export const fetchWpPostBySlug = cache(fetchWpPostBySlugUncached)

export function formatWpPostDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
