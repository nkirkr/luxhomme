'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap-config'
import { ScrollTrigger } from '@/lib/gsap-config'
import { useGSAP } from '@gsap/react'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  y?: number
  duration?: number
  delay?: number
  stagger?: number
}

export function ScrollReveal({
  children,
  className,
  y = 60,
  duration = 0.8,
  delay = 0,
  stagger = 0.1,
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) return

      const elements = gsap.utils.toArray<HTMLElement>('.gsap-reveal', container.current!)

      if (elements.length === 0) {
        gsap.from(container.current!, {
          y,
          opacity: 0,
          duration,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      } else {
        gsap.from(elements, {
          y,
          opacity: 0,
          duration,
          delay,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    },
    { scope: container }
  )

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  )
}
