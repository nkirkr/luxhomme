import styles from './NewsSection.module.css'

interface NewsCardProps {
  image: string
  tag: string
  title: string
  text: string
  className?: string
  smallFooter?: boolean
}

function NewsCard({ image, tag, title, text, className, smallFooter }: NewsCardProps) {
  return (
    <article className={`${styles.card} ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className={styles.cardBg} />
      <div className={styles.cardOverlay} />
      <span className={styles.cardTag}>{tag}</span>
      {smallFooter ? (
        <div className={styles.cardFooterSmall}>
          <p className={styles.cardTitle}>{title}</p>
          <p className={styles.cardText}>{text}</p>
        </div>
      ) : (
        <div className={styles.cardFooter}>
          <p className={styles.cardTitle}>{title}</p>
          <p className={styles.cardText}>{text}</p>
        </div>
      )}
    </article>
  )
}

/** «Посты / Жизнь проще» — 2-column news grid with intro text. */
export default function NewsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.topDivider} />
      <div className={styles.grid}>
        {/* ── Left column ── */}
        <div className={styles.colLeft}>
          <div className={styles.meta}>
            {/* Community badge */}
            <div className={styles.communityBadge}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/logo-luxhomme-text.svg"
                alt="Luxhommè"
                className={styles.communityLogo}
              />
              <p className={styles.communityText}>Сообщество</p>
            </div>

            {/* "Жизнь проще" tagline */}
            <div className={styles.taglineBlock}>
              <div className={styles.taglineHeading}>
                <p className={styles.taglineH1}>Жизнь</p>
                <p className={styles.taglineScript}>проще</p>
              </div>
              <div className={styles.taglineDesc}>
                <p>Узнайте, как сделать жизнь проще:</p>
                <p>
                  приготовить ужин с удовольствием, провести утро в спокойствии и поддерживать дом в
                  чистоте без напряжения.
                </p>
              </div>
            </div>
          </div>

          {/* Large card */}
          <NewsCard
            image="/images/news-1.jpg"
            tag="Уборка"
            title="Новые продукты Luxhommè"
            text="Luxhommè не останавливается на достигнутом — мы стремимся сделать жизнь хозяек ещё легче и ярче. Разработка новых продуктов идёт полным ходом, и мы готовы поделиться, что ждёт вас совсем скоро!"
            className={styles.cardLarge}
          />
        </div>

        {/* ── Right column ── */}
        <div className={styles.colRight}>
          {/* Top card */}
          <NewsCard
            image="/images/news-2.jpg"
            tag="Уборка"
            title="Философия уюта"
            text="Как Luxhommè помогает заботиться о себе"
            className={styles.cardTop}
          />

          {/* Bottom row — two small cards */}
          <div className={styles.cardRow}>
            <NewsCard
              image="/images/news-3.jpg"
              tag="Уборка"
              title="Ритуалы для женщин"
              text="Как Luxhommè вдохновляет на заботу о себе"
              className={styles.cardSmall}
              smallFooter
            />
            <NewsCard
              image="/images/news-4.jpg"
              tag="Уборка"
              title="Продукты Luxhommè"
              text="Техника для уюта и заботы о женщинах"
              className={styles.cardSmall}
              smallFooter
            />
          </div>
        </div>
      </div>
    </section>
  )
}
