'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { fetchDashboardOrders } from '@/lib/dashboard/api-client'
import type { DashboardOrder } from '@/lib/dashboard/types'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'
import clsx from 'clsx'

interface OrderModalProps {
  order: DashboardOrder
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
  const [orders, setOrders] = useState<DashboardOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null)
  const tableScrollRef = useRef<HTMLDivElement>(null)
  const [ordersScrollBar, setOrdersScrollBar] = useState<{
    active: boolean
    thumbWidthPct: number
    thumbLeftPct: number
  }>({ active: false, thumbWidthPct: 100, thumbLeftPct: 0 })
  useBodyScrollLock(!!selectedOrder)

  useEffect(() => {
    fetchDashboardOrders()
      .then((res) => setOrders(res.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useLayoutEffect(() => {
    const el = tableScrollRef.current
    if (!el) return

    const sync = () => {
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) {
        setOrdersScrollBar((prev) =>
          prev.active ? { active: false, thumbWidthPct: 100, thumbLeftPct: 0 } : prev,
        )
        return
      }
      const thumbWidthPct = (el.clientWidth / el.scrollWidth) * 100
      const thumbLeftPct = (el.scrollLeft / maxScroll) * (100 - thumbWidthPct)
      setOrdersScrollBar({ active: true, thumbWidthPct, thumbLeftPct })
    }

    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [])

  if (!loading && orders.length === 0) {
    return (
      <DashboardShell>
        <div className={styles.ordersEmpty}>
          <p className={styles.ordersEmptyTitle}>Заказов ещё не создано</p>
          <Link href="/catalog" className={styles.ordersEmptyBtn}>
            Просмотр товаров
          </Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell loading={loading}>
      <div className={styles.ordersTableBlock}>
        <div ref={tableScrollRef} className={styles.ordersTableScroll}>
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>№{order.id}</td>
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
        </div>
        <div
          className={clsx(
            styles.ordersTableScrollBar,
            ordersScrollBar.active && styles.ordersTableScrollBarVisible,
          )}
          aria-hidden
        >
          <div className={styles.ordersTableScrollTrack}>
            <div
              className={styles.ordersTableScrollThumb}
              style={{
                width: `${ordersScrollBar.thumbWidthPct}%`,
                left: `${ordersScrollBar.thumbLeftPct}%`,
              }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </DashboardShell>
  )
}
