---
title: タスクリスト
description: マルチサイト・マルチテーマ・有料コンテンツ対応（Cloudflare Pages + admin app（Worker） + admin UI（Pages））
---

# タスクリスト

本タスクは `specs/new-architecture.md` の方針に基づき、**admin app（Worker）を1つに統合**しつつ、**admin UI（Pages）**で運用/可視化するための実装計画。

## 0. 前提決め（最初に確定）

- [x] 管理ドメイン設計を確定
  - admin UI（Pages）: `admin.dx-pit.net`
  - admin app（Worker）: `admin-api.dx-pit.net`
- [x] sites公開ドメイン方針を確定
  - 各サイトはサイトごとに別ドメインで公開（Cloudflare Pagesのカスタムドメイン割当）
- [x] マルチサイト識別の方針を確定（両方）
  - クライアントは `siteId` を明示して送る（例: `page_view.siteId`）
  - admin app（Worker）は `Origin`（ブラウザ）/必要に応じて `Host` と照合し、許可されたsiteのみ受理する（なりすまし防止）
  - `siteId` の決め方: `contents/<siteId>/` のディレクトリ名、または `docs.config.ts` の `siteId` からビルド時に確定して埋め込む
- [x] 計測イベント仕様を確定（`page_view` のpayload、匿名ID方針、重複排除方針）
  - `page_view`（MVP必須）
    - 送信先（例）: `POST https://admin-api.dx-pit.net/events/page_view`
    - クライアント送信payload（例）
      - `event`: `"page_view"`（固定）
      - `siteId`: `"<siteId>"`（ビルド時に確定して埋め込み。`contents/<siteId>/` または `docs.config.ts`）
      - `path`: `"/..."`（正規化パス。**クエリ/ハッシュ/utm等は含めない**）
      - `referrer`: `document.referrer`（任意/空可）
      - `ts`: `Date.now()`（ms）
      - `anonId`: `"<uuid>"`（匿名ID。下記）
      - `sessionId`: `"<uuid>"`（セッションID。下記）
    - サーバ（admin app）で決定/検証すること
      - `Origin` と `siteId` の整合性チェック（D1のallowlistに含まれるoriginのみ受理）
      - 極端な時刻（未来/過去）や不正payloadは破棄
  - 匿名ID方針（Cookie/SSOなし）
    - `anonId`: 初回に `crypto.randomUUID()` で生成し `localStorage["tp_anon_id"]` に保存（ドメイン単位）
    - `sessionId`: タブ/セッション単位で `sessionStorage["tp_sess_id"]` を使用
  - 重複排除方針（MVP）
    - クライアント側で抑制: 同一 `sessionId` で同一 `path` の連続送信は 30〜60秒は送らない（デバウンス）
    - SPAの場合は「ルート遷移時のみ」送信（スクロール等では送らない）
- [x] 有料コンテンツの保護単位を確定（本文/アセット両方 + MDX抽出あり）
  - 本文: 1ページ内で「無料＋有料」を混在させるため、**MDX抽出あり**で実装
    - ビルド時に `[premium]...[/premium]` を検出して有料本文を抽出
    - 抽出した有料本文はR2へ保存（キー例: `paid/<siteId>/<contentId>/<hash>.json`）
    - SSG出力（HTML）には有料部分を含めず、プレースホルダ（購入/ログイン導線）を出力
    - 閲覧時に admin app（Worker）が権限チェックし、有料本文を返す（または署名URLで取得）
  - アセット: R2に格納し、admin app（Worker）で権限チェック→署名URL or プロキシ配信
  - 注意: URLを知ればHTMLが見える問題を避けるため、**有料本文をHTMLに含めない**ことを最優先にする
- [x] 決済のスコープを確定（MVPはentitlement手動付与 + マジックリンク認証、Stripeは後回し）
  - MVPの到達点: 「購入済み（=entitlementあり）のユーザーだけが有料本文/有料アセットを閲覧できる」を成立させる
  - 決済（Stripe）を後回しにして、まずは admin UI（Pages）から権限を手動付与/剥奪できるようにする
  - データモデル（最小）
    - `users`: `id`, `email`, `status`, `created_at`
    - `products`: `id(slug)`, `name`, `site_id`, `status`
    - `entitlements`: `user_id`, `product_id`, `site_id`, `status(active/revoked)`, `granted_by`, `granted_at`, `expires_at?`
  - マジックリンク認証（Cookie/SSOなし）
    - `POST /auth/request_link`（メール送信: ワンタイムリンク発行）
    - `GET /auth/verify?token=...`（検証→短寿命JWTを発行）
    - 有料取得APIは `Authorization: Bearer <jwt>` を前提に権限チェック
  - Stripe導入時の移行方針
    - Webhookで `entitlements` を自動更新するだけにして、手動付与UIは例外運用として残す
- [x] 認証前提（Cookie/SSO）を確定
  - Cookie跨ぎは不要（トークン運用で開始）
- [x] CORS許可方式を確定
  - admin app（Worker）側で固定allowlist（D1で管理）を採用（sites登録ドメインのみ許可）

## 1. リポジトリ/ディレクトリ整備（設計をコード化する準備）

- [x] `techdoc/admin/`（admin app（Worker））の雛形を作る（TypeScript + wrangler）
  - [x] `src/http/routes` / `src/http/middleware` の骨格
  - [x] `src/domains` / `src/integrations` / `src/queue` / `src/scheduled` の骨格
- [x] `techdoc/admin-ui/`（admin UI（Pages））の雛形を作る（フロントエンド）
  - [x] `ADMIN_APP_BASE_URL` を参照してAPIを呼ぶクライアントを用意
- [x] `shared/types` に共通型を追加（site/page/theme/entitlement/event）
- [x] `.env.example`（またはドキュメント）に必要な環境変数一覧をまとめる

## 2. Cloudflareリソースの準備（最小構成）

- [x] D1作成（dev/stg/prod）: sites/pages_meta/themes/users/roles/entitlements/rollups
- [x] R2作成（dev/stg/prod）: 有料アセット/抽出本文の格納
- [x] Queues作成（dev/stg/prod）: `events`（page_view等）
- [x] admin app（Worker）にbindingsを設定（D1/R2/Queues/Secrets）
- [x] Cron Triggers（時次/日次）を設定

## 3. 認証/認可（MVP）

- [x] admin appに認証方式を実装（例: JWT/Session/Basicでも可：MVP優先で決定）
- [x] RBAC（roles: admin/editor/viewer）を実装
- [x] すべての管理APIで `site_id` スコープの権限チェックを徹底
- [x] 監査ログ（最低限: 重要更新の記録）を用意

## 4. マルチサイト管理（MVP）

- [x] `sites` 管理API（作成/更新/一覧/無効化）
- [x] `sites` 読み取りAPI（一覧）を追加
- [x] `pages_meta` 管理API（slug/path、公開状態、タグ、優先度、サイト紐づけ）
- [x] `pages_meta` 読み取りAPI（一覧）を追加
- [x] hostname→site_id の解決（Hostヘッダから引けるようにする）
- [x] admin UI: サイト切替（site picker）+ サイト一覧/詳細

## 4.1 npx CLI（プレビュー/ビルド/デプロイ）

- [x] `npx techdoc dev <siteId> --theme <themeId>` を実装（既存 `./dev.sh` 相当）
- [x] `npx techdoc build <siteId> --theme <themeId>` を実装（SSG export）
- [x] `npx techdoc deploy <siteId> --theme <themeId> --production` を実装（Pages deploy）
- [ ] `dev.sh` / `deploy.sh` との互換方針を整理（段階的移行）

### 4.1.1 R2アセット差分同期

- [x] `next-image-export-optimizer` 生成物をR2へ差分同期（`aws s3 sync --size-only`）
- [x] アップロード先を差し替え可能な構成（Domain interface + Infrastructure実装）
- [x] `npx techdoc deploy` に組み込み（build → sync assets → pages deploy）

### 4.1.2 検索インデックス外部化（Pages 25MiB制限回避）

- [x] 検索インデックスをR2へ同期し、`NEXT_PUBLIC_SEARCH_INDEX_BASE_URL`/`R2_PUBLIC_BASE_URL`で参照切替
- [x] Pages出力から大型 `search-indexes/*.json` を除外
- [x] R2公開ドメインにCORS許可（Pages/カスタムドメインからの取得を許容）

## 5. 計測パイプライン（MVP：page_view）

- [ ] クライアント計測スクリプト（全サイト共通）を用意
  - [ ] 送信先: admin appの `/events/page_view`（例）
  - [ ] payload: `site_id(or host)`, `path`, `referrer`, `ua`, `ts`, `anon_id`
- [ ] admin app: ingest endpoint 実装（バリデーション、レート制限の最低限）
- [ ] admin app: Queueへのenqueue実装
- [ ] admin app: Queue consumer実装（ロールアップに集計）
  - [ ] `page_views_hourly` / `page_views_daily` をD1に更新
- [ ] admin UI: ダッシュボード（PVランキング、日次推移、サイト別/ページ別フィルタ）

## 6. テーマ管理（MVP〜）

- [ ] `themes` 管理API（トークン/設定のCRUD）
- [ ] テーマのサイト紐づけ（site→theme）
- [ ] 反映方式を実装
  - [ ] A: ビルド時にテーマを取得してSSGへ埋め込む
  - [ ] B: ランタイムで `/theme.css?site=...` を取得（即時反映）
- [ ] admin UI のテーマ管理は後続フェーズで対応（MVP対象外）

## 7. 有料コンテンツ（段階導入）

### 7-1. まずはアセット保護（推奨の最短）

- [ ] `entitlements` のデータモデル確定（user × product × scope）
- [ ] admin app: 有料アセット配信用エンドポイント（権限チェック→R2署名URL/プロキシ）
- [ ] admin UI: entitlement付与/剥奪（MVPは手動運用でも可）

### 7-2. Stripe連携（必要なら）

- [ ] Stripe商品/価格設計
- [ ] admin app: Stripe webhook（購読開始/更新/解約→entitlements更新）
- [ ] 失敗時の再送/冪等性（event idで二重反映防止）

### 7-3. 本文の有料化（必要なら）

- [ ] MDXの `[premium]...[/premium]` 抽出パイプライン実装（ビルド時）
- [ ] 抽出本文をR2へ保存、SSG出力はプレースホルダ化
- [ ] admin app: 本文取得API（権限チェック）
- [ ] admin UI: 有料本文の確認/差し替え/削除（運用要件に合わせる）

## 8. CI/CD（運用に耐える形）

- [ ] GitHub Actions: サイトビルド→Pagesデプロイを標準化
- [ ] admin app: デプロイ（wrangler deploy）をdev/stg/prodで分離
- [ ] admin UI: Pagesデプロイをdev/stg/prodで分離
- [ ] Secrets管理（Cloudflare/Actions）を整理（キー一覧/ローテーション手順）

## 9. 監視/運用（最低限）

- [ ] admin app: エラーログ/メトリクスの方針を決めて実装（最低限: 重要エラー把握）
- [ ] Queues遅延/失敗時のアラート方針
- [ ] D1バックアップ/移行手順（スキーマ変更含む）

## 10. リリース手順（チェックリスト）

- [ ] 重要ドメイン/ルーティング（CORS含む）確認
- [ ] マルチサイト権限事故のテスト（他site_idが見えないこと）
- [ ] 有料アセットの漏洩テスト（未購読で取れないこと）
- [ ] 計測の二重送信/過剰送信の確認
