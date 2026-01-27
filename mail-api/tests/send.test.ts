import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../src/index'
import type { Env } from '../src/types'

// Hono テスト用のモック環境
const createMockEnv = (overrides?: Partial<Env>): Env => ({
  MAIL_PROVIDER: 'resend',
  MAIL_TO_EMAIL: 'admin@example.com',
  MAIL_FROM_EMAIL: 'noreply@example.com',
  ALLOWED_ORIGINS: 'https://example.com',
  RESEND_API_KEY: 'test-resend-key',
  INTERNAL_API_KEY: 'test-internal-key',
  ...overrides,
})

// fetch をモック
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('POST /send', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // デフォルトで成功レスポンスを返す
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'msg_12345' }),
    })
  })

  it('should return 401 when API key is missing', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toContain('Unauthorized')
  })

  it('should return 401 when API key is invalid', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'wrong-key',
      },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('should return 400 when required fields are missing', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-internal-key',
      },
      body: JSON.stringify({
        to: 'user@example.com',
        // subject missing
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.errors).toBeDefined()
  })

  it('should return 400 when email is invalid', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-internal-key',
      },
      body: JSON.stringify({
        to: 'invalid-email',
        subject: 'Test Subject',
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.errors?.to).toBeDefined()
  })

  it('should successfully send email with valid request', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-internal-key',
      },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.messageId).toBe('msg_12345')

    // Resend API が呼ばれたことを確認
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-resend-key',
        }),
      })
    )
  })

  it('should include html in request when provided', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-internal-key',
      },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test body',
        html: '<p>Test HTML body</p>',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(200)

    // リクエストボディに html が含まれていることを確認
    const callArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)
    expect(requestBody.html).toBe('<p>Test HTML body</p>')
  })

  it('should skip API key auth when INTERNAL_API_KEY is not set', async () => {
    const env = createMockEnv({ INTERNAL_API_KEY: undefined })
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // API key not provided
      },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    // 認証がスキップされ、メール送信が成功する
    expect(res.status).toBe(200)
  })

  it('should return 500 when mail provider fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ message: 'Provider error' }),
    })

    const env = createMockEnv()
    const req = new Request('http://localhost/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-internal-key',
      },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test body',
      }),
    })

    const res = await app.fetch(req, env)

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})

describe('POST /contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'msg_12345' }),
    })
  })

  it('should not require API key for contact endpoint', async () => {
    const env = createMockEnv()
    const req = new Request('http://localhost/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://example.com',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'user@example.com',
        subject: 'Test Subject',
        body: 'Test body content',
      }),
    })

    const res = await app.fetch(req, env)

    // APIキーなしでも成功する
    expect(res.status).toBe(200)
  })
})
