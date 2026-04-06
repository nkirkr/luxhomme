import type { Metadata } from 'next'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'

export const metadata: Metadata = {
  title: 'Заказы | Luxhommè',
}

const ORDERS = Array.from({ length: 8 }, () => ({
  id: `№5673888`,
  date: '12.03.2026',
  status: 'Не удался',
  total: '7 699 ₽ за 1 товар',
}))

export default function OrdersPage() {
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
                <button className={styles.btnView}>Просмотр</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardShell>
  )
}
