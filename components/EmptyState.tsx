export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-dashed border-line rounded-lg py-16 px-6 text-center">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  )
}
