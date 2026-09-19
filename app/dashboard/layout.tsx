import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
            <CalendarDays className="size-5 text-primary" />
            Dashboard Admin
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  )
}
