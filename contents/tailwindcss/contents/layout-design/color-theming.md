---
title: 配色とテーマ設計（色相/明度/コントラスト）
slug: color-theming
parent: layout-design
file_path: layout-design/color-theming
target_user: "Web制作を学び始めて1-2年のフロントエンドエンジニア、デザインシステムの構築を始めたいエンジニア"
goal: "Tailwind CSSでの配色設計の基本原則を理解し、アクセシビリティを考慮したカラーパレットとテーマシステムを実装できるようになる"
status: published
post_type: pages
seo_title: "Tailwind CSS配色とテーマ設計 | 色相・明度・コントラストの完全ガイド"
seo_keywords: "Tailwind CSS, 配色設計, カラーパレット, テーマ設計, コントラスト比, アクセシビリティ, ダークモード, カラーシステム"
seo_description: "Tailwind CSSでの配色設計とテーマシステムの実装方法を学習。色相・明度・コントラスト比を考慮したカラーパレットの作成から、ダークモード対応まで実践的に解説します。"
handson_overview: "実際のWebサイトでカラーパレット設計からダークモード対応まで、段階的にテーマシステムを構築するハンズオン"
---

## はじめに

Webサイトの配色は、ユーザーエクスペリエンスとブランドアイデンティティを決定する重要な要素です。適切な配色設計により、サイトの可読性が向上し、ユーザーの操作性も大幅に改善されます。しかし、色の組み合わせや明度調整、アクセシビリティ要件への対応など、考慮すべき要素は多岐にわたります。

Tailwind CSSは、体系的なカラーシステムとカスタマイズ可能なテーマ機能を提供し、これらの課題を効率的に解決します。事前定義されたカラーパレットから自由度の高いカスタムカラーまで、プロジェクトの要件に応じて柔軟に配色を設計できます。

### このページで学べる事

このページでは、Tailwind CSSを使った配色とテーマ設計の実践的な手法を学習します。

:::note 学習内容

- Tailwind CSSのカラーシステムの理解と活用方法
- 色相・明度・彩度を考慮したカラーパレット設計
- WCAG準拠のコントラスト比設定とアクセシビリティ対応
- ブランドカラーとセマンティックカラーの効果的な分離
- ダークモードとライトモードの実装戦略
- CSS変数を活用した動的テーマシステムの構築

:::

## 🎨 Tailwind CSSのカラーシステム

Tailwind CSSは、デザインシステムに基づいた包括的なカラーパレットを提供します。各色は50から950までの数値で明度が分類され、一貫性のある配色設計を実現できます。

### デフォルトカラーパレットの理解

Tailwind CSSのデフォルトカラーパレットは、グレースケールから鮮やかな色調まで、幅広い用途に対応します。各色は10段階の明度レベルに分かれており、50が最も明るく、950が最も暗い色調です。

:::note カラーパレットの構成

- **グレースケール**: slate, gray, zinc, neutral, stone
- **基本色**: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
- **明度レベル**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

:::

各色の500レベルは、その色の代表的な明度として設計されており、ブランドカラーの基準点として活用できます。400と600レベルは、ホバー状態やアクティブ状態の表現に最適です。

### カラークラスの適用パターン

Tailwind CSSでは、要素の用途に応じて異なるカラープロパティを指定できます。テキスト色、背景色、境界線色など、それぞれ専用のクラスが提供されています。

```html
<!-- テキスト色の指定 -->
<p class="text-blue-600">重要な情報を表示するテキスト</p>

<!-- 背景色の指定 -->
<div class="bg-gray-50">ライトグレーの背景エリア</div>

<!-- 境界線色の指定 -->
<button class="border border-green-500">グリーンの境界線ボタン</button>

<!-- 複数プロパティの組み合わせ -->
<div class="bg-blue-50 text-blue-900 border border-blue-200">
  統一されたブルーテーマのカード
</div>
```

## 🎯 色相・明度・彩度を考慮したカラーパレット設計

効果的な配色設計には、色相（Hue）、明度（Lightness）、彩度（Saturation）の3要素を理解し、バランス良く調整することが重要です。これらの要素は、ユーザーの視覚的認知と感情的反応に直接影響します。

### 色相の選択戦略

色相は、ブランドアイデンティティとユーザーの心理的反応を決定する要因です。暖色系（赤、オレンジ、黄）は活動的で親しみやすい印象を与え、寒色系（青、緑、紫）は信頼性と落ち着きを表現します。

:::note 色相選択の指針

- **プライマリカラー**: ブランドの核となる色相を1-2色選択
- **セカンダリカラー**: プライマリと調和する補完色または類似色
- **アクセントカラー**: 注意を引くための高彩度色
- **ニュートラルカラー**: テキストや背景のためのグレー系

:::

Tailwind CSSでは、同じ色相内で異なる明度を組み合わせることで、統一感のある配色を実現できます。例えば、blue-100からblue-900までを使用し、階層的な視覚構造を構築します。

### 明度とコントラストの最適化

明度の調整は、情報の階層化とアクセシビリティの確保に直結します。適切なコントラスト比は、視覚障害を持つユーザーでも内容を理解できる重要な配慮事項です。

```html
<!-- 明度による階層表現 -->
<div class="bg-gray-50">
  <h1 class="text-gray-900">最も重要な見出し（高コントラスト）</h1>
  <h2 class="text-gray-700">セカンダリ見出し（中コントラスト）</h2>
  <p class="text-gray-600">本文テキスト（適度なコントラスト）</p>
  <small class="text-gray-400">補足情報（低コントラスト）</small>
</div>
```

WCAG 2.1では、通常のテキストで4.5:1以上、大きなテキストで3:1以上のコントラスト比を推奨しています。Tailwind CSSのデフォルトカラーは、これらの基準を満たすよう設計されています。

### 配色とテーマ設計を実装してみよう

実際にカラーパレットを設計し、統一されたテーマシステムを構築してみましょう。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`color-theming-tutorial`フォルダを作成し、エディタで開いてください。

2. 基本ファイルの作成

プロジェクトの基本構造を作成します。

_index.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>カラーテーマ設計実習</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            // カスタムカラーパレット
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              950: '#172554'
            },
            accent: {
              50: '#fdf2f8',
              100: '#fce7f3',
              200: '#fbcfe8',
              300: '#f9a8d4',
              400: '#f472b6',
              500: '#ec4899',
              600: '#db2777',
              700: '#be185d',
              800: '#9d174d',
              900: '#831843'
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50">
  <!-- コンテンツエリア -->
  <div class="min-h-screen">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">ColorTheme</h1>
            <span class="ml-2 px-2 py-1 bg-brand-100 text-brand-700 text-sm rounded-full">
              Design System
            </span>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-500 hover:text-brand-600 transition-colors">ホーム</a>
            <a href="#" class="text-gray-500 hover:text-brand-600 transition-colors">サービス</a>
            <a href="#" class="text-gray-500 hover:text-brand-600 transition-colors">お問い合わせ</a>
          </nav>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- ヒーローセクション -->
      <section class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          効果的なカラーデザインの実践
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          色相・明度・コントラストを考慮した配色設計により、ユーザーエクスペリエンスを向上させる方法を学習します。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            学習を開始
          </button>
          <button class="bg-white hover:bg-gray-50 text-brand-600 border border-brand-300 px-8 py-3 rounded-lg font-medium transition-colors">
            デモを見る
          </button>
        </div>
      </section>

      <!-- カラーパレット表示セクション -->
      <section class="mb-16">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">ブランドカラーパレット</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- プライマリカラー -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Primary (Brand)</h4>
            <div class="grid grid-cols-5 gap-2">
              <div class="bg-brand-50 p-3 rounded text-center">
                <div class="text-xs text-gray-600">50</div>
              </div>
              <div class="bg-brand-200 p-3 rounded text-center">
                <div class="text-xs text-gray-700">200</div>
              </div>
              <div class="bg-brand-500 p-3 rounded text-center">
                <div class="text-xs text-white">500</div>
              </div>
              <div class="bg-brand-700 p-3 rounded text-center">
                <div class="text-xs text-white">700</div>
              </div>
              <div class="bg-brand-900 p-3 rounded text-center">
                <div class="text-xs text-white">900</div>
              </div>
            </div>
          </div>

          <!-- アクセントカラー -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Accent</h4>
            <div class="grid grid-cols-5 gap-2">
              <div class="bg-accent-50 p-3 rounded text-center">
                <div class="text-xs text-gray-600">50</div>
              </div>
              <div class="bg-accent-200 p-3 rounded text-center">
                <div class="text-xs text-gray-700">200</div>
              </div>
              <div class="bg-accent-500 p-3 rounded text-center">
                <div class="text-xs text-white">500</div>
              </div>
              <div class="bg-accent-700 p-3 rounded text-center">
                <div class="text-xs text-white">700</div>
              </div>
              <div class="bg-accent-900 p-3 rounded text-center">
                <div class="text-xs text-white">900</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</body>
</html>
```

このHTMLファイルでは、カスタムカラーパレットを定義し、ブランドカラーとアクセントカラーを使用したデザインを実装しています。

3. ブラウザで表示確認

作成したHTMLファイルをブラウザで開き、カラーパレットの表示を確認してください。各色の明度レベルが適切に表示されているか確認します。

:::

この実装により、体系的なカラーシステムの基礎が構築できました。カスタムカラーパレットを使用することで、ブランド一貫性を保ちながら柔軟な配色設計が可能になります。

## 🌙 ダークモードとライトモードの実装

現代のWebデザインでは、ユーザーの環境や好みに応じてダークモードとライトモードを切り替えられる機能が重要です。Tailwind CSSのダークモード機能を活用し、アクセシビリティを考慮したテーマ切り替えシステムを構築します。

### ダークモード設計の原則

ダークモードの設計では、単純な色反転ではなく、視認性と快適性を考慮した色調整が必要です。背景色は純黒を避け、グレー系を使用することで目の疲労を軽減できます。

:::note ダークモード設計のポイント

- **背景色**: 純黒(#000000)ではなくダークグレー(gray-900)を使用
- **テキスト色**: 純白よりも若干トーンダウンした色を選択
- **アクセント色**: ライトモードより明度を上げて視認性を確保
- **境界線**: より微細で控えめな表現に調整

:::

### 動的テーマ切り替えの実装

JavaScript連携により、ユーザーの操作でテーマを動的に切り替える機能を実装できます。システム設定の自動検出と手動切り替えの両方に対応します。

### ダークモード対応のテーマシステムを実装してみよう

既存のHTMLファイルにダークモード機能を追加し、完全なテーマ切り替えシステムを構築してみましょう。

:::step

1. ダークモード対応のHTMLファイル更新

既存の`index.html`ファイルを以下の内容で更新します。

_index.html_
```html
<!DOCTYPE html>
<html lang="ja" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>カラーテーマ設計実習 - ダークモード対応</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              950: '#172554'
            },
            accent: {
              50: '#fdf2f8',
              100: '#fce7f3',
              200: '#fbcfe8',
              300: '#f9a8d4',
              400: '#f472b6',
              500: '#ec4899',
              600: '#db2777',
              700: '#be185d',
              800: '#9d174d',
              900: '#831843'
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 h-full">
  <div class="min-h-screen">
    <!-- ヘッダー -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">ColorTheme</h1>
            <span class="ml-2 px-2 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm rounded-full transition-colors duration-300">
              Design System
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <!-- テーマ切り替えボタン -->
            <button id="theme-toggle" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg id="sun-icon" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg id="moon-icon" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
            <nav class="hidden md:flex space-x-8">
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">ホーム</a>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">サービス</a>
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">お問い合わせ</a>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- ヒーローセクション -->
      <section class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          効果的なカラーデザインの実践
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-300">
          色相・明度・コントラストを考慮した配色設計により、ユーザーエクスペリエンスを向上させる方法を学習します。ダークモードとライトモードの両方に対応したデザインシステムを構築できます。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            学習を開始
          </button>
          <button class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            デモを見る
          </button>
        </div>
      </section>

      <!-- テーマ切り替えデモセクション -->
      <section class="mb-16">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">テーマ切り替えデモ</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- プライマリカード -->
            <div class="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-lg border border-brand-200 dark:border-brand-800 transition-colors duration-300">
              <h4 class="text-lg font-semibold text-brand-900 dark:text-brand-100 mb-2">プライマリカラー</h4>
              <p class="text-brand-700 dark:text-brand-300 text-sm">
                ブランドの主要色として使用され、重要な要素に適用されます。
              </p>
            </div>

            <!-- セカンダリカード -->
            <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">ニュートラル</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                背景やテキストなど、ベースとなる色調を提供します。
              </p>
            </div>

            <!-- アクセントカード -->
            <div class="bg-accent-50 dark:bg-accent-900/20 p-6 rounded-lg border border-accent-200 dark:border-accent-800 transition-colors duration-300">
              <h4 class="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-2">アクセント</h4>
              <p class="text-accent-700 dark:text-accent-300 text-sm">
                注意を引く要素や特別な状態を表現するために使用されます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- カラーパレット表示セクション -->
      <section class="mb-16">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-300">ブランドカラーパレット</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- プライマリカラー -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Primary (Brand)</h4>
            <div class="grid grid-cols-5 gap-2">
              <div class="bg-brand-50 dark:bg-brand-900 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-gray-600 dark:text-gray-400">50/900</div>
              </div>
              <div class="bg-brand-200 dark:bg-brand-700 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-gray-700 dark:text-gray-300">200/700</div>
              </div>
              <div class="bg-brand-500 p-3 rounded text-center">
                <div class="text-xs text-white">500</div>
              </div>
              <div class="bg-brand-700 dark:bg-brand-200 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-white dark:text-gray-700">700/200</div>
              </div>
              <div class="bg-brand-900 dark:bg-brand-50 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-white dark:text-gray-600">900/50</div>
              </div>
            </div>
          </div>

          <!-- アクセントカラー -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accent</h4>
            <div class="grid grid-cols-5 gap-2">
              <div class="bg-accent-50 dark:bg-accent-900 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-gray-600 dark:text-gray-400">50/900</div>
              </div>
              <div class="bg-accent-200 dark:bg-accent-700 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-gray-700 dark:text-gray-300">200/700</div>
              </div>
              <div class="bg-accent-500 p-3 rounded text-center">
                <div class="text-xs text-white">500</div>
              </div>
              <div class="bg-accent-700 dark:bg-accent-200 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-white dark:text-gray-700">700/200</div>
              </div>
              <div class="bg-accent-900 dark:bg-accent-50 p-3 rounded text-center transition-colors duration-300">
                <div class="text-xs text-white dark:text-gray-600">900/50</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- アクセシビリティ情報 -->
      <section>
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">アクセシビリティへの配慮</h3>
          <ul class="space-y-2 text-blue-700 dark:text-blue-300">
            <li>• WCAG 2.1 AAレベルのコントラスト比に準拠</li>
            <li>• ダークモードでの視認性を考慮した色調整</li>
            <li>• カラーブラインドユーザーを考慮した色の使い分け</li>
            <li>• スムーズなテーマ切り替えアニメーション</li>
          </ul>
        </div>
      </section>
    </main>
  </div>

  <script>
    // テーマ切り替え機能
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const html = document.documentElement;

    // 初期テーマの設定
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;

    if (initialTheme === 'dark') {
      html.classList.add('dark');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }

    // テーマ切り替えイベント
    themeToggle.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');

      if (isDark) {
        html.classList.remove('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.add('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
      }
    });

    // システムテーマ変更の監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          html.classList.add('dark');
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        } else {
          html.classList.remove('dark');
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        }
      }
    });
  </script>
</body>
</html>
```

2. テーマ切り替え機能の動作確認

ブラウザでHTMLファイルを開き、ヘッダー部分のテーマ切り替えボタン（太陽/月アイコン）をクリックしてください。ダークモードとライトモードが滑らかに切り替わることを確認できます。

3. レスポンシブ対応とアクセシビリティの検証

異なるデバイスサイズでの表示確認と、コントラスト比の検証を行ってください。ブラウザの開発者ツールを使用して、アクセシビリティ監査も実施できます。

:::

この実装により、完全なダークモード対応のテーマシステムが完成しました。ユーザーの設定を記憶し、システムのダークモード設定にも自動で対応する高機能なテーマ切り替えが実現できます。

## 🎨 セマンティックカラーの設計

セマンティックカラーは、色に意味を持たせることで、ユーザーインターフェースの直感性を向上させる重要な要素です。成功、警告、エラーなどの状態を色で表現し、ユーザーが瞬時に情報を理解できるようにします。

### 意味のある色の分類

効果的なセマンティックカラーシステムでは、各色に明確な役割を定義します。これにより、ユーザーは学習コストを削減し、直感的にインターフェースを操作できます。

:::note セマンティックカラーの分類

- **Success (成功)**: 緑系 - 操作の成功、完了状態を表現
- **Warning (警告)**: 黄・オレンジ系 - 注意が必要な状態を示す
- **Error (エラー)**: 赤系 - エラーや危険な状態を警告
- **Info (情報)**: 青系 - 一般的な情報や通知を表示
- **Neutral (中立)**: グレー系 - 通常状態や無効化状態

:::

### アクセシビリティを考慮したコントラスト設計

セマンティックカラーの設計では、色だけでなくアイコンやテキストとの組み合わせでも情報を伝達できるよう配慮が必要です。色覚多様性を持つユーザーでも識別可能な設計を心がけます。

```html
<!-- アクセシブルなセマンティックカラーの例 -->
<div class="space-y-4">
  <!-- 成功メッセージ -->
  <div class="bg-green-50 border-l-4 border-green-400 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-green-700">操作が正常に完了しました。</p>
      </div>
    </div>
  </div>

  <!-- 警告メッセージ -->
  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-yellow-700">注意が必要な操作があります。</p>
      </div>
    </div>
  </div>

  <!-- エラーメッセージ -->
  <div class="bg-red-50 border-l-4 border-red-400 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-red-700">エラーが発生しました。再度お試しください。</p>
      </div>
    </div>
  </div>
</div>
```

## まとめ

Tailwind CSSでの配色とテーマ設計について、実践的な実装方法を学習しました。適切なカラーシステムの構築により、ユーザーエクスペリエンスの向上とブランド一貫性の確保を同時に実現できます。

:::note 要点のまとめ

- Tailwind CSSのカラーシステムを活用した体系的なパレット設計
- 色相・明度・彩度を考慮したバランスの取れた配色実装
- WCAG準拠のアクセシビリティ対応とコントラスト比設定
- ダークモード・ライトモード対応の動的テーマシステム
- セマンティックカラーによる直感的なユーザーインターフェース設計

:::

効果的な配色設計は、技術的な実装だけでなく、ユーザーの認知特性とアクセシビリティへの深い理解が必要です。継続的な検証と改善により、すべてのユーザーにとって使いやすいWebサイトを構築できます。

## 関連記事

- [Flex・Grid完全攻略：柔軟なレスポンシブパターン](./flex-patterns)
- [CSS変数とカスタムプロパティの実践活用](./css-variables)
- [影・境界線・視覚効果の高度なテクニック](./shadow-borders-effects)