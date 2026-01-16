# コンテンツのディレクトリ・ファイル構造定義

_コンテンツのディレクトリ・ファイル構造_

```text
docs/nextjs/contents/
├── home.md                                     # ホーム（1ページ）
├── 00-getting-started/                         # 「はじめに」のカテゴリ（4ページ）
│   ├── getting-started.md                      # 「はじめに」のindexページ
│   ├── overview.md                             # 「概要」ページ
│   ├── setup.md                                # 「環境構築」ページ
│   └── quickstart.md                           # 「クイックスタート」ページ
├── 01-react-foundation/                        # 「React基礎復習」のカテゴリ（15ページ）
│   ├── react-foundation.md                     # 「React基礎復習」のindexページ
│   ├── components/                             # 「コンポーネント」サブカテゴリ
│   │   ├── components.md                       # 「コンポーネント」のindexページ
│   │   ├── component-basics.md                 # 「コンポーネントの基礎」
│   │   ├── props-state.md                      # 「PropsとState」
│   │   └── event-handling.md                   # 「イベントハンドリング」
│   ├── hooks/                                  # 「Hooks」サブカテゴリ
│   │   ├── hooks.md                            # 「Hooks概要」
│   │   ├── hooks-overview.md                   # 「Hooks概要」
│   │   ├── usestate-useeffect.md               # 「useState・useEffect」
│   │   └── custom-hooks.md                     # 「カスタムフック」
│   ├── state-management/                       # 「状態管理」サブカテゴリ
│   │   ├── state-management.md                 # 「状態管理」のindexページ
│   │   ├── local-state.md                      # 「ローカル状態管理」
│   │   └── context-api.md                      # 「Context API活用」
│   └── performance/                            # 「パフォーマンス基礎」サブカテゴリ
│       ├── performance.md                      # 「パフォーマンス基礎」のindexページ
│       └── react-performance.md                # 「Reactパフォーマンス基礎」
├── 02-nextjs-basics/                           # 「Next.js基礎」のカテゴリ（30ページ）
│   ├── nextjs-basics.md                        # 「Next.js基礎」のindexページ
│   ├── introduction/                           # 「導入」サブカテゴリ
│   │   ├── introduction.md                     # 「導入」のindexページ
│   │   ├── nextjs-vs-react.md                  # 「Next.js vs React」
│   │   ├── project-structure.md                # 「プロジェクト構造」
│   │   └── development-environment.md          # 「開発環境セットアップ」
│   ├── pages-router/                           # 「Pages Router」サブカテゴリ
│   │   ├── pages-router.md                     # 「Pages Router基礎」のindexページ
│   │   ├── pages-router-basics.md              # 「Pages Router基礎」
│   │   ├── dynamic-routing.md                  # 「動的ルーティング」
│   │   ├── api-routes.md                       # 「API Routes」
│   │   ├── middleware-basics.md                # 「ミドルウェア基礎」
│   │   └── custom-app-document.md              # 「カスタムApp・Document」
│   ├── styling/                                # 「スタイリング」サブカテゴリ
│   │   ├── styling.md                          # 「スタイリング」のindexページ
│   │   ├── css-modules.md                      # 「CSS Modules」
│   │   ├── styled-components.md                # 「Styled Components」
│   │   ├── tailwind-css.md                     # 「Tailwind CSS」
│   │   ├── global-styles.md                    # 「グローバルスタイル」
│   │   └── css-in-js.md                        # 「CSS-in-JS手法」
│   ├── data-fetching/                          # 「データフェッチング」サブカテゴリ
│   │   ├── data-fetching.md                    # 「データフェッチング」のindexページ
│   │   ├── data-fetching-overview.md           # 「データフェッチング概要」
│   │   ├── getstaticprops.md                   # 「getStaticProps」
│   │   ├── getserversideprops.md               # 「getServerSideProps」
│   │   ├── getstaticpaths.md                   # 「getStaticPaths」
│   │   ├── client-side-fetching.md             # 「クライアントサイドフェッチング」
│   │   └── swr-usage.md                        # 「SWR活用」
│   ├── optimization/                           # 「最適化基礎」サブカテゴリ
│   │   ├── optimization.md                     # 「最適化基礎」のindexページ
│   │   ├── image-optimization.md               # 「画像最適化」
│   │   ├── font-optimization.md                # 「フォント最適化」
│   │   └── bundle-optimization.md              # 「バンドル最適化」
│   ├── deployment/                             # 「デプロイ」サブカテゴリ
│   │   ├── deployment.md                       # 「デプロイ」のindexページ
│   │   └── vercel-deployment.md                # 「Vercelデプロイ」
│   ├── testing/                                # 「テスト」サブカテゴリ
│   │   ├── testing.md                          # 「テスト」のindexページ
│   │   ├── unit-testing-basics.md              # 「ユニットテスト」
│   │   └── integration-testing.md              # 「統合テスト」
│   └── troubleshooting.md                      # 「トラブルシューティング」
├── 03-nextjs-intermediate/                     # 「Next.js中級」のカテゴリ（35ページ）
│   ├── nextjs-intermediate.md                  # 「Next.js中級」のindexページ
│   ├── app-router/                             # 「App Router」サブカテゴリ
│   │   ├── app-router.md                       # 「App Router導入」のindexページ
│   │   ├── app-router-introduction.md          # 「App Router導入」
│   │   ├── app-directory-structure.md          # 「appディレクトリ構造」
│   │   ├── layouts-templates.md                # 「レイアウト・テンプレート」
│   │   ├── loading-error-pages.md              # 「ローディング・エラーページ」
│   │   ├── nested-routing.md                   # 「ネストルーティング」
│   │   ├── route-groups.md                     # 「ルートグループ」
│   │   └── parallel-routes.md                  # 「パラレルルート」
│   ├── server-client-components/               # 「Server・Client Components」サブカテゴリ
│   │   ├── server-client-components.md         # 「Server・Client Components」のindexページ
│   │   ├── server-components-overview.md       # 「Server Components概要」
│   │   ├── client-components-overview.md       # 「Client Components概要」
│   │   ├── composition-patterns.md             # 「コンポーネント組み合わせパターン」
│   │   ├── data-flow-design.md                 # 「データフロー設計」
│   │   └── hydration-concepts.md               # 「ハイドレーション概念」
│   ├── data-strategies/                        # 「データ戦略」サブカテゴリ
│   │   ├── data-strategies.md                  # 「データ戦略」のindexページ
│   │   ├── server-actions.md                   # 「Server Actions」
│   │   ├── streaming-ssr.md                    # 「ストリーミングSSR」
│   │   ├── suspense-patterns.md                # 「Suspenseパターン」
│   │   ├── cache-strategies.md                 # 「キャッシュ戦略」
│   │   └── revalidation.md                     # 「再検証手法」
│   ├── seo-optimization/                       # 「SEO最適化」サブカテゴリ
│   │   ├── seo-optimization.md                 # 「SEO最適化」のindexページ
│   │   ├── metadata-api.md                     # 「Metadata API」
│   │   ├── dynamic-seo.md                      # 「動的SEO」
│   │   ├── structured-data.md                  # 「構造化データ」
│   │   ├── sitemap-robots.md                   # 「サイトマップ・robots.txt」
│   │   └── opengraph-twitter.md                # 「OpenGraph・Twitter Cards」
│   ├── middleware-advanced/                    # 「高度なミドルウェア」サブカテゴリ
│   │   ├── middleware-advanced.md              # 「高度なミドルウェア」のindexページ
│   │   ├── authentication-middleware.md        # 「認証ミドルウェア」
│   │   ├── localization-middleware.md          # 「国際化ミドルウェア」
│   │   └── security-middleware.md              # 「セキュリティミドルウェア」
│   ├── testing/                                # 「テスト」サブカテゴリ
│   │   ├── testing-intermediate.md             # 「テスト」のindexページ
│   │   ├── unit-testing-intermediate.md        # 「ユニットテスト」
│   │   └── integration-testing-intermediate.md # 「統合テスト」
│   └── best-practices-intermediate.md          # 「ベストプラクティス」
├── 04-nextjs-advanced/                         # 「Next.js上級」のカテゴリ（30ページ）
│   ├── nextjs-advanced.md                      # 「Next.js上級」のindexページ
│   ├── server-actions-advanced/                # 「Server Actions Advanced」サブカテゴリ
│   │   ├── server-actions-advanced.md          # 「Server Actions Advanced」のindexページ
│   │   ├── server-actions-patterns.md          # 「Server Actionsパターン」
│   │   ├── form-handling-advanced.md           # 「フォームハンドリング」
│   │   ├── file-upload-advanced.md             # 「ファイルアップロード」
│   │   ├── validation-patterns-advanced.md     # 「バリデーションパターン」
│   │   └── error-handling-advanced.md          # 「エラーハンドリング」
│   ├── streaming-suspense-advanced/            # 「Streaming・Suspense」サブカテゴリ
│   │   ├── streaming-suspense-advanced.md      # 「Streaming・Suspense」のindexページ
│   │   ├── progressive-enhancement.md          # 「プログレッシブエンハンスメント」
│   │   ├── loading-strategies.md               # 「ローディング戦略」
│   │   ├── skeleton-ui.md                      # 「スケルトンUI」
│   │   └── streaming-optimization.md           # 「ストリーミング最適化」
│   ├── performance-optimization/               # 「パフォーマンス最適化」サブカテゴリ
│   │   ├── performance-optimization.md         # 「パフォーマンス最適化」のindexページ
│   │   ├── web-vitals-optimization.md          # 「Web Vitals最適化」
│   │   ├── code-splitting.md                   # 「コード分割」
│   │   ├── lazy-loading.md                     # 「遅延読み込み」
│   │   ├── prefetching.md                      # 「プリフェッチング」
│   │   ├── memory-optimization.md              # 「メモリ最適化」
│   │   └── monitoring-analytics.md             # 「監視・分析」
│   ├── deployment-strategies/                  # 「デプロイ戦略」サブカテゴリ
│   │   ├── deployment-strategies.md            # 「デプロイ戦略」のindexページ
│   │   ├── vercel-production-deployment.md     # 「Vercel本番デプロイ」
│   │   ├── aws-deployment.md                   # 「AWS デプロイ」
│   │   ├── gcp-deployment.md                   # 「GCP デプロイ」
│   │   ├── docker-deployment.md                # 「Docker デプロイ」
│   │   ├── cicd-pipeline.md                    # 「CI/CDパイプライン」
│   │   └── environment-management.md           # 「環境管理」
│   ├── security/                               # 「セキュリティ」サブカテゴリ
│   │   ├── security.md                         # 「セキュリティ」のindexページ
│   │   ├── authentication-patterns.md          # 「認証パターン」
│   │   ├── authorization.md                    # 「認可」
│   │   ├── csrf-protection.md                  # 「CSRF対策」
│   │   └── security-headers.md                 # 「セキュリティヘッダー」
│   └── testing/                                # 「テスト」サブカテゴリ
│       ├── testing-advanced.md                 # 「テスト」のindexページ
│       ├── unit-testing-advanced.md            # 「ユニットテスト」
│       └── integration-testing-advanced.md     # 「統合テスト」
├── 05-practical-projects/                      # 「実務プロジェクト」のカテゴリ（50ページ）
│   ├── practical-projects.md                   # 「実務プロジェクト」のindexページ
│   ├── personal-blog-site/                     # 「個人ブログサイト」サブカテゴリ
│   │   ├── personal-blog-site.md               # 「個人ブログサイト」のindexページ
│   │   ├── blog-project-overview.md            # 「ブログプロジェクト概要」
│   │   ├── blog-setup.md                       # 「ブログセットアップ」
│   │   ├── markdown-processing.md              # 「Markdown処理」
│   │   ├── blog-ui-design.md                   # 「ブログUI設計」
│   │   ├── blog-seo.md                         # 「ブログSEO」
│   │   ├── comment-system.md                   # 「コメントシステム」
│   │   ├── rss-feed.md                         # 「RSS配信」
│   │   └── search-functionality.md             # 「検索機能」
│   ├── corporate-website/                      # 「企業Webサイト」サブカテゴリ
│   │   ├── corporate-website.md                # 「企業Webサイト」のindexページ
│   │   ├── corporate-site-overview.md          # 「企業サイト概要」
│   │   ├── cms-integration.md                  # 「CMS統合」
│   │   ├── multi-page-structure.md             # 「マルチページ構造」
│   │   ├── contact-form.md                     # 「問い合わせフォーム」
│   │   ├── corporate-site-seo.md               # 「企業サイトSEO」
│   │   ├── corporate-site-performance.md       # 「企業サイトパフォーマンス」
│   │   ├── accessibility-compliance.md         # 「アクセシビリティ対応」
│   │   ├── multilingual-support.md             # 「多言語対応」
│   │   ├── corporate-site-security.md          # 「企業サイトセキュリティ」
│   │   ├── corporate-site-deployment.md        # 「企業サイトデプロイ」
│   │   ├── maintenance-updates.md              # 「保守・更新」
│   │   └── corporate-site-analytics.md         # 「企業サイト分析」
│   ├── ecommerce-site/                         # 「ECサイト」サブカテゴリ
│   │   ├── ecommerce-site.md                   # 「ECサイト」のindexページ
│   │   ├── ecommerce-site-overview.md          # 「ECサイト概要」
│   │   ├── product-catalog.md                  # 「商品カタログ」
│   │   ├── shopping-cart.md                    # 「ショッピングカート」
│   │   ├── user-authentication.md              # 「ユーザー認証」
│   │   └── payment-integration.md              # 「決済統合」
│   └── management-dashboard/                   # 「管理ダッシュボード」サブカテゴリ
│       ├── management-dashboard.md             # 「管理ダッシュボード」のindexページ
│       ├── dashboard-overview.md               # 「ダッシュボード概要」
│       ├── nextjs15-features.md                # 「Next.js 15機能活用」
│       ├── trpc-integration.md                 # 「tRPC統合」
│       ├── prisma-setup.md                     # 「Prisma セットアップ」
│       ├── database-modeling.md                # 「データベースモデリング」
│       ├── api-design.md                       # 「API設計」
│       ├── realtime-features.md                # 「リアルタイム機能」
│       ├── data-visualization.md               # 「データ可視化」
│       ├── user-permission-management.md       # 「ユーザー権限管理」
│       ├── dashboard-testing.md                # 「ダッシュボードテスト」
│       ├── monitoring-logging.md               # 「監視・ログ」
│       ├── dashboard-security.md               # 「ダッシュボードセキュリティ」
│       └── dashboard-deployment.md             # 「ダッシュボードデプロイ」
├── 06-troubleshooting/                         # 「トラブルシューティング」のカテゴリ（10ページ）
│   ├── troubleshooting.md                      # 「トラブルシューティング」のindexページ
│   ├── common-errors.md                        # 「よくあるエラー」
│   ├── debugging-techniques.md                 # 「デバッグ技法」
│   ├── performance-issues.md                   # 「パフォーマンス問題」
│   └── deployment-issues.md                    # 「デプロイ問題」
└── 07-best-practices/                          # 「ベストプラクティス」のカテゴリ（5ページ）
    ├── best-practices.md                       # 「ベストプラクティス」のindexページ
    ├── code-organization.md                    # 「コード組織化」
    ├── project-structure-best-practices.md     # 「プロジェクト構造ベストプラクティス」
    ├── state-management-best-practices.md      # 「状態管理ベストプラクティス」
    ├── performance-best-practices.md           # 「パフォーマンスベストプラクティス」
    └── team-development-best-practices.md      # 「チーム開発ベストプラクティス」
```

## ディレクトリ・ファイル構造の説明

### 階層構造の原則

- **トップレベル**: レベル毎に`00`から始まる連番ディレクトリを作成
- **サブカテゴリ**: 論理的なグルーピングでサブディレクトリを作成
- **ファイル命名**: SEO-friendly なslug形式を採用

### 特別なファイル

- **index pages**: 各カテゴリの概要ページ（例: `getting-started.md`、`react-foundation.md`）
- **home.md**: サイトのトップページ
- **深い階層**: 実務プロジェクトなど、複雑な内容は詳細なサブディレクトリで構造化

### 総ページ数: 約180ページ

- **ホーム**: 1ページ
- **はじめに**: 4ページ
- **レベル1 React基礎復習**: 15ページ
- **レベル2 Next.js基礎**: 30ページ
- **レベル3 Next.js中級**: 35ページ
- **レベル4 Next.js上級**: 30ページ
- **レベル5 実務プロジェクト**: 50ページ
- **レベル6 トラブルシューティング**: 10ページ
- **レベル7 ベストプラクティス**: 5ページ
