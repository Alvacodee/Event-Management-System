import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Skeleton className="h-4 w-40 mb-6" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
