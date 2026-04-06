import styles from './MarketplacesSection.module.css'

const MARKETPLACES = [
  { id: 'ozon', href: 'https://ozon.ru', src: '/images/logo-ozon.png', alt: 'OZON', wide: true },
  {
    id: 'wb',
    href: 'https://wildberries.ru',
    src: '/images/logo-wb.png',
    alt: 'Wildberries',
    wide: true,
  },
  {
    id: 'yandex',
    href: 'https://market.yandex.ru',
    src: '/images/logo-yandex.png',
    alt: 'Яндекс Маркет',
    wide: true,
  },
  {
    id: 'mega',
    href: 'https://megamarket.ru',
    src: '/images/logo-megamarket.png',
    alt: 'МегаМаркет',
    wide: true,
  },
  {
    id: 'shopee',
    href: 'https://shopee.ru',
    src: '/images/logo-shopee.png',
    alt: 'Shopee',
    wide: true,
  },
  {
    id: 'mvideo',
    href: 'https://mvideo.ru',
    src: '/images/logo-mvideo.png',
    alt: 'М.Видео',
    wide: true,
  },
  {
    id: 'eldorado',
    href: 'https://eldorado.ru',
    src: '/images/logo-eldorado.png',
    alt: 'Эльдорадо',
    wide: true,
  },
  {
    id: 'magnit',
    href: 'https://magnit.ru',
    src: '/images/logo-magnit.png',
    alt: 'Магнит',
    wide: true,
  },
  {
    id: 'tiktok',
    href: 'https://tiktok.com',
    src: '/images/logo-tiktok.png',
    alt: 'TikTok Shop',
    wide: true,
  },
  {
    id: 'telegram',
    href: 'https://t.me/luxhomme',
    src: '/images/logo-telegram.png',
    alt: 'Telegram',
    wide: false,
  },
]

/** «Мы на маркетплейсах» — row of marketplace logo pills. */
export default function MarketplacesSection() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>мы на маркетплейсах:</p>
      <div className={styles.inner}>
        <div className={styles.divider} />
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
              <img src={m.src} alt={m.alt} className={m.wide ? styles.logoImg : styles.logoImgTg} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
