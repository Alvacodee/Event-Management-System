import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { makeSlug } from '@/lib/slug'
import { ok, fail } from '@/lib/response'

async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return token ? await verifyToken(token) : null
}

// public cuma bisa lihat event PUBLISHED, admin bisa lihat semua status
export async function GET(request: NextRequest) {
  const admin = await getAdmin()
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search') ?? ''
  const filter = searchParams.get('filter') // 'upcoming' | 'past'
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Number(searchParams.get('limit')) || 9)

  const where: Prisma.EventWhereInput = {
    ...(admin ? {} : { status: 'PUBLISHED' }),
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
    ...(filter === 'upcoming' && { date: { gte: new Date() } }),
    ...(filter === 'past' && { date: { lt: new Date() } }),
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ])

  return ok({
    events,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return fail('Unauthorized', 401)

  const body = await request.json().catch(() => null)
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return fail('Input tidak valid', 400, parsed.error.flatten().fieldErrors)
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
      slug: makeSlug(parsed.data.title),
      createdById: admin.sub as string,
    },
  })

  return ok(event, 201)
}
