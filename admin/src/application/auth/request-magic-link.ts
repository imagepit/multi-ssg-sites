import { createMagicLinkToken } from '../../domain/auth/magic-link-token.js'
import type { MagicLinkRepository } from './magic-link-repository.js'
import type { MailSender } from './mail-sender.js'

export interface RequestMagicLinkInput {
  email: string
  baseUrl: string
}

export interface RequestMagicLinkDeps {
  magicLinkRepo: MagicLinkRepository
  mailSender: MailSender
  generateId: () => string
  generateToken: () => string
  hashToken: (token: string) => Promise<string>
  expiresInMinutes?: number
}

export interface RequestMagicLinkResult {
  ok: true
}

export async function requestMagicLink(
  input: RequestMagicLinkInput,
  deps: RequestMagicLinkDeps
): Promise<RequestMagicLinkResult> {
  if (!input.email) {
    throw new Error('email is required')
  }

  const email = input.email.toLowerCase().trim()
  const token = deps.generateToken()
  const tokenHash = await deps.hashToken(token)

  const magicLinkToken = createMagicLinkToken({
    id: deps.generateId(),
    email,
    tokenHash,
    expiresInMinutes: deps.expiresInMinutes
  })

  await deps.magicLinkRepo.create(magicLinkToken)

  const verifyUrl = `${input.baseUrl}/auth/verify?token=${encodeURIComponent(token)}`

  await deps.mailSender.send({
    to: email,
    subject: 'ログインリンク',
    text: `以下のリンクをクリックしてログインしてください。\n\n${verifyUrl}\n\nこのリンクは15分間有効です。`,
    html: `
      <p>以下のリンクをクリックしてログインしてください。</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>このリンクは15分間有効です。</p>
    `
  })

  return { ok: true }
}
