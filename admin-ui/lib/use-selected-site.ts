'use client'

import { useCallback, useEffect, useState } from 'react'
import { loadSelectedSite, saveSelectedSite } from './site-selection'

export function useSelectedSite() {
  const [siteId, setSiteId] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSiteId(loadSelectedSite())
    setReady(true)
  }, [])

  const updateSite = useCallback((next: string) => {
    setSiteId(next)
    saveSelectedSite(next)
  }, [])

  return { siteId, updateSite, ready }
}
