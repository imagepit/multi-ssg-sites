'use client'

import { AdminLink } from '../components/AdminLink'
import { SettingsPanel } from '../components/SettingsPanel'

export default function HomePage() {
  return (
    <div className="admin-section">
      <div className="admin-hero">
        <div className="admin-hero__badge">TD</div>
        <div>
          <p className="admin-card__label">Your workspace</p>
          <h1 className="admin-title">Techdoc Admin Console</h1>
          <p className="admin-subtitle">
            Manage sites, pages, and sync status from a single control plane.
          </p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card__label">Sites</div>
          <div className="admin-card__value">--</div>
          <div className="admin-meta">Configured domains and site registry.</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__label">Pages</div>
          <div className="admin-card__value">--</div>
          <div className="admin-meta">Synced page metadata per site.</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__label">Access</div>
          <div className="admin-card__value">Locked</div>
          <div className="admin-meta">Cloudflare Access protects entry.</div>
        </div>
      </div>

      <SettingsPanel />

      <div className="admin-card">
        <div className="admin-section__title">Quick access</div>
        <div className="admin-grid">
          <AdminLink className="admin-card" href="/sites">
            <div className="admin-card__label">Browse</div>
            <div className="admin-card__value">Sites</div>
            <div className="admin-meta">Domains, status, and details.</div>
          </AdminLink>
          <AdminLink className="admin-card" href="/pages">
            <div className="admin-card__label">Browse</div>
            <div className="admin-card__value">Pages</div>
            <div className="admin-meta">Metadata table and page view.</div>
          </AdminLink>
          <AdminLink className="admin-card" href="/access">
            <div className="admin-card__label">Verify</div>
            <div className="admin-card__value">Access</div>
            <div className="admin-meta">Headers and auth session info.</div>
          </AdminLink>
        </div>
      </div>
    </div>
  )
}
