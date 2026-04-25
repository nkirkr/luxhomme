import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { getShop } from '@/lib/shop'
import { formatShopPrice } from '@/lib/shop/format-price'
import { fetchInitialReviewsBundle } from '@/lib/shop/reviews-wp'
import {
  buildProductDetailForTabs,
  galleryUrlsFromProduct,
  shopProductToCatalogCard,
  shortSpecsFromProduct,
  stripHtml,
} from '@/lib/shop/product-detail-ui'
import { AddToCartButton } from './AddToCartButton'
import { ProductGallery } from './ProductGallery'
import { ProductTabs } from './ProductTabs'
import styles from './product.module.css'

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
  const shop = await getShop()
  const product = await shop.getProductBySlug(slug)
  if (!product) {
    return { title: 'Товар | Luxhommè' }
  }
  const priceText = formatShopPrice(product.price, product.currency)
  return {
    title: `${product.name} | Luxhommè`,
    description: `Купить ${product.name} — ${priceText}. ${stripHtml(product.description).slice(0, 120)}`,
    alternates: { canonical: `/products/${slug}` },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const shop = await getShop()
  const product = await shop.getProductBySlug(slug)
  if (!product) notFound()

  const { products: relatedRaw } = await shop.getProducts({ limit: 12 })
  const relatedProducts = relatedRaw
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3)
    .map(shopProductToCatalogCard)

  const galleryImages = galleryUrlsFromProduct(product)
  const shortSpecs = shortSpecsFromProduct(product)
  const tabsProduct = buildProductDetailForTabs(product)
  const reviewsSsrInitial = await fetchInitialReviewsBundle(tabsProduct.productId)
  const priceNew = formatShopPrice(product.price, product.currency)
  const hasCompare = product.compareAtPrice !== undefined && product.compareAtPrice > product.price
  const priceOld = hasCompare ? formatShopPrice(product.compareAtPrice!, product.currency) : null
  const thumb = product.images[0]?.url ?? '/images/product-card.png'

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid mobileSolidAfterSelector="[data-product-gallery]" />
      </div>

      <div className={styles.content}>
        <section className={styles.hero}>
          <ProductGallery images={galleryImages} name={product.name} />

          <div className={styles.info}>
            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.aboutRow}>
              <span className={styles.aboutLabel}>О товаре</span>
              <Link href="#specs" className={styles.moreLink}>
                Больше характеристик
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/arrow-up-right.svg" alt="" />
              </Link>
            </div>

            {shortSpecs.map((s) => (
              <SpecRow key={s.label} label={s.label} value={s.value} />
            ))}

            <div className={styles.priceBlock}>
              <div className={styles.priceLeft}>
                {hasCompare && priceOld ? <p className={styles.priceOld}>{priceOld}</p> : null}
                <p className={styles.priceNew}>{priceNew}</p>
                {!product.inStock ? <p className={styles.deliverySub}>Нет в наличии</p> : null}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.btnBuy}>
                Купить в 1 клик
              </button>
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                priceFormatted={priceNew}
                image={thumb}
                href={`/products/${product.slug}`}
              />
            </div>

            <div className={styles.divider} />

            <h3 className={styles.deliveryTitle}>Доставка</h3>

            <div className={styles.deliveryRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/delivery-location.svg" alt="" className={styles.deliveryIcon} />
              <div className={styles.deliveryInfo}>
                <div>
                  <p className={styles.deliveryLabel}>Уточните регион</p>
                  <p className={styles.deliverySub}>Сроки и способ доставки при оформлении</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/arrow-up-right.svg" alt="" className={styles.deliveryArrow} />
              </div>
            </div>
          </div>
        </section>

        <ProductTabs
          product={tabsProduct}
          relatedProducts={relatedProducts}
          reviewsSsrInitial={reviewsSsrInitial}
        />
      </div>
    </div>
  )
}
