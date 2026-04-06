import styles from './ClubSection.module.css'

/** «Клуб лояльности» — full-width banner with background photo. */
export default function ClubSection() {
  return (
    <section className={styles.section}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/club-bg.jpg" alt="" className={styles.bg} />

      <div className={styles.content}>
        {/* Community badge */}
        <div className={styles.badge}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo-group.svg" alt="Luxhommè" className={styles.badgeLogo} />
          <p className={styles.badgeText}>Сообщество</p>
        </div>

        {/* Heading */}
        <div className={styles.heading}>
          <p className={styles.headingLight}>Клуб</p>
          <p className={styles.headingScript}>лояльности</p>
        </div>

        {/* CTA */}
        <a href="/club" className={styles.joinBtn}>
          вступить
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-up-right.svg" alt="" className={styles.joinArrow} />
        </a>
      </div>
    </section>
  )
}
