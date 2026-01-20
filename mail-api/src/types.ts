/**
 * メール送信機能の型定義
 */

/** メール送信パラメータ */
export interface SendMailParams {
  /** 送信者名 */
  fromName: string;
  /** 送信者メールアドレス */
  fromEmail: string;
  /** 件名 */
  subject: string;
  /** 本文 */
  body: string;
  /** サイト名（オプション） */
  siteName?: string;
}

/** メール送信結果 */
export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/** メールプロバイダーインターフェース */
export interface MailProvider {
  /** プロバイダー名 */
  readonly name: string;
  /** メール送信 */
  send(params: SendMailParams): Promise<SendMailResult>;
}

/** サポートするプロバイダー種別 */
export type MailProviderType = 'resend' | 'sendgrid' | 'gmail';

/** 環境変数の型定義 */
export interface Env {
  MAIL_PROVIDER: MailProviderType;
  MAIL_TO_EMAIL: string;
  MAIL_FROM_EMAIL?: string;
  ALLOWED_ORIGINS: string;
  RESEND_API_KEY?: string;
  SENDGRID_API_KEY?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REFRESH_TOKEN?: string;
}
