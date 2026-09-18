import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBaseUrl } from '@/lib/base-url'
import { StatusBadge } from '@/components/StatusBadge'
import { SiteHeader } from '@/components/SiteHeader'
import { formatFullDate } from '@/lib/format'
import type { EventItem } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

async function getEvent(id: string) {
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/api/events/${id}`, { cache: 'no-store' })

  if (res.status === 404) return null
  if (!res.ok) throw new Error('Gagal mengambil detail event')

  const { data } = (await res.json()) as { data: EventItem }
  return data
}

export default async function EventDetailPage({ params }: Params) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Kembali ke daftar event
        </Link>

        <div className="mt-6">
          <StatusBadge status={event.status} />
          <h1 className="text-2xl font-semibold text-ink mt-3">{event.title}</h1>
          <p className="text-muted mt-1 tabular">{formatFullDate(event.date)}</p>
          <p className="text-muted">{event.location}</p>
        </div>

        <div className="mt-8 pt-8 border-t border-line whitespace-pre-line text-ink leading-relaxed">
          {event.description}
        </div>
      </div>
    </>
  )
}
