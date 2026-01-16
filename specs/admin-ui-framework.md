---
title: admin UI フレームワーク方針（React/Next.js）
description: admin UI を React/Next.js に寄せる場合の方針と判断根拠
---

# admin UI フレームワーク方針（React/Next.js）

## 背景
- 新アーキテクチャでは admin UI を Cloudflare Pages 上で配信する。
- バックエンドは admin app（Worker）で統合提供し、admin UI は HTTP API を呼び出す。

## 目的
- admin UI の拡張性（認証、RBAC、ダッシュボード等）を確保する。
- 既存の Next.js ベース資産と開発体験を揃える。
- Cloudflare Pages での運用コストを最小化する。

## 前提・制約
- Cloudflare Pages での運用が前提（Node 実行環境に依存しない構成が望ましい）。
- admin app で認証・認可を担保し、admin UI 側はクライアントから API 呼び出しを行う。
- CORS/Origin allowlist は admin app 側で管理する。
- admin UI の公開は Cloudflare Access（Zero Trust）で入口を制限する。

## 評価軸
- 配信方式の互換性（Pages での静的配信のしやすさ）
- 運用コストと将来の拡張性
- 開発体験（ルーティング、型、UI の再利用性）
- ドキュメントテーマ（Next.js）との技術的整合性

## 選択肢
### A. Next.js App Router + Static Export（推奨）
- Pages へ静的成果物を配信する前提で `output: 'export'` を採用。
- 画面はクライアントで admin app API を呼び出す（SSR/API Routes は使わない）。
- Next.js のルーティング/レイアウト/メタ情報を活用できる。

### B. Next.js App Router + Edge Runtime（next-on-pages など）
- SSR/Edge Functions を使う構成。
- 将来の要件（Server Actions 等）が必要な場合の拡張案。
- 現状は運用複雑性が上がるため、初期段階では採用しない。

### C. React SPA（Vite）
- 構成は軽いが、Next.js 資産との整合性が弱い。
- 今回は「React/Next.js に寄せる」方針のため優先度低。

## 決定
admin UI は **Next.js App Router + Static Export** を採用する。

### 決定理由
- Cloudflare Pages での静的配信に最適化できる。
- admin UI は API 呼び出し中心のため SSR は不要。
- 既存の Next.js 運用知見と共通化できる。
- 将来的に必要なら Edge Runtime へ段階移行が可能。

## 実装方針（初期）
- `admin-ui/` を Next.js プロジェクトとして構成。
- ビルドは `next build` + `next export`（または `output: 'export'`）。
- API 呼び出しはクライアント限定で実行し、`NEXT_PUBLIC_ADMIN_APP_BASE_URL` を使用する。
- 認証は admin app で完結（admin UI はトークン管理のみ）。
- Cloudflare Access で admin ドメインを保護（SSO/メールワンタイム等でアクセス制御）。

## 次アクション
- `admin-ui` の Next.js 化（ディレクトリ移行、ルーティング設計）。
- `ADMIN_APP_BASE_URL` を `NEXT_PUBLIC_ADMIN_APP_BASE_URL` へ統一（必要なら .env.example を更新）。
