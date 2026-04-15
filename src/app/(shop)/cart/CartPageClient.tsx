'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { useCart } from '@/lib/cart/CartContext'
import {
  ProductCard,
  PRODUCTS as MOCK_PRODUCTS,
} from '@/components/sections/series-catalog/SeriesCatalog'
import styles from './cart.module.css'

// ── Coupon accordion ──────────────────────────────────────────────

function CouponSection() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  function apply() {
    if (!code.trim()) return
    // Mock: any code fails
    setError(`Купон «${code}» не может быть применён, поскольку его не существует.`)
  }

  return (
    <div className={styles.couponSection}>
      <div className={styles.divider} />
      <button className={styles.couponToggle} onClick={() => setOpen((v) => !v)}>
        <span className={styles.couponLabel}>Добавить купоны</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/arrow-down.svg"
          alt=""
          className={`${styles.couponArrow} ${open ? styles.couponArrowOpen : ''}`}
        />
      </button>

      {open && (
        <div className={styles.couponBody}>
          <div className={styles.couponInputRow}>
            <div className={`${styles.couponInputWrap} ${error ? styles.couponInputError : ''}`}>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                placeholder="Введите код"
                className={styles.couponInput}
              />
              {error && <span className={styles.couponInputHint}>{code}</span>}
            </div>
            <button
              className={`${styles.couponApplyBtn} ${!code.trim() ? styles.couponApplyBtnDisabled : ''}`}
              onClick={apply}
              disabled={!code.trim()}
            >
              Применить
            </button>
          </div>
          {error && <p className={styles.couponError}>{error}</p>}
        </div>
      )}

      <div className={styles.divider} />
    </div>
  )
}

// ── Cart item row ─────────────────────────────────────────────────

function CartItemRow({ item }: { item: ReturnType<typeof useCart>['items'][0] }) {
  const { updateQty, removeItem } = useCart()

  return (
    <div className={styles.itemRow}>
      <div className={styles.itemLeft}>
        <div className={styles.itemImgWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.name} className={styles.itemImg} />
        </div>
        <div className={styles.itemDetails}>
          <div className={styles.itemTexts}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemPrice}>{item.priceFormatted}</p>
            <p className={styles.itemDesc}>Робот мойщик окон…</p>
          </div>
          <div className={styles.itemControls}>
            <div className={styles.qtyControl}>
              <button
                className={styles.qtyBtn}
                onClick={() => updateQty(item.id, item.qty - 1)}
                aria-label="Уменьшить"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line
                    x1="2"
                    y1="6"
                    x2="10"
                    y2="6"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <span className={styles.qtyValue}>{item.qty}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => updateQty(item.id, item.qty + 1)}
                aria-label="Увеличить"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line
                    x1="6"
                    y1="2"
                    x2="6"
                    y2="10"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="2"
                    y1="6"
                    x2="10"
                    y2="6"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => removeItem(item.id)}
              aria-label="Удалить"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1.5 3.5h11M5.5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M6 6v4M8 6v4M2.5 3.5l.75 7.5a1 1 0 0 0 1 .9h5.5a1 1 0 0 0 1-.9l.75-7.5"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p className={styles.itemTotal}>{(item.price * item.qty).toLocaleString('ru-RU')} ₽</p>
    </div>
  )
}

// ── Empty cart ────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.emptyIcon}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.emptyIconImg}
          src="/images/empty-cart-img.png"
          alt="Пустая корзина"
        />
      </div>
      <p className={styles.emptyText}>
        Корзина грустит без ваших покупок
        <br />
        Порадуйте её и себя
      </p>
      <div className={styles.emptyProducts}>
        <p className={styles.emptyProductsTitle}>Новое в магазине</p>
        <div className={styles.emptyProductsGrid}>
          {MOCK_PRODUCTS.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────

export function CartPageClient() {
  const { items, totalFormatted } = useCart()
  const [useBonuses, setUseBonuses] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className={styles.content}>
          {/* Left: items */}
          <div className={styles.itemsCol}>
            <div className={styles.itemsHeader}>
              <span className={styles.itemsHeaderLabel}>ТОВАР</span>
              <span className={styles.itemsHeaderTotal}>ИТОГО</span>
            </div>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Right: summary */}
          <div className={styles.summaryCol}>
            <p className={styles.summaryTitle}>СУММА КОРЗИНЫ</p>

            <CouponSection />

            {/* Bonuses */}
            <div className={styles.bonusSection}>
              <p className={styles.bonusTitle}>Ваши бонусы</p>
              <label className={styles.bonusCheck}>
                <input
                  type="checkbox"
                  checked={useBonuses}
                  onChange={(e) => setUseBonuses(e.target.checked)}
                  className={styles.bonusCheckInput}
                />
                <span className={styles.bonusCheckBox} />
                <span className={styles.bonusCheckLabel}>Использовать 500 бонусов</span>
              </label>
            </div>

            <div className={styles.divider} />

            {/* Estimated total */}
            <div className={styles.estimatedRow}>
              <div className={styles.estimatedLeft}>
                <span className={styles.estimatedLabel}>Предполагаемый итог</span>
                <p className={styles.estimatedNote}>
                  Стоимость доставки будет рассчитана при оформлении заказа
                </p>
              </div>
              <span className={styles.estimatedValue}>{totalFormatted}</span>
            </div>

            <div className={styles.divider} />

            <Link href="/checkout" className={styles.checkoutBtn}>
              Перейти к оформлению заказа
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
