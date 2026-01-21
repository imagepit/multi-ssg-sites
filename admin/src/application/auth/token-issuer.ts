export interface TokenPayload {
  sub: string
  email: string
  roles?: string[]
  siteIds?: string[]
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface TokenIssuer {
  issueAccessToken(payload: TokenPayload): Promise<string>
  issueRefreshToken(payload: TokenPayload): Promise<string>
  issueTokenPair(payload: TokenPayload): Promise<TokenPair>
  verifyRefreshToken(token: string): Promise<TokenPayload>
}
