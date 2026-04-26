'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { fetchDashboardUser } from '@/lib/dashboard/api-client'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './dashboard.module.css'
import type { ReactNode } from 'react'

const NAV_ITEMS = [
  { label: 'Программа лояльности', href: '/loyalty' },
  { label: 'Данные', href: '/profile' },
  { label: 'Заказы', href: '/orders' },
  { label: 'Отзывы', href: '/reviews' },
]

export function DashboardLoader() {
  return (
    <div className={styles.contentLoader} aria-busy="true" aria-label="Загрузка">
      <div className={styles.contentLoaderBar} style={{ height: '28rem', width: '55%' }} />
      <div className={styles.contentLoaderBar} style={{ height: '20rem', width: '80%' }} />
      <div className={styles.contentLoaderBar} style={{ height: '20rem', width: '65%' }} />
      <div className={styles.contentLoaderBar} style={{ height: '20rem', width: '72%' }} />
      <div
        className={styles.contentLoaderBar}
        style={{ height: '120rem', width: '100%', marginTop: '8rem' }}
      />
    </div>
  )
}

type DashboardShellProps = {
  children: ReactNode
  loading?: boolean
}

export function DashboardShell({ children, loading }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarReady, setSidebarReady] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bonusBalance, setBonusBalance] = useState<number | null>(null)

  useEffect(() => {
    fetchDashboardUser()
      .then((res) => {
        setDisplayName(res.user.display_name)
        setBonusBalance(res.user.bonus_balance)
      })
      .catch(() => {
        setDisplayName('')
        setBonusBalance(null)
      })
      .finally(() => setSidebarReady(true))
  }, [])

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {!sidebarReady ? (
            <div
              className={styles.sidebarSkeletonUser}
              aria-busy="true"
              aria-label="Загрузка имени"
            >
              <div className={styles.contentLoaderBar} style={{ height: '24rem', width: '88%' }} />
            </div>
          ) : (
            <h1 className={styles.userName}>{displayName || 'Личный кабинет'}</h1>
          )}
          {!sidebarReady ? (
            <div
              className={styles.sidebarSkeletonBalance}
              aria-busy="true"
              aria-label="Загрузка баланса"
            >
              <div className={styles.contentLoaderBar} style={{ height: '14rem', width: '72%' }} />
            </div>
          ) : (
            <div className={styles.balance}>
              <span>Баланс:</span>
              <strong>{bonusBalance !== null ? `${bonusBalance} бонусов` : '—'}</strong>
            </div>
          )}

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

          <button type="button" className={styles.logoutLink} onClick={handleLogout}>
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
            <button type="button" className={styles.mobileNavLogout} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className={styles.content}>{loading ? <DashboardLoader /> : children}</div>
      </div>
    </div>
  )
}
