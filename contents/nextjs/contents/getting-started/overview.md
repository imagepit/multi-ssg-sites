---
title: 概要
slug: overview
parent: getting-started
status: not_started
filepath: docs/nextjs/contents/getting-started/overview.md
post_type: pages
target: 初学者
goal: Next.jsの基本概念、全体像、メリット・デメリットなどを理解してもらう
seo_title: Next.js基本概念解説 | フレームワークの全体像を理解
seo_description: Next.js学習に必要な基本概念を体系的に解説。React、SSG、SSR、App Routerなど重要な用語と技術的背景を初心者向けに分かりやすく説明
seo_keywords: Next.js 概念, Next.js 基礎, React フレームワーク, SSG SSR
handson_overview: 不要
---

AI エージェントがユーザーに代わって安全に決済を行うための新しいプロトコル「Agent Payments Protocol (AP2)」を実際に試してみましょう。この記事では、AP2 のサンプルコードを動かしながら、エージェント主導の決済システムの仕組みを理解していきます。

## 目次

- [目次](#目次)
- [AP2 とは](#ap2-とは)
- [AP2 の仕組み](#ap2-の仕組み)
  - [リアルタイム購入（人間が立ち会っている場合）](#リアルタイム購入人間が立ち会っている場合)
  - [委任タスク（人間が立ち会っていない場合）](#委任タスク人間が立ち会っていない場合)
- [環境構築とサンプル実行](#環境構築とサンプル実行)
- [人間が立ち会う場合の支払いフロー](#人間が立ち会う場合の支払いフロー)
  - [登場人物](#登場人物)
  - [支払いフローの詳細](#支払いフローの詳細)
  - [実際のコード例](#実際のコード例)
- [まとめ](#まとめ)
- [関連記事](#関連記事)

## AP2 とは

:::note Agent Payments Protocol (AP2) とは

Google により提案された新しいプロトコルで、AI エージェントがユーザーに代わって安全に決済を行うことを可能にします。プラットフォーム間でエージェント主導の決済を安全に開始・処理することを目的としています。

:::

現在の決済システムでは、人間が信頼できる画面上で直接購入ボタンをクリックすることを前提としており、自立型の AI エージェントがユーザーに代わって決済することは想定されていません。AP2 はこの課題を解決し、改ざん防止機能を備えた暗号化署名されたデジタル契約「**Mandates**」を用いて信頼を構築します。

:::note Mandates とは

Mandates は AP2 で使用されるデジタル契約で、ユーザーの購入意図や商品情報を記録するためのものです。

:::

## AP2 の仕組み

AP2 では以下の 2 つの支払い方法をサポートしています。

### リアルタイム購入（人間が立ち会っている場合）

ユーザーが「新しい白いランニングシューズを探して」のようにエージェントに指示を出す場合の支払い方法です。リクエストは Intent Mandate に記録され、エージェントが希望のシューズをカートに追加すると、ユーザーの承認によって Cart Mandate に署名されます。

### 委任タスク（人間が立ち会っていない場合）

ユーザーが「コンサートのチケットが発売されたらすぐに購入して」のようにエージェントにタスクを委任する場合の支払い方法です。事前に詳細な Intent Mandate に署名し、エージェントは条件を満たした時点で Cart Mandate を自動で生成します。

:::important Mandates の役割

- **Intent Mandate**: ユーザーの購入意図を記録するデジタル契約
- **Cart Mandate**: 具体的な商品と価格を記録するデジタル契約
- **Payment Mandate**: 最終的な支払い情報を記録するデジタル契約

:::

## 環境構築とサンプル実行

それでは、AP2 のサンプルコードを実際に動かしてみましょう。

:::step

1. 前提条件の確認

Python 3.10 以上がインストールされている必要があります。以下のコマンドでバージョンを確認してください。

```bash
python --version
```

2. プロジェクトのクローン

任意の場所（デスクトップなど）で `ap2-sample` フォルダを作成し、AP2 のサンプルコードをクローンします。

```bash
mkdir ap2-sample
cd ap2-sample
git clone https://github.com/google-agentic-commerce/AP2.git
cd AP2
```

3. 依存関係のインストール

必要なパッケージをインストールします。

```bash
pip install -r requirements.txt
```

4. 環境変数の設定

`.env` ファイルを作成し、OpenAI API キーを設定します。

```bash
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

:::warning API キーの取得

OpenAI API キーは [OpenAI Platform](https://platform.openai.com/api-keys) から取得してください。API キーは安全に管理し、公開リポジトリにコミットしないよう注意してください。

:::

5. サンプルアプリケーションの起動

人間が立ち会う場合の支払いサンプルを起動します。

```bash
python examples/human_present_payment/main.py
```

:::

## 人間が立ち会う場合の支払いフロー

サンプルアプリケーションを起動すると、以下のような流れで支払いが進行します。

### 登場人物

- **Shopping Agent**: ユーザーの買い物リクエストを処理するオーケストレーターエージェント
- **Merchant Agent**: 商品を提供するエージェント
- **Merchant Payment Processor Agent**: 加盟店に代わって支払いを処理するエージェント
- **Credentials Provider Agent**: ユーザーの支払い認証情報を保有するエージェント

### 支払いフローの詳細

:::step

1. 商品検索の開始

アプリケーションを起動すると、Shopping Agent が商品検索を開始します。デモでは「白いランニングシューズ」を検索します。

2. 商品選択とカート追加

Merchant Agent が商品を検索し、候補を提示します。ユーザーが希望する商品を選択すると、Cart Mandate が生成されます。

3. 配送先住所の設定

デジタルウォレットを使用するか、配送先住所を手動で入力するかを選択します。デモでは「use a digital wallet」を選択します。

4. 支払い方法の選択

利用可能な支払い方法から選択します。デモでは以下の情報が提供されます。

- `[email protected]` の場合: Bugs's PayPal account
- `[email protected]` の場合: Fudd's PayPal

5. 認証処理

Credentials Provider Agent により認証が行われます。デモでは自動的にログインに成功します。

6. 最終確認と購入

Payment Mandate が生成され、内容を確認して購入を確定します。OTP（ワンタイムパスワード）の入力が求められた場合は、デモ用に「123」を入力します。

7. 購入完了

商品の購入が完了し、デジタル領収書が表示されます。

:::

### 実際のコード例

AP2 のサンプルコードでは、以下のような流れで Mandates が生成・処理されます。

_Intent Mandate の生成例_
```python
# Intent Mandate の生成例
intent_mandate = {
    "user_id": "user123",
    "intent": "白いランニングシューズを購入したい",
    "max_price": 15000,
    "timestamp": "2024-01-01T10:00:00Z"
}

# Cart Mandate の生成例
cart_mandate = {
    "intent_mandate_id": "intent_123",
    "items": [
        {
            "product_id": "shoe_001",
            "name": "Nike Air Max 270",
            "price": 12000,
            "quantity": 1
        }
    ],
    "total_amount": 12000,
    "currency": "JPY"
}
```

:::note デモデータの活用

サンプルコードでは、実際の決済処理をシミュレートするためにデモ用のデータが用意されています。本番環境では、実際の決済プロバイダーとの連携が必要です。

:::

## まとめ

Agent Payments Protocol (AP2) は、AI エージェントがユーザーに代わって安全に決済を行うことを可能にする革新的なプロトコルです。暗号化署名されたデジタル契約「Mandates」を用いて信頼を構築し、リアルタイム購入と委任タスクの両方のシナリオをサポートします。

:::note 要点のまとめ

- AP2 は AI エージェント主導の決済を安全に実現するプロトコル
- Mandates による改ざん防止機能で信頼を構築
- リアルタイム購入と委任タスクの 2 つの支払い方法をサポート
- Model Context Protocol (MCP) や A2A との連携が可能
- 現在は提案段階だが、サンプルコードで動作確認が可能

:::

AP2 は現在提案段階にありますが、AI エージェントの普及に伴い、将来的には重要な役割を果たすことが期待されます。今回のハンズオンを通じて、エージェント主導の決済システムの可能性を感じていただけたでしょうか。

## 関連記事

- [Model Context Protocol (MCP) の基礎知識](./mcp-basics)
- [AI エージェント間通信プロトコル A2A 入門](./a2a-introduction)
- [セキュアな決済システムの設計パターン](./secure-payment-patterns)
