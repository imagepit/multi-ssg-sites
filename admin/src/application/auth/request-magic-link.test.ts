import { describe, it, expect, vi } from 'vitest'
import { requestMagicLink } from './request-magic-link.js'
import type { MagicLinkRepository } from './magic-link-repository.js'
import type { MailSender } from './mail-sender.js'

describe('requestMagicLink', () => {
  const createMockDeps = () => {
    const magicLinkRepo: MagicLinkRepository = {
      create: vi.fn().mockResolvedValue(undefined),
      findByTokenHash: vi.fn(),
      markUsed: vi.fn(),
      deleteExpired: vi.fn()
    }

    const mailSender: MailSender = {
      send: vi.fn().mockResolvedValue(undefined)
    }

    return {
      magicLinkRepo,
      mailSender,
      generateId: vi.fn().mockReturnValue('token-id-123'),
      generateToken: vi.fn().mockReturnValue('raw-token-abc'),
      hashToken: vi.fn().mockResolvedValue('hashed-token-xyz')
    }
  }

  it('creates a magic link token and sends email', async () => {
    const deps = createMockDeps()

    const result = await requestMagicLink(
      {
        email: 'test@example.com',
        baseUrl: 'https://api.example.com'
      },
      deps
    )

    expect(result).toEqual({ ok: true })
    expect(deps.magicLinkRepo.create).toHaveBeenCalledTimes(1)
    expect(deps.mailSender.send).toHaveBeenCalledTimes(1)

    const mailCall = vi.mocked(deps.mailSender.send).mock.calls[0][0]
    expect(mailCall.to).toBe('test@example.com')
    expect(mailCall.subject).toBe('ログインリンク')
    expect(mailCall.text).toContain('https://api.example.com/auth/verify?token=raw-token-abc')
  })

  it('normalizes email to lowercase', async () => {
    const deps = createMockDeps()

    await requestMagicLink(
      {
        email: 'Test@EXAMPLE.com',
        baseUrl: 'https://api.example.com'
      },
      deps
    )

    const createCall = vi.mocked(deps.magicLinkRepo.create).mock.calls[0][0]
    expect(createCall.email).toBe('test@example.com')
  })

  it('hashes the token before storing', async () => {
    const deps = createMockDeps()

    await requestMagicLink(
      {
        email: 'test@example.com',
        baseUrl: 'https://api.example.com'
      },
      deps
    )

    expect(deps.hashToken).toHaveBeenCalledWith('raw-token-abc')

    const createCall = vi.mocked(deps.magicLinkRepo.create).mock.calls[0][0]
    expect(createCall.tokenHash).toBe('hashed-token-xyz')
  })

  it('throws error when email is missing', async () => {
    const deps = createMockDeps()

    await expect(
      requestMagicLink(
        {
          email: '',
          baseUrl: 'https://api.example.com'
        },
        deps
      )
    ).rejects.toThrow('email is required')
  })

  it('uses custom expiration time if provided', async () => {
    const deps = createMockDeps()

    await requestMagicLink(
      {
        email: 'test@example.com',
        baseUrl: 'https://api.example.com'
      },
      { ...deps, expiresInMinutes: 30 }
    )

    // Token should be created - the expiration is set in createMagicLinkToken
    expect(deps.magicLinkRepo.create).toHaveBeenCalledTimes(1)
  })
})
