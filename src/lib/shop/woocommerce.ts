import type { CMSImage } from '@/lib/cms/types'
import type { Product, ProductAdapter } from './types'
import {
  hoverAttachmentIdFromMetaAndAcf,
  hoverImageUrlFromMetaAndAcf,
  instructionFileRowsFromMeta,
  previewAttachmentIdFromMetaAndAcf,
  previewImageUrlFromMetaAndAcf,
  specsDrawingAttachmentIdFromMetaAndAcf,
  specsDrawingUrlFromMetaAndAcf,
} from './product-detail-ui'

const BASE_URL = process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? ''
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? ''
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? ''
const CURRENCY = (process.env.WOOCOMMERCE_CURRENCY ?? 'RUB').trim() || 'RUB'
/** Set `WOOCOMMERCE_DEBUG_LOG=true` in `.env.local` — logs appear in the dev server terminal. */
const DEBUG_WOO = process.env.WOOCOMMERCE_DEBUG_LOG === 'true'

const DEFAULT_REVALIDATE = 120
/** WooCommerce rejects `per_page` above this (often 100). */
const WC_MAX_PER_PAGE = 100

function wooDebug(label: string, payload: unknown) {
  if (!DEBUG_WOO) return
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)
  console.log(`[WooCommerce REST] ${label}\n${text.slice(0, 14_000)}`)
}

interface WCImage {
  id: number
  src: string
  name: string
  alt: string
}

interface WCAttribute {
  id: number
  name: string
  options: string[]
  visible?: boolean
}

interface WCMetaRow {
  id?: number
  key: string
  value: unknown
}

interface WCProduct {
  id: number
  name: string
  slug: string
  type: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_status: string
  images: WCImage[]
  categories: Array<{ id: number; name: string; slug: string }>
  attributes: WCAttribute[]
  average_rating?: string
  rating_count?: number
  permalink?: string
  /** Стандарт WooCommerce REST — сюда попадают кастомные мета, в т.ч. ACF (если зарегистрированы для REST). */
  meta_data?: WCMetaRow[]
  /** Иногда ACF / тема добавляют сюда поля отдельным объектом. */
  acf?: Record<string, unknown>
}

interface WCVariation {
  id: number
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_status: string
}

interface WCCategory {
  id: number
  name: string
  slug: string
  count: number
}

function assertConfigured() {
  if (!BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(
      'WooCommerce REST: set WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, and WOOCOMMERCE_CONSUMER_SECRET',
    )
  }
}

function authHeader(): string {
  const token = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
  return `Basic ${token}`
}

async function wcFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<{ data: T; total: number }> {
  assertConfigured()
  const url = new URL(`${BASE_URL}/wp-json/wc/v3/${path.replace(/^\//, '')}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    next: { revalidate: DEFAULT_REVALIDATE, tags: ['woocommerce-products'] },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`WooCommerce REST ${res.status}: ${text.slice(0, 200)}`)
  }

  const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10)
  const data = (await res.json()) as T
  return { data, total }
}

function mapImages(images: WCImage[]): CMSImage[] {
  return images.map((img) => ({
    url: img.src,
    alt: img.alt || img.name || '',
    width: 0,
    height: 0,
  }))
}

function metaDataToRecord(rows: WCMetaRow[] | undefined): Record<string, unknown> {
  if (!rows?.length) return {}
  const out: Record<string, unknown> = {}
  for (const row of rows) {
    if (row?.key) out[row.key] = row.value
  }
  return out
}

function mapAttributes(attrs: WCAttribute[]): Array<{ name: string; value: string }> {
  return attrs
    .filter((a) => (a.visible ?? true) !== false)
    .map((a) => ({
      name: a.name,
      value: (a.options ?? []).join(', '),
    }))
    .filter((a) => a.value.length > 0)
}

function parseAmount(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : undefined
}

function baseMapWcProduct(wc: WCProduct): Product {
  const sale = parseAmount(wc.sale_price)
  const regular = parseAmount(wc.regular_price)
  let price = parseAmount(wc.price)
  if (price === undefined && sale !== undefined) price = sale
  if (price === undefined && regular !== undefined) price = regular
  if (price === undefined) price = 0

  let compareAt: number | undefined
  if (wc.on_sale && sale !== undefined && regular !== undefined && regular > sale) {
    compareAt = regular
  } else if (regular !== undefined && regular > price) {
    compareAt = regular
  }

  const avg = wc.average_rating ? parseFloat(wc.average_rating) : undefined

  const meta = metaDataToRecord(wc.meta_data)
  const acf =
    wc.acf && typeof wc.acf === 'object' && !Array.isArray(wc.acf)
      ? (wc.acf as Record<string, unknown>)
      : undefined

  return {
    id: String(wc.id),
    slug: wc.slug,
    name: wc.name,
    description: wc.description || wc.short_description || '',
    price,
    compareAtPrice: compareAt,
    currency: CURRENCY,
    images: mapImages(wc.images ?? []),
    categories: (wc.categories ?? []).map((c) => ({
      id: String(c.id),
      name: c.name,
      slug: c.slug,
    })),
    inStock: wc.stock_status === 'instock' || wc.stock_status === 'onbackorder',
    attributes: mapAttributes(wc.attributes ?? []),
    averageRating: Number.isFinite(avg) ? avg : undefined,
    ratingCount: wc.rating_count,
    permalink: wc.permalink,
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
    ...(acf && Object.keys(acf).length > 0 ? { acf } : {}),
  }
}

async function resolveVariablePricing(wc: WCProduct): Promise<WCProduct> {
  if (wc.type !== 'variable') return wc
  const hasPrice = parseAmount(wc.price) !== undefined
  if (hasPrice) return wc

  const { data: variations } = await wcFetch<WCVariation[]>(`products/${wc.id}/variations`, {
    per_page: 100,
  })

  const prices = variations
    .map((v) => parseAmount(v.price))
    .filter((n): n is number => n !== undefined)
  if (prices.length === 0) return wc

  const minPrice = Math.min(...prices)
  const regularCandidates = variations
    .map((v) => parseAmount(v.regular_price) ?? parseAmount(v.price))
    .filter((n): n is number => n !== undefined)
  const maxRegular = regularCandidates.length ? Math.max(...regularCandidates) : minPrice

  return {
    ...wc,
    price: String(minPrice),
    regular_price: String(maxRegular),
    on_sale: variations.some((v) => v.on_sale),
    sale_price: variations.find((v) => v.on_sale)?.sale_price ?? '',
  }
}

async function categoryIdForSlug(slug: string): Promise<number | undefined> {
  const { data } = await wcFetch<WCCategory[]>('products/categories', {
    slug,
    per_page: 1,
  })
  return data[0]?.id
}

interface WPMediaRow {
  id: number
  source_url?: string
}

/** Разрешить ID вложения → URL для карточки каталога (ACF «картинка как ID»). */
async function fetchWpMediaSourceUrls(ids: number[]): Promise<Map<number, string>> {
  const out = new Map<number, string>()
  if (!ids.length || !BASE_URL) return out
  const unique = [...new Set(ids)].filter((n) => Number.isInteger(n) && n > 0)
  const CHUNK = 50

  for (let i = 0; i < unique.length; i += CHUNK) {
    const chunk = unique.slice(i, i + CHUNK)
    const url = new URL(`${BASE_URL}/wp-json/wp/v2/media`)
    url.searchParams.set('include', chunk.join(','))
    url.searchParams.set('per_page', String(chunk.length))

    const headers = { Authorization: authHeader() }
    let res = await fetch(url.toString(), {
      headers,
      next: { revalidate: DEFAULT_REVALIDATE, tags: ['woocommerce-products'] },
    })
    if (!res.ok) {
      res = await fetch(url.toString(), {
        next: { revalidate: DEFAULT_REVALIDATE, tags: ['woocommerce-products'] },
      })
    }
    if (!res.ok) continue

    const body = (await res.json()) as WPMediaRow[] | { code?: string }
    if (!Array.isArray(body)) continue
    for (const row of body) {
      if (typeof row?.source_url === 'string' && row.source_url.trim()) {
        out.set(row.id, row.source_url.trim())
      }
    }
  }

  return out
}

async function attachCatalogPreviewImages(products: Product[]): Promise<Product[]> {
  const ids: number[] = []
  for (const p of products) {
    if (!previewImageUrlFromMetaAndAcf(p.meta, p.acf)) {
      const id = previewAttachmentIdFromMetaAndAcf(p.meta, p.acf)
      if (id) ids.push(id)
    }
    if (!hoverImageUrlFromMetaAndAcf(p.meta, p.acf)) {
      const id = hoverAttachmentIdFromMetaAndAcf(p.meta, p.acf)
      if (id) ids.push(id)
    }
  }
  if (!ids.length) return products

  const urlById = await fetchWpMediaSourceUrls(ids)
  if (urlById.size === 0) return products

  return products.map((p) => {
    let next: Product = p

    if (!previewImageUrlFromMetaAndAcf(p.meta, p.acf)) {
      const id = previewAttachmentIdFromMetaAndAcf(p.meta, p.acf)
      const url = id ? urlById.get(id) : undefined
      if (url) next = { ...next, catalogCardImageUrl: url }
    }

    if (!hoverImageUrlFromMetaAndAcf(p.meta, p.acf)) {
      const id = hoverAttachmentIdFromMetaAndAcf(p.meta, p.acf)
      const url = id ? urlById.get(id) : undefined
      if (url) next = { ...next, catalogCardHoverImageUrl: url }
    }

    return next
  })
}

function attachmentPageHref(attachmentId: number): string {
  if (!BASE_URL) return '#'
  const u = new URL(BASE_URL)
  u.searchParams.set('attachment_id', String(attachmentId))
  return u.toString()
}

async function attachInstructionDownloads(product: Product): Promise<Product> {
  const rows = instructionFileRowsFromMeta(product.meta, product.acf)
  if (!rows.length) return product

  const urlById = await fetchWpMediaSourceUrls(rows.map((r) => r.id))
  const instructionDownloads = rows.map((r) => ({
    label: r.title || 'Инструкция',
    href: urlById.get(r.id) ?? attachmentPageHref(r.id),
  }))

  return { ...product, instructionDownloads }
}

/** Схема характеристик: `char_image` и др. — URL или ID вложения → `source_url` из wp/v2/media. */
async function attachSpecsDrawingImage(product: Product): Promise<Product> {
  const direct = specsDrawingUrlFromMetaAndAcf(product.meta, product.acf)
  if (direct) return { ...product, specsDrawingUrl: direct }

  const id = specsDrawingAttachmentIdFromMetaAndAcf(product.meta, product.acf)
  if (!id) return product

  const urlById = await fetchWpMediaSourceUrls([id])
  const url = urlById.get(id) ?? attachmentPageHref(id)
  return { ...product, specsDrawingUrl: url }
}

function orderByFromSort(sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular'): {
  orderby: string
  order: 'asc' | 'desc'
} {
  switch (sort) {
    case 'price-asc':
      return { orderby: 'price', order: 'asc' }
    case 'price-desc':
      return { orderby: 'price', order: 'desc' }
    case 'popular':
      return { orderby: 'popularity', order: 'desc' }
    case 'newest':
    default:
      return { orderby: 'date', order: 'desc' }
  }
}

export const woocommerceAdapter: ProductAdapter = {
  async getProducts({ limit = 20, offset = 0, category, search, sort } = {}) {
    const { orderby, order } = orderByFromSort(sort)

    let categoryId: number | undefined
    if (category) {
      categoryId = await categoryIdForSlug(category)
      if (categoryId === undefined) {
        return { products: [], total: 0 }
      }
    }

    const collected: WCProduct[] = []
    let total = 0
    let page = Math.floor(offset / WC_MAX_PER_PAGE) + 1
    let skipInBatch = offset % WC_MAX_PER_PAGE

    while (collected.length < limit) {
      const { data, total: pageTotal } = await wcFetch<WCProduct[]>('products', {
        per_page: WC_MAX_PER_PAGE,
        page,
        category: categoryId,
        search: search?.trim() || undefined,
        orderby,
        order,
        status: 'publish',
      })

      if (page === Math.floor(offset / WC_MAX_PER_PAGE) + 1) {
        total = pageTotal
      }

      let batch = data
      if (skipInBatch > 0) {
        batch = batch.slice(skipInBatch)
        skipInBatch = 0
      }

      const room = limit - collected.length
      collected.push(...batch.slice(0, room))

      if (DEBUG_WOO && collected.length > 0 && page === Math.floor(offset / WC_MAX_PER_PAGE) + 1) {
        const first = data[0]
        if (first) {
          wooDebug(`list: first of ${data.length} on page ${page} (raw keys)`, Object.keys(first))
          wooDebug('list: first item raw (trimmed)', first)
        }
      }

      if (data.length < WC_MAX_PER_PAGE || collected.length >= limit) {
        break
      }
      page += 1
      if (page > 500) break
    }

    const mapped = collected.map((wc) => baseMapWcProduct(wc))
    return {
      products: await attachCatalogPreviewImages(mapped),
      total: total || collected.length,
    }
  },

  async getProductBySlug(slug) {
    const { data } = await wcFetch<WCProduct[]>('products', {
      slug,
      per_page: 1,
      status: 'publish',
    })
    const wc = data[0]
    if (!wc) return null

    const resolved = await resolveVariablePricing(wc)
    if (DEBUG_WOO) {
      wooDebug(`product slug=${slug} raw (full WC payload)`, resolved)
    }
    const mapped = baseMapWcProduct(resolved)
    if (DEBUG_WOO) {
      wooDebug(`product slug=${slug} mapped → Product`, mapped)
    }
    const [withPreview] = await attachCatalogPreviewImages([mapped])
    const withInstructions = await attachInstructionDownloads(withPreview)
    return attachSpecsDrawingImage(withInstructions)
  },

  async getProductCategories() {
    const { data } = await wcFetch<WCCategory[]>('products/categories', {
      per_page: 100,
      hide_empty: 1,
    })
    return data.map((c) => ({
      id: String(c.id),
      name: c.name,
      slug: c.slug,
      count: c.count,
    }))
  },

  async searchProducts(query, limit = 20) {
    const perPage = Math.min(Math.max(limit, 1), WC_MAX_PER_PAGE)
    const { data } = await wcFetch<WCProduct[]>('products', {
      search: query.trim(),
      per_page: perPage,
      status: 'publish',
    })
    const mapped = data.map((wc) => baseMapWcProduct(wc)).slice(0, limit)
    return attachCatalogPreviewImages(mapped)
  },
}
