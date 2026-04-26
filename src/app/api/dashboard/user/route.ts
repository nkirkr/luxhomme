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
    wpUser = await resolveWpUser(session)
  } catch (err) {
    console.error('[dashboard/user GET] resolveWpUser failed:', err)
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

  let wpUser: WpUserData
  try {
    wpUser = await resolveWpUser(session)
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Пользователь не найден' },
      { status: 502 },
    )
  }

  try {
    const updated = await wpDashboardFetch<WpUserData>('user/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: wpUser.email, ...payload }),
    })
    return NextResponse.json({ user: updated })
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Не удалось обновить профиль' },
      { status: 502 },
    )
  }
}
