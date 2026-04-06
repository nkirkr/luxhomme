import styles from './TelegramSection.module.css'

/** «Присоединяйтесь к Luxhommè!» — Telegram channel promo banner. */
export default function TelegramSection() {
  return (
    <section className={styles.section}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/telegram-bg.jpg" alt="" className={styles.bg} />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.heading}>
          <p className={styles.headingScript}>Присоединяйтесь</p>
          <p className={styles.headingLight}>к Luxhommè!</p>
        </div>
        <p className={styles.description}>
          Читайте наш канал в Телеграм — здесь полезные советы, новости, акции и все новинки бренда
          {' — '}
          <span className={styles.handle}>@Luxhomme</span>
        </p>
      </div>
    </section>
  )
}
