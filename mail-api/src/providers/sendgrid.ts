/**
 * SendGrid メールプロバイダー
 * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */

import type { MailProvider, SendMailParams, SendMailResult, TransactionalMailParams } from '../types';
import { formatSubject, formatPlainTextBody } from '../templates/contact';
import { formatAutoReplySubject, formatAutoReplyPlainTextBody } from '../templates/auto-reply';

export class SendGridProvider implements MailProvider {
  readonly name = 'sendgrid';
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
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: this.toEmail }],
            },
          ],
          from: {
            email: this.fromEmail,
            name: params.fromName,
          },
          reply_to: {
            email: params.fromEmail,
            name: params.fromName,
          },
          subject: formatSubject(params),
          content: [
            {
              type: 'text/plain',
              value: formatPlainTextBody(params),
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText) as { errors?: Array<{ message: string }> };
          if (errorData.errors?.[0]?.message) {
            errorMessage = errorData.errors[0].message;
          }
        } catch {
          // JSONパースエラーは無視
        }
        return {
          success: false,
          error: errorMessage,
        };
      }

      const messageId = response.headers.get('x-message-id') || undefined;
      return {
        success: true,
        messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendAutoReply(params: SendMailParams): Promise<SendMailResult> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: params.fromEmail }],
            },
          ],
          from: {
            email: this.fromEmail,
          },
          subject: formatAutoReplySubject(params),
          content: [
            {
              type: 'text/plain',
              value: formatAutoReplyPlainTextBody(params),
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText) as { errors?: Array<{ message: string }> };
          if (errorData.errors?.[0]?.message) {
            errorMessage = errorData.errors[0].message;
          }
        } catch {
          // JSONパースエラーは無視
        }
        return {
          success: false,
          error: errorMessage,
        };
      }

      const messageId = response.headers.get('x-message-id') || undefined;
      return {
        success: true,
        messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendTransactional(params: TransactionalMailParams): Promise<SendMailResult> {
    try {
      const content = [
        {
          type: 'text/plain',
          value: params.text,
        },
      ];

      if (params.html) {
        content.push({
          type: 'text/html',
          value: params.html,
        });
      }

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: params.to }],
            },
          ],
          from: {
            email: this.fromEmail,
          },
          subject: params.subject,
          content,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText) as { errors?: Array<{ message: string }> };
          if (errorData.errors?.[0]?.message) {
            errorMessage = errorData.errors[0].message;
          }
        } catch {
          // JSONパースエラーは無視
        }
        return {
          success: false,
          error: errorMessage,
        };
      }

      const messageId = response.headers.get('x-message-id') || undefined;
      return {
        success: true,
        messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
