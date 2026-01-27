/**
 * APIキー認証ミドルウェア
 * 内部API（/send など）へのアクセスを制限するために使用
 */

import { createMiddleware } from 'hono/factory';
import type { Env } from '../types';

/**
 * X-API-Key ヘッダーを検証するミドルウェア
 * INTERNAL_API_KEY 環境変数と照合する
 */
export const apiKeyAuth = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const apiKey = c.req.header('X-API-Key');
  const expectedKey = c.env.INTERNAL_API_KEY;

  // INTERNAL_API_KEY が設定されていない場合は認証をスキップ（開発環境用）
  if (!expectedKey) {
    console.warn('INTERNAL_API_KEY is not set, skipping API key authentication');
    await next();
    return;
  }

  if (!apiKey || apiKey !== expectedKey) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized: Invalid or missing API key',
      },
      401
    );
  }

  await next();
});
