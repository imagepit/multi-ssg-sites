---
title: コンテナ/幅・余白の設計（container/max-w/px）
slug: container-width-spacing
parent: layout-design
file_path: layout-design/container-width-spacing
target_user: Tailwind CSS基礎を習得した中級開発者、Webデザイナー
goal: "Tailwind CSSのコンテナと余白設計を習得し、読みやすく美しいレイアウトを実現するための戦略的なアプローチを身につける"
status: publish
post_type: pages
seo_title: Tailwind CSSコンテナ設計完全ガイド - 幅制御と余白戦略でプロ級レイアウト実現
seo_keywords: "TailwindCSS,コンテナ,container,max-width,padding,余白設計,レスポンシブ,レイアウト"
seo_description: "Tailwind CSSでのコンテナと余白設計の戦略的アプローチを解説。containerクラス、max-width、paddingの効果的な組み合わせで、読みやすく美しいレスポンシブレイアウトを実現する実践的な実装方法を習得できます。"
handson_overview: "ランディングページ、ブログ記事、ダッシュボードなど実際のWebサイトパターンを構築しながら、コンテナ設計と余白管理の実践的なテクニックを段階的に学習できます"
---

# 📐 コンテナ/幅・余白の設計（container/max-w/px）

Webサイトの読みやすさと美しさを決定する重要な要素の一つが、**コンテナの幅制御と余白設計**です。適切なコンテナ設計により、コンテンツが画面サイズに関係なく最適な読みやすさを保ち、視覚的な調和を生み出すことができます。

Tailwind CSSでは、`container`、`max-width`、`padding`クラスを戦略的に組み合わせることで、プロフェッショナルなレイアウトを効率的に実現できます。このアプローチにより、デザインシステムの一貫性を保ちながら、ユーザーエクスペリエンスを向上させることができます。

## はじめに

現代のWebデザインでは、様々なデバイスサイズに対応しながら、コンテンツの可読性とビジュアルバランスを保つことが求められます。コンテナと余白の設計は、単なるレイアウトの問題ではなく、ユーザーの認知負荷を軽減し、情報を効果的に伝達するための重要な戦略です。

### このページで学べる事

Tailwind CSSを使用したコンテナ設計と余白管理の実践的なアプローチを習得し、実際のWebサイトで使用される効果的なレイアウトパターンを実装できるようになります。

:::note 学習目標

- `container`クラスとカスタマイズ方法を理解し適切に活用できる
- `max-width`による幅制御の戦略的な設計ができる
- `padding`と`margin`を使った効果的な余白設計ができる
- レスポンシブデザインでの幅制御ベストプラクティスを実装できる
- 実際のWebサイトパターンでのコンテナ設計を実践できる

:::

## 🏗️ Tailwind CSSのcontainerクラス基礎

Tailwind CSSの`container`クラスは、コンテンツの最大幅を制御し、中央配置を行うユーティリティクラスです。各ブレークポイントに応じて自動的に最適な幅を設定し、レスポンシブデザインの基盤となります。

### containerクラスの基本動作

`container`クラスは、画面サイズに応じて以下の最大幅を設定します：

- デフォルト（`sm`未満）: 100%
- `sm` (640px以上): 640px
- `md` (768px以上): 768px
- `lg` (1024px以上): 1024px
- `xl` (1280px以上): 1280px
- `2xl` (1536px以上): 1536px

:::note containerクラスとは

Tailwind CSSの`container`クラスは、コンテンツの最大幅を各ブレークポイントで制御し、レスポンシブデザインの一貫性を保つためのユーティリティです。自動的に中央配置され、デバイスサイズに応じて最適な読みやすさを提供します。

:::

### containerクラスの中央配置

`container`クラスは自動的に中央配置されますが、これは内部的に`margin: 0 auto`が適用されているためです。追加の設定なしで、コンテンツを画面の中央に配置できます。

```html
<div class="container">
  <!-- コンテンツが画面の中央に配置されます -->
  <h1>中央配置されたコンテンツ</h1>
</div>
```

### containerでの余白設定

`container`クラスにはデフォルトでpaddingが設定されていないため、通常は`px-4`や`px-6`などのpaddingクラスと組み合わせて使用します。

```html
<div class="container mx-auto px-4">
  <!-- 左右に余白を持った中央配置コンテナ -->
  <main>メインコンテンツ</main>
</div>
```

## 📏 max-widthによる戦略的幅制御

`max-width`クラスは、コンテンツの最大幅をより細かく制御したい場合に使用します。`container`クラスとは異なり、特定の用途や要件に応じてカスタマイズされた幅制御が可能です。

### 読みやすさを重視した幅制御

テキストコンテンツの場合、行の長さは読みやすさに大きく影響します。一般的に、1行あたり45-75文字が最適とされており、Tailwind CSSでは以下のクラスで実現できます。

```html
<!-- ブログ記事など読みやすさを重視する場合 -->
<article class="max-w-2xl mx-auto px-6">
  <h1>記事タイトル</h1>
  <p>本文コンテンツ...</p>
</article>

<!-- より幅広いコンテンツレイアウト -->
<section class="max-w-6xl mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- グリッドコンテンツ -->
  </div>
</section>
```

### レスポンシブmax-width設計

異なる画面サイズで異なる最大幅を設定することで、最適な表示を実現できます。

```html
<div class="max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
  <!-- 画面サイズに応じて幅が変化するレスポンシブコンテナ -->
</div>
```

## 🎨 効果的な余白設計戦略

余白設計は、視覚的な階層とリズムを作り出し、ユーザーの視線を適切に誘導するための重要な要素です。Tailwind CSSのスペーシングシステムを活用して、一貫性のある余白設計を実現できます。

### 垂直方向の余白設計

セクション間の余白は、コンテンツの関係性と重要度を視覚的に表現します。

```html
<!-- セクション間の余白設計例 -->
<main class="container mx-auto px-4">
  <section class="py-16">
    <h2 class="text-3xl font-bold mb-8">メインセクション</h2>
    <div class="space-y-6">
      <!-- コンテンツ間の一貫した余白 -->
    </div>
  </section>

  <section class="py-12 bg-gray-50">
    <h2 class="text-2xl font-semibold mb-6">サブセクション</h2>
    <!-- セクションの重要度に応じた余白調整 -->
  </section>
</main>
```

### 水平方向の余白パターン

横方向の余白は、コンテンツの読みやすさとビジュアルバランスに直接影響します。

```html
<!-- ネストしたコンテナでの余白管理 -->
<div class="container mx-auto px-4">
  <div class="max-w-4xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">
      <!-- 多層的な余白設計 -->
    </div>
  </div>
</div>
```

:::tip 余白設計のベストプラクティス

- **一貫性**: 同じ種類のコンテンツには同じ余白を適用
- **階層性**: 重要度に応じて余白サイズを調整
- **呼吸感**: 十分な余白でコンテンツに呼吸する空間を提供
- **レスポンシブ**: 画面サイズに応じて余白を調整

:::

## 🌐 レスポンシブコンテナ設計

現代のWebデザインでは、様々なデバイスサイズに対応したレスポンシブなコンテナ設計が不可欠です。Tailwind CSSのレスポンシブプレフィックスを活用して、デバイスごとに最適化されたレイアウトを実現できます。

### デバイス別コンテナ戦略

```html
<!-- モバイルファーストのレスポンシブコンテナ -->
<div class="w-full px-4 sm:px-6 md:px-8">
  <div class="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
    <!-- デバイスサイズに応じて幅と余白を調整 -->
    <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
      レスポンシブタイトル
    </h1>
  </div>
</div>
```

### ブレークポイント別最適化

```html
<!-- ブレークポイントごとの詳細制御 -->
<section class="py-8 md:py-12 lg:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <div class="max-w-prose mx-auto lg:max-w-none">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <main class="lg:col-span-8">
          <!-- メインコンテンツ -->
        </main>
        <aside class="mt-8 lg:mt-0 lg:col-span-4">
          <!-- サイドバー -->
        </aside>
      </div>
    </div>
  </div>
</section>
```

## 🚀 実践的コンテナパターン実装

### ランディングページを作成してみよう

実際のランディングページレイアウトを構築しながら、コンテナ設計の実践的なテクニックを学習しましょう。ヒーローセクション、機能紹介、お客様の声など、典型的なランディングページの構成要素を実装します。

:::step

1. ベースHTMLファイルの作成

プロジェクトディレクトリに`landing-page.html`を作成し、基本的なHTMLテンプレートを設定します。

_landing-page.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>コンテナ設計サンプル - ランディングページ</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
  <!-- ここにコンテンツを追加していきます -->
</body>
</html>
```

2. ヒーローセクションの実装

ランディングページの第一印象を決定するヒーローセクションを実装します。

_landing-page.html_
```html
//addstart
  <!-- ヒーローセクション -->
  <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
    <div class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          革新的なソリューションで
          <span class="text-yellow-300">ビジネスを変革</span>
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          最新のテクノロジーを活用して、あなたのビジネスを次のレベルへ導きます
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-200">
            今すぐ始める
          </button>
          <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition duration-200">
            詳細を見る
          </button>
        </div>
      </div>
    </div>
  </section>
//addend
```

このヒーローセクションでは、`container mx-auto px-4`でベースコンテナを設定し、`max-w-3xl mx-auto`でコンテンツの最大幅を制限しています。

3. 機能紹介セクションの実装

製品やサービスの主要機能を紹介するセクションを追加します。

_landing-page.html_
```html
//addstart
  <!-- 機能紹介セクション -->
  <section class="py-16 md:py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            なぜ選ばれるのか
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            業界をリードする技術と実績で、お客様のビジネス課題を解決します
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">高品質</h3>
            <p class="text-gray-600">
              厳格な品質管理基準により、常に最高品質のサービスを提供します
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">専門サポート</h3>
            <p class="text-gray-600">
              経験豊富な専門チームが、導入から運用まで継続的にサポートします
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-1">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">スケーラブル</h3>
            <p class="text-gray-600">
              ビジネスの成長に合わせて柔軟にスケールアップできるアーキテクチャ
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
//addend
```

このセクションでは、`max-w-4xl`でコンテンツ幅を制限し、グリッドレイアウトで機能カードを配置しています。

4. お客様の声セクションの実装

社会的証明を提供するお客様の声セクションを追加します。

_landing-page.html_
```html
//addstart
  <!-- お客様の声セクション -->
  <section class="py-16 md:py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            お客様の声
          </h2>
          <p class="text-xl text-gray-600">
            実際にご利用いただいているお客様からの評価をご紹介します
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 border border-gray-200 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "導入後、業務効率が30%向上しました。直感的なインターフェースで、チーム全体がすぐに活用できるようになりました。"
            </p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                田
              </div>
              <div>
                <p class="font-semibold">田中様</p>
                <p class="text-sm text-gray-500">株式会社○○ 代表取締役</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 border border-gray-200 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "サポート体制が充実しており、導入時の不安も解消されました。継続的な改善提案もいただき、大変満足しています。"
            </p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                佐
              </div>
              <div>
                <p class="font-semibold">佐藤様</p>
                <p class="text-sm text-gray-500">株式会社△△ IT部長</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 border border-gray-200 rounded-lg md:col-span-2 lg:col-span-1">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "コストパフォーマンスが非常に優秀です。ROIの改善が明確に数値として現れており、経営陣からも高く評価されています。"
            </p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                鈴
              </div>
              <div>
                <p class="font-semibold">鈴木様</p>
                <p class="text-sm text-gray-500">株式会社□□ 財務部</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
//addend
```

5. CTAセクションとフッターの実装

行動を促すCTAセクションとフッターを追加して、ランディングページを完成させます。

_landing-page.html_
```html
//addstart
  <!-- CTAセクション -->
  <section class="bg-blue-600 text-white py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          今すぐ始めて、ビジネスを変革しませんか？
        </h2>
        <p class="text-xl mb-8 text-blue-100">
          14日間の無料トライアルで、すべての機能をお試しいただけます
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-200">
            無料トライアルを開始
          </button>
          <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition duration-200">
            資料請求
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- フッター -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">会社情報</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition duration-200">会社概要</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">採用情報</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">お知らせ</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">サービス</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition duration-200">料金プラン</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">機能詳細</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">導入事例</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">サポート</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition duration-200">ヘルプセンター</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">お問い合わせ</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">API仕様</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">フォローする</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-300 hover:text-white transition duration-200">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition duration-200">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 サンプル株式会社. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
//addend
```

6. ブラウザでの動作確認

作成したランディングページをブラウザで開いて動作確認を行います。

_コマンド実行_
```bash
open landing-page.html
```

異なる画面サイズでレスポンシブデザインが適切に動作することを確認してください。開発者ツールのデバイスモードを使用して、モバイル、タブレット、デスクトップでの表示を検証します。

:::

このランディングページ実装では、以下のコンテナ設計パターンを実践しました：

- **一貫したコンテナ構造**: 全セクションで`container mx-auto px-4`を基本パターンとして使用
- **コンテンツ別最大幅制御**: セクションの内容に応じて`max-w-3xl`から`max-w-6xl`まで使い分け
- **レスポンシブ余白設計**: デバイスサイズに応じた`py-16 md:py-20`などの動的余白調整
- **階層的レイアウト**: ネストしたコンテナで段階的な幅制御を実現

### ブログ記事レイアウトを作成してみよう

続いて、読みやすさを重視したブログ記事レイアウトを実装しましょう。長文コンテンツの可読性向上に特化したコンテナ設計を学習します。

:::step

1. ブログ記事HTMLファイルの作成

`blog-article.html`を作成し、記事コンテンツに最適化されたレイアウトを実装します。

_blog-article.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ブログ記事 - コンテナ設計サンプル</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <!-- ナビゲーション -->
  <nav class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="font-bold text-xl text-gray-900">Tech Blog</div>
        <div class="hidden md:flex space-x-8">
          <a href="#" class="text-gray-600 hover:text-gray-900">ホーム</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">技術記事</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">チュートリアル</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">お問い合わせ</a>
        </div>
      </div>
    </div>
  </nav>
</body>
</html>
```

2. 記事ヘッダーセクションの実装

記事のタイトル、メタ情報、アイキャッチ画像を含むヘッダーセクションを追加します。

_blog-article.html_
```html
//addstart
  <!-- 記事ヘッダー -->
  <header class="bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- パンくずリスト -->
        <nav class="mb-6">
          <ol class="flex text-sm text-gray-500">
            <li><a href="#" class="hover:text-gray-700">ホーム</a></li>
            <li class="mx-2">/</li>
            <li><a href="#" class="hover:text-gray-700">技術記事</a></li>
            <li class="mx-2">/</li>
            <li class="text-gray-900">Tailwind CSS</li>
          </ol>
        </nav>

        <!-- 記事タイトルとメタ情報 -->
        <div class="max-w-3xl mx-auto text-center mb-8">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tailwind CSSで実現する効果的なコンテナ設計の実践ガイド
          </h1>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                山
              </div>
              <span>山田太郎</span>
            </div>
            <div class="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <time datetime="2024-01-15">2024年1月15日</time>
            <div class="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>読了時間: 約8分</span>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">CSS設計</span>
            <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">レスポンシブデザイン</span>
          </div>
        </div>

        <!-- アイキャッチ画像 -->
        <div class="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
          <div class="text-white text-center">
            <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-lg">記事のアイキャッチ画像</p>
          </div>
        </div>
      </div>
    </div>
  </header>
//addend
```

3. 記事本文セクションの実装

読みやすさを重視した記事本文のレイアウトを実装します。

_blog-article.html_
```html
//addstart
  <!-- 記事本文 -->
  <main class="bg-white">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <!-- 記事概要 -->
        <div class="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">この記事で学べること</h2>
          <ul class="text-blue-800 space-y-1">
            <li>• Tailwind CSSのcontainerクラスの効果的な使用方法</li>
            <li>• max-widthによる戦略的な幅制御テクニック</li>
            <li>• レスポンシブデザインでの余白設計ベストプラクティス</li>
            <li>• 実際のWebサイトでのコンテナパターン実装</li>
          </ul>
        </div>

        <!-- 目次 -->
        <nav class="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">目次</h2>
          <ol class="space-y-2 text-gray-700">
            <li><a href="#intro" class="hover:text-blue-600">1. コンテナ設計の重要性</a></li>
            <li><a href="#container-basics" class="hover:text-blue-600">2. containerクラスの基本動作</a></li>
            <li><a href="#max-width" class="hover:text-blue-600">3. max-widthによる幅制御</a></li>
            <li><a href="#spacing" class="hover:text-blue-600">4. 効果的な余白設計</a></li>
            <li><a href="#responsive" class="hover:text-blue-600">5. レスポンシブコンテナ戦略</a></li>
            <li><a href="#practice" class="hover:text-blue-600">6. 実践的な実装パターン</a></li>
          </ol>
        </nav>

        <!-- 記事コンテンツ -->
        <article class="prose prose-lg max-w-none">
          <section id="intro" class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">コンテナ設計の重要性</h2>
            <p class="text-gray-700 mb-6 leading-relaxed">
              現代のWebデザインにおいて、コンテナ設計は単なるレイアウトの問題を超えて、ユーザーエクスペリエンスの根幹を支える重要な要素となっています。適切なコンテナ設計により、コンテンツの可読性が向上し、ユーザーの認知負荷が軽減され、最終的に情報の伝達効果が格段に向上します。
            </p>
            <p class="text-gray-700 mb-6 leading-relaxed">
              Tailwind CSSが提供するユーティリティクラスを戦略的に活用することで、従来のCSS設計で必要だった複雑な計算や煩雑な記述を大幅に簡素化できます。この章では、そうした効果的なアプローチの基本概念を確立していきます。
            </p>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-yellow-800 mb-3">💡 重要なポイント</h3>
              <p class="text-yellow-700">
                コンテナ設計は技術的な実装だけでなく、ユーザーの視線の流れや認知心理学に基づいた戦略的なアプローチが必要です。
              </p>
            </div>
          </section>

          <section id="container-basics" class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">containerクラスの基本動作</h2>
            <p class="text-gray-700 mb-6 leading-relaxed">
              Tailwind CSSの<code class="bg-gray-100 px-2 py-1 rounded text-sm">container</code>クラスは、レスポンシブデザインの基盤となる重要なユーティリティです。各ブレークポイントに応じて自動的に最適な最大幅を設定し、コンテンツの中央配置を実現します。
            </p>

            <div class="bg-gray-100 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">コード例：基本的な使用方法</h3>
              <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
&lt;div class="container mx-auto px-4"&gt;
  &lt;!-- コンテンツが中央配置されます --&gt;
&lt;/div&gt;</pre>
            </div>

            <p class="text-gray-700 mb-6 leading-relaxed">
              このシンプルな記述により、画面サイズに関係なく一貫したレイアウトを実現できます。特にチーム開発においては、この一貫性がコードの保守性と品質向上に大きく貢献します。
            </p>
          </section>

          <section id="max-width" class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">max-widthによる幅制御</h2>
            <p class="text-gray-700 mb-6 leading-relaxed">
              <code class="bg-gray-100 px-2 py-1 rounded text-sm">max-width</code>クラスは、より細かな幅制御を可能にし、コンテンツの種類や目的に応じた最適な表示幅を設定できます。特にテキストコンテンツの場合、適切な行長の設定は読みやすさに直接影響します。
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-blue-50 p-6 rounded-lg">
                <h3 class="font-semibold text-blue-900 mb-3">読み物コンテンツ</h3>
                <p class="text-blue-700 text-sm">
                  <code>max-w-2xl</code>または<code>max-w-3xl</code>を使用して、1行45-75文字程度に制限
                </p>
              </div>
              <div class="bg-green-50 p-6 rounded-lg">
                <h3 class="font-semibold text-green-900 mb-3">ダッシュボード</h3>
                <p class="text-green-700 text-sm">
                  <code>max-w-6xl</code>または<code>max-w-7xl</code>で画面の活用度を最大化
                </p>
              </div>
            </div>
          </section>

          <section id="spacing" class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">効果的な余白設計</h2>
            <p class="text-gray-700 mb-6 leading-relaxed">
              余白設計は、情報の階層性を視覚的に表現し、ユーザーの視線を適切に誘導するための重要な手法です。Tailwind CSSのスペーシングシステムを活用することで、一貫性のある美しい余白設計を効率的に実現できます。
            </p>

            <div class="space-y-4 mb-6">
              <div class="border-l-4 border-indigo-400 pl-6">
                <h3 class="font-semibold text-gray-900">垂直方向の余白</h3>
                <p class="text-gray-600 text-sm">セクション間の関係性と重要度を表現</p>
              </div>
              <div class="border-l-4 border-purple-400 pl-6">
                <h3 class="font-semibold text-gray-900">水平方向の余白</h3>
                <p class="text-gray-600 text-sm">読みやすさとビジュアルバランスを調整</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  </main>
//addend
```

4. サイドバーとレイアウト拡張

記事にサイドバーを追加して、より複雑なレイアウト構造を実装します。

_blog-article.html_
```html
//addstart
  <!-- 関連コンテンツエリア -->
  <aside class="bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- メインコンテンツエリア -->
          <div class="lg:col-span-3">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">関連記事</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="aspect-video bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div class="p-6">
                  <h3 class="font-semibold text-gray-900 mb-2">
                    Flexboxレイアウトの実践パターン
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    Tailwind CSSでのFlexboxを使った効果的なレイアウト設計手法を解説します。
                  </p>
                  <div class="flex items-center text-sm text-gray-500">
                    <time>2024年1月10日</time>
                    <span class="mx-2">•</span>
                    <span>6分で読める</span>
                  </div>
                </div>
              </article>

              <article class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="aspect-video bg-gradient-to-r from-purple-400 to-pink-500"></div>
                <div class="p-6">
                  <h3 class="font-semibold text-gray-900 mb-2">
                    レスポンシブデザインのベストプラクティス
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    モバイルファーストアプローチによる効果的なレスポンシブデザイン実装方法。
                  </p>
                  <div class="flex items-center text-sm text-gray-500">
                    <time>2024年1月5日</time>
                    <span class="mx-2">•</span>
                    <span>8分で読める</span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- サイドバー -->
          <div class="lg:col-span-1">
            <div class="sticky top-8 space-y-6">
              <!-- 著者情報 -->
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4">著者について</h3>
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    山
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">山田太郎</p>
                    <p class="text-sm text-gray-500">フロントエンドエンジニア</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-4">
                  Web開発歴10年。特にCSS設計とパフォーマンス最適化を専門としています。
                </p>
                <div class="flex space-x-3">
                  <a href="#" class="text-blue-600 hover:text-blue-700">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" class="text-blue-400 hover:text-blue-500">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                </div>
              </div>

              <!-- 人気記事 -->
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="font-semibold text-gray-900 mb-4">人気記事</h3>
                <div class="space-y-4">
                  <article class="flex">
                    <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex-shrink-0 mr-3"></div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900 mb-1">
                        CSS Gridの完全ガイド
                      </h4>
                      <p class="text-xs text-gray-500">12月28日</p>
                    </div>
                  </article>

                  <article class="flex">
                    <div class="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex-shrink-0 mr-3"></div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900 mb-1">
                        パフォーマンス最適化テクニック
                      </h4>
                      <p class="text-xs text-gray-500">12月25日</p>
                    </div>
                  </article>

                  <article class="flex">
                    <div class="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex-shrink-0 mr-3"></div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900 mb-1">
                        アクセシビリティの基本
                      </h4>
                      <p class="text-xs text-gray-500">12月20日</p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
//addend
```

5. フッターとページ完成

ブログサイト用のフッターを追加してページを完成させます。

_blog-article.html_
```html
//addstart
  <!-- フッター -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Tech Blog</h3>
            <p class="text-gray-300 mb-4">
              最新のWeb技術トレンドと実践的なチュートリアルを提供するテクニカルブログです。
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">カテゴリー</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition duration-200">フロントエンド</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">CSS設計</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">JavaScript</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">パフォーマンス</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">リソース</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition duration-200">チュートリアル</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">コードサンプル</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">ツール紹介</a></li>
              <li><a href="#" class="hover:text-white transition duration-200">書籍レビュー</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">フォローする</h3>
            <div class="flex space-x-4 mb-4">
              <a href="#" class="text-gray-300 hover:text-white transition duration-200">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition duration-200">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                </svg>
              </a>
            </div>
            <p class="text-sm text-gray-400">
              最新記事を見逃さないよう、ぜひフォローしてください！
            </p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Tech Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
//addend
```

6. ブラウザでの動作確認と検証

作成したブログ記事ページをブラウザで開いて、レイアウトと読みやすさを確認します。

_コマンド実行_
```bash
open blog-article.html
```

異なる画面サイズでの表示を確認し、以下の点を検証してください：

- 記事本文の行長が適切で読みやすいか
- サイドバーがモバイルで適切に表示されるか
- 余白とバランスが美しく保たれているか

:::

このブログ記事実装では、読みやすさに特化したコンテナ設計を実践しました：

- **記事本文の最適化**: `max-w-3xl`で読みやすい行長を実現
- **階層的なレイアウト**: ネストしたコンテナで段階的な情報整理
- **サイドバー統合**: `grid`レイアウトでメイン・サブコンテンツの適切な配置
- **スティッキー要素**: サイドバーを`sticky`にして使いやすさを向上

## 🎯 コンテナ設計のベストプラクティス

これまでの実装経験を基に、効果的なコンテナ設計のベストプラクティスをまとめます。これらの原則を守ることで、一貫性があり、保守しやすく、ユーザーフレンドリーなレイアウトを実現できます。

### 一貫性のあるコンテナ戦略

すべてのページで統一されたコンテナ戦略を採用することで、ユーザーの予測可能性を高め、開発効率を向上させることができます。

```html
<!-- 基本コンテナパターン -->
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <!-- 基本的なページコンテンツ -->
</div>

<!-- 読み物コンテンツパターン -->
<div class="container mx-auto px-4">
  <div class="max-w-3xl mx-auto">
    <!-- 記事やブログコンテンツ -->
  </div>
</div>

<!-- ワイドレイアウトパターン -->
<div class="container mx-auto px-4">
  <div class="max-w-6xl mx-auto">
    <!-- ダッシュボードやギャラリー -->
  </div>
</div>
```

### レスポンシブ余白の標準化

デバイスサイズに応じた余白の標準パターンを確立することで、一貫した視覚体験を提供できます。

```html
<!-- セクション間余白の標準パターン -->
<section class="py-12 md:py-16 lg:py-20">
  <!-- メインセクション -->
</section>

<section class="py-8 md:py-12 lg:py-16">
  <!-- サブセクション -->
</section>

<!-- コンテナ内余白の標準パターン -->
<div class="px-4 sm:px-6 md:px-8 lg:px-12">
  <!-- ネストしたコンテンツ -->
</div>
```

### コンテンツタイプ別最適化

コンテンツの種類と目的に応じて、最適なコンテナ幅を選択することが重要です。

:::note コンテンツタイプ別推奨幅

- **記事・ブログ**: `max-w-2xl` または `max-w-3xl` （読みやすさ重視）
- **製品ページ**: `max-w-4xl` または `max-w-5xl` （情報とビジュアルのバランス）
- **ダッシュボード**: `max-w-6xl` または `max-w-7xl` （情報密度の最大化）
- **ランディングページ**: 用途に応じて可変（セクション毎に最適化）

:::

### パフォーマンス考慮事項

適切なコンテナ設計は、パフォーマンスにも影響を与えます。不要な余白やオーバーフローを避けることで、レンダリング効率を向上させることができます。

```html
<!-- 効率的なコンテナ構造 -->
<main class="min-h-screen">
  <section class="container mx-auto px-4 py-16">
    <!-- セクション毎にコンテナを区切る -->
  </section>

  <section class="bg-gray-50">
    <div class="container mx-auto px-4 py-16">
      <!-- 背景が異なる場合は内側にコンテナ -->
    </div>
  </section>
</main>
```

## まとめ

Tailwind CSSでのコンテナと余白設計は、単なるレイアウト技術を超えて、ユーザーエクスペリエンスを向上させる戦略的なアプローチです。適切な幅制御と余白設計により、コンテンツの可読性が向上し、視覚的な階層が明確になり、最終的にユーザーの満足度向上につながります。

:::note 要点のまとめ

- `container`クラスとカスタマイズによる一貫したレイアウト基盤の構築
- `max-width`を活用したコンテンツタイプ別の最適な幅制御
- レスポンシブデザインでの効果的な余白管理とブレークポイント戦略
- 実際のWebサイトパターンでの実践的なコンテナ設計手法
- パフォーマンスと保守性を考慮したベストプラクティスの確立

:::

学習した技術を活用して、次は複雑なレイアウトパターンの実装に挑戦しましょう。Flexboxの高度なパターンやGridレイアウトの設計方法を学習することで、さらに洗練されたWebサイトを構築できるようになります。

[Flexbox設計パターン](./flex-patterns.md)

## 関連リンク

- [レイアウト＆デザイン](./layout-design.md)
- [Flexbox設計パターン](./flex-patterns.md)
- [Gridレイアウト設計](./grid-patterns.md)
- [コンテナクエリの使い所](./container-queries.md)

## さらに深く学習したい方へ

このコンテナ設計技術をより深く理解し、実際のプロジェクトで効果的に活用したい方は、実践的なワークショップやコードレビューを通じて、個別指導を受けることをお勧めします。理論だけでなく、実際の開発現場で求められるデザインシステムの構築方法や、チーム開発での標準化手法を体系的に習得できます。