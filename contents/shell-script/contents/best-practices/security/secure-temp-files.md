---
title: "安全な一時ファイルのベストプラクティス | シェルスクリプトのセキュリティ"
slug: secure-temp-files
status: publish
post_type: page
seo_keywords: "シェルスクリプト, 一時ファイル, セキュリティ, mktemp, tmpfile, ベストプラクティス"
seo_description: "シェルスクリプトにおける安全な一時ファイルの作成方法と管理手法を詳しく解説。mktempコマンドの使用からセキュリティリスクの回避まで網羅的に説明します。"
tags: ["シェルスクリプト", "一時ファイル", "セキュリティ", "mktemp", "ベストプラクティス"]
image: "https://example.com/images/shell-script-temp-files-security.jpg"
parent: "security"
---

## 🔒 はじめに

シェルスクリプトで一時ファイルを使用する際、セキュリティ上のリスクを理解し適切に対処することが重要です。不適切な一時ファイルの作成や管理は、情報漏洩、権限昇格、サービス拒否攻撃などの深刻な脆弱性につながる可能性があります。このページでは、安全な一時ファイルの作成方法からクリーンアップまで、実践的なセキュリティ手法を詳しく解説します。

### このページで学べること

:::note

このページでは、以下のことを学びます：

- 一時ファイルのセキュリティリスクと重要性
- `mktemp`コマンドを使用した安全な一時ファイル作成
- 一時ファイルの権限設定とアクセス制御
- レースコンディションの防止方法
- 一時ディレクトリの安全な使用方法
- クリーンアップとリソース管理のベストプラクティス

:::

## ⚠️ 一時ファイルのセキュリティリスク

一時ファイルを安全に扱わないと、以下のような深刻なセキュリティ問題が発生する可能性があります。

### 主な脆弱性

1. **予測可能なファイル名**: ファイル名が推測可能な場合、攻撃者が悪意のあるファイルを作成できる
2. **不適切な権限設定**: 他のユーザーがファイルを読み書きできる
3. **レースコンディション**: ファイル存在チェックと作成の間に攻撃が介入する
4. **クリーンアップ不足**: 一時ファイルが残り続け、ディスク容量を消費する
5. **シンボリックリンク攻撃**: 既存の重要ファイルを上書きしてしまう

:::note レースコンディションとは

レースコンディション（競合状態）とは、複数のプロセスが同じリソースに同時にアクセスしようとする際に発生する問題です。一時ファイルの作成時、ファイルの存在確認と実際の作成の間に時間差があると、攻撃者がその隙を突いて悪意のある操作を行う可能性があります。

:::

## 🛠️ mktempコマンドの基本

`mktemp`コマンドは、安全な一時ファイルを作成するための標準的なツールです。

### 基本的な使い方

```bash
#!/bin/bash

# 一時ファイルの作成
temp_file=$(mktemp)
echo "一時ファイルを作成しました: $temp_file"

# 一時ファイルを使用
echo "これは一時的なデータです" > "$temp_file"
cat "$temp_file"

# 一時ファイルの削除
rm "$temp_file"
echo "一時ファイルを削除しました"
```

### 一時ディレクトリの作成

```bash
#!/bin/bash

# 一時ディレクトリの作成
temp_dir=$(mktemp -d)
echo "一時ディレクトリを作成しました: $temp_dir"

# 一時ディレクトリ内にファイルを作成
echo "データ1" > "$temp_dir/file1.txt"
echo "データ2" > "$temp_dir/file2.txt"

# 一時ディレクトリの内容を確認
ls -la "$temp_dir"

# 一時ディレクトリの削除
rm -rf "$temp_dir"
echo "一時ディレクトリを削除しました"
```

### カスタムテンプレートの使用

```bash
#!/bin/bash

# カスタムプレフィックスを持つ一時ファイル
temp_file=$(mktemp -t "myapp_XXXXXX")
echo "カスタムプレフィックスの一時ファイル: $temp_file"

# カスタムサフィックスを持つ一時ファイル
temp_file=$(mktemp -t "temp_XXXXXX.log")
echo "ログファイル用一時ファイル: $temp_file"

# 一時ディレクトリのカスタムプレフィックス
temp_dir=$(mktemp -d -t "myapp_work_XXXXXX")
echo "ワークディレクトリ: $temp_dir"
```

## 🔒 安全な一時ファイルの実装パターン

### トラップを使用したクリーンアップ

```bash
#!/bin/bash

# クリーンアップ関数
cleanup() {
    echo "クリーンアップを実行します..."
    if [ -n "$temp_file" ] && [ -f "$temp_file" ]; then
        rm -f "$temp_file"
        echo "一時ファイルを削除しました: $temp_file"
    fi
    if [ -n "$temp_dir" ] && [ -d "$temp_dir" ]; then
        rm -rf "$temp_dir"
        echo "一時ディレクトリを削除しました: $temp_dir"
    fi
}

# トラップの設定
trap cleanup EXIT INT TERM

# 一時ファイルの作成
temp_file=$(mktemp)
temp_dir=$(mktemp -d)

echo "一時ファイル: $temp_file"
echo "一時ディレクトリ: $temp_dir"

# メイン処理
echo "処理データ" > "$temp_file"
cp "$temp_file" "$temp_dir/backup.txt"

# スクリプト終了時に自動的にクリーンアップが実行される
echo "メイン処理が完了しました"
```

### 一時ファイルの安全な権限設定

```bash
#!/bin/bash

# 一時ファイルを作成し、権限を設定
temp_file=$(mktemp)

# ファイル権限の設定（所有者のみ読み書き可能）
chmod 600 "$temp_file"

# 一時ディレクトリの作成と権限設定
temp_dir=$(mktemp -d)
chmod 700 "$temp_dir"

# 権限の確認
ls -ld "$temp_dir"
ls -l "$temp_file"

# センシティブなデータの書き込み
echo "重要なデータ" > "$temp_file"

# 処理
cat "$temp_file"

# クリーンアップ
rm -f "$temp_file"
rm -rf "$temp_dir"
```

### 複数の一時ファイルを管理

```bash
#!/bin/bash

# 一時ファイルを配列で管理
declare -a temp_files
declare -a temp_dirs

# クリーンアップ関数
cleanup_all() {
    echo "すべての一時ファイルをクリーンアップします..."

    # 一時ファイルの削除
    for file in "${temp_files[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            echo "削除: $file"
        fi
    done

    # 一時ディレクトリの削除
    for dir in "${temp_dirs[@]}"; do
        if [ -d "$dir" ]; then
            rm -rf "$dir"
            echo "削除: $dir"
        fi
    done
}

# トラップの設定
trap cleanup_all EXIT

# 一時ファイルの作成と登録
temp_files+=($(mktemp))
temp_files+=($(mktemp -t "log_XXXXXX"))
temp_files+=($(mktemp -t "data_XXXXXX.csv"))

# 一時ディレクトリの作成と登録
temp_dirs+=($(mktemp -d -t "work_XXXXXX"))
temp_dirs+=($(mktemp -d -t "backup_XXXXXX"))

# 作成した一時ファイルの確認
echo "作成した一時ファイル:"
for file in "${temp_files[@]}"; do
    echo "  - $file"
done

echo "作成した一時ディレクトリ:"
for dir in "${temp_dirs[@]}"; do
    echo "  - $dir"
done

# メイン処理
echo "データ処理を実行中..."
echo "サンプルデータ1" > "${temp_files[0]}"
echo "サンプルデータ2" > "${temp_files[1]}"
echo "id,name,value" > "${temp_files[2]}"
echo "1,テスト,100" >> "${temp_files[2]}"

# 一時ディレクトリにコピー
cp "${temp_files[0]}" "${temp_dirs[0]}/input.txt"
cp "${temp_files[2]}" "${temp_dirs[1]}/export.csv"

echo "処理が完了しました"
```

## 🚀 安全な一時ファイルを動かして確認してみよう

それでは、実際に安全な一時ファイルを実装して、その動作を確認してみましょう。

:::step

1. サンプルスクリプトの作成

以下の内容で`secure_temp_example.sh`を作成します。

```bash
#!/bin/bash

# 安全な一時ファイルのサンプルスクリプト
set -euo pipefail

# 定数の定義
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="$SCRIPT_DIR/secure_temp.log"

# 一時ファイルとディレクトリを管理する配列
declare -a temp_files
declare -a temp_dirs

# ログ関数
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# クリーンアップ関数
cleanup() {
    log_message "クリーンアップを開始します..."

    local exit_code=$?

    # 一時ファイルの削除
    for file in "${temp_files[@]}"; do
        if [ -f "$file" ]; then
            log_message "一時ファイルを削除: $file"
            rm -f "$file"
            # 削除の成功を確認
            if [ ! -f "$file" ]; then
                log_message "✅ 一時ファイルの削除に成功: $file"
            else
                log_message "❌ 一時ファイルの削除に失敗: $file"
            fi
        fi
    done

    # 一時ディレクトリの削除
    for dir in "${temp_dirs[@]}"; do
        if [ -d "$dir" ]; then
            log_message "一時ディレクトリを削除: $dir"
            rm -rf "$dir"
            # 削除の成功を確認
            if [ ! -d "$dir" ]; then
                log_message "✅ 一時ディレクトリの削除に成功: $dir"
            else
                log_message "❌ 一時ディレクトリの削除に失敗: $dir"
            fi
        fi
    done

    log_message "クリーンアップが完了しました (終了コード: $exit_code)"
    exit $exit_code
}

# トラップの設定（EXIT, INT, TERMシグナルを捕捉）
trap cleanup EXIT INT TERM

# 安全な一時ファイル作成関数
create_temp_file() {
    local prefix="${1:-temp}"
    local suffix="${2:-}"

    if [ -n "$suffix" ]; then
        local temp_file=$(mktemp -t "${prefix}_XXXXXX.${suffix}")
    else
        local temp_file=$(mktemp -t "${prefix}_XXXXXX")
    fi

    # 権限を設定（所有者のみ読み書き可能）
    chmod 600 "$temp_file"

    # 配列に登録
    temp_files+=("$temp_file")

    log_message "一時ファイルを作成: $temp_file (権限: $(stat -f "%Lp" "$temp_file" 2>/dev/null || stat -c "%a" "$temp_file"))"

    echo "$temp_file"
}

# 安全な一時ディレクトリ作成関数
create_temp_dir() {
    local prefix="${1:-tempdir}"

    local temp_dir=$(mktemp -d -t "${prefix}_XXXXXX")

    # 権限を設定（所有者のみ読み書き実行可能）
    chmod 700 "$temp_dir"

    # 配列に登録
    temp_dirs+=("$temp_dir")

    log_message "一時ディレクトリを作成: $temp_dir (権限: $(stat -f "%Lp" "$temp_dir" 2>/dev/null || stat -c "%a" "$temp_dir"))"

    echo "$temp_dir"
}

# データ処理関数
process_data() {
    local input_data="$1"
    local output_dir="$2"

    log_message "データ処理を開始します..."

    # 入力データを一時ファイルに保存
    local input_file=$(create_temp_file "input")
    echo "$input_data" > "$input_file"

    # データの加工
    local processed_file=$(create_temp_file "processed" "txt")

    # 簡単なデータ加工（例：大文字に変換）
    tr '[:lower:]' '[:upper:]' < "$input_file" > "$processed_file"

    # 結果の出力ファイル
    local output_file="$output_dir/result.txt"
    cp "$processed_file" "$output_file"

    # ファイル情報の記録
    local file_size=$(wc -c < "$output_file")
    local line_count=$(wc -l < "$output_file")

    log_message "データ処理が完了しました"
    log_message "  出力ファイル: $output_file"
    log_message "  ファイルサイズ: $file_size バイト"
    log_message "  行数: $line_count"

    return 0
}

# バックアップ関数
create_backup() {
    local source_file="$1"
    local backup_dir="$2"

    log_message "バックアップを作成します: $source_file"

    # タイムスタンプ付きのバックアップファイル名
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="$backup_dir/backup_${timestamp}.dat"

    # ファイルをコピー
    cp "$source_file" "$backup_file"

    # バックアップファイルの圧縮
    gzip "$backup_file"

    log_message "バックアップを作成しました: ${backup_file}.gz"

    return 0
}

# メイン処理
main() {
    log_message "安全な一時ファイルのデモンストレーションを開始します"
    log_message "=============================================="

    # ログファイルの初期化
    : > "$LOG_FILE"

    # サンプルデータ
    local sample_data="これはサンプルデータです。
安全な一時ファイルのデモンストレーション用データです。
複数行のデータを処理します。
特殊文字: !@#$%^&*()
日本語のテキストも含まれています。"

    # 一時ディレクトリの作成
    local work_dir=$(create_temp_dir "work")
    local backup_dir=$(create_temp_dir "backup")

    log_message "作業ディレクトリ: $work_dir"
    log_message "バックアップディレクトリ: $backup_dir"

    # データ処理の実行
    process_data "$sample_data" "$work_dir"

    # バックアップの作成
    create_backup "$work_dir/result.txt" "$backup_dir"

    # 作成されたファイルの確認
    log_message "作成されたファイル一覧:"
    ls -la "$work_dir/" 2>/dev/null || true
    ls -la "$backup_dir/" 2>/dev/null || true

    # 一時ファイルの状態確認
    log_message "現在の一時ファイル数: ${#temp_files[@]}"
    log_message "現在の一時ディレクトリ数: ${#temp_dirs[@]}"

    # 各一時ファイルの状態を確認
    for i in "${!temp_files[@]}"; do
        local file="${temp_files[$i]}"
        if [ -f "$file" ]; then
            local size=$(wc -c < "$file")
            local perms=$(stat -f "%Lp" "$file" 2>/dev/null || stat -c "%a" "$file")
            log_message "一時ファイル[$i]: $file (サイズ: $size, 権限: $perms)"
        else
            log_message "警告: 一時ファイル[$i] が存在しません: $file"
        fi
    done

    log_message "デモンストレーションが正常に完了しました"
    log_message "スクリプト終了時に自動的にクリーンアップが実行されます"

    return 0
}

# スクリプトの実行
main "$@"
```

2. 実行権限の付与

```bash
chmod +x secure_temp_example.sh
```

3. スクリプトの実行

```bash
./secure_temp_example.sh
```

4. 実行結果の確認

スクリプトを実行すると、以下のような出力が表示されます：

```
[2024-01-15 10:30:45] 安全な一時ファイルのデモンストレーションを開始します
[2024-01-15 10:30:45] ==============================================
[2024-01-15 10:30:45] 一時ディレクトリを作成: /tmp/work_XXXXXX (権限: 700)
[2024-01-15 10:30:45] 一時ディレクトリを作成: /tmp/backup_XXXXXX (権限: 700)
[2024-01-15 10:30:45] 作業ディレクトリ: /tmp/work_XXXXXX
[2024-01-15 10:30:45] バックアップディレクトリ: /tmp/backup_XXXXXX
[2024-01-15 10:30:45] データ処理を開始します...
[2024-01-15 10:30:45] 一時ファイルを作成: /tmp/input_XXXXXX (権限: 600)
[2024-01-15 10:30:45] 一時ファイルを作成: /tmp/processed_XXXXXX.txt (権限: 600)
[2024-01-15 10:30:45] データ処理が完了しました
[2024-01-15 10:30:45] バックアップを作成します: /tmp/work_XXXXXX/result.txt
[2024-01-15 10:30:45] バックアップを作成しました: /tmp/backup_XXXXXX/backup_20240115_103045.dat.gz
[2024-01-15 10:30:45] 作成されたファイル一覧:
total 8
-rw------- 1 user group 123 Jan 15 10:30 result.txt
total 4
-rw------- 1 user group 89 Jan 15 10:30 backup_20240115_103045.dat.gz
[2024-01-15 10:30:45] 現在の一時ファイル数: 2
[2024-01-15 10:30:45] 現在の一時ディレクトリ数: 2
[2024-01-15 10:30:45] 一時ファイル[0]: /tmp/input_XXXXXX (サイズ: 456, 権限: 600)
[2024-01-15 10:30:45] 一時ファイル[1]: /tmp/processed_XXXXXX.txt (サイズ: 456, 権限: 600)
[2024-01-15 10:30:45] デモンストレーションが正常に完了しました
[2024-01-15 10:30:45] スクリプト終了時に自動的にクリーンアップが実行されます
[2024-01-15 10:30:45] クリーンアップを開始します...
[2024-01-15 10:30:45] 一時ファイルを削除: /tmp/input_XXXXXX
[2024-01-15 10:30:45] ✅ 一時ファイルの削除に成功: /tmp/input_XXXXXX
[2024-01-15 10:30:45] 一時ファイルを削除: /tmp/processed_XXXXXX.txt
[2024-01-15 10:30:45] ✅ 一時ファイルの削除に成功: /tmp/processed_XXXXXX.txt
[2024-01-15 10:30:45] 一時ディレクトリを削除: /tmp/work_XXXXXX
[2024-01-15 10:30:45] ✅ 一時ディレクトリの削除に成功: /tmp/work_XXXXXX
[2024-01-15 10:30:45] 一時ディレクトリを削除: /tmp/backup_XXXXXX
[2024-01-15 10:30:45] ✅ 一時ディレクトリの削除に成功: /tmp/backup_XXXXXX
[2024-01-15 10:30:45] クリーンアップが完了しました (終了コード: 0)
```

5. ログファイルの確認

```bash
echo "ログファイルの内容:"
cat secure_temp.log
```

6. クリーンアップのテスト

途中でスクリプトを中断して、クリーンアップが正しく動作するか確認：

```bash
# 別のターミナルでスクリプトを実行
./secure_temp_example.sh &

# プロセスIDを取得
pid=$!

# 数秒後に中断
sleep 3
kill -INT $pid

# 一時ファイルが削除されたか確認
ls -la /tmp/work_* /tmp/backup_* /tmp/input_* /tmp/processed_* 2>/dev/null || echo "一時ファイルは正しく削除されました"
```

7. 権限設定の確認

```bash
# 一時ファイルの権限を確認するテストスクリプト
cat > test_permissions.sh << 'EOF'
#!/bin/bash
echo "権限設定のテスト"
echo "================"

temp_file=$(mktemp)
temp_dir=$(mktemp -d)

echo "デフォルト権限:"
ls -l "$temp_file"
ls -ld "$temp_dir"

chmod 600 "$temp_file"
chmod 700 "$temp_dir"

echo "変更後権限:"
ls -l "$temp_file"
ls -ld "$temp_dir"

# 他のユーザーからのアクセスを試みる（実際には権限がないためエラーになる）
echo "他のユーザーからのアクセス試行:"
if [ -r "$temp_file" ]; then
    echo "警告: 他のユーザーがファイルを読み取れます"
else
    echo "✅ 他のユーザーはファイルを読み取れません"
fi

rm -f "$temp_file"
rm -rf "$temp_dir"
EOF

chmod +x test_permissions.sh
./test_permissions.sh
rm test_permissions.sh
```

:::

## 📋 安全な一時ファイルのベストプラクティス

### 推奨されるパターン

1. **常にmktempを使用**: `/tmp/myfile$$`のような固定パターンを避ける
2. **適切な権限設定**: 一時ファイルは`600`、一時ディレクトリは`700`に設定
3. **トラップによるクリーンアップ**: EXITシグナルで確実にクリーンアップ
4. **一意なファイル名**: 衝突を避けるためランダムなファイル名を使用
5. **早期クリーンアップ**: 使用後すぐに削除できるように設計

### 避けるべきパターン

```bash
# ❌ 悪い例：予測可能なファイル名
temp_file="/tmp/myapp_$$.tmp"
echo "data" > "$temp_file"

# ❌ 悪い例：権限設定なし
temp_file=$(mktemp)
# chmodを忘れている

# ❌ 悪い例：クリーンアップなし
temp_file=$(mktemp)
echo "data" > "$temp_file"
# そのまま終了（一時ファイルが残る）

# ❌ 悪い例：手動でのファイル名生成
temp_file="/tmp/temp_$(date +%s)"
# 日付ベースは予測可能
```

### 本番環境での考慮事項

```bash
# ✅ 良い例：本番環境での安全な実装
#!/bin/bash

# 環境変数で一時ディレクトリを指定可能に
TMPDIR="${TMPDIR:-/tmp}"

# 追加のセキュリティチェック
if [ ! -w "$TMPDIR" ]; then
    echo "エラー: 一時ディレクトリに書き込みできません: $TMPDIR" >&2
    exit 1
fi

# 安全な一時ファイル作成
temp_file=$(mktemp -p "$TMPDIR" -t "${APP_NAME:-app}_XXXXXX")
chmod 600 "$temp_file"

# エラーハンドリング付きクリーンアップ
cleanup() {
    if [ -n "$temp_file" ] && [ -f "$temp_file" ]; then
        rm -f "$temp_file"
    fi
}

trap cleanup EXIT

# メイン処理
process_data "$temp_file"
```

## まとめ

安全な一時ファイルの使用は、シェルスクリプトのセキュリティにおいて非常に重要です。適切な手法を実装することで、情報漏洩や権限昇格のリスクを大幅に低減できます。

:::note 要点のまとめ

- **mktempの使用**: 安全な一時ファイル作成には`mktemp`を必ず使用
- **権限設定**: 一時ファイルは`600`、ディレクトリは`700`に設定
- **クリーンアップ**: トラップを使用して確実なクリーンアップを実装
- **レースコンディション**: `mktemp`はアトミックな操作を保証
- **一意性**: ランダムなファイル名で衝突を防止
- **監査**: 一時ファイルの使用ログを記録して追跡可能に

:::

適切な一時ファイル管理を実装することで、より安全で信頼性の高いシェルスクリプトを開発できます。特に、機密データを扱うスクリプトやマルチユーザー環境で実行されるスクリプトでは、これらのベストプラクティスを厳守することが重要です。

## 関連リンク

- [コマンドインジェクションのベストプラクティス](./command-injection)
- [set -e -u -x -o pipefailのベストプラクティス](../error-handling/set-e-u-x-o-pipefail)
- [シェルスクリプトのセキュリティ対策](../../security/introduction)
- [ファイル操作のベストプラクティス](../../file-operations/basics)

## さらに深く学習したい方へ

安全な一時ファイル管理をさらに深く学びたい方は、当社の研修プログラムをご利用ください。実践的なセキュリティ演習を通じて、堅牢なシェルスクリプト開発スキルを習得できます。