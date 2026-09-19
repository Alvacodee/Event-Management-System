import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { updateEventSchema } from '@/lib/validations'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { ok, fail } from '@/lib/response'

async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return token ? await verifyToken(token) : null
}

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })

  if (!event) return fail('Event tidak ditemukan', 404)

  // event non-PUBLISHED cuma boleh diakses admin, publik dianggap 404 aja
  const admin = await getAdmin()
  if (event.status !== 'PUBLISHED' && !admin) {
    return fail('Event tidak ditemukan', 404)
  }

  return ok(event)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await getAdmin()
  if (!admin) return fail('Unauthorized', 401)

  const { id } = await params
  const existing = await prisma.event.findUnique({ where: { id } })
  if (!existing) return fail('Event tidak ditemukan', 404)

  const body = await request.json().catch(() => null)
  const parsed = updateEventSchema.safeParse(body)
  if (!parsed.success) {
    return fail('Input tidak valid', 400, parsed.error.flatten().fieldErrors)
  }

  const event = await prisma.event.update({
    where: { id },
    data: { ...parsed.data, imageUrl: parsed.data.imageUrl || undefined },
  })

  return ok(event)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const admin = await getAdmin()
  if (!admin) return fail('Unauthorized', 401)

  const { id } = await params
  const existing = await prisma.event.findUnique({ where: { id } })
  if (!existing) return fail('Event tidak ditemukan', 404)

  await prisma.event.delete({ where: { id } })
  return ok({ message: 'Event berhasil dihapus' })
}
