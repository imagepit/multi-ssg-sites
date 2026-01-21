export interface AuthClaims {
  sub: string
  email?: string
  roles?: string[]
  siteIds?: string[]
}
