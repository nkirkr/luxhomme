import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './login.module.css'

export const metadata: Metadata = {
  title: 'Авторизация | Luxhommè',
  description: 'Войдите в личный кабинет Luxhommè.',
}

export default function LoginPage() {
  return (
    <div className={styles.page}>
      {/* Background image */}
      <div className={styles.bg} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/auth-bg.jpg" alt="" />
      </div>

      {/* Header (white, overlaid on background) */}
      <div className={styles.headerWrap}>
        <SiteHeader />
      </div>

      {/* Auth form card */}
      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Авторизация</h1>

        <form className={styles.formFields}>
          <div>
            <label className={styles.fieldLabel} htmlFor="phone">
              Номер телефона
            </label>
            <input id="phone" type="tel" className={styles.fieldInput} autoComplete="tel" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}
