import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionCookie(request)

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect admin routes — role check happens inside route handlers
  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from auth pages
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
}
