import Link from 'next/link'
import styles from './SiteHeader.module.css'

const navLinks = [
  { label: 'Каталог', href: '/products', hasArrow: true },
  { label: 'О нас', href: '/about', hasArrow: false },
  { label: 'Покупателям', href: '/buyers', hasArrow: true },
  { label: 'Академия', href: '/blog', hasArrow: false },
]

interface SiteHeaderProps {
  /** When true the header is position:relative (not absolute) with dark text */
  solid?: boolean
}

export function SiteHeader({ solid }: SiteHeaderProps) {
  return (
    <header className={`${styles.header} ${solid ? styles.solid : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Luxhommè — на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/logo.svg" alt="Luxhommè" className={styles.logoImage} />
        </Link>

        {/* Desktop navigation */}
        <nav className={styles.nav} aria-label="Основная навигация">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navItem}>
              <span className={styles.navLabel}>{link.label}</span>
              {link.hasArrow && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/icons/header-arrow-down.svg"
                  alt=""
                  className={styles.navArrow}
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className={styles.icons}>
          <Link href="/profile" className={styles.iconBtn} aria-label="Профиль">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/profile.svg" alt="" className={styles.iconImage} />
          </Link>
          <Link href="/cart" className={styles.iconBtn} aria-label="Корзина">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/basket.svg" alt="" className={styles.iconImage} />
            <span className={styles.cartCount}>0</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
