import { getBaseUrl, getCookieHeader } from '@/lib/base-url'
import { DashboardTable } from '@/components/DashboardTable'
import { EmptyState } from '@/components/EmptyState'
import type { EventItem } from '@/lib/types'

async function getAllEvents() {
  const baseUrl = await getBaseUrl()
  const cookie = await getCookieHeader()

  const res = await fetch(`${baseUrl}/api/events?limit=50`, { headers: { cookie }, cache: 'no-store' })
  if (!res.ok) throw new Error('Gagal mengambil daftar event')

  const { data } = (await res.json()) as { data: { events: EventItem[] } }
  return data.events
}

export default async function DashboardPage() {
  const events = await getAllEvents()

  if (events.length === 0) {
    return <EmptyState title="Belum ada event" description="Mulai dengan menambah event pertama." />
  }

  return <DashboardTable events={events} />
}
