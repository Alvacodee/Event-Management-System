'use client'

export function ErrorRetry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="border border-danger/30 bg-danger/5 rounded-lg py-10 px-6 text-center">
      <p className="font-medium text-danger">Gagal memuat data</p>
      <p className="mt-1 text-sm text-muted">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center rounded-md border border-danger px-3 py-1.5 text-sm text-danger hover:bg-danger hover:text-white transition-colors"
      >
        Coba lagi
      </button>
    </div>
  )
}
