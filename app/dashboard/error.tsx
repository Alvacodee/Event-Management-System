'use client'

import { ErrorRetry } from '@/components/ErrorRetry'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorRetry message={error.message || 'Gagal memuat dashboard.'} onRetry={reset} />
}
