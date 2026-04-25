'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '@/lib/cart/CartContext'
import styles from './AddToCartToast.module.css'

function CheckIcon() {
  return (
    <svg className={styles.check} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L8.5 15L16 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Уведомление «Товар добавлен в корзину» (Figma node 325:8037) */
export function AddToCartToast() {
  const { lastAdded, clearLastAdded } = useCart()

  useEffect(() => {
    if (!lastAdded) return
    const t = setTimeout(clearLastAdded, 4000)
    return () => clearTimeout(t)
  }, [lastAdded, clearLastAdded])

  return (
    <AnimatePresence>
      {lastAdded ? (
        <motion.div
          key="add-to-cart-toast"
          className={styles.toast}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <CheckIcon />
          <p className={styles.text}>Товар добавлен в корзину</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
