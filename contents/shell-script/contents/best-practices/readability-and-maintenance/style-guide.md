---
title: "シェルスクリプトのスタイルガイドとコーディング規約 | 可読性向上のためのベストプラクティス"
slug: style-guide
status: publish
post_type: page
seo_keywords: "シェルスクリプト, スタイルガイド, コーディング規約, 可読性, コーディングスタイル, ベストプラクティス"
seo_description: "シェルスクリプトのスタイルガイドとコーディング規約について詳しく解説。命名規則、インデント、コメントの書き方など、可読性を向上させるための実践的なルールを紹介します。"
tags: ["シェルスクリプト", "スタイルガイド", "コーディング規約", "可読性", "命名規則", "ベストプラクティス"]
image: "https://example.com/images/shell-script-style-guide.jpg"
parent: "best-practices"
---

## 📝 はじめに

シェルスクリプトの可読性は、コードの保守性やチームでの協業効率に直接影響します。一貫したコーディングスタイルと規約を適用することで、コードの理解が容易になり、バグの発見や機能追加がスムーズになります。このページでは、シェルスクリプト開発におけるスタイルガイドとコーディング規約について、実践的なルールと例を交えて詳しく解説します。

### このページで学べること

:::note

このページでは、以下のことを学びます：

- ファイル構成とヘッダーコメントの書き方
- 命名規則（変数、関数、ファイル）
- インデントとフォーマットのルール
- コメントの種類と書き方
- コードの構成とモジュール化
- エラーハンドリングのスタイル
- チーム開発での規約の適用方法

:::

## 📁 ファイル構成と基本ルール

### ファイルの基本構造

```bash
#!/bin/bash
# =====================================================================
# スクリプト名: データ処理スクリプト
# 作成者: チーム名
# 作成日: 2024-01-15
# 概要: データファイルの処理と集計を行うスクリプト
# 使用方法: ./data_processor.sh input.txt output.txt
# 引数:
#   $1: 入力ファイルパス
#   $2: 出力ファイルパス
# 終了コード:
#   0: 正常終了
#   1: 引数エラー
#   2: ファイルエラー
# =====================================================================

set -euo pipefail

# 定数の定義
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"
readonly TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"

# グローバル変数の定義
declare -g INPUT_FILE=""
declare -g OUTPUT_FILE=""
declare -g ERROR_COUNT=0

# メイン処理の呼び出し
main "$@"
```

### シバンのルール

```bash
# ✅ 推奨されるシバン
#!/bin/bash          # 明示的にbashを指定
#!/usr/bin/env bash  # 環境依存を避ける場合

# ❌ 避けるべきシバン
#!/bin/sh           # bash固有の機能が使えない
#!/bin/bash         # スペースを含めない
```

## 🔤 命名規則

### 変数の命名規則

```bash
# ✅ 良い例: 一貫した命名規則
readonly MAX_RETRIES=5
readonly CONFIG_FILE="/etc/app/config.ini"
readonly LOG_LEVEL="INFO"

local user_name="john_doe"
local file_path="/tmp/data_${TIMESTAMP}.txt"
local is_enabled=true

# グローバル変数（最小限に）
declare -g GLOBAL_COUNTER=0
declare -g -a GLOBAL_ARRAY=()

# ❌ 悪い例: 不一貫な命名
maxRetries=5           # キャメルケース
ConfigFile="/etc/..."  # 大文字始まり
local username="john"  # アンダースコアなし
```

### 関数の命名規則

```bash
# ✅ 良い例: 動詞-名詞の形式
validate_input() {
    local input="$1"
    # バリデーション処理
}

process_data() {
    local file="$1"
    # データ処理
}

check_file_exists() {
    local file_path="$1"
    # ファイル存在チェック
}

# プライベート関数（_プレフィックス）
_cleanup_temp_files() {
    # 内部クリーンアップ処理
}

# ❌ 悪い例: 不適切な命名
ValidateInput() { ... }      # 大文字始まり
processdata() { ... }        # アンダースコアなし
fileCheck() { ... }          # 名詞-動詞の順序
```

### 定数の命名規則

```bash
# ✅ 良い例: 大文字とアンダースコア
readonly APP_NAME="MyApplication"
readonly APP_VERSION="1.0.0"
readonly MAX_CONNECTIONS=100
readonly DEFAULT_TIMEOUT=30

readonly ERROR_FILE_NOT_FOUND=2
readonly ERROR_PERMISSION_DENIED=3

# ❌ 悪い例: 小文字やキャメルケース
readonly appname="MyApplication"
readonly MaxConnections=100
```

## 📐 インデントとフォーマット

### インデントのルール

```bash
# ✅ 良い例: 4スペースのインデント
if [ "$DEBUG" = "true" ]; then
    echo "デバッグモードが有効です"
    if [ -f "$LOG_FILE" ]; then
        echo "ログファイル: $LOG_FILE"
    fi
fi

# 関数のインデント
process_file() {
    local file="$1"

    if [ ! -f "$file" ]; then
        echo "エラー: ファイルが見つかりません"
        return 1
    fi

    while IFS= read -r line; do
        echo "処理中: $line"
    done < "$file"
}

# ❌ 悪い例: タブや不適切なインデント
if [ "$DEBUG" = "true" ]; then
echo "デバッグモードが有効です"
if [ -f "$LOG_FILE" ]; then
echo "ログファイル: $LOG_FILE"
fi
fi
```

### 長い行の分割

```bash
# ✅ 良い例: 適切な行分割
if [ "${PROCESSING_MODE}" = "batch" ] && \
   [ "${FILE_COUNT}" -gt "${MAX_FILES}" ] && \
   [ "${CURRENT_TIME}" -lt "${DEADLINE}" ]; then
    echo "バッチ処理を開始します"
fi

# 関数呼び出しの分割
process_data "$INPUT_FILE" \
             "$OUTPUT_FILE" \
             "--verbose" \
             "--validate"

# ❌ 悪い例: 長すぎる行
if [ "${PROCESSING_MODE}" = "batch" ] && [ "${FILE_COUNT}" -gt "${MAX_FILES}" ] && [ "${CURRENT_TIME}" -lt "${DEADLINE}" ]; then
```

### 条件式のフォーマット

```bash
# ✅ 良い例: 読みやすい条件式
if [ -f "$file" ] && [ -r "$file" ]; then
    echo "ファイルは存在し、読み取り可能です"
fi

# 複雑な条件式は変数に分ける
local should_process=false
if [ "${ENABLE_PROCESSING}" = "true" ] && \
   [ "${FILE_SIZE}" -gt "${MIN_SIZE}" ] && \
   [ "${CURRENT_TIME}" -lt "${DEADLINE}" ]; then
    should_process=true
fi

if $should_process; then
    process_file "$file"
fi

# ❌ 悪い例: 複雑な一行の条件式
if [ "${ENABLE_PROCESSING}" = "true" ] && [ "${FILE_SIZE}" -gt "${MIN_SIZE}" ] && [ "${CURRENT_TIME}" -lt "${DEADLINE}" ]; then
```

## 💬 コメントのスタイル

### ヘッダーコメント

```bash
# =====================================================================
# 関数名: validate_user_input
# 概要: ユーザー入力を検証する
# 引数:
#   $1: 検証する入力文字列
#   $2: 検証タイプ (email|phone|name)
# 戻り値:
#   0: 検証成功
#   1: 検証失敗
# 副作用:
#   エラーメッセージを標準エラー出力に出力
# =====================================================================
validate_user_input() {
    local input="$1"
    local validation_type="$2"

    case "$validation_type" in
        "email")
            if [[ ! "$input" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
                echo "エラー: 無効なメールアドレス形式です" >&2
                return 1
            fi
            ;;
        "phone")
            if [[ ! "$input" =~ ^[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}$ ]]; then
                echo "エラー: 無効な電話番号形式です" >&2
                return 1
            fi
            ;;
        *)
            echo "エラー: 不明な検証タイプです: $validation_type" >&2
            return 1
            ;;
    esac

    return 0
}
```

### インラインコメント

```bash
# ✅ 良い例: 意味のあるインラインコメント
local user_count=$(wc -l < "$user_file")  # アクティブユーザー数を取得
local disk_usage=$(df "$mount_point" | awk 'NR==2 {print $5}' | tr -d '%')  # ディスク使用率をパーセントで取得

# 設定ファイルの読み込み（デフォルト値付き）
local timeout="${CONFIG_TIMEOUT:-30}"  # デフォルト30秒
local retry_count="${MAX_RETRIES:-3}"  # デフォルト3回

# ❌ 悪い例: 明白なコメントや不要なコメント
local count=5  # カウントを5に設定
echo "hello"   # helloを表示
```

### セクションコメント

```bash
# =====================================================================
# 設定の読み込み
# =====================================================================

load_configuration() {
    local config_file="$1"

    # 設定ファイルの存在確認
    if [ ! -f "$config_file" ]; then
        echo "設定ファイルが見つかりません: $config_file" >&2
        return 1
    fi

    # 設定値の読み込み
    while IFS='=' read -r key value; do
        # コメント行と空行をスキップ
        [[ "$key" =~ ^# ]] && continue
        [[ -z "$key" ]] && continue

        # 設定値の適用
        case "$key" in
            "LOG_LEVEL")
                LOG_LEVEL="$value"
                ;;
            "TIMEOUT")
                TIMEOUT="$value"
                ;;
            *)
                echo "警告: 不明な設定キー: $key" >&2
                ;;
        esac
    done < "$config_file"
}

# =====================================================================
# データ処理
# =====================================================================

process_data() {
    # データ処理の実装...
}
```

## 🏗️ コードの構成とモジュール化

### 関数のグループ化

```bash
# =====================================================================
# ユーティリティ関数群
# =====================================================================

# ログ出力関数
log_info() {
    local message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $message" | tee -a "$LOG_FILE"
}

log_error() {
    local message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $message" >&2 | tee -a "$ERROR_LOG"
}

# ファイル操作関数
create_backup() {
    local source_file="$1"
    local backup_file="${source_file}.backup.$(date '+%Y%m%d_%H%M%S')"

    if [ ! -f "$source_file" ]; then
        log_error "バックアップ元ファイルが見つかりません: $source_file"
        return 1
    fi

    cp "$source_file" "$backup_file"
    log_info "バックアップ作成: $backup_file"

    return 0
}

# =====================================================================
# メイン処理関数
# =====================================================================

main() {
    # メイン処理の実装...
}
```

### 設定の分離

```bash
# config.sh - 設定ファイル
#!/bin/bash

# アプリケーション設定
readonly APP_NAME="DataProcessor"
readonly APP_VERSION="1.0.0"

# デフォルト値
readonly DEFAULT_TIMEOUT=30
readonly DEFAULT_RETRIES=3
readonly DEFAULT_LOG_LEVEL="INFO"

# 環境変数から設定を上書き（設定ファイルより優先）
readonly TIMEOUT="${APP_TIMEOUT:-$DEFAULT_TIMEOUT}"
readonly RETRIES="${APP_RETRIES:-$DEFAULT_RETRIES}"
readonly LOG_LEVEL="${APP_LOG_LEVEL:-$DEFAULT_LOG_LEVEL}"

# パス設定
readonly DATA_DIR="${DATA_DIR:-/var/data}"
readonly LOG_DIR="${LOG_DIR:-/var/log}"
readonly TEMP_DIR="${TEMP_DIR:-/tmp}"

# エラーコード定義
readonly EXIT_SUCCESS=0
readonly EXIT_ERROR=1
readonly EXIT_FILE_NOT_FOUND=2
readonly EXIT_PERMISSION_DENIED=3
readonly EXIT_TIMEOUT=4
```

## 🛡️ エラーハンドリングのスタイル

### 一貫したエラーハンドリング

```bash
# ✅ 良い例: 一貫したエラーハンドリング
process_file() {
    local input_file="$1"
    local output_file="$2"

    # 入力ファイルの検証
    if [ ! -f "$input_file" ]; then
        log_error "入力ファイルが見つかりません: $input_file"
        return $EXIT_FILE_NOT_FOUND
    fi

    if [ ! -r "$input_file" ]; then
        log_error "入力ファイルを読み取れません: $input_file"
        return $EXIT_PERMISSION_DENIED
    fi

    # 出力ディレクトリの準備
    local output_dir=$(dirname "$output_file")
    if [ ! -d "$output_dir" ]; then
        if ! mkdir -p "$output_dir"; then
            log_error "出力ディレクトリを作成できません: $output_dir"
            return $EXIT_PERMISSION_DENIED
        fi
    fi

    # データ処理の実行
    if ! _process_data_internal "$input_file" "$output_file"; then
        log_error "データ処理に失敗しました: $input_file"
        return $EXIT_ERROR
    fi

    log_info "ファイル処理が正常に完了しました: $input_file → $output_file"
    return $EXIT_SUCCESS
}

# ❌ 悪い例: 不統一なエラーハンドリング
process_file() {
    local input_file="$1"
    local output_file="$2"

    if [ ! -f "$input_file" ]; then
        echo "ファイルがないよ"  # 不適切なエラーメッセージ
        exit 1  # exitを使用
    fi

    # エラーチェックなしで処理を継続
    cat "$input_file" > "$output_file"
}
```

### リソースのクリーンアップ

```bash
# ✅ 良い例: 適切なクリーンアップ
process_with_temp_files() {
    local temp_file1=$(mktemp)
    local temp_file2=$(mktemp)
    local cleanup_needed=true

    # トラップでクリーンアップを設定
    trap '_cleanup_temp_files "$temp_file1" "$temp_file2"' EXIT

    try {
        # 処理の実行
        process_step1 "$input_file" "$temp_file1"
        process_step2 "$temp_file1" "$temp_file2"
        process_step3 "$temp_file2" "$output_file"

        # 正常終了時はクリーンアップ不要
        cleanup_needed=false
    } catch {
        log_error "処理中にエラーが発生しました"
        return $EXIT_ERROR
    }

    # 手動クリーンアップ（トラップが呼ばれない場合）
    if $cleanup_needed; then
        _cleanup_temp_files "$temp_file1" "$temp_file2"
    fi

    return $EXIT_SUCCESS
}

_cleanup_temp_files() {
    local file1="$1"
    local file2="$2"

    [ -f "$file1" ] && rm -f "$file1"
    [ -f "$file2" ] && rm -f "$file2"
}
```

## 🚀 スタイルガイドを動かして確認してみよう

それでは、実際にスタイルガイドに沿ったスクリプトを作成して、一貫性の重要性を確認してみましょう。

:::step

1. スタイルガイド準拠スクリプトの作成

以下の内容で`styled_script.sh`を作成します。

```bash
#!/bin/bash
# =====================================================================
# スクリプト名: ログファイルアナライザー
# 作成者: 開発チーム
# 作成日: 2024-01-15
# 概要: ログファイルを分析し、エラーパターンを統計する
# 使用方法: ./log_analyzer.sh <ログファイル> [出力ファイル]
# 引数:
#   $1: 分析対象のログファイル
#   $2: 出力ファイル（オプション、デフォルト: analysis_report.txt）
# 終了コード:
#   0: 正常終了
#   1: 引数エラー
#   2: ファイルアクセスエラー
#   3: 処理エラー
# =====================================================================

set -euo pipefail

# 定数の定義
readonly SCRIPT_VERSION="1.0.0"
readonly DEFAULT_OUTPUT_FILE="analysis_report.txt"
readonly TEMP_DIR="/tmp/log_analyzer"
readonly MAX_LINE_LENGTH=1000

# 終了コードの定義
readonly EXIT_SUCCESS=0
readonly EXIT_INVALID_ARGS=1
readonly EXIT_FILE_NOT_FOUND=2
readonly EXIT_PERMISSION_DENIED=3
readonly EXIT_PROCESS_ERROR=4

# グローバル変数の定義（最小限）
declare -g LOG_FILE=""
declare -g OUTPUT_FILE=""
declare -g TOTAL_LINES=0
declare -g ERROR_COUNT=0
declare -g WARNING_COUNT=0

# =====================================================================
# ユーティリティ関数群
# =====================================================================

# ログ出力関数
log_info() {
    local message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $message"
}

log_error() {
    local message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $message" >&2
}

log_warning() {
    local message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $message" >&2
}

# ファイル検証関数
validate_file() {
    local file_path="$1"
    local required_permission="${2:-r}"

    if [ ! -f "$file_path" ]; then
        log_error "ファイルが見つかりません: $file_path"
        return $EXIT_FILE_NOT_FOUND
    fi

    case "$required_permission" in
        "r")
            if [ ! -r "$file_path" ]; then
                log_error "ファイルを読み取れません: $file_path"
                return $EXIT_PERMISSION_DENIED
            fi
            ;;
        "w")
            if [ ! -w "$file_path" ]; then
                log_error "ファイルに書き込めません: $file_path"
                return $EXIT_PERMISSION_DENIED
            fi
            ;;
        "rw")
            if [ ! -r "$file_path" ] || [ ! -w "$file_path" ]; then
                log_error "ファイルの読み書きができません: $file_path"
                return $EXIT_PERMISSION_DENIED
            fi
            ;;
    esac

    return $EXIT_SUCCESS
}

# 一時ディレクトリの作成
create_temp_dir() {
    if [ ! -d "$TEMP_DIR" ]; then
        if ! mkdir -p "$TEMP_DIR"; then
            log_error "一時ディレクトリを作成できません: $TEMP_DIR"
            return $EXIT_PERMISSION_DENIED
        fi
    fi

    return $EXIT_SUCCESS
}

# =====================================================================
# データ処理関数群
# =====================================================================

# エラーパターンの抽出
extract_error_patterns() {
    local input_file="$1"
    local temp_file="$2"

    log_info "エラーパターンの抽出を開始します"

    # エラーログの抽出
    if ! grep -i "error\|exception\|failed\|critical" "$input_file" > "$temp_file/errors.txt"; then
        log_warning "エラーログが見つかりませんでした"
        return $EXIT_SUCCESS
    fi

    # エラーの種類別に分類
    awk '{
        if (tolower($0) ~ /connection/) print "CONNECTION:" $0
        else if (tolower($0) ~ /timeout/) print "TIMEOUT:" $0
        else if (tolower($0) ~ /permission/) print "PERMISSION:" $0
        else if (tolower($0) ~ /memory/) print "MEMORY:" $0
        else print "OTHER:" $0
    }' "$temp_file/errors.txt" > "$temp_file/categorized_errors.txt"

    log_info "エラーパターンの抽出が完了しました"
    return $EXIT_SUCCESS
}

# 統計情報の計算
calculate_statistics() {
    local input_file="$1"
    local temp_file="$2"

    log_info "統計情報の計算を開始します"

    # 総行数のカウント
    TOTAL_LINES=$(wc -l < "$input_file")

    # エラー数のカウント
    if [ -f "$temp_file/errors.txt" ]; then
        ERROR_COUNT=$(wc -l < "$temp_file/errors.txt")
    fi

    # 警告数のカウント
    WARNING_COUNT=$(grep -i "warning\|warn" "$input_file" | wc -l)

    # 時間帯別のエラー集計
    awk '/[0-9]{2}:[0-9]{2}:[0-9]{2}/ {
        match($0, /([0-9]{2}):([0-9]{2}):/, time_array)
        hour = time_array[1]
        if (hour >= 0 && hour <= 23) {
            hour_count[hour]++
        }
    }
    END {
        print "時間帯別エラー統計:"
        for (i = 0; i < 24; i++) {
            printf "%02d:00-%02d:00: %d件\n", i, i+1, hour_count[i]+0
        }
    }' "$input_file" > "$temp_file/hourly_stats.txt"

    log_info "統計情報の計算が完了しました"
    return $EXIT_SUCCESS
}

# レポートの生成
generate_report() {
    local temp_file="$1"
    local output_file="$2"

    log_info "分析レポートの生成を開始します"

    {
        echo "ログファイル分析レポート"
        echo "生成日時: $(date)"
        echo "スクリプトバージョン: $SCRIPT_VERSION"
        echo "対象ファイル: $LOG_FILE"
        echo "========================================"
        echo ""

        echo "基本統計:"
        echo "  総行数: $TOTAL_LINES"
        echo "  エラー数: $ERROR_COUNT"
        echo "  警告数: $WARNING_COUNT"
        if [ "$TOTAL_LINES" -gt 0 ]; then
            local error_rate=$((ERROR_COUNT * 100 / TOTAL_LINES))
            echo "  エラー率: ${error_rate}%"
        fi
        echo ""

        if [ "$ERROR_COUNT" -gt 0 ]; then
            echo "エラーパターン分析:"
            if [ -f "$temp_file/categorized_errors.txt" ]; then
                awk -F: '{
                    pattern = $1
                    count[pattern]++
                }
                END {
                    for (p in count) {
                        printf "  %s: %d件\n", p, count[p]
                    }
                }' "$temp_file/categorized_errors.txt"
            fi
            echo ""
        fi

        if [ -f "$temp_file/hourly_stats.txt" ]; then
            echo "時間帯別エラー分布:"
            cat "$temp_file/hourly_stats.txt"
            echo ""
        fi

        echo "上位10エラーメッセージ:"
        if [ -f "$temp_file/errors.txt" ]; then
            sort "$temp_file/errors.txt" | uniq -c | sort -nr | head -10 | \
                awk '{printf "  %d件: %s\n", $1, substr($0, index($0,$2))}'
        fi

    } > "$output_file"

    log_info "分析レポートが生成されました: $output_file"
    return $EXIT_SUCCESS
}

# =====================================================================
# メイン処理
# =====================================================================

# 使用方法の表示
show_usage() {
    cat << EOF
使用方法: $0 <ログファイル> [出力ファイル]

引数:
  <ログファイル>     分析対象のログファイルパス
  [出力ファイル]   出力ファイルパス（デフォルト: $DEFAULT_OUTPUT_FILE）

オプション:
  -h, --help        このヘルプを表示
  -v, --version     バージョン情報を表示

例:
  $0 /var/log/application.log
  $0 /var/log/application.log custom_report.txt
EOF
}

# バージョン情報の表示
show_version() {
    echo "ログファイルアナライザー バージョン $SCRIPT_VERSION"
}

# 引数の解析
parse_arguments() {
    local args=("$@")
    local i=0

    while [ $i -lt ${#args[@]} ]; do
        case "${args[$i]}" in
            "-h"|"--help")
                show_usage
                exit $EXIT_SUCCESS
                ;;
            "-v"|"--version")
                show_version
                exit $EXIT_SUCCESS
                ;;
            -*)
                log_error "不明なオプションです: ${args[$i]}"
                show_usage
                exit $EXIT_INVALID_ARGS
                ;;
            *)
                if [ -z "$LOG_FILE" ]; then
                    LOG_FILE="${args[$i]}"
                elif [ -z "$OUTPUT_FILE" ]; then
                    OUTPUT_FILE="${args[$i]}"
                else
                    log_error "引数が多すぎます"
                    show_usage
                    exit $EXIT_INVALID_ARGS
                fi
                ;;
        esac
        ((i++))
    done

    # 必須引数のチェック
    if [ -z "$LOG_FILE" ]; then
        log_error "ログファイルを指定してください"
        show_usage
        exit $EXIT_INVALID_ARGS
    fi

    # 出力ファイルのデフォルト値設定
    OUTPUT_FILE="${OUTPUT_FILE:-$DEFAULT_OUTPUT_FILE}"
}

# メイン関数
main() {
    log_info "ログファイル分析を開始します"

    # 引数の解析
    parse_arguments "$@"

    log_info "入力ファイル: $LOG_FILE"
    log_info "出力ファイル: $OUTPUT_FILE"

    # ファイルの検証
    if ! validate_file "$LOG_FILE" "r"; then
        exit $?
    fi

    # 出力ディレクトリの準備
    local output_dir=$(dirname "$OUTPUT_FILE")
    if [ ! -d "$output_dir" ]; then
        if ! mkdir -p "$output_dir"; then
            log_error "出力ディレクトリを作成できません: $output_dir"
            exit $EXIT_PERMISSION_DENIED
        fi
    fi

    # 一時ディレクトリの作成
    if ! create_temp_dir; then
        exit $?
    fi

    # 一時ファイルの準備
    local temp_file_base="$TEMP_DIR/analysis_$$"
    local temp_files=()

    # クリーンアップ用のトラップ
    trap '_cleanup_temp_files "${temp_files[@]}"' EXIT

    # 処理の実行
    {
        log_info "ステップ1: エラーパターンの抽出"
        temp_files+=("$temp_file_base" "$temp_file_base/errors.txt" "$temp_file_base/categorized_errors.txt")
        if ! extract_error_patterns "$LOG_FILE" "$temp_file_base"; then
            exit $EXIT_PROCESS_ERROR
        fi

        log_info "ステップ2: 統計情報の計算"
        temp_files+=("$temp_file_base/hourly_stats.txt")
        if ! calculate_statistics "$LOG_FILE" "$temp_file_base"; then
            exit $EXIT_PROCESS_ERROR
        fi

        log_info "ステップ3: レポートの生成"
        if ! generate_report "$temp_file_base" "$OUTPUT_FILE"; then
            exit $EXIT_PROCESS_ERROR
        fi

    } || {
        log_error "処理中にエラーが発生しました"
        exit $EXIT_PROCESS_ERROR
    }

    log_info "ログファイル分析が正常に完了しました"
    log_info "レポートファイル: $OUTPUT_FILE"

    return $EXIT_SUCCESS
}

# 一時ファイルのクリーンアップ
_cleanup_temp_files() {
    local files=("$@")

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
        fi
    done

    if [ -d "$TEMP_DIR" ]; then
        # 空の場合のみディレクトリを削除
        rmdir "$TEMP_DIR" 2>/dev/null || true
    fi
}

# スクリプトの実行
main "$@"
```

2. 実行権限の付与

```bash
chmod +x styled_script.sh
```

3. テストデータの作成

```bash
# サンプルログファイルの作成
cat > sample.log << 'EOF'
2024-01-15 10:15:23 [INFO] アプリケーションを起動しました
2024-01-15 10:15:24 [INFO] 設定ファイルを読み込みました
2024-01-15 10:15:25 [WARNING] メモリ使用量が高いです: 85%
2024-01-15 10:16:01 [ERROR] データベース接続に失敗しました
2024-01-15 10:16:02 [ERROR] Connection timeout after 30 seconds
2024-01-15 10:16:03 [INFO] 再接続を試みます
2024-01-15 10:16:04 [ERROR] Permission denied: /var/lib/app/data.db
2024-01-15 10:16:05 [WARNING] ディスク容量が少ないです: 15%
2024-01-15 10:16:10 [INFO] データベースに接続しました
2024-01-15 10:16:11 [ERROR] Out of memory: Cannot allocate 1024 bytes
2024-01-15 10:16:12 [INFO] 処理を開始します
2024-01-15 10:16:15 [ERROR] Invalid input data format
2024-01-15 10:16:16 [WARNING] レスポンス時間が遅いです: 5.2s
2024-01-15 10:16:20 [INFO] 処理が完了しました
2024-01-15 10:16:21 [ERROR] Critical error in module processing
2024-01-15 10:16:22 [INFO] アプリケーションを終了します
EOF
```

4. スクリプトの実行

```bash
./styled_script.sh sample.log
```

5. スタイルガイド違反の例との比較

```bash
# スタイルガイド違反の例を作成
cat > bad_style_example.sh << 'EOF'
#!/bin/bash
#悪いスタイルの例

#インデントがない
if [ -f "$1" ]; then
echo "ファイルがあります"
if [ -r "$1" ]; then
echo "読めます"
fi
fi

#変数命名が不統一
UserName="John"
user_age=25
MaxRetries=3

#長すぎる行
if [ "${PROCESSING_MODE}" = "batch" ] && [ "${FILE_COUNT}" -gt "${MAX_FILES}" ] && [ "${CURRENT_TIME}" -lt "${DEADLINE}" ] && [ "${ENABLE_LOGGING}" = "true" ]; then
    echo "処理開始"
fi

#コメント不足
process_data() {
f=$1
o=$2
cat $f > $o
}

#エラーハンドリングなし
cat non_existent_file.txt
echo "処理完了"
EOF

chmod +x bad_style_example.sh

# 比較実行
echo "=== 良いスタイルの例 ==="
./styled_script.sh sample.log

echo ""
echo "=== 悪いスタイルの例 ==="
./bad_style_example.sh sample.log 2>/dev/null || echo "エラーが発生しましたが、適切に処理されていません"
```

6. コード品質の確認

```bash
# コードの行数と複雑さの確認
echo "スタイルガイド準拠スクリプトの統計:"
wc -l styled_script.sh
echo "関数数:"
grep -c "^()" styled_script.sh || echo "関数定義をカウント"
echo "コメント行数:"
grep -c "^#" styled_script.sh

echo ""
echo "スタイルガイド違反スクリプトの統計:"
wc -l bad_style_example.sh
```

:::

## 📋 スタイルガイドのベストプラクティス

### チーム開発での適用

```bash
# .editorconfigの例
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.sh]
indent_style = space
indent_size = 4
```

### コードレビューチェックリスト

```bash
# スタイルチェックスクリプトの例
check_style() {
    local file="$1"
    local issues=0

    echo "スタイルチェック: $file"

    # シバンのチェック
    if ! head -n1 "$file" | grep -q "^#!/bin/bash"; then
        echo "❌ 適切なシバンがありません"
        ((issues++))
    fi

    # set -euo pipefailのチェック
    if ! grep -q "set -euo pipefail" "$file"; then
        echo "❌ set -euo pipefailが設定されていません"
        ((issues++))
    fi

    # 関数命名のチェック
    if grep -n "^[A-Z][a-zA-Z_]*()" "$file"; then
        echo "❌ 大文字始まりの関数名があります"
        ((issues++))
    fi

    # 長い行のチェック
    if awk 'length($0) > 100 {print NR ": " $0}' "$file" | head -5; then
        echo "❌ 100文字を超える行があります"
        ((issues++))
    fi

    if [ $issues -eq 0 ]; then
        echo "✅ スタイルチェックパス"
        return 0
    else
        echo "❌ $issues 件のスタイル問題が見つかりました"
        return 1
    fi
}
```

### 自動フォーマットツールの活用

```bash
# shfmtの使用例
# インストール: go install mvdan.cc/sh/v3/cmd/shfmt@latest

# コードのフォーマット
shfmt -i 4 -w script.sh

# diffの確認
shfmt -i 4 -d script.sh

# 複数ファイルの一括フォーマット
find . -name "*.sh" -exec shfmt -i 4 -w {} \;
```

## まとめ

一貫したスタイルガイドの適用は、シェルスクリプトの品質と保守性を大幅に向上させます。命名規則、インデント、コメントの書き方などの基本的なルールを守ることで、チーム全員が理解しやすいコードを作成できます。

:::note 要点のまとめ

- **ファイル構造**: ヘッダーコメントと一貫したレイアウト
- **命名規則**: 変数、関数、定数の一貫した命名
- **インデント**: 4スペース、適切な行分割
- **コメント**: 意味のあるコメントと適切なセクション分け
- **エラーハンドリング**: 一貫したエラー処理とクリーンアップ
- **モジュール化**: 関数のグループ化と設定の分離
- **チーム適用**: 自動チェックツールとコードレビュー

:::

スタイルガイドを遵守することで、コードの可読性が向上し、バグの発見が容易になり、チームでの協業効率が改善されます。特に大規模なプロジェクトでは、一貫したコーディングスタイルがプロジェクトの成功に不可欠です。

## 関連リンク

- [コメント記述のベストプラクティス](./commenting)
- [set -e -u -x -o pipefailのベストプラクティス](../error-handling/set-e-u-x-o-pipefail)
- [シェルスクリプトの関数](../../control-structures/functions)
- [安全な一時ファイルの作成](../security/secure-temp-files)

## さらに深く学習したい方へ

シェルスクリプトのスタイルガイドをさらに深く学びたい方は、当社の研修プログラムをご利用ください。実践的なコーディング演習を通じて、プロ品質のスクリプト開発スキルを体系的に習得できます。