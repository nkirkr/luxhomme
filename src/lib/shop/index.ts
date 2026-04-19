import type { ProductAdapter } from './types'
export type { Product, ProductVariant, CartItem, Order, ProductAdapter } from './types'
export { useCart, addToCart, removeFromCart, updateQuantity, clearCart } from './cart'
export { formatShopPrice } from './format-price'

type ShopProvider = 'none' | 'woocommerce'

const SHOP_PROVIDER: ShopProvider =
  (process.env.SHOP_PROVIDER as ShopProvider | undefined) ?? 'none'

const mockAdapter: ProductAdapter = {
  async getProducts() {
    return { products: [], total: 0 }
  },
  async getProductBySlug() {
    return null
  },
  async getProductCategories() {
    return []
  },
  async searchProducts() {
    return []
  },
}

let _shop: ProductAdapter | null = null

export async function getShop(): Promise<ProductAdapter> {
  if (_shop) return _shop

  switch (SHOP_PROVIDER) {
    case 'woocommerce': {
      const { woocommerceAdapter } = await import('./woocommerce')
      _shop = woocommerceAdapter
      break
    }
    default:
      _shop = mockAdapter
  }

  return _shop
}
