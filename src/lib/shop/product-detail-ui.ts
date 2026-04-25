import type { Product as ShopProduct } from './types'
import type { Product as CatalogProduct } from '@/components/sections/series-catalog/SeriesCatalog'
import { formatShopPrice } from './format-price'

const FALLBACK_HERO = '/images/product-hero.jpg'
const FALLBACK_CARD = '/images/product-card.png'
const FALLBACK_SPECS_DRAWING = '/images/specs.png'

export type SpecRow = { label: string; value: string }

export type SpecGroup = { title: string; rows: SpecRow[] }

/** Shape expected by `ProductTabs` (description, specs, reviews UI). */
export type ProductDetailForTabs = {
  productId: string
  /**
   * Ссылки на карточку товара на МП из meta Woo (`_wb_link`, `_ozon_link` и варианты без `_`).
   * Для бейджа отзыва: если пусто — бейдж ведёт на главную маркетплейса.
   */
  marketplaceProductUrls: { wb?: string; ozon?: string }
  descSlides: { image: string; title: string; text: string }[]
  /**
   * Характеристики из `meta._second_description` (JSON по группам).
   * Если задано — `ProductTabs` рендерит таблицу из него; иначе — из `specs.*`.
   */
  specsGroups?: SpecGroup[]
  specs: {
    main: SpecRow[]
    general: SpecRow[]
    power: SpecRow[]
    control: SpecRow[]
    tech: SpecRow[]
    materials: SpecRow[]
    extra: SpecRow[]
    dimensions: SpecRow[]
  }
  accessories: { name: string; image: string; giftBadge?: string }[]
  instructionFiles: { label: string; href: string }[]
  /** Чертёж слева от таблицы характеристик (`specsDrawingUrl` с бэка или статичный fallback). */
  specsDrawingSrc: string
  /** @deprecated Fallback — основной рейтинг приходит из useReviews hook */
  ratingAvg: string
}

const ACCESSORY_META_KEYS = ['_product_accessories', 'product_accessories'] as const

const WB_PRODUCT_URL_META_KEYS = ['_wb_link', 'wb_link'] as const
const OZON_PRODUCT_URL_META_KEYS = ['_ozon_link', 'ozon_link'] as const

const PRODUCT_SLIDES_META_KEYS = ['_product_slides', 'product_slides'] as const

/** JSON характеристик (вкладка «Характеристики» в админке) — строка или объект в meta/acf. */
const SECOND_DESCRIPTION_META_KEYS = ['_second_description', 'second_description'] as const

/** Превью для сетки каталога: Woo meta / ACF REST (часто ACF Image = id или объект с sizes). */
const PREVIEW_IMAGE_META_KEYS = [
  'preview_image',
  '_preview_image',
  'catalog_preview_image',
  '_catalog_preview_image',
] as const

/** Фон карточки при наведении (по дизайну — полноразмерная картинка). */
const HOVER_IMAGE_META_KEYS = ['preview_bg', '_preview_bg'] as const

/** Чертёж / схема в секции характеристик на PDP (ACF / кастомное поле товара). */
const SPECS_DRAWING_META_KEYS = [
  'char_image',
  '_char_image',
  'specs_drawing',
  '_specs_drawing',
] as const

function pickMeta(bag: Record<string, unknown> | undefined, keys: readonly string[]): unknown {
  if (!bag) return undefined
  for (const k of keys) {
    const v = bag[k]
    if (v != null && v !== '') return v
  }
  return undefined
}

function pickMetaString(
  meta: Record<string, unknown> | undefined,
  acf: Record<string, unknown> | undefined,
  keys: readonly string[],
): string | undefined {
  const raw = pickMeta(meta, keys) ?? pickMeta(acf, keys)
  if (typeof raw !== 'string') return undefined
  const s = raw.trim()
  if (!s) return undefined
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  return undefined
}

export function marketplaceProductUrlsFromProduct(p: ShopProduct): {
  wb?: string
  ozon?: string
} {
  const wb = pickMetaString(p.meta, p.acf, WB_PRODUCT_URL_META_KEYS)
  const ozon = pickMetaString(p.meta, p.acf, OZON_PRODUCT_URL_META_KEYS)
  const out: { wb?: string; ozon?: string } = {}
  if (wb) out.wb = wb
  if (ozon) out.ozon = ozon
  return out
}

function parseJsonIfString(raw: unknown): unknown | undefined {
  if (typeof raw !== 'string') return undefined
  const s = raw.trim()
  if (!s.startsWith('[') && !s.startsWith('{')) return undefined
  try {
    return JSON.parse(s) as unknown
  } catch {
    return undefined
  }
}

function formatSpecCellValue(v: unknown): string {
  if (v == null || v === '') return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) {
    return v
      .map((x) => formatSpecCellValue(x))
      .filter((s) => s.length > 0)
      .join(', ')
  }
  return ''
}

/** Парсит JSON из `_second_description`: группа → объект «параметр → значение» (строка или массив строк). */
function parseSecondDescriptionSpecGroups(raw: unknown): SpecGroup[] | undefined {
  let root: unknown = raw
  if (typeof raw === 'string') {
    const parsed = parseJsonIfString(raw)
    if (parsed === undefined) return undefined
    root = parsed
  }
  if (!root || typeof root !== 'object' || Array.isArray(root)) return undefined

  const groups: SpecGroup[] = []
  for (const [groupTitle, groupVal] of Object.entries(root as Record<string, unknown>)) {
    if (!groupTitle.trim()) continue
    if (!groupVal || typeof groupVal !== 'object' || Array.isArray(groupVal)) continue
    const rows: SpecRow[] = []
    for (const [label, value] of Object.entries(groupVal as Record<string, unknown>)) {
      const val = formatSpecCellValue(value)
      if (!val) continue
      rows.push({ label, value: val })
    }
    if (rows.length > 0) groups.push({ title: groupTitle, rows })
  }
  return groups.length > 0 ? groups : undefined
}

function specGroupsFromProductMeta(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): SpecGroup[] | undefined {
  const raw =
    pickMeta(meta, SECOND_DESCRIPTION_META_KEYS) ?? pickMeta(acf, [...SECOND_DESCRIPTION_META_KEYS])
  return parseSecondDescriptionSpecGroups(raw)
}

function coerceAccessoryList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return [raw]
  const parsed = parseJsonIfString(raw)
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') return [parsed]
  if (typeof raw === 'string') {
    const s = raw.trim()
    if (/^\d+(,\d+)*$/.test(s)) return s.split(',').map((x) => Number.parseInt(x, 10))
  }
  return []
}

function imageUrlFromUnknown(v: unknown): string {
  const u = coerceImageUrlFromFieldValue(v)
  return u ?? ''
}

/** Нормализует URL для `<img src>` (ACF / WP media / строка JSON). */
export function coerceImageUrlFromFieldValue(v: unknown): string | undefined {
  if (v == null || v === '') return undefined
  if (typeof v === 'string') {
    const parsed = parseJsonIfString(v)
    if (parsed !== undefined) return coerceImageUrlFromFieldValue(parsed)
    const t = v.trim()
    if (!t) return undefined
    if (t.startsWith('//')) return `https:${t}`
    if (t.startsWith('http://') || t.startsWith('https://')) return t
    if (t.startsWith('/')) return t
    return undefined
  }
  if (Array.isArray(v)) {
    for (const el of v) {
      const u = coerceImageUrlFromFieldValue(el)
      if (u) return u
    }
    return undefined
  }
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    for (const k of ['url', 'source_url', 'src', 'guid']) {
      const s = o[k]
      if (typeof s === 'string') {
        const u = coerceImageUrlFromFieldValue(s)
        if (u) return u
      }
    }
    const sizes = o.sizes
    if (sizes && typeof sizes === 'object' && !Array.isArray(sizes)) {
      const sz = sizes as Record<string, unknown>
      const preferred = [
        'woocommerce_single',
        'woocommerce-single',
        'full',
        'large',
        'medium_large',
        'medium',
        'thumbnail',
        'woocommerce_thumbnail',
      ]
      for (const key of preferred) {
        if (!(key in sz)) continue
        const u = coerceImageUrlFromFieldValue(sz[key])
        if (u) return u
      }
      for (const val of Object.values(sz)) {
        const u = coerceImageUrlFromFieldValue(val)
        if (u) return u
      }
    }
  }
  return undefined
}

/**
 * URL превью для карточки из `meta` / `acf` (без разрешения ID вложения — см. Woo adapter).
 */
export function previewImageUrlFromMetaAndAcf(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): string | undefined {
  for (const bag of [meta, acf]) {
    if (!bag) continue
    for (const key of PREVIEW_IMAGE_META_KEYS) {
      const raw = bag[key]
      if (raw == null || raw === '') continue
      const u = coerceImageUrlFromFieldValue(raw)
      if (u) return u
    }
  }
  return undefined
}

/** ID вложения для превью, если в REST пришёл только число / объект без url. */
export function previewAttachmentIdFromMetaAndAcf(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): number | undefined {
  for (const bag of [meta, acf]) {
    if (!bag) continue
    for (const key of PREVIEW_IMAGE_META_KEYS) {
      const raw = bag[key]
      const id = coalesceAttachmentId(raw)
      if (id) return id
    }
  }
  return undefined
}

/** URL hover-картинки карточки из `meta` / `acf` без обращения к REST media. */
export function hoverImageUrlFromMetaAndAcf(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): string | undefined {
  for (const bag of [meta, acf]) {
    if (!bag) continue
    for (const key of HOVER_IMAGE_META_KEYS) {
      const raw = bag[key]
      if (raw == null || raw === '') continue
      const u = coerceImageUrlFromFieldValue(raw)
      if (u) return u
    }
  }
  return undefined
}

/** ID вложения для hover-картинки (если в REST пришло только число). */
export function hoverAttachmentIdFromMetaAndAcf(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): number | undefined {
  for (const bag of [meta, acf]) {
    if (!bag) continue
    for (const key of HOVER_IMAGE_META_KEYS) {
      const raw = bag[key]
      const id = coalesceAttachmentId(raw)
      if (id) return id
    }
  }
  return undefined
}

/** URL схемы, если в meta уже лежит строка URL / объект с url (без запроса к media). */
export function specsDrawingUrlFromMetaAndAcf(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): string | undefined {
  for (const bag of [meta, acf]) {
    if (!bag) continue
    for (const key of SPECS_DRAWING_META_KEYS) {
      const raw = bag[key]
      if (raw == null || raw === '') continue
      const u = coerceImageUrlFromFieldValue(raw)
      if (u) return u
    }
  }
  return undefined
}

/** ID вложения для схемы характеристик, если пришло только число / строка с id. */
export function specsDrawingAttachmentIdFromMetaAndAcf(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): number | undefined {
  for (const bag of [meta, acf]) {
    if (!bag) continue
    for (const key of SPECS_DRAWING_META_KEYS) {
      const raw = bag[key]
      const id = coalesceAttachmentId(raw)
      if (id) return id
    }
  }
  return undefined
}

function coalesceAttachmentId(v: unknown): number | undefined {
  if (v == null || v === '') return undefined
  if (typeof v === 'number' && Number.isInteger(v) && v > 0) return v
  if (typeof v === 'string') {
    const t = v.trim()
    if (/^\d{1,12}$/.test(t)) return Number.parseInt(t, 10)
    const parsed = parseJsonIfString(v)
    if (parsed !== undefined) return coalesceAttachmentId(parsed)
    return undefined
  }
  if (Array.isArray(v)) return coalesceAttachmentId(v[0])
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (coerceImageUrlFromFieldValue(o)) return undefined
    for (const k of ['ID', 'id', 'attachment_id', 'attachmentId', 'value']) {
      const id = coalesceAttachmentId(o[k])
      if (id) return id
    }
  }
  return undefined
}

function previewImageUrlFromProduct(p: ShopProduct): string | undefined {
  return previewImageUrlFromMetaAndAcf(p.meta, p.acf)
}

function hoverImageUrlFromProduct(p: ShopProduct): string | undefined {
  return p.catalogCardHoverImageUrl ?? hoverImageUrlFromMetaAndAcf(p.meta, p.acf)
}

function rowFromAccessoryObject(
  obj: Record<string, unknown>,
): ProductDetailForTabs['accessories'][number] | null {
  const name =
    (typeof obj.name === 'string' && obj.name.trim()) ||
    (typeof obj.title === 'string' && obj.title.trim()) ||
    (typeof obj.label === 'string' && obj.label.trim()) ||
    ''

  const image =
    imageUrlFromUnknown(obj.image) ||
    imageUrlFromUnknown(obj.img) ||
    imageUrlFromUnknown(obj.url) ||
    imageUrlFromUnknown(obj.src) ||
    imageUrlFromUnknown(obj.thumbnail) ||
    imageUrlFromUnknown(obj.image_url)

  const giftBadge =
    (typeof obj.giftBadge === 'string' && obj.giftBadge.trim()) ||
    (typeof obj.badge === 'string' && obj.badge.trim()) ||
    (typeof obj.gift_badge === 'string' && obj.gift_badge.trim()) ||
    undefined

  if (!image) return null
  return {
    name: name || 'Аксессуар',
    image,
    ...(giftBadge ? { giftBadge } : {}),
  }
}

/**
 * Читает `_product_accessories` / `product_accessories` из `meta` или `acf`
 * (JSON-массив в строке или массив объектов с полями вроде name/title, image/url).
 */
const INSTRUCTION_FILES_META_KEYS = [
  '_product_instruction_files',
  'product_instruction_files',
] as const

function coerceInstructionFileList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  const parsed = parseJsonIfString(raw)
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') return [parsed]
  if (typeof raw === 'string') {
    const s = raw.trim()
    if (s.startsWith('[')) {
      try {
        const j = JSON.parse(s) as unknown
        if (Array.isArray(j)) return j
      } catch {
        /* ignore */
      }
    }
  }
  return []
}

/** Строки из meta/acf до разрешения ID в URL (делает Woo adapter). */
export function instructionFileRowsFromMeta(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): Array<{ id: number; title: string }> {
  const raw =
    pickMeta(meta, INSTRUCTION_FILES_META_KEYS) ?? pickMeta(acf, [...INSTRUCTION_FILES_META_KEYS])
  const list = coerceInstructionFileList(raw)
  const out: Array<{ id: number; title: string }> = []
  for (const item of list) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const o = item as Record<string, unknown>
    let id: number | undefined
    if (typeof o.id === 'number' && Number.isInteger(o.id) && o.id > 0) id = o.id
    else if (typeof o.id === 'string' && /^\d{1,12}$/.test(o.id.trim()))
      id = Number.parseInt(o.id.trim(), 10)
    if (id === undefined) continue
    const title = typeof o.title === 'string' ? o.title.trim() : ''
    out.push({ id, title })
  }
  return out
}

export function accessoriesFromProductMeta(
  meta?: Record<string, unknown>,
  acf?: Record<string, unknown>,
): ProductDetailForTabs['accessories'] {
  const raw = pickMeta(meta, ACCESSORY_META_KEYS) ?? pickMeta(acf, [...ACCESSORY_META_KEYS])
  const list = coerceAccessoryList(raw)
  const out: ProductDetailForTabs['accessories'] = []
  for (const item of list) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const row = rowFromAccessoryObject(item as Record<string, unknown>)
      if (row) out.push(row)
    } else if (typeof item === 'string') {
      const image = imageUrlFromUnknown(item)
      if (image) out.push({ name: 'Аксессуар', image })
    }
  }
  return out
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Первый `<h1>`…`<h6>` → title, все `<p>` → text (через `stripHtml`). */
function parseSlideDescriptionToTitleBody(html: string): { title: string; text: string } {
  const src = html.replace(/\r\n/g, '\n')
  const hMatch = src.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)
  const title = hMatch ? stripHtml(hMatch[1]) : ''
  const bodies: string[] = []
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi
  let m: RegExpExecArray | null
  while ((m = pRe.exec(src)) !== null) {
    const t = stripHtml(m[1]).trim()
    if (t) bodies.push(t)
  }
  const text = bodies.length > 0 ? bodies.join('\n\n') : stripHtml(src)
  return { title, text }
}

/**
 * Слайды «Описание» из `_product_slides` / `product_slides` в `meta` или `acf`.
 * Ожидаются объекты с полем `description` (HTML с `<h*>` и `<p>`) и опционально `image` / `img` / `url`.
 */
export function descSlidesFromProductMeta(p: ShopProduct): ProductDetailForTabs['descSlides'] {
  const raw =
    pickMeta(p.meta, PRODUCT_SLIDES_META_KEYS) ?? pickMeta(p.acf, [...PRODUCT_SLIDES_META_KEYS])
  const list = coerceAccessoryList(raw)
  const out: ProductDetailForTabs['descSlides'] = []
  let galleryIdx = 0
  const textFallback = stripHtml(p.description) || p.name

  for (const item of list) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const o = item as Record<string, unknown>
    const descRaw =
      (typeof o.description === 'string' && o.description) ||
      (typeof o.content === 'string' && o.content) ||
      (typeof o.text === 'string' && o.text) ||
      ''
    if (!String(descRaw).trim()) continue

    const { title, text } = parseSlideDescriptionToTitleBody(String(descRaw))
    const fromFields =
      coerceImageUrlFromFieldValue(o.image) ||
      coerceImageUrlFromFieldValue(o.img) ||
      coerceImageUrlFromFieldValue(o.photo) ||
      coerceImageUrlFromFieldValue(o.image_url) ||
      coerceImageUrlFromFieldValue(o.url)

    let image: string
    if (fromFields) {
      image = fromFields
    } else {
      image = p.images[galleryIdx]?.url || FALLBACK_HERO
      galleryIdx += 1
    }

    out.push({
      image,
      title: title || p.name,
      text: text || textFallback,
    })
  }

  return out
}

export function buildProductDetailForTabs(p: ShopProduct): ProductDetailForTabs {
  const plainDesc = stripHtml(p.description) || p.name
  const metaSlides = descSlidesFromProductMeta(p)
  const descSlides =
    metaSlides.length > 0
      ? metaSlides.slice(0, 12)
      : p.images.length > 0
        ? p.images.slice(0, 6).map((img, i) => ({
            image: img.url,
            title: i === 0 ? p.name : `${p.name} — ${i + 1}`,
            text: i === 0 ? plainDesc.slice(0, 600) : plainDesc.slice(0, 400) || p.name,
          }))
        : [
            {
              image: FALLBACK_HERO,
              title: p.name,
              text: plainDesc.slice(0, 600),
            },
          ]

  const attrRows = p.attributes?.map((a) => ({ label: a.name, value: a.value })) ?? []
  const specsGroups = specGroupsFromProductMeta(p.meta, p.acf)
  const emptySpecsBlocks: ProductDetailForTabs['specs'] = {
    main: [],
    general: [],
    power: [],
    control: [],
    tech: [],
    materials: [],
    extra: [],
    dimensions: [],
  }

  const specsDrawingSrc =
    p.specsDrawingUrl?.trim() ||
    specsDrawingUrlFromMetaAndAcf(p.meta, p.acf) ||
    FALLBACK_SPECS_DRAWING

  return {
    productId: p.id,
    marketplaceProductUrls: marketplaceProductUrlsFromProduct(p),
    descSlides,
    specsDrawingSrc,
    ...(specsGroups ? { specsGroups } : {}),
    specs: specsGroups
      ? emptySpecsBlocks
      : {
          main: attrRows.slice(0, 3),
          general: attrRows.slice(3, 8),
          power: [],
          control: [],
          tech: [],
          materials: [],
          extra: attrRows.slice(8),
          dimensions: [],
        },
    accessories: accessoriesFromProductMeta(p.meta, p.acf),
    instructionFiles:
      p.instructionDownloads && p.instructionDownloads.length > 0
        ? p.instructionDownloads
        : [
            {
              label: 'Страница на сайте магазина',
              href: p.permalink || '#',
            },
          ],
    ratingAvg:
      p.averageRating !== undefined && p.ratingCount
        ? `${p.averageRating.toFixed(1)} / 5 (${p.ratingCount})`
        : p.averageRating !== undefined
          ? `${p.averageRating.toFixed(1)} / 5`
          : '—',
  }
}

export function shopProductToCatalogCard(p: ShopProduct): CatalogProduct {
  const category = p.categories[0]?.name ?? 'Каталог'
  const img =
    p.catalogCardImageUrl ?? previewImageUrlFromProduct(p) ?? p.images[0]?.url ?? FALLBACK_CARD
  const priceNew = formatShopPrice(p.price, p.currency)
  const hasCompare = p.compareAtPrice !== undefined && p.compareAtPrice > p.price
  const priceOld = hasCompare ? formatShopPrice(p.compareAtPrice!, p.currency) : priceNew

  const slug = (p.slug && String(p.slug).trim()) || p.id
  const hoverImage = hoverImageUrlFromProduct(p)
  return {
    id: p.id,
    category,
    name: p.name,
    priceOld,
    priceNew,
    image: img,
    hoverImage,
    href: `/products/${slug}`,
  }
}

export function galleryUrlsFromProduct(p: ShopProduct): string[] {
  const urls = p.images.map((i) => i.url).filter(Boolean)
  return urls.length > 0 ? urls : [FALLBACK_HERO]
}

export function shortSpecsFromProduct(p: ShopProduct, max = 4): { label: string; value: string }[] {
  const attrs = p.attributes ?? []
  return attrs.slice(0, max).map((a) => ({ label: a.name, value: a.value }))
}
