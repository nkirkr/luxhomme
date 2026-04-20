'use client'

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { ProductCard, type Product } from '@/components/sections/series-catalog/SeriesCatalog'
import type { ProductDetailForTabs } from '@/lib/shop/product-detail-ui'
import styles from './product.module.css'

import 'swiper/css'

type Tab = 'Описание' | 'Характеристики' | 'Отзывы' | 'Аксессуары' | 'Инструкция'

const DESC_TAB_ANCHORS: { label: Tab; href: string }[] = [
  { label: 'Описание', href: '#product-description' },
  { label: 'Характеристики', href: '#specs' },
  { label: 'Отзывы', href: '#product-reviews' },
  { label: 'Аксессуары', href: '#product-accessories' },
  { label: 'Инструкция', href: '#product-instruction' },
]

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

function WriteReviewStars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className={styles.reviewModalStars} role="group" aria-label="Оценка по пятибалльной шкале">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={styles.reviewModalStarBtn}
          onClick={() => onChange(i)}
          aria-pressed={i <= value}
          aria-label={`${i} из 5`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={i <= value ? '/icons/star-filled.svg' : '/icons/star-empty.svg'}
            alt=""
            className={styles.starIcon}
          />
        </button>
      ))}
    </div>
  )
}

function WriteReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [rating, setRating] = useState(4)
  const [comment, setComment] = useState('')
  const [fileLabel, setFileLabel] = useState<string | null>(null)

  useBodyScrollLock(open)

  const canSubmit = rating >= 1 && comment.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.reviewModalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className={styles.reviewModal}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="write-review-title"
          >
            <div className={styles.reviewModalHeader}>
              <h3 id="write-review-title" className={styles.reviewModalTitle}>
                Написать отзыв
              </h3>
              <button
                type="button"
                className={styles.reviewModalCloseBtn}
                onClick={onClose}
                aria-label="Закрыть"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.reviewModalCloseIcon} src="/icons/close-modal.svg" alt="" />
              </button>
            </div>

            <div className={styles.reviewModalBody}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className={styles.visuallyHidden}
                tabIndex={-1}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setFileLabel(f ? f.name : null)
                }}
              />
              <button
                type="button"
                className={styles.reviewModalUploadBtn}
                onClick={() => fileRef.current?.click()}
              >
                Загрузить файл
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.reviewModalUploadIcon} src="/icons/upload.svg" alt="" />
              </button>
              {fileLabel ? <p className={styles.reviewModalFileName}>{fileLabel}</p> : null}

              <div className={styles.reviewModalRatingBlock}>
                <p className={styles.reviewModalRatingLabel}>Поставьте оценку</p>
                <WriteReviewStars value={rating} onChange={setRating} />
              </div>

              <div className={styles.reviewModalCommentBox}>
                <p className={styles.reviewModalCommentLabel}>Напишите комментарий</p>
                <textarea
                  className={styles.reviewModalTextarea}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Введите текст"
                  rows={4}
                  aria-label="Текст отзыва"
                />
              </div>

              <button
                type="button"
                className={styles.reviewModalSubmit}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Отправить
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
  product: ProductDetailForTabs
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
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewModalKey, setReviewModalKey] = useState(0)
  const [specsExpanded, setSpecsExpanded] = useState(false)
  const descTabAnchors =
    product.accessories.length > 0
      ? DESC_TAB_ANCHORS
      : DESC_TAB_ANCHORS.filter((a) => a.href !== '#product-accessories')
  const descSlides = product.descSlides
  const len = descSlides.length
  const loop = len > 1
  const extendedSlides = loop ? [...descSlides, ...descSlides, ...descSlides] : descSlides

  const [activeVirtual, setActiveVirtual] = useState(() => (loop ? len : 0))
  const [glideTransform, setGlideTransform] = useState(true)
  const activeVirtualRef = useRef(activeVirtual)

  const carouselRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackOffset, setTrackOffset] = useState(0)

  useLayoutEffect(() => {
    activeVirtualRef.current = activeVirtual
  }, [activeVirtual])

  const computeOffset = useCallback(() => {
    const track = trackRef.current
    const viewport = carouselRef.current
    if (!track || !viewport || len === 0) return

    const vpWidth = viewport.clientWidth
    const trackStyle = getComputedStyle(track)
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || 0

    const first = track.children[0] as HTMLElement | undefined
    if (!first) return
    const slotW = first.offsetWidth
    if (slotW <= 0) return

    const idx = Math.min(activeVirtual, track.children.length - 1)
    const slideCenter = idx * (slotW + gap) + slotW / 2
    setTrackOffset(slideCenter - vpWidth / 2)
  }, [activeVirtual, len])

  useLayoutEffect(() => {
    computeOffset()
  }, [computeOffset, glideTransform])

  useEffect(() => {
    computeOffset()
    window.addEventListener('resize', computeOffset)
    return () => window.removeEventListener('resize', computeOffset)
  }, [computeOffset])

  const handleTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return
    if (!loop) return

    const v = activeVirtualRef.current
    if (v >= 2 * len) {
      setGlideTransform(false)
      setActiveVirtual(v - len)
      return
    }
    if (v < len) {
      setGlideTransform(false)
      setActiveVirtual(v + len)
    }
  }

  useLayoutEffect(() => {
    if (!glideTransform) {
      const id = requestAnimationFrame(() => setGlideTransform(true))
      return () => cancelAnimationFrame(id)
    }
  }, [glideTransform])

  useEffect(() => {
    if (!loop) return

    const id = window.setInterval(() => {
      setGlideTransform(true)
      setActiveVirtual((v) => v + 1)
    }, 3500)

    return () => window.clearInterval(id)
  }, [loop, activeVirtual])

  return (
    <>
      <WriteReviewModal
        key={reviewModalKey}
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

      {/* ═══ Якорная навигация по секциям ═══ */}
      <nav className={styles.descTabs} aria-label="Разделы страницы товара">
        {descTabAnchors.map(({ label, href }) => (
          <a key={label} href={href} className={styles.descTab}>
            {label}
          </a>
        ))}
      </nav>

      {/* ═══ Описание ═══ */}
      <section id="product-description" className={styles.descSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Описание</h2>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.descBody}>
          <div className={styles.descCarouselBleed}>
            <div
              className={`${styles.descCarousel} ${!glideTransform ? styles.descCarouselLoopSnap : ''}`}
              ref={carouselRef}
              aria-label="Описание товара: слайдер"
            >
              <div
                className={styles.descTrack}
                ref={trackRef}
                style={{
                  transform: `translateX(${-trackOffset}px)`,
                  transition: glideTransform
                    ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'none',
                }}
                onTransitionEnd={handleTrackTransitionEnd}
              >
                {extendedSlides.map((slide, idx) => {
                  const isActive = idx === activeVirtual

                  return (
                    <div
                      key={idx}
                      className={`${styles.descSlide} ${isActive ? styles.descSlideActive : ''}`}
                      onClick={() => {
                        if (!isActive) {
                          setGlideTransform(true)
                          setActiveVirtual(idx)
                        }
                      }}
                    >
                      <div className={styles.descMediaCell}>
                        <div
                          className={`${styles.descMediaShell} ${isActive ? styles.descMediaShellActive : ''}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={slide.image} alt="" className={styles.descSlideImage} />
                        </div>
                      </div>
                      <div className={styles.descTextSlot}>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              key={idx}
                              className={styles.descText}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.28, ease: 'easeOut' }}
                            >
                              <h3 className={styles.descTextTitle}>{slide.title}</h3>
                              <p className={styles.descTextBody}>{slide.text}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Характеристики ═══ */}
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
            <img
              src={product.specsDrawingSrc}
              alt="Схема устройства"
              className={styles.drawingImage}
            />
          </div>

          <div className={styles.specsTable}>
            <div className={styles.specsRows}>
              {product.specsGroups && product.specsGroups.length > 0 ? (
                <>
                  {product.specsGroups.slice(0, 2).map((g, gi) => (
                    <div key={`${g.title}-${gi}`} className={styles.specsGroup}>
                      <h4 className={styles.specsGroupTitle}>{g.title}</h4>
                      {g.rows.map((s, ri) => (
                        <SpecRow
                          key={`${g.title}-${s.label}-${ri}`}
                          label={s.label}
                          value={s.value}
                        />
                      ))}
                    </div>
                  ))}
                  {product.specsGroups.length > 2 ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.specsMoreBtn} ${specsExpanded ? styles.specsMoreBtnHidden : ''}`}
                        onClick={() => setSpecsExpanded(true)}
                        aria-expanded={specsExpanded}
                        aria-controls="pdp-specs-rest"
                      >
                        Больше характеристик
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/icons/specs-more.svg"
                          alt=""
                          className={styles.specsMoreBtnIcon}
                        />
                      </button>
                      <div
                        id="pdp-specs-rest"
                        className={`${styles.specsCollapsible} ${!specsExpanded ? styles.specsCollapsibleClosed : ''}`}
                      >
                        {product.specsGroups.slice(2).map((g, gi) => (
                          <div key={`${g.title}-${gi + 2}`} className={styles.specsGroup}>
                            <h4 className={styles.specsGroupTitle}>{g.title}</h4>
                            {g.rows.map((s, ri) => (
                              <SpecRow
                                key={`${g.title}-${s.label}-${ri}`}
                                label={s.label}
                                value={s.value}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </>
              ) : (
                <>
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
                  <button
                    type="button"
                    className={`${styles.specsMoreBtn} ${specsExpanded ? styles.specsMoreBtnHidden : ''}`}
                    onClick={() => setSpecsExpanded(true)}
                    aria-expanded={specsExpanded}
                    aria-controls="pdp-specs-rest"
                  >
                    Больше характеристик
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/specs-more.svg" alt="" className={styles.specsMoreBtnIcon} />
                  </button>
                  <div
                    id="pdp-specs-rest"
                    className={`${styles.specsCollapsible} ${!specsExpanded ? styles.specsCollapsibleClosed : ''}`}
                  >
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Отзывы ═══ */}
      <section id="product-reviews" className={styles.reviewsSection}>
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
            <p className={styles.ratingCaption}>Рейтинг формируется на основе актуальных отзывов</p>
            <button
              type="button"
              className={styles.btnReview}
              onClick={() => {
                setReviewModalKey((k) => k + 1)
                setReviewModalOpen(true)
              }}
            >
              Написать отзыв
            </button>
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

      {/* ═══ Аксессуары (meta `_product_accessories` / ACF) ═══ */}
      {product.accessories.length > 0 ? (
        <section id="product-accessories" className={styles.accessoriesSection}>
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>Аксессуары</h2>
            <div className={styles.sectionLine} />
          </div>

          <AccessoriesSwiper items={product.accessories} />
        </section>
      ) : null}

      {/* ═══ Инструкция  ═══ */}
      <section id="product-instruction" className={styles.instructionSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Инструкция</h2>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.instructionList}>
          {product.instructionFiles.map((file, idx) => (
            <a
              key={`${file.href}-${idx}`}
              href={file.href}
              className={styles.instructionBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/pdf-icon.svg" alt="" className={styles.instructionIcon} />
              <span className={styles.instructionLabel}>{file.label}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/download-icon.svg" alt="" className={styles.instructionDownload} />
            </a>
          ))}
        </div>
      </section>

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
