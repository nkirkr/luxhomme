import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES = ['/dashboard', '/profile', '/settings', '/orders', '/checkout']
const GUEST_ROUTES = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authEnabled = process.env.NEXT_PUBLIC_FEATURE_AUTH === 'true'
  if (!authEnabled) return NextResponse.next()

  const sessionCookie = request.cookies.get('better-auth.session_token')

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isGuestRoute = GUEST_ROUTES.some((route) => pathname.startsWith(route))
  if (isGuestRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
