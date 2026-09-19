'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { StatusBadge } from './StatusBadge'
import { EventFormDialog } from './EventFormDialog'
import { formatFullDate } from '@/lib/format'
import type { EventItem } from '@/lib/types'

export function DashboardTable({ events }: { events: EventItem[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    setDeletingId(null)

    if (!res.ok) {
      toast.error('Gagal menghapus event')
      return
    }
    toast.success('Event berhasil dihapus')
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
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

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFullDate(event.date)} · {event.location}
                  </p>
                </TableCell>
                <TableCell>
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <EventFormDialog
                      mode="edit"
                      initialEvent={event}
                      trigger={
                        <Button size="icon" variant="ghost">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus event ini?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {`"${event.title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            disabled={deletingId === event.id}
                            onClick={() => handleDelete(event.id)}
                          >
                            {deletingId === event.id ? 'Menghapus...' : 'Ya, hapus'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
