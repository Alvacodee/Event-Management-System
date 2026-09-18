import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IEEE ITB SB - Event Management',
  description: 'Platform showcase dan manajemen event IEEE ITB Student Branch',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
