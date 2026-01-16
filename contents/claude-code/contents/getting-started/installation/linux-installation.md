---
title: Linux版インストール
slug: linux-installation
parent: installation
status: published
filepath: contents/getting-started/installation/linux-installation.md
post_type: pages
goal: Linux環境でのClaude Code具体的なインストール手順を提供し、サーバー環境での運用も含めて適切にセットアップできるようにする
seo_title: Claude Code Linux版インストール | Ubuntu・CentOS対応ガイド
seo_description: Linux環境でのClaude Code詳細インストール手順。Ubuntu、CentOS等のディストリビューション別設定からサーバー環境での運用設定まで包括的に解説します。
seo_keywords: Claude Code Linux, Ubuntu インストール, CentOS, サーバー環境
handson_overview: 主要Linuxディストリビューションでのインストールと動作確認
---

# Linux版インストールガイド

このガイドでは、Linux環境でClaude Codeをインストールする手順を詳しく解説します。Ubuntu、CentOS、Fedoraなど主要なディストリビューションに対応し、パッケージ管理から環境設定まで網羅的にカバーします。

:::note このガイドで学べること

- 主要Linuxディストリビューションでのインストール方法
- Node.js環境の構築とバージョン管理
- パッケージ管理システムの活用
- 環境変数の設定方法
- トラブルシューティングと権限管理

:::

## 前提条件

### 必要なシステム
- Linuxカーネル 3.10以上
- 2GB以上のRAM（4GB以上推奨）
- 10GB以上の空きディスク容量
- sudo権限を持つユーザーアカウント
- 安定したインターネット接続

### 対応ディストリビューション
- **Ubuntu**: 18.04 LTS以降
- **Debian**: 9以降
- **CentOS/RHEL**: 7以降
- **Fedora**: 28以降
- **Arch Linux**: 最新版

## ディストリビューション別インストール手順

### Ubuntu/Debian系

:::step

1. システムの更新

まず、システムパッケージを最新の状態に更新します。

_コマンド実行_
```bash
sudo apt update && sudo apt upgrade -y
```

2. Node.jsのインストール

NodeSourceリポジトリを追加して、最新のNode.jsをインストールします。

_コマンド実行_
```bash
# Node.js 18.xリポジトリの追加
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.jsのインストール
sudo apt-get install -y nodejs
```

3. インストールの確認

Node.jsとnpmが正しくインストールされたか確認します。

_コマンド実行_
```bash
node --version
npm --version
```

4. Claude Codeのインストール

npmを使ってClaude Codeをグローバルにインストールします。

_コマンド実行_
```bash
sudo npm install -g @anthropic-ai/claude-code
```

:::

### CentOS/RHEL系

:::step

1. システムの更新

システムパッケージを更新します。

_コマンド実行_
```bash
sudo yum update -y
```

2. Node.jsのインストール

Node.jsをインストールします。EPELリポジトリを使用する方法がおすすめです。

_コマンド実行_
```bash
# EPELリポジトリの有効化
sudo yum install -y epel-release

# Node.jsとnpmのインストール
sudo yum install -y nodejs npm
```

3. バージョンの確認

インストールされたバージョンを確認します。

_コマンド実行_
```bash
node --version
npm --version
```

4. Claude Codeのインストール

グローバルにClaude Codeをインストールします。

_コマンド実行_
```bash
sudo npm install -g @anthropic-ai/claude-code
```

:::

### Fedora系

:::step

1. システムの更新

Fedoraのパッケージを更新します。

_コマンド実行_
```bash
sudo dnf update -y
```

2. Node.jsのインストール

Fedoraでは標準リポジトリからNode.jsをインストールできます。

_コマンド実行_
```bash
sudo dnf install -y nodejs npm
```

3. インストール確認

バージョンを確認します。

_コマンド実行_
```bash
node --version
npm --version
```

4. Claude Codeのインストール

Claude Codeをインストールします。

_コマンド実行_
```bash
sudo npm install -g @anthropic-ai/claude-code
```

:::

### Arch Linux

:::step

1. システムの更新

Arch Linuxのパッケージデータベースを更新します。

_コマンド実行_
```bash
sudo pacman -Syu
```

2. Node.jsのインストール

Node.jsとnpmをインストールします。

_コマンド実行_
```bash
sudo pacman -S nodejs npm
```

3. インストール確認

バージョンを確認します。

_コマンド実行_
```bash
node --version
npm --version
```

4. Claude Codeのインストール

Claude Codeをインストールします。

_コマンド実行_
```bash
sudo npm install -g @anthropic-ai/claude-code
```

:::

## Node.jsのバージョン管理（オプション）

:::tip Node.jsのバージョン管理

複数のNode.jsバージョンを管理する必要がある場合は、nvm（Node Version Manager）の使用をお勧めします。

:::

:::step

1. nvmのインストール

nvmをインストールします。

_コマンド実行_
```bash
# nvmのインストールスクリプトをダウンロード
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 設定を再読み込み
source ~/.bashrc
```

2. Node.jsのインストール

nvmを使ってNode.jsをインストールします。

_コマンド実行_
```bash
# 最新のLTSバージョンをインストール
nvm install --lts

# デフォルトとして設定
nvm use --lts
```

3. Claude Codeのインストール

nvm環境にClaude Codeをインストールします。

_コマンド実行_
```bash
npm install -g @anthropic-ai/claude-code
```

:::

## 認証設定

:::step

1. 初期化

Claude Codeを初期化します。

_コマンド実行_
```bash
claude init
```

2. APIキーの設定

Anthropicアカウントから取得したAPIキーを設定します。

_コマンド実行_
```bash
claude config set api-key YOUR_API_KEY_HERE
```

3. 動作確認

Claude Codeが正しく動作するか確認します。

_コマンド実行_
```bash
claude --version
```

:::

## 環境設定の最適化

### パスの確認

グローバルパッケージのパスを確認します。

```bash
npm config get prefix
```

### 権限の問題がある場合

sudoなしでグローバルインストールを行う設定：

```bash
# グローバルパッケージ用ディレクトリの作成
mkdir ~/.npm-global

# npmのデフォルトディレクトリを変更
npm config set prefix '~/.npm-global'

# PATHに追加
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## トラブルシューティング

### 権限エラー

グローバルインストール時に権限エラーが発生する場合：

```bash
# 方法1: sudoを使用
sudo npm install -g @anthropic-ai/claude-code

# 方法2: ディレクトリの権限を変更
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# 方法3: nvmを使用（推奨）
# 上記nvmのインストール手順を参照
```

### パッケージが見つからない

ディストリビューションによっては、Node.jsのバージョンが古い場合があります：

```bash
# Ubuntu/Debianの場合
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHELの場合
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### ネットワークの問題

プロキシ環境下でのインストール：

```bash
# npmプロキシ設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 環境変数設定
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

### ファイアウォールの問題

アウトバウンド接続がブロックされている場合：

```bash
# ファイアウォール設定の確認
sudo ufw status

# 必要に応じてポートを開放
sudo ufw allow out 443/tcp
sudo ufw allow out 80/tcp
```

## シェルの設定

### bashの場合

`~/.bashrc`に以下を追加：

```bash
# Claude Codeのエイリアス
alias cc='claude'
alias cch='claude --help'

# Node.jsのパス設定
export PATH="$HOME/.npm-global/bin:$PATH"
```

### zshの場合

`~/.zshrc`に以下を追加：

```bash
# Claude Codeのエイリアス
alias cc='claude'
alias cch='claude --help'

# Node.jsのパス設定
export PATH="$HOME/.npm-global/bin:$PATH"

# 補完設定
autoload -U compinit && compinit
```

## サーバー環境での運用

### システムサービスとして実行

サーバー環境でClaude Codeをバックグラウンドで実行する場合：

```bash
# systemdサービスファイルの作成
sudo tee /etc/systemd/system/claude-code.service > /dev/null <<EOF
[Unit]
Description=Claude Code Service
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/claude --daemon
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# サービスの有効化と起動
sudo systemctl daemon-reload
sudo systemctl enable claude-code.service
sudo systemctl start claude-code.service
```

### ログ管理

ログのローテーション設定：

```bash
# logrotate設定ファイルの作成
sudo tee /etc/logrotate.d/claude-code > /dev/null <<EOF
/var/log/claude-code.log {
  daily
  missingok
  rotate 7
  compress
  delaycompress
  notifempty
  create 644 your_username your_username
}
EOF
```

## 次のステップ

インストールが完了したら、次のステップに進みましょう。

1. [認証設定の確認](./authentication-setup.md)
2. [基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)
3. [CLAUDE.mdの設定](../initial-setup/claude-md-setup.md)

---

## まとめ

:::note 要点のまとめ

- 主要Linuxディストリビューションに対応したインストール手順を提供
- Node.js環境構築からClaude Codeインストールまでを網羅
- nvmを使用したバージョン管理が推奨
- 権限問題やネットワーク問題の解決方法を説明
- 各ディストリビューションのパッケージ管理システムを活用

:::

## 関連記事

[macOS版インストール](./macos-installation.md)
[Windows版インストール](./windows-installation.md)
[認証設定](./authentication-setup.md)
[基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)