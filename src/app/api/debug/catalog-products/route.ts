import { NextResponse } from 'next/server'
import { getShop } from '@/lib/shop'

/**
 * Полный список товаров для отладки в консоли браузера (meta/acf и т.д.).
 * В production отключено.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const shop = await getShop()
    const { products, total } = await shop.getProducts({ limit: 500 })
    return NextResponse.json({ count: products.length, total, products })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
