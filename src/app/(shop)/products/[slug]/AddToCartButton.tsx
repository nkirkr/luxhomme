'use client'

import { useCart } from '@/lib/cart/CartContext'
import styles from './product.module.css'

type Props = {
  id: string
  name: string
  price: number
  priceFormatted: string
  image: string
  href: string
}

export function AddToCartButton({ id, name, price, priceFormatted, image, href }: Props) {
  const { addItem } = useCart()

  return (
    <button
      className={styles.btnCart}
      onClick={() => addItem({ id, name, price, priceFormatted, image, href })}
    >
      В корзину
    </button>
  )
}
