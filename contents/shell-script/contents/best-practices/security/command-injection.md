---
title: "コマンドインジェクションのベストプラクティス | シェルスクリプトのセキュリティ対策"
slug: command-injection
status: publish
post_type: page
seo_keywords: "シェルスクリプト, コマンドインジェクション, セキュリティ, 入力検証, shellshock, ベストプラクティス"
seo_description: "シェルスクリプトにおけるコマンドインジェクション攻撃の防止方法を詳しく解説。入力検証、安全なコマンド実行、防御プログラミングの実践手法を網羅的に説明します。"
tags: ["シェルスクリプト", "コマンドインジェクション", "セキュリティ", "入力検証", "防御プログラミング"]
image: "https://example.com/images/shell-script-command-injection-security.jpg"
parent: "security"
---

## 🛡️ はじめに

コマンドインジェクションは、シェルスクリプトにおける最も深刻なセキュリティ脆弱性の一つです。攻撃者が悪意のあるコマンドを注入し、システムを乗っ取ったり、機密情報を盗んだりする可能性があります。このページでは、コマンドインジェクションの仕組みから実践的な防御手法まで、シェルスクリプトのセキュリティを確保するための包括的なガイドを提供します。

### このページで学べること

:::note

このページでは、以下のことを学びます：

- コマンドインジェクションの基本概念と攻撃メカニズム
- 危険なコマンド実行パターンの特定方法
- 入力検証とサニタイズの実践手法
- 安全なコマンド実行の代替案
- 環境変数と権限分離による防御
- 実際の攻撃シナリオと対策

:::

## ⚡ コマンドインジェクションとは？

コマンドインジェクションは、攻撃者が外部からの入力を利用して、意図しないシェルコマンドを実行させる攻撃手法です。

### 基本的な攻撃メカニズム

```bash
# ❌ 脆弱性のあるコード例
user_input="file.txt; rm -rf /"
ls $user_input  # 攻撃者が任意のコマンドを実行可能
```

この例では、攻撃者が入力に`; rm -rf /`を含めることで、ファイル一覧表示と同時にシステム全体を削除できてしまいます。

### 主な攻撃ベクトル

1. **セミコロン演算子**: `;`で複数コマンドを連結
2. **パイプ演算子**: `|`でコマンドの出力を別コマンドに渡す
3. **コマンド置換**: `$()`またはバッククォートでコマンド実行
4. **リダイレクト**: `>`, `>>`, `<`でファイル操作
5. **論理演算子**: `&&`, `||`で条件付き実行
6. **バックグラウンド実行**: `&`でバックグラウンド実行

:::note ShellShock脆弱性とは

ShellShock（Bash Bug）は2014年に発見されたBashの深刻な脆弱性（CVE-2014-6271）です。環境変数に関数定義を設定する際に、関数定義の後に続くコードが実行されてしまうという問題です。この脆弱性により、攻撃者が環境変数を通じて任意のコマンドを実行できました。

```bash
# ShellShock攻撃の例
env x='() { :;}; echo vulnerable' bash -c "echo test"
# vulnerableと表示されたら脆弱性あり
```

:::

## 🔍 脆弱性のあるコードパターン

危険なコマンド実行パターンを理解し、特定することが重要です。

### 直接的な変数展開

```bash
# ❌ 脆弱性あり：直接変数展開
filename="$1"
cat $filename

# ❌ 脆弱性あり：引用符なし
user_input="$1"
grep $user_input logfile.txt
```

### evalの危険な使用

```bash
# ❌ 脆弱性あり：evalの使用
config="$1"
eval "echo $config"

# ❌ 脆弱性あり：動的コマンド生成
cmd="$1"
eval "$cmd"
```

### コマンド置換の脆弱性

```bash
# ❌ 脆弱性あり：コマンド置換
user_input="$1"
result=$(cat $user_input)

# ❌ 脆弱性あり：バッククォート
user_input="$1"
output=`cat $user_input`
```

## 🛡️ 安全なコマンド実行の実装

脆弱性を回避するための安全な実装パターンを学びましょう。

### 変数の適切な引用符化

```bash
# ✅ 安全：変数を二重引用符で囲む
filename="$1"
cat "$filename"

# ✅ 安全：配列を使用して引数を分離
args=("$1" "$2" "$3")
grep "${args[@]}" logfile.txt
```

### 配列を使用した安全な引数処理

```bash
#!/bin/bash

# 配列を使用した安全なコマンド実行
safe_execute() {
    local cmd="$1"
    shift
    local args=("$@")

    # コマンドと引数を配列で実行
    "$cmd" "${args[@]}"
}

# 使用例
filename="$1"
output_dir="$2"

# 安全なファイルコピー
safe_execute cp "$filename" "$output_dir"

# 安全なgrep検索
search_term="$1"
safe_execute grep "$search_term" logfile.txt
```

### 入力検証とサニタイズ

```bash
#!/bin/bash

# 入力検証関数
validate_input() {
    local input="$1"
    local pattern="$2"

    if [[ ! "$input" =~ ^$pattern$ ]]; then
        echo "エラー: 無効な入力です: $input" >&2
        return 1
    fi

    return 0
}

# ファイル名の検証
validate_filename() {
    local filename="$1"

    # アルファベット、数字、アンダースコア、ハイフン、ドットのみ許可
    validate_input "$filename" '[a-zA-Z0-9_.-]+$'
}

# パスの検証とサニタイズ
sanitize_path() {
    local path="$1"
    local base_dir="${2:-/tmp}"

    # 相対パスを絶対パスに変換
    local full_path=$(realpath -m "$base_dir/$path" 2>/dev/null || echo "$base_dir/$path")

    # ベースディレクトリ内にあることを確認
    if [[ "$full_path" != "$base_dir"* ]]; then
        echo "エラー: パスがベースディレクトリ外です: $path" >&2
        return 1
    fi

    echo "$full_path"
    return 0
}

# 使用例
user_input="$1"

if validate_filename "$user_input"; then
    safe_path=$(sanitize_path "$user_input" "/safe/directory")
    if [ $? -eq 0 ]; then
        cat "$safe_path"
    fi
fi
```

## 🚀 安全な代替実装パターン

危険なパターンを避け、安全な代替案を実装しましょう。

### findコマンドの安全な使用

```bash
# ❌ 危険：ユーザー入力を直接使用
find /path -name "$user_input" -exec rm {} \;

# ✅ 安全：findのオプションを適切に使用
find /path -type f -name "*.log" -exec grep "pattern" {} +
```

### xargsの安全な使用

```bash
# ❌ 危険：xargsに直接渡す
cat file_list.txt | xargs rm

# ✅ 安全：-0オプションとヌル区切りを使用
find . -type f -name "*.tmp" -print0 | xargs -0 rm -f

# ✅ 安全：-Iオプションでプレースホルダーを指定
find . -type f -name "*.log" | xargs -I {} cp {} /backup/
```

### readコマンドによる安全な入力処理

```bash
#!/bin/bash

# 安全なファイル読み込み
safe_read_file() {
    local file="$1"
    local var_name="$2"

    # ファイルの存在と読み取り権限を確認
    if [ ! -f "$file" ] || [ ! -r "$file" ]; then
        echo "エラー: ファイルが読めません: $file" >&2
        return 1
    fi

    # readコマンドで安全に読み込み
    while IFS= read -r line || [ -n "$line" ]; do
        printf -v "$var_name" "%s\n" "$line"
    done < "$file"

    return 0
}

# 設定ファイルの安全な読み込み
load_config() {
    local config_file="$1"
    local -A config_map

    # ファイルの検証
    if [ ! -f "$config_file" ]; then
        echo "エラー: 設定ファイルが見つかりません: $config_file" >&2
        return 1
    fi

    # 安全なファイル読み込み
    while IFS='=' read -r key value || [ -n "$key" ]; do
        # コメント行と空行をスキップ
        [[ "$key" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$key" ]] && continue

        # キーと値のサニタイズ
        key=$(echo "$key" | tr -d '[:space:]')
        value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        # 安全なキー名のみ許可
        if [[ "$key" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
            config_map["$key"]="$value"
        fi
    done < "$config_file"

    # 設定のエクスポート（安全な変数のみ）
    for key in "${!config_map[@]}"; do
        if [[ "$key" =~ ^(DEBUG_MODE|LOG_LEVEL|TIMEOUT)$ ]]; then
            export "$key"="${config_map[$key]}"
        fi
    done

    return 0
}
```

## 🔒 深層防御戦略

多重防御のアプローチでコマンドインジェクションを防止します。

### 最小権限の原則

```bash
#!/bin/bash

# 特定ユーザーでの実行
run_as_user() {
    local target_user="$1"
    shift
    local cmd=("$@")

    # ユーザーの存在確認
    if ! id "$target_user" &>/dev/null; then
        echo "エラー: ユーザーが存在しません: $target_user" >&2
        return 1
    fi

    # sudoでユーザーを切り替えて実行
    sudo -u "$target_user" "${cmd[@]}"
}

# 使用例
run_as_user "nobody" cat "$safe_file"
```

### 環境の分離

```bash
#!/bin/bash

# 安全な環境変数の設定
setup_secure_env() {
    # 不要な環境変数を削除
    unset LD_PRELOAD LD_LIBRARY_PATH
    export PATH="/bin:/usr/bin:/sbin:/usr/sbin"

    # 安全なumaskを設定
    umask 077
}

# chroot環境での実行
run_in_chroot() {
    local chroot_dir="$1"
    shift
    local cmd=("$@")

    # chrootディレクトリの存在確認
    if [ ! -d "$chroot_dir" ]; then
        echo "エラー: chrootディレクトリが存在しません: $chroot_dir" >&2
        return 1
    fi

    # chroot環境で実行
    chroot "$chroot_dir" "${cmd[@]}"
}
```

### ログと監査

```bash
#!/bin/bash

# 監査ログ関数
audit_log() {
    local action="$1"
    local user="${USER:-unknown}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local pid=$$

    # 安全なログ記録
    printf "[%s] [PID:%d] [USER:%s] %s\n" "$timestamp" "$pid" "$user" "$action" >> /var/log/script_audit.log
}

# コマンド実行前のチェック
safe_command_execution() {
    local cmd="$1"
    shift
    local args=("$@")

    # コマンドの許可リストチェック
    local allowed_commands=(cat grep head tail sort uniq)
    local cmd_base=$(basename "$cmd")

    if [[ ! " ${allowed_commands[@]} " =~ " ${cmd_base} " ]]; then
        audit_log "許可されていないコマンドの実行試行: $cmd"
        echo "エラー: コマンドが許可されていません: $cmd_base" >&2
        return 1
    fi

    # 引数の安全性チェック
    for arg in "${args[@]}"; do
        # 危険な文字のチェック
        if [[ "$arg" =~ [;&|()`$<>\\] ]]; then
            audit_log "危険な文字を含む引数: $arg"
            echo "エラー: 引数に危険な文字が含まれています" >&2
            return 1
        fi
    done

    # 監査ログの記録
    audit_log "コマンド実行: $cmd ${args[*]}"

    # 安全なコマンド実行
    "$cmd" "${args[@]}"
    local exit_code=$?

    # 結果の記録
    audit_log "コマンド終了: $cmd (終了コード: $exit_code)"

    return $exit_code
}
```

## 🚀 コマンドインジェクション防御を動かして確認してみよう

それでは、実際にコマンドインジェクションの防御を実装して、その動作を確認してみましょう。

:::step

1. 脆弱性スキャナースクリプトの作成

以下の内容で`command_injection_scanner.sh`を作成します。

```bash
#!/bin/bash

# コマンドインジェクション脆弱性スキャナー
set -euo pipefail

# 定数の定義
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCAN_LOG="$SCRIPT_DIR/injection_scan.log"
readonly VULNERABILITY_PATTERNS=(';' '|' '&' '$(' '`' '>' '<' '&&' '||')

# ログ関数
log_scan() {
    local message="$1"
    local level="${2:-INFO}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$SCAN_LOG"
}

# ファイルの脆弱性チェック
check_file_vulnerabilities() {
    local file="$1"
    local line_number=0
    local vulnerabilities=0

    log_scan "ファイルのスキャンを開始: $file"

    if [ ! -f "$file" ]; then
        log_scan "ファイルが見つかりません: $file" "ERROR"
        return 1
    fi

    while IFS= read -r line || [ -n "$line" ]; do
        ((line_number++))

        # コメント行と空行をスキップ
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$line" ]] && continue

        # 脆弱性パターンのチェック
        for pattern in "${VULNERABILITY_PATTERNS[@]}"; do
            if [[ "$line" =~ .*[[:space:]]*\$[a-zA-Z_][a-zA-Z0-9_]*.*$pattern ]]; then
                log_scan "脆弱性を検出 [行 $line_number]: $line" "HIGH"
                log_scan "  パターン: 変数展開 + '$pattern'" "HIGH"
                ((vulnerabilities++))
            fi

            # evalの使用チェック
            if [[ "$line" =~ .*eval[[:space:]]+.*\$ ]]; then
                log_scan "脆弱性を検出 [行 $line_number]: $line" "HIGH"
                log_scan "  パターン: evalと変数展開" "HIGH"
                ((vulnerabilities++))
            fi

            # 引用符なしの変数チェック
            if [[ "$line" =~ .*[[:space:]]+\$[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]* ]] && [[ ! "$line" =~ .*\".*\$.*\".* ]] && [[ ! "$line" =~ .*'.*\$.*'.* ]]; then
                log_scan "潜在的な脆弱性 [行 $line_number]: $line" "MEDIUM"
                log_scan "  パターン: 引用符なしの変数展開" "MEDIUM"
                ((vulnerabilities++))
            fi
        done
    done < "$file"

    log_scan "スキャン完了: $file (脆弱性数: $vulnerabilities)"
    return $vulnerabilities
}

# 安全なコマンド実行関数
safe_execute_command() {
    local cmd="$1"
    shift
    local args=("$@")

    log_scan "安全なコマンド実行: $cmd ${args[*]}"

    # コマンドの存在確認
    if ! command -v "$cmd" >/dev/null 2>&1; then
        log_scan "コマンドが見つかりません: $cmd" "ERROR"
        return 1
    fi

    # 安全な実行
    "$cmd" "${args[@]}"
    local exit_code=$?

    log_scan "コマンド実行完了: $cmd (終了コード: $exit_code)"
    return $exit_code
}

# 入力検証関数
validate_user_input() {
    local input="$1"
    local input_type="$2"

    log_scan "入力検証: $input (タイプ: $input_type)"

    case "$input_type" in
        "filename")
            # ファイル名の検証
            if [[ ! "$input" =~ ^[a-zA-Z0-9_.-]+$ ]]; then
                log_scan "無効なファイル名: $input" "ERROR"
                return 1
            fi
            ;;
        "path")
            # パスの検証
            if [[ "$input" =~ \.\. ]] || [[ "$input" =~ ^/ ]]; then
                log_scan "無効なパス: $input" "ERROR"
                return 1
            fi
            ;;
        "number")
            # 数値の検証
            if [[ ! "$input" =~ ^[0-9]+$ ]]; then
                log_scan "無効な数値: $input" "ERROR"
                return 1
            fi
            ;;
        *)
            # 一般的な入力検証
            if [[ "$input" =~ [;&|()`$<>\\] ]]; then
                log_scan "危険な文字を含む入力: $input" "ERROR"
                return 1
            fi
            ;;
    esac

    log_scan "入力検証パス: $input"
    return 0
}

# デモンストレーション関数
demonstrate_injection() {
    log_scan "コマンドインジェクションのデモンストレーションを開始" "INFO"

    # 安全な入力処理のデモ
    echo "=== 安全な入力処理のデモ ==="

    # テスト入力
    test_inputs=(
        "safe_file.txt"
        "malicious; rm -rf /"
        "normal.log"
        "test$(whoami)"
        "valid_file_123.txt"
    )

    for input in "${test_inputs[@]}"; do
        echo "入力: $input"
        if validate_user_input "$input" "filename"; then
            echo "✅ 安全な入力です"
        else
            echo "❌ 危険な入力です"
        fi
        echo "---"
    done

    # 安全なファイル操作のデモ
    echo ""
    echo "=== 安全なファイル操作のデモ ==="

    # テスト用の安全なファイルを作成
    test_file="$SCRIPT_DIR/test_safe_file.txt"
    echo "これは安全なテストファイルです。" > "$test_file"

    if validate_user_input "$(basename "$test_file")" "filename"; then
        echo "安全なファイル読み込み:"
        safe_execute_command cat "$test_file"
    else
        echo "ファイル名が無効です"
    fi

    # テストファイルのクリーンアップ
    rm -f "$test_file"

    log_scan "デモンストレーション完了" "INFO"
}

# 脆弱性のあるコード例の生成
generate_vulnerable_examples() {
    log_scan "脆弱性のあるコード例を生成" "INFO"

    cat > vulnerable_example.sh << 'EOF'
#!/bin/bash

# ❌ 脆弱性のあるコード例（教育用）
echo "脆弱性のあるコード例 - 実行しないでください"

# 脆弱性1: 直接変数展開
user_input="$1"
cat $user_input

# 脆弱性2: evalの使用
config="$1"
eval "echo $config"

# 脆弱性3: 引用符なしのgrep
search="$1"
grep $search /var/log/syslog

# 脆弱性4: 危険なコマンド連結
filename="$1"
ls -la "$filename" && echo "ファイル一覧完了"
EOF

    chmod +x vulnerable_example.sh
    log_scan "脆弱性のあるコード例を生成: vulnerable_example.sh" "WARNING"
}

# メイン処理
main() {
    log_scan "コマンドインジェクションスキャナーを起動" "INFO"
    log_scan "============================================"

    # ログファイルの初期化
    : > "$SCAN_LOG"

    # コマンドライン引数の処理
    case "${1:-scan}" in
        "scan")
            # カレントディレクトリのシェルスクリプトをスキャン
            log_scan "カレントディレクトリのスクリプトをスキャンします" "INFO"

            total_vulnerabilities=0
            total_files=0

            for script in *.sh; do
                if [ -f "$script" ]; then
                    ((total_files++))
                    check_file_vulnerabilities "$script"
                    vulnerabilities=$?
                    total_vulnerabilities=$((total_vulnerabilities + vulnerabilities))
                fi
            done

            log_scan "スキャン結果: $total_files ファイル中 $total_vulnerabilities 件の脆弱性" "INFO"
            ;;
        "demo")
            # デモンストレーションモード
            demonstrate_injection
            ;;
        "generate")
            # 脆弱性のあるコード例の生成
            generate_vulnerable_examples
            ;;
        "validate")
            # 入力検証のテスト
            if [ $# -gt 1 ]; then
                shift
                for input in "$@"; do
                    validate_user_input "$input" "general"
                done
            else
                echo "使用方法: $0 validate <input1> <input2> ..."
            fi
            ;;
        *)
            echo "使用方法: $0 [scan|demo|generate|validate]"
            echo "  scan     - カレントディレクトリのスクリプトをスキャン"
            echo "  demo     - デモンストレーションを実行"
            echo "  generate - 脆弱性のあるコード例を生成"
            echo "  validate - 入力検証をテスト"
            exit 1
            ;;
    esac

    log_scan "スキャナー処理が完了しました" "INFO"
    return 0
}

# スクリプトの実行
main "$@"
```

2. 実行権限の付与

```bash
chmod +x command_injection_scanner.sh
```

3. デモンストレーションの実行

```bash
./command_injection_scanner.sh demo
```

4. スキャンの実行

```bash
# カレントディレクトリのスクリプトをスキャン
./command_injection_scanner.sh scan
```

5. 入力検証のテスト

```bash
# 安全な入力と危険な入力をテスト
./command_injection_scanner.sh validate "safe_file.txt" "malicious; rm -rf /" "normal.log"
```

6. 脆弱性のあるコード例の生成

```bash
./command_injection_scanner.sh generate

# 生成されたファイルをスキャン
./command_injection_scanner.sh scan vulnerable_example.sh
```

7. スキャンログの確認

```bash
echo "スキャンログ:"
cat injection_scan.log
```

8. 実際の攻撃シナリオのテスト

```bash
# テスト用の脆弱性スクリプトを作成
cat > test_vulnerable.sh << 'EOF'
#!/bin/bash
echo "脆弱性テスト用スクリプト"

# 脆弱性のあるコード（テスト用）
user_input="$1"
echo "入力: $user_input"

# 危険な変数展開
echo "ファイル一覧:"
ls $user_input 2>/dev/null || echo "エラーが発生しました"
EOF

chmod +x test_vulnerable.sh

# 安全な入力でテスト
./test_vulnerable.sh "*.txt"

# 危険な入力でテスト（デモンストレーション用）
echo "危険な入力のテスト（デモ用）:"
./test_vulnerable.sh "*.txt; echo '攻撃成功！'"

# テストファイルのクリーンアップ
rm -f test_vulnerable.sh vulnerable_example.sh
```

:::

## 📋 コマンドインジェクション防御のベストプラクティス

### 推奨される防御策

1. **入力検証**: すべての外部入力を厳密に検証
2. **適切な引用符化**: 変数は常に引用符で囲む
3. **配列の使用**: 引数を配列で処理して単語分割を防止
4. **最小権限**: 必要最小限の権限でスクリプトを実行
5. **安全な代替案**: 危険なコマンドの代わりに安全な関数を使用

### 開発プロセスでの対策

```bash
# ✅ 良い例：開発時のセキュアコーディングチェック
security_check() {
    local file="$1"

    # 自動セキュリティチェック
    if grep -q "eval.*\$" "$file"; then
        echo "警告: evalと変数展開が使用されています" >&2
    fi

    if grep -q "\$[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]*;" "$file"; then
        echo "警告: セミコロンと変数展開が検出されました" >&2
    fi

    # 静的解析ツールの実行
    shellcheck "$file"
}
```

### コードレビューチェックリスト

- [ ] すべての変数が引用符で囲まれているか
- [ ] 外部入力の検証が実装されているか
- [ ] evalや危険なコマンドが使用されていないか
- [ ] 配列を使用して引数を安全に処理しているか
- [ ] 最小権限の原則が適用されているか
- [ ] エラーハンドリングが適切か

## まとめ

コマンドインジェクションは深刻な脆弱性ですが、適切な防御策を実装することで効果的に防止できます。セキュアなコーディングプラクティスを日常的に適用し、多重防御のアプローチを採用することが重要です。

:::note 要点のまとめ

- **入力検証**: すべての外部入力を厳密に検証し、サニタイズ
- **安全な実行**: 変数は引用符で囲み、配列を使用して引数を処理
- **危険回避**: evalや直接変数展開を避け、安全な代替案を使用
- **最小権限**: 必要最小限の権限でスクリプトを実行
- **深層防御**: 多重のセキュリティ層で脆弱性を防止
- **継続的改善**: 定期的なセキュリティチェックとコードレビュー

:::

コマンドインジェクション防御は、シェルスクリプト開発における基本的なセキュリティ要件です。適切な知識と実践を通じて、安全で信頼性の高いスクリプトを開発しましょう。

## 関連リンク

- [安全な一時ファイルのベストプラクティス](./secure-temp-files)
- [set -e -u -x -o pipefailのベストプラクティス](../error-handling/set-e-u-x-o-pipefail)
- [シェルスクリプトのセキュリティ対策](../../security/introduction)
- [入力検証のベストプラクティス](../../input-validation/basics)

## さらに深く学習したい方へ

コマンドインジェクション防御をさらに深く学びたい方は、当社の研修プログラムをご利用ください。実践的なセキュリティ演習を通じて、高度な防御スキルを体系的に習得できます。