'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { EventForm } from './EventForm'
import type { EventItem } from '@/lib/types'

type Props = {
  mode: 'create' | 'edit'
  initialEvent?: EventItem
  trigger: React.ReactNode
}

export function EventFormDialog({ mode, initialEvent, trigger }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Event' : 'Edit Event'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Isi detail event baru di bawah ini.' : 'Ubah detail event lalu simpan.'}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          mode={mode}
          initialEvent={initialEvent}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
