import Link from 'next/link'

export default function EventNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-xl font-medium text-ink">Event tidak ditemukan</p>
      <p className="text-muted mt-2">Mungkin sudah dihapus atau belum diterbitkan.</p>
      <Link href="/" className="inline-block mt-6 text-brand underline">
        Kembali ke daftar event
      </Link>
    </div>
  )
}
