# frontmatterの書き方

frontmatterはページのメタ情報を設定するためのファイルです。本プロジェクトでは次の項目を設定します。

_frontmatterの項目_

項目|必須|説明
---|---
title|必須|ページのタイトル。サイドバーのリンクラベルに使用するタイトル。簡潔で分かりやすいタイトルを設定する。
slug|必須|ページのスラッグ（ファイル名から.mdを除いたもの）
parent|任意|親ページのスラッグ。トップレベルの親ページは空欄にする。子ページは直前の親ページのスラッグを指定する。
file_path|必須|ページのファイルパス。`contents/$ARGUMENTS/contents/`からのパスを指定する。親ページは`contents/$ARGUMENTS/contents/{親ページのslug}/{親ページのslug}.md`のように親ページのslugのディレクトリを作成し、その配下に親ページslugのmdファイルを作成する。子ページは`contents/$ARGUMENTS/contents/{親ページのslug}/{子ページのslug}.md`のように子ページのslugのディレクトリを作成し、その配下に子ページslugのmdファイルを作成する。
target_user|必須|ターゲットユーザー。要件定義書からターゲットユーザー層を設定する。
goal|必須|ページの目的。要件定義書からユーザージャーニーを設定する。**「"」で囲って説明を設定する。**
status|必須|ページのステータス。未作成: `not_started`にする。
post_type|必須|ページのタイプ。`pages`を指定する。
seo_title|必須|ページのSEOタイトル。ターゲットが閲覧したくなるような魅力的なタイトルを設定する。
seo_keywords|必須|ページのSEOキーワード。ターゲットの検索ワードを想定して設定する。**「"」で囲ってキーワード毎はカンマで区切る。**
seo_description|必須|ページのSEO説明。ターゲットが閲覧したくなるような魅力的な説明を設定する。**「"」で囲って説明を設定する。**
handson_overview|任意|ページのハンズオン手順の概要。ターゲットが技術を学ぶためのハンズオン内容の概要を設定する。**「"」で囲って説明を設定する。**

_frontmatterの出力例（サンプル）_

```md
---
title: Claude Code完全ガイド
slug: home
status: published
filepath: contents/home.md
post_type: pages
goal: Claude Code完全ガイドサイトのホームページとして、Claude Codeの概要と主要コンテンツへのナビゲーションを提供し、ユーザーが目的に応じたコンテンツにアクセスできるようにする
seo_title: Claude Code完全ガイド | AIコーディングツールの包括的学習リソース
seo_description: Claude Codeを学ぶための包括的な技術ドキュメンテーションサイト。初心者から上級者まで、段階的に学習できる実践的なガイドとケーススタディを提供します。
seo_keywords: Claude Code, AIコーディング, 開発効率化, 技術ドキュメント, 学習ガイド
handson_overview: 不要
---
```