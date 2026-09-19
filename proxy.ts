import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'

const PROTECTED_METHODS = ['POST', 'PATCH', 'DELETE']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtectedApi = pathname.startsWith('/api/events') && PROTECTED_METHODS.includes(request.method)
  const isDashboard = pathname.startsWith('/dashboard')

  if (!isProtectedApi && !isDashboard) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const payload = token ? await verifyToken(token) : null

  if (payload) {
    return NextResponse.next()
  }

  if (isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })
}

export const config = {
  matcher: ['/api/events/:path*', '/dashboard/:path*'],
}
