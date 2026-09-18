import Link from 'next/link'
import { getBaseUrl } from '@/lib/base-url'
import { EventRow } from '@/components/EventRow'
import { EmptyState } from '@/components/EmptyState'
import { SiteHeader } from '@/components/SiteHeader'
import type { EventItem, Pagination } from '@/lib/types'

type SearchParams = { search?: string; filter?: string; page?: string }

async function getEvents(searchParams: SearchParams) {
  const baseUrl = await getBaseUrl()
  const params = new URLSearchParams()
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.filter) params.set('filter', searchParams.filter)
  if (searchParams.page) params.set('page', searchParams.page)

  const res = await fetch(`${baseUrl}/api/events?${params.toString()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Gagal mengambil daftar event')

  const { data } = (await res.json()) as { data: { events: EventItem[]; pagination: Pagination } }
  return data
}

const FILTERS = [
  { value: undefined, label: 'Semua' },
  { value: 'upcoming', label: 'Akan Datang' },
  { value: 'past', label: 'Sudah Lewat' },
]

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { events, pagination } = await getEvents(params)

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <header className="mb-8">
          <p className="text-sm font-medium text-brand">IEEE ITB Student Branch</p>
          <h1 className="text-3xl font-semibold text-ink mt-1">Event</h1>
          <p className="text-muted mt-2">Daftar kegiatan yang diselenggarakan IEEE ITB SB.</p>
        </header>

        <form method="GET" className="mb-4">
          <input
            type="text"
            name="search"
            defaultValue={params.search}
            placeholder="Cari event..."
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </form>

        <div className="flex gap-2 mb-6 text-sm">
          {FILTERS.map((f) => {
            const active = params.filter === f.value || (!params.filter && !f.value)
            const query = new URLSearchParams()
            if (params.search) query.set('search', params.search)
            if (f.value) query.set('filter', f.value)
            return (
              <Link
                key={f.label}
                href={`/?${query.toString()}`}
                className={`px-3 py-1 rounded-full border ${
                  active ? 'bg-brand text-white border-brand' : 'border-line text-muted hover:border-brand'
                }`}
              >
                {f.label}
              </Link>
            )
          })}
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="Belum ada event"
            description={params.search ? 'Coba kata kunci pencarian lain.' : 'Cek lagi lain waktu ya.'}
          />
        ) : (
          <div>
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 text-sm text-muted">
            <span>
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              {pagination.page > 1 && (
                <Link
                  href={buildPageLink(params, pagination.page - 1)}
                  className="underline hover:text-brand"
                >
                  Sebelumnya
                </Link>
              )}
              {pagination.page < pagination.totalPages && (
                <Link
                  href={buildPageLink(params, pagination.page + 1)}
                  className="underline hover:text-brand"
                >
                  Berikutnya
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function buildPageLink(params: SearchParams, page: number) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.filter) query.set('filter', params.filter)
  query.set('page', String(page))
  return `/?${query.toString()}`
}
