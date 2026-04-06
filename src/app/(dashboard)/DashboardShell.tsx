'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h1 className={styles.userName}>Иван Иванов</h1>
          <p className={styles.balance}>
            Баланс: <strong>500 бонусов</strong>
          </p>

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

          <button className={styles.logoutLink}>Выйти</button>

          {/* Mobile dropdown */}
          <button className={styles.mobileSelect}>
            {TAB_LABELS[pathname] || 'Программа лояльности'}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-down.svg" alt="" />
          </button>
        </aside>

        {/* Content */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
