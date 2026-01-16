---
title: システム要件
slug: system-requirements
parent: overview
status: published
filepath: contents/getting-started/overview/system-requirements.md
post_type: pages
goal: Claude Code導入に必要なシステム要件を明確にし、事前準備を適切に行えるようにする
seo_title: Claude Codeシステム要件 | 動作環境と前提条件
seo_description: Claude Code導入に必要なシステム要件を詳細解説。OS別の動作環境、必要なソフトウェア、ハードウェアスペック、ネットワーク要件を網羅的に説明します。
seo_keywords: Claude Code システム要件, 動作環境, 必要スペック, 互換性, 前提条件
handson_overview: システム要件チェックリストを使用した環境確認手順
---

# システム要件

このガイドでは、Claude Codeを導入・利用するために必要なシステム要件を詳細に解説します。各OS別の動作環境から必要なソフトウェア、ハードウェアスペックまで、スムーズな利用のための前提条件を網羅的に説明します。

:::note このガイドで学べること

- 各OS別の動作環境とサポート状況
- 必要なハードウェアスペックと推奨環境
- 必須ソフトウェアと依存関係
- ネットワーク要件とセキュリティ設定
- 事前準備チェックリストの活用方法

:::

## 基本システム要件

### 必須要件

Claude Codeを利用するための基本的な要件は以下の通りです。

| 要素 | 必須要件 | 推奨要件 |
|------|----------|----------|
| **OS** | macOS 11.0+ / Windows 10+ / Linux (Ubuntu 18.04+) | 最新のOSバージョン |
| **RAM** | 4GB | 8GB以上 |
| **ストレージ** | 2GBの空き容量 | 10GB以上の空き容量 |
| **CPU** | 64bitプロセッサ | マルチコアプロセッサ |
| **ネットワーク** | 安定したインターネット接続 | 高速ブロードバンド接続 |

### Node.js環境

Claude CodeはNode.js環境で動作します。

| 要素 | 必須バージョン | 推奨バージョン |
|------|---------------|---------------|
| **Node.js** | 16.x以上 | 18.x以上 (LTS) |
| **npm** | 8.x以上 | 9.x以上 |

## OS別サポート状況

### macOS

#### サポートバージョン
- **macOS Big Sur (11.0)** 以上
- **macOS Monterey (12.0)** 以上
- **macOS Ventura (13.0)** 以上
- **macOS Sonoma (14.0)** 以上

#### アーキテクチャ対応
- **Intelプロセッサ**: 完全対応
- **Apple Silicon (M1/M2/M3)**: 完全対応（Rosetta 2不要）

#### 特別な要件
- Xcode Command Line Toolsの推奨インストール
- Homebrewによるパッケージ管理が推奨

### Windows

#### サポートバージョン
- **Windows 10** バージョン 2004 以上 (ビルド 19041+)
- **Windows 11** 全バージョン

#### エディション対応
- **Windows Home**: 対応
- **Windows Pro**: 対応
- **Windows Enterprise**: 対応
- **Windows Education**: 対応

#### 特別な要件
- **WSL (Windows Subsystem for Linux)**: 推奨
- **PowerShell 5.1以上**: 必須
- **Windows Terminal**: 推奨

### Linux

#### サポートディストリビューション
| ディストリビューション | 必須バージョン | 推奨バージョン |
|-------------------|---------------|---------------|
| **Ubuntu** | 18.04 LTS | 22.04 LTS |
| **Debian** | 9 (Stretch) | 11 (Bullseye) |
| **CentOS/RHEL** | 7 | 8/9 |
| **Fedora** | 28 | 38+ |
| **Arch Linux** | 最新版 | 最新版 |

#### パッケージマネージャー
- **apt**: Ubuntu/Debian系
- **yum/dnf**: RedHat系
- **pacman**: Arch Linux
- **zypper**: openSUSE

## ハードウェア要件の詳細

### CPU要件

#### 最低要件
- 64bitプロセッサ
- 2コア以上
- 1.5GHz以上のクロック周波数

#### 推奨要件
- マルチコアプロセッサ（4コア以上）
- 2.0GHz以上のクロック周波数
- SSSE3命令セットサポート

#### 最適要件（大規模プロジェクト向け）
- 8コア以上のプロセッサ
- 2.5GHz以上のクロック周波数
- AVX2命令セットサポート

### メモリ要件

#### 最低要件（4GB）
- 小規模プロジェクトの開発
- 基本的なコード生成
- シンプルな対話セッション

#### 推奨要件（8GB）
- 中規模プロジェクトの開発
- 複数ファイルの同時編集
- バックグラウンド処理の同時実行

#### 最適要件（16GB+）
- 大規模プロジェクトの開発
- 複雑なAIモデルの利用
- 仮想環境との並行利用

### ストレージ要件

#### 必須容量
- **Claude Code本体**: 約500MB
- **Node.js環境**: 紦300MB
- **キャッシュファイル**: 約1GB
- **合計**: 約2GB

#### 作業用容量
- **プロジェクトファイル**: プロジェクトサイズによる
- **一時ファイル**: 約1GB
- **ログファイル**: 約500MB

#### 推奨ストレージタイプ
- **SSD**: 強く推奨
- **HDD**: 動作可能だがパフォーマンス低下
- **NVMe SSD**: 最適パフォーマンス

## ソフトウェア要件

### 必須ソフトウェア

#### Node.jsとnpm
```bash
# バージョン確認コマンド
node --version
npm --version
```

#### Git
- バージョン 2.0以上
- コマンドラインツールのインストール

#### テキストエディタ
- VS Code（推奨）
- または好みのエディタ

### 推奨ソフトウェア

#### 開発ツール
- **VS Code**: Claude Code拡張機能との連携
- **Gitクライアント**: ソースコード管理
- **ターミナルマルチプレクサー**: tmux/screen

#### 依存関係管理
- **nvm**: Node.jsバージョン管理
- **yarn**: パッケージマネージャー（npmの代替）

## ネットワーク要件

### 接続要件

#### 必須接続
- **安定したインターネット接続**
- **HTTPS通信**（ポート443）
- **DNS解決**が正常に動作すること

#### 推奨環境
- **ブロードバンド接続**（10Mbps以上）
- **低遅延接続**（100ms以下）
- **安定した帯域幅**

### プロキシ環境

#### 対応プロキシ
- **HTTPプロキシ**
- **HTTPSプロキシ**
- **SOCKSプロキシ**

#### 設定方法
```bash
# npmプロキシ設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 環境変数設定
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

### ファイアウォール設定

#### 必要なポート
- **ポート 443**: HTTPS通信（Anthropic API）
- **ポート 80**: HTTP通信（リダイレクト用）

#### アウトバウンド接続
```bash
# 接続テストコマンド
curl -I https://api.anthropic.com
```

## セキュリティ要件

### OSセキュリティ

#### 必須設定
- OSの最新セキュリティアップデート
- アンチウイルスソフトウェアのインストール
- ファイアウォールの有効化

#### 推奨設定
- 自動更新の有効化
- ディスク暗号化（BitLocker/FileVault）
- ユーザーアカウント制御（UAC）の有効化

### アカウント要件

#### Anthropicアカウント
- 有効なメールアドレス
- 確認済みの電話番号
- 支払い情報（有料プランの場合）

#### APIキー管理
- 安全なAPIキーの保管
- 定期的なキーのローテーション
- アクセス権限の適切な管理

## 事前準備チェックリスト

:::step

1. OSバージョンの確認

使用しているOSのバージョンを確認します。

_コマンド実行_
```bash
# macOS
sw_vers

# Windows
winver

# Linux
cat /etc/os-release
```

2. ハードウェアスペックの確認

システムのハードウェア情報を確認します。

_コマンド実行_
```bash
# macOS
system_profiler SPHardwareDataType

# Windows
systeminfo | findstr /C:"プロセッサ" /C:"メモリ"

# Linux
lscpu
free -h
```

3. Node.js環境の確認

Node.jsとnpmがインストールされているか確認します。

_コマンド実行_
```bash
node --version
npm --version
```

4. ネットワーク接続の確認

インターネット接続を確認します。

_コマンド実行_
```bash
ping api.anthropic.com
curl -I https://api.anthropic.com
```

5. ストレージ容量の確認

十分な空き容量があるか確認します。

_コマンド実行_
```bash
# macOS
df -h

# Windows
wmic logicaldisk get size,freespace,caption

# Linux
df -h
```

:::

## 互換性情報

### 既知の互換性問題

#### Windows環境
- **WSL1**: 一部の機能が制限される場合あり
- **古いWindowsバージョン**: サポート外
- **制限付きユーザーアカウント**: インストールに管理者権限が必要

#### Linux環境
- **非常に古いディストリビューション**: Node.jsのインストールが困難
- **コンテナ環境**: 一部の機能が制限される場合あり
- **読み取り専用ファイルシステム**: 設定ファイルの保存が不可能

#### macOS環境
- **非常に古いmacOSバージョン**: サポート外
- ** Rosetta 2環境**: ほぼ完全に動作
- **App Store版Node.js**: 一部の制限がある場合あり

### パフォーマンスに関する考慮事項

#### CPUパフォーマンス
- 複数コアがあると並列処理が効率的
- 最新のCPU命令セットをサポートしていると最適化される
- 仮想環境の場合、十分なCPUリソースを割り当てる

#### メモリパフォーマンス
- メモリ不足によるスワッピングを避ける
- 大規模プロジェクトでは十分なメモリを確保
- ブラウザなどの他のアプリケーションとの同時利用を考慮

#### I/Oパフォーマンス
- SSDの使用を強く推奨
- ネットワーク遅延が低い環境を推奨
- ローカルファイルシステムのアクセス速度が重要

## 環境別最適化ガイド

### 開発環境の最適化

#### ローカル開発環境
```bash
# Node.jsの最適化
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=4096"

# Claude Codeのキャッシュ設定
claude config set cache-size 1024
```

#### CI/CD環境
```bash
# CI環境向け設定
export CI=true
export NODE_OPTIONS="--max-old-space-size=2048"
```

### 企業環境の考慮事項

#### プロキシ設定
```bash
# 企業プロキシの設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
npm config set strict-ssl false
```

#### セキュリティポリシー
- APIキーの管理方法
- ネットワークアクセス制御
- 監査ログの有効化

## トラブルシューティング

### 一般的な問題

#### インストールが失敗する
```bash
# Node.jsの再インストール
# nvmを使用する場合
nvm install 18
nvm use 18

# パッケージマネージャーのクリーンアップ
npm cache clean --force
```

#### ネットワーク接続問題
```bash
# DNS設定の確認
nslookup api.anthropic.com

# プロキシ設定の確認
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

#### パーミッション問題
```bash
# グローバルパッケージの権限修正
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### システム要件チェックツール

:::step

1. 自動チェックスクリプトの実行

システム要件を自動でチェックするスクリプトを実行します。

_コマンド実行_
```bash
# チェックスクリプトの作成
cat > system_check.sh << 'EOF'
#!/bin/bash

echo "Claude Code システム要件チェック"
echo "================================"

# OSチェック
echo "OS情報:"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sw_vers
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  cat /etc/os-release
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  echo "Windows環境"
fi

echo

# Node.jsチェック
echo "Node.js環境:"
if command -v node &> /dev/null; then
  node --version
  npm --version
else
  echo "Node.jsがインストールされていません"
fi

echo

# メモリチェック
echo "メモリ情報:"
if [[ "$OSTYPE" == "darwin"* ]]; then
  vm_stat | grep "Pages free"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  free -h
fi

echo

# ネットワークチェック
echo "ネットワーク接続:"
if curl -s --head https://api.anthropic.com > /dev/null; then
  echo "Anthropic APIに接続可能"
else
  echo "Anthropic APIに接続できません"
fi

echo "チェック完了"
EOF

# スクリプトの実行
chmod +x system_check.sh
./system_check.sh
```

:::

## 次のステップ

システム要件の確認が完了したら、次のステップに進みましょう。

1. [macOS版インストール](../installation/macos-installation.md)
2. [Windows版インストール](../installation/windows-installation.md)
3. [Linux版インストール](../installation/linux-installation.md)

---

## まとめ

:::note 要点のまとめ

- 各OS別の詳細なシステム要件を提供
- Node.js 16.x以上が必須環境
- 8GB以上のRAMとSSDストレージを推奨
- 安定したインターネット接続が必須
- 事前準備チェックリストで環境を確認可能

:::

## 関連記事

[macOS版インストール](../installation/macos-installation.md)
[Windows版インストール](../installation/windows-installation.md)
[Linux版インストール](../installation/linux-installation.md)
[認証設定](../installation/authentication-setup.md)