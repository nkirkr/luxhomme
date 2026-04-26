import type { LoyaltyProgress, LoyaltyRank } from './types'
import { RANK_SETTINGS } from './types'

export const computeLoyaltyProgress = (
  totalSpent: number,
  userRank: string,
  bonusBalance: number,
): LoyaltyProgress => {
  const currentRank = RANK_SETTINGS.find((r) => r.key === userRank) ?? RANK_SETTINGS[0]

  const nextRank = RANK_SETTINGS.find((r) => r.id === currentRank.id + 1) ?? null

  let progressPercent: number
  if (!nextRank) {
    progressPercent = 100
  } else {
    const range = nextRank.minAmount - currentRank.minAmount
    const progress = totalSpent - currentRank.minAmount
    progressPercent = Math.min(100, Math.max(0, (progress / range) * 100))
  }

  return {
    currentRank,
    nextRank,
    progressPercent,
    bonusBalance,
    totalSpent,
  }
}
