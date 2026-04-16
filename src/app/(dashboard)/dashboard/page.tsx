import type { Metadata } from 'next'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Программа лояльности | Luxhommè',
}

export default function LoyaltyPage() {
  return (
    <DashboardShell>
      <div className={styles.loyaltyHeader}>
        <div className={styles.loyaltyTopBlock}>
          <p className={styles.loyaltyLabel}>Программа лояльности</p>
          <div className={styles.loyaltyBrand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo-group-black.svg" alt="" />
            <span className={styles.loyaltyBrandText}>Сообщество</span>
          </div>
        </div>

        <div className={styles.levelRow}>
          <div className={styles.levelCenter}>
            <p className={styles.levelLabel}>ваш уровень:</p>
            <h2 className={styles.levelName}>Дорогой гость</h2>
            <p className={styles.levelFrom}>от 0 ₽</p>
          </div>
          <p className={styles.levelNameNext}>Новый друг</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressTrackBg} />
          <div className={styles.progressTrack}>
            <div className={styles.progressDotStart} />
          </div>
          <div className={styles.progressSpacer} aria-hidden />
          <button type="button" className={styles.progressArrow} aria-label="Следующий уровень">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/progress-arrow.svg" alt="" />
          </button>
        </div>

        <div className={styles.levelImages}>
          <div className={styles.levelImageCol}>
            <div className={styles.badges}>
              <span className={styles.badge}>500 баллов</span>
              <span className={styles.badge}>Кэшбек 0%</span>
              <span className={styles.badge}>Подарок</span>
            </div>
            <p className={styles.bonusLabel}>начисляется баллами</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/loyalty-level-1.jpg"
              alt="Текущий уровень"
              className={styles.levelImage}
            />
            <div>
              <p className={styles.progressLabel}>текущий прогресс</p>
              <p className={styles.progressValue}>0 ₽</p>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/loyalty-level-1.jpg"
            alt="Следующий уровень"
            className={clsx(styles.levelImage, styles.levelImageNext)}
          />
        </div>
      </div>
    </DashboardShell>
  )
}
