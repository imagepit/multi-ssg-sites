'use client'

import { useEffect, useState } from 'react'
import { AdminLink } from '../../components/AdminLink'
import { SettingsPanel } from '../../components/SettingsPanel'
import { StatusPill } from '../../components/StatusPill'
import { adminFetch } from '../../lib/api'
import { formatDate } from '../../lib/format'
import type { Site } from '../../lib/types'
import { useAdminSettings } from '../../lib/use-admin-settings'

export default function SitesPage() {
  const { settings, ready } = useAdminSettings()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) {
      return
    }
    setLoading(true)
    setError(null)
    adminFetch<{ sites: Site[] }>(settings, '/admin/sites')
      .then((data) => {
        setSites(data.sites ?? [])
      })
      .catch((err) => {
        setError(String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [ready, settings.baseUrl, settings.token])

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-section__title">Sites</div>
        <div className="admin-meta">
          Domain registry for each site. Select a row to open details.
        </div>
      </div>

      <SettingsPanel />

      <div className="admin-card">
        <div className="admin-toolbar">
          <div>
            <div className="admin-card__label">Sites</div>
            <div className="admin-meta">Fetched from admin API.</div>
          </div>
          <AdminLink className="admin-button admin-button--ghost" href="/sites">
            Refresh
          </AdminLink>
        </div>

        {loading ? <div className="admin-empty">Loading...</div> : null}
        {error ? <div className="admin-empty">Error: {error}</div> : null}
        {!loading && !error && sites.length === 0 ? (
          <div className="admin-empty">No sites yet.</div>
        ) : null}

        {sites.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Site ID</th>
                <th>Name</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.siteId}>
                  <td>
                    <div>{site.siteId}</div>
                    <div className="admin-meta">{site.themeId || 'theme: -'}</div>
                  </td>
                  <td>{site.name}</td>
                  <td>{site.domain || '-'}</td>
                  <td>
                    <StatusPill status={site.status} />
                  </td>
                  <td>{formatDate(site.updatedAt)}</td>
                  <td>
                    <AdminLink className="admin-link" href={`/sites/detail?site_id=${site.siteId}`}>
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
