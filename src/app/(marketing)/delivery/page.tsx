import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import {
  acfImageSrc,
  acfTrimmedString,
  paragraphsFromAcfText,
} from '@/lib/wordpress-rest/acf-helpers'
import {
  acfAttachmentId,
  fetchWpMediaSourceUrlsByIds,
  fetchWpPageBySlug,
  wpAcfRecord,
} from '@/lib/wordpress-rest/pages'
import styles from './delivery.module.css'

const DELIVERY_PAGE_SLUG =
  (process.env.WORDPRESS_DELIVERY_PAGE_SLUG ?? 'delivery').trim() || 'delivery'

export const metadata: Metadata = {
  title: 'Доставка и оплата | Luxhommè',
  description: 'Доставка Ozon и СДЭК по всей России. Оплата через Яндекс Пэй и Яндекс Сплит.',
}

function BannerPicture({
  wpUrl,
  className,
  fallbackDesktop,
  fallbackMobile,
  alt,
}: {
  wpUrl: string | null
  className: string
  fallbackDesktop: string
  fallbackMobile: string
  alt: string
}) {
  if (wpUrl) {
    return <img src={wpUrl} alt={alt} className={className} />
  }
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={fallbackMobile} />
      <img src={fallbackDesktop} alt={alt} className={className} />
    </picture>
  )
}

export default async function DeliveryPage() {
  const wpPage = await fetchWpPageBySlug(DELIVERY_PAGE_SLUG)
  const acf = wpPage ? wpAcfRecord(wpPage.acf) : null

  const section1Title = acfTrimmedString(acf?.page_title_1) ?? 'Доставка'
  const delivery1Title = acfTrimmedString(acf?.delivery_type_1_title) ?? 'Ozon доставка'
  const delivery1Text =
    acfTrimmedString(acf?.delivery_type_1_text) ??
    'Ваш заказ приедет быстрее и удобнее — в любой пункт выдачи Ozon по России.\nОтслеживание заказа в приложении Ozon.'

  const delivery2Title = acfTrimmedString(acf?.delivery_type_2_title) ?? 'СДЭК доставка'
  const delivery2Paragraphs = paragraphsFromAcfText(acfTrimmedString(acf?.delivery_type_2_text), [
    'C помощью ТК СДЭК до ПВЗ или курьером до двери.',
  ])

  const section2Title = acfTrimmedString(acf?.page_title_2) ?? 'Оплата и рассрочка'

  const mediaIds = [
    acfAttachmentId(acf?.delivery_type_1_img),
    acfAttachmentId(acf?.delivery_type_2_img),
    acfAttachmentId(acf?.payment_type_1_img),
    acfAttachmentId(acf?.payment_type_2_img),
  ].filter((id): id is number => id !== undefined)

  const mediaById = await fetchWpMediaSourceUrlsByIds(mediaIds)

  const delivery1ImgUrl = acfImageSrc(acf?.delivery_type_1_img, mediaById, '')
  const delivery2ImgUrl = acfImageSrc(acf?.delivery_type_2_img, mediaById, '')
  const payment1ImgUrl = acfImageSrc(acf?.payment_type_1_img, mediaById, '')
  const payment2ImgUrl = acfImageSrc(acf?.payment_type_2_img, mediaById, '')

  const delivery1Wp = delivery1ImgUrl && delivery1ImgUrl !== '' ? delivery1ImgUrl : null
  const delivery2Wp = delivery2ImgUrl && delivery2ImgUrl !== '' ? delivery2ImgUrl : null
  const payment1Wp = payment1ImgUrl && payment1ImgUrl !== '' ? payment1ImgUrl : null
  const payment2Wp = payment2ImgUrl && payment2ImgUrl !== '' ? payment2ImgUrl : null

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h1 className={styles.heading}>{section1Title}</h1>
          <div className={styles.divider} />
        </div>

        <div className={styles.cardsRow}>
          <div className={styles.deliveryCard}>
            <div>
              <h2 className={styles.cardTitle}>{delivery1Title}</h2>
              <div className={`${styles.cardDesc} ${styles.cardDescSingle}`}>
                <p>{delivery1Text}</p>
              </div>
            </div>

            <div className={styles.cardBanner}>
              <BannerPicture
                wpUrl={delivery1Wp}
                className={styles.cardBannerBg}
                fallbackDesktop="/images/ozon-delivery.png"
                fallbackMobile="/images/ozon-delivery-mob.png"
                alt=""
              />
            </div>
          </div>

          <div className={styles.deliveryCard}>
            <div>
              <h2 className={styles.cardTitle}>{delivery2Title}</h2>
              <div className={styles.cardDesc}>
                {delivery2Paragraphs.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            <div className={styles.cdekBanner}>
              <BannerPicture
                wpUrl={delivery2Wp}
                className={styles.cdekBannerBg}
                fallbackDesktop="/images/cdek-delivery.png"
                fallbackMobile="/images/cdek-delivery-mob.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h2 className={styles.heading}>{section2Title}</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.paymentRow}>
          <div className={styles.paymentCard}>
            <BannerPicture
              wpUrl={payment1Wp}
              className={styles.paymentBg}
              fallbackDesktop="/images/yandex-banner.png"
              fallbackMobile="/images/yandex-banner-mob.png"
              alt="Яндекс Пэй"
            />
          </div>

          <div className={styles.paymentCard}>
            <BannerPicture
              wpUrl={payment2Wp}
              className={styles.paymentBg}
              fallbackDesktop="/images/split-banner.png"
              fallbackMobile="/images/split-banner-mob.png"
              alt="Яндекс Сплит"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
