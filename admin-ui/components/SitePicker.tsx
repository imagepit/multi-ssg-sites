'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '../lib/api'
import type { Site } from '../lib/types'
import { useAdminSettings } from '../lib/use-admin-settings'
import { useSelectedSite } from '../lib/use-selected-site'
import { AdminLink } from './AdminLink'

export function SitePicker() {
  const { settings, ready } = useAdminSettings()
  const { siteId, updateSite } = useSelectedSite()
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) {
      return
    }
    adminFetch<{ sites: Site[] }>(settings, '/admin/sites')
      .then((data) => {
        const next = data.sites ?? []
        setSites(next)
        if (!siteId && next.length > 0) {
          updateSite(next[0].siteId)
        }
      })
      .catch((err) => {
        setError(String(err))
      })
  }, [ready, settings.baseUrl, settings.token, siteId, updateSite])

  return (
    <div className="admin-card">
      <div className="admin-card__label">Active site</div>
      {error ? <div className="admin-meta">Error: {error}</div> : null}
      {!error && sites.length === 0 ? <div className="admin-meta">No sites loaded.</div> : null}
      {sites.length > 0 ? (
        <>
          <select
            className="admin-select"
            value={siteId}
            onChange={(event) => updateSite(event.target.value)}
          >
            {sites.map((site) => (
              <option key={site.siteId} value={site.siteId}>
                {site.siteId} ({site.name})
              </option>
            ))}
          </select>
          <div className="admin-toolbar" style={{ marginTop: '12px' }}>
            <AdminLink
              className="admin-button admin-button--ghost"
              href={`/sites/detail?site_id=${siteId}`}
            >
              Site detail
            </AdminLink>
            <AdminLink className="admin-button" href={`/pages?site_id=${siteId}`}>
              Pages
            </AdminLink>
          </div>
        </>
      ) : null}
    </div>
  )
}
