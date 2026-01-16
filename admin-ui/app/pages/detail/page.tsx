import { Suspense } from 'react'
import { PageDetailClient } from './page.client'

export default function PageDetailPage() {
  return (
    <Suspense fallback={<div className="admin-empty">Loading...</div>}>
      <PageDetailClient />
    </Suspense>
  )
}
