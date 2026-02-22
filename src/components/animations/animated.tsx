'use client'

import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { fadeUp } from '@/lib/animation-variants'

interface AnimatedProps {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  once?: boolean
  margin?: string
}

export function Animated({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
  margin = '-80px',
}: AnimatedProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: margin as any })
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
