import { notFound } from 'next/navigation'
import { getBaseUrl, getCookieHeader } from '@/lib/base-url'
import { EventForm } from '@/components/EventForm'
import type { EventItem } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

async function getEvent(id: string) {
  const baseUrl = await getBaseUrl()
  const cookie = await getCookieHeader()

  const res = await fetch(`${baseUrl}/api/events/${id}`, { headers: { cookie }, cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Gagal mengambil data event')

  const { data } = (await res.json()) as { data: EventItem }
  return data
}

export default async function EditEventPage({ params }: Params) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink mb-6">Edit Event</h1>
      <EventForm mode="edit" initialEvent={event} />
    </div>
  )
}
