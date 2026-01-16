---
title: タイポグラフィ基礎（フォント/行間/字間）
slug: typography-basics
parent: tailwind-basics
file_path: tailwind-basics/typography-basics
target_user: Tailwind CSS初心者、フロントエンド開発者、Webデザイナー
goal: "Tailwind CSSでのタイポグラフィ設定を実践的に学び、読みやすく美しいテキストデザインを構築できるようになる"
status: publish
post_type: pages
seo_title: Tailwind CSSタイポグラフィ完全ガイド - フォント・行間・字間の設定方法
seo_keywords: "TailwindCSS,タイポグラフィ,フォント,行間,字間,Webデザイン,テキスト設計"
seo_description: "Tailwind CSSでのタイポグラフィ設定を基礎から実践まで解説。フォントファミリー、サイズ、行間、字間の適切な設定方法とアクセシビリティを考慮したデザインパターンを学習できます。"
handson_overview: "実際のHTMLコードでフォント設定、行間調整、字間調整を体験し、ブログ記事やランディングページなど実用的なコンポーネントでタイポグラフィデザインを実装します"
---

# 📝 タイポグラフィ基礎（フォント/行間/字間）

Webデザインにおいて、テキストは情報を伝える最も重要な要素です。Tailwind CSSは、美しく読みやすいタイポグラフィを簡単に実現するための包括的なユーティリティクラスを提供しています。適切なフォント選択と間隔設定により、ユーザーエクスペリエンスを大幅に向上させることができます。

このページでは、Tailwind CSSでのタイポグラフィ設定の基礎から実践的な応用まで、段階的に学習していきます。

## このページで学べること

このページを完了すると、Tailwind CSSを使用して読みやすく美しいタイポグラフィを構築するために必要な知識が身につきます。

:::note このページで学べる内容

- フォントファミリーとWebフォントの設定方法
- フォントサイズとウェイトのスケール活用
- 行間（line-height）の適切な設定
- 字間（letter-spacing）による可読性向上
- テキスト装飾とスタイリング
- アクセシビリティを考慮したタイポグラフィ設計
- 実用的なコンポーネントでの応用パターン

:::

## 🎨 フォントファミリーの設定

Tailwind CSSでは、Webセーフフォントから現代的なWebフォントまで、幅広いフォントファミリーを簡単に設定できます。適切なフォント選択は、ブランドイメージと可読性の両立に重要な役割を果たします。

### デフォルトフォントファミリー

Tailwind CSSには、用途別に最適化された5つのフォントファミリーカテゴリが用意されています。

:::syntax フォントファミリークラス

```css
font-sans     /* sans-serif系フォント */
font-serif    /* serif系フォント */
font-mono     /* 等幅フォント */
```

各クラスは、OS別に最適化されたフォントスタックを自動的に適用します。

:::

_デフォルトフォントの例_

```html
<!-- Sans-serif（デフォルト・最も汎用的） -->
<p class="font-sans">
  現代的で読みやすいサンセリフフォントです。
</p>

<!-- Serif（記事本文・格式のあるコンテンツ） -->
<p class="font-serif">
  伝統的で上品な印象のセリフフォントです。
</p>

<!-- Monospace（コード・データ表示） -->
<p class="font-mono">
  等幅フォントで、コードやデータに最適です。
</p>
```

### カスタムWebフォントの設定

Google FontsやAdobe Fontsなどのカスタムフォントを使用する場合は、設定ファイルでフォントファミリーを拡張できます。

:::note Webフォントとは

Webフォントは、サーバーからダウンロードしてWebページで使用するフォントです。ブランドの一貫性やデザインの質を向上させるために使用されます。

:::

## 📏 フォントサイズとスケール

Tailwind CSSのフォントサイズは、デザインシステムの原則に基づいた一貫性のあるスケールを提供します。適切なサイズヒエラルキーにより、情報の構造を明確に伝えることができます。

### フォントサイズクラス

:::syntax フォントサイズクラス

```css
text-xs     /* 12px - キャプション・補助情報 */
text-sm     /* 14px - 小さなテキスト */
text-base   /* 16px - 本文（デフォルト） */
text-lg     /* 18px - 大きめの本文 */
text-xl     /* 20px - 小見出し */
text-2xl    /* 24px - 見出し */
text-3xl    /* 30px - 大見出し */
text-4xl    /* 36px - タイトル */
text-5xl    /* 48px - 大タイトル */
text-6xl    /* 60px - 特大タイトル */
text-7xl    /* 72px - ヒーロータイトル */
text-8xl    /* 96px - 超大型タイトル */
text-9xl    /* 128px - 最大サイズ */
```

各サイズは、異なる用途とコンテキストに最適化されています。

:::

### 実践的なサイズ選択の指針

```html
<!-- 記事のタイトルヒエラルキー -->
<h1 class="text-4xl">メインタイトル</h1>
<h2 class="text-2xl">セクション見出し</h2>
<h3 class="text-xl">サブセクション見出し</h3>
<p class="text-base">本文は読みやすい16pxベースサイズ</p>
<small class="text-sm">補足情報や注釈</small>

<!-- ランディングページのヒーロー -->
<h1 class="text-6xl">大迫力のヒーローテキスト</h1>
<p class="text-lg">説明文は少し大きめで目立たせる</p>
```

## ⚡ フォントウェイト（太さ）

フォントウェイトは、テキストの視覚的な重要度と階層を表現する重要な要素です。Tailwind CSSでは、細い線から極太まで幅広い選択肢を提供しています。

### フォントウェイトクラス

:::syntax フォントウェイトクラス

```css
font-thin       /* 100 - 極細 */
font-extralight /* 200 - 超細 */
font-light      /* 300 - 細字 */
font-normal     /* 400 - 標準（デフォルト） */
font-medium     /* 500 - 中字 */
font-semibold   /* 600 - 準太字 */
font-bold       /* 700 - 太字 */
font-extrabold  /* 800 - 超太字 */
font-black      /* 900 - 極太 */
```

適切なウェイト選択により、テキストの階層と強調を効果的に表現できます。

:::

### 効果的なウェイト活用

```html
<!-- 見出しと本文のコントラスト -->
<h2 class="text-2xl font-bold">重要な見出し</h2>
<p class="text-base font-normal">通常の本文テキスト</p>
<p class="text-sm font-light">軽やかな補足情報</p>

<!-- UI要素での強調 -->
<button class="font-semibold">アクションボタン</button>
<span class="font-medium">ステータス表示</span>
<label class="font-normal">フォームラベル</label>
```

## 📐 行間（Line Height）の設定

行間は、テキストの可読性に最も大きな影響を与える要素の一つです。適切な行間設定により、読みやすさと視覚的な美しさを両立できます。

### 行間クラスの種類

:::syntax 行間クラス

```css
leading-none     /* line-height: 1 */
leading-tight    /* line-height: 1.25 */
leading-snug     /* line-height: 1.375 */
leading-normal   /* line-height: 1.5 */
leading-relaxed  /* line-height: 1.625 */
leading-loose    /* line-height: 2 */
```

また、具体的な数値指定も可能です：`leading-3`から`leading-10`

:::

### コンテンツタイプ別の最適な行間

```html
<!-- 見出し：タイトな行間で力強さを演出 -->
<h1 class="text-4xl font-bold leading-tight">
  力強い見出しテキスト
</h1>

<!-- 本文：読みやすい標準的な行間 -->
<p class="text-base leading-normal">
  本文は読みやすさを重視して、適度な行間を設定します。
  長文の場合は、目の移動を考慮した行間が重要です。
</p>

<!-- 詩や短文：ゆったりした行間で優雅さを演出 -->
<blockquote class="text-lg leading-loose font-light">
  「美しい文章には、適切な余白が必要である」
</blockquote>
```

## ✍️ 字間（Letter Spacing）の調整

字間の調整により、テキストの見た目の密度や読みやすさを細かく制御できます。特に見出しや装飾的なテキストで効果的です。

### 字間クラスの設定

:::syntax 字間クラス

```css
tracking-tighter  /* letter-spacing: -0.05em */
tracking-tight    /* letter-spacing: -0.025em */
tracking-normal   /* letter-spacing: 0em */
tracking-wide     /* letter-spacing: 0.025em */
tracking-wider    /* letter-spacing: 0.05em */
tracking-widest   /* letter-spacing: 0.1em */
```

字間の調整は、フォントサイズとの組み合わせで最適化することが重要です。

:::

### 効果的な字間活用パターン

```html
<!-- 大きな見出し：字間を詰めて力強さを演出 -->
<h1 class="text-5xl font-black tracking-tight">
  IMPACT TITLE
</h1>

<!-- 小さなラベル：字間を広げて読みやすさを向上 -->
<span class="text-xs font-medium tracking-wide uppercase">
  CATEGORY LABEL
</span>

<!-- 標準テキスト：通常の字間を維持 -->
<p class="text-base tracking-normal">
  通常の文章では、デフォルトの字間を使用します。
</p>
```

## 🎭 テキスト装飾とスタイリング

Tailwind CSSでは、下線、取り消し線、大文字小文字変換など、テキストの装飾機能も豊富に提供されています。

### テキスト装飾クラス

```html
<!-- 下線と取り消し線 -->
<p class="underline">下線付きテキスト</p>
<p class="line-through">取り消し線付きテキスト</p>
<p class="no-underline">下線なしテキスト</p>

<!-- 大文字小文字変換 -->
<p class="uppercase">UPPERCASE TEXT</p>
<p class="lowercase">lowercase text</p>
<p class="capitalize">Capitalize Each Word</p>

<!-- テキスト配置 -->
<p class="text-left">左寄せテキスト</p>
<p class="text-center">中央寄せテキスト</p>
<p class="text-right">右寄せテキスト</p>
<p class="text-justify">均等配置テキスト</p>
```

## 🔧 タイポグラフィの実践実装

それでは、学習した内容を踏まえて、実際のWebコンポーネントでタイポグラフィを実装してみましょう。

### ブログ記事のタイポグラフィを実装してみよう

実際のブログ記事レイアウトを作成して、タイポグラフィの実践的な使い方を体験します。

:::step

1. HTMLファイルの作成

作業ディレクトリに`typography-demo.html`を作成してください。

_typography-demo.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>タイポグラフィデモ</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 font-sans">
  <!-- コンテンツをここに追加していきます -->
</body>
</html>
```

2. ブログ記事のヘッダー部分を作成

bodyタグ内に以下のコードを追加してください。

_typography-demo.html_

```html
<article class="max-w-4xl mx-auto px-6 py-12">
  <!-- 記事ヘッダー -->
  <header class="mb-12">
    //addstart
    <div class="mb-4">
      <span class="text-sm font-medium tracking-wide uppercase text-blue-600">
        WEB DESIGN
      </span>
    </div>

    <h1 class="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
      美しいタイポグラフィが
      <span class="text-blue-600">ユーザー体験</span>
      を変える
    </h1>

    <p class="text-xl leading-relaxed text-gray-600 mb-8">
      適切なフォント選択と間隔設定により、Webサイトの可読性と美しさを
      大幅に向上させる実践的な手法を詳しく解説します。
    </p>

    <div class="flex items-center text-sm text-gray-500">
      <span class="font-medium">山田太郎</span>
      <span class="mx-2">•</span>
      <time>2024年3月15日</time>
      <span class="mx-2">•</span>
      <span>5分で読める</span>
    </div>
    //addend
  </header>
</article>
```

3. 記事本文のセクションを追加

headerタグの後に、記事本文を追加してください。

_typography-demo.html_

```html
//addstart
<!-- 記事本文 -->
<main class="prose prose-lg max-w-none">
  <section class="mb-12">
    <h2 class="text-3xl font-bold leading-tight text-gray-900 mb-6">
      タイポグラフィの基本原則
    </h2>

    <p class="text-base leading-relaxed text-gray-700 mb-6">
      優れたタイポグラフィは、単に美しいだけでなく、情報を効果的に伝える機能を持っています。
      フォントの選択、サイズの階層、適切な間隔設定により、読者の理解を深め、
      快適な読書体験を提供することができます。
    </p>

    <blockquote class="border-l-4 border-blue-500 pl-6 py-4 mb-6 bg-blue-50">
      <p class="text-lg font-medium leading-loose text-gray-800 italic">
        「タイポグラフィは、声に出さずに話すアートである」
      </p>
      <footer class="text-sm text-gray-600 mt-2">
        — ポール・ランド、グラフィックデザイナー
      </footer>
    </blockquote>
  </section>

  <section class="mb-12">
    <h3 class="text-2xl font-semibold leading-snug text-gray-900 mb-4">
      フォントサイズの階層設計
    </h3>

    <p class="text-base leading-normal text-gray-700 mb-4">
      情報の重要度に応じたフォントサイズの設定は、ユーザーの視線誘導に重要な役割を果たします。
    </p>

    <ul class="space-y-3 mb-6">
      <li class="flex items-start">
        <span class="text-blue-500 font-bold mr-3">•</span>
        <span class="text-base text-gray-700">
          <strong class="font-semibold">メインタイトル</strong>:
          大きく印象的に（text-4xl以上）
        </span>
      </li>
      <li class="flex items-start">
        <span class="text-blue-500 font-bold mr-3">•</span>
        <span class="text-base text-gray-700">
          <strong class="font-semibold">セクション見出し</strong>:
          明確に区別できるサイズ（text-2xl〜text-3xl）
        </span>
      </li>
      <li class="flex items-start">
        <span class="text-blue-500 font-bold mr-3">•</span>
        <span class="text-base text-gray-700">
          <strong class="font-semibold">本文</strong>:
          読みやすい標準サイズ（text-base〜text-lg）
        </span>
      </li>
    </ul>
  </section>
</main>
//addend
```

4. カードコンポーネントセクションを追加

mainタグの後に、実践的なカードコンポーネントを追加してください。

_typography-demo.html_

```html
//addstart
<!-- カードコンポーネント例 -->
<section class="mt-16 mb-12">
  <h2 class="text-3xl font-bold leading-tight text-gray-900 mb-8 text-center">
    実践的なタイポグラフィパターン
  </h2>

  <div class="grid md:grid-cols-2 gap-8">
    <!-- サービス紹介カード -->
    <div class="bg-white rounded-lg shadow-lg p-8">
      <div class="mb-4">
        <span class="text-xs font-bold tracking-widest uppercase text-gray-500">
          SERVICE
        </span>
      </div>
      <h3 class="text-2xl font-bold leading-tight text-gray-900 mb-4">
        コンサルティング
      </h3>
      <p class="text-base leading-relaxed text-gray-600 mb-6">
        経験豊富なデザイナーが、あなたのプロジェクトに最適な
        タイポグラフィ戦略をご提案します。
      </p>
      <div class="text-3xl font-black text-blue-600 mb-2">
        ¥50,000
      </div>
      <div class="text-sm text-gray-500">
        月額 / プロジェクトあたり
      </div>
    </div>

    <!-- ニュース記事カード -->
    <div class="bg-gray-900 rounded-lg p-8 text-white">
      <div class="mb-4">
        <span class="text-xs font-medium tracking-wide uppercase text-gray-400">
          NEWS • 2024.03.15
        </span>
      </div>
      <h3 class="text-xl font-bold leading-tight mb-4">
        新しいWebフォントライブラリ
        <br>
        <span class="text-yellow-400">「TypeFlow」</span>
        がリリース
      </h3>
      <p class="text-base leading-normal text-gray-300 mb-6">
        パフォーマンスを重視した新世代のWebフォントソリューション。
        読み込み速度を50%改善し、より美しいタイポグラフィを実現。
      </p>
      <button class="text-sm font-semibold tracking-wide uppercase text-yellow-400 hover:text-yellow-300">
        続きを読む →
      </button>
    </div>
  </div>
</section>
//addend
```

5. ブラウザで確認

ファイルを保存し、ブラウザで`typography-demo.html`を開いてください。
異なるフォントサイズ、ウェイト、行間、字間が適用されたタイポグラフィを確認できます。

:::

このハンズオンを通じて、Tailwind CSSでのタイポグラフィ設定の実践的な使い方を体験できました。

### レスポンシブタイポグラフィを実装してみよう

次に、デバイスサイズに応じて最適化されたタイポグラフィを実装します。

:::step

1. レスポンシブ見出しの実装

先ほどの`typography-demo.html`のメインタイトル部分を以下に変更してください。

_typography-demo.html_

```html
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 mb-6">
  //delstart
  美しいタイポグラフィが
  <span class="text-blue-600">ユーザー体験</span>
  を変える
  //delend
  //addstart
  レスポンシブタイポグラフィが
  <span class="text-blue-600">ユーザー体験</span>
  を最適化する
  //addend
</h1>
```

2. レスポンシブ本文テキストの実装

記事本文の段落を以下に変更してください。

_typography-demo.html_

```html
<p class="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-600 mb-8">
  //delstart
  適切なフォント選択と間隔設定により、Webサイトの可読性と美しさを
  大幅に向上させる実践的な手法を詳しく解説します。
  //delend
  //addstart
  デバイスサイズに応じて最適化されたタイポグラフィにより、
  すべてのユーザーに快適な読書体験を提供する手法を学習します。
  //addend
</p>
```

3. ブレークポイント別のスタイル確認

ブラウザの開発者ツールでデバイスモードに切り替え、異なる画面サイズでタイポグラフィがどのように変化するかを確認してください。

- モバイル（320px〜）: 小さめのフォントサイズ
- タブレット（768px〜）: 中程度のフォントサイズ
- デスクトップ（1024px〜）: 大きなフォントサイズ

:::

レスポンシブタイポグラフィにより、デバイスに関係なく最適な読書体験を提供できるようになりました。

## 🌟 アクセシビリティを考慮したタイポグラフィ

優れたタイポグラフィは、すべてのユーザーにとって読みやすく理解しやすいものでなければなりません。

### アクセシビリティのベストプラクティス

```html
<!-- 十分なコントラスト比を確保 -->
<p class="text-gray-900 bg-white">
  高いコントラスト比（4.5:1以上）で可読性を確保
</p>

<!-- 適切なフォントサイズ -->
<p class="text-base sm:text-lg">
  最小16px以上のフォントサイズを使用
</p>

<!-- 十分な行間 -->
<p class="leading-relaxed">
  1.5以上の行間で読みやすさを向上
</p>

<!-- 長い行を避ける -->
<div class="max-w-2xl">
  <p class="text-base leading-normal">
    1行の文字数を適切に制限（45-75文字程度）
  </p>
</div>
```

:::warning アクセシビリティの注意点

- フォントサイズは最小16px以上を推奨
- コントラスト比は4.5:1以上を確保
- 行間は1.5以上に設定
- 色だけでなく、フォントウェイトやサイズでも情報を伝達

:::

## まとめ

Tailwind CSSのタイポグラフィシステムを活用することで、美しく読みやすいテキストデザインを効率的に構築できます。フォントサイズのスケール、適切な行間と字間、レスポンシブ対応により、すべてのユーザーに優れた読書体験を提供することが可能です。

:::note 要点のまとめ

- **フォントファミリー**: 用途に応じてsans、serif、monoを使い分け
- **サイズヒエラルキー**: text-baseを基準とした一貫性のあるスケール
- **ウェイト活用**: 情報の重要度に応じた適切な太さ設定
- **行間設定**: コンテンツタイプに応じたleading調整
- **字間調整**: 見出しや装飾テキストでのtracking活用
- **レスポンシブ**: デバイスサイズに応じた最適化
- **アクセシビリティ**: 十分なコントラストと可読性の確保

:::

次のページでは、Flexbox、Grid、Positionを使用したレイアウト基礎について学習します。タイポグラフィと組み合わせることで、より完成度の高いWebデザインを構築できるようになります。

[レイアウト基礎（Flex/Grid/Position）](./layout-basics)

## 関連リンク

- [ユーティリティクラスの基本](./utility-basics)
- [スペーシング/サイズ/色のスケール](./scales-spacing-color-size)
- [レスポンシブとブレークポイント](./breakpoints-responsive)

## さらに深く学習したい方へ

Tailwind CSSのタイポグラフィをより深く学習したい方は、実際のプロジェクトでのタイポグラフィ設計や、デザインシステムの構築について学べる実践的な研修プログラムもご利用ください。経験豊富な講師による個別指導で、プロフェッショナルなスキルを身につけることができます。