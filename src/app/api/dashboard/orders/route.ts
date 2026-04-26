import { getSessionOrThrow, resolveWpUser } from '@/lib/dashboard/wp-user'
import type { DashboardOrder, WcOrderStatus } from '@/lib/dashboard/types'
import { WC_STATUS_LABELS } from '@/lib/dashboard/types'
import { NextResponse } from 'next/server'

const WC_BASE_URL = process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? ''
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? ''
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? ''

const wcAuthHeader = (): string =>
  'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${d.getFullYear()}`
}

const formatPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(num)) return '0 \u20BD'
  return num.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' \u20BD'
}

const pluralize = (n: number, one: string, few: string, many: string): string => {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last > 1 && last < 5) return few
  if (last === 1) return one
  return many
}

interface WcOrder {
  id: number
  date_created: string
  date_completed: string | null
  status: string
  total: string
  line_items?: Array<{ id: number }>
  shipping_lines?: Array<{ method_title: string }>
  shipping?: {
    address_1?: string
    city?: string
  }
  billing?: {
    phone?: string
    first_name?: string
    last_name?: string
    email?: string
  }
  customer_note?: string
}

export const GET = async () => {
  let session
  try {
    session = await getSessionOrThrow()
  } catch {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Необходимо авторизоваться' },
      { status: 401 },
    )
  }

  let wpUser
  try {
    wpUser = await resolveWpUser(session)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось получить данные пользователя' },
      { status: 502 },
    )
  }

  try {
    const url = `${WC_BASE_URL}/wp-json/wc/v3/orders?customer=${wpUser.wp_user_id}&per_page=50&orderby=date&order=desc`

    const res = await fetch(url, {
      headers: {
        Authorization: wcAuthHeader(),
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`WC Orders ${res.status}: ${text.slice(0, 200)}`)
    }

    const wcOrders = (await res.json()) as WcOrder[]

    const orders: DashboardOrder[] = wcOrders.map((order) => {
      const itemCount = order.line_items?.length || 0
      const date = formatDate(order.date_created)

      return {
        id: order.id,
        date,
        status: WC_STATUS_LABELS[order.status as WcOrderStatus] || order.status,
        statusRaw: order.status as WcOrderStatus,
        total: `${formatPrice(order.total)} за ${itemCount} ${pluralize(itemCount, 'товар', 'товара', 'товаров')}`,
        deliveryMethod: order.shipping_lines?.[0]?.method_title || '—',
        deliveryAddress:
          [order.shipping?.address_1, order.shipping?.city].filter(Boolean).join(', ') || '—',
        orderDate: date,
        estimatedDelivery: order.date_completed ? formatDate(order.date_completed) : '—',
        phone: order.billing?.phone || '—',
        fullName:
          [order.billing?.first_name, order.billing?.last_name].filter(Boolean).join(' ') || '—',
        email: order.billing?.email || '—',
        comment: order.customer_note || '',
      }
    })

    return NextResponse.json({ orders, total: orders.length })
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось загрузить заказы' },
      { status: 502 },
    )
  }
}
