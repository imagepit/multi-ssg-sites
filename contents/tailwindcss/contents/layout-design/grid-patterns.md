---
title: Gridレイアウト設計
slug: grid-patterns
parent: layout-design
file_path: layout-design/grid-patterns
target_user: Tailwind CSS基礎を習得した中級開発者、複雑なレイアウト設計を学びたいWebデザイナー
goal: "CSS Gridの高度な設計パターンを習得し、実際のWebサイトで使用する複雑な2次元レイアウト構造を効率的に実装できるようになる"
status: published
post_type: pages
seo_title: Tailwind CSS Grid設計パターン完全ガイド - 2次元レイアウト実践技法
seo_keywords: "TailwindCSS,Grid,レイアウト,グリッドシステム,2次元,ダッシュボード,ギャラリー,複雑なレイアウト"
seo_description: "Tailwind CSSでCSS Gridの高度な設計パターンを習得。ダッシュボード、ギャラリー、ブログレイアウトなど、実際のWebサイトで使用される複雑な2次元レイアウト構造を体系的に学習できます。"
handson_overview: "管理ダッシュボード、イメージギャラリー、ブログレイアウトを段階的に構築しながら、CSS Gridの高度な設計パターンと実装技法を実践的に習得できます"
---

# 📐 Gridレイアウト設計

レベル1でCSS Gridの基礎概念を学んだあなたは、`grid`、`grid-cols-*`、`col-span-*`といった基本的なクラスを使ってシンプルなグリッドレイアウトを実装できるようになりました。このページでは、その知識を発展させて、実際のWebサイトで使用される**高度なGrid設計パターン**を習得します。

現代のWebサイト開発では、単純な格子状の配置だけでなく、複雑なダッシュボード構造、動的なギャラリーレイアウト、不規則な配置パターンなど、洗練された2次元レイアウトシステムが求められます。このページでは、そうした実践的なパターンを体系的に学習し、実際に手を動かして実装していきます。

## このページで学べる事

CSS Gridの基礎知識を活用して、実際のWebプロジェクトで使用される高度な2次元レイアウトパターンを習得できます。理論だけでなく、実際にコンポーネントを構築しながら実践的なスキルを身につけることができます。

:::note 学習内容

- 実用的なCSS Grid設計パターンの理解と実装
- ダッシュボードレイアウトの効果的な構築方法
- ギャラリーとマソニーレイアウトの実装技法
- ブログとメディアサイトの構造設計
- FlexboxとGridの使い分けと組み合わせ方法
- レスポンシブ対応したGridレイアウトの実装
- パフォーマンスとメンテナンス性を考慮した設計アプローチ

:::

## 🏗️ Grid設計の基本原則

Grid設計パターンを効果的に活用するためには、単にクラスを覚えるだけでなく、**2次元レイアウトの設計原則**を理解することが重要です。優れたGridレイアウトは、構造の明確性、柔軟性、視覚的階層のバランスを保ちながら実装されています。

### 2次元レイアウトの設計原則

**構造の明確性**: グリッドの行と列の関係が明確で、各エリアの役割が分かりやすい構造を作ります。**視覚的階層**: コンテンツの重要度に応じて、適切なサイズ配分と配置を行います。**柔軟性**: コンテンツの増減や画面サイズの変化に対応できる伸縮性のある構造を維持します。

:::note CSS Gridレイアウトの設計原則

- **グリッドエリアの論理的定義**: 明名されたグリッドエリアによる直感的な構造設計
- **行と列のサイジング戦略**: `fr`単位、`minmax()`、`auto`の適切な使い分け
- **グリッドアイテムの配置制御**: `grid-area`、`col-span`、`row-span`の戦略的活用
- **レスポンシブグリッドの段階的実装**: モバイルファーストアプローチでの設計

:::

### FlexboxとGridの使い分け

CSS GridとFlexboxは補完的な関係にあります。**Flexboxは1次元レイアウト**（一方向の配置）に適しており、**Gridは2次元レイアウト**（行と列の両方向）に最適です。

:::syntax FlexboxとGridの使い分け指針

```html
<!-- Flexbox: 1次元レイアウト（ナビゲーション、ボタングループ） -->
<nav class="flex justify-between items-center">
  <div>Logo</div>
  <div class="flex space-x-4">Menu Items</div>
</nav>

<!-- Grid: 2次元レイアウト（ページ全体、カードレイアウト） -->
<div class="grid grid-cols-12 gap-6">
  <header class="col-span-12">Header</header>
  <aside class="col-span-3">Sidebar</aside>
  <main class="col-span-9">Content</main>
</div>
```

適切な使い分けにより、レイアウトの意図が明確になり、メンテナンス性も向上します。

:::

## 🖥️ ダッシュボードレイアウトパターン

ダッシュボードは、複数の情報を効率的に配置する代表的なGridレイアウトの応用例です。ヘッダー、サイドバー、メインコンテンツ、各種ウィジェットを論理的に配置する方法を学習します。

### 基本的なダッシュボード構造

典型的なダッシュボードは、**ヘッダー**、**サイドバー**、**メインエリア**の3つの主要領域で構成されます。CSS Gridの`grid-template-areas`を活用することで、直感的で保守しやすい構造を実現できます。

:::syntax 基本的なダッシュボード構造

```html
<div class="min-h-screen grid grid-cols-[250px_1fr] grid-rows-[60px_1fr] gap-0">
  <!-- ヘッダー -->
  <header class="col-span-2 bg-white border-b border-gray-200 flex items-center px-6">
    <h1 class="text-xl font-semibold">Dashboard</h1>
    <div class="ml-auto flex items-center space-x-4">
      <button class="p-2 rounded-full hover:bg-gray-100">
        <svg class="w-5 h-5"><!-- notification icon --></svg>
      </button>
      <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
    </div>
  </header>

  <!-- サイドバー -->
  <aside class="bg-gray-50 border-r border-gray-200 p-4">
    <nav class="space-y-2">
      <a href="#" class="block px-3 py-2 rounded-md bg-blue-50 text-blue-700">
        Dashboard
      </a>
      <a href="#" class="block px-3 py-2 rounded-md hover:bg-gray-100">
        Analytics
      </a>
      <a href="#" class="block px-3 py-2 rounded-md hover:bg-gray-100">
        Reports
      </a>
    </nav>
  </aside>

  <!-- メインコンテンツ -->
  <main class="p-6 overflow-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- ウィジェット群 -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-medium mb-4">Total Users</h3>
        <p class="text-3xl font-bold text-blue-600">2,847</p>
      </div>
      <!-- さらなるウィジェット -->
    </div>
  </main>
</div>
```

この構造では、`grid-cols-[250px_1fr]`でサイドバーの固定幅と可変メインエリア、`grid-rows-[60px_1fr]`でヘッダーの固定高さを定義しています。

:::

### レスポンシブダッシュボードの実装

モバイルデバイスでは、サイドバーをハンバーガーメニューに変更し、ウィジェットを単列配置にする必要があります。Tailwindのレスポンシブバリアントを活用して段階的にレイアウトを調整します。

### ダッシュボードレイアウトを作ってみよう

実際に管理ダッシュボードのレイアウトを構築して、Grid設計パターンの理解を深めましょう。

:::step

1. HTMLファイルの作成

`dashboard-layout.html`を作成して基本構造を構築します。

_dashboard-layout.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Layout</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen grid lg:grid-cols-[250px_1fr] grid-rows-[60px_1fr]">
    <!-- ヘッダー -->
    <header class="lg:col-span-2 bg-white border-b border-gray-200 flex items-center px-6 relative z-10">
      <button class="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <h1 class="text-xl font-semibold text-gray-800">Analytics Dashboard</h1>
      <div class="ml-auto flex items-center space-x-4">
        <button class="p-2 rounded-full hover:bg-gray-100 relative">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5 5-5h-5m-10 5l5 5-5 5"/>
          </svg>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          JD
        </div>
      </div>
    </header>

    <!-- サイドバー -->
    <aside class="hidden lg:block bg-white border-r border-gray-200 overflow-y-auto">
      <div class="p-4">
        <nav class="space-y-1">
          <a href="#" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700">
            <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            </svg>
            Dashboard
          </a>
          <a href="#" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
            <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"/>
            </svg>
            Analytics
          </a>
          <a href="#" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
            <svg class="mr-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293z"/>
            </svg>
            Reports
          </a>
        </nav>
      </div>
    </aside>

    <!-- メインコンテンツ -->
    <main class="p-6 overflow-auto">
      <!-- 統計カード -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-3xl font-bold text-gray-900">2,847</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 font-medium">+12%</span>
            <span class="text-gray-600 ml-2">from last month</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Revenue</p>
              <p class="text-3xl font-bold text-gray-900">$54,239</p>
            </div>
            <div class="p-3 bg-green-50 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 font-medium">+8%</span>
            <span class="text-gray-600 ml-2">from last month</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Orders</p>
              <p class="text-3xl font-bold text-gray-900">1,423</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-red-600 font-medium">-2%</span>
            <span class="text-gray-600 ml-2">from last month</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Conversion</p>
              <p class="text-3xl font-bold text-gray-900">3.2%</p>
            </div>
            <div class="p-3 bg-purple-50 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 font-medium">+5%</span>
            <span class="text-gray-600 ml-2">from last month</span>
          </div>
        </div>
      </div>

      <!-- チャートとテーブル -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- チャートエリア -->
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Traffic Overview</h3>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p class="text-gray-500">Chart placeholder</p>
          </div>
        </div>

        <!-- 最近のアクティビティ -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 font-medium">New user registered</p>
                <p class="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 font-medium">Order completed</p>
                <p class="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 font-medium">Payment pending</p>
                <p class="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

2. ブラウザでの動作確認

作成したHTMLファイルをブラウザで開き、レスポンシブなダッシュボードレイアウトを確認します。

- デスクトップ：サイドバーとメインエリアが並んで表示
- モバイル：サイドバーが非表示でメインエリアが全幅表示

3. ウィジェットの追加カスタマイズ

既存のコードに、より複雑なウィジェットを追加してGridレイアウトの応用を確認します。

_dashboard-layout.html（メインコンテンツ下部に追加）_
```html
//addstart
<!-- データテーブル -->
<div class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12345</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$299.00</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>
          </td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12346</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$149.00</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
//addend
```

:::

このハンズオンを通じて、実際のダッシュボードレイアウトの構築方法と、Grid設計パターンの実用的な活用方法を体験できました。レスポンシブ対応や複雑なウィジェット配置の実装により、実際のプロジェクトで使用できるスキルを習得しています。

## 🖼️ ギャラリー＆マソニーレイアウト

画像ギャラリーやポートフォリオサイトでは、異なるサイズのコンテンツを美しく配置するマソニーレイアウトが効果的です。CSS Gridを活用することで、Pinterestのような動的で魅力的なレイアウトを実現できます。

### マソニーレイアウトの実装原理

マソニーレイアウトは、**可変高さのアイテム**を効率的に配置するレイアウト手法です。従来はJavaScriptライブラリが必要でしたが、CSS Gridの`grid-auto-rows`と`grid-row`の組み合わせにより、CSS Gridだけで実装できます。

:::syntax 基本的なマソニーレイアウト構造

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[10px]">
  <div class="row-span-[20] bg-white rounded-lg shadow-sm overflow-hidden">
    <img src="image1.jpg" alt="" class="w-full h-48 object-cover">
    <div class="p-4">
      <h3 class="font-medium">Short content</h3>
    </div>
  </div>

  <div class="row-span-[35] bg-white rounded-lg shadow-sm overflow-hidden">
    <img src="image2.jpg" alt="" class="w-full h-64 object-cover">
    <div class="p-4">
      <h3 class="font-medium">Medium content</h3>
      <p class="text-gray-600 text-sm mt-2">Additional description text that makes this card taller than others.</p>
    </div>
  </div>

  <div class="row-span-[25] bg-white rounded-lg shadow-sm overflow-hidden">
    <img src="image3.jpg" alt="" class="w-full h-56 object-cover">
    <div class="p-4">
      <h3 class="font-medium">Another item</h3>
    </div>
  </div>
</div>
```

`auto-rows-[10px]`で細かい行高を設定し、各アイテムに`row-span-[n]`でスパンする行数を指定することで、柔軟な高さ調整を実現します。

:::

### レスポンシブギャラリーの設計

ギャラリーレイアウトでは、画面サイズに応じて列数を調整し、画像の読み込みパフォーマンスも考慮する必要があります。`grid-cols-*`のレスポンシブバリアントを活用して段階的にレイアウトを調整します。

### フォトギャラリーを作ってみよう

実際に動的なフォトギャラリーを構築して、マソニーレイアウトの実装方法を理解しましょう。

:::step

1. ギャラリーHTMLファイルの作成

`photo-gallery.html`を作成してマソニーレイアウトを実装します。

_photo-gallery.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Photo Gallery</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="container mx-auto px-4 py-8">
    <!-- ヘッダー -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Discover a curated collection of stunning photography from around the world
      </p>
    </div>

    <!-- フィルターナビゲーション -->
    <div class="flex flex-wrap justify-center gap-4 mb-8">
      <button class="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">All</button>
      <button class="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100">Nature</button>
      <button class="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100">Architecture</button>
      <button class="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100">People</button>
      <button class="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100">Travel</button>
    </div>

    <!-- マソニーギャラリー -->
    <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      <!-- Gallery Item 1 -->
      <div class="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div class="relative overflow-hidden">
          <img src="https://picsum.photos/400/600?random=1" alt="Nature landscape" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-2">Mountain Landscape</h3>
          <p class="text-gray-600 text-sm">Beautiful mountain scenery captured during sunset</p>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-500">John Doe</span>
            </div>
            <button class="text-red-500 hover:text-red-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Item 2 -->
      <div class="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div class="relative overflow-hidden">
          <img src="https://picsum.photos/400/400?random=2" alt="Architecture" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-2">Modern Architecture</h3>
          <p class="text-gray-600 text-sm">Geometric patterns in contemporary design</p>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-500">Jane Smith</span>
            </div>
            <button class="text-gray-400 hover:text-red-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Item 3 -->
      <div class="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div class="relative overflow-hidden">
          <img src="https://picsum.photos/400/800?random=3" alt="Portrait" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-2">Street Portrait</h3>
          <p class="text-gray-600 text-sm">Candid moment captured in urban environment. This photo tells a story of everyday life in the city, showcasing the human element in an urban landscape.</p>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-purple-500 rounded-full"></div>
              <span class="text-sm text-gray-500">Mike Johnson</span>
            </div>
            <button class="text-gray-400 hover:text-red-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Item 4 -->
      <div class="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div class="relative overflow-hidden">
          <img src="https://picsum.photos/400/500?random=4" alt="Travel" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-2">Travel Adventure</h3>
          <p class="text-gray-600 text-sm">Exploring remote destinations around the globe</p>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-gray-500">Sarah Wilson</span>
            </div>
            <button class="text-red-500 hover:text-red-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Item 5 -->
      <div class="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div class="relative overflow-hidden">
          <img src="https://picsum.photos/400/300?random=5" alt="Nature" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-2">Ocean Waves</h3>
          <p class="text-gray-600 text-sm">Peaceful coastal scene</p>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-500">Alex Chen</span>
            </div>
            <button class="text-gray-400 hover:text-red-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Item 6 -->
      <div class="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div class="relative overflow-hidden">
          <img src="https://picsum.photos/400/700?random=6" alt="Architecture" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-2">City Skyline</h3>
          <p class="text-gray-600 text-sm">Urban landscape during the golden hour. The interplay of light and shadow creates a dramatic effect across the cityscape, highlighting the architectural diversity of modern metropolitan areas.</p>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-500">David Lee</span>
            </div>
            <button class="text-gray-400 hover:text-red-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ロードモアボタン -->
    <div class="text-center mt-8">
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Load More Photos
      </button>
    </div>
  </div>
</body>
</html>
```

2. ブラウザでの動作確認

作成したHTMLファイルをブラウザで開き、マソニーレイアウトの動作を確認します。

- デスクトップ：4列のマソニーレイアウト
- タブレット：3列レイアウト
- モバイル：1列レイアウト

3. インタラクティブ機能の追加

JavaScriptを追加してフィルター機能を実装します。

_photo-gallery.html（bodyタグ閉じタグ前に追加）_
```html
//addstart
<script>
  // フィルター機能
  const filterButtons = document.querySelectorAll('button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // アクティブボタンの更新
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
      });
      button.classList.remove('bg-white', 'text-gray-700');
      button.classList.add('bg-blue-600', 'text-white');
    });
  });

  // 画像の遅延読み込み
  const images = document.querySelectorAll('img');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('animate-pulse');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
</script>
//addend
```

:::

このハンズオンを通じて、CSSのcolumnsプロパティを活用したマソニーレイアウトの実装方法を学習しました。Gridとは異なるアプローチですが、可変高さのコンテンツを美しく配置する効果的な手法です。

## 📝 ブログ＆メディアレイアウト

ブログやニュースサイトでは、記事の読みやすさとナビゲーションの使いやすさを両立させる必要があります。CSS Gridを活用することで、コンテンツの階層を明確にしつつ、関連情報を効果的に配置できます。

### 記事ページの構造設計

典型的なブログ記事ページは、**ヘッダー**、**メインコンテンツ**、**サイドバー**、**フッター**の4つの領域で構成されます。読みやすさを重視したタイポグラフィとの調和も重要な要素です。

:::syntax ブログレイアウトの基本構造

```html
<div class="min-h-screen grid grid-rows-[auto_1fr_auto] max-w-7xl mx-auto">
  <!-- ヘッダー -->
  <header class="border-b border-gray-200 px-4 py-6">
    <nav class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Tech Blog</h1>
      <div class="hidden md:flex space-x-6">
        <a href="#" class="text-gray-700 hover:text-blue-600">Articles</a>
        <a href="#" class="text-gray-700 hover:text-blue-600">Categories</a>
        <a href="#" class="text-gray-700 hover:text-blue-600">About</a>
      </div>
    </nav>
  </header>

  <!-- メインコンテンツエリア -->
  <main class="grid lg:grid-cols-[1fr_300px] gap-8 px-4 py-8">
    <!-- 記事コンテンツ -->
    <article class="prose prose-lg max-w-none">
      <header class="mb-8">
        <h1>Understanding CSS Grid Layout Patterns</h1>
        <div class="text-gray-600 text-sm mt-4">
          <time datetime="2024-01-15">January 15, 2024</time>
          <span class="mx-2">•</span>
          <span>8 min read</span>
        </div>
      </header>

      <div class="prose-content">
        <!-- 記事本文 -->
      </div>
    </article>

    <!-- サイドバー -->
    <aside class="space-y-6">
      <!-- 関連記事 -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="font-semibold mb-4">Related Articles</h3>
        <div class="space-y-3">
          <!-- 関連記事リスト -->
        </div>
      </div>
    </aside>
  </main>

  <!-- フッター -->
  <footer class="border-t border-gray-200 px-4 py-6 text-center text-gray-600">
    <p>&copy; 2024 Tech Blog. All rights reserved.</p>
  </footer>
</div>
```

この構造では、`grid-rows-[auto_1fr_auto]`でヘッダーとフッターを固定高さ、メインエリアを可変高さに設定し、`lg:grid-cols-[1fr_300px]`で記事エリアとサイドバーの幅比を適切に調整しています。

:::

### 記事一覧とカテゴリ表示

ブログトップページでは、記事の一覧表示とカテゴリ別の整理が重要です。カードレイアウトとGridを組み合わせて、視覚的に魅力的で機能的な一覧を実現します。

### ブログレイアウトを作ってみよう

実際にレスポンシブなブログサイトを構築して、メディアレイアウトの実装方法を体験しましょう。

:::step

1. ブログHTMLファイルの作成

`blog-layout.html`を作成してブログレイアウトを実装します。

_blog-layout.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Blog</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          typography: {
            DEFAULT: {
              css: {
                maxWidth: 'none',
              }
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50">
  <!-- ヘッダー -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <nav class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">TechBlog</h1>
          <span class="text-blue-600 text-sm font-medium">by Developers</span>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">Latest</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">JavaScript</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">CSS</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">React</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">About</a>
        </div>

        <div class="flex items-center space-x-4">
          <button class="hidden md:block px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          <button class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- ヒーローセクション -->
    <section class="mb-12">
      <div class="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Latest insights from the world of
            <span class="text-blue-600">modern development</span>
          </h2>
          <p class="text-xl text-gray-600 mb-6">
            Stay updated with the latest trends, best practices, and tutorials from experienced developers.
          </p>
          <button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Explore Articles
          </button>
        </div>
        <div class="hidden lg:block">
          <img src="https://picsum.photos/600/400?random=10" alt="Featured content" class="w-full h-auto rounded-lg shadow-sm">
        </div>
      </div>
    </section>

    <!-- メインコンテンツ -->
    <div class="grid lg:grid-cols-[1fr_300px] gap-8">
      <!-- 記事一覧 -->
      <main>
        <!-- フィーチャー記事 -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
          <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="grid md:grid-cols-2 gap-0">
              <div class="aspect-video md:aspect-auto">
                <img src="https://picsum.photos/800/400?random=11" alt="Featured article" class="w-full h-full object-cover">
              </div>
              <div class="p-6 flex flex-col justify-between">
                <div>
                  <div class="flex items-center space-x-2 mb-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">CSS</span>
                    <span class="text-gray-500 text-sm">5 min read</span>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    Advanced CSS Grid Techniques for Modern Web Design
                  </h3>
                  <p class="text-gray-600 mb-4">
                    Explore cutting-edge CSS Grid patterns that will transform your layout design process and create more maintainable, responsive websites.
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Sarah Johnson</p>
                      <p class="text-xs text-gray-500">January 15, 2024</p>
                    </div>
                  </div>
                  <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- 最新記事 -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          <div class="grid gap-6">
            <!-- Article 1 -->
            <article class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <img src="https://picsum.photos/200/120?random=12" alt="Article thumbnail" class="w-32 h-20 object-cover rounded-lg flex-shrink-0">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">JavaScript</span>
                    <span class="text-gray-500 text-sm">3 min read</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    Understanding Modern JavaScript Promises and Async/Await
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    Master asynchronous JavaScript with practical examples and best practices for handling complex async operations.
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 bg-green-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Mike Chen</span>
                      <span class="text-gray-400 text-xs">•</span>
                      <span class="text-gray-500 text-xs">Jan 12, 2024</span>
                    </div>
                    <button class="text-blue-600 hover:text-blue-700 text-sm">Read →</button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Article 2 -->
            <article class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <img src="https://picsum.photos/200/120?random=13" alt="Article thumbnail" class="w-32 h-20 object-cover rounded-lg flex-shrink-0">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">React</span>
                    <span class="text-gray-500 text-sm">7 min read</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    Building Scalable React Applications with Custom Hooks
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    Learn how to create reusable custom hooks that improve code organization and component reusability in large React projects.
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 bg-purple-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Emma Davis</span>
                      <span class="text-gray-400 text-xs">•</span>
                      <span class="text-gray-500 text-xs">Jan 10, 2024</span>
                    </div>
                    <button class="text-blue-600 hover:text-blue-700 text-sm">Read →</button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Article 3 -->
            <article class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <img src="https://picsum.photos/200/120?random=14" alt="Article thumbnail" class="w-32 h-20 object-cover rounded-lg flex-shrink-0">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Performance</span>
                    <span class="text-gray-500 text-sm">6 min read</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    Web Performance Optimization: Core Web Vitals Guide
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">
                    Comprehensive guide to improving your website's Core Web Vitals scores with practical optimization techniques.
                  </p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 bg-yellow-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Alex Rivera</span>
                      <span class="text-gray-400 text-xs">•</span>
                      <span class="text-gray-500 text-xs">Jan 8, 2024</span>
                    </div>
                    <button class="text-blue-600 hover:text-blue-700 text-sm">Read →</button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Load More Button -->
          <div class="text-center mt-8">
            <button class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
              Load More Articles
            </button>
          </div>
        </section>
      </main>

      <!-- サイドバー -->
      <aside class="space-y-6">
        <!-- ニュースレター購読 -->
        <div class="bg-blue-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
          <p class="text-gray-600 text-sm mb-4">Get the latest articles delivered directly to your inbox.</p>
          <div class="space-y-3">
            <input type="email" placeholder="Enter your email" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>

        <!-- 人気記事 -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
          <div class="space-y-4">
            <article class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
              <div>
                <h4 class="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                  Complete Guide to CSS Flexbox Layout
                </h4>
                <p class="text-xs text-gray-500 mt-1">2.1k views</p>
              </div>
            </article>

            <article class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
              <div>
                <h4 class="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                  JavaScript ES6+ Features Every Developer Should Know
                </h4>
                <p class="text-xs text-gray-500 mt-1">1.8k views</p>
              </div>
            </article>

            <article class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
              <div>
                <h4 class="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                  Building Responsive Web Apps with Tailwind CSS
                </h4>
                <p class="text-xs text-gray-500 mt-1">1.5k views</p>
              </div>
            </article>
          </div>
        </div>

        <!-- カテゴリ -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div class="space-y-2">
            <a href="#" class="flex justify-between items-center text-gray-700 hover:text-blue-600 py-1">
              <span>JavaScript</span>
              <span class="text-xs text-gray-500">24</span>
            </a>
            <a href="#" class="flex justify-between items-center text-gray-700 hover:text-blue-600 py-1">
              <span>CSS</span>
              <span class="text-xs text-gray-500">18</span>
            </a>
            <a href="#" class="flex justify-between items-center text-gray-700 hover:text-blue-600 py-1">
              <span>React</span>
              <span class="text-xs text-gray-500">15</span>
            </a>
            <a href="#" class="flex justify-between items-center text-gray-700 hover:text-blue-600 py-1">
              <span>Performance</span>
              <span class="text-xs text-gray-500">12</span>
            </a>
            <a href="#" class="flex justify-between items-center text-gray-700 hover:text-blue-600 py-1">
              <span>Tools</span>
              <span class="text-xs text-gray-500">9</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- フッター -->
  <footer class="bg-white border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">TechBlog</h3>
          <p class="text-gray-600 text-sm mb-4">
            A community-driven platform for sharing knowledge, best practices, and insights about modern web development.
          </p>
          <div class="flex space-x-4">
            <button class="text-gray-400 hover:text-blue-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button class="text-gray-400 hover:text-blue-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <h4 class="font-medium text-gray-900 mb-4">Content</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-blue-600">Latest Articles</a></li>
            <li><a href="#" class="hover:text-blue-600">Popular Posts</a></li>
            <li><a href="#" class="hover:text-blue-600">Categories</a></li>
            <li><a href="#" class="hover:text-blue-600">Archive</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-gray-900 mb-4">Community</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-blue-600">About Us</a></li>
            <li><a href="#" class="hover:text-blue-600">Write for Us</a></li>
            <li><a href="#" class="hover:text-blue-600">Contact</a></li>
            <li><a href="#" class="hover:text-blue-600">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
        <p>&copy; 2024 TechBlog. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>
```

2. ブラウザでの動作確認

作成したHTMLファイルをブラウザで開き、ブログレイアウトの動作を確認します。

- ヘッダーのsticky機能
- フィーチャー記事の2列レイアウト
- サイドバーの固定幅とメインエリアの可変幅
- レスポンシブ対応

3. 記事詳細ページの実装

個別記事ページの構造を追加で実装します。

_article-detail.html_
```html
<!-- 省略：同じヘッダー構造 -->

<main class="max-w-4xl mx-auto px-4 py-8">
  <article class="bg-white rounded-lg shadow-sm overflow-hidden">
    <!-- 記事ヘッダー -->
    <div class="p-8 border-b border-gray-200">
      <div class="flex items-center space-x-2 mb-4">
        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">CSS</span>
        <span class="text-gray-500 text-sm">8 min read</span>
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Advanced CSS Grid Techniques for Modern Web Design
      </h1>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="https://picsum.photos/60/60?random=author" alt="Author" class="w-12 h-12 rounded-full">
          <div>
            <p class="font-medium text-gray-900">Sarah Johnson</p>
            <p class="text-gray-500 text-sm">Senior Frontend Developer</p>
          </div>
        </div>
        <time class="text-gray-500 text-sm">January 15, 2024</time>
      </div>
    </div>

    <!-- 記事コンテンツ -->
    <div class="p-8 prose prose-lg max-w-none">
      <p>CSS Grid has revolutionized the way we think about web layout design...</p>
      <!-- 記事本文 -->
    </div>
  </article>

  <!-- 関連記事 -->
  <section class="mt-12">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
    <div class="grid md:grid-cols-3 gap-6">
      <!-- 関連記事カード -->
    </div>
  </section>
</main>
```

:::

このハンズオンを通じて、ブログやメディアサイトで使用される実践的なGridレイアウトパターンを習得できました。記事の読みやすさとナビゲーションの使いやすさを両立させる設計手法を体験しています。

## 🔄 FlexboxとGridの組み合わせ技法

実際のWebサイト開発では、FlexboxとGridを適材適所で使い分け、組み合わせることで、より柔軟で保守しやすいレイアウトを実現できます。それぞれの特性を理解し、効果的に組み合わせる方法を学習します。

### 使い分けの基本原則

**Flexbox**は1次元レイアウト（一方向の配置）に適しており、**Grid**は2次元レイアウト（行と列の両方向）に最適です。この特性を理解して適切に使い分けることで、コードの意図が明確になり、メンテナンス性も向上します。

:::note FlexboxとGridの使い分けガイドライン

**Flexboxを使用する場面:**
- ナビゲーションメニューの配置
- ボタングループの水平/垂直配置
- アイテム間の余白調整
- センタリングやアライメント

**Gridを使用する場面:**
- ページ全体のレイアウト構造
- カードレイアウトやギャラリー
- 複雑なダッシュボード構造
- 不規則なサイズのアイテム配置

:::

### 組み合わせパターンの実装

実際のコンポーネントでは、Gridで大枠の構造を定義し、Grid内の各エリアでFlexboxを使用してアイテムの配置を調整するパターンが効果的です。

:::syntax 組み合わせパターンの実装例

```html
<!-- Grid: 全体構造の定義 -->
<div class="grid grid-cols-[250px_1fr] grid-rows-[60px_1fr] min-h-screen">
  <!-- Flexbox: ヘッダー内のアイテム配置 -->
  <header class="col-span-2 flex justify-between items-center px-6 bg-white border-b">
    <h1 class="text-xl font-semibold">Dashboard</h1>
    <!-- Flexbox: ユーザー情報の配置 -->
    <div class="flex items-center space-x-4">
      <button class="p-2 rounded-full hover:bg-gray-100">
        <svg class="w-5 h-5"><!-- icon --></svg>
      </button>
      <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
    </div>
  </header>

  <!-- Flexbox: サイドバー内のナビゲーション -->
  <aside class="bg-gray-50 border-r">
    <nav class="p-4 space-y-2">
      <!-- Flexbox: 各メニューアイテムの配置 -->
      <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100">
        <svg class="w-5 h-5"><!-- icon --></svg>
        <span>Dashboard</span>
      </a>
    </nav>
  </aside>

  <!-- Grid: メインコンテンツ内のウィジェット配置 -->
  <main class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Flexbox: 各ウィジェット内のレイアウト -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium">Total Users</h3>
          <svg class="w-5 h-5 text-gray-400"><!-- icon --></svg>
        </div>
        <div class="flex items-end space-x-2">
          <span class="text-3xl font-bold text-blue-600">2,847</span>
          <span class="text-green-600 text-sm">+12%</span>
        </div>
      </div>
    </div>
  </main>
</div>
```

この例では、Gridで全体構造を定義し、各エリア内でFlexboxを使用してアイテムの配置を調整しています。

:::

## まとめ

CSS Gridレイアウト設計では、2次元の構造設計力とFlexboxとの使い分けが重要な要素となります。実際のWebプロジェクトで使用される複雑なレイアウトパターンを通じて、実践的なスキルを習得できました。

:::note 要点のまとめ

- **Grid設計の基本原則**: 構造の明確性、視覚的階層、柔軟性のバランス
- **ダッシュボードレイアウト**: 複雑な管理画面の効率的な構造設計
- **ギャラリー＆マソニーレイアウト**: 可変高さコンテンツの美しい配置手法
- **ブログ＆メディアレイアウト**: 読みやすさと機能性を両立させる構造設計
- **FlexboxとGridの組み合わせ**: 適材適所での使い分けと効果的な組み合わせ技法

:::

次に学習するのは、これらのレイアウト技術を活用した実際のコンポーネント設計です。Grid設計パターンの知識を土台として、より実践的なUI実装に進んでいきます。

[アニメーション/トランジション](./animations-transitions.md)

## 関連リンク

- [Flexbox設計パターン](./flex-patterns.md)
- [コンテナ/幅・余白の設計](./container-width-spacing.md)
- [レイアウト＆デザイン](./layout-design.md)
- [Tailwind基礎](../tailwind-basics/tailwind-basics.md)

## さらに深く学習したい方へ

CSS Gridの高度な設計パターンをより深く理解し、実際のプロジェクトで活用したい方は、実践的なワークショップやメンタリングを通じて、個別指導を受けることをお勧めします。複雑なレイアウト要件に対応できる設計力と実装力を体系的に習得できます。