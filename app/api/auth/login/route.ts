import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
import { verifyPassword, signToken, SESSION_COOKIE } from '@/lib/auth'
import { ok, fail } from '@/lib/response'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return fail('Input tidak valid', 400, parsed.error.flatten().fieldErrors)
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return fail('Email atau password salah', 401)
  }

  const token = await signToken({ sub: user.id, email: user.email, name: user.name })
  const response = ok({ id: user.id, email: user.email, name: user.name })

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 hari, samain sama masa berlaku token
  })

  return response
}
