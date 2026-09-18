import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-medium text-ink">
            Dashboard Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/events/new" className="text-sm text-brand hover:underline">
              + Tambah Event
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  )
}
