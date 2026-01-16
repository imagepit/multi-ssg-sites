---
title: Rails/WordPressなどその他
slug: others
parent: installation
file_path: installation/others
target_user: "Rails開発者、WordPress開発者、その他のフレームワーク開発者"
goal: "Rails、WordPress、その他のフレームワークでTailwind CSSを導入し、モダンなWebアプリケーションを構築する"
status: completed
post_type: pages
seo_title: "Rails/WordPressでTailwind CSS導入 - その他フレームワークでのセットアップガイド"
seo_keywords: "TailwindCSS,Rails,WordPress,導入方法,セットアップ,Webアプリケーション,フレームワーク"
seo_description: "Rails、WordPress、その他のフレームワークでTailwind CSSを導入する方法を詳しく解説。様々な環境での実践的な導入手順を紹介します。"
handson_overview: "Rails、WordPress、その他のフレームワークでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Rails/WordPressなどその他

Tailwind CSSは、様々なフレームワークやCMSで使用できます。この章では、Rails、WordPress、その他のフレームワークでの導入方法について詳しく解説します。それぞれの環境に最適化された導入手順を紹介します。

## Railsでの導入

### Railsとは

Railsは、以下の特徴を持つRubyフレームワークです：

- **Rubyベース**: Rubyのエコシステムを活用
- **MVCアーキテクチャ**: モデル・ビュー・コントローラーの設計
- **ActiveRecord**: 直感的なデータベース操作
- **ERBテンプレート**: 強力なテンプレートエンジン
- **Rails CLI**: 開発効率を向上させるコマンドラインツール
- **豊富な機能**: 認証、ルーティング、ミドルウェアなど

### Railsプロジェクトでの導入

:::step

1. Railsプロジェクトの作成

任意の場所（デスクトップなど）で`my-rails-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-rails-app
cd my-rails-app
```

2. Railsプロジェクトの作成

Railsプロジェクトを作成します。

_コマンド実行_

```bash
rails new . --skip-bundle
```

3. 依存関係のインストール

プロジェクトの依存関係をインストールします。

_コマンド実行_

```bash
bundle install
```

4. Tailwind CSSのインストール

Tailwind CSSとその依存関係をインストールします。

_コマンド実行_

```bash
yarn add -D tailwindcss postcss autoprefixer
```

5. 設定ファイルの生成

Tailwind CSSの設定ファイルを生成します。

_コマンド実行_

```bash
npx tailwindcss init -p
```

6. tailwind.config.jsの設定

生成された`tailwind.config.js`ファイルを編集して、Railsのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの設定

`app/assets/stylesheets/application.tailwind.css`ファイルを作成して、Tailwind CSSのディレクティブを追加します。

_app/assets/stylesheets/application.tailwind.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

8. application.cssの更新

`app/assets/stylesheets/application.css`ファイルを更新して、Tailwind CSSファイルを読み込みます。

_app/assets/stylesheets/application.css_

```css
/*
 * This is a manifest file that'll be compiled into application.css, which will include all the files
 * listed below.
 *
 * Any CSS and SCSS file within this directory, lib/assets/stylesheets, or any plugin's
 * vendor/assets/stylesheets directory can be referenced here using a relative path.
 *
 * You're free to add application-wide styles to this file and they'll appear at the bottom of the
 * compiled file so the styles you add here take precedence over styles defined in any other CSS/SCSS
 * files in this directory. Styles in this file should be added after the last require_* statement.
 * It is generally better to create a new file per style scope.
 *
 *= require_tree .
 *= require_self
 */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

9. ビルドスクリプトの設定

`package.json`ファイルにビルドスクリプトを追加します。

_package.json_

```json
{
  "name": "my-rails-app",
  "private": true,
  "dependencies": {
    "@rails/actioncable": "^6.1.7",
    "@rails/activestorage": "^6.1.7",
    "@rails/ujs": "^6.1.7",
    "@rails/webpacker": "5.4.4",
    "turbolinks": "^5.2.0",
    "webpack": "^4.46.0",
    "webpack-cli": "^3.3.12"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  },
  "scripts": {
    "build:css": "tailwindcss -i ./app/assets/stylesheets/application.tailwind.css -o ./app/assets/builds/tailwind.css --watch"
  }
}
```

10. ビルドディレクトリの作成

ビルドディレクトリを作成します。

_コマンド実行_

```bash
mkdir -p app/assets/builds
```

11. ビルドの実行

Tailwind CSSをビルドします。

_コマンド実行_

```bash
yarn build:css
```

12. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
rails server
```

13. ブラウザで確認

ブラウザで`http://localhost:3000`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

## WordPressでの導入

### WordPressとは

WordPressは、以下の特徴を持つCMSです：

- **PHPベース**: PHPのエコシステムを活用
- **テーマシステム**: 柔軟なデザインカスタマイズ
- **プラグインシステム**: 豊富な機能拡張
- **管理画面**: 直感的なコンテンツ管理
- **SEO対応**: 検索エンジン最適化
- **コミュニティ**: 豊富なリソースとサポート

### WordPressテーマでの導入

:::step

1. テーマディレクトリの作成

WordPressの`wp-content/themes/`ディレクトリに新しいテーマフォルダを作成します。

_コマンド実行_

```bash
mkdir wp-content/themes/my-tailwind-theme
cd wp-content/themes/my-tailwind-theme
```

2. テーマファイルの作成

基本的なテーマファイルを作成します。

_style.css_

```css
/*
Theme Name: My Tailwind Theme
Description: A WordPress theme built with Tailwind CSS
Version: 1.0
Author: Your Name
*/

@tailwind base;
@tailwind components;
@tailwind utilities;
```

_index.php_

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title('|', true, 'right'); ?></title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-gray-900">
                            <?php bloginfo('name'); ?>
                        </h1>
                    </div>
                    <nav class="hidden md:flex space-x-8">
                        <?php
                        wp_nav_menu(array(
                            'theme_location' => 'primary',
                            'menu_class' => 'flex space-x-8',
                            'container' => false,
                        ));
                        ?>
                    </nav>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <?php if (have_posts()) : ?>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php while (have_posts()) : the_post(); ?>
                        <article class="bg-white rounded-lg shadow-md overflow-hidden">
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="h-48 bg-gray-200">
                                    <?php the_post_thumbnail('large', array('class' => 'w-full h-full object-cover')); ?>
                                </div>
                            <?php endif; ?>
                            <div class="p-6">
                                <h2 class="text-xl font-semibold text-gray-900 mb-2">
                                    <a href="<?php the_permalink(); ?>" class="hover:text-blue-600">
                                        <?php the_title(); ?>
                                    </a>
                                </h2>
                                <div class="text-gray-600 text-sm mb-4">
                                    <?php the_date(); ?> by <?php the_author(); ?>
                                </div>
                                <div class="text-gray-700">
                                    <?php the_excerpt(); ?>
                                </div>
                            </div>
                        </article>
                    <?php endwhile; ?>
                </div>
            <?php endif; ?>
        </main>

        <footer class="bg-gray-800 text-white py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
```

_functions.php_

```php
<?php
function my_tailwind_theme_setup() {
    // テーマサポートの追加
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    
    // メニューの登録
    register_nav_menus(array(
        'primary' => 'Primary Menu',
    ));
}
add_action('after_setup_theme', 'my_tailwind_theme_setup');

// Tailwind CSSの読み込み
function my_tailwind_theme_styles() {
    wp_enqueue_style('tailwind-css', get_template_directory_uri() . '/dist/tailwind.css');
}
add_action('wp_enqueue_scripts', 'my_tailwind_theme_styles');
?>
```

3. package.jsonの作成

`package.json`ファイルを作成して、Tailwind CSSの設定を行います。

_package.json_

```json
{
  "name": "my-tailwind-theme",
  "version": "1.0.0",
  "description": "A WordPress theme built with Tailwind CSS",
  "scripts": {
    "build:css": "tailwindcss -i ./src/input.css -o ./dist/tailwind.css --watch",
    "build:css:prod": "tailwindcss -i ./src/input.css -o ./dist/tailwind.css --minify"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

4. 設定ファイルの生成

Tailwind CSSの設定ファイルを生成します。

_コマンド実行_

```bash
npx tailwindcss init -p
```

5. tailwind.config.jsの設定

生成された`tailwind.config.js`ファイルを編集して、WordPressのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.php",
    "./**/*.html",
    "./**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

6. 入力CSSファイルの作成

`src/input.css`ファイルを作成して、Tailwind CSSのディレクティブを追加します。

_src/input.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

7. 依存関係のインストール

プロジェクトの依存関係をインストールします。

_コマンド実行_

```bash
npm install
```

8. ビルドの実行

Tailwind CSSをビルドします。

_コマンド実行_

```bash
npm run build:css
```

9. テーマの有効化

WordPressの管理画面でテーマを有効化します。

10. ブラウザで確認

ブラウザでサイトにアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

## その他のフレームワーク

### Django（Python）

Djangoプロジェクトでの導入例：

```bash
# 依存関係のインストール
pip install django
npm install -D tailwindcss postcss autoprefixer

# 設定ファイルの生成
npx tailwindcss init -p

# ビルドスクリプトの設定
npm run build:css
```

### Flask（Python）

Flaskプロジェクトでの導入例：

```bash
# 依存関係のインストール
pip install flask
npm install -D tailwindcss postcss autoprefixer

# 設定ファイルの生成
npx tailwindcss init -p

# ビルドスクリプトの設定
npm run build:css
```

### Express.js（Node.js）

Express.jsプロジェクトでの導入例：

```bash
# 依存関係のインストール
npm install express
npm install -D tailwindcss postcss autoprefixer

# 設定ファイルの生成
npx tailwindcss init -p

# ビルドスクリプトの設定
npm run build:css
```

## 次のステップ

様々なフレームワークでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: 各フレームワークの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[Laravel + Vite](laravel.md)**: Laravelプロジェクトでの導入

様々なフレームワークとTailwind CSSの組み合わせで、モダンで高性能なWebアプリケーションを構築していきましょう。