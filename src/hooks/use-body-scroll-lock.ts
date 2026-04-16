import * as React from 'react'

/** Блокирует скролл `document.body`, пока `locked === true` (например, открыто модальное окно). */
export function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}
