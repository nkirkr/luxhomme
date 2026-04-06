import type { Metadata } from 'next'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'

export const metadata: Metadata = {
  title: 'Программа лояльности | Luxhommè',
}

export default function LoyaltyPage() {
  return (
    <DashboardShell>
      <div className={styles.loyaltyHeader}>
        <p className={styles.loyaltyLabel}>Программа лояльности</p>
        <div className={styles.loyaltyBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo-group.svg" alt="" />
          <span className={styles.loyaltyBrandText}>Сообщество</span>
        </div>

        <p className={styles.levelLabel}>ваш уровень:</p>

        <div className={styles.levelRow}>
          <h2 className={styles.levelName}>Дорогой гость</h2>
          <p className={styles.levelNameNext}>Новый друг</p>
        </div>

        <p className={styles.levelFrom}>от 0 ₽</p>

        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressDot} />
          </div>
          <button className={styles.progressArrow}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-up-right.svg" alt="Следующий уровень" />
          </button>
        </div>

        <div className={styles.badges}>
          <span className={styles.badge}>500 баллов</span>
          <span className={styles.badge}>Кэшбек 0%</span>
          <span className={styles.badge}>Подарок</span>
        </div>

        <p className={styles.bonusLabel}>начисляется баллами</p>

        <div className={styles.levelImages}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/loyalty-level-1.jpg"
            alt="Текущий уровень"
            className={styles.levelImage}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/loyalty-level-1.jpg"
            alt="Следующий уровень"
            className={styles.levelImage}
          />
        </div>

        <p className={styles.progressLabel}>текущий прогресс</p>
        <p className={styles.progressValue}>0 ₽</p>
      </div>
    </DashboardShell>
  )
}
