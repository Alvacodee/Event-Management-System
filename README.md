# IEEE ITB SB - Event Management

Platform showcase dan manajemen event untuk IEEE ITB Student Branch. Dibuat untuk probation phase divisi Fullstack Developer.

> Status: backend selesai, frontend masih dikerjakan. Bagian yang masih ditandai `TODO` akan diisi begitu semua fitur rampung.

## 1. Ringkasan Proyek

Aplikasi ini punya dua sisi:

- **Publik** — melihat daftar event dan detail event yang berstatus `PUBLISHED`.
- **Admin** — login lalu kelola event lewat dashboard (tambah, edit, hapus).

## 2. Fitur yang Sudah Selesai

- [x] Skema database (User, Event) dengan Prisma + PostgreSQL
- [x] Autentikasi admin (JWT di httpOnly cookie + bcrypt)
- [x] API event: list (dengan search, filter upcoming/past, pagination), detail, create, update, delete
- [x] Validasi input di backend pakai Zod
- [x] Proteksi route admin lewat `proxy.ts` (dulu `middleware.ts`, sudah mengikuti konvensi Next.js 16 terbaru)
- [ ] TODO: Halaman publik (event list & detail)
- [ ] TODO: Halaman login admin
- [ ] TODO: Dashboard admin (tabel + form create/edit + konfirmasi delete)
- [ ] TODO: Loading, empty, error state di UI
- [ ] TODO: Deploy ke Vercel

## 3. Arsitektur

Monolith Next.js (App Router) — frontend dan backend satu codebase. Route Handler di `app/api/**` berfungsi sebagai REST API asli, dipanggil dari sisi client dengan `fetch`.

```
app/
  api/
    auth/login/route.ts     -> POST login, set cookie JWT
    auth/logout/route.ts    -> POST logout, clear cookie
    events/route.ts         -> GET list (public/admin beda scope), POST create (admin)
    events/[id]/route.ts    -> GET detail, PATCH update, DELETE (admin)
lib/
  auth.ts                   -> hash password, sign/verify JWT
  prisma.ts                 -> Prisma Client singleton
  validations.ts            -> Zod schema untuk login & event
  slug.ts                   -> generator slug event
  response.ts               -> helper format response API konsisten
prisma/
  schema.prisma             -> model User & Event
  seed.ts                   -> data awal (1 admin, 8 event dummy)
proxy.ts                    -> proteksi route admin (pengganti middleware.ts di Next.js 16)
```

**Kenapa monolith, bukan backend terpisah?** Requirement tidak mengharuskan backend terpisah, dan dengan deadline singkat, satu codebase Next.js lebih cepat di-deploy dan di-maintain sambil tetap punya REST API endpoint yang jelas dan bisa dijelaskan satu per satu.

## 4. Tech Stack & Alasan

| Kategori | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Satu codebase FE+BE, Route Handler = REST API sungguhan, type-safety end-to-end |
| Styling | Tailwind CSS | Cepat untuk styling responsif tanpa nulis CSS terpisah |
| Database | PostgreSQL | Relasional, cocok untuk relasi User-Event, gratis lewat Neon/Supabase |
| ORM | Prisma | Schema-as-code, migration jelas, tipe otomatis ke TypeScript |
| Autentikasi | JWT (httpOnly cookie) + bcrypt | Mekanismenya bisa dijelaskan detail saat interview, tidak bergantung library auth pihak ketiga |
| Validasi | Zod | Satu schema dipakai untuk validasi backend (dan nanti form frontend) |

## 5. Setup Lokal

### Prasyarat

- Node.js 20+
- PostgreSQL (lokal, atau pakai Neon/Supabase gratis)

### Langkah

```bash
# 1. Clone repo
git clone <url-repo-ini>
cd ieee-event-app

# 2. Install dependency
npm install

# 3. Copy env dan isi sesuai punya sendiri
cp .env.example .env

# 4. Migrasi database + generate Prisma Client
npx prisma migrate dev --name init

# 5. Isi data awal (1 admin + 8 event dummy)
npm run db:seed

# 6. Jalankan
npm run dev
```

Buka `http://localhost:3000`.

## 6. Environment Variables

Lihat `.env.example`. Dua variabel wajib:

- `DATABASE_URL` — connection string PostgreSQL
- `JWT_SECRET` — string random untuk sign token admin (generate dengan `openssl rand -base64 32`)

## 7. Setup Database

Schema didefinisikan di `prisma/schema.prisma`. Entity utama:

- **User** — akun admin (email, passwordHash, name)
- **Event** — id, title, slug, description, date, location, status (DRAFT/PUBLISHED/CANCELLED), imageUrl, relasi ke User pembuat

Jalankan `npx prisma migrate dev` untuk apply schema ke database, lalu `npm run db:seed` untuk isi data contoh.

## 8. Akun Demo

Setelah `npm run db:seed`:

- Email: `admin@ieee-itb.org`
- Password: `admin123`

## 9. Known Issues / Limitations

- TODO: diisi setelah frontend selesai

## 10. Penggunaan AI Tools

Dikerjakan dengan bantuan Claude (Anthropic) untuk: percepat scaffolding boilerplate (Next.js + Prisma setup), review pattern validasi & auth, dan debugging saat migrasi ke konvensi `proxy.ts` di Next.js 16. Semua keputusan arsitektur (pilihan stack, struktur data, desain API) dan seluruh kode akhir dipahami dan bisa dijelaskan sendiri saat interview.
