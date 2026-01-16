import type { ReactNode } from 'react'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getSiteName } from '@/lib/site-config'

export const metadata = {
  title: 'Tech Blog',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:4000'),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const name = getSiteName()
  return (
    <html lang="ja">
      <body>
        <Header siteName={name} />
        <main className="tb-main tb-container">{children}</main>
        <Footer siteName={name} />
      </body>
    </html>
  )
}
