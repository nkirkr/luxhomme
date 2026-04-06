import type { Metadata } from 'next'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'

export const metadata: Metadata = {
  title: 'Данные | Luxhommè',
}

const USER_DATA = {
  name: 'Иван Иванов',
  email: 'primer@gmai.com',
  phone: '+7 (999) 999-99-99',
  address: 'ул. Профсоюзная, Москва, Россия, 117393',
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className={styles.dataHeader}>
        <h2 className={styles.dataTitle}>Данные</h2>
        <button className={styles.btnEdit}>
          Редактировать
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/arrow-up-right.svg" alt="" />
        </button>
      </div>

      <div className={styles.dataFields}>
        <div className={styles.dataField}>
          <p className={styles.dataFieldLabel}>Фамилия Имя</p>
          <p className={styles.dataFieldValue}>{USER_DATA.name}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataFieldLabel}>Почта</p>
          <p className={styles.dataFieldValue}>{USER_DATA.email}</p>
        </div>
        <div className={styles.dataField}>
          <p className={styles.dataFieldLabel}>Телефон</p>
          <p className={styles.dataFieldValue}>{USER_DATA.phone}</p>
        </div>
        <div className={styles.dataFieldFull}>
          <p className={styles.dataFieldLabel}>Ваш адрес</p>
          <p className={styles.dataFieldValue}>{USER_DATA.address}</p>
        </div>
      </div>
    </DashboardShell>
  )
}
