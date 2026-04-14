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
              {}
              <picture>
                <source media="(max-width: 768px)" srcSet="/images/ozon-delivery-mob.png" />
                <img src="/images/ozon-delivery.png" alt="" className={styles.cardBannerBg} />
              </picture>
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
              {}
              <picture>
                <source media="(max-width: 768px)" srcSet="/images/cdek-delivery-mob.png" />
                <img src="/images/cdek-delivery.png" alt="" className={styles.cdekBannerBg} />
              </picture>
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
            {}
            <picture>
              <source media="(max-width: 768px)" srcSet="/images/yandex-banner-mob.png" />
              <img src="/images/yandex-banner.png" alt="Яндекс Пэй" className={styles.paymentBg} />
            </picture>
          </div>

          {/* Яндекс Сплит */}
          <div className={styles.paymentCard}>
            {}
            <picture>
              <source media="(max-width: 768px)" srcSet="/images/split-banner-mob.png" />
              <img src="/images/split-banner.png" alt="Яндекс Сплит" className={styles.paymentBg} />
            </picture>
          </div>
        </div>
      </div>
    </div>
  )
}
