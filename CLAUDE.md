# AGENTS.md

## 1. プロジェクト概要

マルチサイト/マルチテーマ対応の技術ドキュメンテーション基盤を構築するプロジェクトです。admin app（Cloudflare Workers）と admin UI（Cloudflare Pages）を中心に、管理/計測/有料コンテンツ配信を統合します。

## 2. 技術スタック

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Testing**: Vitest
- **Architecture**: DDD + Clean Architecture
- **Deploy**: Wrangler

## 3. アーキテクチャ

**4層構成（Clean Architecture）:**
依存関係は必ず内側（Domain）に向かいます。

1. **Presentation** (`src/presentation/`): HTTP/Queue/Scheduled の入口
2. **Application** (`src/application/`): ユースケース、ワークフロー
3. **Domain** (`src/domain/`): ビジネスロジック、エンティティ（外部依存なし）
4. **Infrastructure** (`src/infrastructure/`): データ永続化、外部API

## 4. 開発原則

### 1. テスト駆動開発 (TDD)
**RED (テスト作成) → GREEN (実装) → REFACTOR** のサイクルを厳守する。
実装後の `pnpm type-check` と `pnpm test` は必須。

### 2. 責務分離 (SRP)
全てのクラス・関数は単一の責務を持つ。
ビジネスロジックは Domain 層に集約し、UI/Infrastructure に漏れ出さないようにする。

### 3. オープン・クローズドの原則
UIや機能を大幅に変更する場合は、既存コードを直接変更せず、
新しい実装を追加して差し替える。

## 5. 開発時のチェックポイント

`admin/` ディレクトリで以下を実行する。

```bash
pnpm type-check
pnpm test
```

## 6. チェックリスト

- [ ] 既存コードを破壊せず、必要な拡張で差し替えているか
- [ ] SRPが守られているか
- [ ] テストを先に書き、全て通っているか
- [ ] 型エラーがないか
- [ ] ビジネスロジックは Domain 層にあるか

## 7. 関連ドキュメント

- 設計書: `specs/new-architecture.md`
- タスク: `specs/tasks.md`
- 要件: `specs/requirements.md`
