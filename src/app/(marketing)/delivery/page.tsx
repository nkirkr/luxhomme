import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './delivery.module.css'

export const metadata: Metadata = {
  title: 'Доставка и оплата | Luxhommè',
  description: 'Доставка Ozon и СДЭК по всей России. Оплата через Яндекс Пэй и Яндекс Сплит.',
}

export default function DeliveryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* ═══════════ Доставка ═══════════ */}
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h1 className={styles.heading}>Доставка</h1>
          <div className={styles.divider} />
        </div>

        <div className={styles.cardsRow}>
          {/* ── OZON ── */}
          <div className={styles.deliveryCard}>
            <div>
              <h2 className={styles.cardTitle}>Ozon доставка</h2>
              <div className={styles.cardDesc}>
                <p>Ваш заказ приедет быстрее и удобнее — в любой пункт выдачи Ozon по России.</p>
                <p>Отслеживание заказа в приложении Ozon.</p>
              </div>
            </div>

            <div className={styles.cardBanner}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/delivery-ozon-banner.jpg" alt="" className={styles.cardBannerBg} />
              <div className={styles.cardBannerOverlay} />

              <div className={styles.cardBannerContent}>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo-ozon-white.png" alt="OZON" className={styles.ozonLogo} />
                  <p className={styles.bannerTitle}>
                    Доставка
                    <br />
                    по всей России
                  </p>
                  <p className={styles.bannerSubtitle}>Более 75 000 пунктов выдачи Ozon</p>
                </div>
                <p className={styles.bannerFootnote}>Средний срок доставки — от 1 до 3 дней</p>
              </div>
            </div>
          </div>

          {/* ── СДЭК ── */}
          <div className={styles.deliveryCard}>
            <div>
              <h2 className={styles.cardTitle}>СДЭК доставка</h2>
              <div className={styles.cardDesc}>
                <p>C помощью ТК СДЭК до ПВЗ или курьером до двери.</p>
              </div>
            </div>

            <div className={styles.cdekBanner}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/delivery-cdek-banner.jpg" alt="" className={styles.cdekBannerBg} />
              <div className={styles.cdekContent}>
                <p className={styles.cdekLabel}>
                  СДЭК доставка. С помощью ТК СДЭК
                  <br />
                  до ПВЗ или курьером до двери
                </p>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo-cdek.png" alt="СДЭК" className={styles.cdekLogo} />
                  <p className={styles.cdekBigText}>Доставка по всей России</p>
                </div>
                <p className={styles.cdekNote}>*Срок зависит от города доставки</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ Оплата и рассрочка ═══════════ */}
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h2 className={styles.heading}>Оплата и рассрочка</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.paymentRow}>
          {/* Яндекс Пэй */}
          <div className={styles.paymentCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/payment-yandex-pay.jpg"
              alt="Яндекс Пэй"
              className={styles.paymentBg}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-yandex-pay.png"
              alt="Яндекс Пэй"
              className={styles.paymentLogo}
            />
          </div>

          {/* Яндекс Сплит */}
          <div className={styles.paymentCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/payment-yandex-split.jpg"
              alt="Яндекс Сплит"
              className={styles.paymentBg}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
