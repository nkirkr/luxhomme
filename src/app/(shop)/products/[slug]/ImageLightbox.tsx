'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Navigation } from 'swiper/modules'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import styles from './product.module.css'

import 'swiper/css'
import 'swiper/css/navigation'

export type ImageLightboxProps = {
  open: boolean
  onClose: () => void
  images: string[]
  initialIndex: number
  /** Used for aria-label and per-slide alt text */
  name: string
}

function clampSlideIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return Math.min(Math.max(0, index), length - 1)
}

export function ImageLightbox({ open, onClose, images, initialIndex, name }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(() => clampSlideIndex(initialIndex, images.length))

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || typeof document === 'undefined' || images.length === 0) {
    return null
  }

  const safeInitial = clampSlideIndex(initialIndex, images.length)

  return createPortal(
    <div
      className={styles.lightboxRoot}
      role="dialog"
      aria-modal="true"
      aria-label={`Галерея: ${name}`}
      onClick={onClose}
    >
      <button
        type="button"
        className={styles.lightboxClose}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Закрыть галерею"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/close-modal.svg" alt="" className={styles.lightboxCloseIcon} />
      </button>

      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <Swiper
          key={`${safeInitial}-${images[0] ?? ''}-${images.length}`}
          modules={[Navigation, Keyboard]}
          initialSlide={safeInitial}
          navigation
          keyboard={{ enabled: true }}
          slidesPerView={1}
          spaceBetween={0}
          className={styles.lightboxSwiper}
          onSwiper={(s) => setActiveIndex(s.activeIndex)}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        >
          {images.map((img, i) => (
            <SwiperSlide key={`${i}-${img}`} className={styles.lightboxSlide}>
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
          {activeIndex + 1} / {images.length}
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
