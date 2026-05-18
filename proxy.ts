import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn   = !!req.auth
  const isLoginPage  = pathname === '/admin/login'

  if (isLoginPage) return NextResponse.next()

  if (!isLoggedIn) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}