'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

import styles from './HeroSection.module.css'

const SLIDES = [
  {
    bgDesktop: '/images/hero-bg.jpg',
    bgMobile: '/images/hero-bg-mob.jpg',
    tagline: 'Техника для тех, кто выбирает комфорт, тепло и заботу\u00a0— в каждом уголке дома.',
    headingMain: 'Заботимся о доме',
    headingScript: 'Заботимся о вас',
  },
  {
    bgDesktop: '/images/hero-bg.jpg',
    bgMobile: '/images/hero-bg-mob.jpg',
    tagline: 'Инновационные решения для вашего дома — чистота, уют и комфорт каждый день.',
    headingMain: 'Чистота в каждом доме',
    headingScript: 'Забота о вас',
  },
  {
    bgDesktop: '/images/hero-bg.jpg',
    bgMobile: '/images/hero-bg-mob.jpg',
    tagline: 'Создаём технику, которая делает жизнь проще, теплее и человечнее.',
    headingMain: 'Тепло и уют',
    headingScript: 'Luxhommè',
  },
]

/** Split text into individual letter spans for stagger animation */
function AnimatedLetters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.07, duration: 0.01 }}
        >
          {char}
        </motion.span>
      ))}
    </>
  )
}

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  const slide = SLIDES[activeIndex]

  return (
    <section className={styles.hero} aria-label="Главный баннер">
      {/* Swiper for background images */}
      <div className={styles.swiperWrap}>
        <Swiper
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          speed={800}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex)
            setAnimKey((k) => k + 1)
          }}
          className={styles.swiper}
        >
          {SLIDES.map((s, i) => (
            <SwiperSlide key={i} className={styles.swiperSlide}>
              <Image
                src={s.bgDesktop}
                alt=""
                fill
                priority={i === 0}
                quality={90}
                sizes="100vw"
                className={`${styles.bgImage} ${styles.bgDesktop}`}
              />
              <Image
                src={s.bgMobile}
                alt=""
                fill
                priority={i === 0}
                quality={90}
                sizes="100vw"
                className={`${styles.bgImage} ${styles.bgMobile}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Dark gradient overlay */}
      <div className={styles.bgOverlay} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Slider arrows */}
        <div className={styles.sliderArrows} aria-label="Управление слайдером">
          <button
            className={styles.arrowBtn}
            aria-label="Предыдущий слайд"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-left-01-sharp.svg" alt="" className={styles.arrowIcon} />
          </button>
          <button
            className={styles.arrowBtn}
            aria-label="Следующий слайд"
            onClick={() => swiperRef.current?.slideNext()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-right-01-sharp.svg" alt="" className={styles.arrowIcon} />
          </button>
        </div>

        {/* Bottom text block */}
        <div className={styles.textBlock}>
          <div className={styles.textRow}>
            {/* Tagline — fades in first */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`tagline-${animKey}`}
                className={styles.tagline}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                {slide.tagline}
              </motion.p>
            </AnimatePresence>

            <div className={styles.headingGroup}>
              {/* headingMain — fades in second */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`main-${animKey}`}
                  className={styles.headingMain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {slide.headingMain}
                </motion.h1>
              </AnimatePresence>

              {/* headingScript — letter by letter */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`script-${animKey}`}
                  className={styles.headingScript}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedLetters text={slide.headingScript} delay={0.9} />
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Slider dots — custom pagination */}
          <div className={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
