---
title: "trapコマンドのベストプラクティス | シェルスクリプトのシグナル処理"
slug: trap-command
status: publish
post_type: page
seo_keywords: "シェルスクリプト, trapコマンド, シグナル処理, エラーハンドリング, クリーンアップ, ベストプラクティス"
seo_description: "シェルスクリプトにおけるtrapコマンドの使い方とベストプラクティスを解説。シグナル処理、クリーンアップ処理、エラーハンドリングの実装方法を網羅的に説明します。"
tags: ["シェルスクリプト", "trapコマンド", "シグナル処理", "エラーハンドリング", "クリーンアップ", "ベストプラクティス"]
image: "https://example.com/images/shell-script-trap-command.jpg"
parent: "best-practices"
---

## 🎯 はじめに

シェルスクリプトにおける`trap`コマンドは、シグナルをキャッチして特定の処理を実行するための強力な機能です。この機能により、スクリプトの終了時やエラー発生時にクリーンアップ処理を実行したり、ユーザーからの割り込みを適切に処理したりできます。このページでは、`trap`コマンドの基本的な使い方から実践的なベストプラクティスまで詳しく解説します。

### このページで学べること

:::note

このページでは、以下のことを学びます：

- trapコマンドの基本構文と動作原理
- 主要なシグナルの種類と意味
- 終了時のクリーンアップ処理の実装
- エラー時のエラーハンドリング
- ユーザー割り込みの適切な処理
- trapコマンドのベストプラクティス

:::

## 🔧 trapコマンドとは？

`trap`コマンドは、シェルが特定のシグナルを受信した際に指定されたコマンドを実行するように設定する組み込みコマンドです。これにより、スクリプトの終了時や異常終了時に必ず実行される処理を定義できます。

### 基本構文

```bash
trap '実行するコマンド' シグナルリスト
```

### 主要なシグナル一覧

| シグナル | 数字 | 説明 | よく発生する状況 |
|---------|------|------|----------------|
| `EXIT` | 0 | スクリプト終了時 | 正常終了、エラー終了 |
| `ERR` | - | コマンド失敗時 | set -eが有効な場合 |
| `INT` | 2 | 割り込みシグナル | Ctrl+Cが押された場合 |
| `TERM` | 15 | 終了シグナル | killコマンドによる終了 |
| `HUP` | 1 | ハングアップシグナル | 端末が切断された場合 |

## 💡 trapコマンドの基本的な使い方

### 終了時のクリーンアップ

```bash
#!/bin/bash

# 一時ファイルのクリーンアップ
cleanup() {
    echo "クリーンアップ処理を実行中..."
    rm -f /tmp/tempfile_$$
    rm -rf /tmp/tempdir_$$
    echo "クリーンアップ完了"
}

# EXITシグナルをトラップ
trap cleanup EXIT

# メイン処理
echo "メイン処理を開始します"
echo "一時ファイルを作成します"
touch /tmp/tempfile_$$
mkdir -p /tmp/tempdir_$$

# 何らかの処理
sleep 3

echo "メイン処理が完了しました"
```

### エラー処理の実装

```bash
#!/bin/bash

# エラーハンドラー関数
error_handler() {
    local exit_code=$?
    local line_number=$1
    echo "❌ エラーが発生しました (行: $line_number, 終了コード: $exit_code)" >&2

    # エラーログの記録
    echo "$(date): エラー発生 - 行 $line_number, コード $exit_code" >> error.log

    # クリーンアップ処理
    cleanup
}

# ERRシグナルをトラップ
trap 'error_handler $LINENO' ERR

# 厳格なエラーハンドリング
set -euo pipefail

# クリーンアップ関数
cleanup() {
    echo "クリーンアップを実行中..."
    # 一時ファイルの削除など
}
```

## 🛡️ 実践的なシグナル処理

### ユーザー割り込みの処理

```bash
#!/bin/bash

# 割り込みハンドラー
interrupt_handler() {
    echo ""
    echo "⚠️  処理を中断します"
    echo "クリーンアップ処理を実行中..."

    # 重要な処理を中断
    if [ -n "$PID" ]; then
        kill "$PID" 2>/dev/null
    fi

    # クリーンアップ
    cleanup

    echo "処理を終了します"
    exit 1
}

# シグナルの設定
trap interrupt_handler INT TERM

# バックグラウンド処理の開始
long_running_process &
PID=$!

echo "処理を実行中... (Ctrl+Cで中断可能)"
wait $PID

echo "処理が正常に完了しました"
```

### 複数のシグナルを一度に処理

```bash
#!/bin/bash

# 統合シグナルハンドラー
signal_handler() {
    local signal=$1

    case $signal in
        EXIT)
            echo "正常終了処理を実行中..."
            ;;
        ERR)
            echo "エラー終了処理を実行中..."
            ;;
        INT|TERM)
            echo "外部からの終了要求を受け取りました"
            ;;
        *)
            echo "不明なシグナル: $signal"
            ;;
    esac

    # 共通のクリーンアップ
    cleanup
}

# 複数シグナルをトラップ
trap 'signal_handler EXIT' EXIT
trap 'signal_handler ERR' ERR
trap 'signal_handler INT' INT
trap 'signal_handler TERM' TERM
```

## 🏆 ベストプラクティスの実装

### 状態を保持したクリーンアップ

```bash
#!/bin/bash

# グローバル変数
TEMP_FILES=()
TEMP_DIRS=()
PROCESSES=()

# リソース登録関数
register_temp_file() {
    local file="$1"
    TEMP_FILES+=("$file")
    echo "一時ファイルを登録: $file"
}

register_temp_dir() {
    local dir="$1"
    TEMP_DIRS+=("$dir")
    echo "一時ディレクトリを登録: $dir"
}

register_process() {
    local pid="$1"
    PROCESSES+=("$pid")
    echo "プロセスを登録: $pid"
}

# 包括的クリーンアップ関数
cleanup() {
    echo "クリーンアップ処理を開始します"

    # プロセスの終了
    if [ ${#PROCESSES[@]} -gt 0 ]; then
        echo "バックグラウンドプロセスを終了します"
        for pid in "${PROCESSES[@]}"; do
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null
                echo "プロセス $pid を終了しました"
            fi
        done
    fi

    # 一時ファイルの削除
    if [ ${#TEMP_FILES[@]} -gt 0 ]; then
        echo "一時ファイルを削除します"
        for file in "${TEMP_FILES[@]}"; do
            if [ -f "$file" ]; then
                rm -f "$file"
                echo "ファイルを削除: $file"
            fi
        done
    fi

    # 一時ディレクトリの削除
    if [ ${#TEMP_DIRS[@]} -gt 0 ]; then
        echo "一時ディレクトリを削除します"
        for dir in "${TEMP_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                rm -rf "$dir"
                echo "ディレクトリを削除: $dir"
            fi
        done
    fi

    echo "クリーンアップ完了"
}

# トラップの設定
trap cleanup EXIT INT TERM ERR

# リソースの使用例
register_temp_file "/tmp/tempfile_$$"
register_temp_dir "/tmp/tempdir_$$"

touch "/tmp/tempfile_$$"
mkdir -p "/tmp/tempdir_$$"

# バックグラウンド処理
sleep 10 &
register_process $!

# メイン処理
echo "メイン処理を実行中..."
sleep 5
echo "メイン処理完了"
```

### ロギング機能付きエラーハンドリング

```bash
#!/bin/bash

# 設定
LOG_FILE="/var/log/script_$(date +%Y%m%d_%H%M%S).log"
VERBOSE=false

# ロギング関数
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"

    if [ "$VERBOSE" = "true" ]; then
        echo "[$level] $message" >&2
    fi
}

# エラーハンドラー
error_handler() {
    local exit_code=$?
    local line_number=$1
    local command_name="${BASH_COMMAND}"

    log "ERROR" "スクリプトエラー発生"
    log "ERROR" "行番号: $line_number"
    log "ERROR" "終了コード: $exit_code"
    log "ERROR" "コマンド: $command_name"

    # スタックトレースの記録
    local frame=0
    while caller $frame; do
        ((frame++))
    done >> "$LOG_FILE"

    # クリーンアップ
    cleanup

    exit $exit_code
}

# 終了ハンドラー
exit_handler() {
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        log "INFO" "スクリプトが正常に完了しました"
    else
        log "ERROR" "スクリプトが異常終了しました (コード: $exit_code)"
    fi

    cleanup
}

# トラップの設定
trap 'error_handler $LINENO' ERR
trap exit_handler EXIT

# 厳格な設定
set -euo pipefail

# クリーンアップ関数
cleanup() {
    log "INFO" "クリーンアップ処理を開始します"
    # クリーンアップ処理
    log "INFO" "クリーンアップ完了"
}

# メイン処理
main() {
    log "INFO" "スクリプトを開始します"

    # メイン処理の実装
    log "INFO" "処理を実行中..."

    # 何らかの処理
    echo "テスト処理" > /tmp/test.txt

    log "INFO" "メイン処理が完了しました"
}

# メイン関数の実行
main "$@"
```

## 🚀 trapコマンドを動かして確認してみよう

それでは、実際にtrapコマンドを実装して動作を確認してみましょう。

:::step

1. サンプルスクリプトの作成

以下の内容で`trap_example.sh`を作成します。

```bash
#!/bin/bash

# trapコマンドのサンプルスクリプト
set -euo pipefail

# 設定
SCRIPT_NAME="$(basename "$0")"
TEMP_FILES=()
TEMP_DIRS=()
VERBOSE=false
LOG_FILE="/tmp/trap_example_$(date +%Y%m%d_%H%M%S).log"

# ヘルプメッセージ
show_help() {
    cat << EOF
使用方法: $SCRIPT_NAME [オプション]

オプション:
    -h, --help      このヘルプメッセージを表示
    -v, --verbose   詳細出力を有効化
    -d, --duration  処理時間を指定（秒）

例:
    $SCRIPT_NAME --verbose --duration 10
EOF
}

# ロギング関数
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"

    if [ "$VERBOSE" = "true" ]; then
        echo "[$level] $message" >&2
    fi
}

# リソース登録関数
register_temp_file() {
    local file="$1"
    TEMP_FILES+=("$file")
    log "DEBUG" "一時ファイルを登録: $file"
}

register_temp_dir() {
    local dir="$1"
    TEMP_DIRS+=("$dir")
    log "DEBUG" "一時ディレクトリを登録: $dir"
}

# エラーハンドラー
error_handler() {
    local exit_code=$?
    local line_number=$1
    local command_name="${BASH_COMMAND}"

    log "ERROR" "🚨 スクリプトエラーが発生しました！"
    log "ERROR" "行番号: $line_number"
    log "ERROR" "終了コード: $exit_code"
    log "ERROR" "コマンド: $command_name"

    # 通知（可能であれば）
    if command -v notify-send &> /dev/null; then
        notify-send "スクリプトエラー" "$SCRIPT_NAME でエラーが発生しました" --urgency=critical
    fi

    cleanup
    exit $exit_code
}

# 終了ハンドラー
exit_handler() {
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        log "INFO" "✅ スクリプトが正常に完了しました"
    else
        log "ERROR" "❌ スクリプトが異常終了しました (コード: $exit_code)"
    fi

    cleanup
}

# 割り込みハンドラー
interrupt_handler() {
    local signal=$1
    log "WARN" "⚠️ シグナル $signal を受信しました"
    log "WARN" "処理を中断します..."

    # 通知
    if command -v notify-send &> /dev/null; then
        notify-send "スクリプト中断" "$SCRIPT_NAME が中断されました" --urgency=normal
    fi

    cleanup
    exit 1
}

# クリーンアップ関数
cleanup() {
    log "INFO" "🧹 クリーンアップ処理を開始します"

    # 一時ファイルの削除
    if [ ${#TEMP_FILES[@]} -gt 0 ]; then
        log "INFO" "一時ファイルを削除します"
        for file in "${TEMP_FILES[@]}"; do
            if [ -f "$file" ]; then
                rm -f "$file"
                log "DEBUG" "ファイルを削除: $file"
            fi
        done
    fi

    # 一時ディレクトリの削除
    if [ ${#TEMP_DIRS[@]} -gt 0 ]; then
        log "INFO" "一時ディレクトリを削除します"
        for dir in "${TEMP_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                rm -rf "$dir"
                log "DEBUG" "ディレクトリを削除: $dir"
            fi
        done
    fi

    log "INFO" "クリーンアップ完了"
}

# トラップの設定
trap 'error_handler $LINENO' ERR
trap 'exit_handler' EXIT
trap 'interrupt_handler INT' INT
trap 'interrupt_handler TERM' TERM

# メイン処理関数
main() {
    local duration=5

    log "INFO" "🚀 $SCRIPT_NAME を開始します"
    log "INFO" "PID: $$"
    log "INFO" "ログファイル: $LOG_FILE"

    # 一時リソースの作成
    local temp_file="/tmp/trap_test_$$"
    local temp_dir="/tmp/trap_dir_$$"

    register_temp_file "$temp_file"
    register_temp_dir "$temp_dir"

    # リソースの作成
    touch "$temp_file"
    mkdir -p "$temp_dir"

    # テストデータの書き込み
    echo "テストデータ $(date)" > "$temp_file"
    echo "処理時間: $duration 秒" >> "$temp_file"

    log "INFO" "一時ファイルを作成: $temp_file"
    log "INFO" "一時ディレクトリを作成: $temp_dir"

    # メイン処理の実行
    log "INFO" "メイン処理を実行中... (${duration}秒間)"

    for ((i=1; i<=duration; i++)); do
        log "INFO" "処理中... ($i/$duration)"
        sleep 1

        # ファイルへの書き込み（テスト用）
        echo "$(date): 処理ステップ $i" >> "$temp_file"
    done

    log "INFO" "メイン処理が完了しました"

    # 結果の確認
    log "INFO" "結果を確認します"
    if [ -f "$temp_file" ]; then
        log "INFO" "作成されたファイルの内容:"
        cat "$temp_file" | while read line; do
            log "INFO" "  $line"
        done
    fi
}

# 引数の解析
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -d|--duration)
            DURATION="$2"
            shift 2
            ;;
        *)
            log "ERROR" "不明なオプション: $1"
            show_help
            exit 1
            ;;
    esac
done

# メイン関数の実行
main "$@"
```

2. 実行権限の付与

```bash
chmod +x trap_example.sh
```

3. 正常実行のテスト

```bash
./trap_example.sh --verbose --duration 5
```

4. ログファイルの確認

```bash
cat /tmp/trap_example_*.log
```

5. 割り込みテスト

```bash
./trap_example.sh --duration 30
```

実行中に Ctrl+C を押して割り込みをテストします。

6. エラーケースのテスト

わざとエラーを発生させるスクリプトを作成：

```bash
#!/bin/bash
# エラーテスト用スクリプト
source ./trap_example.sh

# わざとエラーを発生させるコマンド
ls /nonexistent/directory
```

:::

## 📋 trapコマンドのベストプラクティス

### 推奨されるパターン

1. **必ずクリーンアップを実装**: EXITシグナルをトラップしてリソースを解放
2. **エラー処理の実装**: ERRシグナルをトラップして適切なエラーハンドリング
3. **割り込み処理の実装**: INT, TERMシグナルをトラップして外部からの終了要求に対応
4. **ロギングの統合**: エラーや終了時にログを記録
5. **リソース管理**: 一時ファイルやプロセスを適切に管理

### 避けるべきパターン

```bash
# ❌ 悪い例：リソースリーク
trap 'echo "終了します"' EXIT
# 一時ファイルを作成しているが削除していない

# ❌ 悪い例：再帰的なトラップ
trap 'trap "echo "再帰"" INT' INT

# ❌ 悪い例：不完全なクリーンアップ
trap 'rm -f /tmp/file' EXIT
# ディレクトリや他のリソースを解放していない
```

## まとめ

`trap`コマンドは、シェルスクリプトの信頼性と堅牢性を向上させるための必須テクニックです。適切なシグナル処理を実装することで、エラー時の適切なクリーンアップ、ユーザー割り込みへの対応、ログ記録などが可能になります。

:::note 要点のまとめ

- **基本的な使い方**: `trap 'コマンド' シグナル`の形式で使用
- **主要なシグナル**: EXIT（終了時）、ERR（エラー時）、INT/TERM（割り込み時）
- **クリーンアップ**: 必ず一時リソースを解放する処理を実装
- **エラーハンドリング**: エラー時の詳細情報を記録する
- **ベストプラクティス**: 状態を保持した包括的なクリーンアップを実装

:::

適切な`trap`コマンドの使用により、本番環境で実行されるシェルスクリプトの信頼性を大幅に向上させることができます。特に長時間実行されるスクリプトや重要なデータを扱うスクリプトでは、必ず実装すべき機能です。

## 関連リンク

- [set -e -u -x -o pipefailのベストプラクティス](./set-e-u-x-o-pipefail)
- [終了コードチェックのベストプラクティス](./exit-code-checking)
- [シェルスクリプトのシグナル処理](../../advanced/signals)

## さらに深く学習したい方へ

trapコマンドとシグナル処理をさらに深く学びたい方は、当社の研修プログラムをご利用ください。実践的な演習を通じて、堅牢なシェルスクリプトの作成技術を習得できます。