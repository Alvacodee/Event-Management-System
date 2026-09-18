import { EventForm } from '@/components/EventForm'

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-ink mb-6">Tambah Event</h1>
      <EventForm mode="create" />
    </div>
  )
}
