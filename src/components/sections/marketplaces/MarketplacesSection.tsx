import styles from './MarketplacesSection.module.css'

type MarketplaceItem = {
  id: string
  href: string
  src: string
  alt: string
  wide: boolean
  arrow: string
}

const MARKETPLACES: MarketplaceItem[] = [
  {
    id: 'ozon',
    href: 'https://ozon.ru',
    src: '/icons/logo-ozon.svg',
    alt: 'OZON',
    wide: true,
    arrow: '/icons/ozon-arrow.svg',
  },
  {
    id: 'wb',
    href: 'https://wildberries.ru',
    src: '/icons/logo-wb.svg',
    alt: 'Wildberries',
    wide: true,
    arrow: '/icons/wb-arrow.svg',
  },
  {
    id: 'yandex',
    href: 'https://market.yandex.ru',
    src: '/icons/logo-ym.svg',
    alt: 'Яндекс Маркет',
    wide: true,
    arrow: '/icons/ym-arrow.svg',
  },
  {
    id: 'mega',
    href: 'https://megamarket.ru',
    src: '/icons/logo-mega.svg',
    alt: 'МегаМаркет',
    wide: true,
    arrow: '/icons/mega-arrow.svg',
  },
  {
    id: 'shopee',
    href: 'https://shopee.ru',
    src: '/icons/logo-shopee.svg',
    alt: 'Shopee',
    wide: true,
    arrow: '/icons/shopee-arrow.svg',
  },
  {
    id: 'mvideo',
    href: 'https://mvideo.ru',
    src: '/icons/logo-mvideo.svg',
    alt: 'М.Видео',
    wide: true,
    arrow: '/icons/mvideo-arrow.svg',
  },
  {
    id: 'eldorado',
    href: 'https://eldorado.ru',
    src: '/icons/logo-eldorado.svg',
    alt: 'Эльдорадо',
    wide: true,
    arrow: '/icons/eldorado-arrow.svg',
  },
  {
    id: 'magnit',
    href: 'https://magnit.ru',
    src: '/icons/logo-magnit.svg',
    alt: 'Магнит',
    wide: true,
    arrow: '/icons/magnit-arrow.svg',
  },
  {
    id: 'tiktok',
    href: 'https://tiktok.com',
    src: '/icons/logo-tiktok.svg',
    alt: 'TikTok Shop',
    wide: true,
    arrow: '/icons/tiktok-arrow.svg',
  },
  {
    id: 'telegram',
    href: 'https://t.me/luxhomme',
    src: '/icons/logo-tg.svg',
    alt: 'Telegram',
    wide: true,
    arrow: '/icons/tg-arrow.svg',
  },
]

type MarketplaceLogosProps = {
  /** Доп. класс на контейнер `.logos` (например `buyLogos` для выравнивания на /buy) */
  className?: string
}

/** Сетка ссылок на маркетплейсы — SVG, стрелка и grayscale как на главной. */
export function MarketplaceLogos({ className }: MarketplaceLogosProps) {
  return (
    <div className={`${styles.logos} ${className ?? ''}`.trim()}>
      {MARKETPLACES.map((m) => (
        <a
          key={m.id}
          href={m.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.logoBtn} ${m.wide ? styles.logoBtnPill : styles.logoBtnCircle} ${m.id === 'ozon' ? styles.logoBtnOzon : ''}`}
        >
          <span className={styles.logoBtnInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.alt} className={m.wide ? styles.logoImg : styles.logoImgTg} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.arrow} alt="" className={styles.logoArrow} aria-hidden />
          </span>
        </a>
      ))}
    </div>
  )
}

/** «Мы на маркетплейсах» — блок для главной. */
export default function MarketplacesSection() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>мы на маркетплейсах:</p>
      <div className={styles.inner}>
        <div className={styles.divider} />
        <MarketplaceLogos />
      </div>
    </section>
  )
}
