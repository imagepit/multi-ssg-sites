---
title: テストページ
slug: paid-test
date: "2026-01-21"
categories: ["AI"]
tags: ["AI", "テスト"]
status: "publish"
description: "テストページ"
paid: true
products:
  - id: product:test-course
    price: 100
    stripe_price_id: price_1Su4USHLkqemnldGQd3bzFlt
    description: "テスト有料ページ"
---

## 無料コンテンツ

ここは誰でも見られる部分です。

https://zenn.dev/pipinosuke/articles/3f1a358698c8e4

## X（Twitter）埋め込みテスト

https://x.com/hayatasu_ai/status/1939659400865845254

:::premium productId="product:test-course" sectionId="section-1"

## 有料セクション

このセクションは有料コンテンツです。
SSG出力には含まれず、R2にアップロードされます（本番時）。

```typescript
// 有料コードサンプル
const secret = "premium content"
```

:::speech-left Ryosuke | /ryosuke.png | ようこそ！

こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！

:::

:::speech-right Ryosuke | /ryosuke.png | ようこそ！

こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！

:::

```files
/images/                    # プロジェクトルートの画像ディレクトリ
├── nextjs/
│   ├── logo.png
│   ├── screenshots/
│   └── diagrams/
├── cloudflare/
│   └── ...
├── claude-code/
│   └── ...
└── shared/                 # 共通画像
    ├── icons/
    └── backgrounds/
```

```xml
//addstart
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-medium text-gray-800">Chroma</h3>
    <p class="text-gray-600">Chromaは、ベクトル検索エンジンです。</p>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-medium text-gray-800">Pinecone</h3>
    <p class="text-gray-600">Pineconeは、ベクトル検索エンジンです。</p>
  </div>
</div>
//addend
```

```yaml
//delstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//delend
```

```yaml
//highlightstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//highlightend
```

```yaml
services:
  meilisearch:
//focusstart
    image: getmeili/meilisearch:v1.9.1
//focusend
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
```

```yaml
//errorstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//errorend
```

```yaml
//warningstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//warningend
```

:::step

1. プロンプトからUIを生成してみよう

まずは簡単なプロンプトでv0の動作を確認しましょう。v0のインターフェースを開き、以下のようなプロンプトを入力します。

```text
モダンなカードコンポーネントを作成。画像、タイトル、説明文、CTAボタンを含み、ホバー時に影がつくアニメーションを追加
```

生成されたコンポーネントを確認し、デザインや機能が期待通りか確認します。

2. 生成結果を反復改良

最初の生成結果に基づいて、より詳細な指示を追加します。

```text
背景色を白に変更し、角丸を8pxに、ボタンの色を青系のグラデーションに。カードのサイズは幅320px、高さは自動調整
```

このように、対話的にプロンプトを調整することで、理想のUIに近づけていきます。

:::

:::

## まとめ（無料）

無料部分の続きです。

```typescript
// 有料コードサンプル
const secret = "premium content"
```

:::speech-left Ryosuke | /ryosuke.png | ようこそ！

こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！

:::

:::speech-right Ryosuke | /ryosuke.png | ようこそ！

こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！こんにちはLangChain実践開発ガイドへようこそ！

:::


```files
/images/                    # プロジェクトルートの画像ディレクトリ
├── nextjs/
│   ├── logo.png
│   ├── screenshots/
│   └── diagrams/
├── cloudflare/
│   └── ...
├── claude-code/
│   └── ...
└── shared/                 # 共通画像
    ├── icons/
    └── backgrounds/
```

```xml
//addstart
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-medium text-gray-800">Chroma</h3>
    <p class="text-gray-600">Chromaは、ベクトル検索エンジンです。</p>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-medium text-gray-800">Pinecone</h3>
    <p class="text-gray-600">Pineconeは、ベクトル検索エンジンです。</p>
  </div>
</div>
//addend
```

```yaml
//delstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//delend
```

```yaml
//highlightstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//highlightend
```

```yaml
services:
  meilisearch:
//focusstart
    image: getmeili/meilisearch:v1.9.1
//focusend
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
```

```yaml
//errorstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//errorend
```

```yaml
//warningstart
services:
  meilisearch:
    image: getmeili/meilisearch:v1.9.1
    ports:
      - 7700:7700
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
//warningend
```

:::step

1. プロンプトからUIを生成してみよう

まずは簡単なプロンプトでv0の動作を確認しましょう。v0のインターフェースを開き、以下のようなプロンプトを入力します。

```text
モダンなカードコンポーネントを作成。画像、タイトル、説明文、CTAボタンを含み、ホバー時に影がつくアニメーションを追加
```

生成されたコンポーネントを確認し、デザインや機能が期待通りか確認します。

2. 生成結果を反復改良

最初の生成結果に基づいて、より詳細な指示を追加します。

```text
背景色を白に変更し、角丸を8pxに、ボタンの色を青系のグラデーションに。カードのサイズは幅320px、高さは自動調整
```

このように、対話的にプロンプトを調整することで、理想のUIに近づけていきます。

:::