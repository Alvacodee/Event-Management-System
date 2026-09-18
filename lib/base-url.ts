import { headers } from 'next/headers'

// server component perlu absolute URL buat fetch API-nya sendiri
export async function getBaseUrl() {
  const list = await headers()
  const host = list.get('host')
  const protocol = list.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https')
  return `${protocol}://${host}`
}

// forward cookie request asli, biar fetch ke /api/events kebawa cookie admin_token
export async function getCookieHeader() {
  const list = await headers()
  return list.get('cookie') ?? ''
}
