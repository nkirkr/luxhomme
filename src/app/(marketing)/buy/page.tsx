import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { MarketplaceLogos } from '@/components/sections/marketplaces/MarketplacesSection'
import styles from './buy.module.css'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Мы на маркетплейсах | Luxhommè',
  description:
    'Покупайте продукцию Luxhommè на OZON, Wildberries, Яндекс Маркет и других маркетплейсах.',
}

export default function BuyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <h1 className={styles.heading}>Мы на маркетплейсах:</h1>
          <div className={styles.divider} />
        </div>

        <MarketplaceLogos className={clsx(styles.buyLogos, styles.buyLogosLeft)} />
      </div>
    </div>
  )
}
