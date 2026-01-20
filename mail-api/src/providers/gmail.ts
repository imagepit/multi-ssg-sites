/**
 * GmailAPI メールプロバイダー
 * @see https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send
 */

import type { MailProvider, SendMailParams, SendMailResult } from '../types';
import { formatSubject, formatPlainTextBody } from '../templates/contact';
import { formatAutoReplySubject, formatAutoReplyPlainTextBody } from '../templates/auto-reply';

interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export class GmailProvider implements MailProvider {
  readonly name = 'gmail';
  private credentials: GmailCredentials;
  private toEmail: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials: GmailCredentials, toEmail: string) {
    this.credentials = credentials;
    this.toEmail = toEmail;
  }

  async send(params: SendMailParams): Promise<SendMailResult> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'Failed to obtain access token',
        };
      }

      const rawMessage = this.createRawMessage(
        this.toEmail,
        params.fromEmail,
        formatSubject(params),
        formatPlainTextBody(params)
      );

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: rawMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
        return {
          success: false,
          error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
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

  async sendAutoReply(params: SendMailParams): Promise<SendMailResult> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'Failed to obtain access token',
        };
      }

      const rawMessage = this.createRawMessage(
        params.fromEmail,
        undefined,
        formatAutoReplySubject(params),
        formatAutoReplyPlainTextBody(params)
      );

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: rawMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
        return {
          success: false,
          error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
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

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          refresh_token: this.credentials.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        console.error('Failed to refresh access token:', await response.text());
        return null;
      }

      const data = await response.json() as { access_token: string; expires_in: number };
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  private createRawMessage(
    to: string,
    replyTo: string | undefined,
    subject: string,
    body: string
  ): string {
    const messageParts = [
      `To: ${to}`,
      ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
      `Subject: =?UTF-8?B?${this.base64Encode(subject)}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      this.base64Encode(body),
    ];

    const message = messageParts.join('\r\n');
    return this.base64UrlEncode(message);
  }

  private base64Encode(str: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
  }

  private base64UrlEncode(str: string): string {
    const base64 = this.base64Encode(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
