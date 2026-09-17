import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const dummyEvents = [
  { title: 'IEEE Tech Talk: AI in Industry', location: 'Aula Barat ITB', daysFromNow: 7, status: 'PUBLISHED' as const },
  { title: 'Workshop Arduino untuk Pemula', location: 'Lab CIC ITB', daysFromNow: 14, status: 'PUBLISHED' as const },
  { title: 'IEEE Xtreme Programming Competition', location: 'Online', daysFromNow: 21, status: 'PUBLISHED' as const },
  { title: 'Seminar Karir di Bidang Teknologi', location: 'Gedung CAS ITB', daysFromNow: -10, status: 'PUBLISHED' as const },
  { title: 'Pelatihan Public Speaking', location: 'Ruang Serbaguna', daysFromNow: -30, status: 'PUBLISHED' as const },
  { title: 'Rapat Internal Pengurus', location: 'Sekre IEEE ITB SB', daysFromNow: 3, status: 'DRAFT' as const },
  { title: 'Webinar Robotika Terapan', location: 'Zoom Meeting', daysFromNow: 30, status: 'PUBLISHED' as const },
  { title: 'Event Dibatalkan Karena Cuaca', location: 'Lapangan ITB', daysFromNow: 5, status: 'CANCELLED' as const },
]

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ieee-itb.org' },
    update: {},
    create: {
      email: 'admin@ieee-itb.org',
      passwordHash,
      name: 'Admin IEEE ITB',
    },
  })

  for (const item of dummyEvents) {
    const date = new Date()
    date.setDate(date.getDate() + item.daysFromNow)
    const slug = item.title.toLowerCase().replace(/\s+/g, '-')

    await prisma.event.upsert({
      where: { slug },
      update: {},
      create: {
        title: item.title,
        slug,
        description: `Deskripsi lengkap untuk acara ${item.title}. Acara ini diselenggarakan oleh IEEE ITB Student Branch.`,
        date,
        location: item.location,
        status: item.status,
        createdById: admin.id,
      },
    })
  }

  console.log('Seed selesai. Login admin: admin@ieee-itb.org / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
