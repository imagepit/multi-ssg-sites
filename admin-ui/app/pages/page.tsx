import { Suspense } from 'react'
import { PagesClient } from './page.client'

export default function PagesPage() {
  return (
    <Suspense fallback={<div className="admin-empty">Loading...</div>}>
      <PagesClient />
    </Suspense>
  )
}
