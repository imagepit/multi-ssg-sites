---
title: "シェルデバッガーのベストプラクティス | bashdbと効果的なデバッグ手法"
slug: shell-debugger
status: publish
post_type: page
seo_keywords: "シェルスクリプト, bashdb, デバッガー, デバッグ, ブレークポイント, ステップ実行"
seo_description: "シェルスクリプトのデバッガーbashdbの使い方からブレークポイント設定、ステップ実行、変数検査まで、実践的なデバッグ手法を詳しく解説します。"
tags: ["シェルスクリプト", "bashdb", "デバッガー", "デバッグ", "ブレークポイント", "ステップ実行"]
image: "https://example.com/images/shell-script-debugger.jpg"
parent: "best-practices"
---

## 🐛 はじめに

シェルスクリプトのデバッグにおいて、`set -x`トレースは便利ですが、より複雑な問題には本格的なデバッガーが必要です。bashdb（Bash Debugger）は、GDBに似た対話的なデバッグ環境を提供し、ブレークポイントの設定、ステップ実行、変数の検査など、高度なデバッグ機能を利用できます。このページでは、bashdbのインストールから実践的な使用方法まで詳しく解説します。

### このページで学べること

:::note

このページでは、以下のことを学びます：

- bashdbのインストール方法と基本設定
- デバッガーの基本操作（起動、終了、ヘルプ）
- ブレークポイントの設定と管理
- ステップ実行とコードのトレース
- 変数の検査と変更
- コールスタックの表示と操作
- 条件付きブレークポイントとウォッチポイント

:::

## 🛠️ bashdbとは？

bashdbはBashスクリプト用のソースレベルデバッガーで、以下の機能を提供します：

- **ブレークポイント**: 特定の行で実行を一時停止
- **ステップ実行**: 1行ずつコードを実行
- **変数検査**: 変数の値を確認・変更
- **コールスタック**: 関数呼び出しの階層を表示
- **条件付きブレーク**: 特定条件でブレーク
- **ウォッチポイント**: 変数の変更を監視

### bashdbの特徴

- GDBと似たコマンドインターフェース
- スクリプトのソースコードレベルでのデバッグ
- 対話的なデバッグセッション
- 複雑なスクリプトの問題解析に最適

## 🔧 bashdbのインストールと設定

### インストール方法

bashdbはパッケージマネージャーからインストールできます。

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install bashdb

# CentOS/RHEL/Fedora
sudo yum install bashdb

# macOS（Homebrew）
brew install bashdb

# ソースからインストール
wget https://sourceforge.net/projects/bashdb/files/bashdb/4.4-0.1/bashdb-4.4-0.1.tar.gz
tar -xzf bashdb-4.4-0.1.tar.gz
cd bashdb-4.4-0.1
./configure
make
sudo make install
```

### 基本的な設定

```bash
# 設定ファイルの作成
mkdir -p ~/.bashdb
cat > ~/.bashdb/init << 'EOF'
# デバッガーの初期設定
set history save on
set history size 1000
set pagination off
set listsize 20

# エイリアスの設定
alias ll = list
alias n = next
alias s = step
alias c = continue
alias b = break
alias p = print
EOF
```

## 💡 基本的なデバッグ操作

### デバッガーの起動

```bash
# 基本的な起動方法
bashdb script.sh

# 引数を渡して起動
bashdb script.sh arg1 arg2

# 特定の行から起動
bashdb --line 10 script.sh
```

### 基本コマンド

| コマンド | 省略形 | 説明 |
|---------|-------|------|
| `run` | `r` | スクリプトを実行 |
| `quit` | `q` | デバッガーを終了 |
| `help` | `h` | ヘルプを表示 |
| `list` | `l` | ソースコードを表示 |
| `break` | `b` | ブレークポイントを設定 |
| `next` | `n` | 次の行を実行 |
| `step` | `s` | 次の行を実行（関数に入る） |
| `continue` | `c` | 実行を継続 |
| `print` | `p` | 変数の値を表示 |
| `backtrace` | `bt` | コールスタックを表示 |

### 簡単なデバッグセッション

```bash
# サンプルスクリプトを作成
cat > sample.sh << 'EOF'
#!/bin/bash

calculate_sum() {
    local a=$1
    local b=$2
    local sum=$((a + b))
    echo "合計: $sum"
    return $sum
}

main() {
    local x=10
    local y=20
    echo "x = $x, y = $y"
    calculate_sum $x $y
}

main "$@"
EOF

chmod +x sample.sh

# デバッガーで起動
bashdb sample.sh
```

デバッグセッションの例：
```
Bash Debugger 4.4-0.1
Copyright (C) 2002, 2003, 2004, 2006-2009, 2011-2012, 2014 Rocky Bernstein
This is free software, covered by the GNU General Public License, and you are
welcome to change it and/or distribute copies of it under certain conditions.

(/home/user/sample.sh:1):
1:	#!/bin/bash
bashdb<1> break 10   # 10行目にブレークポイントを設定
Breakpoint 1 set at file /home/user/sample.sh, line 10.

bashdb<2> run        # スクリプトを実行
Starting program: /home/user/sample.sh

Breakpoint 1, main() at /home/user/sample.sh:10
10:	    local x=10
bashdb<3> next       # 次の行を実行
11:	    local y=20
bashdb<4> print x    # 変数xの値を確認
x = 10
bashdb<5> step       # calculate_sum関数にステップイン
calculate_sum(a=10, b=20) at /home/user/sample.sh:4
4:	    local a=$1
bashdb<6> continue   # 実行を継続
x = 10, y = 20
合計: 30
Debugging program terminated normally. Use 'q' to quit or 'R' to restart.
```

## 🔍 ブレークポイントの高度な使用法

### ブレークポイントの種類

```bash
# 行番号でのブレークポイント
break 15
b 20

# 関数でのブレークポイント
break calculate_sum
b main

# 条件付きブレークポイント
break 20 if x > 15
b calculate_sum if a > 5

# 一時的なブレークポイント（一度だけ有効）
tbreak 25
tb calculate_sum

# ウォッチポイント（変数の変更を監視）
watch x
w y
```

### ブレークポイントの管理

```bash
# ブレークポイントの一覧表示
info break
info b

# ブレークポイントの無効化
disable 1
disable 1-3

# ブレークポイントの有効化
enable 1
enable 1-3

# ブレークポイントの削除
delete 1
del 1-3
clear 15  # 特定の行のブレークポイントを削除
```

## 🛠️ 変数の検査と操作

### 変数の表示

```bash
# 現在のスコープの変数を表示
info variables
info v

# 特定の変数の値を表示
print x
p x

# 配列の表示
print my_array[@]
p my_array[@]

# 配列のインデックス付き表示
declare -p my_array

# 環境変数の表示
info environment
```

### 変数の変更

```bash
# 変数の値を変更
set x=100
set y=200

# 配列要素の変更
set my_array[0]="new_value"

# 新しい変数の設定
set new_var="hello"
```

### 式の評価

```bash
# 数式の評価
print x + y
p $x + $y

# 文字列操作
print "${variable:0:5}"
p ${variable#prefix}

# コマンドの実行と結果の表示
shell ls -la
! pwd
```

## 🚀 ステップ実行とコードトレース

### ステップ実行の種類

```bash
# 次の行を実行（関数に入らない）
next
n

# 次の行を実行（関数に入る）
step
s

# 現在の関数から抜けるまで実行
finish
fin

# 次のブレークポイントまで実行
continue
c

# 指定した行まで実行
until 25
unt 25
```

### プログラムの状態確認

```bash
# 現在の実行位置を表示
frame
f

# コールスタックを表示
backtrace
bt
where

# ソースコードの表示
list
l
list 10-20  # 行範囲を指定

# 次の実行行を表示
display
```

## 📊 高度なデバッグテクニック

### 条件付きデバッグ

```bash
# 条件付きブレークポイント
break calculate_sum if a > 100
b 30 if result -eq 0

# ウォッチポイントの条件設定
watch x if x > 50

# コマンドの条件付き実行
condition 1 x > 10  # ブレークポイント1の条件変更
```

### デバッグ用コマンドの自動実行

```bash
# ブレークポイント到達時にコマンドを実行
commands 1
silent
print "ブレークポイント1に到達"
print "x = $x, y = $y"
continue
end

# 変数が変更されたときに自動実行
watch y
commands 2
print "yが変更されました: $y"
backtrace
end
```

### デバッグセッションの保存と読み込み

```bash
# デバッグコマンドをファイルに保存
save debug_session.txt

# デバッグコマンドファイルを実行
source debug_session.txt

# 起動時にコマンドファイルを読み込み
bashdb -x debug_commands.txt script.sh
```

## 🚀 シェルデバッガーを動かして確認してみよう

それでは、実際にbashdbを使用して複雑なスクリプトをデバッグしてみましょう。

:::step

1. デバッグ用スクリプトの作成

以下の内容で`debug_example.sh`を作成します。

```bash
#!/bin/bash

# 複雑な処理を持つサンプルスクリプト
set -euo pipefail

# 定数の定義
readonly DATA_FILE="data.txt"
readonly OUTPUT_FILE="result.txt"
readonly MAX_LINES=100

# データ検証関数
validate_data() {
    local data="$1"
    local line_number="$2"

    # 空行チェック
    if [ -z "$data" ]; then
        echo "警告: $line_number 行目が空です" >&2
        return 1
    fi

    # フォーマットチェック（カンマ区切り）
    if [[ ! "$data" =~ ^[^,]+,[^,]+,[^,]+$ ]]; then
        echo "エラー: $line_number 行目のフォーマットが不正です: $data" >&2
        return 1
    fi

    return 0
}

# データ処理関数
process_data() {
    local input_file="$1"
    local output_file="$2"

    local line_count=0
    local error_count=0
    local total_value=0

    echo "データ処理開始: $input_file → $output_file"

    # 出力ファイルの初期化
    : > "$output_file"
    echo "id,value,category,result" > "$output_file"

    # ファイルの行ごとに処理
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_count++))

        # コメント行と空行をスキップ
        [[ "$line" =~ ^# ]] && continue
        [[ -z "$line" ]] && continue

        # データ検証
        if ! validate_data "$line" "$line_count"; then
            ((error_count++))
            continue
        fi

        # データの解析
        IFS=',' read -r id value category <<< "$line"

        # 値の計算
        if [[ "$value" =~ ^[0-9]+$ ]]; then
            result=$((value * 2))
            total_value=$((total_value + value))
        else
            result="ERROR: invalid value"
            ((error_count++))
        fi

        # 結果の出力
        echo "$id,$value,$category,$result" >> "$output_file"

        # 進捗表示
        if (( line_count % 10 == 0 )); then
            echo "処理中: $line_count 行目..."
        fi

        # 最大行数チェック
        if (( line_count >= MAX_LINES )); then
            echo "警告: 最大行数 ($MAX_LINES) に到達しました" >&2
            break
        fi

    done < "$input_file"

    # 統計情報の表示
    echo "処理完了:"
    echo "  処理行数: $line_count"
    echo "  エラー数: $error_count"
    echo "  合計値: $total_value"

    return $error_count
}

# 設定ファイル処理関数
load_config() {
    local config_file="$1"

    local config_lines=0
    local debug_mode="false"
    local max_items=50

    echo "設定ファイル読み込み: $config_file"

    if [ ! -f "$config_file" ]; then
        echo "警告: 設定ファイルが見つかりません: $config_file"
        return 0
    fi

    while IFS='=' read -r key value; do
        ((config_lines++))

        # コメント行と空行をスキップ
        [[ "$key" =~ ^# ]] && continue
        [[ -z "$key" ]] && continue

        # 設定値の処理
        case "$key" in
            "DEBUG_MODE")
                debug_mode="${value:-false}"
                echo "デバッグモード: $debug_mode"
                ;;
            "MAX_ITEMS")
                max_items="${value:-50}"
                echo "最大アイテム数: $max_items"
                ;;
            "LOG_LEVEL")
                echo "ログレベル: $value"
                ;;
            *)
                echo "不明な設定: $key = $value"
                ;;
        esac

    done < "$config_file"

    echo "設定ファイル読み込み完了: $config_lines 行"

    # 設定値を返す
    echo "$debug_mode:$max_items"
}

# メイン処理
main() {
    echo "シェルデバッガーのデモンストレーション"
    echo "====================================="

    # 引数チェック
    if [ $# -lt 1 ]; then
        echo "使用方法: $0 <データファイル> [設定ファイル]"
        echo "例: $0 data.txt config.ini"
        return 1
    fi

    local data_file="$1"
    local config_file="${2:-config.ini}"

    # ファイルの存在確認
    if [ ! -f "$data_file" ]; then
        echo "エラー: データファイルが見つかりません: $data_file"
        return 1
    fi

    # 設定ファイルの読み込み
    local config_result
    config_result=$(load_config "$config_file")
    local debug_mode="${config_result%%:*}"
    local max_items="${config_result##*:}"

    echo "デバッグモード: $debug_mode"
    echo "最大アイテム数: $max_items"

    # データ処理の実行
    local process_result
    process_data "$data_file" "$OUTPUT_FILE"
    process_result=$?

    echo "処理結果コード: $process_result"

    if [ $process_result -eq 0 ]; then
        echo "✅ すべての処理が正常に完了しました"
    else
        echo "⚠️  一部の処理でエラーが発生しました (エラー数: $process_result)"
    fi

    # 結果ファイルの確認
    if [ -f "$OUTPUT_FILE" ]; then
        echo ""
        echo "結果ファイルの先頭5行:"
        head -5 "$OUTPUT_FILE"
    fi

    return $process_result
}

# スクリプトの実行
main "$@"
```

2. テストデータの作成

```bash
# データファイルの作成
cat > data.txt << 'EOF'
# サンプルデータ
id,value,category
1,10,A
2,25,B
3,invalid,C
4,30,A
5,15,B
6,40,C
7,invalid,A
8,20,B
9,35,C
10,5,A
11,12,B
12,invalid,C
13,18,A
14,22,B
15,28,C
EOF

# 設定ファイルの作成
cat > config.ini << 'EOF'
# 設定ファイル
DEBUG_MODE=true
MAX_ITEMS=100
LOG_LEVEL=info
TIMEOUT=30
EOF
```

3. デバッガーの起動

```bash
# bashdbでスクリプトを起動
bashdb debug_example.sh data.txt config.ini
```

4. ブレークポイントの設定

デバッガーが起動したら、以下のように操作します：

```
# 1. main関数にブレークポイントを設定
bashdb<1> break main
Breakpoint 1 set at file debug_example.sh, line 145.

# 2. 実行を開始
bashdb<2> run
Starting program: debug_example.sh data.txt config.ini

Breakpoint 1, main() at debug_example.sh:145
145:	    echo "シェルデバッガーのデモンストレーション"

# 3. ステップ実行で進める
bashdb<3> next
146:	    echo "====================================="

# 4. process_data関数にブレークポイント
bashdb<4> break process_data
Breakpoint 2 set at file debug_example.sh, line 43.

# 5. 実行を継続
bashdb<5> continue
Continuing.

シェルデバッガーのデモンストレーション
=====================================
設定ファイル読み込み: config.ini
デバッグモード: true
最大アイテム数: 100
デバッグモード: true
最大アイテム数: 100

Breakpoint 2, process_data(input_file=data.txt, output_file=result.txt) at debug_example.sh:43
43:	    echo "データ処理開始: $input_file → $output_file"

# 6. 変数の確認
bashdb<6> print input_file
input_file = 'data.txt'
bashdb<7> print output_file
output_file = 'result.txt'

# 7. ステップ実行で関数内を追跡
bashdb<8> step
44:	    local line_count=0
bashdb<9> next
45:	    local error_count=0
bashdb<10> next
46:	    local total_value=0

# 8. validate_data関数にブレークポイント
bashdb<11> break validate_data
Breakpoint 3 set at file debug_example.sh, line 13.

# 9. whileループの開始行にブレークポイント
bashdb<12> break 60
Breakpoint 4 set at file debug_example.sh, line 60.

# 10. 実行を継続
bashdb<13> continue
Continuing.
データ処理開始: data.txt → result.txt

Breakpoint 4, process_data(input_file=data.txt, output_file=result.txt) at debug_example.sh:60
60:	        ((line_count++))

# 11. ループの最初の数回をステップ実行
bashdb<14> next
61:
bashdb<15> next
62:	        [[ "$line" =~ ^# ]] && continue
bashdb<16> print line
line = '# サンプルデータ'

# 17. 有効なデータ行まで進める
bashdb<17> continue
Continuing.

Breakpoint 4, process_data(input_file=data.txt, output_file=result.txt) at debug_example.sh:60
60:	        ((line_count++))
bashdb<18> print line
line = '1,10,A'

# 18. validate_data関数をステップ実行
bashdb<19> step
validate_data(data=1,10,A, line_number=2) at debug_example.sh:13
13:	    local data="$1"

# 19. 関数内を詳細に追跡
bashdb<20> next
14:	    local line_number="$2"
bashdb<21> next
17:	    if [ -z "$data" ]; then
bashdb<22> next
20:	    if [[ ! "$data" =~ ^[^,]+,[^,]+,[^,]+$ ]]; then
bashdb<23> print data
data = '1,10,A'
bashdb<24> next
24:	    fi
bashdb<25> next
26:	    return 0

# 26. 関数から抜けるまで実行
bashdb<26> finish
Run till exit from #0 validate_data(data=1,10,A, line_number=2) at debug_example.sh:26
0x0000000000400000 in process_data (input_file=0x7fffffffe5b0 "data.txt", output_file=0x7fffffffe5c0 "result.txt") at debug_example.sh:67
67:	        if ! validate_data "$line" "$line_count"; then

# 27. 変数の状態を確認
bashdb<27> print line_count
line_count = 2
bashdb<28> print error_count
error_count = 0

# 28. 無効なデータ行を含むブレークポイントを設定
bashdb<29> break 67 if [[ "$line" == *"invalid"* ]]
Breakpoint 5 set at file debug_example.sh, line 67.

# 29. 実行を継続
bashdb<30> continue
Continuing.

Breakpoint 5, process_data(input_file=data.txt, output_file=result.txt) at debug_example.sh:67
67:	        if ! validate_data "$line" "$line_count"; then
bashdb<31> print line
line = '3,invalid,C'
bashdb<32> print line_count
line_count = 4

# 33. validate_data関数の挙動を確認
bashdb<33> step
validate_data(data=3,invalid,C, line_number=4) at debug_example.sh:13
13:	    local data="$1"
bashdb<34> finish
Run till exit from #0 validate_data(data=3,invalid,C, line_number=4) at debug_example.sh:13
0x0000000000400000 in process_data (input_file=0x7fffffffe5b0 "data.txt", output_file=0x7fffffffe5c0 "result.txt") at debug_example.sh:67
67:	        if ! validate_data "$line" "$line_count"; then

# 35. エラーハンドリングの動作を確認
bashdb<36> next
68:	            ((error_count++))
bashdb<37> next
69:	            continue
bashdb<38> print error_count
error_count = 1

# 39. デバッグセッションを終了
bashdb<39> quit
The program is running.  Exit anyway? (y or n) y
```

5. さまざまなデバッグシナリオの試行

```bash
# 条件付きブレークポイントで特定のカテゴリのみをデバッグ
bashdb debug_example.sh data.txt config.ini
bashdb<1> break 77 if [[ "$category" == "B" ]]
bashdb<2> run

# ウォッチポイントで変数の変更を監視
bashdb<1> watch error_count
bashdb<2> watch total_value
bashdb<3> run

# バッチ処理の進行状況を監視
bashdb<1> break 88 if (( line_count % 5 == 0 ))
bashdb<2> commands 1
silent
print "進捗: $line_count / $MAX_LINES"
continue
end
bashdb<3> run
```

:::

## 📋 bashdbのベストプラクティス

### 効果的なデバッグ戦略

1. **段階的なアプローチ**: 大きなスクリプトは関数単位でデバッグ
2. **ブレークポイントの計画的配置**: 問題が起きそうな場所に事前設定
3. **変数の定期的な検査**: 重要な変数の状態を定期的に確認
4. **条件付きブレークの活用**: 特定条件下でのみデバッグを停止
5. **デバッグログの記録**: 重要な情報をファイルに保存

### 本番環境での使用

```bash
# 本番環境での安全なデバッグ
if [ "${DEBUG_MODE:-false}" = "true" ]; then
    # デバッグモードでのみbashdbを使用
    module load bashdb  # 環境によってはモジュールのロードが必要
    bashdb --quiet production_script.sh
else
    # 通常実行
    ./production_script.sh
fi
```

### パフォーマンスの考慮

```bash
# 重い処理をデバッグする場合の最適化
bashdb<<'EOF'
break heavy_processing_function
run
set pagination off  # ページングを無効化
set trace-commands on  # コマンドトレースを有効化
continue
EOF
```

## まとめ

bashdbはシェルスクリプト開発において強力なデバッグツールです。適切に使用することで、複雑なスクリプトの問題を体系的に解決できます。

:::note 要点のまとめ

- **基本操作**: `break`, `next`, `step`, `continue`, `print` をマスター
- **ブレークポイント**: 行番号、関数、条件付きの設定が可能
- **変数検査**: 変数の値の確認と変更が対話的に行える
- **ステップ実行**: 関数の内部まで詳細に追跡できる
- **高度な機能**: ウォッチポイント、条件付き実行、自動コマンド
- **実践的な使用**: 複雑なスクリプトの問題解決に効果的

:::

bashdbの使い方を習得することで、`set -x`では対処できない複雑なバグの特定と修正が可能になります。特に大規模なシェルスクリプトプロジェクトでは、デバッガーの使用が開発効率を大幅に向上させます。

## 関連リンク

- [set -xトレースのベストプラクティス](./set-x-tracing)
- [set -e -u -x -o pipefailのベストプラクティス](../error-handling/set-e-u-x-o-pipefail)
- [シェルスクリプトの関数](../../control-structures/functions)
- [シェルスクリプトの条件分岐](../../control-structures/conditionals)

## さらに深く学習したい方へ

bashdbの高度な使用法をさらに学びたい方は、当社の研修プログラムをご利用ください。実践的なデバッグ演習を通じて、複雑なスクリプトの問題解決スキルを体系的に習得できます。