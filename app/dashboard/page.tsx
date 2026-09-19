import { getBaseUrl, getCookieHeader } from '@/lib/base-url'
import { DashboardTable } from '@/components/DashboardTable'
import { EventFormDialog } from '@/components/EventFormDialog'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
    return (
      <div>
        <EmptyState title="Belum ada event" description="Mulai dengan menambah event pertama." />
        <div className="flex justify-center mt-4">
          <EventFormDialog
            mode="create"
            trigger={
              <Button size="sm">
                <Plus />
                Tambah Event
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return <DashboardTable events={events} />
}
