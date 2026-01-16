export type EntitlementStatus = 'active' | 'revoked'
export type UserStatus = 'active' | 'disabled'
export type ProductStatus = 'active' | 'disabled'

export interface User {
  id: string
  email: string
  status: UserStatus
  createdAt?: string
}

export interface Product {
  id: string
  name: string
  siteId: string
  status: ProductStatus
}

export interface Entitlement {
  userId: string
  productId: string
  siteId: string
  status: EntitlementStatus
  grantedBy: string
  grantedAt: string
  expiresAt?: string
}
