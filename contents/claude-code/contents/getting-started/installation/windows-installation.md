---
title: Windows版インストール
slug: windows-installation
parent: installation
status: published
filepath: contents/getting-started/installation/windows-installation.md
post_type: pages
goal: Windows環境でのClaude Code具体的なインストール手順を提供し、WindowsユーザーがWSL環境も含めて適切にセットアップできるようにする
seo_title: Claude Code Windows版インストール | Windows・WSL環境対応
seo_description: Windows環境でのClaude Code詳細インストール手順。PowerShellでの実行からWSL環境での設定、環境変数の設定まで、Windows特有の課題と解決法を詳しく解説します。
seo_keywords: Claude Code Windows, WSL インストール, PowerShell, 環境変数
handson_overview: WindowsとWSL両環境でのClaude Codeセットアップと動作確認
---

# Windows版インストールガイド

このガイドでは、Windows環境でClaude Codeをインストールする手順を詳しく解説します。PowerShellを使用した直接インストールと、WSL（Windows Subsystem for Linux）を使用したLinux環境でのインストール、両方の方法をカバーします。

:::note このガイドで学べること

- PowerShellを使った直接インストール方法
- WSLを使用したLinux環境インストール
- 環境変数の設定方法
- Windows特有の問題と解決策
- 両環境での動作確認手順

:::

## 前提条件

### 必要なシステム
- Windows 10 バージョン 2004 以降（ビルド 19041 以上）
- Windows 11
- 管理者権限
- 安定したインターネット接続

### 推奨環境
- 8GB以上のRAM
- 20GB以上の空きディスク容量
- SSDストレージ

## 方法1: PowerShellでの直接インストール

:::step

1. PowerShellを管理者として起動

まず、PowerShellを管理者権限で起動します。

- **スタートメニュー** → 「PowerShell」を右クリック → 「管理者として実行」
- または「Windowsキー + X」 → 「Windows PowerShell（管理者）」

2. 実行ポリシーの確認

PowerShellの実行ポリシーを確認し、必要に応じて変更します。

_コマンド実行_
```powershell
Get-ExecutionPolicy
```

`Restricted`と表示される場合は、実行ポリシーを変更します。

_コマンド実行_
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

「Y」を押して変更を確認します。

3. Node.jsのインストール

Windows用のNode.jsインストーラーをダウンロードしてインストールします。

_コマンド実行_
```powershell
# Node.jsのダウンロード（最新のLTSバージョン）
Invoke-WebRequest -Uri "https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi" -OutFile "nodejs-installer.msi"

# インストーラーの実行
Start-Process msiexec.exe -ArgumentList "/i nodejs-installer.msi /quiet" -Wait
```

または、公式サイトから手動でダウンロードしてインストールすることもできます。

4. インストールの確認

Node.jsとnpmが正しくインストールされたか確認します。

_コマンド実行_
```powershell
node --version
npm --version
```

バージョンが表示されればOKです。

5. Claude Codeのインストール

npmを使ってClaude Codeをインストールします。

_コマンド実行_
```powershell
npm install -g @anthropic-ai/claude-code
```

6. 環境変数の設定

Node.jsのグローバルパッケージがシステムのPATHに追加されているか確認します。

_コマンド実行_
```powershell
$env:PATH -split ";" | Where-Object { $_ -like "*node_modules*" }
```

表示されない場合は、手動でPATHを追加します。

_コマンド実行_
```powershell
# Node.jsのグローバルパスを取得
$nodePath = npm config get prefix
$claudePath = Join-Path $nodePath "node_modules\.bin"

# ユーザー環境変数に追加
[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$claudePath", "User")

# 現在のセッションにも反映
$env:PATH += ";$claudePath"
```

7. インストールの確認

Claude Codeが正しくインストールされたか確認します。

_コマンド実行_
```powershell
claude --version
```

8. 認証設定

初回起動時に認証設定を行います。

_コマンド実行_
```powershell
claude init
```

Anthropicアカウントから取得したAPIキーを設定します。

_コマンド実行_
```powershell
claude config set api-key YOUR_API_KEY_HERE
```

:::

## 方法2: WSLを使用したインストール

:::step

1. WSLの有効化

まず、WSLを有効にします。PowerShellを管理者として実行し、以下のコマンドを実行します。

_コマンド実行_
```powershell
wsl --install
```

このコマンドにより、WSLとUbuntuがインストールされます。インストール後、PCを再起動します。

2. Ubuntuの初期設定

再起動後、Ubuntuを起動し、ユーザー名とパスワードを設定します。

3. パッケージの更新

Ubuntuターミナルでパッケージを更新します。

_コマンド実行_
```bash
sudo apt update && sudo apt upgrade -y
```

4. Node.jsのインストール

Node.jsをインストールします。

_コマンド実行_
```bash
# Node.jsのリポジトリを追加
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.jsをインストール
sudo apt-get install -y nodejs
```

5. インストールの確認

_コマンド実行_
```bash
node --version
npm --version
```

6. Claude Codeのインストール

_コマンド実行_
```bash
npm install -g @anthropic-ai/claude-code
```

7. 認証設定

_コマンド実行_
```bash
claude init
claude config set api-key YOUR_API_KEY_HERE
```

:::

## Windows環境でのトラブルシューティング

### パスの問題

Node.jsやClaude Codeが見つからない場合、以下の方法でPATHを確認・設定します。

#### 方法1: システム環境変数の確認
1. Windowsキー + R を押して「sysdm.cpl」と入力
2. 「詳細設定」タブ → 「環境変数」
3. 「Path」を選択して「編集」
4. Node.jsのパス（通常は `C:\Program Files\nodejs\`）が含まれているか確認

#### 方法2: PowerShellでPATHを再設定
```powershell
# Node.jsのインストールパスを確認
$nodePath = "C:\Program Files\nodejs\"
# ユーザーPATHに追加
[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$nodePath", "User")
```

### ファイアウォールの問題

Claude Codeがインターネットにアクセスできない場合、ファイアウォールの設定を確認します。

1. Windowsセキュリティ → ファイアウォールとネットワーク保護
2. 「ファイアウォールによるアプリの許可」
3. Node.jsやPowerShellの設定を確認

### 権限の問題

管理者権限が必要な操作でエラーが発生する場合：

1. PowerShellを必ず管理者として実行
2. ユーザーアカウント制御（UAC）の設定を確認
3. ウイルス対策ソフトの一時停止を検討

### WSL関連の問題

#### WSLが起動しない
```powershell
# WSLの再インストール
wsl --unregister Ubuntu
wsl --install -d Ubuntu
```

#### ネットワーク接続の問題
```bash
# WSL内でのDNS設定
sudo echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null
```

## 開発環境の最適化

### Windows Terminalのインストール
より快適なターミナル環境のために、Windows Terminalをインストールします。

```powershell
# Microsoft Storeからインストール
winget install Microsoft.WindowsTerminal
```

### VS Codeとの連携
VS CodeでWSL環境を直接操作できるように設定します。

```powershell
# VS CodeのWSL拡張機能のインストール
code --install-extension ms-vscode-remote.remote-wsl
```

### Gitの設定
WindowsとWSL間でGit設定を共有します。

```bash
# WSL内でのGit設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.autocrlf true
```

## 次のステップ

インストールが完了したら、次のステップに進みましょう。

1. [認証設定の確認](../installation/authentication-setup.md)
2. [基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)
3. [CLAUDE.mdの設定](../initial-setup/claude-md-setup.md)

---

## まとめ

:::note 要点のまとめ

- PowerShellでの直接インストールとWSLインストールの2つの方法を提供
- 環境変数PATHの設定がWindowsでは特に重要
- 管理者権限と実行ポリシーの確認が必要
- WSLはLinux環境とほぼ同じ手順で利用可能
- 両環境での動作確認を行うことが推奨

:::

## 関連記事

[macOS版インストール](./macos-installation.md)
[Linux版インストール](./linux-installation.md)
[認証設定](./authentication-setup.md)
[基本操作チュートリアル](../basic-tutorial/basic-tutorial.md)