import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-3xl font-semibold text-ink">404</p>
      <p className="text-muted mt-2">Halaman yang kamu cari gak ada.</p>
      <Link href="/" className="inline-block mt-6 text-brand underline">
        Kembali ke daftar event
      </Link>
    </div>
  )
}
