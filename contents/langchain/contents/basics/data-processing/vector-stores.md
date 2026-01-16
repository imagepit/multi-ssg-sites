---
title: Vector Stores
slug: vector-stores
parent: data-processing
status: not_started
filepath: contents/basics/data-processing/vector-stores.md
post_type: pages
goal: Vector Storesの選択と使い方を習得し、効率的なベクトル検索システムを構築できるようになる。
seo_title: LangChain Vector Stores完全ガイド | Chroma・Pinecone・FAISS活用
seo_description: LangChainのVector Storesを詳しく解説。Chroma、Pinecone、FAISS等の選択と活用方法を実践的に学習。
seo_keywords: LangChain Vector Stores, Chroma, Pinecone, FAISS, ベクトル検索
handson_overview: Chroma実装、Pinecone連携、FAISS設定、検索性能最適化を行う手順を掲載
---


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
