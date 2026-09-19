import Link from 'next/link'
import { cookies } from 'next/headers'
import { CalendarDays } from 'lucide-react'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export async function SiteHeader() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const admin = token ? await verifyToken(token) : null

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <CalendarDays className="size-5 text-primary" />
          IEEE ITB SB
        </Link>
        <Button asChild size="sm" variant={admin ? 'default' : 'outline'}>
          <Link href={admin ? '/dashboard' : '/login'}>{admin ? 'Dashboard' : 'Login Admin'}</Link>
        </Button>
      </div>
    </header>
  )
}
