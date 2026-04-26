'use client'

import { useEffect, useState } from 'react'
import { fetchDashboardUser } from '@/lib/dashboard/api-client'
import { computeLoyaltyProgress } from '@/lib/dashboard/loyalty'
import type { LoyaltyProgress } from '@/lib/dashboard/types'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'
import clsx from 'clsx'

export default function LoyaltyPage() {
  const [progress, setProgress] = useState<LoyaltyProgress | null>(null)

  useEffect(() => {
    fetchDashboardUser()
      .then((res) => {
        const p = computeLoyaltyProgress(
          res.user.total_spent,
          res.user.user_rank,
          res.user.bonus_balance,
        )
        setProgress(p)
      })
      .catch(() => {})
  }, [])

  return (
    <DashboardShell loading={!progress}>
      <div className={styles.loyaltyPage}>
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
              <h2 className={styles.levelName}>{progress?.currentRank.name || '…'}</h2>
              <p className={styles.levelFrom}>
                от {progress ? progress.currentRank.minAmount.toLocaleString('ru-RU') : '…'} ₽
              </p>
            </div>
            <p className={styles.levelNameNext}>{progress?.nextRank?.name || '—'}</p>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressTrackBg} />
            <div
              className={styles.progressTrack}
              style={{ width: `${progress?.progressPercent ?? 0}%` }}
            >
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
                <span className={styles.badge}>
                  {progress ? progress.bonusBalance : '…'} баллов
                </span>
                <span className={styles.badge}>
                  Кэшбек {progress?.currentRank.bonusPercent || 0}%
                </span>
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
                <p className={styles.progressValue}>
                  {progress ? progress.totalSpent.toLocaleString('ru-RU') : '…'} ₽
                </p>
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
      </div>
    </DashboardShell>
  )
}
