'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import type { ReactNode } from 'react'

export function AOSProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    })
  }, [])

  return <>{children}</>
}
