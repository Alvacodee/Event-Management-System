export default function Loading() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="py-4 border-b border-line">
          <div className="h-4 w-1/2 bg-line rounded mb-2" />
          <div className="h-3 w-1/3 bg-line rounded" />
        </div>
      ))}
    </div>
  )
}
