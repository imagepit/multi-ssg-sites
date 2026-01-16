---
title: README（Webサイト管理プラットフォーム）
---

# Webサイト管理プラットフォーム

## 概要

イメージピット株式会社のIT研修事業およびITソリューション事業のブランディング・プロモーションを目的として、技術ドキュメンテーションサイト、個人ブログ、IT・DX系メディアを効率的に構築・配信するための統合プラットフォームです。技術コンテンツの一元管理により、事業の認知度向上と顧客獲得を支援します。

## 主要機能

- コンテンツ生成ワークフロー
- コンテンツ配信
- 有料コンテンツ管理
- Webサイト管理

## コンテンツ生成ワークフロー

このプラットフォームは次のワークフローで効率のいいPDCAサイクルを回すことが可能です。

1. キーワードリサーチ
2. サイトの要件定義
3. サイトの設計
4. サイトコンテンツの制作
5. サイトの公開
6. コンテンツの有料配信・課金管理
7. 効果測定

### スラッシュコマンド一覧

Claude Codeによるスラッシュコマンドにて次のタスクをAIエージェントに任せることが可能です。

| コマンド                            | 用途                           | 使用タイミング                         |
| ------------------------------- | ---------------------------- | ------------------------------- |
| `/tec-research [技術キーワード]`       | 技術ドキュメンテーション需要分析と技術キーワードID生成 | ドキュメンテーションサイト開発開始時 or リサーチ結果反映後 |
| `/tec-init [技術キーワードID]`         | リサーチ結果からサイト仕様構造を初期化          | リサーチ結果反映後                       |
| `/tec-requirements [技術キーワードID]` | ドキュメンテーションサイト要件定義書の生成        | 仕様初期化後                          |
| `/tec-design [技術キーワードID]`       | WordPress技術設計書の生成            | 要件承認後                           |
| `/tec-tasks [技術キーワードID]`        | サイト制作タスクの生成                  | 設計承認後                           |

### 使用方法

#### 1. リサーチの実施

技術キーワードから直接リサーチを開始します。

_Claude Codeでコマンド実行_
```bash
/tec-research LangChain RAG 検索拡張生成
```

##### 使用例

- `LangChain RAG 検索拡張生成` → 技術キーワードID: `langchain-rag`
- `Next.js TypeScript` → 技術キーワードID: `nextjs-typescript`
- `Docker Kubernetes` → 技術キーワードID: `docker-kubernetes`
- `React Hooks useState` → 技術キーワードID: `react-hooks-usestate`

#### 2. プロジェクトの初期化

生成された技術キーワードIDからサイト仕様を初期化：

```bash
/tec-init langchain-rag
```

**注**: 自動的にproposal.mdの内容を読み込んで、市場ニーズ・技術需要に合致した内容を設計します。

#### 3. 要件定義の生成

技術キーワードIDを使用（リサーチ結果を反映）：

```
/tec-requirements langchain-rag
```

#### 4. 設計書の生成（対話式承認）

要件をレビュー後、コンテンツ設計フェーズに進行：

```
/tec-design langchain-rag
```

#### 5. タスクの生成（対話式承認）

設計をレビュー後、サイト制作タスク生成に進行：

```
/tec-tasks langchain-rag
```

#### 6. 進捗確認

仕様制作完了後の進捗確認:

```
/tec-status langchain-rag
```

#### 7. 品質チェック（開発完了後）

```
/tec-status langchain-rag
```

### プロジェクト構造（コンテンツ生成ワークフロー部分）

```
.
├── .claude/
│       └── commands/ # スラッシュコマンド定義
│           ├── tec-init.md # 技術ドキュメンテーションサイト開発コマンド
│           ├── tec-requirements.md
│           ├── tec-design.md
│           ├── tec-tasks.md
│           ├── tec-status.md
│           └── tec-report.md
├── contents/                    # サイトコンテンツ（各サイト独立リポジトリ）
│   ├── v0/                    # v0サイト（GitHubリポジトリとして独立）
│   │   ├── .git/
│   │   ├── index.md
│   │   ├── contents/
│   │   │   ├── getting-started/
│   │   │   ├── components/
│   │   │   └── ...
│   │   ├── specs/
│   │   │   ├── spec.json
│   │   │   └── requirement.md
│   │   ├── docs.config.ts     # サイト固有設定
│   │   └── README.md
│   ├── nextjs/               # Next.jsサイト
│   ├── cloudflare/           # Cloudflareサイト
│   └── [site-id]/            # 各サイト
│
└── README.md
```

### スラッシュコマンドの変換

Claude CodeのスラッシュコマンドをGemini CLIのスラッシュコマンドに変換できます。

```bash
agent-slash-sync --convert c2g --claude-dir .claude --gemini-dir .gemini
```

## コンテンツ配信

`theme`のテーマから`contents/[site-id]`のサイトを次のプラットフォームで配信します。

- Cloudflare Pages
- Cloudflare R2オブジェクトストレージ（画像や検索インデックス）

### 開発サーバー起動

次のコマンドを実行することで、サイト毎の開発サーバーを起動することができ、ローカルでWebサイトの動作確認を行うことができます。

_コマンド実行（旧形式）_
```bash
./dev.sh [site-id]
```

_コマンド実行（新形式）_
```bash
pnpm exec techdoc dev v0 --theme fumadocs --production
```

### Webサイトのデプロイ

次のコマンドを実行することで、WebサイトをCloudflare環境（Pages、R2）にデプロイして公開することができます。

_コマンド実行（旧形式）_
```bash
./deploy [site-id]
```

_コマンド実行（新形式）_
```bash
pnpm exec techdoc deploy v0 --theme fumadocs --production
```

## Webサイト管理プラットフォーム

Webサイト管理プラットフォームにて自社で制作したWebサイトを一元管理し、有料コンテンツ管理やユーザー管理、アクセス制御の管理を行います。

### 機能

- **Webサイト管理** : 公開しているWebサイトの一元管理
- **有料コンテンツ管理** : 有料で提供するコンテンツを管理し、有料コンテンツ毎の料金や決済、購入履歴などを管理
- **ユーザー管理** : システム管理者や演習者、有料コンテンツ購入者を管理
- **アクセス制御** : ユーザーの権限毎にアクセスを制御
- **アクセス解析**: アクセスを解析する

### 技術仕様

- Next.js
- Claudflare Page、R1

### 設計

- 有料コンテンツ管理の設計は[specs/mdx-paid-content.md](specs/mdx-paid-content.md)を参照

