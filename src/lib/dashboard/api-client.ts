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
