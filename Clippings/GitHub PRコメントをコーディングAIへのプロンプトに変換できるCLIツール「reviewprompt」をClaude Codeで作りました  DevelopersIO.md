---
title: "GitHub PRコメントをコーディングAIへのプロンプトに変換できるCLIツール「reviewprompt」をClaude Codeで作りました | DevelopersIO"
source: "https://dev.classmethod.jp/articles/reviewprompt/"
author:
  - "[[dyoshikawa]]"
published: 2025-08-07
created: 2025-10-10
description:
tags:
  - "clippings"
---

:::note

## 記事要約

**「GitHub PRコメントをコーディングAIへのプロンプトに変換できるCLIツール「reviewprompt」をClaude Codeで作りました」**

### 概要
Claude Codeを活用して開発したNode.js製CLIツール「reviewprompt」の紹介記事です。GitHub PRのレビューコメントをAIコーディングエージェント用のプロンプトに変換する機能を提供します。

### 主要ポイント

#### 1. reviewpromptの機能
- **目的**: GitHub PRのレビューコメントをAIコーディングエージェント用プロンプトに変換
- **使用方法**:
  1. GitHub PRに `[ai]` を含むレビューコメントを追加
  2. `npx reviewprompt --resolve --clipboard [PR URL]` で実行
  3. インタラクティブにコメントを選択
  4. 生成されたプロンプトがクリップボードにコピー

#### 2. 技術構成
- **言語**: Node.js + TypeScript
- **CLIライブラリ**: Commander（コマンド解析）+ Ink（インタラクティブUI）
- **特徴**: React（JSX）でCLIを宣言的に実装

#### 3. 既存ツールとの比較
**difit（yoshikoさん開発）との違い**:
- **reviewprompt**: GitHub PRのUIに完全依存、CLIのみ
- **difit**: 独自Web UI、GitHub以外のリポジトリサービスにも対応

**メリット**:
- GitHubのデータストアを状態管理に活用
- スマホ→PC、他メンバーのコメント活用が容易
- ファイルごとのViewed状態がGitHub側で一元管理

#### 4. Claude Code開発手法
**「なんちゃって仕様駆動開発」**:
1. 仕様書（SPEC.md）を作成
2. Plan Modeで実装計画を策定
3. AcceptEditsモードで実装
4. 手動テストと繰り返し
5. 完成後、README.mdとCONTRIBUTING.mdに移行

#### 5. Claude Code Subagentの活用
- **目的**: ロングコンテキストによる性能劣化の回避
- **仕組み**: 枝葉タスクをSubagentに委譲し、親プロセスはサマリのみ受信
- **課題**: 現状はタスク実行が不安定（フリーズ等）

### 記事の価値
AIコーディング時代における開発フローの改善ツールとして、GitHub PRのレビューコメントを効率的にAIエージェントに渡す仕組みを提供。Claude Codeを使った実践的な開発手法（仕様駆動開発、Subagent活用）も含む実用的な記事です。

:::

## はじめに

広島在住の [dyoshikawa](https://x.com/dyoshikawa1993) です。

以前、Claude Codeを活用し、各種AIコーディングツールのrulesやMCP、ignoreファイルを一括管理できるrulesyncというツールを開発した旨の記事を公開しました。

今回、やはりClaude Codeを活用して新しく [reviewprompt](https://github.com/dyoshikawa/reviewprompt) というNode.js製CLIツールを作りましたので紹介します。

また、Claude Codeを使ったCLIツールの開発手法についても触れていきます。

## reviewpromptについて

reviewpromptは、GitHub PR上のレビューコメントを抽出することでClaude CodeをはじめとするAIコーディングエージェントへの修正指示プロンプトを生成できるツールです。以下が使い方です。

1. ブラウザで対象のGitHub PRを開き、本文に `[ai]` を含めてレビューコメントを追加する。
- 例: `[ai] ここのクエリがN+1になっているので最適化して。`
- `[ai]` を含めるのは通常のレビューコメントと区別するための仕様です。
- GitHub PRコメントのSuggestion記法などを使って記述してもOKです。
1. `gh auth login` を済ませたターミナルで `npx reviewprompt --resolve --clipboard https://github.com/owner/repo/pull/123` を実行
- スペースキーでプロンプトにしたいコメントにチェックを入れ、Enterキーで確定します。
- `--resolve` オプションにより、選択されたコメントは解決済みになります（ `--delete` オプションに変更することで、選択コメントの削除も可能）。
- `--clipboard` オプションにより、即時にプロンプトがクリップボードにコピーされ、そのままClaude Codeのチャット欄にペーストするだけで使用できます。

レビューコメントのプロンプト化というコンセプトではすでにyoshikoさんのdifitがあります。

reviewpromptはdifitからインスパイアされて開発したものになります。

difitを使うことで「コードの行数指定に紐づけてコメントを付けていく」「複数のコメントを1つのプロンプトにまとめてAIに渡す」ことの体験が良すぎることに気づいたため、自分なりの別解も出してみたいと思い、reviewpromptを開発しました。

違いとしては、difitがツール独自のWeb UI（GitHub PRのUIと見た目や使用感は極めて近い）上でレビューコメントを追加するのに対して、reviewpromptはUI部分をGitHub PRに完全に依存する形にしています。そのため実装にWebフロントエンドは含まれず、CLIのみです。

これには良し悪しがあります。difitがブラウザのLocalStorageにコメント情報を保存しているのに対して、reviewpromptはGitHubのデータストアを状態として利用しています。これにより、例えばファイルごとのViewedチェックボックスの状態がGitHub側で一元管理される点はメリットかなと思っています。コメントもGitHub側に保存されているので、「スマホから投稿したレビューコメントをPCでClaude Codeに渡す」「他のメンバーからのレビューコメントをClaude Codeに渡す」といったこともやりやすいです。

一方で、PR作成前やcommit、pushの前にレビューコメント→プロンプト化のフローを回したいというユースケースはreviewpromptでは対応できません。そのような場合はdifitを使用するべきでしょう。また、difitは自前でUIを持っているがゆえに、git管理さえしていればリモートリポジトリがGitLabでもBitBucketでもBacklogでも使用できるというのは大きな強みです。さらに、difitは急速にコミュニティが拡大しており、コントリビューションも活発なので、reviewprompt側でメリットにしている点が取り込まれる可能性もあるかもしれません。

## 技術選定

- 言語: Node.js,TypeScript
- CLIライブラリ: Commander,Ink

を選定しました。

Node.js+TypeScriptを採用したのは、単に自分が慣れているし読み書きできる人も多いだろうというのが主な理由です。npmにPublish後は `npx {command}` でインストール+実行が簡単にできる点も気に入っています。

コマンド体系の定義や引数・オプションのパースにCommanderを使用しつつ、Inkを組み合わせています。CLIツールではありますがインタラクティブに操作できるチェックボックスが登場するので、React（JSX）でCLIが書けるInkを使うことで宣言的な実装に寄せられるだと考えました。

## Claude Code「なんちゃって仕様駆動開発」

Claude Codeを使用し、「なんちゃって仕様書駆動開発」的に開発しました。

まず環境構築を行ってから、仕様書となるマークダウンファイルをリポジトリ内に配置します。今回は `SPEC.md` としました（すでに削除していますが [こちら](https://github.com/dyoshikawa/reviewprompt/blob/554445c3ead6ef791e20ab5d0a4d735336849d1a/SPEC.md) ）。仕様を書く上でこうすると楽だと思ったやり方は、CLIツールの使用方法のExampleを書いてしまうことです。

実際の例:

SPEC.md

```md
\`@ai\`
```

（現在の仕様とはだいぶ乖離がある点はご留意ください）

文字だけの説明で網羅的な仕様書が書けるのはツール形式としてCLIを選択する強みだと思います。

そこに課題感やツールの目的、仕様を箇条書きのような形で雑に書いていきます。完成したらそれをPlan ModeのClaude Codeに読ませて、実装計画を立てさせました。

仕様駆動開発を支援するツールとして [kiro](https://kiro.dev/) や弊社の [tsumiki](https://github.com/classmethod/tsumiki) を使ってもよかったかもしれませんが、今回のような小さなCLIツールの開発においては、Claude Code+プロンプトの簡易的な手法で賄える感覚です。

実装計画が良さそうであれば、Claude CodeにAcceptEditsモードで開発を依頼します。Claude Codeによる実装と人間（私）による手動テストを繰り返し、なんとなく形になったかなという区切りを得られたら、 `SPEC.md` は役目を終えたということで削除し、 `README.md` に仕様を、 `CONTRIBUTING.md` に開発まわりの情報を移行します（これもClaude Codeにやらせます）。

### Claude Code Subagentについて

みなさん、開発にSubagent使われてますでしょうか？

私はSubagentは子プロセス的なものだと思っています。

一般的にLLMは作業が長引くことでロングコンテキストとなりタスク遂行の性能劣化が生じます。この点、全体から見ると枝葉となる各タスクをSubagentに逃がすことで探索過程のコンテキストをSubagent内に閉じ込め、親プロセスが必要とするサマリだけを返すようにします。そうすることで親プロセス側のコンテキスト圧迫が軽減され、連続したタスクでも性能劣化が生じづらくなるという理解をしています。

公式の以下の記述も概ね同じことを指しているのかなと。

> コンテキストの保持  
> 各サブエージェントは独自のコンテキストで動作し、メインの会話の汚染を防ぎ、高レベルの目標に集中し続けます。

一方で、現状はSubagentのタスク実行はフリーズするなど不安定に感じることがあります。

近いうちに改善されると思いますし、とても期待している機能なのでアップデートを楽しみにしています。

## おわりに

以上、Claude Codeを活用してreviewpromptというCLIツールを開発したというお話でした。

コードに紐づくレビューコメントをAIコーディングエージェントへの修正指示プロンプトに変換するという機能は、AIを使った開発工程において非常に有用に思っています。

参考になれば幸いです。

この記事をシェアする