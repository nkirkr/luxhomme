'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  priceFormatted: string
  image: string
  href: string
  qty: number
}

const CART_STORAGE_KEY = 'luxhomme-cart'

function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(
      (row): row is CartItem =>
        row &&
        typeof row === 'object' &&
        typeof (row as CartItem).id === 'string' &&
        typeof (row as CartItem).qty === 'number' &&
        (row as CartItem).qty > 0,
    )
  } catch {
    return []
  }
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  total: number
  totalFormatted: string
  count: number
  lastAdded: CartItem | null
  clearLastAdded: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null)
  const [cartHydrated, setCartHydrated] = useState(false)

  useEffect(() => {
    setItems(
      parseStoredCart(
        typeof window !== 'undefined' ? localStorage.getItem(CART_STORAGE_KEY) : null,
      ),
    )
    setCartHydrated(true)
  }, [])

  useEffect(() => {
    if (!cartHydrated || typeof window === 'undefined') return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore quota / private mode */
    }
  }, [items, cartHydrated])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_STORAGE_KEY) return
      setItems(parseStoredCart(e.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      const next: CartItem[] = existing
        ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...item, qty: 1 }]
      const row = next.find((i) => i.id === item.id)
      /* Тост «добавлено» только при появлении новой позиции, не при + к уже добавленному */
      if (row && !existing) queueMicrotask(() => setLastAdded(row))
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
    }
  }, [])

  const clearLastAdded = useCallback(() => setLastAdded(null), [])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const totalFormatted = total.toLocaleString('ru-RU') + ' ₽'
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        total,
        totalFormatted,
        count,
        lastAdded,
        clearLastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
