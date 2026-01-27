import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MailApiSender } from '../../../src/infrastructure/mail/mail-api-sender.js'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('MailApiSender', () => {
  const apiUrl = 'https://mail-api.example.com'
  const apiKey = 'test-api-key'
  let sender: MailApiSender

  beforeEach(() => {
    vi.clearAllMocks()
    sender = new MailApiSender(apiUrl, apiKey)
  })

  describe('send', () => {
    it('should send email with correct parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, messageId: 'msg_12345' }),
      })

      await sender.send({
        to: 'user@example.com',
        subject: 'ログインリンク',
        text: 'ログインリンクです',
        html: '<p>ログインリンクです</p>',
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        `${apiUrl}/send`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
        })
      )

      // リクエストボディを確認
      const callArgs = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(callArgs[1].body)
      expect(requestBody).toEqual({
        to: 'user@example.com',
        subject: 'ログインリンク',
        text: 'ログインリンクです',
        html: '<p>ログインリンクです</p>',
      })
    })

    it('should send email without html when not provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, messageId: 'msg_12345' }),
      })

      await sender.send({
        to: 'user@example.com',
        subject: 'ログインリンク',
        text: 'ログインリンクです',
      })

      const callArgs = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(callArgs[1].body)
      expect(requestBody.html).toBeUndefined()
    })

    it('should throw error on HTTP error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Mail provider error' }),
      })

      await expect(
        sender.send({
          to: 'user@example.com',
          subject: 'Test',
          text: 'Test',
        })
      ).rejects.toThrow('Mail API error: Mail provider error')
    })

    it('should throw error when success is false in response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Invalid recipient' }),
      })

      await expect(
        sender.send({
          to: 'user@example.com',
          subject: 'Test',
          text: 'Test',
        })
      ).rejects.toThrow('Mail API error: Invalid recipient')
    })

    it('should handle JSON parse error gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(
        sender.send({
          to: 'user@example.com',
          subject: 'Test',
          text: 'Test',
        })
      ).rejects.toThrow('Mail API error: HTTP 500: Internal Server Error')
    })

    it('should handle network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(
        sender.send({
          to: 'user@example.com',
          subject: 'Test',
          text: 'Test',
        })
      ).rejects.toThrow('Network error')
    })
  })
})
