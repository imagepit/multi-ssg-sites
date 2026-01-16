---
title: macOS版インストール
slug: macos-installation
parent: installation
status: published
filepath: contents/getting-started/installation/macos-installation.md
post_type: pages
goal: macOS環境でのClaude Code具体的なインストール手順を提供し、macOSユーザーが安心してセットアップできるようにする
seo_title: Claude Code macOS版インストール | Mac環境での詳細手順
seo_description: macOS環境でのClaude Code詳細インストール手順。Homebrewを使ったNode.js導入からターミナル設定、権限問題の対処まで、Mac特有の手順を詳しく解説します。
seo_keywords: Claude Code macOS, Mac インストール, Homebrew, ターミナル設定
handson_overview: macOSでのNode.js環境構築からClaude Codeインストール、初回起動までの実際の手順を実行
---

# macOS版インストールガイド

このガイドでは、macOS環境でClaude Codeをインストールする手順を詳しく解説します。Homebrewを使った環境構築から、ターミナルの設定、権限問題の対処まで、Macユーザーがスムーズにセットアップできるように支援します。

:::note このガイドで学べること

- Homebrewを使ったNode.js環境の構築
- Claude Codeのインストール手順
- ターミナルの基本設定
- 権限問題の解決方法
- 初回起動と認証設定

:::

## 前提条件

### 必要なシステム
- macOS 11.0 (Big Sur) 以降
- IntelプロセッサまたはApple Silicon (M1/M2/M3)
- 管理者権限（sudoの実行権限）
- 安定したインターネット接続

### 推奨環境
- 8GB以上のRAM
- 20GB以上の空きディスク容量
- 最新のmacOSバージョン

## インストール手順

:::step

1. ターミナルを開く

まずはターミナルを起動します。以下のいずれかの方法でターミナルを開いてください。

- **Spotlight検索**: `Command + Space` を押して「ターミナル」と入力
- **Launchpad**: アプリケーション → ユーティリティ → ターミナル
- **キーボードショートカット**: `Command + Shift + U`

2. Homebrewのインストールを確認

ターミナルで以下のコマンドを実行し、Homebrewがインストールされているか確認します。

_コマンド実行_
```bash
brew --version
```

Homebrewがインストールされていない場合は、以下のコマンドでインストールします。

_コマンド実行_
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

インストールには数分かかる場合があります。パスワードの入力を求められたら、Macのログインパスワードを入力してください。

3. Node.jsのインストール

Homebrewを使ってNode.jsをインストールします。

_コマンド実行_
```bash
brew install node
```

インストールが完了したら、バージョンを確認します。

_コマンド実行_
```bash
node --version
npm --version
```

Node.js 16.x以上、npm 8.x以上が表示されればOKです。

4. Claude Codeのインストール

npmを使ってClaude Codeをインストールします。

_コマンド実行_
```bash
npm install -g @anthropic-ai/claude-code
```

グローバルインストールには管理者権限が必要です。パスワードの入力を求められたら入力してください。

5. インストールの確認

Claude Codeが正常にインストールされたか確認します。

_コマンド実行_
```bash
claude --version
```

バージョン情報が表示されれば、インストールは成功です。

6. 初回起動と認証設定

初めてClaude Codeを起動します。

_コマンド実行_
```bash
claude init
```

認証用のプロンプトが表示されるので、以下の手順で認証を行います。

- Anthropicアカウントにログイン
- APIキーを取得
- ターミナルにAPIキーを入力

_コマンド実行_
```bash
# APIキーの設定
claude config set api-key YOUR_API_KEY_HERE
```

7. 動作確認

簡単なコマンドで動作を確認します。

_コマンド実行_
```bash
claude "Hello Worldを表示するJavaScriptコードを作成して"
```

適切なコードが生成されれば、セットアップは完了です。

:::

## トラブルシューティング

### 権限エラーが発生する場合

npmのグローバルインストールで権限エラーが発生する場合は、以下の対処法を試してください。

#### 方法1: npxを使用する
```bash
npx @anthropic-ai/claude-code [コマンド]
```

#### 方法2: ディレクトリの権限を変更
```bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

#### 方法3: npmのデフォルトディレクトリを変更
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### パスが通らない場合

ターミナルを再起動するか、以下のコマンドで設定を再読み込みします。

```bash
source ~/.zshrc
# または bashを使用している場合
source ~/.bash_profile
```

### Apple Silicon Macでの問題

M1/M2/M3 Macで互換性の問題が発生する場合は、以下を試してください。

```bash
# アーキテクチャの確認
uname -m

# Rosetta 2でインストール
arch -x86_64 /bin/zsh
brew install node
npm install -g @anthropic-ai/claude-code
```

## ターミナルの最適化設定

### zshの設定（推奨）
macOS Catalina以降ではzshがデフォルトシェルです。以下の設定を`~/.zshrc`に追加すると便利です。

```bash
# Claude Codeのエイリアス
alias cc='claude'
alias cch='claude --help'

# 履歴の設定
HISTSIZE=10000
SAVEHIST=10000
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_REDUCE_BLANKS
```

### シンタックスハイライト
ターミナルでのコーディングを快適にするために、以下のツールのインストールをお勧めします。

```bash
brew install zsh-syntax-highlighting
brew install zsh-autosuggestions
```

## 次のステップ

インストールが完了したら、次のステップに進みましょう。

1. [認証設定の確認](../installation/authentication-setup.md)
2. [基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)
3. [CLAUDE.mdの設定](../initial-setup/claude-md-setup.md)

---

## まとめ

:::note 要点のまとめ

- Homebrewを使ったNode.js環境構築が基本
- npmでのグローバルインストールでClaude Codeをセットアップ
- 権限問題の対処法を理解しておくことが重要
- 初回起動時の認証設定が必要
- Apple Silicon Macでは特別な設定が必要な場合がある

:::

## 関連記事

[Windows版インストール](./windows-installation.md)
[Linux版インストール](./linux-installation.md)
[認証設定](./authentication-setup.md)
[基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)