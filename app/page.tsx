import Link from 'next/link'
import { Search } from 'lucide-react'
import { getBaseUrl } from '@/lib/base-url'
import { EventCard } from '@/components/EventCard'
import { EmptyState } from '@/components/EmptyState'
import { SiteHeader } from '@/components/SiteHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">IEEE ITB Student Branch</p>
          <h1 className="text-3xl font-bold text-foreground mt-1">Event</h1>
          <p className="text-muted-foreground mt-2">Daftar kegiatan yang diselenggarakan IEEE ITB SB.</p>
        </div>

        <form method="GET" className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input name="search" defaultValue={params.search} placeholder="Cari event..." className="pl-9" />
        </form>

        <div className="flex gap-2 mb-6">
          {FILTERS.map((f) => {
            const active = params.filter === f.value || (!params.filter && !f.value)
            const query = new URLSearchParams()
            if (params.search) query.set('search', params.search)
            if (f.value) query.set('filter', f.value)
            return (
              <Button key={f.label} asChild size="sm" variant={active ? 'default' : 'outline'}>
                <Link href={`/?${query.toString()}`}>{f.label}</Link>
              </Button>
            )
          })}
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="Belum ada event"
            description={params.search ? 'Coba kata kunci pencarian lain.' : 'Cek lagi lain waktu ya.'}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 text-sm text-muted-foreground">
            <span>
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              {pagination.page > 1 && (
                <Button asChild size="sm" variant="outline">
                  <Link href={buildPageLink(params, pagination.page - 1)}>Sebelumnya</Link>
                </Button>
              )}
              {pagination.page < pagination.totalPages && (
                <Button asChild size="sm" variant="outline">
                  <Link href={buildPageLink(params, pagination.page + 1)}>Berikutnya</Link>
                </Button>
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
