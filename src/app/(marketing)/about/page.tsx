import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'О нас | Luxhommè',
  description:
    'Luxhommè — бренд бытовой техники, созданный с заботой о вас. Наша философия, продукты и сообщество.',
}

export default function AboutPage() {
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
            <img src="/images/about-banner.jpg" alt="" />
          </div>
          <div className={styles.bannerOverlay} aria-hidden="true" />
          <div className={styles.bannerContent}>
            <div className={styles.bannerTitle}>
              <p className={styles.bannerTitleSans}>нас</p>
              <p className={styles.bannerTitleGogol}>О</p>
            </div>
            <p className={styles.bannerDesc}>
              Привет, это Luxhommè. Мы — бренд бытовой техники, созданный с заботой о вас.
            </p>
          </div>
        </div>

        {/* ═══ Bordered text ═══ */}
        <div className={styles.textBox}>
          <p className={styles.textBoxText}>
            В центре внимания — уют и тишина в доме. Заботливая техника Luxhommè помогает с уборкой
            и готовкой, поддерживает ваше тело в тонусе.
          </p>
        </div>

        <div className={styles.divider} />

        {/* ═══ Three columns ═══ */}
        <div className={styles.columns}>
          {/* Наша философия */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/about-icon-philosophy.png" alt="" />
              </div>
              <div className={styles.colTitleBox}>
                <p className={styles.colTitleText}>Наша философия</p>
              </div>
            </div>
            <div className={styles.colBody}>
              <p className={styles.colBodyText}>
                Luxhommè про свет, дом и человека. Lux символизирует домашнее тепло. Home — уют и
                безопасность. А в центре всего — hommè — человек.
              </p>
              <br />
              <p className={styles.colBodyText}>
                Мы создаем не просто технику, а решения, которые делают быт проще, теплее и
                человечнее.
              </p>
            </div>
          </div>

          {/* Продукты */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/about-icon-products.png" alt="" />
              </div>
              <div className={styles.colTitleBox}>
                <p className={styles.colTitleText}>Продукты</p>
              </div>
            </div>
            <div className={styles.colBody}>
              <p className={styles.seriesTitle}>Мы предлагаем три серии:</p>
              <div className={styles.seriesList}>
                <div className={styles.seriesItem}>
                  <span className={`${styles.seriesBadge} ${styles.seriesBadgeCook}`}>Кухня</span>
                  <p className={styles.seriesText}>
                    Аэрогрили и кофемашины для быстрого и здорового питания.
                  </p>
                </div>
                <div className={styles.seriesItem}>
                  <span className={`${styles.seriesBadge} ${styles.seriesBadgeClean}`}>
                    Чистота
                  </span>
                  <p className={styles.seriesText}>
                    Паровые швабры и роботы для мытья окон для лёгкой уборки.
                  </p>
                </div>
                <div className={styles.seriesItem}>
                  <span className={`${styles.seriesBadge} ${styles.seriesBadgeCare}`}>Забота</span>
                  <p className={styles.seriesText}>Виброплатформы для здоровья и комфорта.</p>
                </div>
              </div>
            </div>
            <div className={styles.colFooter}>
              <p className={styles.colFooterText}>
                Каждая серия сочетает технологии,
                <br />
                безопасность и стиль
              </p>
            </div>
          </div>

          {/* Сообщество */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/about-icon-philosophy.png" alt="" />
              </div>
              <div className={styles.colTitleBox}>
                <p className={styles.colTitleText}>Сообщество</p>
              </div>
            </div>
            <div className={styles.colBody}>
              <p className={styles.colBodyText}>
                Станьте частью семьи Luxhommè. Делитесь опытом и осваивайте удобные решения для
                вашего дома в Luxhommè Academy.
              </p>
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
