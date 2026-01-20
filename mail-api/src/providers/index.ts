/**
 * メールプロバイダーファクトリ
 */

import type { MailProvider, MailProviderType, Env } from '../types';
import { ResendProvider } from './resend';
import { SendGridProvider } from './sendgrid';
import { GmailProvider } from './gmail';

/**
 * 環境変数からメールプロバイダーのインスタンスを作成
 */
export function createMailProvider(env: Env): MailProvider {
  const provider = env.MAIL_PROVIDER || 'resend';
  const toEmail = env.MAIL_TO_EMAIL;

  if (!toEmail) {
    throw new Error('MAIL_TO_EMAIL environment variable is required');
  }

  switch (provider) {
    case 'resend': {
      if (!env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is required for Resend provider');
      }
      if (!env.MAIL_FROM_EMAIL) {
        throw new Error('MAIL_FROM_EMAIL environment variable is required for Resend provider');
      }
      return new ResendProvider(env.RESEND_API_KEY, toEmail, env.MAIL_FROM_EMAIL);
    }

    case 'sendgrid': {
      if (!env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY environment variable is required for SendGrid provider');
      }
      return new SendGridProvider(env.SENDGRID_API_KEY, toEmail);
    }

    case 'gmail': {
      if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
        throw new Error(
          'GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN environment variables are required for Gmail provider'
        );
      }
      return new GmailProvider(
        {
          clientId: env.GMAIL_CLIENT_ID,
          clientSecret: env.GMAIL_CLIENT_SECRET,
          refreshToken: env.GMAIL_REFRESH_TOKEN,
        },
        toEmail
      );
    }

    default:
      throw new Error(`Unknown mail provider: ${provider}`);
  }
}
