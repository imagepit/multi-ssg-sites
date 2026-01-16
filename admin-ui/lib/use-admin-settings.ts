'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminSettings } from './admin-settings'
import { defaultSettings, loadSettings, saveSettings } from './admin-settings'

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSettings(loadSettings())
    setReady(true)
  }, [])

  const updateSettings = useCallback((next: AdminSettings) => {
    setSettings(next)
    saveSettings(next)
  }, [])

  return { settings, updateSettings, ready }
}
