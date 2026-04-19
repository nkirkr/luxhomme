import type { Product as ShopProduct } from './types'
import { shopProductToCatalogCard } from './product-detail-ui'

export type CatalogMenuItem = {
  name: string
  price: string
  img: string
  href: string
}

export type CatalogMenuSection = {
  title: string
  items: CatalogMenuItem[]
}

const DEFAULT_MAX_CATEGORIES = 3
const DEFAULT_MAX_ITEMS = 4

/**
 * Колонки mega-menu «Каталог»: группировка по первой категории WooCommerce, до N колонок и M карточек в каждой.
 */
export function buildCatalogMenuSections(
  products: ShopProduct[],
  options?: { maxCategories?: number; maxItemsPerCategory?: number },
): CatalogMenuSection[] {
  const maxCat = options?.maxCategories ?? DEFAULT_MAX_CATEGORIES
  const maxItems = options?.maxItemsPerCategory ?? DEFAULT_MAX_ITEMS
  if (!products.length) return []

  const byCat = new Map<string, ShopProduct[]>()
  for (const p of products) {
    const title = p.categories[0]?.name?.trim() || 'Каталог'
    const list = byCat.get(title) ?? []
    list.push(p)
    byCat.set(title, list)
  }

  const entries = [...byCat.entries()]
    .sort((a, b) => {
      if (b[1].length !== a[1].length) return b[1].length - a[1].length
      return a[0].localeCompare(b[0], 'ru')
    })
    .slice(0, maxCat)

  return entries
    .map(([title, prods]) => {
      const items = prods
        .slice(0, maxItems)
        .map((p) => {
          const c = shopProductToCatalogCard(p)
          return { name: c.name, price: c.priceNew, img: c.image, href: c.href }
        })
        .filter((it) => typeof it.href === 'string' && it.href.length > 0)
      return { title, items }
    })
    .filter((section) => section.items.length > 0)
}
