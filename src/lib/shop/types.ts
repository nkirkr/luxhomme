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
  /** WooCommerce-style attributes for detail/specs UI */
  attributes?: Array<{ name: string; value: string }>
  averageRating?: number
  ratingCount?: number
  permalink?: string
  /**
   * Произвольные мета-поля из WooCommerce REST (`meta_data` → объект по `key`).
   * Часть ключей может быть служебной (`_…`); ACF часто кладёт значения сюда или в `acf`.
   */
  meta?: Record<string, unknown>
  /** Поля ACF, если в ответе REST есть верхнеуровневый объект `acf` (плагин / `register_rest_field`). */
  acf?: Record<string, unknown>
  /**
   * URL картинки для карточки каталога, если превью в meta задано как ID вложения
   * и разрешено через WP REST в адаптере WooCommerce.
   */
  catalogCardImageUrl?: string
  /**
   * Фон карточки при наведении (`hover_image` в meta / ACF), ID разрешён в WP Media.
   */
  catalogCardHoverImageUrl?: string
  /**
   * Файлы инструкций (`_product_instruction_files`): подпись + URL вложения после разрешения ID в Woo adapter.
   */
  instructionDownloads?: Array<{ label: string; href: string }>
  /**
   * Схема / чертёж для блока «Характеристики» (`char_image` в meta — часто ID вложения, разрешается через wp/v2/media).
   */
  specsDrawingUrl?: string
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

  getProductCategories(): Promise<Array<{ id: string; name: string; slug: string; count: number }>>

  searchProducts(query: string, limit?: number): Promise<Product[]>
}
