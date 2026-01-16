---
title: "終了コードチェックのベストプラクティス | シェルスクリプトのエラーハンドリング"
slug: exit-code-checking
status: publish
post_type: page
seo_keywords: "シェルスクリプト, 終了コード, exit code, エラーハンドリング, $?, ベストプラクティス"
seo_description: "シェルスクリプトにおける終了コードチェックの重要性と実践的な方法を解説。$?変数の使い方から条件分岐でのエラーハンドリングまで網羅的に説明します。"
tags: ["シェルスクリプト", "終了コード", "エラーハンドリング", "$?", "ベストプラクティス"]
image: "https://example.com/images/shell-script-exit-codes.jpg"
parent: "best-practices"
---

## 🔢 はじめに

シェルスクリプトにおける終了コードチェックは、コマンドの実行結果を正確に把握し、適切なエラーハンドリングを行うための基本技術です。各コマンドは終了時に数値の終了コードを返し、その値によって成功・失敗を判断します。このページでは、終了コードの基本的な概念から実践的なチェック方法まで詳しく解説します。

### このページで学べること

:::note

このページでは、以下のことを学びます：

- 終了コードの基本的な概念と重要な値
- `$?`変数の使い方と注意点
- 条件分岐での終了コードチェック
- 複数コマンドの終了コード処理
- カスタム終了コードの設定方法
- 終了コードチェックのベストプラクティス

:::

## 📊 終了コードとは？

終了コード（Exit Code）は、コマンドやスクリプトの実行結果を表す数値です。通常、0が成功を、0以外が何らかのエラーを示します。

### 一般的な終了コードの意味

| 終了コード | 意味 | 説明 |
|-----------|------|------|
| 0 | 成功 | 正常に処理が完了した |
| 1 | 一般的なエラー | よく使われる一般的なエラー |
| 2 | 誤った使用方法 | コマンドの使い方が間違っている |
| 126 | コマンド実行不可 | 実行権限がない、またはコマンドが見つからない |
| 127 | コマンドが見つからない | 指定されたコマンドが存在しない |
| 128 + N | シグナルによる終了 | シグナルNを受信して終了した |
| 130 | Ctrl+Cによる終了 | SIGINT（割り込みシグナル）を受信 |
| 255 | 終了コード範囲外 | 無効な終了コードを指定 |

### 終了コードの基本動作

```bash
#!/bin/bash

# 成功するコマンド
ls /tmp
echo "終了コード: $?"  # 0が表示される

# 失敗するコマンド
ls /nonexistent
echo "終了コード: $?"  # 2が表示される（ENOENT）
```

## 💡 $?変数の使い方

`$?`変数は、最後に実行されたコマンドの終了コードを保持します。この変数を適切に使用することが、効果的なエラーハンドリングの鍵となります。

### $?変数の基本使用

```bash
#!/bin/bash

# コマンド実行
command_that_might_fail

# 終了コードのチェック
if [ $? -eq 0 ]; then
    echo "成功しました"
else
    echo "失敗しました（終了コード: $?）"
fi
```

### $?変数の注意点

:::note $?変数の重要な注意点

`$?`変数は次のコマンドを実行すると上書きされてしまいます。そのため、必要な値はすぐに変数に保存する必要があります。

```bash
#!/bin/bash

# ❌ 悪い例：$?が上書きされる
command_that_might_fail
echo "デバッグメッセージ"  # このコマンドが$?を上書きする
if [ $? -eq 0 ]; then     # echoの終了コードをチェックしている
    echo "成功"
fi

# ✅ 良い例：終了コードを変数に保存
command_that_might_fail
exit_code=$?
if [ $exit_code -eq 0 ]; then
    echo "成功"
else
    echo "失敗（終了コード: $exit_code）"
fi
```

:::

## 🔍 条件分岐での終了コードチェック

終了コードを効果的にチェックするための様々な方法を学びましょう。

### if文を使用したチェック

```bash
#!/bin/bash

# 直接的なチェック
if command_that_might_fail; then
    echo "成功しました"
else
    echo "失敗しました"
fi

# 終了コードの詳細チェック
command_that_might_fail
case $? in
    0)  echo "正常終了" ;;
    1)  echo "一般的なエラー" ;;
    2)  echo "使用方法の誤り" ;;
    126) echo "コマンド実行不可" ;;
    127) echo "コマンドが見つからない" ;;
    130) echo "Ctrl+Cで中断されました" ;;
    *)   echo "その他のエラー（終了コード: $?）" ;;
esac
```

### 論理演算子を使用したチェック

```bash
#!/bin/bash

# AND演算子（&&）
command1 && command2  # command1が成功した場合のみcommand2を実行

# OR演算子（||）
command1 || command2  # command1が失敗した場合のみcommand2を実行

# 組合せ
command1 && command2 || command3
# command1が成功すればcommand2を実行、失敗すればcommand3を実行
```

### 関数内での終了コードチェック

```bash
#!/bin/bash

# エラーチェック関数
check_result() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 が成功しました"
    else
        echo "❌ $1 が失敗しました（終了コード: $?）"
        return 1
    fi
}

# 使用例
process_file() {
    local file="$1"

    # ファイルの存在確認
    if [ ! -f "$file" ]; then
        echo "エラー: ファイルが見つかりません: $file"
        return 1
    fi

    # ファイル処理
    cp "$file" "${file}.backup"
    check_result "バックアップ作成"

    # 追加処理
    grep "pattern" "$file" > "${file}.filtered"
    check_result "フィルタリング"
}

# 関数の呼び出し
process_file "example.txt"
```

## 🛠️ 実践的な終了コードチェックのパターン

実際の開発で役立つ終了コードチェックのパターンを紹介します。

### パイプラインの終了コードチェック

```bash
#!/bin/bash

# パイプラインの終了コードチェック
command1 | command2 | command3
pipeline_exit_code=${PIPESTATUS[0]}  # 最初のコマンドの終了コード

if [ $pipeline_exit_code -ne 0 ]; then
    echo "パイプラインの最初のコマンドが失敗しました: $pipeline_exit_code"
fi

# または set -o pipefail を使用
set -o pipefail
command1 | command2 | command3
if [ $? -ne 0 ]; then
    echo "パイプライン内のいずれかのコマンドが失敗しました"
fi
```

### 複数コマンドの終了コード処理

```bash
#!/bin/bash

# 複数コマンドの実行と終了コードの集約
exit_code=0

echo "処理1を開始"
command1 || exit_code=1

echo "処理2を開始"
command2 || exit_code=1

echo "処理3を開始"
command3 || exit_code=1

if [ $exit_code -eq 0 ]; then
    echo "すべての処理が成功しました"
else
    echo "一部の処理が失敗しました"
    exit $exit_code
fi
```

### バッチ処理の終了コード管理

```bash
#!/bin/bash

# バッチ処理の終了コード管理
process_batch() {
    local total=0
    local success=0
    local failed=0

    for file in *.txt; do
        if [ -f "$file" ]; then
            total=$((total + 1))

            # ファイル処理
            if process_single_file "$file"; then
                success=$((success + 1))
                echo "✅ $file 処理成功"
            else
                failed=$((failed + 1))
                echo "❌ $file 処理失敗"
            fi
        fi
    done

    echo "処理結果: 成功 $success / 合計 $total"

    if [ $failed -gt 0 ]; then
        echo "一部のファイル処理に失敗しました"
        return 1
    else
        echo "すべてのファイル処理が成功しました"
        return 0
    fi
}
```

## 🔧 カスタム終了コードの設定

自作の関数やスクリプトで意味のある終了コードを返す方法を学びましょう。

### 関数でのカスタム終了コード

```bash
#!/bin/bash

# ファイル検証関数
validate_file() {
    local file="$1"

    # ファイルの存在確認
    if [ ! -f "$file" ]; then
        return 2  # ファイルが存在しない
    fi

    # ファイルサイズの確認
    if [ ! -s "$file" ]; then
        return 3  # ファイルが空
    fi

    # 読み取り権限の確認
    if [ ! -r "$file" ]; then
        return 4  # 読み取り権限がない
    fi

    # すべてのチェックをパス
    return 0
}

# 使用例
validate_file "important.txt"
case $? in
    0) echo "ファイルは有効です" ;;
    2) echo "エラー: ファイルが存在しません" ;;
    3) echo "エラー: ファイルが空です" ;;
    4) echo "エラー: ファイルを読み取れません" ;;
esac
```

### スクリプトでのカスタム終了コード

```bash
#!/bin/bash

# スクリプトの終了コード定義
EXIT_SUCCESS=0
EXIT_ERROR=1
EXIT_INVALID_ARGS=2
EXIT_FILE_NOT_FOUND=3
EXIT_PERMISSION_DENIED=4
EXIT_TIMEOUT=5

# 引数チェック
if [ $# -lt 1 ]; then
    echo "使用方法: $0 <filename>"
    exit $EXIT_INVALID_ARGS
fi

filename="$1"

# ファイルの存在確認
if [ ! -f "$filename" ]; then
    echo "エラー: ファイルが見つかりません: $filename"
    exit $EXIT_FILE_NOT_FOUND
fi

# 読み取り権限の確認
if [ ! -r "$filename" ]; then
    echo "エラー: ファイルを読み取れません: $filename"
    exit $EXIT_PERMISSION_DENIED
fi

# メイン処理
echo "ファイルを処理中: $filename"

# 処理成功
exit $EXIT_SUCCESS
```

## 🚀 終了コードチェックを動かして確認してみよう

それでは、実際に終了コードチェックを実装して動作を確認してみましょう。

:::step

1. サンプルスクリプトの作成

以下の内容で`exit_code_example.sh`を作成します。

```bash
#!/bin/bash

# 終了コードチェックのサンプルスクリプト
set -euo pipefail

# 定数の定義
EXIT_SUCCESS=0
EXIT_INVALID_ARGS=1
EXIT_FILE_NOT_FOUND=2
EXIT_PROCESS_ERROR=3

# ヘルプメッセージの表示
show_help() {
    cat << EOF
使用方法: $0 <ファイル名>

このスクリプトは指定されたファイルの処理を行い、
終了コードを適切に返します。

終了コード:
    0: 成功
    1: 引数エラー
    2: ファイルが見つからない
    3: 処理エラー
EOF
}

# ファイル処理関数
process_file() {
    local file="$1"

    echo "ファイルを処理中: $file"

    # ファイルの行数をカウント
    line_count=$(wc -l < "$file")
    echo "行数: $line_count"

    # 行数が0の場合はエラー
    if [ "$line_count" -eq 0 ]; then
        echo "エラー: ファイルが空です"
        return $EXIT_PROCESS_ERROR
    fi

    # ファイルの内容を表示
    echo "--- ファイル内容 ---"
    cat "$file"
    echo "--- ここまで ---"

    return $EXIT_SUCCESS
}

# メイン処理
main() {
    # 引数チェック
    if [ $# -ne 1 ]; then
        echo "エラー: 引数の数が不正です"
        show_help
        exit $EXIT_INVALID_ARGS
    fi

    filename="$1"

    # ヘルプオプションのチェック
    if [ "$filename" = "-h" ] || [ "$filename" = "--help" ]; then
        show_help
        exit $EXIT_SUCCESS
    fi

    # ファイルの存在確認
    if [ ! -f "$filename" ]; then
        echo "エラー: ファイルが見つかりません: $filename"
        exit $EXIT_FILE_NOT_FOUND
    fi

    # ファイル処理の実行
    process_file "$filename"
    process_result=$?

    if [ $process_result -eq $EXIT_SUCCESS ]; then
        echo "✅ ファイル処理が正常に完了しました"
    else
        echo "❌ ファイル処理に失敗しました"
        exit $process_result
    fi
}

# メイン関数の実行
main "$@"
```

2. 実行権限の付与

```bash
chmod +x exit_code_example.sh
```

3. 正常ケースの実行

まずテスト用のファイルを作成します。

```bash
echo "これはテストファイルです。" > test.txt
echo "複数行の内容です。" >> test.txt
```

スクリプトを実行します。

```bash
./exit_code_example.sh test.txt
```

実行結果：
```
ファイルを処理中: test.txt
行数: 2
--- ファイル内容 ---
これはテストファイルです。
複数行の内容です。
--- ここまで ---
✅ ファイル処理が正常に完了しました
```

4. 終了コードの確認

```bash
./exit_code_example.sh test.txt
echo "終了コード: $?"
```

5. エラーケースの実行

存在しないファイルを指定：

```bash
./exit_code_example.sh nonexistent.txt
echo "終了コード: $?"
```

引数なしで実行：

```bash
./exit_code_example.sh
echo "終了コード: $?"
```

6. 空ファイルのテスト

```bash
touch empty.txt
./exit_code_example.sh empty.txt
echo "終了コード: $?"
```

:::

## 📋 終了コードチェックのベストプラクティス

### 推奨されるパターン

1. **即時チェック**: コマンド実行後すぐに終了コードをチェックする
2. **変数保存**: 終了コードはすぐに変数に保存する
3. **意味のあるコード**: カスタム終了コードには意味のある値を使用する
4. **一貫性**: プロジェクト内で終了コードの意味を統一する
5. **ドキュメント**: カスタム終了コードの意味をコメントで明記する

### 避けるべきパターン

```bash
# ❌ 悪い例：$?が上書きされる
command
echo "デバッグ"
if [ $? -eq 0 ]; then  # echoの終了コードをチェックしている
    # ...
fi

# ❌ 悪い例：終了コードを無視
command_that_might_fail
# エラーチェックなし

# ❌ 悪い例：不適切な終了コード
exit 255  # 範囲外の終了コード
```

## まとめ

終了コードチェックは、シェルスクリプトの信頼性を向上させるための基本的かつ重要な技術です。

:::note 要点のまとめ

- **終了コードの基本**: 0が成功、0以外が失敗
- **$?変数**: 最後に実行したコマンドの終了コードを保持
- **即時チェック**: 終了コードはすぐに変数に保存する
- **条件分岐**: if文や論理演算子で効果的にチェック
- **カスタムコード**: 意味のある終了コードを定義して使用
- **ベストプラクティス**: 一貫性のあるエラーハンドリングを実装

:::

適切な終了コードチェックを実装することで、より堅牢で保守性の高いシェルスクリプトを作成できます。特にバッチ処理や自動化スクリプトでは、終了コードの適切な処理が不可欠です。

## 関連リンク

- [set -e -u -x -o pipefailのベストプラクティス](./set-e-u-x-o-pipefail)
- [trapコマンドによるエラーハンドリング](./trap-command)
- [シェルスクリプトの条件分岐](../../control-structures/conditionals)

## さらに深く学習したい方へ

終了コードチェックをさらに深く学びたい方は、当社の研修プログラムをご利用ください。実践的な演習を通じて、エラーハンドリングの専門スキルを習得できます。