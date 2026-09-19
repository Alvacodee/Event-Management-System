import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EventNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-xl font-medium text-foreground">Event tidak ditemukan</p>
      <p className="text-muted-foreground mt-2">Mungkin sudah dihapus atau belum diterbitkan.</p>
      <Button asChild className="mt-6">
        <Link href="/">Kembali ke daftar event</Link>
      </Button>
    </div>
  )
}
