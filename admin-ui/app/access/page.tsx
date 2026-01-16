'use client'

import { SettingsPanel } from '../../components/SettingsPanel'
import { useAdminSettings } from '../../lib/use-admin-settings'

export default function AccessPage() {
  const { settings, ready } = useAdminSettings()

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-section__title">Access</div>
        <div className="admin-meta">
          Cloudflare Access protects the admin UI. Ensure your JWT has the correct roles and
          site scopes.
        </div>
      </div>

      <SettingsPanel />

      <div className="admin-card">
        <div className="admin-section__title">Current session</div>
        {!ready ? null : (
          <div className="admin-detail">
            <div className="admin-detail__row">
              <div className="admin-detail__label">Admin API</div>
              <div>{settings.baseUrl}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">JWT token</div>
              <div>{settings.token ? `${settings.token.slice(0, 10)}...` : 'Not set'}</div>
            </div>
            <div className="admin-detail__row">
              <div className="admin-detail__label">Expected scopes</div>
              <div className="admin-meta">
                viewer/editor/admin roles + siteIds claim matching the site you access.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
