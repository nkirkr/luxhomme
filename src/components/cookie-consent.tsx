'use client'

import { useState, useSyncExternalStore, useCallback } from 'react'
import { Button } from '@/components/ui/button'

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

  const decline = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, 'declined')
    setDismissed(true)
  }, [])

  if (dismissed || consent !== 'none') return null

  return (
    <div className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t p-4 shadow-lg md:right-auto md:bottom-4 md:left-4 md:max-w-md md:rounded-lg md:border">
      <p className="text-muted-foreground mb-3 text-sm">
        We use cookies to improve your experience. By continuing to use this site, you agree to our
        use of cookies.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={accept}>
          Accept
        </Button>
        <Button size="sm" variant="outline" onClick={decline}>
          Decline
        </Button>
      </div>
    </div>
  )
}
