import type { CMSImage } from '@/lib/cms/types'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  currency: string
  images: CMSImage[]
  categories: Array<{ id: string; name: string; slug: string }>
  inStock: boolean
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  inStock: boolean
  attributes: Record<string, string>
}

export interface CartItem {
  productId: string
  variantId?: string
  quantity: number
  product: Product
}

export interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: CartItem[]
  total: number
  currency: string
  createdAt: string
}

export interface ProductAdapter {
  getProducts(options?: {
    limit?: number
    offset?: number
    category?: string
    search?: string
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular'
  }): Promise<{ products: Product[]; total: number }>

  getProductBySlug(slug: string): Promise<Product | null>

  getProductCategories(): Promise<
    Array<{ id: string; name: string; slug: string; count: number }>
  >

  searchProducts(query: string, limit?: number): Promise<Product[]>
}
