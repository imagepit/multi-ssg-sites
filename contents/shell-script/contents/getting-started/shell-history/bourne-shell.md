---
title: "Bourne Shell | シェルスクリプト言語としての確立と標準化"
slug: bourne-shell
status: publish
post_type: page
seo_keywords: "Bourne Shell, sh, シェルスクリプト, Unix V7, Stephen Bourne"
seo_description: "1977年にStephen Bourneが開発したBourne Shellの歴史と特徴。シェルスクリプトをプログラミング言語として確立し、Unixの標準シェルとなった経緯を解説します。"
tags: ["Bourne Shell", "sh", "シェルスクリプト", "Unix", "プログラミング言語"]
image: "/images/shell-history/bourne-shell.jpg"
parent: "shell-history"
---

## はじめに

🚀 Thompson Shellの制約を乗り越え、シェルスクリプトを真のプログラミング言語へと進化させたBourne Shell。1977年にAT&Tベル研究所のStephen Bourneによって開発されたこのシェルは、Unixの標準シェルとなり、現代のシェルスクリプトの基礎を築きました。

### このページで学べる事

Bourne Shellの開発背景、技術的な革新点、そして後世に与えた影響について学びます。Thompson Shellからどのように進化したのか、その特徴的な機能やシェルスクリプト言語としての確立プロセスを理解できます。

:::note

- Stephen BourneによるBourne Shellの開発動機とプロセス
- Thompson Shellからの主要な改良点と新機能
- シェルスクリプトをプログラミング言語として確立した要素
- Unix System V7での採用と標準化への道のり
- 現代のシェルへの影響と遺産

:::

## Bourne Shell開発の背景

1970年代半ば、Thompson Shellのシンプルさは利点であると同時に大きな制約でもありました。システム管理の自動化や複雑なタスクの処理には、より強力なプログラミング機能が必要でした。

Stephen Bourneは、この問題を解決するために新しいシェルの開発に着手しました。彼はAlgol 68の構文に影響を受け、より構造化されたプログラミング言語としてのシェルを目指しました。

:::note Stephen Bourneの背景

Stephen Bourneはケンブリッジ大学で数学を学んだ後、AT&Tベル研究所に入所しました。彼はコンパイラの設計に携わった経験があり、この経験がBourne Shellの設計に大きく影響を与えています。特に、Algol 68のような構造化プログラミング言語の概念をシェルに取り入れることを試みました。

:::

## 主要な技術的革新

Bourne ShellはThompson Shellから多くの点で大きく進化しました。以下にその主な革新点を見ていきましょう。

### プログラミング言語としての機能

#### 変数と環境変数の完全サポート

```bash
# ローカル変数
name="John Doe"
echo $name

# 環境変数
export PATH=/usr/bin:/bin:/usr/local/bin
export EDITOR=vi
```

#### 構造化された制御構造

```bash
# if文
if [ "$name" = "admin" ]; then
    echo "Welcome, administrator!"
else
    echo "Welcome, user!"
fi

# whileループ
count=1
while [ $count -le 10 ]; do
    echo "Count: $count"
    count=$((count + 1))
done

# forループ
for file in *.txt; do
    echo "Processing: $file"
done

# case文
case "$1" in
    start)
        echo "Starting service..."
        ;;
    stop)
        echo "Stopping service..."
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
```

#### 関数定義のサポート

```bash
# 関数の定義と呼び出し
greet() {
    echo "Hello, $1!"
    return 0
}

# 関数の呼び出し
greet "World"
```

### 入出力リダイレクションの拡張

```bash
# 標準出力のリダイレクション
echo "Output" > file.txt

# 標準エラー出力のリダイレクション
command 2> error.log

# 標準出力と標準エラー出力の両方をリダイレクト
command > output.log 2>&1

# ヒアドキュメント
cat << 'EOF'
This is a multiline
string in Bourne Shell
EOF
```

### 位置パラメータと特殊変数

```bash
# スクリプトの引数
echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"

# 特殊変数
echo "Number of arguments: $#"
echo "All arguments: $*"
echo "Process ID: $$"
echo "Exit status: $?"
```

## Bourne Shellの構文設計

Bourne Shellの構文は、Thompson Shellより複雑になりましたが、より強力で柔軟なものになりました。特に、Algol 68の影響を受けて、キーワードベースの制御構造を採用しました。

### テストコマンドの改善

```bash
# 数値比較
if [ $count -eq 10 ]; then
    echo "Count is 10"
fi

# 文字列比較
if [ "$name" = "John" ]; then
    echo "Name is John"
fi

# ファイルテスト
if [ -f "/etc/passwd" ]; then
    echo "File exists"
fi
```

### パターンマッチングとglobbing

```bash
# ファイルパターンマッチング
for file in *.sh; do
    echo "Shell script: $file"
done

# 変数のパターンマッチング
filename="document.txt"
echo "${filename%.*}"  # document
echo "${filename#*.}"  # txt
```

## Bourne Shellを体験してみよう

### クラシックなBourne Shell環境のセットアップ

現代のシステムでBourne Shellを体験する方法を見てみましょう。

:::step

1. Heirloom ProjectのBourne Shell互換シェルをインストール

```bash
# Ubuntu/Debianの場合
sudo apt update
sudo apt install heirloom-sh

# またはDockerを使用
docker run -it --rm noelbkern/heirloom-sh
```

2. 基本的なBourne Shellスクリプトを作成

```bash
cat > classic_script.sh << 'EOF'
#!/bin/sh

# Bourne Shellスクリプトの例
echo "Running Bourne Shell script"

# 変数の使用
username=$(whoami)
echo "Current user: $username"

# 簡単な条件分岐
if [ "$username" = "root" ]; then
    echo "You are root user"
else
    echo "You are normal user"
fi

# ループ処理
echo "Counting to 5:"
i=1
while [ $i -le 5 ]; do
    echo "Number: $i"
    i=$((i + 1))
done

echo "Script completed"
EOF
```

3. スクリプトを実行可能にして実行

```bash
chmod +x classic_script.sh
./classic_script.sh
```

4. Bourne ShellとBashの違いを比較

```bash
# Bourne Shellでの制限を確認
echo $RANDOM  # Bourne Shellでは未定義
echo ${BASH_VERSION}  # Bourne Shellでは未定義
```

:::

## Unix System V7での標準化

1979年にリリースされたUnix System V7では、Bourne Shellが標準シェルとして採用されました。これはシェルスクリプトの歴史における重要な転換点となりました。

### 標準化の影響

1. **ポータビリティの向上**: System V7以降、Bourne Shellスクリプトは多くのUnixシステムで互換性を持つようになりました
2. **システム管理の自動化**: システム起動スクリプトや管理ツールがBourne Shellで書かれるようになりました
3. **エコシステムの発展**: 多くのUnixツールがBourne Shellスクリプトを前提として設計されるようになりました

### /bin/shとしての標準的な位置付け

```bash
# System V7以降のUnixシステムでは
/bin/sh  # Bourne Shellへのシンボリックリンクまたは実体
```

この標準化により、`#!/bin/sh`というシバンはポータブルなシェルスクリプトの象徴となりました。

## Bourne Shellの影響と遺産

### POSIX標準の基礎

Bourne Shellは、後のPOSIX（Portable Operating System Interface）標準の基礎となりました。POSIXシェルはBourne Shellの機能をサブセットとして持ち、Unix系システム間の互換性を確保しています。

### 後継シェルへの影響

- **Korn Shell (ksh)**: Bourne Shellの互換性を維持しつつ、多くの新機能を追加
- **Bash (Bourne Again Shell)**: GNUプロジェクトによるBourne Shellの拡張実装
- **Zsh**: Bourne Shell互換性を持ちつつ、さらに高度な機能を提供

### 現代での利用

```bash
# 現代のシステムでのBourne Shellの系譜
/bin/sh -> /bin/bash   # 多くのLinuxシステム
/bin/sh -> /bin/dash   # Debian/Ubuntu系
/bin/sh -> /bin/ksh    # 一部の商用Unix
```

## Bourne Shellの限界と挑戦

### パフォーマンスの問題

Bourne Shellは起動が比較的遅く、大規模なスクリプトではパフォーマンスの問題がありました。この問題は後のDashなどの軽量シェルによって解決されます。

### インタラクティブ使用の制約

Bourne Shellはプログラミング言語としては優れていましたが、インタラクティブな使用（コマンドラインでの対話）の機能は限られていました。このため、C Shellや後のBashがインタラクティブ使用に特化した機能を追加していきました。

### メモリ管理の問題

大規模なデータ処理ではメモリ使用量が多くなる傾向がありました。これは後のシェル設計において改善点として認識されました。

## まとめ

Bourne Shellはシェルスクリプトの歴史において画期的な存在です。Thompson Shellのシンプルさを継承しつつ、真のプログラミング言語としての機能を追加し、シェルスクリプトを自動化やシステム管理のための強力なツールへと進化させました。

:::note 要点のまとめ

- 1977年にStephen Bourneによって開発され、Unix System V7で標準採用
- 変数、制御構造、関数などプログラミング言語としての基本機能を確立
- Algol 68の影響を受けた構造化された構文を採用
- POSIX標準の基礎となり、現代の多くのシェルの祖先となった
- システム管理の自動化とポータブルなスクリプトの基盤を築いた

:::

次の記事では、インタラクティブな使用に特化し、異なるアプローチでシェルを進化させたC Shellとその後継であるtcshについて見ていきます。Bourne Shellとは異なる設計思想を持つC Shellの特徴と影響を探ります。

[C Shell / tcshの詳細へ](./c-shell-tcsh.md)

## 関連リンク

- [The Bourne Shell](https://www.informit.com/articles/article.aspx?p=2190856) - Bourne Shellの詳細な解説
- [Stephen Bourne's Original Shell Paper](https://harmful.cat-v.org/cat-v/unix.pdf) - オリジナルの論文
- [POSIX Shell Standard](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sh.html) - POSIXシェル標準

## さらに深く学習したい方へ

本格的なシェルスクリプトのスキルを習得したい方は、弊社の研修プログラムをご検討ください。Bourne Shellの基本から現代のBashやZshの高度な機能まで、歴史的背景を踏まえた体系的な学習を提供しています。特に、ポータブルなスクリプトの書き方やシステム管理の自動化に重点を置いた実践的なコースをご用意しています。