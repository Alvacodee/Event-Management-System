# IEEE ITB SB - Event Management

Platform showcase dan manajemen event untuk IEEE ITB Student Branch. Dibuat untuk probation phase divisi Fullstack Developer.

> Status: seluruh MUST HAVE sudah selesai (backend + frontend). Tinggal deploy ke Vercel dan polish SHOULD HAVE kalau ada waktu sisa sebelum deadline.

## 1. Ringkasan Proyek

Aplikasi ini punya dua sisi:

- **Publik** — melihat daftar event dan detail event yang berstatus `PUBLISHED`.
- **Admin** — login lalu kelola event lewat dashboard (tambah, edit, hapus).

## 2. Fitur yang Sudah Selesai

- [x] Skema database (User, Event) dengan Prisma + PostgreSQL
- [x] Autentikasi admin (JWT di httpOnly cookie + bcrypt)
- [x] API event: list (dengan search, filter upcoming/past, pagination), detail, create, update, delete
- [x] Validasi input di backend pakai Zod (schema yang sama dipakai ulang di form frontend)
- [x] Proteksi route admin lewat `proxy.ts` (dulu `middleware.ts`, sudah mengikuti konvensi Next.js 16 terbaru)
- [x] Halaman publik: event list (search, filter upcoming/past, pagination) & detail event
- [x] Halaman login admin
- [x] Dashboard admin: tabel event, tambah/edit event lewat modal (Dialog), hapus dengan konfirmasi (AlertDialog)
- [x] UI pakai shadcn/ui (komponen di-copy manual ke `components/ui/`, bukan lewat CLI — lihat catatan di bagian Tech Stack) dengan tema warna biru dan notifikasi toast (Sonner)
- [x] Loading state (Next.js `loading.tsx` per route, skeleton shadcn), empty state, error state (`error.tsx` + tombol coba lagi)
- [ ] TODO: Deploy ke Vercel
- [ ] TODO (SHOULD HAVE, opsional): image upload beneran (sekarang cuma field URL manual)

## 3. Arsitektur

Monolith Next.js (App Router) — frontend dan backend satu codebase. Route Handler di `app/api/**` berfungsi sebagai REST API asli, dipanggil dari sisi client dengan `fetch`.

```
app/
  api/
    auth/login/route.ts     -> POST login, set cookie JWT
    auth/logout/route.ts    -> POST logout, clear cookie
    events/route.ts         -> GET list (public/admin beda scope), POST create (admin)
    events/[id]/route.ts    -> GET detail, PATCH update, DELETE (admin)
  page.tsx                  -> publik: event list (search, filter, pagination)
  events/[id]/page.tsx      -> publik: detail event
  login/page.tsx            -> form login admin
  dashboard/
    layout.tsx              -> shell dashboard (nav, logout)
    page.tsx                -> tabel semua event (fetch pakai cookie admin)
  loading.tsx, error.tsx, not-found.tsx  -> loading/error/empty state per route (konvensi Next.js)
components/
  ui/                       -> komponen dasar shadcn/ui (Button, Card, Dialog, AlertDialog, Table, Select, dll)
  EventForm.tsx             -> form create/edit, validasi Zod yang sama dengan backend
  EventFormDialog.tsx       -> bungkus EventForm dalam modal (Dialog), dipakai untuk tambah & edit
  DashboardTable.tsx        -> tabel event + hapus lewat AlertDialog konfirmasi
  EventCard.tsx, StatusBadge.tsx, EmptyState.tsx, ErrorRetry.tsx, SiteHeader.tsx, LogoutButton.tsx
lib/
  auth.ts                   -> hash password, sign/verify JWT
  utils.ts                  -> helper cn() (clsx + tailwind-merge) dipakai komponen shadcn
  prisma.ts                 -> Prisma Client singleton (pakai driver adapter @prisma/adapter-pg)
  validations.ts            -> Zod schema untuk login & event (dipakai backend & form frontend)
  slug.ts                   -> generator slug event
  response.ts               -> helper format response API konsisten
  base-url.ts                -> helper self-fetch API dari Server Component
  format.ts, types.ts        -> util format tanggal & tipe data event untuk frontend
prisma/
  schema.prisma             -> model User & Event (tanpa url, ikut aturan Prisma 7)
  seed.ts                   -> data awal (1 admin, 8 event dummy)
prisma.config.ts            -> config koneksi DB untuk CLI Prisma 7 (generate/migrate/seed)
proxy.ts                    -> proteksi route admin (pengganti middleware.ts di Next.js 16)
```

Halaman publik & detail adalah Server Component yang manggil REST API sendiri lewat `fetch` (bukan panggil Prisma langsung), biar arsitektur frontend-backend-nya kelihatan jelas dan sesuai requirement. Search, filter, dan pagination di halaman publik pakai native HTML form/link (query string), jadi gak butuh JavaScript client-side sama sekali buat itu. Dashboard admin pakai Client Component karena butuh interaksi instan (hapus dengan konfirmasi, submit form tanpa reload penuh).

**Kenapa monolith, bukan backend terpisah?** Requirement tidak mengharuskan backend terpisah, dan dengan deadline singkat, satu codebase Next.js lebih cepat di-deploy dan di-maintain sambil tetap punya REST API endpoint yang jelas dan bisa dijelaskan satu per satu.

## 4. Tech Stack & Alasan

| Kategori | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Satu codebase FE+BE, Route Handler = REST API sungguhan, type-safety end-to-end |
| Styling | Tailwind CSS v4 + shadcn/ui | Tailwind buat utility styling responsif; shadcn/ui buat komponen interaktif (Dialog, AlertDialog, Table, Select) yang aksesibel (dibangun di atas Radix UI primitives) tanpa harus nulis sendiri dari nol |
| Database | PostgreSQL | Relasional, cocok untuk relasi User-Event, gratis lewat Neon/Supabase |
| ORM | Prisma 7 + driver adapter (`@prisma/adapter-pg`) | Schema-as-code, migration jelas, tipe otomatis ke TypeScript. Prisma 7 menghapus engine Rust dari client, jadi wajib pakai driver adapter (`pg`) untuk konek ke database |
| Autentikasi | JWT (httpOnly cookie) + bcrypt | Mekanismenya bisa dijelaskan detail saat interview, tidak bergantung library auth pihak ketiga |
| Validasi | Zod | Satu schema dipakai untuk validasi backend dan form frontend (client + server validation konsisten) |
| Notifikasi | Sonner (toast) | Feedback aksi (simpan/hapus event) yang instan tanpa reload halaman |

> **Catatan shadcn/ui**: komponen di `components/ui/` ditulis manual (bukan lewat `npx shadcn add`) karena sandbox development sempat tidak bisa akses `ui.shadcn.com`. Struktur & konvensinya tetap sama persis dengan output CLI shadcn resmi (pakai Radix UI primitives + `class-variance-authority` + `cn()` helper), jadi tetap kompatibel kalau mau `npx shadcn add <komponen>` lagi di kemudian hari — `components.json` sudah disiapkan.

## 5. Setup Lokal

### Prasyarat

- Node.js 20+
- PostgreSQL (lokal, atau pakai Neon/Supabase gratis)

### Langkah

```bash
# 1. Clone repo
git clone https://github.com/Alvacodee/Event-Management-System.git
cd Event-Management-System

# 2. Copy env dan isi DATABASE_URL & JWT_SECRET punya sendiri
cp .env.example .env

# 3. Install dependency (otomatis jalanin `prisma generate` lewat postinstall)
npm install

# 4. Migrasi database (bikin tabel sesuai schema.prisma)
npx prisma migrate dev --name init

# 5. Isi data awal (1 admin + 8 event dummy)
npm run db:seed

# 6. Jalankan
npm run dev
```

Buka `http://localhost:3000`.

> **Catatan Prisma 7**: mulai versi 7, `prisma migrate dev` tidak lagi otomatis jalanin `generate` atau seed setelahnya — makanya di sini generate dipisah lewat `postinstall` dan seed dijalankan manual di step 5. Kalau kamu ubah `schema.prisma` di kemudian hari, jalankan ulang `npx prisma generate` secara manual.

### Troubleshooting

- **Error `P1012` soal `url` di schema.prisma tidak didukung** — pastikan kamu pakai kode dari repo ini apa adanya; konfigurasi koneksi DB sudah dipindah ke `prisma.config.ts`, bukan lagi di `schema.prisma`.
- **Error `P1010` / SSL saat konek ke Neon/Supabase** — pastikan `DATABASE_URL` di `.env` menyertakan `?sslmode=require` di akhir connection string.

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

- Saat event tidak ditemukan (`/events/[id]` untuk id yang tidak ada), halaman menampilkan konten "Event tidak ditemukan" dengan benar, tapi status HTTP response-nya masih 200, bukan 404 — ini quirk streaming SSR Next.js 16 saat `notFound()` dipanggil di dalam Server Component yang di-stream. Endpoint API `/api/events/[id]` sendiri sudah mengembalikan 404 dengan benar (sudah diverifikasi manual).
- Upload gambar event masih berupa input URL manual, belum ada upload file beneran ke storage (SHOULD HAVE, belum sempat dikerjakan karena keterbatasan waktu).
- Belum ada test otomatis (unit/e2e) karena fokus waktu ke fitur MUST HAVE dan kualitas kode.

## 10. Penggunaan AI Tools

Dikerjakan dengan bantuan Claude (Anthropic) untuk: percepat scaffolding boilerplate (Next.js + Prisma setup), review pattern validasi & auth, dan debugging saat migrasi ke konvensi `proxy.ts` di Next.js 16. Semua keputusan arsitektur (pilihan stack, struktur data, desain API) dan seluruh kode akhir dipahami dan bisa dijelaskan sendiri saat interview.
