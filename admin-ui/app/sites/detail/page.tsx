import { Suspense } from 'react'
import { SiteDetailClient } from './page.client'

export default function SiteDetailPage() {
  return (
    <Suspense fallback={<div className="admin-empty">Loading...</div>}>
      <SiteDetailClient />
    </Suspense>
  )
}
