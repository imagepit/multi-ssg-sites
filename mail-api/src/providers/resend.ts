/**
 * Resend メールプロバイダー
 * @see https://resend.com/docs/api-reference/emails/send-email
 */

import type { MailProvider, SendMailParams, SendMailResult } from '../types';
import { formatSubject, formatPlainTextBody } from '../templates/contact';

export class ResendProvider implements MailProvider {
  readonly name = 'resend';
  private apiKey: string;
  private toEmail: string;
  private fromEmail: string;

  constructor(apiKey: string, toEmail: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.toEmail = toEmail;
    this.fromEmail = fromEmail;
  }

  async send(params: SendMailParams): Promise<SendMailResult> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [this.toEmail],
          subject: formatSubject(params),
          text: formatPlainTextBody(params),
          reply_to: params.fromEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { message?: string };
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json() as { id: string };
      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
