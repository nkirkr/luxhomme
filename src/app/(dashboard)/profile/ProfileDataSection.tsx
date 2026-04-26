'use client'

import { useState } from 'react'
import { updateDashboardUser } from '@/lib/dashboard/api-client'
import styles from '../dashboard.module.css'

export type ProfileData = {
  name: string
  email: string
  phone: string
  address: string
}

type ProfileDataSectionProps = {
  initialData: ProfileData
}

export function ProfileDataSection({ initialData }: ProfileDataSectionProps) {
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState<ProfileData>(initialData)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const [firstName, ...lastParts] = data.name.split(' ')
      await updateDashboardUser({
        first_name: firstName,
        last_name: lastParts.join(' '),
        phone: data.phone,
        address_1: data.address.split(',')[0]?.trim(),
        city: data.address.split(',')[1]?.trim(),
        postcode: data.address.split(',')[3]?.trim(),
      })
      setEditing(false)
    } catch {
      setError('Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = () => {
    if (editing) {
      handleSave()
    } else {
      setEditing(true)
    }
  }

  return (
    <div className={styles.dataSection}>
      <div className={styles.dataHeader}>
        <h2 className={styles.dataTitle}>Данные</h2>
        <button type="button" className={styles.btnEdit} onClick={handleToggle} disabled={saving}>
          {editing ? (saving ? 'Сохранение…' : 'Сохранить') : 'Редактировать'}
          {!editing && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/arrow-up-right.svg" alt="" />
            </>
          )}
        </button>
      </div>

      <div className={styles.dataFields}>
        <div className={`${styles.dataField} ${editing ? styles.dataFieldEditing : ''}`}>
          <p className={styles.dataFieldLabel}>Фамилия Имя</p>
          {editing ? (
            <input
              type="text"
              className={styles.dataFieldInput}
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              autoComplete="name"
            />
          ) : (
            <p className={styles.dataFieldValue}>{data.name}</p>
          )}
        </div>
        <div className={`${styles.dataField} ${editing ? styles.dataFieldEditing : ''}`}>
          <p className={styles.dataFieldLabel}>Почта</p>
          {editing ? (
            <input
              type="email"
              className={styles.dataFieldInput}
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              autoComplete="email"
            />
          ) : (
            <p className={styles.dataFieldValue}>{data.email}</p>
          )}
        </div>
        <div className={`${styles.dataField} ${editing ? styles.dataFieldEditing : ''}`}>
          <p className={styles.dataFieldLabel}>Телефон</p>
          {editing ? (
            <input
              type="tel"
              className={styles.dataFieldInput}
              value={data.phone}
              onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
              autoComplete="tel"
            />
          ) : (
            <p className={styles.dataFieldValue}>{data.phone}</p>
          )}
        </div>
        <div className={`${styles.dataFieldFull} ${editing ? styles.dataFieldFullEditing : ''}`}>
          <p className={styles.dataFieldLabel}>Адрес доставки</p>
          {editing ? (
            <input
              type="text"
              className={styles.dataFieldInput}
              value={data.address}
              onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
              autoComplete="street-address"
            />
          ) : (
            <p className={styles.dataFieldValue}>{data.address}</p>
          )}
        </div>
      </div>

      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </div>
  )
}
