import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { PhoneLoginForm } from './PhoneLoginForm'
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

      <div className={styles.headerWrap}>
        <SiteHeader />
      </div>

      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Авторизация</h1>
        <Suspense
          fallback={
            <div className={styles.formFields} aria-busy="true">
              <div className={styles.fieldLabel}>Загрузка…</div>
            </div>
          }
        >
          <PhoneLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
