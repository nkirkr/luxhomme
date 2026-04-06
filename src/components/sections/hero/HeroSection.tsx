import Image from 'next/image'
import styles from './HeroSection.module.css'

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Главный баннер">
      {/* Background image — fill relative to .hero */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        quality={90}
        className={styles.bgImage}
      />
      {/* Dark gradient overlay */}
      <div className={styles.bgOverlay} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Slider arrows */}
        <div className={styles.sliderArrows} aria-label="Управление слайдером">
          <button className={styles.arrowBtn} aria-label="Предыдущий слайд">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-left.svg" alt="" className={styles.arrowIcon} />
          </button>
          <button className={styles.arrowBtn} aria-label="Следующий слайд">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-right.svg" alt="" className={styles.arrowIcon} />
          </button>
        </div>

        {/* Bottom text block */}
        <div className={styles.textBlock}>
          <div className={styles.textRow}>
            <p className={styles.tagline}>
              Техника для тех, кто выбирает комфорт, тепло и заботу&nbsp;— в каждом уголке дома.
            </p>
            <div className={styles.headingGroup}>
              <h1 className={styles.headingMain}>Заботимся о доме</h1>
              <p className={styles.headingScript}>Заботимся о вас</p>
            </div>
          </div>

          {/* Slider dots */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/slider-dots.svg"
            alt=""
            className={styles.sliderDots}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
