export type EntitlementStatus = 'active' | 'revoked' | 'expired'

export type GrantedBy = 'stripe' | 'manual' | 'promotion'

export interface Entitlement {
  id: string
  userId: string
  productId: string
  siteId: string
  status: EntitlementStatus
  grantedBy: GrantedBy
  grantedAt: string
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateEntitlementInput {
  id: string
  userId: string
  productId: string
  siteId: string
  grantedBy: GrantedBy
  expiresAt?: string | null
  status?: EntitlementStatus
}

export function createEntitlement(input: CreateEntitlementInput): Entitlement {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.productId) {
    throw new Error('productId is required')
  }
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (!input.grantedBy) {
    throw new Error('grantedBy is required')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    userId: input.userId,
    productId: input.productId,
    siteId: input.siteId,
    status: input.status ?? 'active',
    grantedBy: input.grantedBy,
    grantedAt: now,
    expiresAt: input.expiresAt ?? null,
    createdAt: now,
    updatedAt: now
  }
}

export function isEntitlementActive(entitlement: Entitlement): boolean {
  if (entitlement.status !== 'active') {
    return false
  }

  if (entitlement.expiresAt) {
    const now = new Date()
    const expiresAt = new Date(entitlement.expiresAt)
    if (now > expiresAt) {
      return false
    }
  }

  return true
}

export function hasActiveEntitlement(
  entitlements: Entitlement[],
  productId: string
): boolean {
  return entitlements.some(
    (e) => e.productId === productId && isEntitlementActive(e)
  )
}
