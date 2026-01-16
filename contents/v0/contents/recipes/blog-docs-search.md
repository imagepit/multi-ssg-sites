---
title: "ブログ/ドキュメントサイトと検索機能 | v0でコンテンツ管理サイトを構築"
slug: blog-docs-search
parent: "recipes"
file_path: recipes/blog-docs-search
target_user: "コンテンツクリエイター、技術ライター、Web開発者"
goal: "v0を使ってブログやドキュメントサイトを作成し、検索機能を実装する方法を学び、コンテンツ管理のベストプラクティスを習得する"
status: publish
post_type: pages
seo_title: "ブログ/ドキュメントサイトと検索機能 | v0でコンテンツ管理サイトを構築"
seo_description: "v0 by Vercelを使ってブログやドキュメントサイトを作成する方法を解説。検索機能、タグ分類、目次生成などコンテンツ管理に必要な機能を実装する方法を学べます。"
seo_keywords: "v0, ブログ, ドキュメント, 検索機能, コンテンツ管理, タグ, 目次, マークダウン"
handson_overview: "実際のブログサイトをv0で作成し、検索機能、タグ管理、目次生成を実装するハンズオンを行います。"
---

## 📝 ブログ/ドキュメントサイトと検索機能

コンテンツは現代のWebアプリケーションにおいて重要な要素です。v0を使って、検索機能を備えたブログやドキュメントサイトを効率的に構築する方法を学びましょう。

### このページで学べること

:::note

このページでは、v0を使ったコンテンツ管理サイトの作成方法を学びます。

- ブログ記事とドキュメントページのレイアウト設計
- 高度な検索機能の実装
- タグとカテゴリによるコンテンツ整理
- 目次の自動生成
- マークダウン対応のリッチエディタ
- SEO最適化の実装

:::

## 🎯 コンテンツ管理サイトの基本構造

効果的なコンテンツ管理サイトには、読者が情報を見つけやすく、読みやすい構造が必要です。

### 必須コンポーネント

- **記事一覧ページ**: 記事のカード表示とフィルタリング
- **記事詳細ページ**: 本文の表示とナビゲーション
- **検索機能**: キーワード、タグ、カテゴリでの検索
- **目次**: 長文記事のセクションナビゲーション
- **タグ・カテゴリ**: コンテンツの分類整理
- **関連記事**: 読者のエンゲージメント向上

:::note コンテンツ管理システム(CMS)とは

CMSはコンテンツを効率的に作成、管理、公開するためのシステムです。v0で作成するコンテンツサイトは、フロントエンド部分に特化しており、バックエンドのAPIと連携することで完全なCMSとして機能します。

:::

## 📝 プロンプト設計パターン

コンテンツ管理サイトの各要素を作成するためのプロンプト例を見ていきましょう。

### 記事一覧ページのプロンプト

```bash
ブログ記事一覧ページを作成してください。

表示要素:
- ヘッダーにサイトタイトルと検索ボックス
- サイドバーにカテゴリとタグフィルター
- メインエリアに記事カード（タイトル、要約、作成日、タグ）
- ページネーション（12件/ページ）

機能要件:
- タイトルと本文で全文検索
- カテゴリでフィルタリング
- タグで絞り込み（複数選択可能）
- 作成日時でソート
- 閲覧数で人気順表示

デザイン要件:
- クリーンで読みやすいデザイン
- カードホバーで浮き上がり効果
- タグをカラフルなバッジで表示
- レスポンシブ対応（モバイルでは1列、デスクトップでは2-3列）
```

### 記事詳細ページのプロンプト

```bash
ブログ記事詳細ページを作成してください。

表示要素:
- 記事タイトルとメタ情報（作成者、作成日、読了時間）
- 目次（サイドバーまたは記事内固定）
- 記事本文（マークダウン対応）
- 関連記事セクション
- シェアボタンとコメントセクション

機能要件:
- 目次の自動生成とスムーズスクロール
- コードブロックのシンタックスハイライト
- 見出しアンカーの生成
- 読了進捗の表示
- 関連記事の自動推薦

デザイン要件:
- 読みやすいタイポグラフィ
- 行間と文字間の適切な調整
- ダークモード対応
- 印刷用CSSの最適化
```

## 🛠️ コンテンツ管理サイトを作成してみよう

実際にv0を使ってブログサイトを作成してみましょう。

:::step

1. 記事一覧ページの作成

まずは記事一覧ページを作成します。

```bash
技術ブログサイトのトップページを作成してください。

サイト情報:
- サイト名: DevLog
- 説明: 開発者のための実践的な技術ブログ
- カテゴリ: React, Next.js, TypeScript, v0, CSS

レイアウト:
- ヘッダー: ロゴ、ナビゲーション、検索ボックス
- メイン: 記事カードグリッド
- サイドバー: 人気記事、カテゴリ、タグクラウド
- フッター: SNSリンク、著作権情報

記事カード要素:
- サムネイル画像
- 記事タイトル
- 記事の要約（100文字以内）
- 作成日と読了時間
- 著者アバターと名前
- タグ（最大3つ）

機能:
- 無限スクロールまたは「もっと読む」ボタン
- カテゴリフィルター
- タグクリックで絞り込み
- 検索ボックスでリアルタイム検索

デザイン:
- Tailwind CSSを使用
- 明るいテーマ（オプションでダークモード）
- カードシャドウとホバー効果
- レスポンシブグリッド
```

2. 検索機能の実装

高度な検索機能を追加します。

```bash
ブログ記事検索コンポーネントを作成してください。

検索機能:
- タイトル、タグ、本文の全文検索
- あいまい検索と完全一致検索
- 検索結果のハイライト表示
- 検索履歴の保存
- おすすめ検索キーワードの表示

フィルター機能:
- カテゴリの選択（複数可）
- タグの選択（複数可）
- 作成日範囲の指定
- 著者での絞り込み

ソート機能:
- 関連度順（デフォルト）
- 新着順
- 人気順（閲覧数）
- 更新順

UIデザイン:
- モーダルまたはドロップダウン形式
- 検索条件をプレビュー表示
- クリアボタンですべての条件をリセット
- 検索結果数の表示
- 絞り込み条件のバッジ表示
```

3. 目次コンポーネントの作成

長文記事のための目次を自動生成します。

```bash
ブログ記事の目次（Table of Contents）コンポーネントを作成してください。

機能要件:
- 記事内の見出し（h2, h3, h4）を自動検出
- 目次項目を階層表示
- クリックで該当セクションにスムーズスクロール
- 現在読んでいるセクションをハイライト
- スクロールに合わせて目次を追従（固定位置）

デザイン要件:
- クリーンなリストデザイン
- 階層をインデントで表示
- ハイライトは背景色変更
- ホバーで下線表示
- モバイルではアコーディオン形式

表示ロジック:
- h2: メインセクション
- h3: サブセクション
- h4: サブサブセクション
- 目次の最大深度は3階層まで
```

4. マークダウンエディタの統合

リッチなマークダウンエディタを追加します。

```bash
ブログ記事編集用のマークダウンエディタを作成してください。

エディタ機能:
- リアルタイムプレビュー（分割表示）
- ツールバー（太字、斜体、見出し、リスト等）
- コードブロックの挿入と言語指定
- 画像アップロードと埋め込み
- テーブル作成支援
- リンク挿入支援

プレビュー機能:
- シンタックスハイライト
- 数式のレンダリング（MathJax）
- 外部リンクの自動識別
- 画像のレスポンシブ表示
- 目次のプレビュー

保存機能:
- 自動保存（30秒ごと）
- 下書きとして保存
- 公開状態の切り替え
- 保存履歴の表示
- コンフリクトの検出と解決
```

5. タグ管理システムの実装

タグによるコンテンツ整理を実装します。

```typescript
// src/components/blog/TagSystem.tsx
import { useState, useEffect } from 'react';
import { Tag } from '@/types/blog';

interface TagCloudProps {
  tags: Tag[];
  onTagSelect: (tagId: string) => void;
  selectedTags: string[];
}

export default function TagCloud({ tags, onTagSelect, selectedTags }: TagCloudProps) {
  const [sortedTags, setSortedTags] = useState<Tag[]>([]);

  useEffect(() => {
    // 使用頻度でソート
    const sorted = [...tags].sort((a, b) => b.count - a.count);
    setSortedTags(sorted);
  }, [tags]);

  const getTagSize = (count: number) => {
    const maxCount = Math.max(...tags.map(t => t.count));
    const minCount = Math.min(...tags.map(t => t.count));
    const ratio = (count - minCount) / (maxCount - minCount);

    if (ratio > 0.8) return 'text-xl';
    if (ratio > 0.6) return 'text-lg';
    if (ratio > 0.4) return 'text-base';
    return 'text-sm';
  };

  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'bg-green-100 text-green-800 hover:bg-green-200',
      'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="tag-cloud">
      <h3 className="text-lg font-semibold mb-4">人気のタグ</h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag, index) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect(tag.id)}
            className={`
              ${getTagColor(index)}
              ${getTagSize(tag.count)}
              px-3 py-1 rounded-full transition-colors
              ${selectedTags.includes(tag.id) ? 'ring-2 ring-offset-2' : ''}
            `}
          >
            {tag.name}
            <span className="ml-1 text-xs opacity-75">({tag.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

6. 検索機能の最適化

全文検索機能を実装します。

```typescript
// src/lib/search.ts
import { Post } from '@/types/blog';

export class BlogSearch {
  private posts: Post[];
  private searchIndex: Map<string, Set<string>> = new Map();

  constructor(posts: Post[]) {
    this.posts = posts;
    this.buildIndex();
  }

  private buildIndex() {
    this.posts.forEach(post => {
      const searchableText = [
        post.title,
        post.excerpt,
        post.content,
        ...post.tags,
        post.category
      ].join(' ').toLowerCase();

      // 単語をトークン化
      const tokens = this.tokenize(searchableText);

      tokens.forEach(token => {
        if (!this.searchIndex.has(token)) {
          this.searchIndex.set(token, new Set());
        }
        this.searchIndex.get(token)!.add(post.id);
      });
    });
  }

  private tokenize(text: string): string[] {
    return text
      .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1);
  }

  search(query: string, filters?: {
    category?: string;
    tags?: string[];
    dateRange?: { start: Date; end: Date };
  }): Post[] {
    const tokens = this.tokenize(query.toLowerCase());
    let matchingPosts = new Set<string>();

    if (tokens.length === 0) {
      matchingPosts = new Set(this.posts.map(p => p.id));
    } else {
      // 各トークンにマッチする記事を検索
      tokens.forEach(token => {
        const matches = this.searchIndex.get(token);
        if (matches) {
          if (matchingPosts.size === 0) {
            matchingPosts = new Set(matches);
          } else {
            // AND検索：すべてのトークンにマッチする記事のみ
            const intersection = new Set(
              [...matchingPosts].filter(id => matches.has(id))
            );
            matchingPosts = intersection;
          }
        }
      });
    }

    // フィルター適用
    let filteredPosts = this.posts.filter(post =>
      matchingPosts.has(post.id)
    );

    if (filters?.category) {
      filteredPosts = filteredPosts.filter(post =>
        post.category === filters.category
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        filters.tags!.every(tag => post.tags.includes(tag))
      );
    }

    if (filters?.dateRange) {
      const { start, end } = filters.dateRange;
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate >= start && postDate <= end;
      });
    }

    // スコアリングとソート
    return filteredPosts
      .map(post => ({
        ...post,
        score: this.calculateScore(post, tokens)
      }))
      .sort((a, b) => b.score - a.score);
  }

  private calculateScore(post: Post, tokens: string[]): number {
    let score = 0;

    // タイトルのマッチは高スコア
    const titleLower = post.title.toLowerCase();
    tokens.forEach(token => {
      if (titleLower.includes(token)) {
        score += 10;
      }
    });

    // タグのマッチ
    post.tags.forEach(tag => {
      if (tokens.some(token => tag.toLowerCase().includes(token))) {
        score += 5;
      }
    });

    // コンテンツのマッチ
    const contentLower = post.content.toLowerCase();
    tokens.forEach(token => {
      const matches = (contentLower.match(new RegExp(token, 'g')) || []).length;
      score += matches;
    });

    // 新しさボーナス
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated < 30) {
      score += Math.max(0, 5 - daysSinceCreated / 10);
    }

    return score;
  }
}
```

7. 目次の自動生成

見出しから目次を自動生成します。

```typescript
// src/components/blog/TableOfContents.tsx
import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 記事内の見出しを収集
    const headings = document.querySelectorAll('h2, h3, h4');
    const items: TocItem[] = Array.from(headings).map(heading => {
      const id = heading.id || heading.textContent!.toLowerCase().replace(/\s+/g, '-');
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent!,
        level: parseInt(heading.tagName.charAt(1))
      };
    });

    setToc(items);

    // スクロール位置の監視
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // ヘッダーの高さを考慮
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="toc sticky top-20">
      <h3 className="text-lg font-semibold mb-4">目次</h3>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`
                text-left w-full transition-colors
                ${activeId === item.id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}
                ${item.level === 3 ? 'ml-4 text-sm' : ''}
                ${item.level === 4 ? 'ml-8 text-sm' : ''}
              `}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

:::

## 🎨 SEO最適化の実装

コンテンツサイトの検索エンジン最適化を実装します。

```typescript
// src/components/blog/SEO.tsx
import Head from 'next/head';
import { Post } from '@/types/blog';

interface SEOProps {
  post?: Post;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ post, title, description, image, url }: SEOProps) {
  const siteTitle = 'DevLog - 開発者ブログ';
  const siteDescription = '実践的な技術記事と開発のヒントを提供するブログ';
  const siteUrl = 'https://devlog.example.com';

  const pageTitle = post?.title || title || siteTitle;
  const pageDescription = post?.excerpt || description || siteDescription;
  const pageImage = post?.featuredImage || image || `${siteUrl}/og-image.jpg`;
  const pageUrl = post?.slug ? `${siteUrl}/blog/${post.slug}` : url || siteUrl;

  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "image": post.featuredImage,
    "publisher": {
      "@type": "Organization",
      "name": "DevLog",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    }
  } : null;

  return (
    <Head>
      {/* 基本的なメタタグ */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={post ? "article" : "website"} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="DevLog" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* 構造化データ */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* 記事用の追加メタタグ */}
      {post && (
        <>
          <meta property="article:published_time" content={post.createdAt} />
          <meta property="article:modified_time" content={post.updatedAt} />
          <meta property="article:author" content={post.author.name} />
          {post.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </Head>
  );
}
```

## 📊 パフォーマンスの最適化

大量のコンテンツを効率的に配信するための最適化を実装します。

```typescript
// src/pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));

  return {
    paths,
    fallback: 'blocking' // 新しい記事はオンデマンドで生成
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug(params!.slug as string);

  if (!post) {
    return { notFound: true };
  }

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [require('remark-prism')],
      rehypePlugins: [require('rehype-slug')]
    }
  });

  // 関連記事の取得
  const relatedPosts = await getRelatedPosts(post.tags, post.slug);

  return {
    props: {
      post,
      source: mdxSource,
      relatedPosts
    },
    revalidate: 3600 // 1時間ごとに再検証
  };
};
```

## まとめ

v0を使えば、機能豊富なコンテンツ管理サイトも効率的に構築できます。適切なプロンプト設計と実装テクニックを組み合わせることで、読者にとって使いやすく、検索エンジンにも最適化されたブログやドキュメントサイトを作成できます。

:::note 要点のまとめ

- コンテンツ管理サイトには記事一覧、詳細ページ、検索機能、目次が必須
- v0のプロンプトは具体的な機能要件とデザイン指示を明記することが重要
- タグシステムと検索機能でコンテンツの発見性を向上させる
- SEO最適化とパフォーマンス最適化でサイト価値を最大化する
- マークダウン対応と目次自動生成でコンテンツ作成を効率化する

:::

次は「[認証付きアプリケーションスケルトン](./authenticated-skeleton.md)」を学び、ユーザー認証機能の実装方法を習得しましょう。

## 📚 関連リンク

- [プロンプト設計のベストプラクティス](../level2-prompts-style/prompts-style.md)
- [認証機能の実装](../level4-app-assembly/authentication.md)
- [SEO最適化ガイド](../level6-integration-deploy/vercel-deploy.md)