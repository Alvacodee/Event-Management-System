'use client'

import { ErrorRetry } from '@/components/ErrorRetry'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <ErrorRetry message={error.message || 'Terjadi kesalahan tak terduga.'} onRetry={reset} />
    </div>
  )
}
