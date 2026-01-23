/**
 * 有料コンテンツAPI関数
 * Pure関数としてテスト可能
 */

/**
 * 有料コンテンツ取得パラメータ
 */
export interface FetchPaidContentParams {
  siteId: string
  slug: string
  sectionId: string
  productId: string
  apiBaseUrl: string
  accessToken: string
}

/**
 * 有料コンテンツエラー型
 */
export type PaidContentError =
  | { type: 'unauthorized'; message: string }    // 401: 未ログイン
  | { type: 'forbidden'; message: string }       // 403: 未購入
  | { type: 'not_found'; message: string }       // 404: コンテンツ不存在
  | { type: 'network'; message: string }         // ネットワークエラー

/**
 * 署名URL付きコンテンツレスポンス
 */
export interface PaidContentResponse {
  signedUrl: string
  expiresAt: number
}

/**
 * R2から取得したコンテンツデータ
 */
export interface PaidContentData {
  html: string
  updatedAt?: number
}

/**
 * 有料コンテンツAPI URLを構築
 */
export function buildPaidContentUrl(params: Omit<FetchPaidContentParams, 'accessToken'>): string {
  const searchParams = new URLSearchParams({
    siteId: params.siteId,
    slug: params.slug,
    sectionId: params.sectionId,
    productId: params.productId,
  })
  return `${params.apiBaseUrl}/api/paid-content?${searchParams}`
}

/**
 * エラーレスポンスを PaidContentError に変換
 */
export function createPaidContentError(
  status: number,
  errorMessage?: string
): PaidContentError {
  switch (status) {
    case 401:
      return { type: 'unauthorized', message: errorMessage || 'ログインが必要です' }
    case 403:
      return { type: 'forbidden', message: errorMessage || 'このコンテンツへのアクセス権がありません' }
    case 404:
      return { type: 'not_found', message: errorMessage || 'コンテンツが見つかりません' }
    default:
      return { type: 'network', message: errorMessage || `サーバーエラー (${status})` }
  }
}

/**
 * 有料コンテンツの署名URLを取得
 */
export async function fetchPaidContentSignedUrl(
  params: FetchPaidContentParams
): Promise<PaidContentResponse> {
  const url = buildPaidContentUrl(params)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${params.accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw createPaidContentError(response.status, errorData.error)
  }

  return response.json()
}

/**
 * R2からコンテンツを取得
 */
export async function fetchContentFromR2(signedUrl: string): Promise<PaidContentData> {
  const response = await fetch(signedUrl)

  if (!response.ok) {
    throw { type: 'network', message: 'コンテンツの取得に失敗しました' } as PaidContentError
  }

  return response.json()
}

/**
 * 有料コンテンツを取得（署名URL取得 → R2フェッチ）
 */
export async function fetchPaidContent(
  params: FetchPaidContentParams
): Promise<string> {
  // 1. 署名URL取得
  const { signedUrl } = await fetchPaidContentSignedUrl(params)

  // 2. R2からコンテンツ取得
  const { html } = await fetchContentFromR2(signedUrl)

  return html
}

/**
 * PaidContentErrorかどうかを判定
 */
export function isPaidContentError(error: unknown): error is PaidContentError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    typeof (error as any).type === 'string' &&
    ['unauthorized', 'forbidden', 'not_found', 'network'].includes((error as any).type)
  )
}
