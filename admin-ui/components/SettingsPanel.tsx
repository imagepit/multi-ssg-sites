'use client'

import { useEffect, useState } from 'react'
import { useAdminSettings } from '../lib/use-admin-settings'

export function SettingsPanel() {
  const { settings, updateSettings, ready } = useAdminSettings()
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl)
  const [token, setToken] = useState(settings.token)

  useEffect(() => {
    if (!ready) {
      return
    }
    setBaseUrl(settings.baseUrl)
    setToken(settings.token)
  }, [ready, settings.baseUrl, settings.token])

  if (!ready) {
    return null
  }

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateSettings({ baseUrl: baseUrl.trim(), token: token.trim() })
  }

  const handleReset = () => {
    setBaseUrl(settings.baseUrl)
    setToken(settings.token)
  }

  return (
    <form className="admin-card" onSubmit={handleSave}>
      <div className="admin-toolbar">
        <div>
          <div className="admin-card__label">Connection</div>
          <div className="admin-meta">Admin API base URL + JWT token</div>
        </div>
        <div className="admin-toolbar">
          <button className="admin-button admin-button--ghost" type="button" onClick={handleReset}>
            Reset
          </button>
          <button className="admin-button" type="submit">
            Save
          </button>
        </div>
      </div>
      <div className="admin-grid">
        <label>
          <div className="admin-card__label">Admin API URL</div>
          <input
            className="admin-input admin-input--wide"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://techdoc-admin.example.workers.dev"
          />
        </label>
        <label>
          <div className="admin-card__label">JWT Token</div>
          <input
            className="admin-input admin-input--wide"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="eyJhbGciOi..."
          />
        </label>
      </div>
    </form>
  )
}
