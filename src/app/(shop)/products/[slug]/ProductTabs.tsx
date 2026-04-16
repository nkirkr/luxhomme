'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { ProductCard, type Product } from '@/components/sections/series-catalog/SeriesCatalog'
import styles from './product.module.css'

import 'swiper/css'

type Tab = 'Описание' | 'Характеристики' | 'Отзывы' | 'Аксессуары' | 'Инструкция'

const TABS: Tab[] = ['Описание', 'Характеристики', 'Отзывы', 'Аксессуары', 'Инструкция']

const REVIEW_FILTERS = [
  'Все',
  'С фото',
  'С видео',
  'Сначала положительные',
  'Сначала отрицательные',
]

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={i <= count ? '/icons/star-filled.svg' : '/icons/star-empty.svg'}
          alt=""
          className={styles.starIcon}
        />
      ))}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.specRow}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{value}</span>
    </div>
  )
}

interface ProductTabsProps {
  product: {
    descSlides: { image: string; title: string; text: string }[]
    specs: {
      main: { label: string; value: string }[]
      general: { label: string; value: string }[]
      power: { label: string; value: string }[]
      control: { label: string; value: string }[]
      tech: { label: string; value: string }[]
      materials: { label: string; value: string }[]
      extra: { label: string; value: string }[]
      dimensions: { label: string; value: string }[]
    }
    accessories: { name: string; image: string; giftBadge?: string }[]
    instruction: { label: string; href: string }
    reviews: { date: string; author: string; rating: number; text: string; photo: string }[]
    ratingAvg: string
  }
  relatedProducts: Product[]
}

function AccessoriesSwiper({ items }: { items: ProductTabsProps['product']['accessories'] }) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const syncNav = (s: SwiperType) => {
    setAtStart(s.isBeginning)
    setAtEnd(s.isEnd)
  }

  return (
    <div className={styles.accessoriesSwiperWrap}>
      <button
        type="button"
        className={`${styles.accessoriesNavBtn} ${styles.accessoriesNavPrev}`}
        disabled={atStart}
        aria-label="Предыдущие аксессуары"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/arrow-left-black-1.svg" alt="" className={styles.accessoriesNavIcon} />
      </button>

      <div className={styles.accessoriesSwiperViewport}>
        <Swiper
          className={styles.accessoriesSwiper}
          slidesPerView="auto"
          onSwiper={(s) => {
            swiperRef.current = s
            syncNav(s)
          }}
          onSlideChange={syncNav}
          onResize={(s) => syncNav(s)}
        >
          {items.map((acc, i) => (
            <SwiperSlide key={i} className={styles.accessorySlide}>
              <div className={styles.accessoryCard}>
                {acc.giftBadge ? (
                  <span className={styles.accessoryBadge}>{acc.giftBadge}</span>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={acc.image} alt={acc.name} className={styles.accessoryImage} />
                <p className={styles.accessoryName}>{acc.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        type="button"
        className={`${styles.accessoriesNavBtn} ${styles.accessoriesNavNext}`}
        disabled={atEnd}
        aria-label="Следующие аксессуары"
        onClick={() => swiperRef.current?.slideNext()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/arrow-right-black.svg" alt="" className={styles.accessoriesNavIcon} />
      </button>
    </div>
  )
}

export function ProductTabs({ product, relatedProducts }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Описание')
  const [activeDescIndex, setActiveDescIndex] = useState(0)

  const descSlides = product.descSlides
  const len = descSlides.length
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackOffset, setTrackOffset] = useState(0)

  const computeOffset = useCallback(() => {
    const track = trackRef.current
    if (!track || len === 0) return

    const viewport = track.parentElement!
    const vpWidth = viewport.clientWidth
    const trackStyle = getComputedStyle(track)
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0')

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const carouselStyle = getComputedStyle(viewport)
    const activeW = parseFloat(carouselStyle.getPropertyValue('--slide-active-w')) * rootFontSize
    const inactiveW =
      parseFloat(carouselStyle.getPropertyValue('--slide-inactive-size')) * rootFontSize

    let slideCenter = 0
    for (let i = 0; i < activeDescIndex; i++) {
      slideCenter += inactiveW + gap
    }
    slideCenter += activeW / 2

    setTrackOffset(slideCenter - vpWidth / 2)
  }, [activeDescIndex, len])

  useEffect(() => {
    computeOffset()
    window.addEventListener('resize', computeOffset)
    return () => window.removeEventListener('resize', computeOffset)
  }, [computeOffset])

  const handlePrevDesc = () => {
    if (len <= 1) return
    setActiveDescIndex((i) => (i - 1 + len) % len)
  }

  const handleNextDesc = () => {
    if (len <= 1) return
    setActiveDescIndex((i) => (i + 1) % len)
  }

  return (
    <>
      {/* ═══ Tabs nav ═══ */}
      <div className={styles.descTabs}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.descTab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ═══ Описание ═══ */}
      {activeTab === 'Описание' && (
        <section className={styles.descSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.descBody}>
            <div className={styles.descCarousel} aria-label="Описание товара: слайдер">
              <div
                className={styles.descTrack}
                ref={trackRef}
                style={{ transform: `translateX(${-trackOffset}px)` }}
              >
                {descSlides.map((slide, idx) => {
                  const isActive = idx === activeDescIndex
                  return (
                    <div
                      key={idx}
                      className={`${styles.descSlide} ${isActive ? styles.descSlideActive : ''}`}
                      onClick={() => !isActive && setActiveDescIndex(idx)}
                    >
                      {isActive ? (
                        <div className={styles.descActiveFrame}>
                          <button
                            type="button"
                            className={styles.descArrowLeft}
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePrevDesc()
                            }}
                            disabled={len <= 1}
                            aria-label="Предыдущий слайд"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icons/arrow-left-black.svg" alt="" />
                          </button>

                          <div className={styles.descActiveInner}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={slide.image} alt="" className={styles.descSlideImage} />
                          </div>

                          <button
                            type="button"
                            className={styles.descArrowRight}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNextDesc()
                            }}
                            disabled={len <= 1}
                            aria-label="Следующий слайд"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icons/arrow-right-01-sharp.svg" alt="" />
                          </button>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={slide.image} alt="" className={styles.descSlideImage} />
                      )}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className={styles.descText}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
                          >
                            <h3 className={styles.descTextTitle}>{slide.title}</h3>
                            <p className={styles.descTextBody}>{slide.text}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Характеристики ═══ */}
      {activeTab === 'Характеристики' && (
        <section className={styles.specsSection} id="specs">
          <div className={styles.sectionHeading}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <h2 className={styles.sectionTitle}>Характеристики</h2>
            </div>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.specsBody}>
            <div className={styles.specsDrawings}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/specs.png" alt="Чертёж" className={styles.drawingImage} />
            </div>

            <div className={styles.specsTable}>
              <div className={styles.specsColumns}>
                <div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Основная информация</h4>
                    {product.specs.main.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Питание</h4>
                    {product.specs.power.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Технические особенности</h4>
                    {product.specs.tech.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Дополнительная информация</h4>
                    {product.specs.extra.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Габариты</h4>
                    {product.specs.dimensions.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Общие характеристики</h4>
                    {product.specs.general.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Управление</h4>
                    {product.specs.control.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                  <div className={styles.specsGroup}>
                    <h4 className={styles.specsGroupTitle}>Материалы</h4>
                    {product.specs.materials.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Отзывы ═══ */}
      {activeTab === 'Отзывы' && (
        <section className={styles.reviewsSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Отзывы</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.reviewsHeader}>
            <div className={styles.reviewsLeft}>
              <div className={styles.ratingRow}>
                <Stars count={5} />
                <span className={styles.ratingText}>{product.ratingAvg}</span>
              </div>
              <p className={styles.ratingCaption}>
                Рейтинг формируется на основе актуальных отзывов
              </p>
              <button className={styles.btnReview}>Написать отзыв</button>
            </div>

            <div className={styles.reviewFilters}>
              {REVIEW_FILTERS.map((f) => (
                <button key={f} className={styles.filterBtn}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.reviewCards}>
            {product.reviews.map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.reviewCardTop}>
                  <span className={styles.reviewDate}>{review.date}</span>
                  <div className={styles.ozonBadge}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/ozon-logo.svg" alt="Ozon" />
                  </div>
                </div>
                <div className={styles.reviewRatingRow}>
                  <Stars count={review.rating} />
                  <span className={styles.reviewAuthor}>{review.author}</span>
                </div>
                <div className={styles.reviewDivider} />
                <p className={styles.reviewLabel}>Отзыв</p>
                <p className={styles.reviewText}>{review.text}</p>
                <div className={styles.reviewDivider} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.photo} alt="" className={styles.reviewPhoto} />
              </div>
            ))}
          </div>

          <button className={styles.btnShowMore}>Показать ещё</button>
        </section>
      )}

      {/* ═══ Аксессуары ═══ */}
      {activeTab === 'Аксессуары' && (
        <>
          <section className={styles.accessoriesSection}>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Аксессуары</h2>
              <div className={styles.sectionLine} />
            </div>

            <AccessoriesSwiper items={product.accessories} />
          </section>
        </>
      )}

      {/* ═══ Инструкция  ═══ */}
      {activeTab === 'Инструкция' && (
        <section className={styles.instructionSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Инструкция</h2>
            <div className={styles.sectionLine} />
          </div>

          <a href={product.instruction.href} className={styles.instructionBtn} download>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/pdf-icon.svg" alt="" className={styles.instructionIcon} />
            <span className={styles.instructionLabel}>{product.instruction.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/download-icon.svg" alt="" className={styles.instructionDownload} />
          </a>
        </section>
      )}

      {/* ═══ Related products — always visible ═══ */}
      <section className={styles.relatedSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Другие товары</h2>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.relatedGrid}>
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}
