import type { Metadata } from 'next'
import type { Product as CatalogGridProduct } from '@/components/sections/series-catalog/SeriesCatalog'
import { getShop } from '@/lib/shop'
import { shopProductToCatalogCard } from '@/lib/shop/product-detail-ui'
import { CartPageClient } from './CartPageClient'

export const metadata: Metadata = { title: 'Корзина — Luxhommè' }

export default async function CartPage() {
  let recentProducts: CatalogGridProduct[] = []
  try {
    const shop = await getShop()
    const { products } = await shop.getProducts({ limit: 3, sort: 'newest' })
    recentProducts = products.map(shopProductToCatalogCard)
  } catch (err) {
    console.error('[cart] recent products failed:', err)
  }

  return <CartPageClient recentProducts={recentProducts} />
}
