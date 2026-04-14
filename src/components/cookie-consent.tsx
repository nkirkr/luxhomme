'use client'

import { useState, useSyncExternalStore, useCallback } from 'react'
import styles from './cookie-consent.module.css'

const COOKIE_KEY = 'cookie-consent'

function getConsentSnapshot() {
  if (typeof window === 'undefined') return 'unknown'
  return localStorage.getItem(COOKIE_KEY) ?? 'none'
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getConsentSnapshot, () => 'unknown')
  const [dismissed, setDismissed] = useState(false)

  const accept = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setDismissed(true)
  }, [])

  if (dismissed || consent !== 'none') return null

  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        {
          'Используя сайт, вы соглашаетесь с Политикой\nконфиденциальности и обработкой персональных данных'
        }
      </p>
      <button className={styles.btn} onClick={accept}>
        Принять
      </button>
    </div>
  )
}
