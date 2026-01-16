'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AdminLink } from '../../../components/AdminLink'
import { SettingsPanel } from '../../../components/SettingsPanel'
import { StatusPill } from '../../../components/StatusPill'
import { adminFetch } from '../../../lib/api'
import { formatDate, formatTags } from '../../../lib/format'
import type { PageMeta } from '../../../lib/types'
import { useAdminSettings } from '../../../lib/use-admin-settings'

export function PageDetailClient() {
  const searchParams = useSearchParams()
  const { settings, ready } = useAdminSettings()
  const siteId = searchParams.get('site_id') || ''
  const pagePath = searchParams.get('path') || ''
  const [page, setPage] = useState<PageMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const encodedPath = useMemo(() => encodeURIComponent(pagePath), [pagePath])

  useEffect(() => {
    if (!ready || !siteId || !pagePath) {
      return
    }
    setLoading(true)
    setError(null)
    const query = new URLSearchParams({ site_id: siteId, limit: '500' })
    adminFetch<{ pages: PageMeta[] }>(settings, `/admin/pages?${query.toString()}`)
      .then((data) => {
        const found = data.pages?.find((item) => item.path === pagePath) ?? null
        setPage(found)
      })
      .catch((err) => {
        setError(String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [ready, siteId, pagePath, settings.baseUrl, settings.token])

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-section__title">Page detail</div>
        <div className="admin-meta">Inspect a single page metadata payload.</div>
      </div>

      <SettingsPanel />

      <div className="admin-card">
        {!siteId || !pagePath ? (
          <div className="admin-empty">site_id and path are required.</div>
        ) : null}
        {loading ? <div className="admin-empty">Loading...</div> : null}
        {error ? <div className="admin-empty">Error: {error}</div> : null}
        {!loading && !error && siteId && pagePath && !page ? (
          <div className="admin-empty">Page not found.</div>
        ) : null}

        {page ? (
          <div className="admin-detail">
            <div className="admin-detail__row">
              <div className="admin-detail__label">Site ID</div>
              <div>{page.siteId}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Path</div>
              <div>{page.path}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Title</div>
              <div>{page.title}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Status</div>
              <StatusPill status={page.status} />
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Tags</div>
              <div>{formatTags(page.tags ?? undefined)}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Priority</div>
              <div>{page.priority ?? '-'}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Updated</div>
              <div>{formatDate(page.updatedAt)}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Metadata</div>
              <div className="admin-meta">
                <pre>{JSON.stringify(page.metadata ?? {}, null, 2)}</pre>
              </div>
            </div>
          </div>
        ) : null}

        <div className="admin-toolbar" style={{ marginTop: '20px' }}>
          <AdminLink className="admin-button admin-button--ghost" href={`/pages?site_id=${siteId}`}>
            Back to list
          </AdminLink>
          {siteId ? (
            <AdminLink className="admin-button" href={`/sites/detail?site_id=${siteId}`}>
              View site
            </AdminLink>
          ) : null}
          {siteId && pagePath ? (
            <AdminLink
              className="admin-button admin-button--ghost"
              href={`/pages/detail?site_id=${siteId}&path=${encodedPath}`}
            >
              Refresh
            </AdminLink>
          ) : null}
        </div>
      </div>
    </div>
  )
}
