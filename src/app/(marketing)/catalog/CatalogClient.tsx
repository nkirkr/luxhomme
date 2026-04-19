'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { ProductCard, type Product } from '@/components/sections/series-catalog/SeriesCatalog'
import styles from './catalog.module.css'
import clsx from 'clsx'

const CATEGORY_ALL = 'Все'

const PAGE_SIZE = 6

/** Map home «серии» query (?series=) to substring match on WooCommerce category name. */
const SERIES_CATEGORY_HINTS: Record<string, string[]> = {
  kitchen: ['Кухня', 'кухн'],
  clean: ['Чистота', 'Уборка', 'уборк'],
  care: ['Забота', 'Спорт', 'спорт'],
}

function mobileCategoryLabel(cat: string) {
  return cat === CATEGORY_ALL ? 'Все товары' : cat
}

type Props = {
  initialProducts: Product[]
  /** From `/catalog?series=kitchen` — passed from server `searchParams`. */
  seriesFromUrl?: string
}

export default function CatalogClient({ initialProducts, seriesFromUrl }: Props) {
  useEffect(() => {
    console.log('[catalog] cards (client)', initialProducts.length, initialProducts)

    /** RSC не всегда отдаёт тяжёлые пропы в клиент — полные товары (meta/acf) только через dev API. */
    if (process.env.NODE_ENV !== 'development') return

    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/debug/catalog-products', { cache: 'no-store' })
        if (!res.ok) {
          console.warn('[catalog] debug API', res.status, await res.text())
          return
        }
        const data = (await res.json()) as { count?: number; products?: unknown[]; error?: string }
        if (cancelled) return
        if (data.error) {
          console.warn('[catalog] debug API error', data.error)
          return
        }
        console.log(
          '[catalog] shop products + meta/acf (client, GET /api/debug/catalog-products)',
          data.count,
          data.products,
        )
      } catch (e) {
        console.warn('[catalog] debug API fetch failed', e)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [initialProducts])

  const categories = useMemo(() => {
    const names = new Set<string>()
    for (const p of initialProducts) {
      if (p.category) names.add(p.category)
    }
    return [CATEGORY_ALL, ...Array.from(names).sort()]
  }, [initialProducts])

  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL)
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!seriesFromUrl) return
    const hints = SERIES_CATEGORY_HINTS[seriesFromUrl]
    if (!hints?.length) return
    const match = categories.find(
      (c) => c !== CATEGORY_ALL && hints.some((h) => c.toLowerCase().includes(h.toLowerCase())),
    )
    if (match) setActiveCategory(match)
  }, [seriesFromUrl, categories])

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
    let list = initialProducts
    if (activeCategory !== CATEGORY_ALL) {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      )
    }
    return list
  }, [activeCategory, query, initialProducts])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const rows: Product[][] = []
  for (let i = 0; i < visible.length; i += 3) {
    rows.push(visible.slice(i, i + 3))
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.titleBlock}>
        <h1 className={clsx(styles.pageTitle, styles.pageTitleCatalog)}>Каталог товаров</h1>
        <div className={styles.divider} />

        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link href="/">Luxhommè</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>Каталог</span>
        </nav>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {categories.map((cat) => (
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
                {categories.map((cat) => (
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

      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
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
