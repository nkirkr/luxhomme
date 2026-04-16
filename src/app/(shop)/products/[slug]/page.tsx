import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import type { Product } from '@/components/sections/series-catalog/SeriesCatalog'
import { AddToCartButton } from './AddToCartButton'
import { ProductGallery } from './ProductGallery'
import { ProductTabs } from './ProductTabs'
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
    {
      image: '/images/product-desc-slide.jpg',
      title: 'Для всей семьи',
      text: 'Чаша 5,5 л идеально подходит для семьи. 4 подарка в комплекте: силиконовая форма, прихватка, кисточка и книга рецептов.',
    },
    {
      image: '/images/product-desc-slide.jpg',
      title: 'Готовь без масла',
      text: 'Горячий воздух равномерно обжаривает продукты — меньше жира, больше вкуса и хрустящей корочки.',
    },
    {
      image: '/images/product-desc-slide.jpg',
      title: '12 автоматических программ',
      text: 'Подбирай режим одним касанием: мясо, рыба, овощи, выпечка и другие — удобно каждый день.',
    },
    {
      image: '/images/product-desc-slide.jpg',
      title: 'Лёгкая очистка',
      text: 'Антипригарное покрытие чаши и продуманная конструкция помогают быстро очистить прибор после готовки.',
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
    { name: 'Кисть', image: '/images/product-accessory-2.jpg', giftBadge: '+1 в подарок' },
    { name: 'Силиконовая форма', image: '/images/product-accessory-1.jpg' },
    { name: 'Книга рецептов', image: '/images/product-accessory-2.jpg' },
    { name: 'Решётка', image: '/images/product-accessory-1.jpg' },
    { name: 'Прихватка', image: '/images/product-accessory-2.jpg' },
    { name: 'Силиконовая форма', image: '/images/product-accessory-1.jpg' },
    { name: 'Прихватка', image: '/images/product-accessory-2.jpg' },
    { name: 'Решётка', image: '/images/product-accessory-1.jpg' },
    { name: 'Книга рецептов', image: '/images/product-accessory-2.jpg' },
    { name: 'Кисть', image: '/images/product-accessory-2.jpg' },
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
    name: 'Паровая швабра Luxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-related.jpg',
    href: '/products/steam-mop',
  },
  {
    id: 'r2',
    category: 'Чистота',
    name: 'Паровая швабра Luxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-related.jpg',
    href: '/products/steam-mop',
  },
  {
    id: 'r3',
    category: 'Чистота',
    name: 'Паровая швабра Luxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-related.jpg',
    href: '/products/steam-mop',
  },
]

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
        <SiteHeader solid mobileSolidAfterSelector="[data-product-gallery]" />
      </div>

      <div className={styles.content}>
        {/* ═══ Hero: Gallery + Info ═══ */}
        <section className={styles.hero}>
          <ProductGallery images={PRODUCT.images} name={PRODUCT.name} />

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
              <AddToCartButton
                id={PRODUCT.slug}
                name={PRODUCT.name}
                price={parseFloat(PRODUCT.priceNew.replace(/[^\d,]/g, '').replace(',', '.'))}
                priceFormatted={PRODUCT.priceNew}
                image="/images/product-card.png"
                href={`/products/${PRODUCT.slug}`}
              />
            </div>

            <div className={styles.divider} />

            <h3 className={styles.deliveryTitle}>Доставка</h3>

            <div className={styles.deliveryRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/delivery-location.svg" alt="" className={styles.deliveryIcon} />
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

        <ProductTabs product={PRODUCT} relatedProducts={RELATED_PRODUCTS} />
      </div>
    </div>
  )
}
