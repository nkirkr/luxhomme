// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { createProduct } from '@/test/factories'

// Cart module uses module-level state, need to reset between tests
let addToCart: typeof import('./cart').addToCart
let removeFromCart: typeof import('./cart').removeFromCart
let updateQuantity: typeof import('./cart').updateQuantity
let clearCart: typeof import('./cart').clearCart
let getCartTotal: typeof import('./cart').getCartTotal
let getCartCount: typeof import('./cart').getCartCount

beforeEach(async () => {
  localStorage.clear()
  vi.resetModules()
  const mod = await import('./cart')
  addToCart = mod.addToCart
  removeFromCart = mod.removeFromCart
  updateQuantity = mod.updateQuantity
  clearCart = mod.clearCart
  getCartTotal = mod.getCartTotal
  getCartCount = mod.getCartCount
})

describe('addToCart', () => {
  it('adds a new product to cart', () => {
    const product = createProduct({ id: 'p1', price: 500 })
    addToCart(product)

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(1)
    expect(stored.items[0].productId).toBe('p1')
    expect(stored.items[0].quantity).toBe(1)
  })

  it('increments quantity for existing product', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 1)
    addToCart(product, 2)

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(1)
    expect(stored.items[0].quantity).toBe(3)
  })

  it('treats different variants as separate items', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 1, 'variant-a')
    addToCart(product, 1, 'variant-b')

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(2)
  })

  it('adds with custom quantity', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 5)

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items[0].quantity).toBe(5)
  })
})

describe('removeFromCart', () => {
  it('removes a product', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product)
    removeFromCart('p1')

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(0)
  })

  it('removes only matching variant', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 1, 'v1')
    addToCart(product, 1, 'v2')
    removeFromCart('p1', 'v1')

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(1)
    expect(stored.items[0].variantId).toBe('v2')
  })

  it('does nothing for non-existent product', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product)
    removeFromCart('p999')

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(1)
  })
})

describe('updateQuantity', () => {
  it('updates quantity', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 1)
    updateQuantity('p1', 5)

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items[0].quantity).toBe(5)
  })

  it('removes item when quantity is 0', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 1)
    updateQuantity('p1', 0)

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(0)
  })

  it('removes item when quantity is negative', () => {
    const product = createProduct({ id: 'p1' })
    addToCart(product, 1)
    updateQuantity('p1', -1)

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(0)
  })
})

describe('clearCart', () => {
  it('removes all items', () => {
    addToCart(createProduct({ id: 'p1' }))
    addToCart(createProduct({ id: 'p2' }))
    clearCart()

    const stored = JSON.parse(localStorage.getItem('bazasite-cart')!)
    expect(stored.items).toHaveLength(0)
  })
})

describe('getCartTotal', () => {
  it('calculates total price', () => {
    const items = [
      { productId: '1', quantity: 2, product: createProduct({ price: 500 }) },
      { productId: '2', quantity: 1, product: createProduct({ price: 300 }) },
    ]
    expect(getCartTotal(items)).toBe(1300)
  })

  it('returns 0 for empty cart', () => {
    expect(getCartTotal([])).toBe(0)
  })
})

describe('getCartCount', () => {
  it('counts total items', () => {
    const items = [
      { productId: '1', quantity: 2, product: createProduct() },
      { productId: '2', quantity: 3, product: createProduct() },
    ]
    expect(getCartCount(items)).toBe(5)
  })

  it('returns 0 for empty cart', () => {
    expect(getCartCount([])).toBe(0)
  })
})
