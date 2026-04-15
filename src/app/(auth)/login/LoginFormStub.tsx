'use client'

import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export function LoginFormStub() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <form className={styles.formFields} onSubmit={handleSubmit}>
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
  )
}
