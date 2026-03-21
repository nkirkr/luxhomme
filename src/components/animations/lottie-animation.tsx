'use client'

import Lottie from 'lottie-react'
import { useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

interface LottieAnimationProps {
  animationData: Record<string, unknown>
  loop?: boolean
  autoplay?: boolean
  width?: number | string
  height?: number | string
  className?: string
  style?: CSSProperties
}

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  width = 120,
  height = 120,
  className,
  style,
}: LottieAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Lottie
      animationData={animationData}
      loop={shouldReduceMotion ? false : loop}
      autoplay={shouldReduceMotion ? false : autoplay}
      initialSegment={shouldReduceMotion ? [0, 1] : undefined}
      className={className}
      style={{ width, height, ...style }}
    />
  )
}
