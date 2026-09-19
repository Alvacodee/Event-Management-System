import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { getBaseUrl } from '@/lib/base-url'
import { StatusBadge } from '@/components/StatusBadge'
import { SiteHeader } from '@/components/SiteHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="size-4" />
          Kembali ke daftar event
        </Link>

        <Card>
          <CardHeader>
            <StatusBadge status={event.status} />
            <h1 className="text-2xl font-bold text-foreground mt-2">{event.title}</h1>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1.5 tabular">
                <Calendar className="size-4" />
                {formatFullDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {event.location}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-6 pt-2 border-t whitespace-pre-line leading-relaxed">
            {event.description}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
