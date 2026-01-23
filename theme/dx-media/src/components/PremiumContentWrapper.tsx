'use client'

import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'
import {
  PageProductsProvider,
  XConnectionProvider,
  XConnectionModal,
  useXConnection,
  type XConnectionStatus,
} from '@techdoc/fumadocs-engine/components'

interface Product {
  id: string
  price?: number
  description?: string
  x_promotion?: {
    tweet_id: string
    tweet_url?: string
    label?: string
    starts_at?: string
    ends_at?: string
  }
}

interface PremiumContentWrapperProps {
  siteId: string
  products: Product[]
  apiBaseUrl: string
  children: ReactNode
}

/**
 * Inner component that can access XConnectionContext
 */
function PremiumContentInner({
  siteId,
  products,
  apiBaseUrl,
  children,
}: {
  siteId: string
  products: Product[]
  apiBaseUrl: string
  children: ReactNode
}) {
  const xConnection = useXConnection()

  return (
    <PageProductsProvider siteId={siteId} products={products}>
      {children}

      {/* X Connection Modal - controlled by XConnectionProvider */}
      {xConnection && (
        <XConnectionModal
          isOpen={xConnection.isModalOpen}
          onClose={xConnection.closeXConnect}
          onSuccess={xConnection.handleXConnectSuccess}
          apiBaseUrl={apiBaseUrl}
          campaignId={xConnection.currentCampaignId ?? undefined}
        />
      )}
    </PageProductsProvider>
  )
}

/**
 * Client component wrapper that provides X connection functionality
 * for premium content with X promotion unlock
 */
export function PremiumContentWrapper({
  siteId,
  products,
  apiBaseUrl,
  children,
}: PremiumContentWrapperProps) {
  const [connectionStatus, setConnectionStatus] = useState<XConnectionStatus>({
    isConnected: false,
  })

  const handleConnectionStatusChange = useCallback((status: XConnectionStatus) => {
    setConnectionStatus(status)
  }, [])

  const handleRepostVerified = useCallback((campaignId: string, entitlementId: string) => {
    // Reload the page to fetch the newly unlocked content
    console.log(`Repost verified for campaign ${campaignId}, entitlement: ${entitlementId}`)
    window.location.reload()
  }, [])

  return (
    <XConnectionProvider
      apiBaseUrl={apiBaseUrl}
      initialConnectionStatus={connectionStatus}
      onConnectionStatusChange={handleConnectionStatusChange}
      onRepostVerified={handleRepostVerified}
    >
      <PremiumContentInner siteId={siteId} products={products} apiBaseUrl={apiBaseUrl}>
        {children}
      </PremiumContentInner>
    </XConnectionProvider>
  )
}
