'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { XConnectionStatus } from '../components/PremiumPlaceholder.js'

/**
 * X Connection context value
 */
export interface XConnectionContextValue {
  /** API base URL for X auth endpoints */
  apiBaseUrl: string
  /** Auth token for API requests */
  authToken?: string
  /** Current X connection status */
  connectionStatus: XConnectionStatus
  /** Whether X connection modal is open */
  isModalOpen: boolean
  /** Current campaign ID being processed */
  currentCampaignId: string | null
  /** Whether verify repost is in progress */
  isVerifyingRepost: boolean
  /** Error message from X verification */
  xVerificationError: string | null
  /** Open X connection modal */
  openXConnect: (campaignId?: string) => void
  /** Close X connection modal */
  closeXConnect: () => void
  /** Handle successful X connection */
  handleXConnectSuccess: (info: { xUserId: string; xUsername: string; xProfileImage?: string }) => void
  /** Verify repost for a campaign */
  verifyRepost: (campaignId: string) => Promise<boolean>
  /** Clear verification error */
  clearVerificationError: () => void
  /** Check if user has entitlement for a campaign (from localStorage) */
  hasEntitlement: (campaignId: string) => boolean
  /** Get entitlement ID for a campaign (from localStorage) */
  getEntitlementId: (campaignId: string) => string | null
}

const XConnectionContext = createContext<XConnectionContextValue | null>(null)

/**
 * Hook to access X connection context
 */
export function useXConnection(): XConnectionContextValue | null {
  return useContext(XConnectionContext)
}

export interface XConnectionProviderProps {
  /** API base URL for X auth endpoints */
  apiBaseUrl: string
  /** Auth token for API requests */
  authToken?: string
  /** Initial X connection status */
  initialConnectionStatus?: XConnectionStatus
  /** Callback when connection status changes */
  onConnectionStatusChange?: (status: XConnectionStatus) => void
  /** Callback when repost is verified successfully */
  onRepostVerified?: (campaignId: string, entitlementId: string) => void
  children: ReactNode
}

/**
 * Provider component for X connection functionality
 */
export function XConnectionProvider({
  apiBaseUrl,
  authToken,
  initialConnectionStatus = { isConnected: false },
  onConnectionStatusChange,
  onRepostVerified,
  children,
}: XConnectionProviderProps) {
  const [connectionStatus, setConnectionStatus] = useState<XConnectionStatus>(initialConnectionStatus)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null)
  const [isVerifyingRepost, setIsVerifyingRepost] = useState(false)
  const [xVerificationError, setXVerificationError] = useState<string | null>(null)

  const openXConnect = useCallback((campaignId?: string) => {
    setCurrentCampaignId(campaignId ?? null)
    setIsModalOpen(true)
    setXVerificationError(null)
  }, [])

  const closeXConnect = useCallback(() => {
    setIsModalOpen(false)
    setCurrentCampaignId(null)
  }, [])

  const handleXConnectSuccess = useCallback((info: { xUserId: string; xUsername: string; xProfileImage?: string }) => {
    const newStatus: XConnectionStatus = {
      isConnected: true,
      xUsername: info.xUsername,
      xProfileImage: info.xProfileImage,
    }
    setConnectionStatus(newStatus)
    onConnectionStatusChange?.(newStatus)
    closeXConnect()
  }, [onConnectionStatusChange, closeXConnect])

  const verifyRepost = useCallback(async (campaignId: string): Promise<boolean> => {
    setIsVerifyingRepost(true)
    setXVerificationError(null)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch(`${apiBaseUrl}/api/x/verify-repost`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ campaignId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errorMessage = data.error || 'リポストの確認に失敗しました'
        setXVerificationError(errorMessage)
        return false
      }

      // Success - save entitlement to localStorage for future access
      if (data.entitlementId) {
        try {
          const entitlements = JSON.parse(localStorage.getItem('x_promotion_entitlements') || '{}')
          entitlements[campaignId] = {
            entitlementId: data.entitlementId,
            grantedAt: new Date().toISOString(),
          }
          localStorage.setItem('x_promotion_entitlements', JSON.stringify(entitlements))
        } catch {
          // Ignore localStorage errors
        }
      }

      // Success - notify parent
      onRepostVerified?.(campaignId, data.entitlementId)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'リポストの確認に失敗しました'
      setXVerificationError(errorMessage)
      return false
    } finally {
      setIsVerifyingRepost(false)
    }
  }, [apiBaseUrl, authToken, onRepostVerified])

  const clearVerificationError = useCallback(() => {
    setXVerificationError(null)
  }, [])

  const hasEntitlement = useCallback((campaignId: string): boolean => {
    try {
      const entitlements = JSON.parse(localStorage.getItem('x_promotion_entitlements') || '{}')
      return !!entitlements[campaignId]?.entitlementId
    } catch {
      return false
    }
  }, [])

  const getEntitlementId = useCallback((campaignId: string): string | null => {
    try {
      const entitlements = JSON.parse(localStorage.getItem('x_promotion_entitlements') || '{}')
      return entitlements[campaignId]?.entitlementId || null
    } catch {
      return null
    }
  }, [])

  const value: XConnectionContextValue = {
    apiBaseUrl,
    authToken,
    connectionStatus,
    isModalOpen,
    currentCampaignId,
    isVerifyingRepost,
    xVerificationError,
    openXConnect,
    closeXConnect,
    handleXConnectSuccess,
    verifyRepost,
    clearVerificationError,
    hasEntitlement,
    getEntitlementId,
  }

  return (
    <XConnectionContext.Provider value={value}>
      {children}
    </XConnectionContext.Provider>
  )
}
