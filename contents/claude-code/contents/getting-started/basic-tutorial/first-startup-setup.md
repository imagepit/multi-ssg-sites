---
title: 初回起動と最初のプロジェクト作成
slug: first-startup-setup
parent: basic-tutorial
status: published
filepath: contents/getting-started/basic-tutorial/first-startup-setup.md
post_type: pages
goal: Claude Codeの初回起動時の設定を適切に行い、スムーズに利用開始できるようにする
seo_title: Claude Code初回起動設定 | 最初のプロジェクト作成ガイド
seo_description: Claude Code初回起動時の詳細設定手順と最初のプロジェクト作成方法。プロジェクト設定からワークスペース設定、基本設定の最適化まで、効果的な利用のための初期設定ガイドです。
seo_keywords: Claude Code 初回起動, 初期設定, セットアップ, プロジェクト設定, 最初のプロジェクト
handson_overview: 初回起動からプロジェクト設定、最初のプロジェクト作成までの実際の操作
---

# 初回起動と最初のプロジェクト作成

このガイドでは、Claude Codeを初めて起動する際の設定手順と、最初のプロジェクトを作成する方法を詳しく解説します。インストールと認証設定が完了した方を対象に、スムーズに開発を始められるように支援します。

:::note このガイドで学べること

- Claude Codeの初回起動時の初期設定
- プロジェクトワークスペースの作成と設定
- 最初のプロジェクトの作成手順
- 基本的な開発環境の構築
- 効率的なワークフローの確立

:::

## 初回起動の準備

### 前提条件の確認

初回起動を始める前に、以下の準備が完了している必要があります。

- ✅ Claude Codeのインストール完了
- ✅ Anthropicアカウントの作成
- ✅ APIキーの取得
- ✅ 認証設定の完了
- ✅ 基本的なコマンドライン操作の理解

### 作業環境の準備

:::step

1. 作業ディレクトリの作成

開発用の作業ディレクトリを作成します。

_コマンド実行_
```bash
# ホームディレクトリに移動
cd ~

# 開発用ディレクトリの作成
mkdir development
cd development

# Claude Code用のディレクトリ作成
mkdir claude-projects
cd claude-projects
```

2. 環境の確認

必要なツールがインストールされているか確認します。

_コマンド実行_
```bash
# Node.jsの確認
node --version
npm --version

# Gitの確認
git --version

# Claude Codeの確認
claude --version
```

:::

## 初回起動と基本設定

### Claude Codeの初期化

:::step

1. Claude Codeの初期化

Claude Codeを初期化して、対話形式で設定を行います。

_コマンド実行_
```bash
claude init
```

2. 設定プロンプトへの回答

対話形式のプロンプトに答えて設定を進めます。

_対話の例_
```bash
Claude Codeへようこそ！
いくつかの質問に答えて、初期設定を完了させてください。

? あなたの名前を入力してください: 山田太郎
? あなたの経験レベルを選択してください:
  1. 初心者
  2. 中級者
  3. 上級者
❯ 2
? 主に使用するプログラミング言語を選択してください:
  1. JavaScript/TypeScript
  2. Python
  3. Java
  4. その他
❯ 1
? プロジェクトの種類を選択してください:
  1. Webアプリケーション
  2. モバイルアプリ
  3. デスクトップアプリ
  4. API/バックエンド
❯ 1

設定を保存しました。これでClaude Codeの使用準備が完了しました！
```

3. 設定の確認

設定が正しく保存されたか確認します。

_コマンド実行_
```bash
claude config list
```

:::

### プロファイルの設定

:::step

1. ユーザープロファイルの設定

個人の開発環境に合わせたプロファイルを設定します。

_コマンド実行_
```bash
# デフォルトエディタの設定
claude config set default-editor vscode

# デフォルトターミナルの設定
claude config set default-terminal bash

# タイムゾーンの設定
claude config set timezone Asia/Tokyo

# 言語設定
claude config set language ja
```

2. 開発環境の設定

好みの開発環境を設定します。

_コマンド実行_
```bash
# 使用するNode.jsバージョンの設定
claude config set node-version 18.17.0

# パッケージマネージャーの設定
claude config set package-manager npm

# テストフレームワークの設定
claude config set test-framework jest
```

:::

## 最初のプロジェクト作成

### プロジェクトの計画

:::step

1. プロジェクトの企画

最初のプロジェクトとして、「簡単なタスク管理アプリケーション」を作成します。

_コマンド実行_
```bash
# プロジェクト用ディレクトリの作成
mkdir task-manager-app
cd task-manager-app

# Claude Codeでプロジェクトを初期化
claude init --project
```

2. プロジェクト要件の定義

Claude Codeにプロジェクトの要件を伝えます。

_コマンド実行_
```bash
claude "簡単なタスク管理アプリケーションを作成したいです。以下の機能を実装してください：
- タスクの追加、編集、削除
- タスクの状態管理（未着手、進行中、完了）
- タスクの優先度設定
- シンプルなコマンドラインインターフェース
- データの永続化（JSONファイル）
"
```

:::

### プロジェクト構造の設計

:::step

1. プロジェクト構造の生成

プロジェクトの構造を生成させます。

_コマンド実行_
```bash
claude "このプロジェクトのディレクトリ構造を設計してください。Node.jsとTypeScriptを使用し、以下の構成で実装してください：
- src/: ソースコード
- tests/: テストコード
- data/: データファイル
- docs/: ドキュメント
- 配布用の設定ファイル
"
```

2. 生成された構造の確認

生成されたプロジェクト構造を確認します。

_コマンド実行_
```bash
tree -a
```

_期待される出力_
```
.
├── src/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
├── data/
│   └── tasks.json
├── docs/
│   └── README.md
├── package.json
├── tsconfig.json
├── .eslintrc.js
└── .gitignore
```

:::

### 基本ファイルの作成

:::step

1. package.jsonの作成

プロジェクトの設定ファイルを作成させます。

_コマンド実行_
```bash
claude "package.jsonファイルを作成してください。TypeScriptと必要な依存関係を含めて、開発スクリプトも設定してください。"
```

2. TypeScript設定の作成

TypeScriptの設定ファイルを作成させます。

_コマンド実行_
```bash
claude "tsconfig.jsonファイルを作成してください。厳格な型チェックとモダンなJavaScript機能を有効にする設定を含めてください。"
```

3. 基本的なファイルの作成

プロジェクトに必要な基本的なファイルを作成させます。

_コマンド実行_
```bash
claude ".gitignoreファイルと.eslintrc.jsファイルを作成してください。Node.jsプロジェクト向けの標準的な設定を含めてください。"
```

:::

## コア機能の実装

### データモデルの定義

:::step

1. タスクモデルの作成

タスクのデータモデルを定義させます。

_コマンド実行_
```bash
claude "src/models/task.tsファイルを作成してください。Taskインターフェースを定義し、タスクの基本プロパティ（id, title, description, status, priority, createdAt, updatedAt）を含めてください。"
```

2. モデルの確認

作成されたモデルを確認します。

_コマンド実行_
```bash
cat src/models/task.ts
```

_期待される内容_
```typescript
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}
```

:::

### データアクセス層の実装

:::step

1. データサービスの作成

データの保存と読み込みを行うサービスを実装させます。

_コマンド実行_
```bash
claude "src/services/taskService.tsファイルを作成してください。JSONファイルを使用したタスクのCRUD操作を実装してください。ファイルIO操作とエラーハンドリングを含めてください。"
```

2. サービスの確認

作成されたサービスを確認します。

_コマンド実行_
```bash
cat src/services/taskService.ts
```

:::

### コントローラーの実装

:::step

1. タスクコントローラーの作成

タスク操作を管理するコントローラーを実装させます。

_コマンド実行_
```bash
claude "src/controllers/taskController.tsファイルを作成してください。コマンドライン引数を解析して、タスクの追加、一覧表示、更新、削除機能を提供してください。"
```

2. メインファイルの作成

アプリケーションのエントリーポイントを作成させます。

_コマンド実行_
```bash
claude "src/index.tsファイルを作成してください。タスクコントローラーを使用してコマンドラインインターフェースを実装してください。"
```

:::

## テストの実装

### テスト環境の設定

:::step

1. テスト設定の追加

テスト環境を設定します。

_コマンド実行_
```bash
claude "Jestを使用したテスト環境を設定してください。package.jsonにテストスクリプトを追加し、jest.config.jsファイルを作成してください。"
```

2. テスト用のモック作成

テスト用のモックデータを作成させます。

_コマンド実行_
```bash
claude "tests/__mocks__/fs.tsファイルを作成してください。ファイルシステム操作をモックするためのユーティリティを実装してください。"
```

:::

### ユニットテストの作成

:::step

1. モデルのテスト作成

タスクモデルのテストを作成させます。

_コマンド実行_
```bash
claude "tests/unit/taskModel.test.tsファイルを作成してください。Taskインターフェースと関連関数のテストを実装してください。"
```

2. サービスのテスト作成

タスクサービスのテストを作成させます。

_コマンド実行_
```bash
claude "tests/unit/taskService.test.tsファイルを作成してください。タスクサービスのCRUD操作をテストしてください。"
```

:::

## 実行とテスト

### 依存関係のインストール

:::step

1. パッケージのインストール

プロジェクトの依存関係をインストールします。

_コマンド実行_
```bash
npm install
```

2. TypeScriptのビルド

TypeScriptをコンパイルします。

_コマンド実行_
```bash
npm run build
```

:::

### アプリケーションの実行

:::step

1. アプリケーションのテスト

作成したアプリケーションをテストします。

_コマンド実行_
```bash
# ビルド後の実行
node dist/index.js --help

# タスクの追加
node dist/index.js add "最初のタスク" --description "これは最初のタスクです" --priority high

# タスクの一覧表示
node dist/index.js list

# タスクの更新
node dist/index.js update 1 --status in-progress

# タスクの削除
node dist/index.js delete 1
```

2. テストの実行

テストを実行して品質を確認します。

_コマンド実行_
```bash
npm test
```

:::

## プロジェクトのカスタマイズ

### 追加機能の実装

:::step

1. 機能拡張の依頼

追加機能を実装させます。

_コマンド実行_
```bash
claude "以下の追加機能を実装してください：
- タスクのフィルタリング（ステータス、優先度別）
- タスクの検索機能
- 期限日の設定
- 進捗状況の表示
"
```

2. コードの改善

コードの品質を改善させます。

_コマンド実行_
```bash
claude "現在のコードをリファクタリングしてください。エラーハンドリングの改善、コードの重複排除、可読性の向上を行ってください。"
```

:::

### ドキュメントの作成

:::step

1. READMEの作成

プロジェクトのREADMEを作成させます。

_コマンド実行_
```bash
claude "README.mdファイルを作成してください。プロジェクトの概要、インストール方法、使い方、機能説明を含めてください。"
```

2. APIドキュメントの作成

APIドキュメントを作成させます。

_コマンド実行_
```bash
claude "docs/API.mdファイルを作成してください。使用可能なすべてのコマンドとその引数、戻り値について説明してください。"
```

:::

## Gitリポジトリの設定

### バージョン管理の設定

:::step

1. Gitの初期化

プロジェクトをGitリポジトリとして初期化します。

_コマンド実行_
```bash
git init
git add .
git commit -m "Initial commit: Task management application

- Implemented basic task CRUD operations
- Added TypeScript configuration and linting
- Created comprehensive test suite
- Added command-line interface
- Implemented JSON file storage
"
```

2. リモートリポジトリの設定

リモートリポジトリを設定します（オプション）。

_コマンド実行_
```bash
# GitHubでリポジトリを作成後
git remote add origin https://github.com/your-username/task-manager-app.git
git branch -M main
git push -u origin main
```

:::

### コミットフックの設定

:::step

1. Huskyの設定

コミットフックを設定して品質を維持します。

_コマンド実行_
```bash
claude "Huskyとlint-stagedを設定して、コミット前に自動的にテストとリントを実行するようにしてください。"
```

2. 品質チェックの確認

設定が正しく動作するか確認します。

_コマンド実行_
```bash
# テスト用の変更を加えてコミット
echo "console.log('test');" >> src/index.ts
git add .
git commit -m "Test commit hooks"
```

:::

## デプロイの準備

### パッケージング

:::step

1. 実行可能ファイルの作成

アプリケーションを実行可能ファイルとしてパッケージ化します。

_コマンド実行_
```bash
claude "pkgを使用してこのアプリケーションを実行可能ファイルとしてパッケージ化してください。Windows、macOS、Linux向けのバイナリを作成する設定を追加してください。"
```

2. 配布パッケージの作成

配布用のパッケージを作成します。

_コマンド実行_
```bash
claude "このプロジェクトをnpmパッケージとして公開するための準備をしてください。package.jsonの適切な設定と、公開用のファイルを用意してください。"
```

:::

## トラブルシューティング

### 一般的な問題

:::note よくある問題と解決策

**Q: コンパイルエラーが発生します**
A: TypeScriptの設定を確認し、型エラーを修正してください。`npm run build`で詳細なエラー情報を確認できます。

**Q: テストが失敗します**
A: テスト環境の設定を確認し、モックの設定を見直してください。`npm test -- --verbose`で詳細なテスト結果を確認できます。

**Q: ファイル書き込みエラーが発生します**
A: ファイルのパーミッションを確認し、dataディレクトリが存在するか確認してください。

:::

### デバッグ方法

:::step

1. デバッグモードの有効化

デバッグ情報を有効にして問題を特定します。

_コマンド実行_
```bash
# デバッグモードでの実行
export DEBUG=task-manager:*
node dist/index.js list

# ログレベルの設定
export LOG_LEVEL=debug
node dist/index.js add "テストタスク"
```

2. エラーログの確認

エラーログを確認して問題を分析します。

_コマンド実行_
```bash
# ログファイルの確認
tail -f logs/app.log

# システムログの確認
journalctl -u your-app-name
```

:::

## 次のステップ

最初のプロジェクトが完成したら、次のステップに進みましょう。

1. [高度な機能の学習](../../advanced-features/advanced-features.md)
2. [実践的なプロジェクトの作成](../../practical-projects/practical-projects.md)
3. [チーム開発での活用](../../team-development/team-development.md)

---

## まとめ

:::note 要点のまとめ

- Claude Codeの初回起動と初期設定が完了
- 最初のプロジェクトとしてタスク管理アプリを作成
- TypeScriptとテスト環境を含む本格的な開発環境を構築
- Gitによるバージョン管理と品質管理を確立
- デプロイ準備とトラブルシューティングを学習

:::

## 関連記事

[高度な機能](../../advanced-features/advanced-features.md)
[実践的なプロジェクト](../../practical-projects/practical-projects.md)
[チーム開発での活用](../../team-development/team-development.md)
[プロジェクト管理ベストプラクティス](../../practical-projects/project-management.md)