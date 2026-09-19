import { ok } from '@/lib/response'
import { SESSION_COOKIE } from '@/lib/auth'

export async function POST() {
  const response = ok({ message: 'Berhasil logout' })
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
  return response
}
