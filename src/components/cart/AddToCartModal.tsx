'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '@/lib/cart/CartContext'
import styles from './AddToCartModal.module.css'

export function AddToCartModal() {
  const { lastAdded, clearLastAdded, totalFormatted } = useCart()

  // Auto-close after 5 seconds
  useEffect(() => {
    if (!lastAdded) return
    const t = setTimeout(clearLastAdded, 5000)
    return () => clearTimeout(t)
  }, [lastAdded, clearLastAdded])

  return (
    <AnimatePresence>
      {lastAdded && (
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          {/* Product row */}
          <div className={styles.row}>
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lastAdded.image} alt={lastAdded.name} className={styles.img} />
            </div>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <p className={styles.name}>{lastAdded.name}</p>
                <button className={styles.closeBtn} onClick={clearLastAdded} aria-label="Закрыть">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <line
                      x1="1.5"
                      y1="1.5"
                      x2="10.5"
                      y2="10.5"
                      stroke="#2a2a2a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="10.5"
                      y1="1.5"
                      x2="1.5"
                      y2="10.5"
                      stroke="#2a2a2a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <p className={styles.qty}>1 x {lastAdded.priceFormatted}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Total */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Итог:</span>
            <span className={styles.totalValue}>{totalFormatted}</span>
          </div>

          <div className={styles.divider} />

          {/* Buttons */}
          <div className={styles.buttons}>
            <Link href="/cart" className={styles.btnOutline} onClick={clearLastAdded}>
              К корзине
            </Link>
            <Link href="/checkout" className={styles.btnFill} onClick={clearLastAdded}>
              К заказу
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
