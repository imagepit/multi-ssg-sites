---
title: 認証設定
slug: authentication-setup
parent: installation
status: published
filepath: contents/getting-started/installation/authentication-setup.md
post_type: pages
goal: Claude Codeの認証設定を適切に行い、セキュアな環境でツールを利用開始できるようにする
seo_title: Claude Code認証設定ガイド | APIキー・アカウント連携
seo_description: Claude Codeの認証設定を詳しく解説。APIキーの取得・設定からアカウント連携、セキュリティベストプラクティスまで、安全な利用のための包括的ガイドです。
seo_keywords: Claude Code 認証, APIキー, アカウント連携, セキュリティ設定
handson_overview: APIキー取得から認証設定、接続テストまでの実際の設定手順
---

# 認証設定ガイド

このガイドでは、Claude Codeの認証設定を詳しく解説します。APIキーの取得から設定方法、セキュリティベストプラクティスまで、安全な利用のためのすべての手順を網羅しています。

:::note このガイドで学べること

- Anthropicアカウントの作成とAPIキー取得方法
- Claude Codeの初期設定手順
- 複数環境での認証管理
- セキュリティベストプラクティス
- トラブルシューティングとエラー対応

:::

## 前提条件

認証設定を始める前に、以下の準備が必要です。

- Claude Codeのインストールが完了していること
- Anthropicアカウント（または作成の準備）
- インターネット接続
- メールアドレス（アカウント作成用）

## Anthropicアカウントの作成

:::step

1. Anthropic公式サイトへのアクセス

まず、Anthropicの公式サイトにアクセスします。

_コマンド実行_
```bash
# ブラウザでAnthropicサイトを開く
# URL: https://www.anthropic.com
```

2. アカウント作成

サイト右上の「Sign Up」ボタンをクリックし、必要な情報を入力してアカウントを作成します。

- メールアドレスの入力
- パスワードの設定
- 利用規約への同意
- メール認証の完了

:::

## APIキーの取得

:::step

1. コンソールへのログイン

Anthropic Consoleにログインします。

_コマンド実行_
```bash
# ブラウザでConsoleを開く
# URL: https://console.anthropic.com
```

2. APIセクションへの移動

コンソール内で「API Keys」セクションに移動します。

3. 新しいAPIキーの作成

「Create API Key」ボタンをクリックして、新しいAPIキーを作成します。

- キー名の入力（例：claude-code-development）
- 権限の設定
- キーの作成と確認

:::

:::warning APIキーの取り扱い注意

APIキーは一度しか表示されません。必ず安全な場所に保存してください。

- キーをコピーして安全に保管
- コードや設定ファイルに直接記述しない
- Gitリポジトリにコミットしない
- 第三者と共有しない

:::

## Claude Codeの初期設定

:::step

1. Claude Codeの初期化

ターミナルでClaude Codeを初期化します。

_コマンド実行_
```bash
claude init
```

2. 対話形式の設定

対話形式で設定を進めます。

_コマンド実行_
```bash
# 表示されるプロンプトに従って入力
? What is your Anthropic API key? sk-ant-api03-...
? Would you like to set up a default model? (Y/n) Y
? Choose default model: claude-3-sonnet-20240229
? Would you like to save these settings? (Y/n) Y
```

3. 設定の確認

設定が正しく保存されたか確認します。

_コマンド実行_
```bash
claude config list
```

:::

## 手動でのAPIキー設定

対話形式以外の方法で設定する場合：

:::step

1. APIキーの直接設定

APIキーを直接設定します。

_コマンド実行_
```bash
claude config set api-key sk-ant-api03-Your-API-Key-Here
```

2. デフォルトモデルの設定

使用するデフォルトモデルを設定します。

_コマンド実行_
```bash
claude config set default-model claude-3-sonnet-20240229
```

3. 設定の確認

設定内容を確認します。

_コマンド実行_
```bash
claude config list
```

:::

## 設定ファイルの場所

Claude Codeの設定ファイルは以下の場所に保存されます。

### macOS/Linux
```bash
~/.config/claude-code/config.json
```

### Windows
```powershell
%APPDATA%\claude-code\config.json
```

### 設定ファイルの例
```json
{
  "apiKey": "sk-ant-api03-Your-API-Key-Here",
  "defaultModel": "claude-3-sonnet-20240229",
  "baseUrl": "https://api.anthropic.com",
  "timeout": 30000
}
```

## 環境変数による設定

環境変数を使用した認証設定も可能です。

### macOS/Linux
```bash
# .bashrcまたは.zshrcに追加
export ANTHROPIC_API_KEY=sk-ant-api03-Your-API-Key-Here
export ANTHROPIC_DEFAULT_MODEL=claude-3-sonnet-20240229

# 設定を再読み込み
source ~/.bashrc
```

### Windows
```powershell
# PowerShellの場合
$env:ANTHROPIC_API_KEY = "sk-ant-api03-Your-API-Key-Here"
$env:ANTHROPIC_DEFAULT_MODEL = "claude-3-sonnet-20240229"

# 環境変数の永続化
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-api03-Your-API-Key-Here", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_MODEL", "claude-3-sonnet-20240229", "User")
```

## 複数環境での認証管理

### プロファイル機能の活用

:::step

1. プロファイルの作成

プロジェクトごとに異なる設定を作成します。

_コマンド実行_
```bash
# プロジェクト用の設定ファイル作成
claude config --project set api-key sk-ant-api03-Project-API-Key-Here
claude config --project set default-model claude-3-opus-20240229
```

2. プロファイルの確認

プロジェクト設定を確認します。

_コマンド実行_
```bash
claude config --project list
```

3. グローバル設定の確認

グローバル設定を確認します。

_コマンド実行_
```bash
claude config list
```

:::

## セキュリティベストプラクティス

### APIキーの安全管理

:::important APIキーのセキュリティ

APIキーはパスワードと同様に扱い、以下の点に注意してください。

:::

#### 1. 環境変数の使用
設定ファイルに直接記述する代わりに環境変数を使用します。

```bash
# 安全な方法
export ANTHROPIC_API_KEY=$(cat ~/.anthropic_api_key)
```

#### 2. シークレットマネージャーの利用
本番環境ではシークレットマネージャーを使用します。

```bash
# AWS Secrets Managerの例
aws secretsmanager get-secret-value --secret-id claude-api-key
```

#### 3. アクセス制御
必要な権限のみを付与し、定期的にキーをローテーションします。

### 設定ファイルの保護

```bash
# 設定ファイルの権限設定
chmod 600 ~/.config/claude-code/config.json

# Gitから除外
echo "~/.config/claude-code/" >> .gitignore
```

## 接続テスト

:::step

1. 基本的な接続テスト

基本的な接続テストを実行します。

_コマンド実行_
```bash
claude --version
```

2. 簡単なリクエストテスト

簡単なリクエストを送信してテストします。

_コマンド実行_
```bash
claude "Hello Worldと表示する簡単なコードを生成してください"
```

3. 詳細な接続情報の確認

接続情報を詳細に確認します。

_コマンド実行_
```bash
claude config debug
```

:::

## トラブルシューティング

### 一般的なエラーと解決策

#### 認証エラー
```bash
# エラーメッセージ
Error: Authentication failed

# 解決策
claude config set api-key YOUR_CORRECT_API_KEY
```

#### ネットワークエラー
```bash
# エラーメッセージ
Error: Network connection failed

# 解決策
# プロキシ設定の確認
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

#### APIキーの期限切れ
```bash
# 解決策
# 1. 新しいAPIキーを取得
# 2. 設定を更新
claude config set api-key NEW_API_KEY
```

### デバッグモードの有効化

```bash
# デバッグモードで実行
claude --debug "テストメッセージ"

# 詳細なログの確認
claude config debug
```

### 設定のリセット

```bash
# 設定のクリア
claude config clear

# 再初期化
claude init
```

## 企業環境での設定

### プロキシ環境下での設定

```bash
# npmプロキシ設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Claude Codeプロキシ設定
claude config set proxy http://proxy.company.com:8080
claude config set https-proxy http://proxy.company.com:8080
```

### カスタムエンドポイントの設定

```bash
# エンタープライズ環境用のエンドポイント
claude config set base-url https://api.enterprise.anthropic.com
claude config set api-key YOUR_ENTERPRISE_API_KEY
```

## 次のステップ

認証設定が完了したら、次のステップに進みましょう。

1. [基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)
2. [CLAUDE.mdの設定](../initial-setup/claude-md-setup.md)
3. [最初のプロジェクト作成](../basic-tutorial/first-project.md)

---

## まとめ

:::note 要点のまとめ

- Anthropicアカウント作成とAPIキー取得が最初の重要なステップ
- Claude Code initコマンドで対話形式の初期設定が可能
- 環境変数や設定ファイルでの認証管理が推奨
- APIキーのセキュリティ管理が極めて重要
- 接続テストで設定の正確性を確認

:::

## 関連記事

[基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)
[CLAUDE.mdの設定](../initial-setup/claude-md-setup.md)
[システム要件の確認](../overview/system-requirements.md)
[トラブルシューティングガイド](../../resources-support/faq-common-questions/troubleshooting-faq.md)