'use client'

import styles from './SiteFooter.module.css'

/** Site footer with navigation columns and legal info. */
export default function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className={styles.footer}>
      {/* Navigation columns */}
      <nav className={styles.nav}>
        {/* Col 1 — main links */}
        <div className={`${styles.col} ${styles.colLinks}`}>
          <a href="/about">О нас</a>
          <a href="/contact">Связаться с нами</a>
          <a href="#marketplaces">Мы на Маркетплейсах</a>
          <a href="/privacy">Политика конфиденциальности</a>
          <a href="/offer">Оферта</a>
        </div>

        {/* Col 2 — customer service */}
        <div className={`${styles.col} ${styles.colService}`}>
          <p className={`${styles.colHead}`}>Клиентский сервис</p>
          <a href="/delivery">Доставка и оплата</a>
          <a href="/warranty">Сервис и гарантия</a>
        </div>

        {/* Col 3 — legal */}
        <div className={styles.colLegal}>
          <p className={styles.legalHead}>ИП Ахунзянов Марат Асхатович</p>
          <div className={styles.legalList}>
            <p>ИНН/КПП 165910016394</p>
            <p>ОГРНИП 322169000082075</p>
            <p>420139, г.Казань, Р.Зорге 85</p>
          </div>
        </div>
      </nav>

      <div className={styles.divider} />

      {/* Bottom row */}
      <div className={styles.bottom}>
        <p className={styles.copy}>Luxhommè | 2026</p>
        <button className={styles.scrollTop} onClick={scrollToTop} aria-label="Наверх">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-up.svg" alt="" className={styles.scrollTopIcon} />
        </button>
      </div>
    </footer>
  )
}
