---
title: コンテナクエリ（@container）の使い所
slug: container-queries
parent: layout-design
file_path: layout-design/container-queries
target_user: "Tailwind CSS基礎を習得した中級開発者、モダンレスポンシブデザインを実装したいWebデザイナー"
goal: "コンテナクエリ（@container）の概念と実装方法を習得し、コンポーネント単位でのレスポンシブデザインを効率的に実装できるようになる"
status: published
post_type: pages
seo_title: "Tailwind CSSコンテナクエリ完全ガイド - モダンレスポンシブデザイン実装"
seo_keywords: "TailwindCSS,コンテナクエリ,@container,レスポンシブデザイン,モダンCSS,コンポーネント"
seo_description: "Tailwind CSSでコンテナクエリ（@container）を活用したモダンレスポンシブデザインを習得。メディアクエリとの違い、実践的な実装方法、カードコンポーネントでの活用法を体系的に学習できます。"
handson_overview: "実際のカードコンポーネントとモジュラーレイアウトを構築しながら、コンテナクエリの基本実装から高度な活用パターンまでを段階的に実践習得できます"
---

# 📦 コンテナクエリ（@container）の使い所

レベル1でレスポンシブデザインの基礎を学んだあなたは、`sm:`、`md:`、`lg:`といったブレークポイントを使って画面サイズに応じたデザインを実装できるようになりました。しかし、実際のWebサイト開発では、**画面全体のサイズではなく、コンテナ（親要素）のサイズに応じて**レイアウトを変更したい場面が数多く存在します。

コンテナクエリ（`@container`）は、この課題を解決するモダンCSS技術です。従来のメディアクエリが画面全体のサイズを基準とするのに対し、コンテナクエリは**特定の要素のサイズを基準**としてスタイルを適用できます。これにより、より柔軟で再利用可能なコンポーネント設計が可能になります。

## このページで学べる事

コンテナクエリの基本概念から実践的な活用方法まで、モダンレスポンシブデザインに必要な技術を体系的に習得できます。実際にコンポーネントを構築しながら、コンテナクエリの効果を実感できます。

:::note 学習内容

- コンテナクエリの基本概念とメディアクエリとの違い
- Tailwind CSSでのコンテナクエリ実装方法
- カードコンポーネントでの実践的な活用
- サイドバーレイアウトでのモジュラー設計
- ブラウザサポートと代替手法の理解
- パフォーマンスを考慮した実装アプローチ

:::

## 🔍 コンテナクエリとメディアクエリの違い

まず、コンテナクエリがなぜ必要なのかを理解するために、従来のメディアクエリとの違いを明確にしましょう。この違いを理解することで、どの場面でコンテナクエリが有効なのかが見えてきます。

### メディアクエリの制限

メディアクエリは画面全体のサイズを基準とするため、同じコンポーネントでも配置される場所によって異なる動作が必要な場合に対応できません。例えば、メインコンテンツエリアとサイドバーに同じカードコンポーネントを配置する場合、利用可能な幅が大きく異なりますが、メディアクエリでは画面サイズしか判断できません。

**サイドバーのカード**: 狭いスペースに配置されるため、縦に並んだシンプルなレイアウトが適している
**メインエリアのカード**: 広いスペースがあるため、横並びの詳細なレイアウトが効果的

:::note メディアクエリの課題例

- 同じコンポーネントが配置場所によって異なるレイアウトを必要とする
- 動的にサイズが変わるコンテナ内でのレスポンシブ対応が困難
- コンポーネントの再利用性が制限される

:::

### コンテナクエリの優位性

コンテナクエリは**親要素のサイズ**を基準とするため、コンポーネントがどこに配置されても、そのコンテナのサイズに応じて適切なレイアウトを選択できます。これにより、真の意味でのコンポーネント指向な開発が可能になります。

## 🛠️ Tailwind CSSでのコンテナクエリ実装

Tailwind CSSでは、`@container`ディレクティブとコンテナクエリ専用のユーティリティクラスを使用してコンテナクエリを実装できます。基本的な仕組みから実装方法まで、段階的に理解していきましょう。

### 基本的な実装手順

コンテナクエリを使用するには、以下の手順が必要です：

1. **コンテナの定義**: `@container`または`container-type`でコンテナを定義
2. **クエリの適用**: コンテナのサイズに応じたスタイルを指定
3. **ブレークポイントの設定**: 適切なサイズでの切り替えポイントを設定

:::syntax 基本的なコンテナクエリの構文

```css
/* コンテナの定義 */
.container-element {
  container-type: inline-size;
}

/* コンテナクエリの適用 */
@container (min-width: 300px) {
  .child-element {
    /* スタイル */
  }
}
```

Tailwind CSSでは以下のユーティリティクラスで実装できます

:::

### Tailwind CSSのコンテナクエリユーティリティ

Tailwind CSSでは、コンテナクエリ専用のユーティリティクラスが提供されています。これらを使用することで、CSS-in-JSやカスタムCSSを書くことなく、コンテナクエリを実装できます。

:::note Tailwind CSSのコンテナクエリクラス

- `@container`: コンテナを定義
- `@xs:`, `@sm:`, `@md:`, `@lg:`, `@xl:`: コンテナサイズ別のスタイル適用
- `container-type-normal`: 通常のコンテナタイプ
- `container-type-size`: サイズベースのコンテナタイプ

:::

## 🎨 コンテナクエリを動かして確認してみよう

それでは、実際にコンテナクエリを使用したカードコンポーネントを構築して、その効果を体験してみましょう。メディアクエリとコンテナクエリの違いを実感できる実装を行います。

:::step

1. HTMLファイルの作成

まず、基本的なHTMLファイルを作成します。

_container-query-demo.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>コンテナクエリデモ</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          containers: {
            'xs': '20rem',
            'sm': '24rem',
            'md': '28rem',
            'lg': '32rem',
            'xl': '36rem',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-100 p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">コンテナクエリデモ</h1>

    <!-- メインレイアウトエリア -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- メインコンテンツ -->
      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">メインコンテンツエリア</h2>
        <div class="@container">
          <!-- カードコンポーネント -->
          <div class="card-component">
            <!-- カード内容はここで定義 -->
          </div>
        </div>
      </div>

      <!-- サイドバー -->
      <div class="lg:col-span-1">
        <h2 class="text-xl font-semibold mb-4">サイドバー</h2>
        <div class="@container">
          <!-- 同じカードコンポーネント -->
          <div class="card-component">
            <!-- カード内容はここで定義 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

2. カードコンポーネントの実装

次に、コンテナクエリを使用したレスポンシブなカードコンポーネントを実装します。

_container-query-demo.html_
```html
<!-- カードコンポーネントの定義 -->
<div class="card-component bg-white rounded-lg shadow-md overflow-hidden
            @xs:p-4 @sm:p-6
            @xs:space-y-3 @sm:space-y-4">

  <!-- 画像エリア -->
  <div class="@sm:flex @sm:gap-4">
    <div class="@xs:w-full @sm:w-32 @sm:flex-shrink-0">
      <img src="https://picsum.photos/400/200"
           alt="サンプル画像"
           class="w-full h-48 @sm:h-24 @sm:w-32 object-cover rounded">
    </div>

    <!-- コンテンツエリア -->
    <div class="@xs:mt-3 @sm:mt-0 @sm:flex-1">
      <h3 class="@xs:text-lg @sm:text-xl font-semibold text-gray-900">
        コンテナクエリ対応カード
      </h3>

      <p class="@xs:text-sm @sm:text-base text-gray-600 mt-2">
        このカードはコンテナのサイズに応じてレイアウトが変化します。
        狭いコンテナでは縦並び、広いコンテナでは横並びになります。
      </p>

      <!-- アクションボタン -->
      <div class="@xs:mt-3 @sm:mt-4">
        <button class="@xs:w-full @sm:w-auto
                       bg-blue-600 hover:bg-blue-700
                       text-white px-4 py-2 rounded
                       @xs:text-sm @sm:text-base
                       transition-colors">
          詳細を見る
        </button>
      </div>
    </div>
  </div>
</div>
```

3. スタイルの調整と確認

ブラウザでファイルを開き、ウィンドウサイズを変更してコンテナクエリの動作を確認します。

_ブラウザでの確認ポイント_
- メインエリアとサイドバーで同じカードが異なるレイアウトで表示される
- ウィンドウサイズを変更してもコンテナサイズに応じて適切に表示される
- 開発者ツールでコンテナサイズとスタイルの関係を確認する

4. 動的コンテナサイズの実装

JavaScriptを使用してコンテナサイズを動的に変更できる機能を追加します。

_container-query-demo.html_
```html
<!-- コントロールパネルの追加 -->
<div class="mb-8 p-4 bg-white rounded-lg shadow-md">
  <h3 class="text-lg font-semibold mb-4">コンテナサイズ制御</h3>
  <div class="flex gap-4">
    <button onclick="setContainerWidth('300px')"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      狭いコンテナ (300px)
    </button>
    <button onclick="setContainerWidth('500px')"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
      中サイズコンテナ (500px)
    </button>
    <button onclick="setContainerWidth('800px')"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
      広いコンテナ (800px)
    </button>
  </div>
</div>

<script>
function setContainerWidth(width) {
  const containers = document.querySelectorAll('.dynamic-container');
  containers.forEach(container => {
    container.style.width = width;
  });
}
</script>
```

:::

これで、コンテナクエリの基本的な動作を確認できるデモが完成しました。実際にブラウザで動作を確認することで、メディアクエリとコンテナクエリの違いを体感できます。

## 🏗️ 実践的なコンテナクエリパターン

コンテナクエリの真価は、実際のWebサイトで使用される実践的なパターンで発揮されます。ここでは、よく使用される代表的なパターンを学習し、実装してみましょう。

### モジュラーカードレイアウト

異なるサイズのグリッドセルに配置されるカードコンポーネントで、コンテナクエリの効果を最大限に活用できます。同じカードコンポーネントが、配置される場所に応じて最適なレイアウトを自動選択します。

:::step

1. グリッドレイアウトの基盤作成

複数のサイズのグリッドセルを持つレイアウトを作成します。

_modular-layout-demo.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>モジュラーレイアウトデモ</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">モジュラーカードレイアウト</h1>

    <!-- グリッドレイアウト -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 大きなカード (2x2) -->
      <div class="md:col-span-2 lg:row-span-2 @container">
        <div class="featured-card h-full">
          <!-- 特集カードコンテンツ -->
        </div>
      </div>

      <!-- 標準カード -->
      <div class="@container">
        <div class="standard-card">
          <!-- 標準カードコンテンツ -->
        </div>
      </div>

      <!-- 標準カード -->
      <div class="@container">
        <div class="standard-card">
          <!-- 標準カードコンテンツ -->
        </div>
      </div>

      <!-- 横長カード (2x1) -->
      <div class="md:col-span-2 @container">
        <div class="wide-card">
          <!-- 横長カードコンテンツ -->
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

2. 汎用カードコンポーネントの実装

コンテナサイズに応じて最適なレイアウトを選択するカードコンポーネントを作成します。

_modular-layout-demo.html_
```html
<!-- 汎用カードコンポーネントのスタイル定義 -->
<style>
.adaptive-card {
  @apply bg-white rounded-xl shadow-lg overflow-hidden h-full;
}

/* 小さなコンテナ用 */
.adaptive-card {
  @apply @xs:p-4 @xs:space-y-3;
}

/* 中サイズコンテナ用 */
.adaptive-card {
  @apply @md:p-6 @md:space-y-4;
}

/* 大きなコンテナ用 */
.adaptive-card {
  @apply @lg:p-8 @lg:space-y-6;
}
</style>

<!-- カードコンポーネントテンプレート -->
<div class="adaptive-card">
  <!-- 画像エリア -->
  <div class="@xs:h-32 @md:h-40 @lg:h-48 @xl:h-56">
    <img src="https://picsum.photos/600/400"
         alt="カード画像"
         class="w-full h-full object-cover">
  </div>

  <!-- コンテンツエリア -->
  <div>
    <h3 class="@xs:text-lg @md:text-xl @lg:text-2xl font-bold text-gray-900">
      アダプティブカードタイトル
    </h3>

    <p class="@xs:text-sm @md:text-base @lg:text-lg text-gray-600
              @xs:line-clamp-2 @md:line-clamp-3 @lg:line-clamp-none">
      このカードはコンテナのサイズに応じて、画像サイズ、テキストサイズ、
      パディング、行数制限などが自動調整されます。
    </p>
  </div>

  <!-- アクションエリア -->
  <div class="@xs:pt-2 @md:pt-4 @lg:pt-6">
    <div class="@xs:flex @xs:flex-col @md:flex-row @md:items-center @md:justify-between gap-3">
      <div class="@xs:text-sm @md:text-base text-gray-500">
        2024年1月15日
      </div>
      <button class="@xs:w-full @md:w-auto
                     bg-blue-600 hover:bg-blue-700 text-white
                     @xs:px-3 @xs:py-2 @md:px-4 @md:py-2 @lg:px-6 @lg:py-3
                     @xs:text-sm @md:text-base
                     rounded-lg transition-colors">
        詳細を見る
      </button>
    </div>
  </div>
</div>
```

:::

### ナビゲーションコンポーネントの応用

ナビゲーションメニューでコンテナクエリを活用することで、利用可能なスペースに応じて表示形式を動的に変更できます。

:::note ナビゲーションでのコンテナクエリ活用例

- **広いスペース**: 水平メニューで全項目を表示
- **中程度のスペース**: 重要項目のみ表示し、その他はドロップダウン
- **狭いスペース**: ハンバーガーメニューに集約

:::

## 🔧 ブラウザサポートと代替手法

コンテナクエリは比較的新しい技術のため、ブラウザサポートの現状と、サポートしていないブラウザへの対応方法を理解しておくことが重要です。

### ブラウザサポート状況

**サポート済み**:
- Chrome 105+ (2022年9月～)
- Firefox 110+ (2023年2月～)
- Safari 16+ (2022年9月～)

**部分サポート**:
- 古いバージョンでは`@supports`による機能検出が必要

:::warning ブラウザ互換性の注意点

コンテナクエリを本格的に使用する前に、対象ユーザーのブラウザ環境を確認してください。特に企業向けWebアプリケーションでは、古いブラウザのサポートが必要な場合があります。

:::

### フォールバック戦略

コンテナクエリがサポートされていない環境での代替手法を実装しておくことで、すべてのユーザーに適切な体験を提供できます。

:::step

1. 機能検出の実装

CSS `@supports`を使用してコンテナクエリのサポートを検出し、適切なフォールバックを提供します。

_fallback-strategy.html_
```html
<style>
/* コンテナクエリ非対応の場合のフォールバック */
.card-component {
  @apply bg-white rounded-lg shadow-md p-4;
}

.card-content {
  @apply space-y-3;
}

/* コンテナクエリ対応の場合の拡張スタイル */
@supports (container-type: inline-size) {
  .container-query-card {
    @apply @container;
  }

  .card-component {
    @apply @sm:p-6 @md:flex @md:gap-4;
  }

  .card-image {
    @apply @md:w-1/3 @md:flex-shrink-0;
  }

  .card-content {
    @apply @md:flex-1 @md:space-y-4;
  }
}
</style>
```

2. JavaScript による動的サポート検出

より柔軟な対応のため、JavaScriptでコンテナクエリサポートを検出し、適切なクラスを適用します。

_fallback-strategy.html_
```html
<script>
// コンテナクエリサポート検出
function detectContainerQuerySupport() {
  if (CSS.supports('container-type: inline-size')) {
    document.documentElement.classList.add('supports-container-queries');
    return true;
  } else {
    document.documentElement.classList.add('no-container-queries');
    return false;
  }
}

// ページロード時に検出実行
document.addEventListener('DOMContentLoaded', () => {
  const hasSupport = detectContainerQuerySupport();

  if (!hasSupport) {
    // フォールバック用のイベントリスナーを設定
    window.addEventListener('resize', handleResizeForFallback);
  }
});

// フォールバック用のリサイズハンドラ
function handleResizeForFallback() {
  const cards = document.querySelectorAll('.fallback-card');
  cards.forEach(card => {
    const containerWidth = card.parentElement.offsetWidth;

    if (containerWidth < 400) {
      card.classList.add('narrow-layout');
      card.classList.remove('wide-layout');
    } else {
      card.classList.add('wide-layout');
      card.classList.remove('narrow-layout');
    }
  });
}
</script>
```

:::

## 🎯 パフォーマンスとベストプラクティス

コンテナクエリを効果的に活用するためには、パフォーマンスへの影響を理解し、適切な実装パターンを選択することが重要です。

### パフォーマンス考慮事項

**レイアウト再計算の最小化**: コンテナクエリはレイアウト変更時に再計算が発生するため、過度に複雑な条件は避けるべきです。**コンテナの階層設計**: 深いネストのコンテナクエリは計算コストが高くなる可能性があります。**適切なブレークポイント設定**: 必要最小限のブレークポイントで効果的なレスポンシブデザインを実現しましょう。

:::tip パフォーマンス最適化のポイント

- コンテナクエリの使用は本当に必要な場面に限定する
- 複雑な条件分岐よりもシンプルなパターンを優先する
- 開発者ツールでレンダリングパフォーマンスを定期的に確認する
- CSSの詳細度を適切に管理し、予期しないスタイル競合を避ける

:::

### 実装時の設計指針

効果的なコンテナクエリ実装のための設計指針を確立することで、保守性の高いコードを作成できます。

:::note コンテナクエリ設計の指針

- **単一責任の原則**: 各コンテナクエリは明確な目的を持つ
- **予測可能な動作**: レイアウト変更が開発者にとって理解しやすい
- **段階的な拡張**: 基本レイアウトから段階的に機能を追加
- **一貫性のあるブレークポイント**: プロジェクト全体で統一されたサイズ設定

:::

## まとめ

コンテナクエリ（@container）は、従来のメディアクエリでは実現できなかった、コンポーネント単位でのレスポンシブデザインを可能にする画期的な技術です。

:::note 要点のまとめ

- コンテナクエリは親要素のサイズを基準とした条件分岐が可能
- Tailwind CSSで`@container`ディレクティブと専用ユーティリティを活用
- モジュラーレイアウトとカードコンポーネントで真価を発揮
- ブラウザサポートと代替手法の両方を考慮した実装が重要
- パフォーマンスを意識したシンプルな設計指針を遵守

:::

コンテナクエリをマスターすることで、より柔軟で再利用可能なコンポーネント設計が可能になり、モダンWebデザインの新たな可能性を開拓できます。

次の章では、コンテナクエリと組み合わせて効果的な[コンテナ/幅・余白の設計](./container-width-spacing.md)について学習します。

## 関連リンク

- [Flexbox設計パターン](./flex-patterns.md)
- [Gridレイアウト設計](./grid-patterns.md)
- [レスポンシブデザイン基礎](../tailwind-basics/responsive-design.md)
- [配色とテーマ設計](./color-theming.md)

## さらに深く学習したい方へ

このコンテナクエリの内容をより深く理解し、実際のプロジェクトで活用したい方は、実践的なワークショップやメンタリングを通じて、個別指導を受けることをお勧めします。モダンレスポンシブデザインの最新技術と、実際の開発現場で必要となるスキルとノウハウを体系的に習得できます。