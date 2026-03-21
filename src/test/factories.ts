import type { CMSPost, CMSPage, CMSImage, CMSCategory } from '@/lib/cms/types'
import type { Product, ProductVariant, CartItem, Order } from '@/lib/shop/types'
import type { EmailMessage } from '@/lib/email/types'
import type { PaymentCheckout } from '@/lib/payment/types'
import type { ChatMessage } from '@/lib/chat/types'

let counter = 0
function nextId() {
  return `test-${++counter}`
}

export function resetFactoryCounter() {
  counter = 0
}

// --- CMS ---

export function createCMSImage(overrides: Partial<CMSImage> = {}): CMSImage {
  return {
    url: 'https://example.com/image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
    ...overrides,
  }
}

export function createCMSPost(overrides: Partial<CMSPost> = {}): CMSPost {
  const id = nextId()
  return {
    id,
    slug: `test-post-${id}`,
    title: `Test Post ${id}`,
    content: '<p>Test content</p>',
    excerpt: 'Test excerpt',
    date: '2025-01-15T10:00:00Z',
    categories: [{ id: 'cat-1', name: 'General', slug: 'general' }],
    ...overrides,
  }
}

export function createCMSPage(overrides: Partial<CMSPage> = {}): CMSPage {
  const id = nextId()
  return {
    id,
    slug: `test-page-${id}`,
    title: `Test Page ${id}`,
    content: '<p>Test page content</p>',
    ...overrides,
  }
}

export function createCMSCategory(overrides: Partial<CMSCategory> = {}): CMSCategory {
  const id = nextId()
  return {
    id,
    name: `Category ${id}`,
    slug: `category-${id}`,
    ...overrides,
  }
}

// --- Shop ---

export function createProduct(overrides: Partial<Product> = {}): Product {
  const id = nextId()
  return {
    id,
    slug: `product-${id}`,
    name: `Product ${id}`,
    description: 'A test product',
    price: 1000,
    currency: 'RUB',
    images: [createCMSImage()],
    categories: [{ id: 'cat-1', name: 'Electronics', slug: 'electronics' }],
    inStock: true,
    ...overrides,
  }
}

export function createProductVariant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  const id = nextId()
  return {
    id,
    name: `Variant ${id}`,
    price: 1200,
    inStock: true,
    attributes: { color: 'red', size: 'M' },
    ...overrides,
  }
}

export function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  const product = createProduct()
  return {
    productId: product.id,
    quantity: 1,
    product,
    ...overrides,
  }
}

export function createOrder(overrides: Partial<Order> = {}): Order {
  const id = nextId()
  return {
    id,
    status: 'pending',
    items: [createCartItem()],
    total: 1000,
    currency: 'RUB',
    createdAt: '2025-01-15T10:00:00Z',
    ...overrides,
  }
}

// --- Email ---

export function createEmailMessage(overrides: Partial<EmailMessage> = {}): EmailMessage {
  return {
    to: 'test@example.com',
    subject: 'Test Subject',
    html: '<p>Test email</p>',
    ...overrides,
  }
}

// --- Payment ---

export function createPaymentCheckout(overrides: Partial<PaymentCheckout> = {}): PaymentCheckout {
  const id = nextId()
  return {
    id,
    url: `https://checkout.example.com/${id}`,
    amount: 1000,
    currency: 'RUB',
    status: 'pending',
    ...overrides,
  }
}

// --- Chat ---

export function createChatMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  const id = nextId()
  return {
    id,
    content: 'Test message',
    sender: 'user',
    timestamp: new Date('2025-01-15T10:00:00Z'),
    ...overrides,
  }
}
