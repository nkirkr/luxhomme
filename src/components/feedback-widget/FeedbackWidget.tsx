'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import styles from './FeedbackWidget.module.css'

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>Служба заботы Luxhommè</p>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.closeSvg} src="/icons/close-width.svg" alt="" />
              </button>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputField}>
                {/* <label className={styles.inputLabel}>Имя *</label> */}
                <input className={styles.inputNative} type="text" placeholder="Имя *" />
                <div className={styles.inputLine} />
              </div>
              <div className={styles.inputField}>
                {/* <label className={styles.inputLabel}>Телефон *</label> */}
                <input className={styles.inputNative} type="tel" placeholder="Телефон *" />
                <div className={styles.inputLine} />
              </div>
            </div>

            <div className={styles.checkboxRow}>
              <input type="checkbox" className={styles.checkbox} id="feedbackConsent" />
              <label className={styles.checkboxText} htmlFor="feedbackConsent">
                Нажимая кнопку «Отправить», я даю свое согласие на обработку моих персональных
                данных, в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О
                персональных данных», на условиях и для целей, определенных в Согласии на обработку
                персональных данных
              </label>
            </div>

            <button className={styles.submitBtn}>Отправить</button>

            <div className={styles.footerRow}>
              <button className={styles.reportLink}>Сообщить о нарушении</button>
              <svg
                className={styles.questionIcon}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.25"
                />
                <path
                  d="M7.575 7.5a2.5 2.5 0 0 1 4.858.833c0 1.667-2.5 2.5-2.5 2.5M10 14.167h.008"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={styles.widgetBtn}
        onClick={() => setOpen((v) => !v)}
        aria-label="Обратная связь"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/chat-widget.svg" alt="" className={styles.widgetBtnIcon} />
      </button>
    </>
  )
}
