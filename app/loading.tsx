export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 animate-pulse">
      <div className="h-4 w-40 bg-line rounded mb-2" />
      <div className="h-8 w-32 bg-line rounded mb-8" />
      <div className="h-10 w-full bg-line rounded mb-6" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 py-5 border-b border-line">
          <div className="w-14 h-10 bg-line rounded shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-2/3 bg-line rounded mb-2" />
            <div className="h-3 w-1/3 bg-line rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
