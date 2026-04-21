import { cache } from 'react'
import { wordpressRestBaseUrl } from './posts'

const DEFAULT_REVALIDATE = 300

export type WpRestPageRecord = Record<string, unknown>

/** ACF Image / File как ID, строка с ID или объект с `id` / `ID`. */
export function acfAttachmentId(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return parseInt(value.trim(), 10)
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    if (typeof o.ID === 'number' && Number.isInteger(o.ID) && o.ID > 0) return o.ID
    if (typeof o.id === 'number' && Number.isInteger(o.id) && o.id > 0) return o.id
  }
  return undefined
}

interface WpMediaRow {
  id: number
  source_url?: string
}

/** Разрешить ID вложений → `source_url` (публичный REST, без ключей Woo). */
export async function fetchWpMediaSourceUrlsByIds(ids: number[]): Promise<Map<number, string>> {
  const out = new Map<number, string>()
  const base = wordpressRestBaseUrl()
  const unique = [...new Set(ids)].filter((n) => Number.isInteger(n) && n > 0)
  if (!base || unique.length === 0) return out

  const url = new URL(`${base}/wp-json/wp/v2/media`)
  url.searchParams.set('include', unique.join(','))
  url.searchParams.set('per_page', String(unique.length))

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: ['wordpress-media', ...unique.map((id) => `wordpress-media-${id}`)],
    },
  })

  if (!res.ok) return out
  const body = (await res.json()) as unknown
  if (!Array.isArray(body)) return out
  for (const row of body) {
    if (!row || typeof row !== 'object') continue
    const r = row as WpMediaRow
    if (typeof r.source_url === 'string' && r.source_url.trim()) {
      out.set(r.id, r.source_url.trim())
    }
  }
  return out
}

async function fetchWpPageBySlugUncached(slug: string): Promise<WpRestPageRecord | null> {
  const base = wordpressRestBaseUrl()
  if (!base || !slug.trim()) return null

  const url = new URL(`${base}/wp-json/wp/v2/pages`)
  url.searchParams.set('slug', slug.trim())
  url.searchParams.set('_embed', '1')
  url.searchParams.set('per_page', '1')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: DEFAULT_REVALIDATE, tags: ['wordpress-pages', `wordpress-page-${slug}`] },
  })

  if (!res.ok) return null
  const data = (await res.json()) as unknown
  if (!Array.isArray(data) || data.length === 0) return null
  const row = data[0]
  if (!row || typeof row !== 'object') return null
  return row as WpRestPageRecord
}

/** Одна страница по slug (как в URL на WP, обычно `about` для `/about/`). */
export const fetchWpPageBySlug = cache(fetchWpPageBySlugUncached)
