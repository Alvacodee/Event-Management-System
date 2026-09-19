import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from './StatusBadge'
import { splitDate } from '@/lib/format'
import type { EventItem } from '@/lib/types'

export function EventCard({ event, showStatus = false }: { event: EventItem; showStatus?: boolean }) {
  const { day, month } = splitDate(event.date)

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="transition-shadow hover:shadow-md py-0 gap-0">
        <CardContent className="flex gap-4 p-4">
          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 py-2">
            <span className="text-xl font-semibold tabular text-primary leading-none">{day}</span>
            <span className="text-[11px] font-medium tracking-wide text-primary/70 mt-1">{month}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-foreground truncate">{event.title}</h3>
              {showStatus && <StatusBadge status={event.status} />}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1 truncate">
              <MapPin className="size-3.5 shrink-0" />
              {event.location}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
