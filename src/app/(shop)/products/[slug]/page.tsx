import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { ProductCard, type Product } from '@/components/sections/series-catalog/SeriesCatalog'
import styles from './product.module.css'

/* ─── Mock data ─── */

const PRODUCT = {
  slug: 'air-chef',
  name: 'Aэрогриль AirChef',
  priceOld: '11 000,00 ₽',
  priceNew: '10 519,00 ₽',
  bonus: '+500 бонусов',
  splitPrice: '1925 ₽ × 4 в Сплит',
  splitSub: 'На 2 месяца без переплаты',
  images: [
    '/images/product-hero.jpg',
    '/images/product-hero.jpg',
    '/images/product-hero.jpg',
    '/images/product-hero.jpg',
  ],
  shortSpecs: [
    { label: 'Мощность, Вт', value: '1500' },
    { label: 'Управление со смартфона', value: 'Да' },
    { label: 'Автоматических программ', value: '12' },
    { label: 'Цвет', value: 'Белый' },
  ],
  descSlides: [
    {
      image: '/images/product-desc-slide.jpg',
      title: 'Освободи своё время!',
      text: 'Аэрогриль от бренда Luxhommè позволит забыть о жирной еде и долгом ожидании!',
    },
  ],
  specs: {
    main: [{ label: 'Цвет', value: 'белый' }],
    general: [
      { label: 'Модель', value: 'AirChef' },
      { label: 'Объем', value: '5.5 л' },
      { label: 'Количество программ', value: '12 шт.' },
      { label: 'Гарантийный срок', value: '1 год' },
    ],
    power: [
      { label: 'Мощность устройства', value: '1500 Вт' },
      { label: 'Длина кабеля', value: '0.9 м' },
    ],
    control: [{ label: 'Управление', value: 'сенсорное, электронное' }],
    tech: [{ label: 'Тип нагревательного элемента', value: 'ТЭН' }],
    materials: [{ label: 'Материал корпуса', value: 'пластик' }],
    extra: [
      { label: 'Программы приготовления', value: 'выпечка, гриль, мясо, рыба, овощи' },
      { label: 'Покрытие чаши', value: 'антипригарное, тефлоновое' },
      {
        label: 'Доп. опции прибора',
        value:
          'дисплей, Регулятор мощности, подсветка, терморегулятор, защита от перегрева, автоматическое включение/отключение, легкая очистка, окно в чаше',
      },
      {
        label: 'Комплектация',
        value:
          'силиконовая форма, чаша для запекания, Прихватка руковица, силиконовая кисть, решетка, книга рецептов, аэрогриль',
      },
    ],
    dimensions: [
      { label: 'Высота', value: '32.2 см' },
      { label: 'Ширина', value: '28.5 см' },
      { label: 'Глубина', value: '28.5 см' },
      { label: 'Вес с упаковкой', value: '5 кг' },
    ],
  },
  accessories: [
    { name: 'Решётка', image: '/images/product-accessory-1.jpg' },
    { name: 'Прихватка', image: '/images/product-accessory-2.jpg' },
    { name: 'Прихватка', image: '/images/product-accessory-2.jpg' },
    { name: 'Решётка', image: '/images/product-accessory-1.jpg' },
    { name: 'Прихватка', image: '/images/product-accessory-2.jpg' },
  ],
  instruction: {
    label: 'Инструкция аэрогриль RU',
    href: '#',
  },
  reviews: [
    {
      date: '29 марта 2026',
      author: 'Наталья',
      rating: 4,
      text: 'Купила аэрогриль и осталась очень довольна, очень быстро готовит пищу.',
      photo: '/images/product-review-photo.jpg',
    },
    {
      date: '29 марта 2026',
      author: 'Наталья',
      rating: 4,
      text: 'Купила аэрогриль и осталась очень довольна, очень быстро готовит пищу.',
      photo: '/images/product-review-photo.jpg',
    },
    {
      date: '29 марта 2026',
      author: 'Наталья',
      rating: 4,
      text: 'Купила аэрогриль и осталась очень довольна, очень быстро готовит пищу.',
      photo: '/images/product-review-photo.jpg',
    },
  ],
  ratingAvg: '4.8 / 5',
}

const RELATED_PRODUCTS: Product[] = [
  {
    id: 'r1',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-related.jpg',
    href: '/products/steam-mop',
  },
  {
    id: 'r2',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-related.jpg',
    href: '/products/steam-mop',
  },
  {
    id: 'r3',
    category: 'Чистота',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-related.jpg',
    href: '/products/steam-mop',
  },
]

const TABS = ['Описание', 'Характеристики', 'Отзывы', 'Аксессуары', 'Видео']

const REVIEW_FILTERS = [
  'Все',
  'С фото',
  'С видео',
  'Сначала положительные',
  'Сначала отрицательные',
]

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={i <= count ? '/icons/star-filled.svg' : '/icons/star-empty.svg'}
          alt=""
          className={styles.starIcon}
        />
      ))}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.specRow}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{value}</span>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${PRODUCT.name} | Luxhommè`,
    description: `Купить ${PRODUCT.name} — цена ${PRODUCT.priceNew}`,
    alternates: { canonical: `/products/${slug}` },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await params

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* ═══ Hero: Gallery + Info ═══ */}
        <section className={styles.hero}>
          <div className={styles.gallery}>
            <div className={styles.thumbs}>
              {PRODUCT.images.map((img, i) => (
                <div key={i} className={`${styles.thumb} ${i === 0 ? styles.active : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className={styles.mainImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PRODUCT.images[0]} alt={PRODUCT.name} />
            </div>
          </div>

          <div className={styles.info}>
            <h1 className={styles.productTitle}>{PRODUCT.name}</h1>

            <div className={styles.aboutRow}>
              <span className={styles.aboutLabel}>О товаре</span>
              <Link href="#specs" className={styles.moreLink}>
                Больше характеристик
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/arrow-up-right.svg" alt="" />
              </Link>
            </div>

            {PRODUCT.shortSpecs.map((s) => (
              <SpecRow key={s.label} label={s.label} value={s.value} />
            ))}

            <div className={styles.priceBlock}>
              <div className={styles.priceLeft}>
                <span className={styles.bonusBadge}>{PRODUCT.bonus}</span>
                <p className={styles.priceOld}>{PRODUCT.priceOld}</p>
                <p className={styles.priceNew}>{PRODUCT.priceNew}</p>
              </div>
              <div className={styles.splitInfo}>
                <span className={styles.splitLine}>{PRODUCT.splitPrice}</span>
                <p className={styles.splitSub}>{PRODUCT.splitSub}</p>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnBuy}>Купить в 1 клик</button>
              <button className={styles.btnCart}>В корзину</button>
            </div>

            <div className={styles.divider} />

            <h3 className={styles.deliveryTitle}>Доставка</h3>

            <div className={styles.deliveryRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/map-pin.svg" alt="" className={styles.deliveryIcon} />
              <div className={styles.deliveryInfo}>
                <div>
                  <p className={styles.deliveryLabel}>Санкт-Петербург</p>
                  <p className={styles.deliverySub}>Укажите полный адрес</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/arrow-up-right.svg" alt="" className={styles.deliveryArrow} />
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.deliveryRow}>
              <div className={styles.deliveryIcon} />
              <div className={styles.deliveryInfo}>
                <div>
                  <p className={styles.deliveryLabel}>Курьером Ozon</p>
                  <p className={styles.deliverySub}>Завтра, 30 марта</p>
                </div>
                <span className={styles.deliveryBadge}>Бесплатно</span>
              </div>
            </div>

            <div className={styles.deliveryRow}>
              <div className={styles.deliveryIcon} />
              <div className={styles.deliveryInfo}>
                <div>
                  <p className={styles.deliveryLabel}>Пункты выдачи</p>
                  <p className={styles.deliverySub}>Завтра, 30 марта</p>
                </div>
                <span className={styles.deliveryBadge}>Бесплатно</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Description ═══ */}
        <section className={styles.descSection}>
          <div className={styles.descTabs}>
            {TABS.map((tab, i) => (
              <span key={tab} className={`${styles.descTab} ${i === 0 ? styles.activeTab : ''}`}>
                {tab}
              </span>
            ))}
          </div>

          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.descBody}>
            <div className={styles.descSlider}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PRODUCT.descSlides[0].image} alt="" className={styles.descSlideImage} />
            </div>
            <div className={styles.descText}>
              <h3 className={styles.descTextTitle}>{PRODUCT.descSlides[0].title}</h3>
              <p className={styles.descTextBody}>{PRODUCT.descSlides[0].text}</p>
            </div>
          </div>
        </section>

        {/* ═══ Characteristics ═══ */}
        <section className={styles.specsSection} id="specs">
          <div className={styles.sectionHeading}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <h2 className={styles.sectionTitle}>Характеристики</h2>
            </div>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.specsBody}>
            <div className={styles.specsDrawings}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/product-drawing-front.svg"
                alt="Чертёж — вид спереди"
                className={styles.drawingImage}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/product-drawing-side.svg"
                alt="Чертёж — вид сбоку"
                className={styles.drawingImage}
              />
            </div>

            <div className={styles.specsTable}>
              <div className={styles.specsColumns}>
                <div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Основная информация</h4>
                    {PRODUCT.specs.main.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Питание</h4>
                    {PRODUCT.specs.power.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Технические особенности</h4>
                    {PRODUCT.specs.tech.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Дополнительная информация</h4>
                    {PRODUCT.specs.extra.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Габариты</h4>
                    {PRODUCT.specs.dimensions.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Общие характеристики</h4>
                    {PRODUCT.specs.general.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Управление</h4>
                    {PRODUCT.specs.control.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Материалы</h4>
                    {PRODUCT.specs.materials.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Accessories ═══ */}
        <section className={styles.accessoriesSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Акссесуары</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.accessoriesGrid}>
            {PRODUCT.accessories.map((acc, i) => (
              <div key={i} className={styles.accessoryCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={acc.image} alt={acc.name} className={styles.accessoryImage} />
                <p className={styles.accessoryName}>{acc.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Instruction ═══ */}
        <section className={styles.instructionSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Инструкция</h2>
            <div className={styles.sectionLine} />
          </div>

          <a href={PRODUCT.instruction.href} className={styles.instructionBtn} download>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/pdf-icon.svg" alt="" className={styles.instructionIcon} />
            <span className={styles.instructionLabel}>{PRODUCT.instruction.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/download-icon.svg" alt="" className={styles.instructionDownload} />
          </a>
        </section>

        {/* ═══ Reviews ═══ */}
        <section className={styles.reviewsSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Отзывы</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.reviewsHeader}>
            <div className={styles.reviewsLeft}>
              <div className={styles.ratingRow}>
                <Stars count={5} />
                <span className={styles.ratingText}>{PRODUCT.ratingAvg}</span>
              </div>
              <p className={styles.ratingCaption}>
                Рейтинг формируется на основе актуальных отзывов
              </p>
              <button className={styles.btnReview}>Написать отзыв</button>
            </div>

            <div className={styles.reviewFilters}>
              {REVIEW_FILTERS.map((f) => (
                <button key={f} className={styles.filterBtn}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.reviewCards}>
            {PRODUCT.reviews.map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.reviewCardTop}>
                  <span className={styles.reviewDate}>{review.date}</span>
                  <div className={styles.ozonBadge}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/ozon-logo.svg" alt="Ozon" />
                  </div>
                </div>
                <div className={styles.reviewRatingRow}>
                  <Stars count={review.rating} />
                  <span className={styles.reviewAuthor}>{review.author}</span>
                </div>
                <div className={styles.reviewDivider} />
                <p className={styles.reviewLabel}>Отзыв</p>
                <p className={styles.reviewText}>{review.text}</p>
                <div className={styles.reviewDivider} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.photo} alt="" className={styles.reviewPhoto} />
              </div>
            ))}
          </div>

          <button className={styles.btnShowMore}>Показать ещё</button>
        </section>

        {/* ═══ Related products ═══ */}
        <section className={styles.relatedSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Другие товары</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.relatedGrid}>
            {RELATED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
