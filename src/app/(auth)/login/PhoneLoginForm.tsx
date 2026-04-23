'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { normalizeRuPhone } from '@/lib/sms/normalize-phone'
import styles from './login.module.css'

type Step = 'phone' | 'code'

function mapAuthError(message: string | undefined): string {
  if (!message) return 'Что-то пошло не так'
  if (message.includes('TOO_MANY')) return 'Слишком много попыток. Запросите код снова.'
  if (message.includes('OTP_EXPIRED') || message.includes('expired'))
    return 'Код устарел. Запросите новый.'
  if (message.includes('INVALID_OTP') || message.includes('Invalid OTP')) return 'Неверный код'
  if (message.includes('INVALID_PHONE')) return 'Проверьте номер телефона'
  if (message.includes('NOT_IMPLEMENTED') || message.includes('SEND_OTP'))
    return 'Отправка SMS временно недоступна'
  return message
}

export function PhoneLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendSec, setResendSec] = useState(0)

  useEffect(() => {
    if (resendSec <= 0) return
    const t = window.setTimeout(() => setResendSec((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [resendSec])

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const normalized = normalizeRuPhone(phone)
    if (!normalized) {
      setError('Введите корректный номер (РФ или международный)')
      setLoading(false)
      return
    }
    const { error: err } = await authClient.phoneNumber.sendOtp({
      phoneNumber: normalized,
    })
    if (err) {
      setError(mapAuthError(err.message))
      setLoading(false)
      return
    }
    setNormalizedPhone(normalized)
    setStep('code')
    setCode('')
    setResendSec(60)
    setLoading(false)
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await authClient.phoneNumber.verify({
      phoneNumber: normalizedPhone,
      code: code.replace(/\D/g, ''),
    })
    if (err) {
      setError(mapAuthError(err.message))
      setLoading(false)
      return
    }
    router.push(callbackUrl.startsWith('/') ? callbackUrl : '/dashboard')
    router.refresh()
    setLoading(false)
  }

  async function handleResend() {
    if (resendSec > 0 || !normalizedPhone) return
    setError('')
    setLoading(true)
    const { error: err } = await authClient.phoneNumber.sendOtp({
      phoneNumber: normalizedPhone,
    })
    if (err) setError(mapAuthError(err.message))
    else setResendSec(60)
    setLoading(false)
  }

  if (step === 'code') {
    return (
      <form className={styles.formFields} onSubmit={handleVerify}>
        <p className={styles.hint}>
          Код отправлен на номер <span className={styles.phoneMuted}>{normalizedPhone}</span>
        </p>
        <div>
          <label className={styles.fieldLabel} htmlFor="code">
            Код из SMS
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.fieldInput}
            placeholder="000000"
            aria-invalid={!!error}
          />
        </div>
        {error ? <p className={styles.fieldError}>{error}</p> : null}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Проверка…' : 'Войти'}
        </button>
        <div className={styles.formRow}>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => {
              setStep('phone')
              setCode('')
              setError('')
            }}
          >
            Изменить номер
          </button>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={handleResend}
            disabled={resendSec > 0 || loading}
          >
            {resendSec > 0 ? `Отправить снова (${resendSec})` : 'Отправить снова'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form className={styles.formFields} onSubmit={handleSendCode}>
      <div>
        <label className={styles.fieldLabel} htmlFor="phone">
          Номер телефона
        </label>
        <input
          id="phone"
          type="tel"
          className={styles.fieldInput}
          autoComplete="tel"
          placeholder="+7 900 000-00-00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={!!error}
        />
      </div>
      {error ? <p className={styles.fieldError}>{error}</p> : null}
      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Отправка…' : 'Получить код'}
      </button>
    </form>
  )
}
