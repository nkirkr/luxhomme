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

          <div className={styles.mobileNav}>
            <nav className={styles.mobileNavPanel} aria-label="Разделы личного кабинета">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${pathname === item.href ? styles.mobileNavLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button type="button" className={styles.mobileNavLogout}>
              Выйти
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
