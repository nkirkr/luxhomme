import { NextResponse } from 'next/server'
import { getShop } from '@/lib/shop'
import { buildCatalogMenuSections } from '@/lib/shop/catalog-menu'

/** Данные для mega-menu «Каталог» в шапке (группы по категории WooCommerce). */
export async function GET() {
  try {
    const shop = await getShop()
    const { products } = await shop.getProducts({ limit: 120 })
    const sections = buildCatalogMenuSections(products)
    return NextResponse.json(
      { sections },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } },
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ sections: [], error: message }, { status: 500 })
  }
}
