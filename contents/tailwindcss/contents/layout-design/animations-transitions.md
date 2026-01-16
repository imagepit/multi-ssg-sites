---
title: アニメーション/トランジション
slug: animations-transitions
parent: layout-design
file_path: layout-design/animations-transitions
target_user: "フロントエンドエンジニア（実務経験1-3年）、デザインシステム構築者、UI/UXデザイナー"
goal: "Tailwind CSSを使ったアニメーションとトランジションの実装方法を習得し、ユーザビリティを向上させるマイクロインタラクションを効果的に設計できるようになる"
status: published
post_type: pages
seo_title: "Tailwind CSSアニメーション/トランジション完全ガイド | 実践的なマイクロインタラクション設計"
seo_keywords: "Tailwind CSS, アニメーション, トランジション, CSS, マイクロインタラクション, UI/UX, フロントエンド"
seo_description: "Tailwind CSSでアニメーションとトランジションを実装する方法を詳しく解説。基本概念から実践的なマイクロインタラクション設計まで、パフォーマンスとアクセシビリティを考慮した実装手法を学べます。"
handson_overview: "実際のWebサイトで使用される実用的なアニメーションパターンを実装し、CSS Keyframes、Transform、Transitionの効果的な活用方法をハンズオン形式で体験する"
---

## 🎬 はじめに

Webサイトやアプリケーションにおいて、アニメーションとトランジションは単なる装飾ではありません。適切に実装されたマイクロインタラクションは、ユーザーの操作に対する視覚的フィードバックを提供し、直感的で快適なユーザー体験を実現します。一方で、過度なアニメーションはパフォーマンスの低下やアクセシビリティの問題を引き起こす可能性があります。

Tailwind CSSは、CSS TransitionやAnimationを手軽に実装できる豊富なユーティリティクラスを提供しており、コンポーネントベースの設計と相性の良いアプローチでアニメーションを管理できます。このページでは、基本的なトランジションから複雑なキーフレームアニメーション、さらにはアクセシビリティへの配慮まで、実践的な観点からTailwind CSSでのアニメーション実装を学習します。

### このページで学べる事

このページを通じて、Tailwind CSSを使った効果的なアニメーション設計の知識と実装スキルを身につけることができます。

:::note 学習内容

- Tailwind CSSでのトランジション基本実装
- Transform（変形）を活用したインタラクション
- 組み込みアニメーションとカスタムキーフレーム
- パフォーマンスを考慮したアニメーション設計
- アクセシビリティ（prefers-reduced-motion）への対応
- 実際のWebサイトで使用される実用的なアニメーションパターン

:::

## 🔄 トランジションの基本概念と実装

トランジションは、CSS プロパティの値が変化する際に、その変化を滑らかに表現する仕組みです。Tailwind CSSでは、`transition-*` クラスを使用してトランジションを手軽に実装できます。

:::note トランジション（Transition）とは

CSS Transitionは、要素のプロパティ値が変化する際に、その変化を指定した時間をかけて滑らかに表現する機能です。ユーザーの操作に対する視覚的フィードバックを提供し、より自然で理解しやすいインターフェースを実現します。

:::

### トランジションの基本構成要素

トランジションを実装するには、以下の要素を理解する必要があります。

**トランジション対象プロパティ**
- `transition-none`: トランジションを無効化
- `transition-all`: 全プロパティにトランジションを適用
- `transition`: 色、シャドウ、変形など一般的なプロパティに適用
- `transition-colors`: 色関連プロパティのみ
- `transition-opacity`: 透明度のみ
- `transition-shadow`: シャドウのみ
- `transition-transform`: 変形のみ

**デュレーション（継続時間）**
- `duration-75`: 75ms
- `duration-100`: 100ms
- `duration-150`: 150ms
- `duration-200`: 200ms
- `duration-300`: 300ms（デフォルト）
- `duration-500`: 500ms
- `duration-700`: 700ms
- `duration-1000`: 1000ms

**イージング（加速度曲線）**
- `ease-linear`: 一定の速度
- `ease-in`: 徐々に加速
- `ease-out`: 徐々に減速
- `ease-in-out`: 最初と最後が緩やか

**ディレイ（遅延）**
- `delay-75`: 75ms
- `delay-100`: 100ms
- `delay-150`: 150ms
- `delay-200`: 200ms
- `delay-300`: 300ms
- `delay-500`: 500ms
- `delay-700`: 700ms
- `delay-1000`: 1000ms

### ボタンのホバーエフェクトを実装してみよう

基本的なトランジションの実装方法を、ボタンのホバーエフェクトを通じて学習しましょう。

:::step

1. HTMLファイルの作成

プロジェクトのルートディレクトリに`animations-demo.html`を作成し、以下の内容を追加します。

_animations-demo.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS アニメーション/トランジション デモ</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
  <div class="max-w-4xl mx-auto space-y-12">

    <!-- セクション1: 基本的なトランジション -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">基本的なトランジション</h2>

      <!-- シンプルなホバーエフェクト -->
      <div class="space-y-4 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">色の変化</h3>
        <div class="flex gap-4 flex-wrap">
          <button class="px-6 py-3 bg-blue-500 text-white rounded-lg transition-colors duration-300 hover:bg-blue-600">
            色の変化（300ms）
          </button>
          <button class="px-6 py-3 bg-green-500 text-white rounded-lg transition-colors duration-500 ease-in-out hover:bg-green-600">
            色の変化（500ms、ease-in-out）
          </button>
        </div>
      </div>

      <!-- 透明度の変化 -->
      <div class="space-y-4 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">透明度の変化</h3>
        <div class="flex gap-4 flex-wrap">
          <button class="px-6 py-3 bg-purple-500 text-white rounded-lg transition-opacity duration-300 hover:opacity-75">
            透明度の変化
          </button>
          <button class="px-6 py-3 bg-red-500 text-white rounded-lg transition-all duration-300 hover:opacity-50 hover:bg-red-600">
            複合エフェクト
          </button>
        </div>
      </div>

      <!-- シャドウの変化 -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">シャドウの変化</h3>
        <div class="flex gap-4 flex-wrap">
          <button class="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
            シャドウの拡大
          </button>
          <button class="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-none transition-shadow duration-300 hover:shadow-lg">
            シャドウの追加
          </button>
        </div>
      </div>
    </section>

  </div>
</body>
</html>
```

2. ブラウザでの動作確認

作成したHTMLファイルをブラウザで開き、各ボタンにマウスを重ねて、トランジション効果を確認します。

3. 異なるデュレーションとイージングの比較

同じ色変化でも、デュレーションやイージングが異なることで、体感される速度や自然さが変わることを確認します。

:::

この基本的なトランジション実装では、`transition-colors`、`transition-opacity`、`transition-shadow` などの専用クラスを使用することで、パフォーマンスの最適化も図れます。必要な変化だけにトランジションを適用することで、不要な計算を避けることができます。

## 🔄 Transform（変形）を活用したインタラクション

Transform は要素の位置、サイズ、回転、傾斜などを変更する CSS プロパティです。Tailwind CSS では、`transform` クラスと組み合わせて使用する各種変形ユーティリティを提供しています。

:::note Transform（変形）とは

CSS Transformは、要素の視覚的な表現を変更する機能で、位置の移動（translate）、拡大縮小（scale）、回転（rotate）、傾斜（skew）などの変形を適用できます。レイアウトに影響を与えずに要素の見た目を変更できるため、アニメーションに適しています。

:::

### Transformの主要な種類

**移動（Translate）**
- `translate-x-*`: X軸方向の移動
- `translate-y-*`: Y軸方向の移動
- `-translate-x-*`: X軸方向の逆移動
- `-translate-y-*`: Y軸方向の逆移動

**拡大縮小（Scale）**
- `scale-*`: 全体的な拡大縮小
- `scale-x-*`: X軸方向の拡大縮小
- `scale-y-*`: Y軸方向の拡大縮小

**回転（Rotate）**
- `rotate-*`: 時計回りの回転
- `-rotate-*`: 反時計回りの回転

**傾斜（Skew）**
- `skew-x-*`: X軸方向の傾斜
- `skew-y-*`: Y軸方向の傾斜

### カードコンポーネントのホバーエフェクトを実装してみよう

Transformを活用したインタラクティブなカードコンポーネントを実装して、より動的なユーザー体験を作成しましょう。

:::step

1. カードコンポーネントセクションの追加

`animations-demo.html`の`</body>`タグの直前に、以下のセクションを追加します。

_animations-demo.html（追加部分）_
```html
    <!-- セクション2: Transform（変形）エフェクト -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Transform（変形）エフェクト</h2>

      <!-- カードの拡大エフェクト -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">カードの拡大・縮小</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">ホバーで拡大</h4>
            <p>マウスを重ねると少し大きくなります</p>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg transition-transform duration-500 hover:scale-110 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">より大きく拡大</h4>
            <p>より大きな拡大効果とゆっくりなアニメーション</p>
          </div>
          <div class="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-lg transition-transform duration-200 hover:scale-95 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">ホバーで縮小</h4>
            <p>マウスを重ねると少し小さくなります</p>
          </div>
        </div>
      </div>

      <!-- 移動エフェクト -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">移動エフェクト</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-yellow-400 text-yellow-900 p-6 rounded-lg transition-transform duration-300 hover:translate-y-2 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">下に移動</h4>
            <p>ホバーで下に少し移動します</p>
          </div>
          <div class="bg-indigo-400 text-indigo-900 p-6 rounded-lg transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">上に移動</h4>
            <p>ホバーで上に少し移動します</p>
          </div>
        </div>
      </div>

      <!-- 回転エフェクト -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">回転エフェクト</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-orange-400 text-orange-900 p-6 rounded-lg transition-transform duration-500 hover:rotate-3 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">右に回転</h4>
            <p>ホバーで右に3度回転します</p>
          </div>
          <div class="bg-cyan-400 text-cyan-900 p-6 rounded-lg transition-transform duration-500 hover:-rotate-3 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">左に回転</h4>
            <p>ホバーで左に3度回転します</p>
          </div>
          <div class="bg-purple-400 text-purple-900 p-6 rounded-lg transition-transform duration-700 hover:rotate-12 cursor-pointer">
            <h4 class="text-xl font-bold mb-2">大きく回転</h4>
            <p>ホバーで12度回転します</p>
          </div>
        </div>
      </div>

      <!-- 複合エフェクト -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-700">複合エフェクト</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
            <h4 class="text-xl font-bold mb-2">拡大 + 移動 + シャドウ</h4>
            <p>複数のエフェクトを組み合わせ</p>
          </div>
          <div class="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-lg transition-all duration-500 hover:scale-110 hover:rotate-2 hover:shadow-2xl cursor-pointer">
            <h4 class="text-xl font-bold mb-2">拡大 + 回転 + シャドウ</h4>
            <p>より動的な複合エフェクト</p>
          </div>
        </div>
      </div>
    </section>
```

2. ブラウザでの動作確認

ページを再読み込みして、各カードにマウスを重ねてTransform効果を確認します。

3. パフォーマンスの確認

ブラウザの開発者ツールを開き、Performance タブでアニメーション中のフレームレートを確認して、滑らかに動作していることを確認します。

:::

Transform を使用したアニメーションは、GPU で処理されるため、非常に滑らかで効率的です。複数の変形を組み合わせることで、より魅力的なインタラクションを作成できますが、過度に複雑にするとユーザビリティを損なう可能性があるため、適切なバランスを保つことが重要です。

## 🎭 組み込みアニメーションとカスタムキーフレーム

Tailwind CSS には、一般的に使用されるアニメーションパターンが組み込まれており、`animate-*` クラスで簡単に適用できます。さらに、独自のキーフレームアニメーションをカスタマイズして、ブランドやデザインシステムに合わせたアニメーションを作成することも可能です。

:::note キーフレームアニメーションとは

CSS Keyframes（@keyframes）は、アニメーションの開始から終了までの間に、特定のタイミングでの要素の状態を定義できる仕組みです。トランジションが2つの状態間の変化を扱うのに対し、キーフレームは複数の状態を経由する複雑なアニメーションを実現できます。

:::

### Tailwind CSS 組み込みアニメーション

**基本的な組み込みアニメーション**
- `animate-spin`: 継続的な回転（360度）
- `animate-ping`: 拡大しながらフェードアウト（繰り返し）
- `animate-pulse`: 透明度の変化（繰り返し）
- `animate-bounce`: 跳ねるような動き（繰り返し）

### ローディングアニメーションとフィードバック表示を実装してみよう

組み込みアニメーションを活用して、実用的なローディング表示とユーザーフィードバックを実装しましょう。

:::step

1. アニメーションセクションの追加

`animations-demo.html`の最後のセクションの後に、以下のセクションを追加します。

_animations-demo.html（追加部分）_
```html
    <!-- セクション3: 組み込みアニメーション -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">組み込みアニメーション</h2>

      <!-- ローディングアニメーション -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">ローディングアニメーション</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- スピンローダー -->
          <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-sm font-medium text-gray-600">スピンローダー</p>
          </div>

          <!-- パルスローダー -->
          <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-500 rounded-full animate-pulse mb-4"></div>
            <p class="text-sm font-medium text-gray-600">パルスローダー</p>
          </div>

          <!-- ピングローダー -->
          <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <div class="relative">
              <div class="w-8 h-8 bg-purple-500 rounded-full animate-ping"></div>
              <div class="absolute top-0 left-0 w-8 h-8 bg-purple-500 rounded-full"></div>
            </div>
            <p class="text-sm font-medium text-gray-600 mt-4">ピングローダー</p>
          </div>

          <!-- バウンスローダー -->
          <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-red-500 rounded-full animate-bounce mb-4"></div>
            <p class="text-sm font-medium text-gray-600">バウンスローダー</p>
          </div>
        </div>
      </div>

      <!-- 複数ドットローダー -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">複合ローディングパターン</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- 3つのドットローダー -->
          <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <div class="flex space-x-2 mb-4">
              <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
              <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
              <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
            </div>
            <p class="text-sm font-medium text-gray-600">3ドット ウェーブ</p>
          </div>

          <!-- パルスウェーブ -->
          <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            <div class="flex space-x-1 mb-4">
              <div class="w-2 h-8 bg-green-500 rounded animate-pulse" style="animation-delay: 0ms;"></div>
              <div class="w-2 h-8 bg-green-500 rounded animate-pulse" style="animation-delay: 100ms;"></div>
              <div class="w-2 h-8 bg-green-500 rounded animate-pulse" style="animation-delay: 200ms;"></div>
              <div class="w-2 h-8 bg-green-500 rounded animate-pulse" style="animation-delay: 300ms;"></div>
              <div class="w-2 h-8 bg-green-500 rounded animate-pulse" style="animation-delay: 400ms;"></div>
            </div>
            <p class="text-sm font-medium text-gray-600">バーウェーブ</p>
          </div>
        </div>
      </div>

      <!-- ステータスインジケーター -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-700">ステータスインジケーター</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- 成功状態 -->
          <div class="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-green-800">完了</p>
              <p class="text-sm text-green-600">処理が完了しました</p>
            </div>
          </div>

          <!-- 処理中状態 -->
          <div class="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <div>
              <p class="font-medium text-blue-800">処理中</p>
              <p class="text-sm text-blue-600">しばらくお待ちください</p>
            </div>
          </div>

          <!-- 警告状態 -->
          <div class="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full animate-pulse mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-yellow-800">注意</p>
              <p class="text-sm text-yellow-600">確認が必要です</p>
            </div>
          </div>
        </div>
      </div>
    </section>
```

2. カスタムアニメーションの追加

Tailwind CSS の設定を拡張してカスタムアニメーションを追加するため、HTMLファイルの`<head>`タグ内に以下のスクリプトを追加します。

_animations-demo.html（headタグ内に追加）_
```html
  <script>
    tailwind.config = {
      theme: {
        extend: {
          animation: {
            'fade-in': 'fadeIn 0.5s ease-in-out',
            'slide-up': 'slideUp 0.3s ease-out',
            'scale-in': 'scaleIn 0.2s ease-out',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            slideUp: {
              '0%': { transform: 'translateY(10px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            scaleIn: {
              '0%': { transform: 'scale(0.95)', opacity: '0' },
              '100%': { transform: 'scale(1)', opacity: '1' },
            }
          }
        }
      }
    }
  </script>
```

3. カスタムアニメーションセクションの追加

カスタムアニメーションのデモセクションを追加します。

_animations-demo.html（追加部分）_
```html
    <!-- セクション4: カスタムアニメーション -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">カスタムアニメーション</h2>

      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-700">カスタムキーフレーム</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="p-6 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
            <h4 class="text-lg font-semibold text-blue-800 mb-2">フェードイン</h4>
            <p class="text-blue-600">徐々に表示されるアニメーション</p>
          </div>

          <div class="p-6 bg-green-50 border border-green-200 rounded-lg animate-slide-up">
            <h4 class="text-lg font-semibold text-green-800 mb-2">スライドアップ</h4>
            <p class="text-green-600">下から上に表示されるアニメーション</p>
          </div>

          <div class="p-6 bg-purple-50 border border-purple-200 rounded-lg animate-scale-in">
            <h4 class="text-lg font-semibold text-purple-800 mb-2">スケールイン</h4>
            <p class="text-purple-600">拡大して表示されるアニメーション</p>
          </div>
        </div>
      </div>
    </section>
```

4. ブラウザでの動作確認

ページを再読み込みして、組み込みアニメーションとカスタムアニメーションの動作を確認します。特に、ローディングアニメーションの滑らかさと、カスタムアニメーションの自然な表示を確認してください。

:::

組み込みアニメーションは手軽に使用できる一方で、カスタムキーフレームを定義することで、ブランドアイデンティティに合わせた独自のアニメーションを作成できます。実用的なローディング表示やステータスインジケーターは、ユーザーにシステムの状態を適切に伝える重要な役割を果たします。

## ⚡ パフォーマンスを考慮したアニメーション設計

美しいアニメーションも、パフォーマンスが悪ければユーザー体験を損ないます。特にモバイルデバイスや低性能なデバイスでは、最適化されていないアニメーションがフレームドロップやバッテリー消費の原因となります。効率的なアニメーション実装のベストプラクティスを学習しましょう。

:::note パフォーマンス最適化の重要性

アニメーションのパフォーマンスは、ユーザー体験に直接影響します。60FPS（1秒間に60フレーム）を維持することで、滑らかで快適な操作感を提供できます。パフォーマンスの悪いアニメーションは、ユーザーの離脱率向上やエンゲージメント低下につながります。

:::

### パフォーマンス最適化の原則

**GPU加速プロパティの使用**
- `transform`: 移動、拡大縮小、回転、傾斜
- `opacity`: 透明度
- `filter`: フィルター効果

**避けるべきプロパティ**
- `width`, `height`: レイアウトの再計算が必要
- `top`, `left`: レイアウトの再計算が必要
- `margin`, `padding`: レイアウトの再計算が必要

**will-change プロパティの活用**
- アニメーションが開始される前にブラウザに最適化を指示
- Tailwind CSS では独自に実装する必要がある

### パフォーマンス最適化されたアニメーションを実装してみよう

パフォーマンスの良いアニメーションと悪いアニメーションを比較して、最適化の効果を体感しましょう。

:::step

1. パフォーマンス比較セクションの追加

新しいセクションをHTMLファイルに追加します。

_animations-demo.html（追加部分）_
```html
    <!-- セクション5: パフォーマンス最適化 -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">パフォーマンス最適化</h2>

      <!-- パフォーマンス比較 -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">最適化されたアニメーション vs 非最適化</h3>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 class="text-red-800 font-semibold mb-2">⚠️ 非最適化（避けるべき）</h4>
          <p class="text-red-600 text-sm mb-4">レイアウトの再計算を引き起こすプロパティを使用</p>
          <div class="flex gap-4">
            <div id="bad-animation" class="w-20 h-20 bg-red-400 rounded cursor-pointer transition-all duration-300" style="margin-left: 0;">
              クリック
            </div>
          </div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="text-green-800 font-semibold mb-2">✅ 最適化済み（推奨）</h4>
          <p class="text-green-600 text-sm mb-4">GPU加速プロパティ（transform）を使用</p>
          <div class="flex gap-4">
            <div id="good-animation" class="w-20 h-20 bg-green-400 rounded cursor-pointer transition-transform duration-300">
              クリック
            </div>
          </div>
        </div>
      </div>

      <!-- 複数要素のアニメーション -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">大量要素のアニメーション最適化</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 非効率な実装 -->
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 class="text-yellow-800 font-semibold mb-3">非効率な実装</h4>
            <div class="grid grid-cols-5 gap-2" id="inefficient-grid">
              <!-- 25個の要素を動的に生成 -->
            </div>
            <button id="animate-inefficient" class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
              アニメーション開始
            </button>
          </div>

          <!-- 効率的な実装 -->
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="text-blue-800 font-semibold mb-3">効率的な実装</h4>
            <div class="grid grid-cols-5 gap-2" id="efficient-grid">
              <!-- 25個の要素を動的に生成 -->
            </div>
            <button id="animate-efficient" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              アニメーション開始
            </button>
          </div>
        </div>
      </div>

      <!-- パフォーマンス計測 -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-700">パフォーマンス計測</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-gray-600 mb-4">ブラウザの開発者ツール（F12）→ Performance タブでアニメーション中のFPSを確認できます。</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="bg-green-100 p-3 rounded">
              <strong class="text-green-800">60 FPS</strong><br>
              <span class="text-green-600">理想的</span>
            </div>
            <div class="bg-yellow-100 p-3 rounded">
              <strong class="text-yellow-800">30-59 FPS</strong><br>
              <span class="text-yellow-600">許容範囲</span>
            </div>
            <div class="bg-red-100 p-3 rounded">
              <strong class="text-red-800">30 FPS 未満</strong><br>
              <span class="text-red-600">最適化が必要</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <script>
      // パフォーマンス比較のJavaScript
      document.addEventListener('DOMContentLoaded', function() {

        // 非最適化アニメーション（margin-leftを使用）
        const badElement = document.getElementById('bad-animation');
        let badPosition = 0;
        badElement.addEventListener('click', function() {
          badPosition = badPosition === 0 ? 100 : 0;
          this.style.marginLeft = badPosition + 'px';
        });

        // 最適化アニメーション（transformを使用）
        const goodElement = document.getElementById('good-animation');
        let goodPosition = 0;
        goodElement.addEventListener('click', function() {
          goodPosition = goodPosition === 0 ? 100 : 0;
          this.style.transform = `translateX(${goodPosition}px)`;
        });

        // グリッド要素の生成
        function createGridElements(containerId, className) {
          const container = document.getElementById(containerId);
          for (let i = 0; i < 25; i++) {
            const element = document.createElement('div');
            element.className = `w-8 h-8 ${className} rounded`;
            container.appendChild(element);
          }
        }

        createGridElements('inefficient-grid', 'bg-yellow-400');
        createGridElements('efficient-grid', 'bg-blue-400');

        // 非効率なアニメーション
        document.getElementById('animate-inefficient').addEventListener('click', function() {
          const elements = document.querySelectorAll('#inefficient-grid > div');
          elements.forEach((el, index) => {
            setTimeout(() => {
              // width を変更（レイアウト再計算を引き起こす）
              el.style.transition = 'width 0.3s ease';
              el.style.width = el.style.width === '24px' ? '32px' : '24px';
            }, index * 50);
          });
        });

        // 効率的なアニメーション
        document.getElementById('animate-efficient').addEventListener('click', function() {
          const elements = document.querySelectorAll('#efficient-grid > div');
          elements.forEach((el, index) => {
            setTimeout(() => {
              // transform を使用（GPU加速）
              el.style.transition = 'transform 0.3s ease';
              const currentScale = el.style.transform.includes('scale') ? 1 : 1.2;
              el.style.transform = currentScale === 1 ? 'scale(1.2)' : 'scale(1)';
            }, index * 50);
          });
        });
      });
    </script>
```

2. ブラウザでのパフォーマンス確認

ブラウザを開き、開発者ツール（F12）のPerformanceタブを開いてから、各アニメーションボタンをクリックして、パフォーマンスの違いを確認します。

3. アニメーション実行とFPS測定

- 非最適化アニメーションを実行し、FPSの変化を確認
- 最適化されたアニメーションを実行し、FPSの変化を比較
- 特に大量要素のアニメーションで顕著な差が現れることを確認

4. パフォーマンス改善のポイント確認

- `transform` と `opacity` の使用がGPU加速の恩恵を受けること
- `margin`, `width`, `height` などのレイアウトプロパティがパフォーマンスに悪影響を与えること
- 大量の要素をアニメーションする際の最適化手法

:::

パフォーマンス最適化は、アニメーション実装において最も重要な要素の一つです。GPU加速プロパティの使用、適切なタイミング関数の選択、アニメーション要素数の制限などを意識することで、すべてのデバイスで快適なユーザー体験を提供できます。

## ♿ アクセシビリティ（prefers-reduced-motion）への対応

すべてのユーザーがアニメーションを快適に感じるわけではありません。前庭器官に問題がある方や、アニメーションが気分の悪さを引き起こす方もいます。そのため、アクセシビリティを考慮したアニメーション設計は現代のWeb開発において必須の要件です。

:::note prefers-reduced-motionとは

`prefers-reduced-motion` は CSS メディアクエリの一つで、ユーザーがシステム設定でアニメーションの削減を選択している場合に適用されます。この設定を尊重することで、より包括的でアクセシブルなWebサイトを作成できます。

:::

### アクセシビリティ対応の原則

**基本的な対応方針**
- アニメーションはユーザビリティを向上させる手段であり、必須の機能ではない
- `prefers-reduced-motion: reduce` が設定されている場合は、アニメーションを無効化または最小限に留める
- 重要な情報はアニメーションに依存せず、静的な状態でも理解できるようにする

**Tailwind CSS での対応方法**
- `motion-reduce:` プレフィックスを使用してアニメーション制限を実装
- `motion-safe:` プレフィックスでアニメーション許可時のみの効果を定義

### アクセシビリティ対応のアニメーションを実装してみよう

`prefers-reduced-motion` に対応したアニメーションの実装方法を学習しましょう。

:::step

1. アクセシビリティセクションの追加

アクセシビリティ対応のデモセクションを追加します。

_animations-demo.html（追加部分）_
```html
    <!-- セクション6: アクセシビリティ対応 -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">アクセシビリティ対応</h2>

      <!-- アクセシビリティ設定の説明 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 class="text-blue-800 font-semibold mb-3">💡 アクセシビリティ設定の確認方法</h3>
        <div class="space-y-2 text-blue-700">
          <p><strong>Windows:</strong> 設定 → 簡単操作 → ディスプレイ → アニメーションを表示する（オフ）</p>
          <p><strong>macOS:</strong> システム環境設定 → アクセシビリティ → ディスプレイ → 視差効果を減らす（チェック）</p>
          <p><strong>開発者ツール:</strong> Chrome DevTools → ⋮ → More tools → Rendering → Emulate CSS media feature prefers-reduced-motion</p>
        </div>
      </div>

      <!-- アクセシビリティ対応の比較 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <!-- 対応していない例 -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-red-600">❌ アクセシビリティ未対応</h3>
          <div class="p-6 bg-red-50 border border-red-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <button class="px-4 py-3 bg-red-500 text-white rounded-lg transition-all duration-500 hover:scale-110 hover:rotate-12 hover:shadow-xl">
                常にアニメーション
              </button>
              <div class="w-16 h-16 bg-red-400 rounded-full animate-spin mx-auto"></div>
            </div>
            <p class="text-red-600 text-sm mt-4">設定に関係なく常にアニメーションが動作</p>
          </div>
        </div>

        <!-- 対応している例 -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-green-600">✅ アクセシビリティ対応</h3>
          <div class="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <button class="px-4 py-3 bg-green-500 text-white rounded-lg motion-safe:transition-all motion-safe:duration-500 motion-safe:hover:scale-110 motion-safe:hover:rotate-12 motion-safe:hover:shadow-xl motion-reduce:hover:bg-green-600">
                設定を尊重
              </button>
              <div class="w-16 h-16 bg-green-400 rounded-full motion-safe:animate-spin mx-auto"></div>
            </div>
            <p class="text-green-600 text-sm mt-4">reduce設定時はアニメーション無効化</p>
          </div>
        </div>
      </div>

      <!-- 実用的なアクセシビリティ対応パターン -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">実用的なアクセシビリティ対応パターン</h3>

        <!-- ナビゲーションメニュー -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-4">レスポンシブナビゲーション</h4>
          <nav class="space-y-2">
            <a href="#" class="block px-4 py-2 text-gray-700 rounded motion-safe:transition-colors motion-safe:duration-200 hover:bg-blue-100 motion-reduce:hover:bg-blue-100">
              ホーム
            </a>
            <a href="#" class="block px-4 py-2 text-gray-700 rounded motion-safe:transition-colors motion-safe:duration-200 hover:bg-blue-100 motion-reduce:hover:bg-blue-100">
              サービス
            </a>
            <a href="#" class="block px-4 py-2 text-gray-700 rounded motion-safe:transition-colors motion-safe:duration-200 hover:bg-blue-100 motion-reduce:hover:bg-blue-100">
              お問い合わせ
            </a>
          </nav>
        </div>

        <!-- カードコンポーネント -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:shadow-xl motion-safe:hover:-translate-y-1 cursor-pointer">
            <div class="w-12 h-12 bg-purple-500 rounded-lg mb-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-110"></div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">サービス 1</h4>
            <p class="text-gray-600">アクセシビリティに配慮したカードコンポーネント</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:shadow-xl motion-safe:hover:-translate-y-1 cursor-pointer">
            <div class="w-12 h-12 bg-blue-500 rounded-lg mb-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-110"></div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">サービス 2</h4>
            <p class="text-gray-600">prefers-reduced-motion に対応済み</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:shadow-xl motion-safe:hover:-translate-y-1 cursor-pointer">
            <div class="w-12 h-12 bg-green-500 rounded-lg mb-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-110"></div>
            <h4 class="text-lg font-semibold text-gray-800 mb-2">サービス 3</h4>
            <p class="text-gray-600">包括的なユーザー体験を提供</p>
          </div>
        </div>
      </div>

      <!-- ローディング状態のアクセシビリティ対応 -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-700">ローディング状態のアクセシビリティ対応</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- アニメーション版 -->
          <div class="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="text-blue-800 font-semibold mb-4">アニメーション対応ローダー</h4>
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full motion-safe:animate-spin"></div>
              <span class="text-blue-700">読み込み中...</span>
            </div>
            <p class="text-blue-600 text-sm mt-2">motion設定時はスピンアニメーション無効</p>
          </div>

          <!-- 静的版 -->
          <div class="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 class="text-gray-800 font-semibold mb-4">静的ローダー</h4>
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 border-4 border-gray-400 border-t-gray-600 rounded-full"></div>
              <span class="text-gray-700">読み込み中...</span>
            </div>
            <p class="text-gray-600 text-sm mt-2">アニメーション無しでも明確な状態表示</p>
          </div>
        </div>
      </div>
    </section>
```

2. アクセシビリティテスト用のスクリプト追加

動的なアクセシビリティ設定の確認ツールを追加します。

_animations-demo.html（scriptタグ内に追加）_
```javascript
        // アクセシビリティ設定の確認
        function checkMotionPreference() {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const indicator = document.getElementById('motion-indicator');
          if (indicator) {
            if (prefersReducedMotion) {
              indicator.textContent = '🔕 アニメーション削減モード';
              indicator.className = 'px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium';
            } else {
              indicator.textContent = '🎬 アニメーション通常モード';
              indicator.className = 'px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium';
            }
          }
        }

        // ページ読み込み時とメディアクエリ変更時に実行
        checkMotionPreference();
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkMotionPreference);
```

3. モーション設定インジケーターの追加

アクセシビリティセクションの先頭に現在の設定を表示するインジケーターを追加します。

_animations-demo.html（アクセシビリティセクションの最初に追加）_
```html
      <!-- 現在の設定状態表示 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">現在の設定状態</h3>
        <div id="motion-indicator" class="inline-block"></div>
      </div>
```

4. ブラウザでのアクセシビリティテスト

- ブラウザの開発者ツールでアクセシビリティ設定をエミュレート
- 設定変更前後でのアニメーション動作の確認
- 実際のシステム設定での動作確認（可能であれば）

:::

アクセシビリティ対応は、技術的な実装だけでなく、すべてのユーザーへの配慮を示す重要な取り組みです。`motion-safe:` と `motion-reduce:` プレフィックスを適切に使用することで、美しいアニメーションを維持しながら、アクセシビリティ要件も満たすことができます。

## 🎯 実用的なアニメーションパターンの実装

これまでに学習した技術を組み合わせて、実際のWebサイトでよく使用される実用的なアニメーションパターンを実装しましょう。ユーザビリティを向上させ、ブランド体験を向上させるマイクロインタラクションの設計方法を習得します。

### 実用的なアニメーションパターンを作成してみよう

モーダル、ドロップダウン、タブ切り替え、スクロールアニメーションなど、実際のプロジェクトで頻繁に使用されるアニメーションパターンを実装しましょう。

:::step

1. 実用パターンセクションの追加

実用的なアニメーションパターンのデモセクションを追加します。

_animations-demo.html（追加部分）_
```html
    <!-- セクション7: 実用的なアニメーションパターン -->
    <section class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">実用的なアニメーションパターン</h2>

      <!-- モーダルアニメーション -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">モーダルアニメーション</h3>
        <div class="flex gap-4 flex-wrap">
          <button id="open-modal-fade" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            フェードモーダル
          </button>
          <button id="open-modal-scale" class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            スケールモーダル
          </button>
          <button id="open-modal-slide" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            スライドモーダル
          </button>
        </div>
      </div>

      <!-- ドロップダウンメニュー -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">ドロップダウンメニュー</h3>
        <div class="flex gap-4 flex-wrap">

          <!-- シンプルドロップダウン -->
          <div class="relative inline-block">
            <button id="dropdown-1" class="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300">
              メニュー 1 ▼
            </button>
            <div id="dropdown-menu-1" class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 scale-95 motion-safe:transition-all motion-safe:duration-200 pointer-events-none z-10">
              <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">アイテム 1</a>
              <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">アイテム 2</a>
              <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg">アイテム 3</a>
            </div>
          </div>

          <!-- スライドダウン -->
          <div class="relative inline-block">
            <button id="dropdown-2" class="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300">
              メニュー 2 ▼
            </button>
            <div id="dropdown-menu-2" class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 -translate-y-2 motion-safe:transition-all motion-safe:duration-300 pointer-events-none z-10">
              <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">サービス A</a>
              <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">サービス B</a>
              <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg">サービス C</a>
            </div>
          </div>
        </div>
      </div>

      <!-- タブ切り替えアニメーション -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">タブ切り替えアニメーション</h3>
        <div class="w-full max-w-2xl">

          <!-- タブナビゲーション -->
          <div class="flex border-b border-gray-200 relative">
            <button class="tab-button px-6 py-3 text-blue-600 border-b-2 border-blue-500 font-medium motion-safe:transition-colors" data-tab="tab1">
              タブ 1
            </button>
            <button class="tab-button px-6 py-3 text-gray-500 hover:text-gray-700 font-medium motion-safe:transition-colors" data-tab="tab2">
              タブ 2
            </button>
            <button class="tab-button px-6 py-3 text-gray-500 hover:text-gray-700 font-medium motion-safe:transition-colors" data-tab="tab3">
              タブ 3
            </button>
          </div>

          <!-- タブコンテンツ -->
          <div class="relative">
            <div id="tab1" class="tab-content p-6 motion-safe:transition-all motion-safe:duration-300">
              <h4 class="text-xl font-semibold text-gray-800 mb-3">タブ 1 のコンテンツ</h4>
              <p class="text-gray-600">ここはタブ1の内容です。アニメーション付きでスムーズに切り替わります。</p>
            </div>
            <div id="tab2" class="tab-content p-6 opacity-0 absolute top-0 left-0 w-full motion-safe:transition-all motion-safe:duration-300">
              <h4 class="text-xl font-semibold text-gray-800 mb-3">タブ 2 のコンテンツ</h4>
              <p class="text-gray-600">タブ2のコンテンツです。フェードイン・アウトで美しく切り替わります。</p>
            </div>
            <div id="tab3" class="tab-content p-6 opacity-0 absolute top-0 left-0 w-full motion-safe:transition-all motion-safe:duration-300">
              <h4 class="text-xl font-semibold text-gray-800 mb-3">タブ 3 のコンテンツ</h4>
              <p class="text-gray-600">最後のタブです。滑らかなアニメーションでユーザー体験を向上させます。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- アコーディオンメニュー -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-700">アコーディオンメニュー</h3>
        <div class="space-y-2 max-w-2xl">

          <div class="border border-gray-200 rounded-lg">
            <button class="accordion-button w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 motion-safe:transition-colors flex justify-between items-center" data-target="accordion1">
              <span>アコーディオン 1</span>
              <span class="accordion-icon motion-safe:transition-transform motion-safe:duration-200">▼</span>
            </button>
            <div id="accordion1" class="accordion-content max-h-0 overflow-hidden motion-safe:transition-all motion-safe:duration-300">
              <div class="px-6 py-4 text-gray-600 border-t border-gray-200">
                アコーディオン1の内容です。高さがスムーズに変化してコンテンツが表示されます。
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg">
            <button class="accordion-button w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 motion-safe:transition-colors flex justify-between items-center" data-target="accordion2">
              <span>アコーディオン 2</span>
              <span class="accordion-icon motion-safe:transition-transform motion-safe:duration-200">▼</span>
            </button>
            <div id="accordion2" class="accordion-content max-h-0 overflow-hidden motion-safe:transition-all motion-safe:duration-300">
              <div class="px-6 py-4 text-gray-600 border-t border-gray-200">
                2つ目のアコーディオンです。複数のアコーディオンが独立して動作します。
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg">
            <button class="accordion-button w-full px-6 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 motion-safe:transition-colors flex justify-between items-center" data-target="accordion3">
              <span>アコーディオン 3</span>
              <span class="accordion-icon motion-safe:transition-transform motion-safe:duration-200">▼</span>
            </button>
            <div id="accordion3" class="accordion-content max-h-0 overflow-hidden motion-safe:transition-all motion-safe:duration-300">
              <div class="px-6 py-4 text-gray-600 border-t border-gray-200">
                最後のアコーディオンです。ユーザーフレンドリーなインターフェースを提供します。
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知トースト -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-700">通知トースト</h3>
        <div class="flex gap-4 flex-wrap">
          <button id="show-success-toast" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            成功通知
          </button>
          <button id="show-error-toast" class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            エラー通知
          </button>
          <button id="show-info-toast" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            情報通知
          </button>
        </div>
      </div>
    </section>

    <!-- モーダル -->
    <div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 motion-safe:transition-opacity motion-safe:duration-300">
      <div id="modal-content" class="bg-white rounded-lg p-8 max-w-md w-full mx-4 motion-safe:transition-all motion-safe:duration-300">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800">モーダルタイトル</h3>
          <button id="close-modal" class="text-gray-500 hover:text-gray-700 motion-safe:transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-6">これはアニメーション付きのモーダルです。スムーズに表示・非表示が切り替わります。</p>
        <div class="flex justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 text-gray-600 hover:text-gray-800 motion-safe:transition-colors">
            キャンセル
          </button>
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 motion-safe:transition-colors">
            確認
          </button>
        </div>
      </div>
    </div>

    <!-- トースト通知コンテナ -->
    <div id="toast-container" class="fixed top-4 right-4 space-y-2 z-50"></div>
```

2. JavaScriptの実装

実用的なアニメーションパターンを制御するJavaScriptを追加します。

_animations-demo.html（scriptタグ内に追加）_
```javascript
        // モーダル制御
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');

        function openModal(animationType) {
          modalOverlay.classList.remove('hidden');
          modalOverlay.classList.add('flex');

          // アニメーションタイプに応じてクラスを設定
          modalContent.className = 'bg-white rounded-lg p-8 max-w-md w-full mx-4 motion-safe:transition-all motion-safe:duration-300';

          setTimeout(() => {
            modalOverlay.style.opacity = '1';
            switch(animationType) {
              case 'fade':
                modalContent.style.opacity = '1';
                break;
              case 'scale':
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
                break;
              case 'slide':
                modalContent.style.transform = 'translateY(0)';
                modalContent.style.opacity = '1';
                break;
            }
          }, 10);
        }

        function closeModal() {
          modalOverlay.style.opacity = '0';
          modalContent.style.opacity = '0';
          modalContent.style.transform = 'scale(0.95) translateY(-10px)';

          setTimeout(() => {
            modalOverlay.classList.add('hidden');
            modalOverlay.classList.remove('flex');
          }, 300);
        }

        // モーダルイベントリスナー
        document.getElementById('open-modal-fade').addEventListener('click', () => openModal('fade'));
        document.getElementById('open-modal-scale').addEventListener('click', () => openModal('scale'));
        document.getElementById('open-modal-slide').addEventListener('click', () => openModal('slide'));
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('modal-cancel').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) closeModal();
        });

        // ドロップダウン制御
        function setupDropdown(buttonId, menuId) {
          const button = document.getElementById(buttonId);
          const menu = document.getElementById(menuId);

          button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('opacity-100');

            // 他のドロップダウンを閉じる
            document.querySelectorAll('[id^="dropdown-menu-"]').forEach(m => {
              if (m !== menu) {
                m.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
                m.classList.add('opacity-0', 'scale-95', '-translate-y-2');
                m.style.pointerEvents = 'none';
              }
            });

            if (isOpen) {
              menu.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
              menu.classList.add('opacity-0', 'scale-95', '-translate-y-2');
              menu.style.pointerEvents = 'none';
            } else {
              menu.classList.remove('opacity-0', 'scale-95', '-translate-y-2');
              menu.classList.add('opacity-100', 'scale-100', 'translate-y-0');
              menu.style.pointerEvents = 'auto';
            }
          });
        }

        setupDropdown('dropdown-1', 'dropdown-menu-1');
        setupDropdown('dropdown-2', 'dropdown-menu-2');

        // ドロップダウン外クリックで閉じる
        document.addEventListener('click', () => {
          document.querySelectorAll('[id^="dropdown-menu-"]').forEach(menu => {
            menu.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            menu.classList.add('opacity-0', 'scale-95', '-translate-y-2');
            menu.style.pointerEvents = 'none';
          });
        });

        // タブ制御
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
          button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // すべてのタブボタンを非アクティブに
            tabButtons.forEach(btn => {
              btn.classList.remove('text-blue-600', 'border-b-2', 'border-blue-500');
              btn.classList.add('text-gray-500');
            });

            // クリックされたタブをアクティブに
            button.classList.remove('text-gray-500');
            button.classList.add('text-blue-600', 'border-b-2', 'border-blue-500');

            // すべてのタブコンテンツを非表示に
            tabContents.forEach(content => {
              content.classList.add('opacity-0', 'absolute');
              content.classList.remove('opacity-100', 'relative');
            });

            // 対象のタブコンテンツを表示
            const targetContent = document.getElementById(targetTab);
            targetContent.classList.remove('opacity-0', 'absolute');
            targetContent.classList.add('opacity-100', 'relative');
          });
        });

        // アコーディオン制御
        document.querySelectorAll('.accordion-button').forEach(button => {
          button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const icon = button.querySelector('.accordion-icon');
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

            if (isOpen) {
              content.style.maxHeight = '0px';
              icon.style.transform = 'rotate(0deg)';
            } else {
              content.style.maxHeight = content.scrollHeight + 'px';
              icon.style.transform = 'rotate(180deg)';
            }
          });
        });

        // トースト通知
        function showToast(message, type = 'info') {
          const container = document.getElementById('toast-container');
          const toast = document.createElement('div');

          let bgColor = 'bg-blue-500';
          let icon = 'ℹ️';

          switch(type) {
            case 'success':
              bgColor = 'bg-green-500';
              icon = '✅';
              break;
            case 'error':
              bgColor = 'bg-red-500';
              icon = '❌';
              break;
            case 'info':
              bgColor = 'bg-blue-500';
              icon = 'ℹ️';
              break;
          }

          toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform translate-x-full motion-safe:transition-all motion-safe:duration-300`;
          toast.innerHTML = `
            <span class="text-xl">${icon}</span>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.remove()">×</button>
          `;

          container.appendChild(toast);

          // アニメーション開始
          setTimeout(() => {
            toast.classList.remove('translate-x-full');
            toast.classList.add('translate-x-0');
          }, 10);

          // 自動削除
          setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
              if (toast.parentElement) {
                toast.remove();
              }
            }, 300);
          }, 5000);
        }

        // トーストボタンイベント
        document.getElementById('show-success-toast').addEventListener('click', () => {
          showToast('操作が正常に完了しました！', 'success');
        });

        document.getElementById('show-error-toast').addEventListener('click', () => {
          showToast('エラーが発生しました。再試行してください。', 'error');
        });

        document.getElementById('show-info-toast').addEventListener('click', () => {
          showToast('新しい情報があります。', 'info');
        });
```

3. ブラウザでの動作確認

各アニメーションパターンの動作を確認し、以下のポイントをチェックします。

- モーダルの滑らかな表示・非表示
- ドロップダウンメニューの自然な展開・収縮
- タブ切り替えのフェードイン・アウト
- アコーディオンの高さアニメーション
- トースト通知のスライドイン・アウト

4. パフォーマンスとアクセシビリティの確認

開発者ツールでパフォーマンスを確認し、`prefers-reduced-motion` 設定での動作も確認します。

:::

これらの実用的なアニメーションパターンは、実際のWebアプリケーションでよく使用される実装例です。各パターンは、パフォーマンス最適化とアクセシビリティ対応を考慮して設計されており、そのまま本番環境で使用できる品質を保っています。

## 📚 まとめ

この章では、Tailwind CSSを使用したアニメーションとトランジションの包括的な実装方法を学習しました。基本的なCSS概念から実用的なマイクロインタラクションまで、現代のWeb開発に必要なアニメーション技術を習得できました。

:::note 要点のまとめ

- **トランジション基礎**: `transition-*` クラスによる滑らかな状態変化の実装
- **Transform活用**: GPU加速による効率的な変形アニメーション
- **組み込みアニメーション**: `animate-*` クラスとカスタムキーフレームの活用
- **パフォーマンス最適化**: GPU加速プロパティの使用とレイアウト再計算の回避
- **アクセシビリティ対応**: `prefers-reduced-motion` への適切な対応
- **実用パターン**: モーダル、ドロップダウン、タブ、アコーディオン、トーストの実装

:::

適切に実装されたアニメーションは、単なる装飾を超えて、ユーザーの操作に対する明確なフィードバックを提供し、直感的で楽しい体験を創出します。パフォーマンスとアクセシビリティを考慮しながら、ブランドアイデンティティを表現するマイクロインタラクションを設計できるスキルは、現代のフロントエンド開発において不可欠です。

次の章では、Tailwind CSSのコンポーネント設計について学習し、再利用可能で保守性の高いUIコンポーネントシステムの構築方法を探求します。

[コンポーネント設計](./component-design)

## 🔗 関連リンク

- [Tailwind CSS Transition & Animation](https://tailwindcss.com/docs/transition-property)
- [CSS Transform MDN](https://developer.mozilla.org/ja/docs/Web/CSS/transform)
- [Web Animations API](https://developer.mozilla.org/ja/docs/Web/API/Web_Animations_API)
- [prefers-reduced-motion MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@media/prefers-reduced-motion)

## 🎓 さらに深く学習したい方へ

アニメーションとインタラクションデザインをより深く学習したい方向けに、実践的な研修プログラムを提供しています。企業のデザインシステム構築や、チーム全体のスキルアップにお役立てください。実際のプロジェクトでの適用事例と、パフォーマンス最適化の実践的なノウハウを学べる内容となっています。