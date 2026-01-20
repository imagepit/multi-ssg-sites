/**
 * メール送信API
 * Cloudflare Pages Functions + Hono
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import type { Env } from './types';
import { createMailProvider } from './providers';

const app = new Hono<{ Bindings: Env }>();

// リクエストバリデーションスキーマ
const contactSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(100, '名前は100文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  subject: z
    .string()
    .min(1, '件名を入力してください')
    .max(200, '件名は200文字以内で入力してください'),
  body: z
    .string()
    .min(1, 'お問い合わせ内容を入力してください')
    .max(5000, 'お問い合わせ内容は5000文字以内で入力してください'),
  siteName: z.string().optional(),
});

// CORS設定
app.use('*', async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || [];

  const corsMiddleware = cors({
    origin: (origin) => {
      // 開発環境用
      if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
        return origin;
      }
      // 許可されたオリジン
      if (allowedOrigins.includes(origin || '')) {
        return origin;
      }
      // ワイルドカード対応（*.example.comなど）
      for (const allowed of allowedOrigins) {
        if (allowed.startsWith('*.')) {
          const domain = allowed.slice(2);
          if (origin?.endsWith(domain)) {
            return origin;
          }
        }
      }
      return null;
    },
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  });

  return corsMiddleware(c, next);
});

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// お問い合わせAPI
app.post('/contact', async (c) => {
  try {
    const body = await c.req.json();

    // バリデーション
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const error of result.error.errors) {
        const path = error.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(error.message);
      }
      return c.json(
        {
          success: false,
          message: '入力内容に誤りがあります',
          errors,
        },
        400
      );
    }

    const { name, email, subject, body: messageBody, siteName } = result.data;

    // メール送信
    const mailProvider = createMailProvider(c.env);
    const sendResult = await mailProvider.send({
      fromName: name,
      fromEmail: email,
      subject,
      body: messageBody,
      siteName,
    });

    if (!sendResult.success) {
      console.error(`Mail send failed (${mailProvider.name}):`, sendResult.error);
      return c.json(
        {
          success: false,
          message: 'メールの送信に失敗しました。しばらく経ってから再度お試しください。',
        },
        500
      );
    }

    return c.json({
      success: true,
      message: 'お問い合わせを受け付けました。ご連絡ありがとうございます。',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return c.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました。しばらく経ってから再度お試しください。',
      },
      500
    );
  }
});

export default app;
