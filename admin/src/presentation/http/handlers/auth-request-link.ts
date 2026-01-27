import type { Env } from '../../../env.js'
import type { MailSender } from '../../../application/auth/mail-sender.js'
import { requestMagicLink } from '../../../application/auth/request-magic-link.js'
import { D1MagicLinkRepository } from '../../../infrastructure/db/d1-magic-link-repository.js'
import { ConsoleMailSender } from '../../../infrastructure/mail/console-mail-sender.js'
import { MailApiSender } from '../../../infrastructure/mail/mail-api-sender.js'
import { hashToken, generateSecureToken, generateId } from '../../../infrastructure/crypto/hash.js'

/**
 * callbackUrl が許可されたオリジンかどうかを検証する
 * @param callbackUrl 検証対象のURL
 * @param env 環境変数
 * @returns 許可されていれば true
 */
function validateCallbackUrl(callbackUrl: string, env: Env): boolean {
  try {
    const url = new URL(callbackUrl)

    // 開発環境では localhost を許可
    if (env.ENV === 'development' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      return true
    }

    // 許可されたオリジンのリストを取得
    const allowedOrigins = env.ALLOWED_CALLBACK_ORIGINS?.split(',').map((o) => o.trim()) || []

    // オリジンが許可リストに含まれているか確認
    if (allowedOrigins.includes(url.origin)) {
      return true
    }

    // ワイルドカード対応（*.example.com など）
    for (const allowed of allowedOrigins) {
      if (allowed.startsWith('*.')) {
        const domain = allowed.slice(2)
        if (url.hostname.endsWith(domain) || url.hostname === domain.slice(1)) {
          return true
        }
      }
    }

    return false
  } catch {
    // URL パースエラーの場合は無効
    return false
  }
}

/**
 * 環境に応じた MailSender を作成する
 * MAIL_API_URL と MAIL_API_KEY が設定されていれば MailApiSender を使用
 * そうでなければ ConsoleMailSender を使用（開発環境用）
 */
function createMailSender(env: Env): MailSender {
  if (env.MAIL_API_URL && env.MAIL_API_KEY) {
    return new MailApiSender(env.MAIL_API_URL, env.MAIL_API_KEY)
  }
  return new ConsoleMailSender()
}

interface RequestLinkBody {
  email: string
  callbackUrl?: string
  next?: string
}

export async function handleAuthRequestLink(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Database not configured', { status: 500 })
  }

  let body: RequestLinkBody
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'invalid JSON body' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!body.email) {
    return new Response(
      JSON.stringify({ error: 'email is required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  // callbackUrl が指定されている場合は検証
  if (body.callbackUrl) {
    // ALLOWED_CALLBACK_ORIGINS が設定されている場合のみ検証
    if (env.ALLOWED_CALLBACK_ORIGINS && !validateCallbackUrl(body.callbackUrl, env)) {
      return new Response(
        JSON.stringify({ error: 'Invalid callback URL: origin not allowed' }),
        { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }
  }

  // Determine base URL for magic link
  // callbackUrl が指定されていればそれを使用、なければAPIのURLを使用
  const url = new URL(request.url)
  const apiBaseUrl = `${url.protocol}//${url.host}`

  // コールバックURLの構築
  let verifyUrl: string
  if (body.callbackUrl) {
    // フロントエンドのコールバックURLを使用
    const callbackUrl = new URL(body.callbackUrl)
    // next パラメータがあれば追加
    if (body.next) {
      callbackUrl.searchParams.set('next', body.next)
    }
    verifyUrl = callbackUrl.toString()
  } else {
    // 後方互換: APIのverifyエンドポイントを直接使用
    verifyUrl = `${apiBaseUrl}/auth/verify`
  }

  try {
    const result = await requestMagicLink(
      {
        email: body.email,
        baseUrl: verifyUrl.replace(/\?.*$/, ''), // クエリパラメータを除いたベースURL
        callbackUrl: body.callbackUrl ? verifyUrl : undefined
      },
      {
        magicLinkRepo: new D1MagicLinkRepository(env.DB),
        mailSender: createMailSender(env),
        generateId,
        generateToken: () => generateSecureToken(32),
        hashToken,
        expiresInMinutes: 15
      }
    )

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
