import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './buy.module.css'

export const metadata: Metadata = {
  title: 'Мы на маркетплейсах | Luxhommè',
  description:
    'Покупайте продукцию Luxhommè на OZON, Wildberries, Яндекс Маркет и других маркетплейсах.',
}

const MARKETPLACES = [
  { id: 'ozon', href: 'https://ozon.ru', src: '/images/logo-ozon.png', alt: 'OZON' },
  { id: 'wb', href: 'https://wildberries.ru', src: '/images/logo-wb.png', alt: 'Wildberries' },
  {
    id: 'yandex',
    href: 'https://market.yandex.ru',
    src: '/images/logo-yandex.png',
    alt: 'Яндекс Маркет',
  },
  {
    id: 'mega',
    href: 'https://megamarket.ru',
    src: '/images/logo-megamarket.png',
    alt: 'МегаМаркет',
  },
  { id: 'shopee', href: 'https://shopee.ru', src: '/images/logo-shopee.png', alt: 'Shopee' },
  { id: 'mvideo', href: 'https://mvideo.ru', src: '/images/logo-mvideo.png', alt: 'М.Видео' },
  {
    id: 'eldorado',
    href: 'https://eldorado.ru',
    src: '/images/logo-eldorado.png',
    alt: 'Эльдорадо',
  },
  { id: 'magnit', href: 'https://magnit.ru', src: '/images/logo-magnit.png', alt: 'Магнит' },
  { id: 'tiktok', href: 'https://tiktok.com', src: '/images/logo-tiktok.png', alt: 'TikTok Shop' },
  {
    id: 'telegram',
    href: 'https://t.me/luxhomme',
    src: '/images/logo-telegram.png',
    alt: 'Telegram',
  },
]

export default function BuyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h1 className={styles.heading}>Мы на маркетплейсах:</h1>
          <div className={styles.divider} />
        </div>

        <div className={styles.logos}>
          {MARKETPLACES.map((m) => (
            <a
              key={m.id}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logoBtn}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.src}
                alt={m.alt}
                className={m.id === 'telegram' ? styles.logoImgTg : styles.logoImg}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
