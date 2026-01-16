import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { AdminLayout } from '../components/AdminLayout'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Techdoc Admin',
  description: 'Admin console for multi-site documentation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={plexSans.className} suppressHydrationWarning>
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  )
}
