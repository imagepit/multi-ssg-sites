# コンテンツのディレクトリ・ファイル構造定義

_コンテンツのディレクトリ・ファイル構造_

```text
dist/cloudflare/
├── content/
│   ├── 00-introduction/                         # 「はじめに・基礎知識」のカテゴリ（6ページ）
│   │   ├── introduction.md                      # 「はじめに・基礎知識」のindexページ
│   │   ├── what-is-cloudflare.md                # 「Cloudflareとは」ページ
│   │   ├── ecosystem-overview.md                # 「エコシステム概要」ページ
│   │   ├── pricing-complete-guide.md            # 「料金体系完全ガイド」ページ
│   │   ├── free-plan-features.md                # 「無料プランでできること」ページ
│   │   ├── paid-plan-comparison.md              # 「有料プラン比較と移行タイミング」ページ
│   │   └── pre-setup-preparation.md             # 「セットアップ前の準備」ページ
│   ├── 01-getting-started/                      # 「Getting Started（導入・初期設定）」のカテゴリ（7ページ）
│   │   ├── getting-started.md                   # 「Getting Started」のindexページ
│   │   ├── account-setup.md                     # 「アカウント作成から初期設定まで」ページ
│   │   ├── domain-dns-setup.md                  # 「ドメイン追加とDNS設定」ページ
│   │   ├── ssl-tls/                             # 「SSL/TLS証明書設定完全ガイド」サブカテゴリ
│   │   │   ├── ssl-tls-guide.md                 # 「SSL/TLS証明書設定完全ガイド」ページ
│   │   │   ├── flexible-vs-full-ssl.md          # 「Flexible SSL vs Full SSL」ページ
│   │   │   ├── ssl-error-resolution.md          # 「SSL証明書エラーの解決」ページ
│   │   │   └── custom-certificate-upload.md     # 「カスタム証明書のアップロード」ページ
│   │   ├── basic-security-settings.md           # 「基本的なセキュリティ設定」ページ
│   │   ├── page-rules-intro.md                  # 「Page Rules入門」ページ
│   │   └── initial-setup-troubleshooting.md     # 「初期設定のトラブルシューティング」ページ
│   ├── 02-workers-development/                  # 「Workers開発（サーバーレス開発）」のカテゴリ（18ページ）
│   │   ├── workers-development.md               # 「Workers開発」のindexページ
│   │   ├── workers-overview.md                  # 「Workers概要と基本概念」ページ
│   │   ├── development-environment/             # 「開発環境セットアップ」サブカテゴリ
│   │   │   ├── development-environment.md       # 「開発環境セットアップ」のindexページ
│   │   │   ├── wrangler-cli-setup.md            # 「Wrangler CLI導入とセットアップ」ページ
│   │   │   ├── local-development-setup.md       # 「ローカル開発環境構築」ページ
│   │   │   └── editor-debug-tools.md            # 「エディタ設定とデバッグツール」ページ
│   │   ├── workers-basics/                      # 「Workers基礎開発」サブカテゴリ
│   │   │   ├── workers-basics.md                # 「Workers基礎開発」のindexページ
│   │   │   ├── hello-world.md                   # 「Hello World から始めるWorkers」ページ
│   │   │   ├── request-response-handling.md     # 「リクエスト・レスポンス処理」ページ
│   │   │   ├── fetch-api-usage.md               # 「フェッチAPIの活用」ページ
│   │   │   └── basic-routing.md                 # 「基本的なルーティング実装」ページ
│   │   ├── environment-secrets/                 # 「環境変数とシークレット管理」サブカテゴリ
│   │   │   ├── environment-secrets.md           # 「環境変数とシークレット管理」のindexページ
│   │   │   ├── environment-variables.md         # 「環境変数の設定方法」ページ
│   │   │   ├── secret-management.md             # 「シークレット管理のベストプラクティス」ページ
│   │   │   └── dev-prod-separation.md           # 「開発・本番環境の分離」ページ
│   │   ├── workers-advanced/                    # 「Workers実践開発」サブカテゴリ
│   │   │   ├── workers-advanced.md              # 「Workers実践開発」のindexページ
│   │   │   ├── api-proxy.md                     # 「APIプロキシの実装」ページ
│   │   │   ├── authentication.md                # 「認証・認可の実装」ページ
│   │   │   ├── rate-limiting-cache.md           # 「レート制限とキャッシュ制御」ページ
│   │   │   └── error-handling.md                # 「エラーハンドリング」ページ
│   │   ├── third-party-api/                     # 「サードパーティAPI連携」サブカテゴリ
│   │   │   ├── third-party-api.md               # 「サードパーティAPI連携」のindexページ
│   │   │   ├── external-api-patterns.md         # 「外部API呼び出しパターン」ページ
│   │   │   ├── auth-token-management.md         # 「認証トークンの管理」ページ
│   │   │   └── error-retry-logic.md             # 「エラーハンドリングとリトライロジック」ページ
│   │   ├── timeout-handling/                    # 「タイムアウト対策」サブカテゴリ
│   │   │   ├── timeout-handling.md              # 「タイムアウト対策」のindexページ
│   │   │   ├── 100-second-limit.md              # 「100秒制限の理解と対策」ページ
│   │   │   ├── large-file-handling.md           # 「大容量ファイル処理の回避策」ページ
│   │   │   └── async-patterns.md                # 「非同期処理パターン」ページ
│   │   ├── workers-ai/                          # 「Workers AI活用」サブカテゴリ
│   │   │   ├── workers-ai.md                    # 「Workers AI活用」のindexページ
│   │   │   ├── ai-basics.md                     # 「Workers AIの基本使用方法」ページ
│   │   │   ├── text-processing.md               # 「テキスト処理・生成」ページ
│   │   │   ├── image-processing.md              # 「画像処理・認識」ページ
│   │   │   └── ai-app-examples.md               # 「実践的なAIアプリケーション例」ページ
│   │   └── deployment-cicd/                     # 「デプロイメントとCI/CD」サブカテゴリ
│   │       ├── deployment-cicd.md               # 「デプロイメントとCI/CD」のindexページ
│   │       ├── production-deployment.md         # 「本番デプロイの最適化」ページ
│   │       ├── github-actions.md                # 「GitHub Actions連携」ページ
│   │       ├── gitlab-cicd.md                   # 「GitLab CI/CD連携」ページ
│   │       └── rollback-versioning.md           # 「ロールバックとバージョン管理」ページ
│   ├── 03-pages-frameworks/                     # 「Pages & フレームワーク統合」のカテゴリ（12ページ）
│   │   ├── pages-frameworks.md                  # 「Pages & フレームワーク統合」のindexページ
│   │   ├── cloudflare-pages/                    # 「Cloudflare Pages完全ガイド」サブカテゴリ
│   │   │   ├── cloudflare-pages.md              # 「Cloudflare Pages完全ガイド」のindexページ
│   │   │   ├── pages-overview.md                # 「Pages概要と特徴」ページ
│   │   │   ├── github-deployment.md             # 「GitHubからのデプロイ設定」ページ
│   │   │   ├── gitlab-deployment.md             # 「GitLabからのデプロイ設定」ページ
│   │   │   └── custom-domain-setup.md           # 「カスタムドメイン設定」ページ
│   │   ├── nextjs-integration/                  # 「Next.js統合」サブカテゴリ
│   │   │   ├── nextjs-integration.md            # 「Next.js統合」のindexページ
│   │   │   ├── nextjs-pages-setup.md            # 「Next.js + Cloudflare Pages設定」ページ
│   │   │   ├── ssr-ssg-optimization.md          # 「SSR・SSG最適化」ページ
│   │   │   ├── api-routes-usage.md              # 「API Routes活用」ページ
│   │   │   └── image-optimization.md            # 「画像最適化設定」ページ
│   │   ├── nuxt-integration/                    # 「Nuxt統合」サブカテゴリ
│   │   │   ├── nuxt-integration.md              # 「Nuxt統合」のindexページ
│   │   │   ├── nuxt3-pages.md                   # 「Nuxt 3 + Cloudflare Pages」ページ
│   │   │   ├── deployment-optimization.md       # 「デプロイメント最適化」ページ
│   │   │   └── ssr-performance.md               # 「SSR設定とパフォーマンス調整」ページ
│   │   ├── react-vue-integration/               # 「React・Vue.js統合」サブカテゴリ
│   │   │   ├── react-vue-integration.md         # 「React・Vue.js統合」のindexページ
│   │   │   ├── create-react-app.md              # 「Create React App対応」ページ
│   │   │   ├── vue-cli-support.md               # 「Vue CLI プロジェクト対応」ページ
│   │   │   └── build-optimization.md            # 「ビルド設定の最適化」ページ
│   │   ├── other-frameworks/                    # 「その他フレームワーク対応」サブカテゴリ
│   │   │   ├── other-frameworks.md              # 「その他フレームワーク対応」のindexページ
│   │   │   ├── astro-integration.md             # 「Astro統合」ページ
│   │   │   ├── sveltekit-integration.md         # 「SvelteKit統合」ページ
│   │   │   ├── hugo-jekyll.md                   # 「Hugo・Jekyll統合」ページ
│   │   │   └── gatsby-integration.md            # 「Gatsby統合」ページ
│   │   └── pages-functions/                     # 「Pages Functions」サブカテゴリ
│   │       ├── pages-functions.md               # 「Pages Functions」のindexページ
│   │       ├── api-endpoint-creation.md         # 「APIエンドポイント作成」ページ
│   │       ├── form-processing.md               # 「フォーム処理」ページ
│   │       └── middleware-implementation.md     # 「ミドルウェア実装」ページ
│   ├── 04-storage-database/                     # 「ストレージ・データベース」のカテゴリ（13ページ）
│   │   ├── storage-database.md                  # 「ストレージ・データベース」のindexページ
│   │   ├── storage-comparison/                  # 「ストレージソリューション比較」サブカテゴリ
│   │   │   ├── storage-comparison.md            # 「ストレージソリューション比較」のindexページ
│   │   │   ├── kv-d1-r2-comparison.md           # 「KV vs D1 vs R2 vs Durable Objects」ページ
│   │   │   ├── usecase-selection-guide.md       # 「ユースケース別選択ガイド」ページ
│   │   │   └── pricing-optimization.md          # 「料金比較と最適化」ページ
│   │   ├── d1-database/                         # 「D1データベース」サブカテゴリ
│   │   │   ├── d1-database.md                   # 「D1データベース」のindexページ
│   │   │   ├── d1-overview.md                   # 「D1概要とSQLite互換性」ページ
│   │   │   ├── database-connection.md           # 「データベース作成と接続」ページ
│   │   │   ├── migration-management.md          # 「マイグレーション管理」ページ
│   │   │   ├── query-optimization.md            # 「クエリ実行とパフォーマンス最適化」ページ
│   │   │   ├── database-design.md               # 「データベース設計ベストプラクティス」ページ
│   │   │   └── backup-restore.md                # 「バックアップとリストア」ページ
│   │   ├── kv-store/                            # 「KVストア活用」サブカテゴリ
│   │   │   ├── kv-store.md                      # 「KVストア活用」のindexページ
│   │   │   ├── kv-basic-operations.md           # 「KVストア基本操作」ページ
│   │   │   ├── ttl-cache-strategy.md            # 「TTLとキャッシュ戦略」ページ
│   │   │   ├── large-data-handling.md           # 「大容量データの取り扱い」ページ
│   │   │   ├── session-management.md            # 「セッション管理」ページ
│   │   │   └── config-management.md             # 「設定情報の管理」ページ
│   │   ├── r2-storage/                          # 「R2オブジェクトストレージ」サブカテゴリ
│   │   │   ├── r2-storage.md                    # 「R2オブジェクトストレージ」のindexページ
│   │   │   ├── r2-overview.md                   # 「R2概要とS3互換性」ページ
│   │   │   ├── bucket-management.md             # 「バケット作成と管理」ページ
│   │   │   ├── file-upload-download.md          # 「ファイルアップロード・ダウンロード」ページ
│   │   │   ├── cdn-cache-integration.md         # 「CDN統合とキャッシュ設定」ページ
│   │   │   ├── image-transform.md               # 「画像リサイズとTransform Rules」ページ
│   │   │   └── cost-optimization.md             # 「コスト最適化戦略」ページ
│   │   └── durable-objects/                     # 「Durable Objects」サブカテゴリ
│   │       ├── durable-objects.md               # 「Durable Objects」のindexページ
│   │       ├── durable-objects-overview.md      # 「Durable Objects概要」ページ
│   │       ├── stateful-app-design.md           # 「ステートフルアプリケーション設計」ページ
│   │       ├── websocket-integration.md         # 「WebSocket統合」ページ
│   │       ├── realtime-app.md                  # 「リアルタイムアプリケーション実装」ページ
│   │       └── scaling-performance.md           # 「スケーリングとパフォーマンス考慮事項」ページ
│   ├── 05-security/                             # 「セキュリティ」のカテゴリ（15ページ）
│   │   ├── security.md                          # 「セキュリティ」のindexページ
│   │   ├── waf/                                 # 「WAF（Web Application Firewall）」サブカテゴリ
│   │   │   ├── waf.md                           # 「WAF」のindexページ
│   │   │   ├── waf-basic-setup.md               # 「WAF概要と基本設定」ページ
│   │   │   ├── custom-rules.md                  # 「カスタムルール作成」ページ
│   │   │   ├── rate-limiting.md                 # 「レート制限設定」ページ
│   │   │   ├── geo-ip-restrictions.md           # 「地理的制限とIP制限」ページ
│   │   │   ├── bot-management.md                # 「ボット検出とBot Management」ページ
│   │   │   └── waf-optimization.md              # 「WAF最適化とパフォーマンス」ページ
│   │   ├── ddos-protection/                     # 「DDoS対策」サブカテゴリ
│   │   │   ├── ddos-protection.md               # 「DDoS対策」のindexページ
│   │   │   ├── ddos-attack-types.md             # 「DDoS攻撃の種類と対策」ページ
│   │   │   ├── under-attack-mode.md             # 「Under Attack Mode設定」ページ
│   │   │   ├── challenge-page.md                # 「Challenge Page設定」ページ
│   │   │   ├── automation-bypass.md             # 「自動化処理での回避方法」ページ
│   │   │   └── alert-monitoring.md              # 「アラート設定と監視」ページ
│   │   ├── zero-trust/                          # 「Zero Trust導入」サブカテゴリ
│   │   │   ├── zero-trust.md                    # 「Zero Trust導入」のindexページ
│   │   │   ├── zero-trust-architecture.md       # 「Zero Trustアーキテクチャ概要」ページ
│   │   │   ├── teams-setup.md                   # 「Cloudflare for Teams設定」ページ
│   │   │   ├── device-warp-setup.md             # 「デバイス管理とWARP設定」ページ
│   │   │   ├── network-policies.md              # 「ネットワークポリシー設定」ページ
│   │   │   └── audit-compliance.md              # 「監査ログとコンプライアンス」ページ
│   │   ├── tunnel/                              # 「Cloudflare Tunnel」サブカテゴリ
│   │   │   ├── tunnel.md                        # 「Cloudflare Tunnel」のindexページ
│   │   │   ├── tunnel-overview.md               # 「Tunnel概要とVPN代替」ページ
│   │   │   ├── tunnel-setup.md                  # 「Tunnelセットアップガイド」ページ
│   │   │   ├── on-premise-integration.md        # 「オンプレミス連携」ページ
│   │   │   ├── multiple-tunnel-management.md    # 「複数Tunnel管理」ページ
│   │   │   ├── load-balancing-failover.md       # 「負荷分散とフェイルオーバー」ページ
│   │   │   └── tunnel-monitoring.md             # 「Tunnel監視とトラブルシューティング」ページ
│   │   ├── access/                              # 「Cloudflare Access」サブカテゴリ
│   │   │   ├── access.md                        # 「Cloudflare Access」のindexページ
│   │   │   ├── access-authentication.md         # 「Access概要と認証設定」ページ
│   │   │   ├── sso-integration.md               # 「SSO統合（Google、Microsoft、SAML）」ページ
│   │   │   ├── application-protection.md        # 「アプリケーション保護」ページ
│   │   │   ├── user-group-management.md         # 「ユーザー・グループ管理」ページ
│   │   │   ├── conditional-access.md            # 「条件付きアクセスポリシー」ページ
│   │   │   └── session-management.md            # 「Session管理とログアウト」ページ
│   │   └── security-patterns/                   # 「セキュリティ統合パターン」サブカテゴリ
│   │       ├── security-patterns.md             # 「セキュリティ統合パターン」のindexページ
│   │       ├── tunnel-access-integration.md     # 「Tunnel + Access連携によるゼロトラスト実装」ページ
│   │       ├── vpn-replacement.md               # 「VPN完全代替の実装例」ページ
│   │       ├── enterprise-security.md           # 「企業環境でのセキュリティ設計」ページ
│   │       └── compliance-requirements.md       # 「コンプライアンス要件への対応」ページ
│   ├── 06-performance-optimization/             # 「パフォーマンス最適化」のカテゴリ（12ページ）
│   │   ├── performance-optimization.md          # 「パフォーマンス最適化」のindexページ
│   │   ├── cdn-optimization/                    # 「CDN設定最適化」サブカテゴリ
│   │   │   ├── cdn-optimization.md              # 「CDN設定最適化」のindexページ
│   │   │   ├── cache-level-settings.md          # 「キャッシュレベル設定」ページ
│   │   │   ├── browser-cache-ttl.md             # 「Browser Cache TTL調整」ページ
│   │   │   ├── edge-cache-ttl.md                # 「Edge Cache TTL設定」ページ
│   │   │   └── purge-strategy.md                # 「Purge戦略」ページ
│   │   ├── cache-strategy/                      # 「キャッシュ戦略」サブカテゴリ
│   │   │   ├── cache-strategy.md                # 「キャッシュ戦略」のindexページ
│   │   │   ├── cache-rules.md                   # 「キャッシュルール設定」ページ
│   │   │   ├── dynamic-content-cache.md         # 「動的コンテンツのキャッシュ」ページ
│   │   │   ├── api-response-cache.md            # 「API応答のキャッシュ」ページ
│   │   │   └── cache-invalidation.md            # 「キャッシュ無効化パターン」ページ
│   │   ├── asset-optimization/                  # 「画像・アセット最適化」サブカテゴリ
│   │   │   ├── asset-optimization.md            # 「画像・アセット最適化」のindexページ
│   │   │   ├── image-resizing.md                # 「Image Resizing設定」ページ
│   │   │   ├── webp-avif-conversion.md          # 「WebP・AVIF変換」ページ
│   │   │   ├── mirage-polish.md                 # 「Mirage・Polish設定」ページ
│   │   │   └── asset-best-practices.md          # 「アセット最適化のベストプラクティス」ページ
│   │   ├── code-optimization/                   # 「コード最適化」サブカテゴリ
│   │   │   ├── code-optimization.md             # 「コード最適化」のindexページ
│   │   │   ├── html-css-js-compression.md       # 「HTML・CSS・JS圧縮」ページ
│   │   │   ├── http3-quic.md                    # 「HTTP/3・QUIC活用」ページ
│   │   │   ├── early-hints.md                   # 「Early Hints対応」ページ
│   │   │   └── brotli-compression.md            # 「Brotli圧縮設定」ページ
│   │   ├── core-web-vitals/                     # 「Core Web Vitals最適化」サブカテゴリ
│   │   │   ├── core-web-vitals.md               # 「Core Web Vitals最適化」のindexページ
│   │   │   ├── lcp-optimization.md              # 「LCP（Largest Contentful Paint）改善」ページ
│   │   │   ├── fid-optimization.md              # 「FID（First Input Delay）最適化」ページ
│   │   │   ├── cls-optimization.md              # 「CLS（Cumulative Layout Shift）対策」ページ
│   │   │   └── performance-monitoring.md        # 「パフォーマンス測定とモニタリング」ページ
│   │   └── edge-performance/                    # 「エッジでのパフォーマンス向上」サブカテゴリ
│   │       ├── edge-performance.md              # 「エッジでのパフォーマンス向上」のindexページ
│   │       ├── edge-side-includes.md            # 「エッジサイドインクルード」ページ
│   │       ├── edge-side-rendering.md           # 「エッジサイドレンダリング」ページ
│   │       ├── prefetch-preload.md              # 「プリフェッチ・プリロード戦略」ページ
│   │       └── response-time-optimization.md    # 「レスポンス時間の最適化」ページ
│   ├── 07-troubleshooting/                      # 「トラブルシューティング」のカテゴリ（9ページ）
│   │   ├── troubleshooting.md                   # 「トラブルシューティング」のindexページ
│   │   ├── common-errors/                       # 「よくあるエラーと解決法」サブカテゴリ
│   │   │   ├── common-errors.md                 # 「よくあるエラーと解決法」のindexページ
│   │   │   ├── ssl-tls-errors.md                # 「SSL/TLS関連エラー」ページ
│   │   │   ├── dns-errors.md                    # 「DNS設定エラー」ページ
│   │   │   ├── redirect-loop-errors.md          # 「リダイレクトループエラー」ページ
│   │   │   ├── 520-521-522-errors.md            # 「520・521・522エラー」ページ
│   │   │   └── workers-execution-errors.md      # 「Workers実行エラー」ページ
│   │   ├── performance-diagnosis/               # 「パフォーマンス問題の診断」サブカテゴリ
│   │   │   ├── performance-diagnosis.md         # 「パフォーマンス問題の診断」のindexページ
│   │   │   ├── slow-loading-diagnosis.md        # 「遅い読み込み時間の原因特定」ページ
│   │   │   ├── cache-problem-diagnosis.md       # 「キャッシュ問題の診断」ページ
│   │   │   ├── traffic-spike-response.md        # 「トラフィック急増への対応」ページ
│   │   │   └── origin-server-issues.md          # 「Origin Server問題の切り分け」ページ
│   │   ├── security-incident-response/          # 「セキュリティインシデント対応」サブカテゴリ
│   │   │   ├── security-incident-response.md    # 「セキュリティインシデント対応」のindexページ
│   │   │   ├── attack-detection-response.md     # 「攻撃検知と初期対応」ページ
│   │   │   ├── bot-attack-response.md           # 「ボット攻撃への対処」ページ
│   │   │   ├── unauthorized-access.md           # 「不正アクセスの調査」ページ
│   │   │   └── post-incident-measures.md        # 「インシデント後の対策強化」ページ
│   │   ├── development-deployment-issues/       # 「開発・デプロイ関連問題」サブカテゴリ
│   │   │   ├── development-deployment-issues.md # 「開発・デプロイ関連問題」のindexページ
│   │   │   ├── wrangler-errors.md               # 「Wranglerコマンドエラー」ページ
│   │   │   ├── deployment-failures.md           # 「デプロイ失敗の原因と対策」ページ
│   │   │   ├── environment-variable-issues.md   # 「環境変数設定問題」ページ
│   │   │   └── cicd-pipeline-issues.md          # 「CI/CD パイプライン問題」ページ
│   │   └── billing-issues/                      # 「料金・請求関連問題」サブカテゴリ
│   │       ├── billing-issues.md                # 「料金・請求関連問題」のindexページ
│   │       ├── unexpected-charges.md            # 「予期しない料金発生の調査」ページ
│   │       ├── usage-monitoring-control.md      # 「使用量の監視と制御」ページ
│   │       ├── billing-inquiries.md             # 「請求に関する問い合わせ方法」ページ
│   │       └── cost-optimization-checklist.md   # 「コスト最適化のチェックリスト」ページ
│   ├── 08-case-studies/                         # 「実装例・ケーススタディ」のカテゴリ（12ページ）
│   │   ├── case-studies.md                      # 「実装例・ケーススタディ」のindexページ
│   │   ├── web-applications/                    # 「Webアプリケーション構築」サブカテゴリ
│   │   │   ├── web-applications.md              # 「Webアプリケーション構築」のindexページ
│   │   │   ├── single-page-application.md       # 「シングルページアプリケーション（SPA）」ページ
│   │   │   ├── progressive-web-app.md           # 「PWA（Progressive Web App）構築」ページ
│   │   │   ├── microservices-architecture.md    # 「マイクロサービス構成」ページ
│   │   │   └── jamstack-architecture.md         # 「JAMstack アーキテクチャ実装」ページ
│   │   ├── ecommerce/                           # 「ECサイト・コマース」サブカテゴリ
│   │   │   ├── ecommerce.md                     # 「ECサイト・コマース」のindexページ
│   │   │   ├── online-store-construction.md     # 「オンラインストア構築」ページ
│   │   │   ├── payment-security.md              # 「決済処理とセキュリティ」ページ
│   │   │   ├── product-search-filter.md         # 「商品検索・フィルタリング機能」ページ
│   │   │   └── recommendation-engine.md         # 「レコメンドエンジン実装」ページ
│   │   ├── media-content/                       # 「メディア・コンテンツサイト」サブカテゴリ
│   │   │   ├── media-content.md                 # 「メディア・コンテンツサイト」のindexページ
│   │   │   ├── high-traffic-media.md            # 「高トラフィック対応メディアサイト」ページ
│   │   │   ├── video-streaming-platform.md      # 「動画配信プラットフォーム」ページ
│   │   │   ├── image-gallery-portfolio.md       # 「画像ギャラリー・ポートフォリオサイト」ページ
│   │   │   └── blog-cms-integration.md          # 「ブログ・CMS統合」ページ
│   │   ├── enterprise-systems/                  # 「企業システム」サブカテゴリ
│   │   │   ├── enterprise-systems.md            # 「企業システム」のindexページ
│   │   │   ├── corporate-website.md             # 「企業Webサイト」ページ
│   │   │   ├── internal-systems.md              # 「社内システム・イントラネット」ページ
│   │   │   ├── crm-system.md                    # 「顧客管理システム（CRM）」ページ
│   │   │   └── document-management.md           # 「文書管理システム」ページ
│   │   ├── api-microservices/                   # 「API・マイクロサービス」サブカテゴリ
│   │   │   ├── api-microservices.md             # 「API・マイクロサービス」のindexページ
│   │   │   ├── restful-api-construction.md      # 「RESTful API構築」ページ
│   │   │   ├── graphql-endpoint.md              # 「GraphQL エンドポイント」ページ
│   │   │   ├── webhook-handler.md               # 「Webhookハンドラー」ページ
│   │   │   └── third-party-api-integration.md   # 「サードパーティAPI統合」ページ
│   │   └── ai-ml-applications/                  # 「AI・機械学習アプリケーション」サブカテゴリ
│   │       ├── ai-ml-applications.md            # 「AI・機械学習アプリケーション」のindexページ
│   │       ├── chatbot-implementation.md        # 「チャットボット実装」ページ
│   │       ├── image-analysis-classification.md # 「画像解析・分類システム」ページ
│   │       ├── text-analysis-summary.md         # 「テキスト解析・要約サービス」ページ
│   │       └── realtime-prediction.md           # 「リアルタイム予測システム」ページ
│   └── 09-reference/                            # 「リファレンス・資料集」のカテゴリ（11ページ）
│       ├── reference.md                         # 「リファレンス・資料集」のindexページ
│       ├── glossary/                            # 「用語集・Glossary」サブカテゴリ
│       │   ├── glossary.md                      # 「用語集・Glossary」のindexページ
│       │   ├── cloudflare-terminology.md        # 「Cloudflare専門用語」ページ
│       │   ├── web-technology-terms.md          # 「Web技術関連用語」ページ
│       │   └── security-terminology.md          # 「セキュリティ用語集」ページ
│       ├── api-cli-reference/                   # 「API・CLI リファレンス」サブカテゴリ
│       │   ├── api-cli-reference.md             # 「API・CLI リファレンス」のindexページ
│       │   ├── cloudflare-api-reference.md      # 「Cloudflare API完全リファレンス」ページ
│       │   ├── wrangler-cli-commands.md         # 「Wrangler CLI コマンド一覧」ページ
│       │   ├── workers-runtime-api.md           # 「Workers Runtime API」ページ
│       │   └── pages-functions-api.md           # 「Pages Functions API」ページ
│       ├── configuration-reference/             # 「設定・構成リファレンス」サブカテゴリ
│       │   ├── configuration-reference.md       # 「設定・構成リファレンス」のindexページ
│       │   ├── dns-configuration-patterns.md    # 「DNS設定パターン集」ページ
│       │   ├── ssl-tls-configuration.md         # 「SSL/TLS設定パターン」ページ
│       │   ├── waf-rules-collection.md          # 「WAFルール設定集」ページ
│       │   └── cache-configuration-patterns.md  # 「キャッシュ設定パターン」ページ
│       ├── migration-checklists/                # 「移行・チェックリスト」サブカテゴリ
│       │   ├── migration-checklists.md          # 「移行・チェックリスト」のindexページ
│       │   ├── cdn-migration-guide.md           # 「他CDNからの移行ガイド」ページ
│       │   ├── security-checklist.md            # 「セキュリティ設定チェックリスト」ページ
│       │   ├── performance-checklist.md         # 「パフォーマンス最適化チェックリスト」ページ
│       │   └── production-checklist.md          # 「本番運用チェックリスト」ページ
│       ├── best-practices/                      # 「ベストプラクティス集」サブカテゴリ
│       │   ├── best-practices.md                # 「ベストプラクティス集」のindexページ
│       │   ├── security-best-practices.md       # 「セキュリティベストプラクティス」ページ
│       │   ├── performance-best-practices.md    # 「パフォーマンスベストプラクティス」ページ
│       │   ├── cost-optimization-practices.md   # 「コスト最適化ベストプラクティス」ページ
│       │   └── operations-monitoring.md         # 「運用・監視ベストプラクティス」ページ
│       └── resources-community/                 # 「関連リソース・コミュニティ」サブカテゴリ
│           ├── resources-community.md           # 「関連リソース・コミュニティ」のindexページ
│           ├── official-documentation.md        # 「公式ドキュメントへのリンク」ページ
│           ├── useful-tools-services.md         # 「有用なツール・サービス集」ページ
│           ├── japanese-community.md            # 「日本語コミュニティ・フォーラム」ページ
│           └── learning-resources.md            # 「学習リソース・書籍推薦」ページ
```
