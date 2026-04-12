'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'
import clsx from 'clsx'

interface Order {
  id: string
  date: string
  status: string
  total: string
  deliveryMethod: string
  deliveryAddress: string
  orderDate: string
  estimatedDelivery: string
  phone: string
  fullName: string
  email: string
  comment: string
}

const ORDERS: Order[] = Array.from({ length: 8 }, () => ({
  id: `№5673888`,
  date: '12.03.2026',
  status: 'Не удался',
  total: '7 699 ₽ за 1 товар',
  deliveryMethod: 'Курьерская доставка',
  deliveryAddress: 'г. Москва, ул. Примерная, д. 1, кв. 1',
  orderDate: '12.03.2026',
  estimatedDelivery: '15.03.2026',
  phone: '+7 (999) 999-99-99',
  fullName: 'Иван Иванов',
  email: 'ivan@example.com',
  comment: '',
}))

interface OrderModalProps {
  order: Order
  onClose: () => void
}

function OrderModal({ order, onClose }: OrderModalProps) {
  const fields = [
    { label: 'Способ доставки', value: order.deliveryMethod },
    { label: 'Адрес доставки', value: order.deliveryAddress },
    { label: 'Дата заказа', value: order.orderDate },
    { label: 'Предварительная дата доставки', value: order.estimatedDelivery },
    { label: 'Телефон', value: order.phone },
    { label: 'Имя и Фамилия', value: order.fullName },
    { label: 'Почта', value: order.email },
    { label: 'Комментарий', value: order.comment || '—' },
  ]

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className={clsx(styles.modalHeader, styles.modalHeaderOrder)}>
          <h3 className={styles.modalTitle}>Информация по заказу</h3>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Закрыть">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.modalPhotoDeleteIcon} src="/icons/close-modal.svg" alt="" />
          </button>
        </div>

        <div className={clsx(styles.modalBody, styles.modalBodyOrder)}>
          {fields.map(({ label, value }) => (
            <div key={label} className={styles.orderModalField}>
              <p className={styles.orderModalFieldLabel}>{label}</p>
              <p className={styles.orderModalFieldValue}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (ORDERS.length === 0) {
    return (
      <DashboardShell>
        <div className={styles.ordersEmpty}>
          <p className={styles.ordersEmptyTitle}>Заказов ещё не создано</p>
          <Link href="/products" className={styles.ordersEmptyBtn}>
            Просмотр товаров
          </Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Заказ</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Итого</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {ORDERS.map((order, i) => (
            <tr key={i}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
              <td>{order.total}</td>
              <td>
                <button className={styles.btnView} onClick={() => setSelectedOrder(order)}>
                  Просмотр
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {selectedOrder && (
          <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </DashboardShell>
  )
}
