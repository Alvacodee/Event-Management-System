import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'

export async function SiteHeader() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const admin = token ? await verifyToken(token) : null

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between text-sm">
        <Link href="/" className="font-medium text-ink">
          IEEE ITB SB
        </Link>
        {admin ? (
          <Link href="/dashboard" className="text-brand hover:underline">
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className="text-muted hover:text-brand">
            Login Admin
          </Link>
        )}
      </div>
    </header>
  )
}
