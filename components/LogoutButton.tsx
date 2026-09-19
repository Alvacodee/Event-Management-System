'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading}>
      <LogOut className="size-4" />
      {loading ? 'Keluar...' : 'Logout'}
    </Button>
  )
}
