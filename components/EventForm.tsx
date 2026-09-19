'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { eventSchema } from '@/lib/validations'
import type { EventItem, EventStatus } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type Props = {
  mode: 'create' | 'edit'
  initialEvent?: EventItem
  onSuccess: () => void
  onCancel: () => void
}

type FormState = {
  title: string
  description: string
  date: string
  location: string
  status: EventStatus
  imageUrl: string
}

function toFormState(event?: EventItem): FormState {
  return {
    title: event?.title ?? '',
    description: event?.description ?? '',
    date: event ? new Date(event.date).toISOString().slice(0, 10) : '',
    location: event?.location ?? '',
    status: event?.status ?? 'DRAFT',
    imageUrl: event?.imageUrl ?? '',
  }
}

export function EventForm({ mode, initialEvent, onSuccess, onCancel }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(toFormState(initialEvent))
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})

    // validasi di client dulu pakai schema yang sama dengan backend
    const parsed = eventSchema.safeParse(form)
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors)
      return
    }

    setLoading(true)
    const url = mode === 'create' ? '/api/events' : `/api/events/${initialEvent?.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    const body = await res.json()

    if (!res.ok) {
      setFormError(body.error?.message ?? 'Gagal menyimpan event')
      setFieldErrors(body.error?.fields ?? {})
      setLoading(false)
      return
    }

    toast.success(mode === 'create' ? 'Event berhasil ditambahkan' : 'Event berhasil diperbarui')
    router.refresh()
    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Judul" error={fieldErrors.title}>
        <Input value={form.title} onChange={(e) => update('title', e.target.value)} />
      </Field>

      <Field label="Deskripsi" error={fieldErrors.description}>
        <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tanggal" error={fieldErrors.date}>
          <Input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
        </Field>

        <Field label="Status" error={fieldErrors.status}>
          <Select value={form.status} onValueChange={(v) => update('status', v as EventStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Terbit</SelectItem>
              <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Lokasi" error={fieldErrors.location}>
        <Input value={form.location} onChange={(e) => update('location', e.target.value)} />
      </Field>

      <Field label="URL Gambar (opsional)" error={fieldErrors.imageUrl}>
        <Input
          value={form.imageUrl}
          onChange={(e) => update('imageUrl', e.target.value)}
          placeholder="https://..."
        />
      </Field>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error?.[0] && <p className="text-xs text-destructive">{error[0]}</p>}
    </div>
  )
}
