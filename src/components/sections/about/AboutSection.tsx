import Image from 'next/image'
import styles from './AboutSection.module.css'

/** "О компании" — About section with photo, tags column and content. */
export default function AboutSection() {
  return (
    <section className={styles.section}>
      {/* ── Left: product photo ── */}
      <div className={styles.photo}>
        <Image
          src="/images/about-photo.jpg"
          alt="Продукт Luxhommè"
          fill
          className={styles.photoImage}
        />
      </div>

      {/* ── Middle: vertical tags / nav column ── */}
      <div className={styles.tags}>
        <p className={styles.tagLabel}>о бренде</p>

        <div className={styles.lineWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/line-vertical.svg" alt="" className={styles.lineImg} />
        </div>

        <a href="/catalog" className={styles.catalogBtn}>
          к каталогу
        </a>

        <div className={styles.decor}>
          <div className={styles.decorInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/decor-cross.svg" alt="" className={styles.decorImg} />
          </div>
        </div>
      </div>

      {/* ── Right: content ── */}
      <div className={styles.content}>
        {/* "о бренде" label — visible on mobile only */}
        <p className={styles.mobileLabel}>о бренде</p>

        {/* Heading */}
        <div className={styles.heading}>
          <p className={styles.headingLine}>Ощущение дома рождается</p>
          <span className={styles.headingMixed}>
            <span className={styles.headingMixedNormal}>из</span>{' '}
            <span className={styles.headingMixedScript}>&nbsp;уюта</span>
          </span>
          <p className={styles.headingLine}>Уют — с Luxhommè</p>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Logo + description */}
        <div className={styles.description}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo-group-black.svg" alt="Luxhommè" className={styles.logoGroup} />
          <p className={styles.descText}>
            Luxhommè — бытовая техника для тех, кто ценит жизнь и комфорт.
          </p>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Values */}
        <div className={styles.values}>
          <p className={styles.valuesLabel}>Наши ценности:</p>
          <div className={styles.valuesList}>
            <div className={styles.valueItem}>
              <p className={styles.valueName}>Забота</p>
              <p className={styles.valueDesc}>
                Бережная помощь в повседневных делах для всей семьи
              </p>
            </div>
            <div className={styles.valueItem}>
              <p className={styles.valueName}>Комфорт</p>
              <p className={styles.valueDesc}>Простая и понятная техника для гармонии дома</p>
            </div>
            <div className={styles.valueItem}>
              <p className={styles.valueName}>Красота</p>
              <p className={styles.valueDesc}>
                Сдержанная эстетика как естественное продолжение дома
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
