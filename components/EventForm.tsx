'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { eventSchema } from '@/lib/validations'
import type { EventItem, EventStatus } from '@/lib/types'

type Props = {
  mode: 'create' | 'edit'
  initialEvent?: EventItem
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

export function EventForm({ mode, initialEvent }: Props) {
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

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <Field label="Judul" error={fieldErrors.title}>
        <input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      <Field label="Deskripsi" error={fieldErrors.description}>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={5}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tanggal" error={fieldErrors.date}>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </Field>

        <Field label="Status" error={fieldErrors.status}>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value as EventStatus)}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Terbit</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </Field>
      </div>

      <Field label="Lokasi" error={fieldErrors.location}>
        <input
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      <Field label="URL Gambar (opsional)" error={fieldErrors.imageUrl}>
        <input
          value={form.imageUrl}
          onChange={(e) => update('imageUrl', e.target.value)}
          placeholder="https://..."
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      {formError && <p className="text-sm text-danger">{formError}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-deep transition-colors disabled:opacity-60"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="rounded-md border border-line px-4 py-2 text-sm text-muted hover:border-brand"
        >
          Batal
        </button>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-muted mb-1">{label}</label>
      {children}
      {error?.[0] && <p className="text-xs text-danger mt-1">{error[0]}</p>}
    </div>
  )
}
