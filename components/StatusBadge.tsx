import { Badge } from '@/components/ui/badge'
import type { EventStatus } from '@/lib/types'

const CONFIG: Record<EventStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  DRAFT: { label: 'Draft', variant: 'warning' },
  PUBLISHED: { label: 'Terbit', variant: 'success' },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
}

export function StatusBadge({ status }: { status: EventStatus }) {
  const { label, variant } = CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}
