import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'admin_token'

// secret di-encode sekali di module scope, dipakai berulang buat sign & verify
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-jangan-dipakai-di-production')

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey)
}

// return null kalau token invalid/expired, biar caller tinggal cek falsy
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch {
    return null
  }
}
