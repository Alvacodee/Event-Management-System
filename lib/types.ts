// tipe ini disalin manual dari shape Prisma Event, biar komponen frontend
// gak perlu import @prisma/client (yang server-only karena driver adapter)
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED'

export type EventItem = {
  id: string
  title: string
  slug: string
  description: string
  date: string
  location: string
  status: EventStatus
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}
