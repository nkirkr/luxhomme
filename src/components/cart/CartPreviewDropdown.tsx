'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/CartContext'
import styles from './CartPreviewDropdown.module.css'

/** Содержимое корзины для выпадающей панели при ховере на иконку корзины */
export function CartPreviewDropdown() {
  const { items, totalFormatted } = useCart()
  if (items.length === 0) return null

  return (
    <div className={styles.panel} role="region" aria-label="Корзина">
      {items.map((item, index) => (
        <div key={item.id}>
          {index > 0 ? <div className={styles.rowDivider} aria-hidden="true" /> : null}
          <div className={styles.row}>
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className={styles.img} aria-hidden="true" />
            </div>
            <div className={styles.info}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.qty}>
                {item.qty} × {item.priceFormatted}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Итог:</span>
        <span className={styles.totalValue}>{totalFormatted}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.buttons}>
        <Link href="/cart" className={styles.btnOutline}>
          К корзине
        </Link>
        <Link href="/checkout" className={styles.btnFill}>
          К заказу
        </Link>
      </div>
    </div>
  )
}
