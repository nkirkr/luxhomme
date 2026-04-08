'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import styles from './SiteHeader.module.css'

const CATALOG_CATEGORIES = [
  {
    title: 'Техника для уборки',
    items: [
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
    ],
  },
  {
    title: 'Техника для кухни',
    items: [
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
    ],
  },
  {
    title: 'Техника для занятий спортом',
    items: [
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
      {
        name: 'Робот мойщик Luxhommè uClean MAX',
        price: '10 899 ₽',
        img: '/images/catalog-menu-product.jpg',
      },
    ],
  },
]

const BUYERS_LINKS = [
  { label: 'Мы на Маркетплейсах', href: '/buy' },
  { label: 'Сервис и гарантия', href: '/service' },
  { label: 'Доставка и оплата', href: '/delivery' },
  { label: 'Контакты', href: '/contact' },
]

const MOBILE_MENU_ITEMS = [
  { label: 'Каталог', href: '/catalog', expandable: false },
  { label: 'О нас', href: '/about', expandable: false },
  { label: 'Покупателям', href: '#', expandable: true, sub: BUYERS_LINKS },
  { label: 'Академия', href: '/blog', expandable: false },
]

interface SiteHeaderProps {
  solid?: boolean
}

export function SiteHeader({ solid }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [buyersOpen, setBuyersOpen] = useState(false)

  const logoSrc = solid ? '/icons/logo-black.svg' : '/icons/logo.svg'
  const profileSrc = solid ? '/icons/profile-black.svg' : '/icons/profile.svg'
  const basketSrc = solid ? '/icons/basket-black.svg' : '/icons/basket.svg'
  const arrowSrc = solid ? '/icons/header-arrow-down-black.svg' : '/icons/header-arrow-down.svg'

  return (
    <>
      <header className={`${styles.header} ${solid ? styles.solid : ''}`}>
        <div className={styles.inner}>
          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            aria-label="Открыть меню"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Luxhommè — на главную">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="Luxhommè" className={styles.logoImage} />
          </Link>

          {/* Desktop navigation */}
          <nav className={styles.nav} aria-label="Основная навигация">
            {/* Каталог with mega-menu */}
            <div
              className={styles.dropdownWrap}
              onMouseEnter={() => setCatalogOpen(true)}
              onMouseLeave={() => setCatalogOpen(false)}
            >
              <Link href="/catalog" className={styles.navItem}>
                <span className={styles.navLabel}>Каталог</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={arrowSrc} alt="" className={styles.navArrow} aria-hidden="true" />
              </Link>
            </div>

            {/* О нас */}
            <Link href="/about" className={styles.navItem}>
              <span className={styles.navLabel}>О нас</span>
            </Link>

            {/* Покупателям with dropdown */}
            <div className={styles.dropdownWrap}>
              <span className={styles.navItem}>
                <span className={styles.navLabel}>Покупателям</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={arrowSrc} alt="" className={styles.navArrow} aria-hidden="true" />
              </span>
              <div className={styles.buyersDropdown}>
                <div className={styles.buyersMenu}>
                  {BUYERS_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.buyersItem}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Академия */}
            <Link href="/blog" className={styles.navItem}>
              <span className={styles.navLabel}>Академия</span>
            </Link>
          </nav>

          {/* Icons */}
          <div className={styles.icons}>
            <Link href="/dashboard" className={styles.iconBtn} aria-label="Профиль">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profileSrc} alt="" className={styles.iconImage} />
            </Link>
            <Link href="/cart" className={styles.iconBtn} aria-label="Корзина">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={basketSrc} alt="" className={styles.iconImage} />
              <span className={styles.cartCount}>0</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ Catalog mega-menu (centered on page) ═══ */}
      <div
        className={`${styles.catalogDropdown} ${catalogOpen ? styles.catalogDropdownOpen : ''}`}
        onMouseEnter={() => setCatalogOpen(true)}
        onMouseLeave={() => setCatalogOpen(false)}
      >
        <div className={styles.catalogMenu}>
          <div className={styles.catalogColumns}>
            {CATALOG_CATEGORIES.map((cat) => (
              <div key={cat.title} className={styles.catalogCol}>
                <p className={styles.catalogColTitle}>{cat.title}</p>
                {cat.items.map((item, idx) => (
                  <Link key={idx} href="/catalog" className={styles.catalogCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt={item.name} className={styles.catalogCardImg} />
                    <div className={styles.catalogCardInfo}>
                      <p className={styles.catalogCardName}>{item.name}</p>
                      <p className={styles.catalogCardPrice}>1 x {item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.catalogFooter}>
            <Link href="/catalog" className={styles.catalogLink}>
              Перейти в каталог
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/arrow-up-right.svg"
                alt=""
                className={styles.catalogLinkArrow}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ Mobile menu overlay ═══ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
          >
            <button
              className={styles.mobileCloseBtn}
              onClick={() => {
                setMobileMenuOpen(false)
                setExpandedSection(null)
              }}
              aria-label="Закрыть меню"
            >
              <svg
                className={styles.mobileCloseSvg}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            <nav className={styles.mobileNavTop}>
              {MOBILE_MENU_ITEMS.map((item) => {
                if (item.expandable && item.sub) {
                  const isOpen = expandedSection === item.label
                  return (
                    <div key={item.label} className={styles.mobileExpandable}>
                      <button
                        className={styles.mobileExpandableHeader}
                        onClick={() => setExpandedSection(isOpen ? null : item.label)}
                      >
                        <span className={styles.mobileExpandableTitle}>{item.label}</span>
                        <svg
                          className={`${styles.mobileExpandableIcon} ${isOpen ? styles.mobileExpandableIconOpen : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.5"
                        >
                          {isOpen ? (
                            <>
                              <path d="M18 6L6 18" />
                              <path d="M6 6l12 12" />
                            </>
                          ) : (
                            <path d="M6 9l6 6 6-6" />
                          )}
                        </svg>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className={styles.mobileSubItems}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            {item.sub.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={styles.mobileSubLink}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
