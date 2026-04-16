'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { ProductCard, type Product } from '@/components/sections/series-catalog/SeriesCatalog'
import styles from './catalog.module.css'
import clsx from 'clsx'

const CATEGORIES = ['Все', 'Уборка', 'Кухня', 'Спорт', 'Аксессуары'] as const
type Category = (typeof CATEGORIES)[number]

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    category: 'Уборка',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '2',
    category: 'Уборка',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '3',
    category: 'Кухня',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '4',
    category: 'Уборка',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '5',
    category: 'Спорт',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '6',
    category: 'Кухня',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '7',
    category: 'Аксессуары',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '8',
    category: 'Уборка',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
  {
    id: '9',
    category: 'Спорт',
    name: 'Паровая швабра\nLuxhommè',
    priceOld: '28 000,00 ₽',
    priceNew: '8 722,00 ₽',
    image: '/images/product-card.png',
    href: '/products/steam-mop',
  },
]

const PAGE_SIZE = 6

/** Interactive catalog page — filters, search, load-more. */
function mobileCategoryLabel(cat: Category) {
  return cat === 'Все' ? 'Все товары' : cat
}

export default function CatalogClient() {
  const [activeCategory, setActiveCategory] = useState<Category>('Все')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileFiltersOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!mobileNavRef.current?.contains(e.target as Node)) {
        setMobileFiltersOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [mobileFiltersOpen])

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS
    if (activeCategory !== 'Все') {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      )
    }
    return list
  }, [activeCategory, query])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // Split into rows of 3
  const rows: Product[][] = []
  for (let i = 0; i < visible.length; i += 3) {
    rows.push(visible.slice(i, i + 3))
  }

  return (
    <div className={styles.page}>
      {/* Header — solid (not overlaid) on catalog page */}
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      {/* Title */}
      <div className={styles.titleBlock}>
        <div className={styles.divider} />
        <h1 className={clsx(styles.pageTitle, styles.pageTitleCatalog)}>Каталог товаров</h1>
        <div className={styles.divider} />

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link href="/">Luxhommè</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>Каталог</span>
        </nav>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Category filters */}
        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : styles.inactive}`}
              onClick={() => {
                setActiveCategory(cat)
                setVisibleCount(PAGE_SIZE)
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={styles.search}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/catalog-search-icon.svg" alt="" className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Введите название или артикул товара"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
          />
        </div>

        <div className={styles.mobileNav} ref={mobileNavRef}>
          <button
            type="button"
            className={`${styles.mobileSelect} ${mobileFiltersOpen ? styles.mobileSelectOpen : ''}`}
            aria-expanded={mobileFiltersOpen}
            aria-haspopup="listbox"
            aria-controls="catalog-mobile-filters"
            id="catalog-mobile-filters-trigger"
            onClick={() => setMobileFiltersOpen((o) => !o)}
          >
            <p>{mobileCategoryLabel(activeCategory)}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.mobileSelectChevron}
              src="/icons/header-arrow-down-black.svg"
              alt=""
              aria-hidden
            />
          </button>

          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                id="catalog-mobile-filters"
                role="listbox"
                aria-labelledby="catalog-mobile-filters-trigger"
                className={styles.mobileDropdown}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={activeCategory === cat}
                    className={`${styles.mobileDropdownItem} ${activeCategory === cat ? styles.mobileDropdownItemActive : ''}`}
                    onClick={() => {
                      setActiveCategory(cat)
                      setVisibleCount(PAGE_SIZE)
                      setMobileFiltersOpen(false)
                    }}
                  >
                    {mobileCategoryLabel(cat)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Product grid */}
      <div className={styles.grid}>
        {visible.length === 0 ? (
          <p className={styles.empty}>Товары не найдены</p>
        ) : (
          rows.map((row, ri) => (
            <div key={ri} className={styles.gridRow}>
              {row.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Показать ещё
          </button>
        </div>
      )}
    </div>
  )
}
