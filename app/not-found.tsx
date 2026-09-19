import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-3xl font-bold text-foreground">404</p>
      <p className="text-muted-foreground mt-2">Halaman yang kamu cari gak ada.</p>
      <Button asChild className="mt-6">
        <Link href="/">Kembali ke daftar event</Link>
      </Button>
    </div>
  )
}
