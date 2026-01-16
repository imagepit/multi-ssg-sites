---
title: 新アーキテクチャ要件・機能整理
description: マルチサイト/マルチテーマ/有料コンテンツ対応の要件と管理方針
---

# 新アーキテクチャ要件・機能整理

## 目的

- マルチサイト/マルチテーマの運用を標準化し、追加・変更コストを最小化する。
- admin app（Worker）に管理機能を集約し、admin UI（Pages）で運用・可視化する。
- 有料コンテンツと計測（page_view）の拡張に耐える基盤を用意する。

## スコープ

- 対象: `contents/*` の各サイト、テーマ群、admin app、admin UI、共有型・ツール。
- 非対象: 既存のVPS配信の詳細運用（移行後に段階的整理）。

## 主要コンポーネント

- **sites**: `contents/<siteId>/` に配置されるサイトコンテンツ。
- **themes**: 共有テーマライブラリ（新構成は `themes/` 配下。現在は `theme/` を段階移行）。
- **admin app（Worker）**: API/認証/計測/有料配信の中核。
- **admin UI（Pages）**: 管理画面。静的配信 + クライアントAPI呼び出し。
- **shared**: 共通型/ビルドツール/ユーティリティ。

## 機能要件（MVP優先）

### 1) マルチサイト管理

- サイトの作成/更新/無効化/一覧。
- ドメイン（公開URL）と `siteId` の紐付け管理。
- `siteId` は `contents/<siteId>/` と一致させる。

### 2) ページメタ管理

- `pages_meta` の登録/更新/一覧（slug, path, tags, status, priority）。
- サイト単位の絞り込みと管理。

### 3) テーマ管理（管理方式の明確化）

- テーマの登録/更新/無効化/一覧（id, name, version, status）。
- サイトとテーマの関連付け（site → theme）。
- テーマ設定（themeConfig）の管理と上書き方針。

### 4) admin UI

- Cloudflare Pages で静的配信する。
- admin app を呼び出す API クライアントを標準化。
- 入口は Cloudflare Access（Zero Trust）でアクセス制御する。
- 画面は「サイト管理」「計測ダッシュボード」を最小構成で用意。
- テーマ管理 UI は MVP 対象外（必要に応じて後続フェーズで追加）。

### 5) 認証/認可

- admin app 側で JWT 検証と RBAC を実装。
- admin UI はトークン管理のみ（Cookie/SSOは admin app で完結）。
- CORS/Origin allowlist は admin app 側で管理。

### 6) 計測（page_view）

- `/events/page_view` でイベント受信。
- Queue へエンキュー → 時次/日次ロールアップ。

### 7) 有料コンテンツ（段階導入）

- まずはアセット保護（R2 + 権限チェック + 署名URL/プロキシ）。
- 本文抽出は後続フェーズで実施。

## テーマ管理の詳細方針

### テーマのリソース管理

- テーマは `themes/<themeId>/` を基本とし、`theme-registry` で参照する。
- テーマの静的リソース（CSS/フォント/画像）はテーマ内に含め、ビルド時に取り込む。
- ランタイム配信が必要な場合は、`/theme.css?site=...` 形式で admin app から配信できる構成を想定（将来拡張）。

### テーマ設定（themeConfig）

- テーマごとに `defaultConfig` を持ち、サイト別に差分を上書きする。
- admin UI での編集は後続フェーズで追加し、MVP では構成ファイル/ビルド時指定を優先する。
- D1 には `site_id`, `theme_id`, `config_json` を保存する（UI追加時の前提）。
- ビルド時に admin app から設定を取得し、テーマへ注入する。

### 適用方式

- **A: ビルド時埋め込み（MVP）**
  - 管理コストが低く、Pages 静的配信と相性が良い。
- **B: ランタイム配信（拡張）**
  - 即時反映が必要な場合に採用。
  - admin app で CSS/JSON を配信する仕組みを追加。

## 非機能要件

- **セキュリティ**: Cloudflare Access で admin UI を制限、JWT + RBAC、Origin 検証。
- **可用性**: Pages + Workers の標準SLAを前提、D1/R2 バックアップ方針を用意。
- **性能**: admin UI は静的配信、API はバリデーション/レート制限を最低限実装。
- **監査性**: 重要操作の監査ログを残す（MVP以降）。

## データモデル（最小）

- `sites`: id, name, domain, status, theme_id
- `pages_meta`: id, site_id, path, slug, tags, status, priority
- `themes`: id, name, version, status, config_schema
- `theme_configs`: site_id, theme_id, config_json
- `users`, `roles`, `entitlements`
- `page_views_hourly`, `page_views_daily`

## 環境変数（概要）

- `ADMIN_APP_BASE_URL` / `NEXT_PUBLIC_ADMIN_APP_BASE_URL`
- `ADMIN_ALLOWED_ORIGINS`
- `ADMIN_JWT_SECRET`, `ADMIN_MAGIC_LINK_SECRET`
- D1/R2/Queue bindings（`DB`, `PAID_CONTENT`, `EVENTS_QUEUE` など）

## フェーズ

- **Phase 1（MVP）**: サイト管理、page_view計測、静的admin UI（テーマ管理UIは対象外）。
- **Phase 2**: 有料アセット保護、RBAC強化、監査ログ、テーマ管理UI（必要なら追加）。
- **Phase 3**: 有料本文抽出、Stripe連携、テーマのランタイム配信。

## 未決事項

- テーマ配信方式を A/B どちらに寄せるかの最終決定（MVPはA）。
- `themes/` への移行スケジュール（現状 `theme/` との整合）。
