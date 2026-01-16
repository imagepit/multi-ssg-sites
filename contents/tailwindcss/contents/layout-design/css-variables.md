---
title: CSS変数×Tailwindの連携
slug: css-variables
parent: layout-design
file_path: layout-design/css-variables
target_user: "Webデザイナー、フロントエンドエンジニア、UIUXデザイナー（経験1-3年）"
goal: "CSS変数とTailwind CSSを組み合わせて、動的テーマシステムの構築と実行時スタイル変更を実現し、保守性の高いスタイル管理を習得する"
status: published
post_type: pages
seo_title: "CSS変数×Tailwind CSS連携完全ガイド | 動的テーマとダイナミックスタイル実装"
seo_keywords: "CSS変数, Tailwind CSS, CSS Custom Properties, 動的テーマ, ダイナミックスタイル, テーマ切り替え, JavaScript連携, マルチテナント"
seo_description: "CSS変数とTailwind CSSを組み合わせた動的テーマシステムの構築方法を詳しく解説。実行時のスタイル変更から複数ブランドテーマ対応まで、実践的なハンズオンで学習できます。"
handson_overview: "CSS変数を活用したダイナミックテーマシステムを構築し、JavaScript連携による実行時スタイル変更とマルチブランドテーマ切り替えを実装します。"
---

## 🎨 はじめに

CSS変数（CSS Custom Properties）とTailwind CSSを組み合わせることで、従来の静的なスタイル管理から動的で柔軟なデザインシステムへと進化させることができます。この連携により、実行時にテーマを切り替えたり、ユーザーの設定に応じてスタイルを変更したりする高度なWebアプリケーションを構築できるようになります。

CSS変数の導入により、ハードコーディングされたカラー値やサイズ値から解放され、保守性と拡張性を大幅に向上させることができます。また、Tailwind CSSの設定ファイルとCSS変数を連携させることで、デザインシステム全体を統一的に管理できるようになります。

### このページで学べる事

このページでは、CSS変数とTailwind CSSの連携による動的スタイル管理の実装方法を習得します。

:::note 学習内容

- CSS変数の基本概念とTailwind CSSとの連携方法
- 動的テーマシステムの設計と実装手法
- JavaScript連携による実行時スタイル変更
- 複数ブランドテーマとマルチテナント対応
- パフォーマンスを考慮したCSS変数の活用方法
- 実践的なダイナミックテーマ切り替えシステムの構築

:::

## 🔧 CSS変数とTailwind CSSの基本連携

CSS変数とTailwind CSSの連携は、設定ファイル内でCSS変数を参照することから始まります。この手法により、実行時に変数値を変更することで、即座にサイト全体のスタイルを更新できるようになります。

Tailwind CSSの設定ファイルでは、カラーパレットやスペーシング、フォントサイズなどの値をCSS変数として定義できます。これらの変数は、JavaScriptやユーザーインタラクションによって動的に変更可能です。

:::note CSS変数とは

CSS変数（CSS Custom Properties）は、CSS内で再利用可能な値を定義する仕組みです。`--variable-name: value`の形式で定義し、`var(--variable-name)`で参照します。スコープ概念があり、要素に応じて値を変更できる特徴があります。

:::

### Tailwind CSS設定でのCSS変数活用

Tailwind CSSの設定ファイルでCSS変数を参照することで、動的なデザインシステムの基盤を構築できます。カラーパレットやタイポグラフィ、スペーシングなどの主要なデザイントークンを変数化することで、テーマ切り替えや個別カスタマイズに対応できます。

設定ファイル内での変数参照により、ビルド時にハードコーディングされる値を実行時に変更可能な変数に置き換えることができます。この手法により、同一のCSSバンドルで複数のテーマやブランドスタイルに対応できるようになります。

### CSS変数を活用したテーマシステムを構築してみよう

CSS変数とTailwind CSSを組み合わせた基本的なテーマシステムを実装して、その仕組みを理解しましょう。

:::step

1. プロジェクトフォルダの作成

任意の場所（デスクトップなど）で`css-variables-tailwind`フォルダを作成し、プロジェクトを初期化します。

_コマンド実行_
```bash
mkdir css-variables-tailwind
cd css-variables-tailwind
npm init -y
```

2. 必要なパッケージのインストール

Tailwind CSSと開発用のパッケージをインストールします。

_コマンド実行_
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Tailwind CSS設定ファイルの編集

CSS変数を活用したテーマシステムに対応する設定を追加します。

_tailwind.config.js_
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // CSS変数を参照するカラーパレット
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          50: 'var(--color-secondary-50)',
          500: 'var(--color-secondary-500)',
          900: 'var(--color-secondary-900)',
        },
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        }
      },
      spacing: {
        // CSS変数を参照するスペーシング
        'dynamic-sm': 'var(--spacing-sm)',
        'dynamic-md': 'var(--spacing-md)',
        'dynamic-lg': 'var(--spacing-lg)',
      },
      fontSize: {
        // CSS変数を参照するフォントサイズ
        'dynamic-sm': 'var(--font-size-sm)',
        'dynamic-base': 'var(--font-size-base)',
        'dynamic-lg': 'var(--font-size-lg)',
        'dynamic-xl': 'var(--font-size-xl)',
      }
    },
  },
  plugins: [],
}
```

4. 基本CSS変数の定義

CSS変数を定義し、デフォルトテーマとダークテーマの切り替えに対応します。

_src/styles/variables.css_
```css
/* デフォルトテーマ（ライトテーマ） */
:root {
  /* プライマリカラー */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;

  /* セカンダリカラー */
  --color-secondary-50: #f0fdf4;
  --color-secondary-500: #22c55e;
  --color-secondary-900: #14532d;

  /* ベースカラー */
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;

  /* スペーシング */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* フォントサイズ */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}

/* ダークテーマ */
[data-theme="dark"] {
  /* プライマリカラー */
  --color-primary-50: #1e3a8a;
  --color-primary-100: #1e40af;
  --color-primary-500: #3b82f6;
  --color-primary-600: #60a5fa;
  --color-primary-900: #dbeafe;

  /* セカンダリカラー */
  --color-secondary-50: #14532d;
  --color-secondary-500: #22c55e;
  --color-secondary-900: #bbf7d0;

  /* ベースカラー */
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
}

/* 企業ブランドテーマ */
[data-theme="corporate"] {
  /* プライマリカラー */
  --color-primary-50: #fef2f2;
  --color-primary-100: #fee2e2;
  --color-primary-500: #ef4444;
  --color-primary-600: #dc2626;
  --color-primary-900: #7f1d1d;

  /* セカンダリカラー */
  --color-secondary-50: #fff7ed;
  --color-secondary-500: #f97316;
  --color-secondary-900: #9a3412;

  /* フォントサイズを大きく調整 */
  --font-size-sm: 1rem;
  --font-size-base: 1.125rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
}
```

5. メインCSSファイルの作成

Tailwind CSSと変数定義を組み合わせたメインスタイルシートを作成します。

_src/styles/main.css_
```css
@import './variables.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムコンポーネントクラス */
@layer components {
  .theme-card {
    @apply bg-surface p-dynamic-md rounded-lg shadow-md border border-primary-100;
  }

  .theme-button {
    @apply px-dynamic-md py-dynamic-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors;
  }

  .theme-heading {
    @apply text-dynamic-xl font-bold text-text-primary mb-dynamic-sm;
  }

  .theme-text {
    @apply text-dynamic-base text-text-secondary;
  }
}
```

6. HTMLデモページの作成

テーマ切り替え機能を持つデモページを作成します。

_src/index.html_
```html
<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS変数×Tailwind テーマシステム</title>
  <link href="./styles/main.css" rel="stylesheet">
</head>
<body class="bg-background min-h-screen transition-colors duration-300">
  <div class="container mx-auto p-dynamic-lg">
    <!-- ヘッダー -->
    <header class="mb-dynamic-lg">
      <h1 class="theme-heading text-center">CSS変数×Tailwind テーマシステム</h1>

      <!-- テーマ切り替えボタン -->
      <div class="flex justify-center gap-dynamic-sm mb-dynamic-md">
        <button onclick="setTheme('light')" class="theme-button">
          ライトテーマ
        </button>
        <button onclick="setTheme('dark')" class="theme-button bg-secondary-500 hover:bg-secondary-600">
          ダークテーマ
        </button>
        <button onclick="setTheme('corporate')" class="theme-button bg-red-500 hover:bg-red-600">
          企業テーマ
        </button>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="grid md:grid-cols-2 gap-dynamic-md">
      <!-- カード1 -->
      <div class="theme-card">
        <h2 class="theme-heading">動的カラーシステム</h2>
        <p class="theme-text mb-dynamic-sm">
          CSS変数を活用することで、実行時にカラーパレット全体を変更できます。
        </p>
        <div class="flex gap-2 mb-dynamic-sm">
          <div class="w-8 h-8 bg-primary-500 rounded"></div>
          <div class="w-8 h-8 bg-primary-600 rounded"></div>
          <div class="w-8 h-8 bg-secondary-500 rounded"></div>
        </div>
        <button class="theme-button">プライマリボタン</button>
      </div>

      <!-- カード2 -->
      <div class="theme-card">
        <h2 class="theme-heading">スペーシングシステム</h2>
        <p class="theme-text mb-dynamic-sm">
          スペーシングも動的に調整できるため、デバイスやコンテキストに応じた最適な間隔を提供できます。
        </p>
        <div class="bg-primary-50 p-dynamic-sm rounded mb-dynamic-sm">
          <div class="bg-primary-500 h-4 rounded"></div>
        </div>
        <button class="theme-button bg-secondary-500 hover:bg-secondary-600">
          セカンダリボタン
        </button>
      </div>

      <!-- カード3 -->
      <div class="theme-card">
        <h2 class="theme-heading">タイポグラフィシステム</h2>
        <p class="theme-text mb-dynamic-sm">
          フォントサイズもテーマに応じて調整され、読みやすさとブランドイメージを両立できます。
        </p>
        <div class="space-y-2">
          <p class="text-dynamic-sm">スモールテキスト</p>
          <p class="text-dynamic-base">ベーステキスト</p>
          <p class="text-dynamic-lg">ラージテキスト</p>
        </div>
      </div>

      <!-- カード4 -->
      <div class="theme-card">
        <h2 class="theme-heading">リアルタイム更新</h2>
        <p class="theme-text mb-dynamic-sm">
          JavaScriptとの連携により、ユーザーインタラクションに応じてテーマを即座に変更できます。
        </p>
        <div class="flex gap-dynamic-sm">
          <input type="color" id="colorPicker" value="#3b82f6" class="w-12 h-8 rounded border">
          <button onclick="updateCustomColor()" class="theme-button flex-1">
            カスタムカラー適用
          </button>
        </div>
      </div>
    </main>

    <!-- フッター -->
    <footer class="mt-dynamic-lg text-center">
      <p class="theme-text">現在のテーマ: <span id="currentTheme" class="font-semibold text-primary-600">light</span></p>
    </footer>
  </div>

  <script src="./scripts/theme.js"></script>
</body>
</html>
```

7. テーマ切り替えJavaScriptの実装

動的なテーマ切り替えとカスタムカラー機能を実装します。

_src/scripts/theme.js_
```javascript
// テーマ管理システム
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    // 保存されたテーマを復元
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    this.updateThemeDisplay();
  }

  setTheme(themeName) {
    const html = document.documentElement;
    html.setAttribute('data-theme', themeName);
    this.currentTheme = themeName;

    // テーマをローカルストレージに保存
    localStorage.setItem('theme', themeName);

    // 表示を更新
    this.updateThemeDisplay();

    // アニメーション効果
    this.animateThemeChange();
  }

  updateThemeDisplay() {
    const themeDisplay = document.getElementById('currentTheme');
    if (themeDisplay) {
      themeDisplay.textContent = this.currentTheme;
    }
  }

  animateThemeChange() {
    // テーマ変更時のフェードエフェクト
    document.body.style.opacity = '0.8';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  }

  updateCustomColor() {
    const colorPicker = document.getElementById('colorPicker');
    const selectedColor = colorPicker.value;

    // HSLに変換してカラーパレットを生成
    const hsl = this.hexToHsl(selectedColor);
    const colorVariants = this.generateColorVariants(hsl);

    // CSS変数を動的に更新
    const root = document.documentElement;
    Object.entries(colorVariants).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });

    // フィードバック表示
    this.showColorUpdateFeedback();
  }

  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  generateColorVariants(hsl) {
    const [h, s, l] = hsl;
    return {
      '50': `hsl(${h}, ${s}%, 97%)`,
      '100': `hsl(${h}, ${s}%, 94%)`,
      '500': `hsl(${h}, ${s}%, ${l}%)`,
      '600': `hsl(${h}, ${s}%, ${Math.max(l - 10, 10)}%)`,
      '900': `hsl(${h}, ${s}%, ${Math.max(l - 40, 5)}%)`,
    };
  }

  showColorUpdateFeedback() {
    // 成功フィードバックの表示
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-secondary-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity';
    feedback.textContent = 'カスタムカラーを適用しました！';

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }
}

// グローバル関数
const themeManager = new ThemeManager();

function setTheme(themeName) {
  themeManager.setTheme(themeName);
}

function updateCustomColor() {
  themeManager.updateCustomColor();
}

// キーボードショートカット
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case '1':
        e.preventDefault();
        setTheme('light');
        break;
      case '2':
        e.preventDefault();
        setTheme('dark');
        break;
      case '3':
        e.preventDefault();
        setTheme('corporate');
        break;
    }
  }
});
```

8. ビルドスクリプトの設定

開発用のビルドスクリプトを設定します。

_package.json（scriptsセクションを追加）_
```json
{
  "scripts": {
    "build": "tailwindcss -i ./src/styles/main.css -o ./dist/styles.css --watch",
    "dev": "tailwindcss -i ./src/styles/main.css -o ./dist/styles.css --watch"
  }
}
```

9. CSSのビルドと動作確認

Tailwind CSSをビルドし、ブラウザで動作を確認します。

_コマンド実行_
```bash
npm run build
```

HTMLファイルのlink要素を更新して、ビルドされたCSSを参照するようにします。

_src/index.html（linkタグを更新）_
```html
<link href="../dist/styles.css" rel="stylesheet">
```

10. ブラウザでテスト

ブラウザで`src/index.html`を開き、テーマ切り替えとカスタムカラー機能をテストします。

:::

この基本実装により、CSS変数とTailwind CSSを連携させた動的テーマシステムの仕組みを理解できました。テーマ切り替えボタンをクリックしたり、カスタムカラーピッカーを使用したりして、リアルタイムでスタイルが変更される様子を確認できます。

## 🚀 JavaScript連携による実行時スタイル変更

JavaScript連携により、ユーザーのインタラクションやアプリケーションの状態に応じて、実行時にスタイルを動的に変更できます。この機能により、パーソナライゼーションやコンテキストに応じたUI調整が可能になります。

実行時のスタイル変更では、CSS変数の値をJavaScriptから直接操作することで、即座に全体のデザインを更新できます。これにより、ユーザー設定の反映、状態に応じたテーマ変更、デバイス特性への適応などが実現できます。

### リアルタイムカラーカスタマイゼーションシステム

ユーザーが色を選択して、即座にサイト全体のカラーパレットを変更できる高度なカスタマイゼーションシステムを実装します。

:::note パフォーマンス考慮事項

CSS変数の変更は即座にブラウザに反映されますが、大量の要素がある場合は再描画コストが発生します。スロットリングやデバウンシングを活用して、パフォーマンスを最適化することが重要です。

:::

### アドバンスドテーマカスタマイゼーションを実装してみよう

ユーザーが詳細なテーマ設定を行い、リアルタイムでプレビューできる高度なシステムを構築しましょう。

:::step

1. カスタマイゼーション用HTMLの追加

先ほどのプロジェクトに、詳細なテーマカスタマイゼーション機能を追加します。

_src/customizer.html_
```html
<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>アドバンスドテーマカスタマイザー</title>
  <link href="../dist/styles.css" rel="stylesheet">
  <style>
    .color-picker-group {
      @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
    }

    .slider-container {
      @apply space-y-2;
    }

    .preview-section {
      @apply sticky top-4;
    }
  </style>
</head>
<body class="bg-background min-h-screen transition-all duration-300">
  <div class="container mx-auto p-4">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-center text-text-primary mb-4">
        アドバンスドテーマカスタマイザー
      </h1>
      <div class="flex justify-center gap-4 mb-6">
        <button onclick="resetToDefaults()" class="theme-button bg-gray-500 hover:bg-gray-600">
          デフォルトに戻す
        </button>
        <button onclick="exportTheme()" class="theme-button bg-secondary-500 hover:bg-secondary-600">
          テーマをエクスポート
        </button>
        <button onclick="importTheme()" class="theme-button bg-yellow-500 hover:bg-yellow-600">
          テーマをインポート
        </button>
      </div>
    </header>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- カスタマイゼーションパネル -->
      <div class="space-y-6">
        <!-- カラーカスタマイゼーション -->
        <section class="theme-card">
          <h2 class="theme-heading">カラーパレット</h2>

          <div class="color-picker-group">
            <!-- プライマリカラー -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-text-primary">プライマリカラー</label>
              <input type="color" id="primaryColor" value="#3b82f6"
                     onchange="updateColorPalette('primary', this.value)"
                     class="w-full h-10 rounded border cursor-pointer">
              <div class="flex gap-1">
                <div class="color-swatch bg-primary-50" data-color="primary-50"></div>
                <div class="color-swatch bg-primary-100" data-color="primary-100"></div>
                <div class="color-swatch bg-primary-500" data-color="primary-500"></div>
                <div class="color-swatch bg-primary-600" data-color="primary-600"></div>
                <div class="color-swatch bg-primary-900" data-color="primary-900"></div>
              </div>
            </div>

            <!-- セカンダリカラー -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-text-primary">セカンダリカラー</label>
              <input type="color" id="secondaryColor" value="#22c55e"
                     onchange="updateColorPalette('secondary', this.value)"
                     class="w-full h-10 rounded border cursor-pointer">
              <div class="flex gap-1">
                <div class="color-swatch bg-secondary-50" data-color="secondary-50"></div>
                <div class="color-swatch bg-secondary-500" data-color="secondary-500"></div>
                <div class="color-swatch bg-secondary-900" data-color="secondary-900"></div>
              </div>
            </div>
          </div>

          <!-- 背景色設定 -->
          <div class="mt-6 space-y-4">
            <h3 class="text-lg font-semibold text-text-primary">背景色</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">メイン背景</label>
                <input type="color" id="backgroundColor" value="#ffffff"
                       onchange="updateBackgroundColor('background', this.value)"
                       class="w-full h-8 rounded border cursor-pointer">
              </div>
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">サーフェス</label>
                <input type="color" id="surfaceColor" value="#f8fafc"
                       onchange="updateBackgroundColor('surface', this.value)"
                       class="w-full h-8 rounded border cursor-pointer">
              </div>
            </div>
          </div>
        </section>

        <!-- タイポグラフィカスタマイゼーション -->
        <section class="theme-card">
          <h2 class="theme-heading">タイポグラフィ</h2>

          <div class="slider-container">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                ベースフォントサイズ: <span id="baseFontSizeValue">16px</span>
              </label>
              <input type="range" id="baseFontSize" min="12" max="24" value="16" step="1"
                     oninput="updateFontSize('base', this.value)"
                     class="w-full accent-primary-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                見出しスケール: <span id="headingScaleValue">1.25</span>
              </label>
              <input type="range" id="headingScale" min="1.1" max="1.8" value="1.25" step="0.05"
                     oninput="updateHeadingScale(this.value)"
                     class="w-full accent-primary-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                行間: <span id="lineHeightValue">1.5</span>
              </label>
              <input type="range" id="lineHeight" min="1.2" max="2.0" value="1.5" step="0.1"
                     oninput="updateLineHeight(this.value)"
                     class="w-full accent-primary-500">
            </div>
          </div>
        </section>

        <!-- スペーシングカスタマイゼーション -->
        <section class="theme-card">
          <h2 class="theme-heading">スペーシング</h2>

          <div class="slider-container">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                スモール: <span id="spacingSmValue">8px</span>
              </label>
              <input type="range" id="spacingSm" min="4" max="16" value="8" step="2"
                     oninput="updateSpacing('sm', this.value)"
                     class="w-full accent-primary-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                ミディアム: <span id="spacingMdValue">16px</span>
              </label>
              <input type="range" id="spacingMd" min="8" max="32" value="16" step="4"
                     oninput="updateSpacing('md', this.value)"
                     class="w-full accent-primary-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                ラージ: <span id="spacingLgValue">32px</span>
              </label>
              <input type="range" id="spacingLg" min="16" max="64" value="32" step="8"
                     oninput="updateSpacing('lg', this.value)"
                     class="w-full accent-primary-500">
            </div>
          </div>
        </section>

        <!-- アニメーション設定 -->
        <section class="theme-card">
          <h2 class="theme-heading">アニメーション</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-text-primary mb-2">
                アニメーション速度: <span id="animationSpeedValue">300ms</span>
              </label>
              <input type="range" id="animationSpeed" min="100" max="1000" value="300" step="50"
                     oninput="updateAnimationSpeed(this.value)"
                     class="w-full accent-primary-500">
            </div>

            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" id="enableAnimations" checked
                       onchange="toggleAnimations(this.checked)"
                       class="accent-primary-500">
                <span class="text-text-primary">アニメーションを有効にする</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      <!-- プレビューセクション -->
      <div class="preview-section">
        <section class="theme-card">
          <h2 class="theme-heading">リアルタイムプレビュー</h2>

          <!-- プレビューコンテンツ -->
          <div class="space-y-dynamic-md">
            <!-- ヘッダープレビュー -->
            <div class="bg-primary-500 text-white p-dynamic-md rounded-lg">
              <h3 class="text-dynamic-lg font-bold mb-2">ヘッダープレビュー</h3>
              <p class="text-dynamic-sm opacity-90">プライマリカラーが適用されたヘッダー</p>
            </div>

            <!-- カードプレビュー -->
            <div class="bg-surface p-dynamic-md rounded-lg border border-primary-100">
              <h4 class="text-dynamic-base font-semibold text-text-primary mb-dynamic-sm">
                サンプルカード
              </h4>
              <p class="text-dynamic-sm text-text-secondary mb-dynamic-sm">
                カスタマイズされたスペーシングとタイポグラフィが適用されています。
              </p>
              <div class="flex gap-dynamic-sm">
                <button class="theme-button">プライマリボタン</button>
                <button class="theme-button bg-secondary-500 hover:bg-secondary-600">
                  セカンダリボタン
                </button>
              </div>
            </div>

            <!-- テキストサンプル -->
            <div class="space-y-2">
              <h5 class="text-dynamic-xl font-bold text-text-primary">見出しXL</h5>
              <h6 class="text-dynamic-lg font-semibold text-text-primary">見出しLG</h6>
              <p class="text-dynamic-base text-text-primary">ベーステキスト</p>
              <p class="text-dynamic-sm text-text-secondary">スモールテキスト</p>
            </div>

            <!-- カラーパレット表示 -->
            <div class="grid grid-cols-5 gap-2">
              <div class="color-preview bg-primary-50" title="Primary 50"></div>
              <div class="color-preview bg-primary-100" title="Primary 100"></div>
              <div class="color-preview bg-primary-500" title="Primary 500"></div>
              <div class="color-preview bg-primary-600" title="Primary 600"></div>
              <div class="color-preview bg-primary-900" title="Primary 900"></div>
            </div>
          </div>
        </section>

        <!-- テーマ情報表示 -->
        <section class="theme-card mt-6">
          <h3 class="theme-heading">現在のテーマ設定</h3>
          <pre id="themeConfig" class="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
            {テーマ設定が表示されます}
          </pre>
        </section>
      </div>
    </div>
  </div>

  <script src="./scripts/theme.js"></script>
  <script src="./scripts/advanced-customizer.js"></script>
</body>
</html>
```

2. アドバンスドカスタマイザーJavaScriptの実装

高度なテーマカスタマイゼーション機能を実装します。

_src/scripts/advanced-customizer.js_
```javascript
// アドバンスドテーマカスタマイザー
class AdvancedThemeCustomizer {
  constructor() {
    this.currentConfig = this.getDefaultConfig();
    this.debounceTimer = null;
    this.init();
  }

  getDefaultConfig() {
    return {
      colors: {
        primary: '#3b82f6',
        secondary: '#22c55e',
        background: '#ffffff',
        surface: '#f8fafc'
      },
      typography: {
        baseFontSize: 16,
        headingScale: 1.25,
        lineHeight: 1.5
      },
      spacing: {
        sm: 8,
        md: 16,
        lg: 32
      },
      animation: {
        speed: 300,
        enabled: true
      }
    };
  }

  init() {
    this.loadSavedConfig();
    this.updateAllVariables();
    this.displayCurrentConfig();
    this.addColorSwatchListeners();
  }

  loadSavedConfig() {
    const saved = localStorage.getItem('advanced-theme-config');
    if (saved) {
      this.currentConfig = { ...this.getDefaultConfig(), ...JSON.parse(saved) };
      this.updateInputValues();
    }
  }

  updateInputValues() {
    // カラーピッカーの値を更新
    document.getElementById('primaryColor').value = this.currentConfig.colors.primary;
    document.getElementById('secondaryColor').value = this.currentConfig.colors.secondary;
    document.getElementById('backgroundColor').value = this.currentConfig.colors.background;
    document.getElementById('surfaceColor').value = this.currentConfig.colors.surface;

    // タイポグラフィスライダーの値を更新
    document.getElementById('baseFontSize').value = this.currentConfig.typography.baseFontSize;
    document.getElementById('headingScale').value = this.currentConfig.typography.headingScale;
    document.getElementById('lineHeight').value = this.currentConfig.typography.lineHeight;

    // スペーシングスライダーの値を更新
    document.getElementById('spacingSm').value = this.currentConfig.spacing.sm;
    document.getElementById('spacingMd').value = this.currentConfig.spacing.md;
    document.getElementById('spacingLg').value = this.currentConfig.spacing.lg;

    // アニメーション設定の値を更新
    document.getElementById('animationSpeed').value = this.currentConfig.animation.speed;
    document.getElementById('enableAnimations').checked = this.currentConfig.animation.enabled;
  }

  updateColorPalette(colorType, hexColor) {
    this.currentConfig.colors[colorType] = hexColor;

    const hsl = this.hexToHsl(hexColor);
    const variants = this.generateColorVariants(hsl);

    const root = document.documentElement;

    if (colorType === 'primary') {
      Object.entries(variants).forEach(([shade, color]) => {
        root.style.setProperty(`--color-primary-${shade}`, color);
      });
    } else if (colorType === 'secondary') {
      const secondaryVariants = {
        '50': variants['50'],
        '500': variants['500'],
        '900': variants['900']
      };
      Object.entries(secondaryVariants).forEach(([shade, color]) => {
        root.style.setProperty(`--color-secondary-${shade}`, color);
      });
    }

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  updateBackgroundColor(type, hexColor) {
    this.currentConfig.colors[type] = hexColor;
    const root = document.documentElement;
    root.style.setProperty(`--color-${type}`, hexColor);

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  updateFontSize(size, value) {
    this.currentConfig.typography.baseFontSize = parseInt(value);

    const root = document.documentElement;
    const baseSize = parseInt(value);
    const scale = this.currentConfig.typography.headingScale;

    root.style.setProperty('--font-size-sm', `${Math.round(baseSize * 0.875)}px`);
    root.style.setProperty('--font-size-base', `${baseSize}px`);
    root.style.setProperty('--font-size-lg', `${Math.round(baseSize * scale)}px`);
    root.style.setProperty('--font-size-xl', `${Math.round(baseSize * scale * scale)}px`);

    document.getElementById('baseFontSizeValue').textContent = `${baseSize}px`;

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  updateHeadingScale(value) {
    this.currentConfig.typography.headingScale = parseFloat(value);

    const root = document.documentElement;
    const baseSize = this.currentConfig.typography.baseFontSize;
    const scale = parseFloat(value);

    root.style.setProperty('--font-size-lg', `${Math.round(baseSize * scale)}px`);
    root.style.setProperty('--font-size-xl', `${Math.round(baseSize * scale * scale)}px`);

    document.getElementById('headingScaleValue').textContent = value;

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  updateLineHeight(value) {
    this.currentConfig.typography.lineHeight = parseFloat(value);

    const root = document.documentElement;
    root.style.setProperty('--line-height', value);

    // 既存の要素に行間を適用
    document.body.style.lineHeight = value;

    document.getElementById('lineHeightValue').textContent = value;

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  updateSpacing(size, value) {
    this.currentConfig.spacing[size] = parseInt(value);

    const root = document.documentElement;
    root.style.setProperty(`--spacing-${size}`, `${value}px`);

    document.getElementById(`spacing${size.charAt(0).toUpperCase() + size.slice(1)}Value`).textContent = `${value}px`;

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  updateAnimationSpeed(value) {
    this.currentConfig.animation.speed = parseInt(value);

    const root = document.documentElement;
    root.style.setProperty('--animation-speed', `${value}ms`);

    // トランジション時間を動的に更新
    const elements = document.querySelectorAll('[class*="transition"]');
    elements.forEach(el => {
      el.style.transitionDuration = `${value}ms`;
    });

    document.getElementById('animationSpeedValue').textContent = `${value}ms`;

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  toggleAnimations(enabled) {
    this.currentConfig.animation.enabled = enabled;

    const root = document.documentElement;

    if (enabled) {
      root.style.removeProperty('--animation-disabled');
      document.body.classList.remove('no-animations');
    } else {
      root.style.setProperty('--animation-disabled', 'none');
      document.body.classList.add('no-animations');
    }

    this.debouncedSave();
    this.displayCurrentConfig();
  }

  addColorSwatchListeners() {
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const colorClass = swatch.dataset.color;
        const computedStyle = getComputedStyle(swatch);
        const backgroundColor = computedStyle.backgroundColor;

        // 色情報をクリップボードにコピー
        navigator.clipboard.writeText(backgroundColor).then(() => {
          this.showToast(`${colorClass}: ${backgroundColor} をコピーしました`);
        });
      });
    });
  }

  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  generateColorVariants(hsl) {
    const [h, s, l] = hsl;
    return {
      '50': `hsl(${h}, ${Math.min(s, 60)}%, 97%)`,
      '100': `hsl(${h}, ${Math.min(s, 70)}%, 94%)`,
      '500': `hsl(${h}, ${s}%, ${l}%)`,
      '600': `hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l - 10, 10)}%)`,
      '900': `hsl(${h}, ${Math.min(s + 20, 100)}%, ${Math.max(l - 40, 5)}%)`,
    };
  }

  updateAllVariables() {
    const root = document.documentElement;

    // カラー変数の更新
    Object.entries(this.currentConfig.colors).forEach(([key, value]) => {
      if (key === 'primary' || key === 'secondary') {
        const hsl = this.hexToHsl(value);
        const variants = this.generateColorVariants(hsl);

        if (key === 'primary') {
          Object.entries(variants).forEach(([shade, color]) => {
            root.style.setProperty(`--color-primary-${shade}`, color);
          });
        } else {
          root.style.setProperty(`--color-secondary-50`, variants['50']);
          root.style.setProperty(`--color-secondary-500`, variants['500']);
          root.style.setProperty(`--color-secondary-900`, variants['900']);
        }
      } else {
        root.style.setProperty(`--color-${key}`, value);
      }
    });

    // タイポグラフィ変数の更新
    const { baseFontSize, headingScale, lineHeight } = this.currentConfig.typography;
    root.style.setProperty('--font-size-sm', `${Math.round(baseFontSize * 0.875)}px`);
    root.style.setProperty('--font-size-base', `${baseFontSize}px`);
    root.style.setProperty('--font-size-lg', `${Math.round(baseFontSize * headingScale)}px`);
    root.style.setProperty('--font-size-xl', `${Math.round(baseFontSize * headingScale * headingScale)}px`);
    root.style.setProperty('--line-height', lineHeight);

    // スペーシング変数の更新
    Object.entries(this.currentConfig.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, `${value}px`);
    });

    // アニメーション変数の更新
    root.style.setProperty('--animation-speed', `${this.currentConfig.animation.speed}ms`);
    if (!this.currentConfig.animation.enabled) {
      root.style.setProperty('--animation-disabled', 'none');
    }
  }

  displayCurrentConfig() {
    const configElement = document.getElementById('themeConfig');
    if (configElement) {
      configElement.textContent = JSON.stringify(this.currentConfig, null, 2);
    }
  }

  debouncedSave() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      localStorage.setItem('advanced-theme-config', JSON.stringify(this.currentConfig));
    }, 500);
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-primary-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  exportTheme() {
    const dataStr = JSON.stringify(this.currentConfig, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `custom-theme-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    this.showToast('テーマファイルをエクスポートしました');
  }

  importTheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedConfig = JSON.parse(e.target.result);
            this.currentConfig = { ...this.getDefaultConfig(), ...importedConfig };
            this.updateInputValues();
            this.updateAllVariables();
            this.displayCurrentConfig();
            this.debouncedSave();
            this.showToast('テーマをインポートしました');
          } catch (error) {
            this.showToast('テーマファイルの読み込みに失敗しました');
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }

  resetToDefaults() {
    this.currentConfig = this.getDefaultConfig();
    this.updateInputValues();
    this.updateAllVariables();
    this.displayCurrentConfig();
    this.debouncedSave();
    this.showToast('デフォルト設定に戻しました');
  }
}

// グローバル関数
const advancedCustomizer = new AdvancedThemeCustomizer();

function updateColorPalette(colorType, hexColor) {
  advancedCustomizer.updateColorPalette(colorType, hexColor);
}

function updateBackgroundColor(type, hexColor) {
  advancedCustomizer.updateBackgroundColor(type, hexColor);
}

function updateFontSize(size, value) {
  advancedCustomizer.updateFontSize(size, value);
}

function updateHeadingScale(value) {
  advancedCustomizer.updateHeadingScale(value);
}

function updateLineHeight(value) {
  advancedCustomizer.updateLineHeight(value);
}

function updateSpacing(size, value) {
  advancedCustomizer.updateSpacing(size, value);
}

function updateAnimationSpeed(value) {
  advancedCustomizer.updateAnimationSpeed(value);
}

function toggleAnimations(enabled) {
  advancedCustomizer.toggleAnimations(enabled);
}

function resetToDefaults() {
  advancedCustomizer.resetToDefaults();
}

function exportTheme() {
  advancedCustomizer.exportTheme();
}

function importTheme() {
  advancedCustomizer.importTheme();
}
```

3. カスタマイザー用CSSスタイルの追加

カスタマイザー専用のスタイルを追加します。

_src/styles/customizer.css_
```css
/* カスタマイザー専用スタイル */
.color-swatch {
  @apply w-8 h-8 rounded cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition-all;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-preview {
  @apply w-full h-12 rounded border;
}

.no-animations * {
  animation: none !important;
  transition: none !important;
}

/* スライダーのカスタムスタイル */
input[type="range"] {
  @apply appearance-none h-2 bg-gray-200 rounded-lg outline-none;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-primary-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-primary-500 rounded-full cursor-pointer border-none;
}

/* カラーピッカーのカスタムスタイル */
input[type="color"] {
  @apply appearance-none border-none cursor-pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  @apply p-0 border-none rounded;
}

input[type="color"]::-webkit-color-swatch {
  @apply border-none rounded;
}

/* アニメーション変数を利用したトランジション */
.theme-card,
.theme-button,
body {
  transition-duration: var(--animation-speed, 300ms);
}

[data-theme] {
  transition: background-color var(--animation-speed, 300ms) ease-in-out;
}
```

4. メインCSSファイルにカスタマイザースタイルをインポート

_src/styles/main.css（末尾に追加）_
```css
@import './customizer.css';
```

5. CSSを再ビルドして動作確認

_コマンド実行_
```bash
npm run build
```

ブラウザで`src/customizer.html`を開き、高度なテーマカスタマイゼーション機能をテストします。

:::

この高度なカスタマイゼーションシステムにより、ユーザーは詳細なテーマ設定を行い、リアルタイムでプレビューを確認できるようになりました。カラーパレット、タイポグラフィ、スペーシング、アニメーションまで、包括的なカスタマイゼーションが可能です。

## 🎯 複数ブランドテーマとマルチテナント対応

複数ブランドテーマ対応により、同一のコードベースで異なるブランドや顧客に応じたデザインを提供できます。この手法はSaaSアプリケーションやホワイトラベル製品において特に重要です。

マルチテナント対応では、テナントIDに基づいてテーマを動的に切り替え、ブランディングガイドラインに沿ったカスタマイゼーションを実現します。CSS変数を活用することで、効率的なテーマ管理と配信が可能になります。

:::note マルチテナントとは

マルチテナントは、単一のアプリケーションインスタンスを複数の顧客（テナント）が共有する仕組みです。各テナントは独自のデータとカスタマイゼーションを持ちながら、同じアプリケーションを利用します。

:::

### エンタープライズレベルのテーマ管理システム

企業向けの高度なテーマ管理システムを構築し、ブランドガイドライン遵守と効率的な運用を実現します。

### マルチブランドテーマ管理システムを構築してみよう

複数のブランドテーマを効率的に管理し、動的に切り替え可能なシステムを実装しましょう。

:::step

1. テナント設定ファイルの作成

各ブランド・テナントの設定を管理するJSONファイルを作成します。

_src/data/tenants.json_
```json
{
  "tenants": {
    "default": {
      "name": "デフォルトブランド",
      "slug": "default",
      "theme": {
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#22c55e",
          "accent": "#f59e0b",
          "background": "#ffffff",
          "surface": "#f8fafc",
          "text": {
            "primary": "#1f2937",
            "secondary": "#6b7280"
          }
        },
        "typography": {
          "fontFamily": "Inter, sans-serif",
          "baseFontSize": 16,
          "headingScale": 1.25,
          "lineHeight": 1.5
        },
        "spacing": {
          "base": 1,
          "scale": 1.5
        },
        "borderRadius": {
          "sm": "0.25rem",
          "md": "0.375rem",
          "lg": "0.5rem"
        },
        "shadows": {
          "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
        }
      },
      "branding": {
        "logo": "/logos/default-logo.svg",
        "favicon": "/favicons/default.ico",
        "companyName": "デフォルト株式会社"
      }
    },
    "tech-corp": {
      "name": "テックコーポレーション",
      "slug": "tech-corp",
      "theme": {
        "colors": {
          "primary": "#6366f1",
          "secondary": "#8b5cf6",
          "accent": "#06b6d4",
          "background": "#fafafa",
          "surface": "#ffffff",
          "text": {
            "primary": "#111827",
            "secondary": "#4b5563"
          }
        },
        "typography": {
          "fontFamily": "Roboto, sans-serif",
          "baseFontSize": 15,
          "headingScale": 1.3,
          "lineHeight": 1.6
        },
        "spacing": {
          "base": 1,
          "scale": 1.6
        },
        "borderRadius": {
          "sm": "0.125rem",
          "md": "0.25rem",
          "lg": "0.375rem"
        },
        "shadows": {
          "sm": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          "md": "0 4px 8px -2px rgb(0 0 0 / 0.1)",
          "lg": "0 12px 20px -4px rgb(0 0 0 / 0.1)"
        }
      },
      "branding": {
        "logo": "/logos/tech-corp-logo.svg",
        "favicon": "/favicons/tech-corp.ico",
        "companyName": "Tech Corporation Ltd."
      }
    },
    "creative-agency": {
      "name": "クリエイティブエージェンシー",
      "slug": "creative-agency",
      "theme": {
        "colors": {
          "primary": "#ec4899",
          "secondary": "#f97316",
          "accent": "#84cc16",
          "background": "#fefefe",
          "surface": "#f9fafb",
          "text": {
            "primary": "#1f2937",
            "secondary": "#6b7280"
          }
        },
        "typography": {
          "fontFamily": "Poppins, sans-serif",
          "baseFontSize": 16,
          "headingScale": 1.4,
          "lineHeight": 1.7
        },
        "spacing": {
          "base": 1,
          "scale": 1.8
        },
        "borderRadius": {
          "sm": "0.5rem",
          "md": "0.75rem",
          "lg": "1rem"
        },
        "shadows": {
          "sm": "0 2px 4px 0 rgb(0 0 0 / 0.06)",
          "md": "0 6px 12px -2px rgb(0 0 0 / 0.08)",
          "lg": "0 16px 24px -4px rgb(0 0 0 / 0.1)"
        }
      },
      "branding": {
        "logo": "/logos/creative-agency-logo.svg",
        "favicon": "/favicons/creative-agency.ico",
        "companyName": "Creative Agency Inc."
      }
    },
    "finance-pro": {
      "name": "ファイナンスプロ",
      "slug": "finance-pro",
      "theme": {
        "colors": {
          "primary": "#1f2937",
          "secondary": "#059669",
          "accent": "#dc2626",
          "background": "#ffffff",
          "surface": "#f5f5f5",
          "text": {
            "primary": "#111827",
            "secondary": "#374151"
          }
        },
        "typography": {
          "fontFamily": "Source Sans Pro, sans-serif",
          "baseFontSize": 15,
          "headingScale": 1.2,
          "lineHeight": 1.4
        },
        "spacing": {
          "base": 1,
          "scale": 1.4
        },
        "borderRadius": {
          "sm": "0.1875rem",
          "md": "0.25rem",
          "lg": "0.3125rem"
        },
        "shadows": {
          "sm": "0 1px 2px 0 rgb(0 0 0 / 0.08)",
          "md": "0 3px 6px -1px rgb(0 0 0 / 0.12)",
          "lg": "0 8px 16px -4px rgb(0 0 0 / 0.12)"
        }
      },
      "branding": {
        "logo": "/logos/finance-pro-logo.svg",
        "favicon": "/favicons/finance-pro.ico",
        "companyName": "Finance Pro Solutions"
      }
    }
  }
}
```

2. マルチテナントテーママネージャーの実装

テナント管理とテーマ適用を行うJavaScriptクラスを作成します。

_src/scripts/multi-tenant-theme-manager.js_
```javascript
// マルチテナントテーママネージャー
class MultiTenantThemeManager {
  constructor() {
    this.tenants = {};
    this.currentTenant = null;
    this.defaultTenant = 'default';
    this.themeCache = new Map();
    this.init();
  }

  async init() {
    await this.loadTenantData();
    await this.detectAndSetTenant();
    this.setupTenantSwitcher();
  }

  async loadTenantData() {
    try {
      const response = await fetch('./data/tenants.json');
      const data = await response.json();
      this.tenants = data.tenants;
    } catch (error) {
      console.error('テナントデータの読み込みに失敗しました:', error);
      this.tenants = this.getFallbackTenants();
    }
  }

  getFallbackTenants() {
    return {
      default: {
        name: "デフォルトブランド",
        slug: "default",
        theme: {
          colors: {
            primary: "#3b82f6",
            secondary: "#22c55e",
            background: "#ffffff",
            surface: "#f8fafc"
          }
        }
      }
    };
  }

  async detectAndSetTenant() {
    let tenantSlug = this.defaultTenant;

    // URL パラメータからテナントを検出
    const urlParams = new URLSearchParams(window.location.search);
    const urlTenant = urlParams.get('tenant');

    // サブドメインからテナントを検出
    const subdomain = window.location.hostname.split('.')[0];

    // ローカルストレージから最後に使用したテナントを取得
    const savedTenant = localStorage.getItem('current-tenant');

    // 優先順位: URL > サブドメイン > 保存済み > デフォルト
    if (urlTenant && this.tenants[urlTenant]) {
      tenantSlug = urlTenant;
    } else if (this.tenants[subdomain]) {
      tenantSlug = subdomain;
    } else if (savedTenant && this.tenants[savedTenant]) {
      tenantSlug = savedTenant;
    }

    await this.setTenant(tenantSlug);
  }

  async setTenant(tenantSlug) {
    if (!this.tenants[tenantSlug]) {
      console.warn(`テナント "${tenantSlug}" が見つかりません。デフォルトを使用します。`);
      tenantSlug = this.defaultTenant;
    }

    const tenant = this.tenants[tenantSlug];
    this.currentTenant = tenantSlug;

    // テーマを適用
    await this.applyTenantTheme(tenant);

    // ブランディングを適用
    this.applyTenantBranding(tenant);

    // ローカルストレージに保存
    localStorage.setItem('current-tenant', tenantSlug);

    // イベントを発火
    this.dispatchTenantChangeEvent(tenant);

    // URLを更新（履歴を汚さないように）
    this.updateURL(tenantSlug);
  }

  async applyTenantTheme(tenant) {
    const theme = tenant.theme;
    const root = document.documentElement;

    // キャッシュからテーマを取得または生成
    let processedTheme = this.themeCache.get(tenant.slug);
    if (!processedTheme) {
      processedTheme = this.processTheme(theme);
      this.themeCache.set(tenant.slug, processedTheme);
    }

    // CSS変数を設定
    Object.entries(processedTheme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // テーマ属性を設定
    root.setAttribute('data-tenant', tenant.slug);
    root.setAttribute('data-theme', 'custom');

    // 動的スタイルシートの追加
    this.injectTenantStyles(tenant);
  }

  processTheme(theme) {
    const processedTheme = {};

    // カラーの処理
    if (theme.colors) {
      // プライマリカラー
      if (theme.colors.primary) {
        const primaryVariants = this.generateColorVariants(theme.colors.primary);
        Object.entries(primaryVariants).forEach(([shade, color]) => {
          processedTheme[`--color-primary-${shade}`] = color;
        });
      }

      // セカンダリカラー
      if (theme.colors.secondary) {
        const secondaryVariants = this.generateColorVariants(theme.colors.secondary);
        Object.entries(secondaryVariants).forEach(([shade, color]) => {
          processedTheme[`--color-secondary-${shade}`] = color;
        });
      }

      // アクセントカラー
      if (theme.colors.accent) {
        const accentVariants = this.generateColorVariants(theme.colors.accent);
        Object.entries(accentVariants).forEach(([shade, color]) => {
          processedTheme[`--color-accent-${shade}`] = color;
        });
      }

      // ベースカラー
      if (theme.colors.background) {
        processedTheme['--color-background'] = theme.colors.background;
      }
      if (theme.colors.surface) {
        processedTheme['--color-surface'] = theme.colors.surface;
      }

      // テキストカラー
      if (theme.colors.text) {
        if (theme.colors.text.primary) {
          processedTheme['--color-text-primary'] = theme.colors.text.primary;
        }
        if (theme.colors.text.secondary) {
          processedTheme['--color-text-secondary'] = theme.colors.text.secondary;
        }
      }
    }

    // タイポグラフィの処理
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        processedTheme['--font-family'] = theme.typography.fontFamily;
      }

      if (theme.typography.baseFontSize) {
        const baseSize = theme.typography.baseFontSize;
        const scale = theme.typography.headingScale || 1.25;

        processedTheme['--font-size-sm'] = `${Math.round(baseSize * 0.875)}px`;
        processedTheme['--font-size-base'] = `${baseSize}px`;
        processedTheme['--font-size-lg'] = `${Math.round(baseSize * scale)}px`;
        processedTheme['--font-size-xl'] = `${Math.round(baseSize * scale * scale)}px`;
        processedTheme['--font-size-2xl'] = `${Math.round(baseSize * Math.pow(scale, 3))}px`;
      }

      if (theme.typography.lineHeight) {
        processedTheme['--line-height'] = theme.typography.lineHeight;
      }
    }

    // スペーシングの処理
    if (theme.spacing) {
      const baseSpacing = theme.spacing.base || 1;
      const scale = theme.spacing.scale || 1.5;

      processedTheme['--spacing-xs'] = `${baseSpacing * 0.25}rem`;
      processedTheme['--spacing-sm'] = `${baseSpacing * 0.5}rem`;
      processedTheme['--spacing-md'] = `${baseSpacing}rem`;
      processedTheme['--spacing-lg'] = `${baseSpacing * scale}rem`;
      processedTheme['--spacing-xl'] = `${baseSpacing * scale * scale}rem`;
    }

    // 角丸の処理
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([size, radius]) => {
        processedTheme[`--border-radius-${size}`] = radius;
      });
    }

    // シャドウの処理
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([size, shadow]) => {
        processedTheme[`--shadow-${size}`] = shadow;
      });
    }

    return processedTheme;
  }

  generateColorVariants(hexColor) {
    const hsl = this.hexToHsl(hexColor);
    const [h, s, l] = hsl;

    return {
      '50': `hsl(${h}, ${Math.min(s, 60)}%, 97%)`,
      '100': `hsl(${h}, ${Math.min(s, 70)}%, 94%)`,
      '200': `hsl(${h}, ${Math.min(s, 80)}%, 87%)`,
      '300': `hsl(${h}, ${Math.min(s, 85)}%, 78%)`,
      '400': `hsl(${h}, ${Math.min(s, 90)}%, 66%)`,
      '500': `hsl(${h}, ${s}%, ${l}%)`,
      '600': `hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l - 10, 10)}%)`,
      '700': `hsl(${h}, ${Math.min(s + 15, 100)}%, ${Math.max(l - 20, 8)}%)`,
      '800': `hsl(${h}, ${Math.min(s + 20, 100)}%, ${Math.max(l - 30, 6)}%)`,
      '900': `hsl(${h}, ${Math.min(s + 25, 100)}%, ${Math.max(l - 40, 4)}%)`,
    };
  }

  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  applyTenantBranding(tenant) {
    const branding = tenant.branding;

    if (branding) {
      // ページタイトルの更新
      if (branding.companyName) {
        document.title = `${branding.companyName} - アプリケーション`;
      }

      // ファビコンの更新
      if (branding.favicon) {
        this.updateFavicon(branding.favicon);
      }

      // ロゴの更新
      if (branding.logo) {
        this.updateLogo(branding.logo);
      }
    }
  }

  updateFavicon(faviconUrl) {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = faviconUrl;
  }

  updateLogo(logoUrl) {
    const logoElements = document.querySelectorAll('[data-logo]');
    logoElements.forEach(element => {
      if (element.tagName === 'IMG') {
        element.src = logoUrl;
      } else {
        element.style.backgroundImage = `url(${logoUrl})`;
      }
    });
  }

  injectTenantStyles(tenant) {
    // 既存のテナント固有スタイルを削除
    const existingStyle = document.getElementById('tenant-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // 新しいスタイルを追加
    const style = document.createElement('style');
    style.id = 'tenant-styles';

    let css = `
      /* テナント固有スタイル: ${tenant.name} */
      body {
        font-family: var(--font-family, inherit);
        line-height: var(--line-height, 1.5);
      }

      .tenant-card {
        border-radius: var(--border-radius-md, 0.375rem);
        box-shadow: var(--shadow-md);
      }

      .tenant-button {
        border-radius: var(--border-radius-sm, 0.25rem);
        font-family: var(--font-family, inherit);
      }
    `;

    // テナント固有のカスタムスタイル
    if (tenant.slug === 'creative-agency') {
      css += `
        .creative-special {
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
        }
      `;
    } else if (tenant.slug === 'finance-pro') {
      css += `
        .finance-table {
          border-collapse: collapse;
          border: 1px solid var(--color-primary-200);
        }
        .finance-table th,
        .finance-table td {
          border: 1px solid var(--color-primary-100);
          padding: var(--spacing-sm);
        }
      `;
    }

    style.textContent = css;
    document.head.appendChild(style);
  }

  setupTenantSwitcher() {
    // テナント切り替えメニューを作成
    this.createTenantSwitcher();
  }

  createTenantSwitcher() {
    const switcherContainer = document.getElementById('tenant-switcher');
    if (!switcherContainer) return;

    switcherContainer.innerHTML = `
      <div class="relative">
        <button id="tenant-switcher-button" class="theme-button flex items-center gap-2">
          <span id="current-tenant-name">${this.tenants[this.currentTenant]?.name || 'テナント'}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div id="tenant-switcher-menu" class="absolute top-full left-0 mt-1 w-64 bg-surface border border-primary-200 rounded-lg shadow-lg hidden z-50">
          ${Object.entries(this.tenants).map(([slug, tenant]) => `
            <button onclick="switchTenant('${slug}')"
                    class="w-full text-left px-4 py-3 hover:bg-primary-50 flex items-center justify-between group border-b last:border-b-0 border-primary-100">
              <div>
                <div class="font-medium text-text-primary">${tenant.name}</div>
                <div class="text-sm text-text-secondary">${slug}</div>
              </div>
              ${slug === this.currentTenant ? '<span class="text-primary-500">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // メニューの表示/非表示制御
    const button = document.getElementById('tenant-switcher-button');
    const menu = document.getElementById('tenant-switcher-menu');

    button.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!switcherContainer.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });
  }

  updateURL(tenantSlug) {
    const url = new URL(window.location);
    if (tenantSlug !== this.defaultTenant) {
      url.searchParams.set('tenant', tenantSlug);
    } else {
      url.searchParams.delete('tenant');
    }

    history.replaceState(null, '', url.toString());
  }

  dispatchTenantChangeEvent(tenant) {
    const event = new CustomEvent('tenantChange', {
      detail: { tenant, slug: this.currentTenant }
    });
    document.dispatchEvent(event);
  }

  // 外部から利用可能なメソッド
  getCurrentTenant() {
    return this.currentTenant;
  }

  getCurrentTenantData() {
    return this.tenants[this.currentTenant];
  }

  getAllTenants() {
    return this.tenants;
  }

  async switchTenant(tenantSlug) {
    await this.setTenant(tenantSlug);

    // メニューを閉じる
    const menu = document.getElementById('tenant-switcher-menu');
    if (menu) {
      menu.classList.add('hidden');
    }

    // 現在のテナント名を更新
    const nameElement = document.getElementById('current-tenant-name');
    if (nameElement) {
      nameElement.textContent = this.tenants[tenantSlug]?.name || 'テナント';
    }
  }
}

// グローバル関数
let multiTenantManager;

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
  multiTenantManager = new MultiTenantThemeManager();
});

function switchTenant(tenantSlug) {
  if (multiTenantManager) {
    multiTenantManager.switchTenant(tenantSlug);
  }
}

// テナント変更イベントリスナーの例
document.addEventListener('tenantChange', (event) => {
  console.log('テナントが変更されました:', event.detail);
});
```

3. マルチテナント対応デモページの作成

複数のテナントテーマを確認できるデモページを作成します。

_src/multi-tenant-demo.html_
```html
<!DOCTYPE html>
<html lang="ja" data-theme="custom">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>マルチテナントテーマシステム</title>
  <link href="../dist/styles.css" rel="stylesheet">
  <style>
    /* 動的フォントファミリーの適用 */
    body {
      font-family: var(--font-family, 'Inter, sans-serif');
    }

    /* レスポンシブ調整 */
    @media (max-width: 768px) {
      .grid-demo {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body class="bg-background min-h-screen transition-all duration-500">
  <div class="container mx-auto p-4">
    <!-- ヘッダー -->
    <header class="mb-8">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-text-primary mb-2">
            マルチテナントテーマシステム
          </h1>
          <p class="text-text-secondary">企業ブランドに応じたダイナミックテーマ切り替え</p>
        </div>

        <!-- テナントスイッチャー -->
        <div id="tenant-switcher"></div>
      </div>
    </header>

    <!-- 現在のテナント情報 -->
    <section class="mb-8">
      <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl" id="tenant-initial">D</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-primary-900" id="tenant-display-name">
              デフォルトブランド
            </h2>
            <p class="text-primary-700" id="tenant-company-name">デフォルト株式会社</p>
          </div>
        </div>
      </div>
    </section>

    <!-- デモコンテンツグリッド -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 grid-demo">
      <!-- カラーパレットカード -->
      <div class="tenant-card bg-surface p-6 border border-primary-100">
        <h3 class="text-xl font-semibold text-text-primary mb-4">カラーパレット</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary-500 rounded"></div>
            <span class="text-text-secondary">プライマリ</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-secondary-500 rounded"></div>
            <span class="text-text-secondary">セカンダリ</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-accent-500 rounded"></div>
            <span class="text-text-secondary">アクセント</span>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-5 gap-1">
          <div class="h-8 bg-primary-100 rounded-sm" title="Primary 100"></div>
          <div class="h-8 bg-primary-300 rounded-sm" title="Primary 300"></div>
          <div class="h-8 bg-primary-500 rounded-sm" title="Primary 500"></div>
          <div class="h-8 bg-primary-700 rounded-sm" title="Primary 700"></div>
          <div class="h-8 bg-primary-900 rounded-sm" title="Primary 900"></div>
        </div>
      </div>

      <!-- タイポグラフィカード -->
      <div class="tenant-card bg-surface p-6 border border-primary-100">
        <h3 class="text-xl font-semibold text-text-primary mb-4">タイポグラフィ</h3>
        <div class="space-y-3">
          <p class="text-xs text-text-secondary">XS: 12px</p>
          <p class="text-sm text-text-secondary">SM: 14px</p>
          <p class="text-base text-text-primary">Base: 16px</p>
          <p class="text-lg text-text-primary">LG: 18px</p>
          <p class="text-xl text-text-primary">XL: 20px</p>
          <p class="text-2xl text-text-primary">2XL: 24px</p>
        </div>
        <p class="mt-4 text-sm text-text-secondary">
          現在のフォント: <span class="font-mono" id="current-font">Inter</span>
        </p>
      </div>

      <!-- ボタンコンポーネント -->
      <div class="tenant-card bg-surface p-6 border border-primary-100">
        <h3 class="text-xl font-semibold text-text-primary mb-4">ボタンコンポーネント</h3>
        <div class="space-y-3">
          <button class="tenant-button w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white transition-colors">
            プライマリボタン
          </button>
          <button class="tenant-button w-full py-2 px-4 bg-secondary-500 hover:bg-secondary-600 text-white transition-colors">
            セカンダリボタン
          </button>
          <button class="tenant-button w-full py-2 px-4 border border-primary-500 text-primary-500 hover:bg-primary-50 transition-colors">
            アウトラインボタン
          </button>
          <button class="tenant-button w-full py-2 px-4 bg-accent-500 hover:bg-accent-600 text-white transition-colors">
            アクセントボタン
          </button>
        </div>
      </div>

      <!-- フォームコンポーネント -->
      <div class="tenant-card bg-surface p-6 border border-primary-100">
        <h3 class="text-xl font-semibold text-text-primary mb-4">フォームコンポーネント</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-primary mb-1">お名前</label>
            <input type="text" class="w-full px-3 py-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="山田 太郎">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-1">メールアドレス</label>
            <input type="email" class="w-full px-3 py-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="example@company.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-primary mb-1">カテゴリ</label>
            <select class="w-full px-3 py-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>一般</option>
              <option>ビジネス</option>
              <option>プレミアム</option>
            </select>
          </div>
        </div>
      </div>

      <!-- テナント固有機能 -->
      <div class="tenant-card bg-surface p-6 border border-primary-100" id="tenant-specific-features">
        <h3 class="text-xl font-semibold text-text-primary mb-4">テナント固有機能</h3>
        <div id="tenant-features-content">
          <!-- 動的コンテンツ -->
        </div>
      </div>

      <!-- メトリクス表示 -->
      <div class="tenant-card bg-surface p-6 border border-primary-100">
        <h3 class="text-xl font-semibold text-text-primary mb-4">テーマメトリクス</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">現在のテナント:</span>
            <span class="font-mono text-text-primary" id="current-tenant-slug">default</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">テーマファイルサイズ:</span>
            <span class="font-mono text-text-primary" id="theme-size">~2.3KB</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">切り替え時間:</span>
            <span class="font-mono text-text-primary" id="switch-time">~50ms</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">CSS変数数:</span>
            <span class="font-mono text-text-primary" id="variable-count">42</span>
          </div>
        </div>
      </div>
    </div>

    <!-- テナント比較セクション -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold text-text-primary mb-6">テナント比較</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-primary-50">
              <th class="border border-primary-200 px-4 py-3 text-left font-semibold text-text-primary">テナント</th>
              <th class="border border-primary-200 px-4 py-3 text-left font-semibold text-text-primary">プライマリカラー</th>
              <th class="border border-primary-200 px-4 py-3 text-left font-semibold text-text-primary">フォント</th>
              <th class="border border-primary-200 px-4 py-3 text-left font-semibold text-text-primary">特徴</th>
            </tr>
          </thead>
          <tbody id="tenant-comparison-table">
            <!-- 動的に生成 -->
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <script src="./scripts/theme.js"></script>
  <script src="./scripts/multi-tenant-theme-manager.js"></script>
  <script>
    // テナント変更時の処理
    document.addEventListener('tenantChange', (event) => {
      const { tenant, slug } = event.detail;
      updateTenantDisplay(tenant, slug);
      updateTenantSpecificFeatures(tenant, slug);
    });

    function updateTenantDisplay(tenant, slug) {
      // テナント情報の更新
      document.getElementById('tenant-initial').textContent = tenant.name.charAt(0);
      document.getElementById('tenant-display-name').textContent = tenant.name;
      document.getElementById('tenant-company-name').textContent = tenant.branding?.companyName || tenant.name;
      document.getElementById('current-tenant-slug').textContent = slug;

      // フォント情報の更新
      const fontFamily = tenant.theme.typography?.fontFamily || 'Inter';
      document.getElementById('current-font').textContent = fontFamily.split(',')[0];
    }

    function updateTenantSpecificFeatures(tenant, slug) {
      const featuresContent = document.getElementById('tenant-features-content');

      let content = '';
      switch (slug) {
        case 'tech-corp':
          content = `
            <div class="space-y-3">
              <div class="bg-primary-100 p-3 rounded">
                <h4 class="font-semibold text-primary-900">テクノロジー指標</h4>
                <div class="text-sm text-primary-700 mt-1">API稼働率: 99.9%</div>
              </div>
              <button class="tenant-button w-full py-2 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                システム監視ダッシュボード
              </button>
            </div>
          `;
          break;
        case 'creative-agency':
          content = `
            <div class="space-y-3">
              <div class="creative-special p-3 rounded text-white">
                <h4 class="font-semibold">クリエイティブポートフォリオ</h4>
                <div class="text-sm opacity-90 mt-1">最新プロジェクト: 24件</div>
              </div>
              <button class="tenant-button w-full py-2 px-4 bg-gradient-to-r from-accent-500 to-primary-500 text-white">
                デザインギャラリー
              </button>
            </div>
          `;
          break;
        case 'finance-pro':
          content = `
            <div class="space-y-3">
              <table class="finance-table w-full text-sm">
                <tr>
                  <td class="font-semibold">総資産</td>
                  <td>¥1,234,567</td>
                </tr>
                <tr>
                  <td class="font-semibold">月次成長率</td>
                  <td class="text-accent-600">+12.3%</td>
                </tr>
              </table>
              <button class="tenant-button w-full py-2 px-4 bg-primary-500 text-white">
                詳細レポート
              </button>
            </div>
          `;
          break;
        default:
          content = `
            <div class="text-center py-4">
              <div class="text-primary-500 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <p class="text-text-secondary">標準機能セット</p>
            </div>
          `;
      }

      featuresContent.innerHTML = content;
    }

    // テナント比較テーブルの生成
    function generateComparisonTable() {
      if (!multiTenantManager) return;

      const tenants = multiTenantManager.getAllTenants();
      const tableBody = document.getElementById('tenant-comparison-table');

      tableBody.innerHTML = Object.entries(tenants).map(([slug, tenant]) => `
        <tr class="hover:bg-primary-25">
          <td class="border border-primary-200 px-4 py-3">
            <div class="font-medium text-text-primary">${tenant.name}</div>
            <div class="text-sm text-text-secondary">${slug}</div>
          </td>
          <td class="border border-primary-200 px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background-color: ${tenant.theme.colors?.primary || '#3b82f6'}"></div>
              <span class="font-mono text-sm">${tenant.theme.colors?.primary || '#3b82f6'}</span>
            </div>
          </td>
          <td class="border border-primary-200 px-4 py-3">
            <span class="font-mono text-sm">${tenant.theme.typography?.fontFamily?.split(',')[0] || 'Inter'}</span>
          </td>
          <td class="border border-primary-200 px-4 py-3">
            <span class="text-sm text-text-secondary">
              ${slug === 'tech-corp' ? 'テクノロジー特化' :
                slug === 'creative-agency' ? 'クリエイティブ重視' :
                slug === 'finance-pro' ? '金融業界対応' : '汎用テーマ'}
            </span>
          </td>
        </tr>
      `).join('');
    }

    // ページ読み込み時にテーブルを生成
    document.addEventListener('DOMContentLoaded', () => {
      // テーブル生成を少し遅らせる
      setTimeout(generateComparisonTable, 1000);
    });
  </script>
</body>
</html>
```

4. テナントデータを修正してWebフォントを適用

Google Fontsを利用したWebフォントの動的読み込みを実装します。

_src/scripts/multi-tenant-theme-manager.js（updateメソッドを追加）_
```javascript
// 既存のMultiTenantThemeManagerクラスに以下のメソッドを追加

async applyTenantTheme(tenant) {
  const theme = tenant.theme;
  const root = document.documentElement;

  // Webフォントの読み込み
  await this.loadWebFont(theme.typography?.fontFamily);

  // 既存のテーマ適用処理...
  let processedTheme = this.themeCache.get(tenant.slug);
  if (!processedTheme) {
    processedTheme = this.processTheme(theme);
    this.themeCache.set(tenant.slug, processedTheme);
  }

  Object.entries(processedTheme).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  root.setAttribute('data-tenant', tenant.slug);
  root.setAttribute('data-theme', 'custom');

  this.injectTenantStyles(tenant);
}

async loadWebFont(fontFamily) {
  if (!fontFamily || fontFamily.includes('serif') || fontFamily.includes('sans-serif')) {
    return; // システムフォントの場合はスキップ
  }

  const fontName = fontFamily.split(',')[0].trim().replace(/['"]/g, '');

  // 既に読み込まれているかチェック
  if (document.querySelector(`link[href*="${fontName.replace(/\s+/g, '+')}"]`)) {
    return;
  }

  // Google Fontsから読み込み
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;

  return new Promise((resolve) => {
    link.onload = resolve;
    link.onerror = resolve; // エラー時も処理を続行
    document.head.appendChild(link);
  });
}
```

5. 動作確認

_コマンド実行_
```bash
npm run build
```

ブラウザで`src/multi-tenant-demo.html`を開き、テナント切り替え機能をテストします。URL パラメータ `?tenant=tech-corp` なども試してみてください。

:::

このマルチテナントテーマ管理システムにより、複数のブランドやクライアントに対応した包括的なテーマ切り替えが実現できました。各テナントは独自のカラーパレット、タイポグラフィ、スペーシング、ブランディング要素を持ち、シームレスに切り替えることができます。

## 🔧 パフォーマンスを考慮したCSS変数の活用

CSS変数を大規模に活用する際は、パフォーマンスへの配慮が重要です。適切な最適化により、実行時の変数変更コストを最小化し、スムーズなユーザー体験を実現できます。

変数の継承チェーンの最適化、変更時の再描画範囲の限定、キャッシュ戦略の実装により、高性能なダイナミックテーマシステムを構築できます。また、CSS変数の変更タイミングを制御することで、アニメーション性能も向上させることができます。

:::warning パフォーマンス注意点

CSS変数の変更は即座にブラウザの再描画を引き起こします。大量の変数を同時に変更する場合や、アニメーション中の頻繁な変更は、パフォーマンスに影響を与える可能性があります。適切なバッチ処理とスロットリングを実装しましょう。

:::

### 高性能CSS変数システムの設計原則

効率的なCSS変数システムは、変数の階層構造、変更の最適化、キャッシュ戦略の3つの要素で構成されます。これらの原則に従うことで、大規模なアプリケーションでも高性能を維持できます。

## 📊 まとめ

CSS変数とTailwind CSSの連携により、従来の静的なスタイル管理から動的で柔軟なデザインシステムへと進化させることができました。この技術の組み合わせは、現代のWebアプリケーション開発において重要な役割を果たします。

:::note 要点のまとめ

- **CSS変数とTailwind CSSの基本連携**: 設定ファイルでの変数参照により動的テーマシステムの基盤を構築
- **JavaScript連携による実行時変更**: ユーザーインタラクションに応じたリアルタイムスタイル更新
- **マルチテナント対応**: 複数ブランド・顧客に対応した包括的なテーマ管理システム
- **パフォーマンス最適化**: 効率的な変数管理とキャッシュ戦略による高性能実装
- **実践的なハンズオン**: 基本システムから高度なカスタマイゼーションまでの段階的学習

:::

この技術を活用することで、保守性が高く、拡張性に優れた動的デザインシステムを構築できるようになります。ユーザー体験の向上と開発効率の両立を実現する強力な手法として、ぜひプロジェクトに取り入れてみてください。

次のレベルでは、[アニメーションとトランジション](./animations-transitions)について学習し、より魅力的なユーザーインターフェースの構築方法を習得していきましょう。

## 関連リンク

- [カラーとテーマ管理](./color-theming)
- [Flexboxレイアウトパターン](./flex-patterns)
- [Gridレイアウトパターン](./grid-patterns)
- [CSS公式ドキュメント - CSS Custom Properties](https://developer.mozilla.org/docs/Web/CSS/--*)
- [Tailwind CSS公式ドキュメント - テーマ設定](https://tailwindcss.com/docs/theme)

## さらに深く学習したい方へ

このページで学習したCSS変数とTailwind CSSの連携技術をより深く習得したい方は、実際のプロジェクトでの実装経験を積むことをお勧めします。当研修プラットフォームでは、実際の企業案件を想定したより高度なテーマシステム構築プロジェクトも提供しており、実践的なスキルアップをサポートしています。