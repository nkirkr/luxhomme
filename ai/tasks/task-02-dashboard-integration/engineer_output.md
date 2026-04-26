# Engineer Output — task-02-dashboard-integration

## Созданные файлы

### `src/lib/dashboard/types.ts`

```typescript
// ─── Loyalty ranks (зеркало PHP get_rank_settings) ─────────────

export interface LoyaltyRank {
  key: string
  name: string
  minAmount: number
  bonusPercent: number
  id: number
}

export const RANK_SETTINGS: LoyaltyRank[] = [
  { key: 'newby', name: 'Дорогой гость', minAmount: 0, bonusPercent: 1, id: 0 },
  { key: 'regular', name: 'Новый друг', minAmount: 15000, bonusPercent: 3, id: 1 },
  { key: 'silver', name: 'Лучший друг', minAmount: 25000, bonusPercent: 5, id: 2 },
  { key: 'gold', name: 'Близкий круг', minAmount: 45000, bonusPercent: 7, id: 3 },
  { key: 'platinum', name: 'Семья', minAmount: 100000, bonusPercent: 10, id: 4 },
]

// ─── WP User data (ответ GET /luxhomme/v1/user/me) ─────────────

export interface WpUserAddress {
  address_1: string
  city: string
  country: string
  postcode: string
}

export interface WpUserData {
  wp_user_id: number
  display_name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: WpUserAddress
  bonus_balance: number
  total_spent: number
  user_rank: string
}

// ─── Dashboard API Responses ────────────────────────────────────

export interface DashboardUserResponse {
  user: WpUserData
}

export interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  phone?: string
  address_1?: string
  city?: string
  postcode?: string
}

// ─── Orders ─────────────────────────────────────────────────────

export type WcOrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export const WC_STATUS_LABELS: Record<WcOrderStatus, string> = {
  pending: 'В обработке',
  processing: 'В обработке',
  'on-hold': 'На удержании',
  completed: 'Выполнен',
  cancelled: 'Отменён',
  refunded: 'Возвращён',
  failed: 'Не удался',
}

export interface DashboardOrder {
  id: number
  date: string
  status: string
  statusRaw: WcOrderStatus
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

export interface DashboardOrdersResponse {
  orders: DashboardOrder[]
  total: number
}

// ─── Reviews ────────────────────────────────────────────────────

export interface DashboardReview {
  id: number
  rating: number
  date: string
  text: string
  photo: string
  photos: string[]
  source: 'site' | 'wb' | 'ozon'
  product_id: number
}

export interface DashboardReviewsResponse {
  reviews: DashboardReview[]
  total: number
}

export interface UpdateReviewPayload {
  rating: number
  text: string
  photos?: File[]
}

// ─── Loyalty progress (результат computeLoyaltyProgress) ────────

export interface LoyaltyProgress {
  currentRank: LoyaltyRank
  nextRank: LoyaltyRank | null
  progressPercent: number
  bonusBalance: number
  totalSpent: number
}
```

---

### `src/lib/dashboard/loyalty.ts`

```typescript
import type { LoyaltyProgress, LoyaltyRank } from './types'
import { RANK_SETTINGS } from './types'

export const computeLoyaltyProgress = (
  totalSpent: number,
  userRank: string,
  bonusBalance: number,
): LoyaltyProgress => {
  const currentRank = RANK_SETTINGS.find((r) => r.key === userRank) ?? RANK_SETTINGS[0]

  const nextRank = RANK_SETTINGS.find((r) => r.id === currentRank.id + 1) ?? null

  let progressPercent: number
  if (!nextRank) {
    progressPercent = 100
  } else {
    const range = nextRank.minAmount - currentRank.minAmount
    const progress = totalSpent - currentRank.minAmount
    progressPercent = Math.min(100, Math.max(0, (progress / range) * 100))
  }

  return {
    currentRank,
    nextRank,
    progressPercent,
    bonusBalance,
    totalSpent,
  }
}
```

---

### `src/lib/dashboard/wp-user.ts`

```typescript
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { WpUserData } from './types'

const WP_REST_BASE =
  (process.env.WOOCOMMERCE_URL?.replace(/\/$/, '') ?? '') + '/wp-json/luxhomme/v1'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY ?? ''
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET ?? ''

const wpAuthHeader = (): string =>
  'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

export const wpDashboardFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const url = `${WP_REST_BASE}/${path.replace(/^\//, '')}`

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: wpAuthHeader(),
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`WP Dashboard REST ${res.status}: ${text.slice(0, 300)}`)
  }

  return res.json() as Promise<T>
}

export const resolveWpUser = async (email: string): Promise<WpUserData> => {
  const data = await wpDashboardFetch<WpUserData>(`user/me?email=${encodeURIComponent(email)}`)
  return data
}

export const getSessionOrThrow = async (): Promise<{
  user: { id: string; email: string; name: string }
}> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('unauthorized')
  }
  return session as { user: { id: string; email: string; name: string } }
}
```

---

### `src/lib/dashboard/api-client.ts`

```typescript
import type {
  DashboardOrdersResponse,
  DashboardReviewsResponse,
  DashboardUserResponse,
  UpdateProfilePayload,
} from './types'

export const fetchDashboardUser = async (): Promise<DashboardUserResponse> => {
  const res = await fetch('/api/dashboard/user')
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`)
  return res.json()
}

export const updateDashboardUser = async (
  payload: UpdateProfilePayload,
): Promise<DashboardUserResponse> => {
  const res = await fetch('/api/dashboard/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to update user: ${res.status}`)
  return res.json()
}

export const fetchDashboardOrders = async (): Promise<DashboardOrdersResponse> => {
  const res = await fetch('/api/dashboard/orders')
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`)
  return res.json()
}

export const fetchDashboardReviews = async (): Promise<DashboardReviewsResponse> => {
  const res = await fetch('/api/dashboard/reviews')
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`)
  return res.json()
}

export const updateDashboardReview = async (
  id: number,
  payload: { rating: number; text: string },
): Promise<{ success: boolean }> => {
  const res = await fetch('/api/dashboard/reviews', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...payload }),
  })
  if (!res.ok) throw new Error(`Failed to update review: ${res.status}`)
  return res.json()
}
```

---

### `src/app/api/dashboard/user/route.ts`

```typescript
import { getSessionOrThrow, resolveWpUser, wpDashboardFetch } from '@/lib/dashboard/wp-user'
import type { UpdateProfilePayload, WpUserData } from '@/lib/dashboard/types'
import { NextRequest, NextResponse } from 'next/server'

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

  let wpUser: WpUserData
  try {
    wpUser = await resolveWpUser(session.user.email)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось получить данные пользователя' },
      { status: 502 },
    )
  }

  return NextResponse.json({ user: wpUser })
}

export const PUT = async (request: NextRequest) => {
  let session
  try {
    session = await getSessionOrThrow()
  } catch {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Необходимо авторизоваться' },
      { status: 401 },
    )
  }

  let payload: UpdateProfilePayload
  try {
    payload = (await request.json()) as UpdateProfilePayload
  } catch {
    return NextResponse.json(
      { code: 'validation_error', message: 'Невалидный JSON' },
      { status: 400 },
    )
  }

  try {
    const updated = await wpDashboardFetch<WpUserData>('user/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, ...payload }),
    })
    return NextResponse.json({ user: updated })
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось обновить профиль' },
      { status: 502 },
    )
  }
}
```

---

### `src/app/api/dashboard/orders/route.ts`

```typescript
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
  if (!Number.isFinite(num)) return '0 ₽'
  return num.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽'
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
    wpUser = await resolveWpUser(session.user.email)
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
```

---

### `src/app/api/dashboard/reviews/route.ts`

```typescript
import { getSessionOrThrow, resolveWpUser, wpDashboardFetch } from '@/lib/dashboard/wp-user'
import type { DashboardReview } from '@/lib/dashboard/types'
import { NextRequest, NextResponse } from 'next/server'

interface WpReviewRaw {
  id: number
  rating: number
  text: string
  source: 'site' | 'wb' | 'ozon'
  photos?: string[]
  date: string
  product_id: number
}

interface WpReviewsResult {
  reviews: WpReviewRaw[]
  total: number
}

const formatReviewDate = (iso: string): string => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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
    wpUser = await resolveWpUser(session.user.email)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось получить данные пользователя' },
      { status: 502 },
    )
  }

  try {
    const data = await wpDashboardFetch<WpReviewsResult>(`reviews?author_id=${wpUser.wp_user_id}`)

    const reviews: DashboardReview[] = data.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      text: review.text,
      source: review.source,
      product_id: review.product_id,
      date: formatReviewDate(review.date),
      photo: review.photos?.[0] || '',
      photos: review.photos || [],
    }))

    return NextResponse.json({ reviews, total: reviews.length })
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось загрузить отзывы' },
      { status: 502 },
    )
  }
}

export const PUT = async (request: NextRequest) => {
  let session
  try {
    session = await getSessionOrThrow()
  } catch {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Необходимо авторизоваться' },
      { status: 401 },
    )
  }

  let body: { id: number; rating: number; text: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { code: 'validation_error', message: 'Невалидный JSON' },
      { status: 400 },
    )
  }

  if (!body.id || !body.rating || !body.text) {
    return NextResponse.json(
      { code: 'validation_error', message: 'Требуются поля id, rating, text' },
      { status: 400 },
    )
  }

  try {
    const result = await wpDashboardFetch<{ success: boolean }>(`reviews/${body.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author_email: session.user.email,
        rating: body.rating,
        text: body.text,
      }),
    })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось обновить отзыв' },
      { status: 502 },
    )
  }
}
```

---

### PHP: `wp-content/themes/norebro/inc/rest-dashboard.php`

```php
<?php
/**
 * Dashboard REST API endpoints for Next.js frontend.
 *
 * Endpoints:
 *   GET  /luxhomme/v1/user/me  — resolve WP user by email, return profile + bonus data
 *   PUT  /luxhomme/v1/user/me  — update user profile fields (name, phone, address)
 */

defined('ABSPATH') || exit;

add_action('rest_api_init', 'lh_dashboard_register_routes');

function lh_dashboard_register_routes(): void {
    register_rest_route('luxhomme/v1', '/user/me', [
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'lh_get_user_me',
            'permission_callback' => 'lh_dashboard_permission_check',
            'args'                => [
                'email' => [
                    'required'          => true,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_email',
                ],
            ],
        ],
        [
            'methods'             => WP_REST_Server::EDITABLE,
            'callback'            => 'lh_put_user_me',
            'permission_callback' => 'lh_dashboard_permission_check',
        ],
    ]);
}

function lh_dashboard_permission_check(WP_REST_Request $request): bool {
    return current_user_can('edit_shop_orders');
}

function lh_get_user_me(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $email = $request->get_param('email');
    $user  = get_user_by('email', $email);

    if (!$user) {
        return new WP_Error('user_not_found', 'Пользователь не найден', ['status' => 404]);
    }

    return new WP_REST_Response(lh_format_user_data($user), 200);
}

function lh_put_user_me(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $body = $request->get_json_params();

    if (empty($body['email'])) {
        return new WP_Error('missing_email', 'Поле email обязательно', ['status' => 400]);
    }

    $user = get_user_by('email', sanitize_email($body['email']));

    if (!$user) {
        return new WP_Error('user_not_found', 'Пользователь не найден', ['status' => 404]);
    }

    $user_data = [];
    if (isset($body['first_name'])) {
        $user_data['first_name'] = sanitize_text_field($body['first_name']);
    }
    if (isset($body['last_name'])) {
        $user_data['last_name'] = sanitize_text_field($body['last_name']);
    }

    if (!empty($user_data)) {
        $user_data['ID'] = $user->ID;
        if (isset($user_data['first_name']) || isset($user_data['last_name'])) {
            $fn = $user_data['first_name'] ?? $user->first_name;
            $ln = $user_data['last_name']  ?? $user->last_name;
            $user_data['display_name'] = trim("{$fn} {$ln}");
        }
        $result = wp_update_user($user_data);
        if (is_wp_error($result)) {
            return $result;
        }
    }

    $meta_fields = [
        'phone'     => 'billing_phone',
        'address_1' => 'billing_address_1',
        'city'      => 'billing_city',
        'postcode'  => 'billing_postcode',
    ];

    foreach ($meta_fields as $body_key => $meta_key) {
        if (isset($body[$body_key])) {
            update_user_meta($user->ID, $meta_key, sanitize_text_field($body[$body_key]));
        }
    }

    $updated_user = get_user_by('id', $user->ID);
    return new WP_REST_Response(lh_format_user_data($updated_user), 200);
}

function lh_format_user_data(WP_User $user): array {
    return [
        'wp_user_id'    => $user->ID,
        'display_name'  => $user->display_name,
        'first_name'    => $user->first_name,
        'last_name'     => $user->last_name,
        'email'         => $user->user_email,
        'phone'         => get_user_meta($user->ID, 'billing_phone', true) ?: '',
        'address'       => [
            'address_1' => get_user_meta($user->ID, 'billing_address_1', true) ?: '',
            'city'      => get_user_meta($user->ID, 'billing_city', true) ?: '',
            'country'   => get_user_meta($user->ID, 'billing_country', true) ?: '',
            'postcode'  => get_user_meta($user->ID, 'billing_postcode', true) ?: '',
        ],
        'bonus_balance' => (float) get_user_meta($user->ID, 'bonus_balance', true),
        'total_spent'   => (float) get_user_meta($user->ID, 'total_spent', true),
        'user_rank'     => get_user_meta($user->ID, 'user_rank', true) ?: 'newby',
    ];
}
```

---

### PHP: изменения в `class-lhr-rest-api.php`

**1. Добавлен route** `PUT /reviews/<id>` в `register_routes()`.

**2. `get_reviews_args()`** — `product_id` стал `required: false`, добавлен `author_id` (optional, int).

**3. `get_reviews()`** — если передан `author_id`, запрос идёт по `post_author` вместо мета `_review_product_id`. Если нет ни `product_id`, ни `author_id` — 400.

**4. Новый метод `update_review()`:**

- Находит отзыв по ID
- Проверяет что `author_email` соответствует `post_author`
- Обновляет `post_content` и `review_rating`
- Возвращает `{ success: true, review: {...} }`

---

## Список TODO: [developer]

1. **`src/app/(dashboard)/DashboardShell.tsx`** — Подключить `useSession()` из `@/lib/auth-client`, `fetchDashboardUser()` из `@/lib/dashboard/api-client`, `signOut()`. Отобразить `session.user.name` вместо хардкода «Иван Иванов», `bonus_balance` вместо «500 бонусов». Обновить `NAV_ITEMS`: href `/dashboard` → `/loyalty`, `/settings` → `/reviews`.

2. **`src/app/(dashboard)/loyalty/page.tsx`** (бывший `dashboard/page.tsx`) — Сделать Client Component (`'use client'`). Загружать данные через `fetchDashboardUser()` при маунте. Вычислять прогресс через `computeLoyaltyProgress(user.total_spent, user.user_rank, user.bonus_balance)`. Динамически отображать: `levelName`, `levelNameNext`, `progressValue`, `bonus_balance`, `bonus_percent`, прогресс-бар. Типы: `DashboardUserResponse`, `LoyaltyProgress` из `@/lib/dashboard/types`.

3. **`src/app/(dashboard)/profile/page.tsx`** — Убрать хардкоженный `USER_DATA`. Сделать Client Component. Загружать данные через `fetchDashboardUser()` при маунте. Передавать `ProfileDataSection` реальные данные и callback `onSave`. Типы: `DashboardUserResponse`, `UpdateProfilePayload`.

4. **`src/app/(dashboard)/profile/ProfileDataSection.tsx`** — Реализовать `handleSave` через `updateDashboardUser(data)`. Добавить `saving: boolean`, `error: string | null` в state. При успешном сохранении обновлять отображаемые данные.

5. **`src/app/(dashboard)/orders/page.tsx`** — Убрать хардкоженный `ORDERS`. Загружать через `fetchDashboardOrders()` при маунте. Добавить loading state. Маппинг `DashboardOrder` → существующий `Order` интерфейс. Тип: `DashboardOrdersResponse`.

6. **`src/app/(dashboard)/reviews/page.tsx`** (бывший `settings/page.tsx`) — Загружать отзывы через `fetchDashboardReviews()` при маунте. В `EditModal` → `onSave` вызывает `updateDashboardReview(id, { rating, text })`. Добавить loading/error states. Типы: `DashboardReviewsResponse`, `DashboardReview`.

7. **`middleware.ts`** — Обновить `AUTH_ROUTES`: заменить `/dashboard` → `/loyalty`, `/settings` → `/reviews`. Guest redirect: `/dashboard` → `/loyalty`.

8. **Slug-переименования** — Переместить папку `src/app/(dashboard)/dashboard/` → `src/app/(dashboard)/loyalty/`. Переместить папку `src/app/(dashboard)/settings/` → `src/app/(dashboard)/reviews/`. Относительные импорты `../DashboardShell` не меняются.

9. **PHP: подключить `rest-dashboard.php`** — Добавить в `functions.php` темы norebro строку: `require_once get_template_directory() . '/inc/rest-dashboard.php';` после строки с `bonuses.php`.
