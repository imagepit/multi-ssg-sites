'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLink } from '../../../components/AdminLink'
import { SettingsPanel } from '../../../components/SettingsPanel'
import { StatusPill } from '../../../components/StatusPill'
import { adminFetch } from '../../../lib/api'
import { formatDate } from '../../../lib/format'
import type { Site } from '../../../lib/types'
import { useAdminSettings } from '../../../lib/use-admin-settings'

export function SiteDetailClient() {
  const searchParams = useSearchParams()
  const siteId = searchParams.get('site_id') || ''
  const { settings, ready } = useAdminSettings()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready || !siteId) {
      return
    }
    setLoading(true)
    setError(null)
    adminFetch<{ sites: Site[] }>(settings, '/admin/sites')
      .then((data) => {
        const found = data.sites?.find((item) => item.siteId === siteId) ?? null
        setSite(found)
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
        <div className="admin-section__title">Site detail</div>
        <div className="admin-meta">Inspect metadata and sync status.</div>
      </div>

      <SettingsPanel />

      <div className="admin-card">
        {!siteId ? <div className="admin-empty">site_id is required.</div> : null}
        {loading ? <div className="admin-empty">Loading...</div> : null}
        {error ? <div className="admin-empty">Error: {error}</div> : null}
        {!loading && !error && siteId && !site ? (
          <div className="admin-empty">Site not found.</div>
        ) : null}

        {site ? (
          <div className="admin-detail">
            <div className="admin-detail__row">
              <div className="admin-detail__label">Site ID</div>
              <div>{site.siteId}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Name</div>
              <div>{site.name}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Domain</div>
              <div>{site.domain || '-'}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Theme</div>
              <div>{site.themeId || '-'}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Status</div>
              <StatusPill status={site.status} />
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Updated</div>
              <div>{formatDate(site.updatedAt)}</div>
            </div>
          </div>
        ) : null}

        <div className="admin-toolbar" style={{ marginTop: '20px' }}>
          <AdminLink className="admin-button admin-button--ghost" href="/sites">
            Back to list
          </AdminLink>
          {siteId ? (
            <AdminLink className="admin-button" href={`/pages?site_id=${siteId}`}>
              View pages
            </AdminLink>
          ) : null}
        </div>
      </div>
    </div>
  )
}
