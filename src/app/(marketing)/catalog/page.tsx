import type { Metadata } from 'next'
import type { Product as CatalogGridProduct } from '@/components/sections/series-catalog/SeriesCatalog'
import { getShop } from '@/lib/shop'
import { shopProductToCatalogCard } from '@/lib/shop/product-detail-ui'
import CatalogClient from './CatalogClient'

export const metadata: Metadata = {
  title: 'Каталог товаров | Luxhommè',
  description: 'Бытовая техника Luxhommè — паровые швабры, кухонная техника, спорт и аксессуары.',
}

type CatalogPageProps = {
  searchParams: Promise<{ series?: string | string[] }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { series: seriesParam } = await searchParams
  const seriesFromUrl = Array.isArray(seriesParam) ? seriesParam[0] : seriesParam

  let initialProducts: CatalogGridProduct[] = []
  try {
    const shop = await getShop()
    const { products } = await shop.getProducts({ limit: 500 })
    initialProducts = products.map(shopProductToCatalogCard)
    console.log('[catalog] cards (server)', initialProducts.length, initialProducts)
    console.log('[catalog] shop products + meta/acf (server)', products.length, products)
  } catch (err) {
    console.error('[catalog] getShop / getProducts failed:', err)
  }

  return <CatalogClient initialProducts={initialProducts} seriesFromUrl={seriesFromUrl} />
}
