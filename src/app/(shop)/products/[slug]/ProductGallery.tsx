'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import styles from './product.module.css'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  return (
    <div className={styles.gallery}>
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
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className={styles.mainImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={i === 0 ? name : ''} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
