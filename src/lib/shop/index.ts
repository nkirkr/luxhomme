import type { ProductAdapter } from './types'
export type { Product, ProductVariant, CartItem, Order, ProductAdapter } from './types'
export { useCart, addToCart, removeFromCart, updateQuantity, clearCart } from './cart'

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
  _shop = mockAdapter
  return _shop
}
