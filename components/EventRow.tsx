import Link from 'next/link'
import { splitDate } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import type { EventItem } from '@/lib/types'

// baris ala sobekan tiket: blok tanggal di kiri, info event di kanan
export function EventRow({ event, showStatus = false }: { event: EventItem; showStatus?: boolean }) {
  const { day, month } = splitDate(event.date)

  return (
    <Link
      href={`/events/${event.id}`}
      className="flex gap-4 py-5 border-b border-line hover:bg-surface transition-colors group"
    >
      <div className="w-14 shrink-0 text-center">
        <div className="text-2xl font-semibold tabular text-brand leading-none">{day}</div>
        <div className="text-xs tracking-wide text-muted mt-1">{month}</div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-ink group-hover:text-brand transition-colors truncate">
          {event.title}
        </h3>
        <p className="text-sm text-muted mt-0.5 truncate">{event.location}</p>
        {showStatus && (
          <div className="mt-2">
            <StatusBadge status={event.status} />
          </div>
        )}
      </div>
    </Link>
  )
}
