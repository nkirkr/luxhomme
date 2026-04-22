import type { Metadata } from 'next'
import { Fragment } from 'react'
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
import styles from './about.module.css'

const ABOUT_PAGE_SLUG = (process.env.WORDPRESS_ABOUT_PAGE_SLUG ?? 'about').trim() || 'about'

export const metadata: Metadata = {
  title: 'О нас | Luxhommè',
  description:
    'Luxhommè — бренд бытовой техники, созданный с заботой о вас. Наша философия, продукты и сообщество.',
}

export default async function AboutPage() {
  const wpPage = await fetchWpPageBySlug(ABOUT_PAGE_SLUG)
  const acf = wpPage ? wpAcfRecord(wpPage.acf) : null

  const firstColumnTitle = acfTrimmedString(acf?.first_column_title) ?? 'Наша философия'
  const firstColumnParagraphs = paragraphsFromAcfText(acfTrimmedString(acf?.first_column_text_1), [
    'Luxhommè про свет, дом и человека. Lux символизирует домашнее тепло. Home — уют и безопасность. А в центре всего — hommè — человек.',
    'Мы создаем не просто технику, а решения, которые делают быт проще, теплее и человечнее.',
  ])

  const thirdColumnTitle = acfTrimmedString(acf?.third_column_title) ?? 'Сообщество'
  const thirdColumnText =
    acfTrimmedString(acf?.third_column_text) ??
    'Станьте частью семьи Luxhommè. Делитесь опытом и осваивайте удобные решения для вашего дома в Luxhommè Academy.'

  const secondColumnTitle = acfTrimmedString(acf?.second_column_title) ?? 'Продукты'
  const secondColumnIntro = acfTrimmedString(acf?.second_column_text) ?? 'Мы предлагаем три серии:'
  const cookSeriesText =
    acfTrimmedString(acf?.cook_text) ?? 'Аэрогрили и кофемашины для быстрого и здорового питания.'
  const cleanSeriesText =
    acfTrimmedString(acf?.clean_text) ?? 'Паровые швабры и роботы для мытья окон для лёгкой уборки.'
  const careSeriesText =
    acfTrimmedString(acf?.text_care) ?? 'Виброплатформы для здоровья и комфорта.'
  const secondColumnFooterLines = paragraphsFromAcfText(
    acfTrimmedString(acf?.second_column_text2),
    ['Каждая серия сочетает технологии,', 'безопасность и стиль'],
  )

  const underBannerText =
    acfTrimmedString(acf?.under_banner_text) ??
    'В центре внимания — уют и тишина в доме. Заботливая техника Luxhommè помогает с уборкой и готовкой, поддерживает ваше тело в тонусе.'

  const bannerDescText =
    acfTrimmedString(acf?.banner_text) ??
    'Привет, это Luxhommè. Мы — бренд бытовой техники, созданный с заботой о вас.'

  const mediaAttachmentIds = [
    acfAttachmentId(acf?.banner_img),
    acfAttachmentId(acf?.first_column_icon),
    acfAttachmentId(acf?.second_column_icon),
    acfAttachmentId(acf?.third_column_icon),
  ].filter((id): id is number => id !== undefined)

  const mediaById = await fetchWpMediaSourceUrlsByIds(mediaAttachmentIds)

  const bannerBgSrc = acfImageSrc(acf?.banner_img, mediaById, '/images/about-banner.jpg')

  const firstColumnIconSrc = acfImageSrc(
    acf?.first_column_icon,
    mediaById,
    '/images/about-icon-philosophy.png',
  )
  const secondColumnIconSrc = acfImageSrc(
    acf?.second_column_icon,
    mediaById,
    '/images/about-icon-products.png',
  )
  const thirdColumnIconSrc = acfImageSrc(
    acf?.third_column_icon,
    mediaById,
    '/images/about-icon-philosophy.png',
  )

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* ═══ Hero banner ═══ */}
        <div className={styles.banner}>
          <div className={styles.bannerBg} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerBgSrc} alt="" />
          </div>
          <div className={styles.bannerOverlay} aria-hidden="true" />
          <div className={styles.bannerContent}>
            <div className={styles.bannerTitle}>
              <p className={styles.bannerTitleSans}>нас</p>
              <p className={styles.bannerTitleGogol}>О</p>
            </div>
            <p className={styles.bannerDesc}>{bannerDescText}</p>
          </div>
        </div>

        {/* ═══ Bordered text ═══ */}
        <div className={styles.textBox}>
          <p className={styles.textBoxText}>{underBannerText}</p>
        </div>

        <div className={styles.divider} />

        {/* ═══ Three columns ═══ */}
        <div className={styles.columns}>
          {/* Наша философия */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={firstColumnIconSrc} alt="" />
              </div>
              <div className={styles.colTitleBox}>
                <p className={styles.colTitleText}>{firstColumnTitle}</p>
              </div>
            </div>
            <div className={styles.colBody}>
              {firstColumnParagraphs.map((paragraph, i) => (
                <Fragment key={i}>
                  {i > 0 ? <br /> : null}
                  <p className={styles.colBodyText}>{paragraph}</p>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Продукты */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={secondColumnIconSrc} alt="" />
              </div>
              <div className={styles.colTitleBox}>
                <p className={styles.colTitleText}>{secondColumnTitle}</p>
              </div>
            </div>
            <div className={styles.colBody}>
              <p className={styles.seriesTitle}>{secondColumnIntro}</p>
              <div className={styles.seriesList}>
                <div className={styles.seriesItem}>
                  <span className={`${styles.seriesBadge} ${styles.seriesBadgeCook}`}>Кухня</span>
                  <p className={styles.seriesText}>{cookSeriesText}</p>
                </div>
                <div className={styles.seriesItem}>
                  <span className={`${styles.seriesBadge} ${styles.seriesBadgeClean}`}>
                    Чистота
                  </span>
                  <p className={styles.seriesText}>{cleanSeriesText}</p>
                </div>
                <div className={styles.seriesItem}>
                  <span className={`${styles.seriesBadge} ${styles.seriesBadgeCare}`}>Забота</span>
                  <p className={styles.seriesText}>{careSeriesText}</p>
                </div>
              </div>
            </div>
            <div className={styles.colFooter}>
              <p className={styles.colFooterText}>
                {secondColumnFooterLines.map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* Сообщество */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thirdColumnIconSrc} alt="" />
              </div>
              <div className={styles.colTitleBox}>
                <p className={styles.colTitleText}>{thirdColumnTitle}</p>
              </div>
            </div>
            <div className={styles.colBody}>
              <p className={styles.colBodyText}>{thirdColumnText}</p>
            </div>
          </div>
        </div>

        {/* ═══ Telegram banner ═══ */}
        <div className={styles.telegramBanner}>
          <div className={styles.telegramGradient} aria-hidden="true" />
          <div className={styles.telegramBg} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-telegram-bg.jpg" alt="" />
          </div>
          <div className={styles.telegramBlur} aria-hidden="true" />
          <div className={styles.telegramPhoto} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-telegram-photo.png" alt="" />
          </div>
          <div className={styles.telegramContent}>
            <div className={styles.telegramHeading}>
              <p className={styles.telegramHeadingGogol}>Присоединяйтесь</p>
              <p className={styles.telegramHeadingSans}>к Luxhommè!</p>
            </div>
            <p className={styles.telegramDesc}>
              Читайте наш канал в Телеграм — здесь полезные советы, новости, акции и все новинки
              бренда — <strong>@Luxhomme</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
