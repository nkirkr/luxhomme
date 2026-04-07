import Link from 'next/link'
import styles from './SeriesCatalog.module.css'

type SeriesCategory = {
  label: string
  hint: string
  active?: boolean
  href: string
}

export type Product = {
  id: string
  category: string
  name: string
  priceOld: string
  priceNew: string
  image: string
  href: string
}

const SERIES: SeriesCategory[] = [
  {
    label: 'Кухня',
    hint: 'Простые\nи здоровые блюда\nдля вашей семьи',
    active: true,
    href: '/products?series=kitchen',
  },
  { label: 'Чистота', hint: 'Лёгкая уборка', href: '/products?series=clean' },
  { label: 'Забота', hint: 'Забота о себе', href: '/products?series=care' },
]

const PRODUCTS: Product[] = [
  {
    id: '1',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '2',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '3',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '4',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '5',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '6',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
]

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className={styles.card}>
      {/* Badges */}
      <div className={styles.cardWidgets}>
        <div className={styles.cardBadges}>
          <span className={styles.badgeBonus}>+500 бонусов</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/group-badge.svg" alt="" className={styles.badgeGroup} />
        </div>
      </div>

      {/* Product image */}
      <div className={styles.cardImageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className={styles.cardImage} />
      </div>

      {/* Name + price */}
      <div className={styles.cardInfo}>
        <div className={styles.cardName}>
          <span className={styles.cardCategory}>{product.category}</span>
          <p className={styles.cardTitle}>
            {product.name.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < product.name.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.cardPrice}>
          <p className={styles.priceOld}>{product.priceOld}</p>
          <p className={styles.priceNew}>{product.priceNew}</p>
        </div>
      </div>

      {/* Add to cart */}
      <Link href={product.href} className={styles.cardCartBtn}>
        В корзину
      </Link>
    </div>
  )
}

/** «Исследуйте наши серии» + баннер + сетка товаров */
export function SeriesCatalog() {
  const rows = [PRODUCTS.slice(0, 3), PRODUCTS.slice(3, 6)]

  return (
    <section className={styles.section} aria-label="Наши серии и каталог">
      {/* ── Series block ── */}
      <div className={styles.seriesRow}>
        {/* Text + filter buttons */}
        <div className={styles.seriesText}>
          <div className={styles.seriesHeading}>
            <h2 className={styles.headingLine1}>Исследуйте</h2>
            <div className={styles.headingLine2}>
              <span className={styles.headingWord}>наши</span>
              <span className={styles.headingScript}>серии</span>
            </div>
          </div>

          <div className={styles.seriesButtons}>
            {SERIES.map((s) => (
              <div key={s.label} className={styles.seriesBtnGroup}>
                <Link
                  href={s.href}
                  className={`${styles.btnTag} ${s.active ? styles.active : styles.inactive}`}
                >
                  {s.label}
                  {s.active && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/icons/arrow-up-right-white.svg"
                      alt=""
                      className={styles.btnTagIcon}
                    />
                  )}
                </Link>
                <p className={styles.btnHint}>
                  {s.hint.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < s.hint.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className={styles.banner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/series-banner.jpg"
            alt="Серия продуктов"
            className={styles.bannerImage}
          />
          <div className={styles.bannerButtons}>
            <Link href="/products?series=kitchen" className={`${styles.bannerBtn} ${styles.fill}`}>
              Кухня
            </Link>
            <Link href="/products?series=clean" className={`${styles.bannerBtn} ${styles.outline}`}>
              Чистота
            </Link>
            <Link href="/products?series=care" className={`${styles.bannerBtn} ${styles.outline}`}>
              Забота
            </Link>
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className={styles.catalog}>
        {rows.map((row, ri) => (
          <div key={ri} className={styles.cardRow}>
            {row.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
