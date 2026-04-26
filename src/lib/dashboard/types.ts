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
