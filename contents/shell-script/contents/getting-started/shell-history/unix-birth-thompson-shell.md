---
title: "UNIX誕生とThompson Shell | シェルスクリプトの歴史的起源と基礎"
slug: unix-birth-thompson-shell
status: publish
post_type: page
seo_keywords: "UNIX, Thompson Shell, シェルスクリプト, Unixの歴史, コンピュータ史"
seo_description: "1969年にAT&Tベル研究所で誕生したUNIXと最初のシェルであるThompson Shellの歴史を解説。現代のシェルスクリプトの基礎を理解する上で重要な歴史的背景を学べます。"
tags: ["Unix", "Thompson Shell", "シェルスクリプト", "歴史", "システムプログラミング"]
image: "/images/shell-history/unix-thompson-shell.jpg"
parent: "shell-history"
---

## はじめに

🖥️ 現代のシェルスクリプトの理解を深めるために、その起源を遡る旅に出かけましょう。1969年、AT&Tベル研究所で生まれたUNIXオペレーティングシステムと、最初のシェルであるThompson Shellの誕生は、コンピュータサイエンスにおける画期的な出来事でした。

### このページで学べる事

UNIXとThompson Shellの誕生から、その技術的な特徴や歴史的意義までを包括的に学びます。現代のシェルスクリプトの基本的な概念が、いかにしてこの初期のシェルから発展したのかを理解することができます。

:::note

- 1969年のUNIXプロジェクト誕生の背景と目的
- Ken ThompsonによるThompson Shellの開発プロセス
- 初期シェルの基本的な機能と制約事項
- Thompson Shellが後世のシェルに与えた影響
- 初期UNIX環境でのプログラミング体験

:::

## UNIXプロジェクトの誕生

1960年代後半、コンピュータ業界は大型メインフレームと非効率的なオペレーティングシステムの時代でした。AT&Tベル研究所のKen Thompson、Dennis Ritchie、Rudolf Canal、Douglas McIlloy、Joseph Ossannaらは、MULTICSプロジェクトの失敗から生まれたアイデアを基に、新しいオペレーティングシステムの開発を開始しました。

:::note MULTICSとは

MULTICS（Multiplexed Information and Computing Service）は、1960年代に開発された時間分割システム（TSS）でした。非常に野心的なプロジェクトでしたが、複雑すぎて実用的ではありませんでした。ThompsonやRitchieはこのプロジェクトに参加していましたが、その複雑さに失望し、よりシンプルな代替案を考え始めました。

:::

Thompsonは、古くなったPDP-7コンピュータを使って、自分自身がゲームをプレイできるシステムを構築したいと考えていました。この個人的なプロジェクトから、UNIXという名前の新しいオペレーティングシステムが誕生しました。名前はMULTICSへのパロディとして付けられました。

## Thompson Shellの開発

1971年頃、Ken ThompsonはUNIXシステムに対話型のコマンドインターフェースを提供するために、最初のシェルを開発しました。このシェルは単に「シェル」と呼ばれ、後の文献では「Thompson Shell」として知られています。

### Thompson Shellの主な特徴

Thompson Shellは現代のシェルと比較して非常にシンプルでしたが、基本的な概念を確立しました：

1. **コマンド実行**: ユーザーが入力したコマンドを実行
2. **リダイレクション**: 入出力のリダイレクション機能（基本的なもののみ）
3. **パイプ**: 後期バージョンで追加されたパイプライン機能
4. **バックグラウンド実行**: `&`を使ったジョブ制御の初期形態

### 最初のシェルスクリプト

Thompson Shellはスクリプト実行の基本的な機能も提供していました。ユーザーはコマンドをファイルに書き込み、そのファイルを実行可能にすることで、シェルスクリプトとして実行できました。

## Thompson Shellを体験してみよう

### 最初のUNIX環境をシミュレート

現代のシステムでThompson Shellの体験をシミュレートしてみましょう。Dockerを使って初期UNIX環境を再現できます。

:::step

1. Dockerを使って初期UNIX環境を起動

```bash
docker run -it --rm noelbkern/heirloom-sh
```

2. Thompson Shell互換環境でコマンドを実行

```bash
# 基本的なコマンド実行
ls -l
pwd
whoami

# 簡単なリダイレクション
echo "Hello, early UNIX!" > greeting.txt
cat greeting.txt

# 基本的なパイプ処理
ls | wc -l
```

3. Thompson Shellの制限を体験

```bash
# 現代のBashでは可能だが、Thompson Shellではできなかった操作を試す
# 環境変数の設定（Thompson Shellでは限定的）
# 複雑な条件分岐（Thompson Shellにはなかった）
```

:::

この体験を通して、現代のシェルがいかに進化したかを実感できるでしょう。

## Thompson Shellの技術的な制約

Thompson Shellには多くの制約がありました：

- **変数の欠如**: 環境変数やローカル変数の概念がほとんどありませんでした
- **制御構造の不足**: if文やforループなどの構造化された制御構造がありませんでした
- **関数の欠如**: 関数を定義する機能がありませんでした
- **制限されたリダイレクション**: 高度なリダイレクション機能がありませんでした

これらの制約は、シェルが単なるコマンド実行ツールであったことを示しています。プログラミング言語としての機能は、後のシェルで発展していきます。

## 歴史的意義と影響

Thompson Shellの最も重要な貢献は、以下の概念を確立したことです：

1. **コマンドラインインターフェースの標準化**: ユーザーがシステムと対話するための一貫した方法を提供
2. **リダイレクションとパイプ**: UNIX哲学の重要な部分である「小さなツールを組み合わせる」という概念を実現
3. **スクリプト実行**: 自動化の基礎を築いた

:::note UNIX哲学

Thompson Shellが生まれた環境では、以下のUNIX哲学が形成されました：

- 各プログラムは1つのことをうまくやる
- プログラムの出力は他のプログラムの入力となる
- 複雑な問題はシンプルなツールの組み合わせで解決する

:::

## Thompson ShellからBourne Shellへ

Thompson Shellの制約を克服するため、1977年にStephen Bourneが新しいシェルを開発しました。これがBourne Shellで、Thompson Shellの基本的な概念を継承しつつ、プログラミング言語としての機能を大幅に強化しました。

Bourne Shellの主な改善点：

- 変数と環境変数の完全なサポート
- 構造化された制御構造（if、while、for、case）
- 関数定義のサポート
- より高度なリダイレクション機能

## まとめ

Thompson Shellは現代のシェルスクリプトの礎を築いた、歴史的に重要なソフトウェアです。そのシンプルさの中に、UNIX哲学の本質が凝縮されています。変数や制御構造といった現代的な機能はありませんでしたが、コマンドラインインターフェース、リダイレクション、パイプといった基本概念を確立しました。

:::note 要点のまとめ

- Thompson Shellは1971年にKen Thompsonによって開発された最初のUNIXシェル
- シンプルなコマンド実行、基本的なリダイレクション、パイプ機能を提供
- 変数や制御構造といったプログラミング機能はほとんどなかった
- UNIX哲学の基礎となる概念を確立
- 後のBourne Shellや現代のシェルに大きな影響を与えた

:::

次の記事では、Thompson Shellの制約を克服し、シェルスクリプトをプログラミング言語として大きく進化させたBourne Shellについて詳しく見ていきます。Bourne Shellがどのようにしてシェルスクリプトの可能性を広げたのか、その革新性を探ります。

[Bourne Shellの詳細へ](./bourne-shell.md)

## 関連リンク

- [The Evolution of the Unix Time-Sharing System](https://www.bell-labs.com/usr/dmr/www/hist.html) - Dennis RitchieによるUNIXの歴史
- [Early Unix history and evolution](https://www.csail.mit.edu/~srs/html/csir-history.html) - 初期UNIXの発展
- [Unix Heritage Society](https://www.tuhs.org/) - UNIXの歴史的資料

## さらに深く学習したい方へ

本格的なシェルスクリプトのスキルを習得したい方は、弊社の研修プログラムをご検討ください。実践的なハンズオン演習を通じて、現代のBashやZshの高度な機能から、効率的な自動化スクリプトの作成方法までを体系的に学べます。特に、歴史的背景を理解した上での現代的なシェルスクリプトの書き方を重点的に指導しています。