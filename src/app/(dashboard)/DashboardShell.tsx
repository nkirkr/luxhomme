'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './dashboard.module.css'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { label: 'Программа лояльности', href: '/dashboard' },
  { label: 'Данные', href: '/profile' },
  { label: 'Заказы', href: '/orders' },
  { label: 'Отзывы', href: '/settings' },
]

const TAB_LABELS: Record<string, string> = {
  '/dashboard': 'Программа лояльности',
  '/profile': 'Данные',
  '/orders': 'Заказы',
  '/settings': 'Отзывы',
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!mobileNavRef.current?.contains(e.target as Node)) {
        setMobileNavOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [mobileNavOpen])

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h1 className={styles.userName}>Иван Иванов</h1>
          <div className={styles.balance}>
            <span>Баланс:</span>
            <strong>500 бонусов</strong>
          </div>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button type="button" className={styles.logoutLink}>
            Выйти
          </button>

          <div className={styles.mobileNav} ref={mobileNavRef}>
            <button
              type="button"
              className={`${styles.mobileSelect} ${mobileNavOpen ? styles.mobileSelectOpen : ''}`}
              aria-expanded={mobileNavOpen}
              aria-haspopup="true"
              aria-controls="dashboard-mobile-nav-menu"
              id="dashboard-mobile-nav-trigger"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              <p>{TAB_LABELS[pathname] || 'Программа лояльности'}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.mobileSelectChevron}
                src="/icons/header-arrow-down-black.svg"
                alt=""
                aria-hidden
              />
            </button>

            <AnimatePresence>
              {mobileNavOpen && (
                <motion.div
                  id="dashboard-mobile-nav-menu"
                  role="menu"
                  aria-labelledby="dashboard-mobile-nav-trigger"
                  className={styles.mobileDropdown}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                >
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={`${styles.mobileDropdownLink} ${pathname === item.href ? styles.mobileDropdownLinkActive : ''}`}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.mobileDropdownLogout}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Выйти
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Content */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
