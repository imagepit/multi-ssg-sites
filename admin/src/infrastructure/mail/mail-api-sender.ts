import type { MailSender, MailSendRequest } from '../../application/auth/mail-sender.js'

interface MailApiResponse {
  success: boolean
  messageId?: string
  error?: string
  message?: string
}

/**
 * mail-api を使用してメールを送信する MailSender 実装
 * 本番環境で使用
 */
export class MailApiSender implements MailSender {
  constructor(
    private readonly apiUrl: string,
    private readonly apiKey: string
  ) {}

  async send(request: MailSendRequest): Promise<void> {
    const response = await fetch(`${this.apiUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        to: request.to,
        subject: request.subject,
        text: request.text,
        html: request.html,
      }),
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = (await response.json()) as MailApiResponse
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch {
        // JSONパースエラーは無視
      }
      throw new Error(`Mail API error: ${errorMessage}`)
    }

    const data = (await response.json()) as MailApiResponse
    if (!data.success) {
      throw new Error(`Mail API error: ${data.error || 'Unknown error'}`)
    }
  }
}
