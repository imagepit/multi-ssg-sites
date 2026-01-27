export interface Env {
  ENV?: string;
  ADMIN_ALLOWED_ORIGINS?: string;
  ADMIN_API_KEY?: string;
  ADMIN_JWT_SECRET?: string;
  ADMIN_MAGIC_LINK_SECRET?: string;
  ADMIN_EMAIL_FROM?: string;
  JWT_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  DB?: D1Database;
  PAID_CONTENT?: R2Bucket;
  EVENTS_QUEUE?: Queue;
  /** メールAPI URL（設定時は実メール送信、未設定時はコンソール出力） */
  MAIL_API_URL?: string;
  /** メールAPI認証キー */
  MAIL_API_KEY?: string;
  /** 許可されたコールバックURLのオリジン（カンマ区切り） */
  ALLOWED_CALLBACK_ORIGINS?: string;
}
