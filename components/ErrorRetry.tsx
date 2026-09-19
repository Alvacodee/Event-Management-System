'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorRetry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 py-10 px-6 text-center">
      <AlertTriangle className="size-8 text-destructive mb-2" strokeWidth={1.5} />
      <p className="font-medium text-destructive">Gagal memuat data</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <Button variant="destructive" size="sm" className="mt-4" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
  )
}
