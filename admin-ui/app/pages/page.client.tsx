'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AdminLink } from '../../components/AdminLink'
import { SettingsPanel } from '../../components/SettingsPanel'
import { StatusPill } from '../../components/StatusPill'
import { adminFetch } from '../../lib/api'
import { formatDate, formatTags } from '../../lib/format'
import type { PageMeta } from '../../lib/types'
import { useAdminSettings } from '../../lib/use-admin-settings'
import { useSelectedSite } from '../../lib/use-selected-site'

export function PagesClient() {
  const searchParams = useSearchParams()
  const { settings, ready } = useAdminSettings()
  const initialSiteId = useMemo(() => searchParams.get('site_id') || '', [searchParams])
  const [siteId, setSiteId] = useState(initialSiteId)
  const [pages, setPages] = useState<PageMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { siteId: selectedSiteId } = useSelectedSite()

  useEffect(() => {
    if (!siteId && selectedSiteId) {
      setSiteId(selectedSiteId)
    }
  }, [siteId, selectedSiteId])

  useEffect(() => {
    if (initialSiteId && initialSiteId !== siteId) {
      setSiteId(initialSiteId)
    }
  }, [initialSiteId, siteId])

  useEffect(() => {
    if (!ready || !siteId) {
      return
    }
    setLoading(true)
    setError(null)
    const query = new URLSearchParams({ site_id: siteId, limit: '200' })
    adminFetch<{ pages: PageMeta[] }>(settings, `/admin/pages?${query.toString()}`)
      .then((data) => {
        setPages(data.pages ?? [])
      })
      .catch((err) => {
        setError(String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [ready, siteId, settings.baseUrl, settings.token])

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-section__title">Pages</div>
        <div className="admin-meta">
          Sync payloads populate this table. Select a site and browse metadata.
        </div>
      </div>

      <SettingsPanel />

      <div className="admin-card">
        <div className="admin-toolbar">
          <div>
            <div className="admin-card__label">Site filter</div>
            <div className="admin-meta">site_id is required for listing pages.</div>
          </div>
          <div className="admin-toolbar">
            <input
              className="admin-input"
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
              placeholder="nextjs"
            />
            <AdminLink
              className="admin-button admin-button--ghost"
              href={siteId ? `/pages?site_id=${siteId}` : '/pages'}
            >
              Refresh
            </AdminLink>
          </div>
        </div>

        {!siteId ? <div className="admin-empty">Enter site_id to fetch pages.</div> : null}
        {loading ? <div className="admin-empty">Loading...</div> : null}
        {error ? <div className="admin-empty">Error: {error}</div> : null}
        {!loading && !error && siteId && pages.length === 0 ? (
          <div className="admin-empty">No pages found.</div>
        ) : null}

        {pages.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Title</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={`${page.siteId}:${page.path}`}>
                  <td>
                    <div>{page.path}</div>
                    <div className="admin-meta">{page.slug}</div>
                  </td>
                  <td>{page.title}</td>
                  <td>
                    <StatusPill status={page.status} />
                  </td>
                  <td>{formatTags(page.tags ?? undefined)}</td>
                  <td>{formatDate(page.updatedAt)}</td>
                  <td>
                    <AdminLink
                      className="admin-link"
                      href={`/pages/detail?site_id=${page.siteId}&path=${encodeURIComponent(page.path)}`}
                    >
                      Details
                    </AdminLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}
