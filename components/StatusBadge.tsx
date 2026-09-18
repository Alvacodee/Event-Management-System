import type { EventStatus } from '@/lib/types'

const LABEL: Record<EventStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Terbit',
  CANCELLED: 'Dibatalkan',
}

const COLOR: Record<EventStatus, string> = {
  DRAFT: 'text-draft border-draft',
  PUBLISHED: 'text-published border-published',
  CANCELLED: 'text-cancelled border-cancelled',
}

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${COLOR[status]}`}>
      {LABEL[status]}
    </span>
  )
}
