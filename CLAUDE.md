# CLAUDE.md

## 1. プロジェクト概要

マルチサイト/マルチテーマ対応の技術ドキュメンテーション基盤を構築するプロジェクトです。admin app（Cloudflare Workers）と admin UI（Cloudflare Pages）を中心に、管理/計測/有料コンテンツ配信を統合します。

## 2. プロジェクト構成

```
techdoc/
├── admin/           # 統合管理API（Cloudflare Workers）
├── admin-ui/        # 管理UI（Next.js / Cloudflare Pages）
├── shared/          # 共有パッケージ
│   ├── auth/        # @techdoc/auth - 認証
│   ├── paid/        # @techdoc/paid - 有料コンテンツ
│   ├── contact-form/# @techdoc/contact-form - お問い合わせ
│   └── fumadocs-engine/ # @techdoc/fumadocs-engine - MDX拡張
├── theme/           # マルチテーマ実装
│   ├── fumadocs/    # 標準ドキュメントテーマ
│   ├── dx-media/    # DX Mediaテーマ（開発・動作確認用）
│   └── tech-blog/   # ブログテーマ
├── contents/        # サイトコンテンツ（27サイト）
├── scripts/         # 統合CLIツール
├── mail-api/        # メール送信API（Hono / Pages）
└── images/          # 共有画像リソース
```

## 3. 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 16 / React 19 / Fumadocs UI / Tailwind CSS |
| バックエンド | Cloudflare Workers (TypeScript) |
| データベース | Cloudflare D1 (SQLite) |
| ストレージ | Cloudflare R2 |
| 決済 | Stripe |
| テスト | Vitest |

## 4. サブプロジェクト詳細

### admin/ - 統合管理API
**4層 Clean Architecture:**
- `src/presentation/`: HTTP/Queue/Scheduled の入口
- `src/application/`: ユースケース、ワークフロー
- `src/domain/`: ビジネスロジック（外部依存なし）
- `src/infrastructure/`: D1/R2/Stripe連携

```bash
cd admin && pnpm type-check && pnpm test
```

### shared/ - 共有パッケージ
| パッケージ | 用途 |
|-----------|------|
| `@techdoc/auth` | 認証Context・Hooks・API |
| `@techdoc/paid` | 有料コンテンツHooks・API |
| `@techdoc/contact-form` | お問い合わせフォームコンポーネント |
| `@techdoc/fumadocs-engine` | MDXプラグイン・サイト設定読み込み |

### theme/ - テーマ実装
各テーマは独立したNext.jsプロジェクト。`SITE_ID`環境変数でビルド対象サイトを指定。

```bash
# 開発
cd theme/dx-media && SITE_ID=dx-media pnpm dev

# ビルド
SITE_ID=dx-media pnpm build
```

### contents/ - サイトコンテンツ
各サイトは `specs/spec.json` で設定（テーマ、色、フォント）と `contents/` にMDXファイルを配置。

## 5. 開発原則

### 1. テスト駆動開発 (TDD)
**RED → GREEN → REFACTOR** のサイクルを厳守。
実装後の `pnpm type-check` と `pnpm test` は必須。

### 2. 責務分離 (SRP)
全てのクラス・関数は単一の責務を持つ。
ビジネスロジックは Domain 層に集約し、UI/Infrastructure に漏れ出さないようにする。

### 3. オープン・クローズドの原則
UIや機能を大幅に変更する場合は、既存コードを直接変更せず、
新しい実装を追加して差し替える。

## 6. 重要な実装ルール

### shared パッケージの開発フロー
共有UI・ロジックを開発する際は、**dx-media テーマで動作確認**を行う。
dx-media は全sharedパッケージを使用しており、開発・テストに最適。

```bash
# 1. shared/xxx を実装
# 2. dx-mediaで動作確認
cd theme/dx-media && SITE_ID=dx-media pnpm dev
```

### インポート時の拡張子ルール（重要）
**Next.js環境ではTypeScriptソースを直接インポートするため、`.js`拡張子は不要。**

```typescript
// ✅ 正しい
import { AuthProvider } from '@techdoc/auth'
import { usePurchaseComplete } from '@techdoc/paid'
import { ContactFormModal } from '@techdoc/contact-form'

// ❌ 間違い（.js拡張子は付けない）
import { AuthProvider } from '@techdoc/auth/index.js'
```

サブパスインポートも同様:
```typescript
// ✅ 正しい
import { validateRedirectUrl } from '@techdoc/auth/lib/redirect'
import { usePaidContent } from '@techdoc/paid/hooks'

// ❌ 間違い
import { validateRedirectUrl } from '@techdoc/auth/lib/redirect.js'
```

### パッケージ間の依存関係
```
theme/*
  └── @techdoc/auth, @techdoc/paid, @techdoc/contact-form, @techdoc/fumadocs-engine

@techdoc/paid
  └── @techdoc/auth（依存）

@techdoc/fumadocs-engine
  └── fumadocs-core, fumadocs-mdx（peer依存）
```

## 7. チェックリスト

- [ ] 既存コードを破壊せず、必要な拡張で差し替えているか
- [ ] SRPが守られているか
- [ ] テストを先に書き、全て通っているか
- [ ] 型エラーがないか
- [ ] ビジネスロジックは Domain 層にあるか
- [ ] sharedパッケージのインポートに`.js`拡張子を付けていないか

## 8. 関連ドキュメント

- 設計書: `specs/new-architecture.md`
- タスク: `specs/tasks.md`
- 要件: `specs/requirements.md`
