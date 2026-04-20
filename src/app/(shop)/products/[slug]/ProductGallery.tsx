'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Keyboard, Navigation, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import styles from './product.module.css'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [activeMainIndex, setActiveMainIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxInitial, setLightboxInitial] = useState(0)
  const [lightboxActive, setLightboxActive] = useState(0)

  useBodyScrollLock(lightboxOpen)

  const openLightbox = useCallback(() => {
    setLightboxInitial(activeMainIndex)
    setLightboxActive(activeMainIndex)
    setLightboxOpen(true)
  }, [activeMainIndex])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  const lightbox =
    lightboxOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={styles.lightboxRoot}
            role="dialog"
            aria-modal="true"
            aria-label={`Галерея: ${name}`}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={(e) => {
                e.stopPropagation()
                setLightboxOpen(false)
              }}
              aria-label="Закрыть галерею"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/close-modal.svg" alt="" className={styles.lightboxCloseIcon} />
            </button>

            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <Swiper
                modules={[Navigation, Keyboard]}
                initialSlide={lightboxInitial}
                navigation
                keyboard={{ enabled: true }}
                slidesPerView={1}
                spaceBetween={0}
                className={styles.lightboxSwiper}
                onSlideChange={(s) => setLightboxActive(s.activeIndex)}
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i} className={styles.lightboxSlide}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={i === 0 ? name : `${name} — фото ${i + 1}`}
                      className={styles.lightboxImg}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {images.length > 1 ? (
              <div className={styles.lightboxCounter} onClick={(e) => e.stopPropagation()}>
                {lightboxActive + 1} / {images.length}
              </div>
            ) : null}
          </div>,
          document.body,
        )
      : null

  return (
    <div className={styles.gallery} data-product-gallery>
      {/* Thumbs column */}
      <Swiper
        modules={[FreeMode, Thumbs]}
        onSwiper={setThumbsSwiper}
        direction="vertical"
        slidesPerView="auto"
        spaceBetween={5}
        freeMode
        watchSlidesProgress
        breakpoints={{
          0: { direction: 'horizontal' },
          769: { direction: 'vertical' },
        }}
        className={styles.thumbsSwiper}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className={styles.thumbSlide}>
            <div className={styles.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Main image */}
      <Swiper
        modules={[Thumbs]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className={styles.mainSwiper}
        onSlideChange={(s) => setActiveMainIndex(s.activeIndex)}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <button
              type="button"
              className={styles.mainImageTrigger}
              onClick={openLightbox}
              aria-label="Открыть полноэкранную галерею"
            >
              <div className={styles.mainImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={i === 0 ? name : ''} />
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {lightbox}
    </div>
  )
}
