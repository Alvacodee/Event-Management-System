'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge } from './StatusBadge'
import { formatFullDate } from '@/lib/format'
import type { EventItem } from '@/lib/types'

export function DashboardTable({ events }: { events: EventItem[] }) {
  const router = useRouter()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    setConfirmId(null)
    setDeletingId(null)
    router.refresh()
  }

  return (
    <div>
      {events.map((event) => (
        <div key={event.id} className="flex items-center justify-between gap-4 py-4 border-b border-line">
          <div className="min-w-0">
            <p className="font-medium text-ink truncate">{event.title}</p>
            <p className="text-sm text-muted truncate">
              {formatFullDate(event.date)} · {event.location}
            </p>
            <div className="mt-1">
              <StatusBadge status={event.status} />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-sm">
            <Link href={`/dashboard/events/${event.id}/edit`} className="text-brand hover:underline">
              Edit
            </Link>

            {confirmId === event.id ? (
              <span className="flex items-center gap-2">
                <span className="text-muted">Yakin?</span>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="text-danger font-medium hover:underline disabled:opacity-60"
                >
                  {deletingId === event.id ? 'Menghapus...' : 'Ya, hapus'}
                </button>
                <button onClick={() => setConfirmId(null)} className="text-muted hover:underline">
                  Batal
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmId(event.id)} className="text-danger hover:underline">
                Hapus
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
