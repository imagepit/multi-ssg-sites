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
  X_CLIENT_ID?: string;
  X_CLIENT_SECRET?: string;
  X_CALLBACK_URL?: string;
  X_API_MOCK_MODE?: string;
  DB?: D1Database;
  PAID_CONTENT?: R2Bucket;
  EVENTS_QUEUE?: Queue;
  X_OAUTH_STATE?: KVNamespace;
}
