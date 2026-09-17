import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Prisma 7 pindahin config koneksi DB ke sini, bukan di schema.prisma lagi.
// File ini dipakai CLI (generate, migrate, db seed), bukan runtime Next.js.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
