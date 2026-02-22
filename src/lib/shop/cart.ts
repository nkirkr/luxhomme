'use client'

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react'
import type { CartItem, Product } from './types'

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = 'bazasite-cart'

function getInitialState(): CartState {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { items: [] }
  } catch {
    return { items: [] }
  }
}

let state = getInitialState()
const listeners = new Set<() => void>()

function emit() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  listeners.forEach((l) => l())
}

export function addToCart(product: Product, quantity = 1, variantId?: string) {
  const existing = state.items.find(
    (item) =>
      item.productId === product.id && item.variantId === variantId
  )

  if (existing) {
    state = {
      items: state.items.map((item) =>
        item.productId === product.id && item.variantId === variantId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    }
  } else {
    state = {
      items: [
        ...state.items,
        { productId: product.id, variantId, quantity, product },
      ],
    }
  }
  emit()
}

export function removeFromCart(productId: string, variantId?: string) {
  state = {
    items: state.items.filter(
      (item) =>
        !(item.productId === productId && item.variantId === variantId)
    ),
  }
  emit()
}

export function updateQuantity(
  productId: string,
  quantity: number,
  variantId?: string
) {
  if (quantity <= 0) {
    removeFromCart(productId, variantId)
    return
  }
  state = {
    items: state.items.map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity }
        : item
    ),
  }
  emit()
}

export function clearCart() {
  state = { items: [] }
  emit()
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export function useCart() {
  const items = useSyncExternalStore(
    (callback) => {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    () => state.items,
    () => []
  )

  return {
    items,
    total: getCartTotal(items),
    count: getCartCount(items),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
