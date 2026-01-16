export interface Env {
  ENV?: string;
  ADMIN_ALLOWED_ORIGINS?: string;
  ADMIN_API_KEY?: string;
  ADMIN_JWT_SECRET?: string;
  ADMIN_MAGIC_LINK_SECRET?: string;
  ADMIN_EMAIL_FROM?: string;
  DB?: D1Database;
  PAID_CONTENT?: R2Bucket;
  EVENTS_QUEUE?: Queue;
}
