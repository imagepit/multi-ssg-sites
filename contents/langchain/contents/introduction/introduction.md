---
title: はじめに
slug: introduction
status: not_started
filepath: contents/introduction/introduction.md
post_type: pages
goal: LangChainの概要と学習の方向性を示し、初学者が迷わず学習を開始できるガイドラインを提供する。
seo_title: LangChain入門 | 基本概念から実践まで完全ガイド
seo_description: LangChainの基本概念、特徴、活用事例を初心者向けに解説。環境構築からクイックスタートまで、段階的な学習パスを提供します。
seo_keywords: LangChain 入門, LangChain 基本, LLM開発入門
handson_overview: 不要
---


## はじめに

このページは、LangChainの開発環境を構築するための「入り口」です。ここでは環境選定の考え方と、具体的な手順を記した子ページへの導線を提供します。実際のハンズオンは子ページで行います。

### このページで学べる事

:::note

- Python と Node.js の選び方と判断基準
- セットアップ前のチェックリスト（OS/バージョン/必須ツール）
- 子ページの役割と学習の到達目標
- 推奨学習フロー（読む順番と確認ポイント）
- トラブル時の参照先

:::

## 環境選定のポイント（Python / Node.js）

LangChainは Python / Node.js の両方をサポートしています。用途に応じて選択しましょう。

| 観点       | Python を選ぶ                   | Node.js を選ぶ                           |
| ---------- | ------------------------------- | ---------------------------------------- |
| 主な用途   | 研究・PoC、データ処理、ML連携   | Web/フロント連携、サーバレス、JS資産活用 |
| 学習コスト | 豊富な記事と例、学習しやすい    | JS/TS経験者に馴染みやすい                |
| 依存管理   | `venv`/`pip`/`poetry` など豊富  | `npm`/`pnpm`/`yarn` で一元管理           |
| 実行環境   | バッチ/サーバ/Notebook など多様 | Nodeランタイム、Edge/Serverless と相性良 |

:::note 迷ったら

初学者・実験重視なら「Python」。Web連携・フロント統合重視なら「Node.js」を推奨します。

:::

## セットアップ前のチェックリスト

- OS: 最新の更新適用（macOS/Windows/Linux）
- バージョン: Python は `3.10+`、Node.js は `18+` を推奨
- 必須ツール: `git`、エディタ（VS Code 推奨）
- ネットワーク: パッケージレジストリへアクセス可能
- APIキー: 後述の「APIキー管理」で安全に保管（.env など）

関連: [APIキー管理](./environment-setup/api-key-management)

## 子ページへのクイックリンク

- **Python環境セットアップ**: 仮想環境の作成、LangChainインストール、依存管理の実践
  - [Python環境セットアップへ](./environment-setup/python-setup)
- **Node.js環境セットアップ**: Nodeバージョン管理、LangChain.js導入、実行確認
  - [Node.js環境セットアップへ](./environment-setup/nodejs-setup)
- **APIキー管理**: OpenAI 等の鍵を安全に扱うための `.env` と運用ルール
  - [APIキー管理へ](./environment-setup/api-key-management)

## 推奨学習フロー

1. 環境を選ぶ（Python or Node.js）
2. 選んだ環境のセットアップ手順に沿って構築する
3. APIキーを安全に管理できる状態にする
4. 子ページ末尾の「動作確認」を実施して正常性を確認する

:::note 到達目標

- 任意のOSで、選択した言語の開発環境が再現可能
- APIキーをローカルで安全に扱える
- 最小のサンプルを実行して動作確認ができる

:::

## トラブルの入口（まずここを確認）

- パス/バージョンの不一致: Python は `python -V`、Node は `node -v` で確認
- 仮想環境/バージョン管理の未有効化: `source venv/bin/activate` / `nvm use` などを確認
- プロキシ/社内ネットワーク: パッケージ取得に失敗する場合はネットワーク設定を再確認
- それでも解決しない場合は、各子ページの「トラブルシューティング」を参照

## まとめ

:::note 要点のまとめ

- このページは「選び方」と「導線」を提供し、実作業は子ページで実施
- 迷ったら Python、Web統合を重視するなら Node.js
- セットアップ前にチェックリストで準備を整える
- 推奨フローに沿って、子ページ末尾の動作確認まで完了させる

:::

次は、目的に合った子ページから環境構築を始めましょう。

## 関連リンク

- [Python環境セットアップ](./environment-setup/python-setup)
- [Node.js環境セットアップ](./environment-setup/nodejs-setup)
- [APIキー管理](./environment-setup/api-key-management)
- [LangChain 公式ドキュメント（Python）](https://python.langchain.com)
- [LangChain.js 公式ドキュメント（JavaScript/TypeScript）](https://js.langchain.com)

## さらに深く学習したい方へ

プロジェクトベースで学べる研修プログラムをご用意しています。実務に直結する設計・実装・運用まで、ハンズオンで体系的に習得できます。
