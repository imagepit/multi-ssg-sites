---
title: コマンドリファレンス
slug: command-reference
parent: basic-tutorial
status: published
filepath: contents/getting-started/basic-tutorial/command-reference.md
post_type: pages
goal: Claude Codeの全コマンドを網羅的に理解し、効果的に活用できるようにする
seo_title: Claude Codeコマンドリファレンス | 全コマンド詳細解説
seo_description: Claude Codeの全コマンドを詳細解説。基本コマンドから高度なオプションまで、実用的な使用例と共に網羅的に紹介します。
seo_keywords: Claude Code コマンド, リファレンス, オプション, 使用例
handson_overview: 主要コマンドの実際の使用例を試しながら理解を深める実践
---

# コマンドリファレンス

このリファレンスでは、Claude Codeの全コマンドを網羅的に解説します。基本操作から高度な機能まで、各コマンドの詳細な使用方法と実用的な例を提供します。

:::note このリファレンスで学べること

- Claude Codeの全コマンド一覧と基本的な使い方
- 各コマンドのオプションと引数の詳細
- 実際の開発現面での活用例
- コマンドの組み合わせによる効率的なワークフロー
- トラブルシューティングとベストプラクティス

:::

## コマンド一覧

### 基本コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `claude` | 対話的なコード生成 | `claude "Hello Worldを作成"` |
| `claude init` | 初期設定 | `claude init --project` |
| `claude config` | 設定管理 | `claude config list` |
| `claude --help` | ヘルプ表示 | `claude --help` |
| `claude --version` | バージョン確認 | `claude --version` |

### 開発支援コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `claude generate` | コード生成 | `claude generate --file app.py` |
| `claude debug` | デバッグ支援 | `claude debug "エラーメッセージ"` |
| `claude test` | テスト生成 | `claude test --unit` |
| `claude refactor` | リファクタリング | `claude refactor src/` |
| `claude review` | コードレビュー | `claude review main.js` |

### プロジェクト管理コマンド

| コマンド | 説明 | 使用例 |
|---------|------|--------|
| `claude project` | プロジェクト管理 | `claude project create` |
| `claude build` | ビルド支援 | `claude build --optimize` |
| `claude deploy` | デプロイ支援 | `claude deploy --env production` |
| `claude monitor` | モニタリング | `claude monitor --performance` |

## 基本コマンド詳細

### claude (メインコマンド)

:::step

1. 基本的な対話

Claude Codeとの対話を開始します。

_コマンド実行_
```bash
claude "簡単な計算機プログラムを作成してください"
```

2. ファイル指定での実行

特定のファイルを対象にコマンドを実行します。

_コマンド実行_
```bash
claude "このファイルをリファクタリングしてください" src/calculator.js
```

3. 複数行プロンプト

複数行のプロンプトを入力します。

_コマンド実行_
```bash
claude "ユーザー管理システムを作成してください。
要件：
- ユーザーの追加、編集、削除
- データベース連携
- REST APIエンドポイント
- 認証機能"
```

:::

### claude init

:::step

1. 対話形式での初期化

プロジェクトの初期設定を対話形式で行います。

_コマンド実行_
```bash
claude init
```

2. プロジェクトモードでの初期化

プロジェクトとして初期化します。

_コマンド実行_
```bash
claude init --project
```

3. 設定ファイルの確認

初期化後の設定を確認します。

_コマンド実行_
```bash
claude config list
```

:::

### claude config

:::step

1. 設定の一覧表示

現在の設定を確認します。

_コマンド実行_
```bash
claude config list
```

2. 設定の追加

新しい設定を追加します。

_コマンド実行_
```bash
claude config set default-model claude-3-sonnet-20240229
claude config set timeout 60000
```

3. 設定の削除

不要な設定を削除します。

_コマンド実行_
```bash
claude config remove timeout
```

4. プロジェクト固有の設定

プロジェクトごとの設定を管理します。

_コマンド実行_
```bash
claude config --project set default-model claude-3-opus-20240229
```

:::

## 開発支援コマンド詳細

### claude generate

:::step

1. コードの生成

指定した要件でコードを生成します。

_コマンド実行_
```bash
claude generate --language python --file data_processor.py "CSVファイルを処理するクラス"
```

2. 複数ファイルの生成

関連する複数のファイルを一度に生成します。

_コマンド実行_
```bash
claude generate --multi-file "ユーザー認証システム"
```

3. テンプレートの使用

定義されたテンプレートを使用してコードを生成します。

_コマンド実行_
```bash
claude generate --template react-component "ユーザープロフィールコンポーネント"
```

:::

### claude debug

:::step

1. エラーの解析

エラーメッセージを解析して解決策を提案します。

_コマンド実行_
```bash
claude debug "TypeError: Cannot read property 'map' of undefined"
```

2. ファイルのデバッグ

特定のファイルをデバッグします。

_コマンド実行_
```bash
claude debug src/components/UserList.js
```

3. パフォーマンスの分析

パフォーマンス問題を分析します。

_コマンド実行_
```bash
claude debug --performance "アプリケーションが遅い"
```

:::

### claude test

:::step

1. ユニットテストの生成

ユニットテストを生成します。

_コマンド実行_
```bash
claude test --unit src/calculator.js
```

2. 統合テストの生成

統合テストを生成します。

_コマンド実行_
```bash
claude test --integration "ユーザー登録機能"
```

3. テストカバレッジの確認

テストカバレッジを確認します。

_コマンド実行_
```bash
claude test --coverage
```

:::

## プロジェクト管理コマンド詳細

### claude project

:::step

1. プロジェクトの作成

新しいプロジェクトを作成します。

_コマンド実行_
```bash
claude project create --name "my-app" --template react
```

2. プロジェクトの分析

現在のプロジェクトを分析します。

_コマンド実行_
```bash
claude project analyze
```

3. 依存関係の管理

プロジェクトの依存関係を管理します。

_コマンド実行_
```bash
claude project dependency update
```

:::

### claude build

:::step

1. ビルドの実行

プロジェクトをビルドします。

_コマンド実行_
```bash
claude build --environment production
```

2. 最適化ビルド

最適化オプション付きでビルドします。

_コマンド実行_
```bash
claude build --optimize --compress
```

3. ビルド結果の確認

ビルド結果を確認します。

_コマンド実行_
```bash
claude build --analyze
```

:::

## 高度なオプション

### グローバルオプション

| オプション | 説明 | 使用例 |
|-----------|------|--------|
| `--help` | ヘルプ表示 | `claude --help` |
| `--version` | バージョン表示 | `claude --version` |
| `--verbose` | 詳細出力 | `claude --verbose "テスト"` |
| `--debug` | デバッグモード | `claude --debug "テスト"` |
| `--quiet` | サイレントモード | `claude --quiet build` |
| `--dry-run` | ドライラン | `claude --dry-run deploy` |

### 出力オプション

| オプション | 説明 | 使用例 |
|-----------|------|--------|
| `--output` | 出力先指定 | `claude --output result.txt` |
| `--format` | 出力形式指定 | `claude --format json` |
| `--log` | ログファイル指定 | `claude --log debug.log` |
| `--append` | 追記モード | `claude --append --output log.txt` |

### 環境オプション

| オプション | 説明 | 使用例 |
|-----------|------|--------|
| `--env` | 環境指定 | `claude --env production` |
| `--config` | 設定ファイル指定 | `claude --config custom-config.json` |
| `--cache` | キャッシュ設定 | `claude --cache enable` |
| `--timeout` | タイムアウト設定 | `claude --timeout 120000` |

## 実践的な使用例

### 開発ワークフロー

:::step

1. プロジェクトの初期化

新しいプロジェクトを初期化します。

_コマンド実行_
```bash
# プロジェクトディレクトリの作成
mkdir my-project
cd my-project

# Claude Codeの初期化
claude init --project

# 基本的なファイルの生成
claude generate --multi-file "Reactアプリケーションの基本構造"
```

2. 開発の進行

機能開発を進めます。

_コマンド実行_
```bash
# コンポーネントの生成
claude generate --template react-component "ユーザーリストコンポーネント"

# テストの生成
claude test --unit src/components/UserList.js

# コードレビュー
claude review src/components/UserList.js
```

3. デバッグと修正

問題を特定し修正します。

_コマンド実行_
```bash
# エラーの解析
claude debug "TypeError: Cannot read property 'map' of undefined"

# コードの修正
claude refactor src/components/UserList.js

# 再テスト
claude test --unit src/components/UserList.js
```

:::

### 自動化スクリプト

:::step

1. ビルドスクリプトの作成

自動化ビルドスクリプトを作成します。

_コマンド実行_
```bash
# build.shの作成
claude "CI/CD用のビルドスクリプトを作成してください。
要件：
- テストの実行
- ビルドの実行
- デプロイの準備
- エラーハンドリング"
```

2. 実行権限の付与

スクリプトに実行権限を付けます。

_コマンド実行_
```bash
chmod +x build.sh
```

3. 自動化の実行

自動化スクリプトを実行します。

_コマンド実行_
```bash
./build.sh
```

:::

## トラブルシューティング

### 一般的なエラー

:::note よくあるエラーと解決策

**Q: コマンドが見つかりません**
A: PATHが正しく設定されているか確認してください。`which claude`で場所を確認できます。

**Q: 認証エラーが発生します**
A: APIキーが正しく設定されているか確認してください。`claude config list`で設定を確認できます。

**Q: タイムアウトが発生します**
A: タイムアウト値を増やしてください。`claude config set timeout 120000`

**Q: ファイルが見つかりません**
A: カレントディレクトリとファイルパスを確認してください。

:::

### デバッグモードの活用

:::step

1. デバッグモードの有効化

詳細なログを取得するためにデバッグモードを有効にします。

_コマンド実行_
```bash
claude --debug "テストメッセージ"
```

2. ログファイルの確認

ログファイルを確認して問題を特定します。

_コマンド実行_
```bash
tail -f ~/.claude-code/logs/debug.log
```

3. 設定の確認

現在の設定を確認します。

_コマンド実行_
```bash
claude config debug
```

:::

## パフォーマンス最適化

### 効率的なコマンド使用

:::tip 効率化のためのヒント

- 頻繁に使用するコマンドはエイリアスを設定する
- 長いプロンプトはファイルに保存して読み込む
- プロジェクト設定を適切に管理する
- キャッシュ機能を活用する

:::

### エイリアスの設定

:::step

1. シェルエイリアスの作成

よく使用するコマンドのエイリアスを作成します。

_コマンド実行_
```bash
# ~/.bashrcまたは~/.zshrcに追加
alias cgen='claude generate'
alias ctest='claude test --unit'
alias cdebug='claude debug'
alias crefac='claude refactor'
```

2. 設定の再読み込み

設定を再読み込みします。

_コマンド実行_
```bash
source ~/.bashrc
```

3. エイリアスの使用

エイリアスを使用してコマンドを実行します。

_コマンド実行_
```bash
cgen "ユーザー認証コンポーネント"
ctest src/components/Auth.js
```

:::

## 次のステップ

コマンドリファレンスの学習が完了したら、次のステップに進みましょう。

1. [ファイル操作の詳細](file-operations.md)
2. [プロジェクト管理のベストプラクティス](project-management.md)
3. [高度な機能の学習](../../advanced-features/advanced-features.md)

---

## まとめ

:::note 要点のまとめ

- Claude Codeの全コマンドとオプションを網羅的に理解
- 基本操作から高度な機能まで実践的な使用方法を習得
- 効率的な開発ワークフローを構築する方法を学習
- トラブルシューティングとパフォーマンス最適化の技術を習得
- 実際のプロジェクトでの活用方法を理解

:::

## 関連記事

[ファイル操作の詳細](file-operations.md)
[プロジェクト管理のベストプラクティス](project-management.md)
[高度な機能](../../advanced-features/advanced-features.md)
[トラブルシューティングガイド](../../resources-support/faq-common-questions/troubleshooting-faq.md)