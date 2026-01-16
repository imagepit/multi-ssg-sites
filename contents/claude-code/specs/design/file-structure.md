# コンテンツのディレクトリ・ファイル構造定義

```text
contents/claude-code/contents/
├── home.md                                    # トップページ
├── sidebar.md                                 # サイドバー
├── getting-started/                           # 「入門・セットアップ」のカテゴリ
│   ├── getting-started.md                       # 「入門・セットアップ」のindexページ
│   ├── overview/                                # 「Claude Code概要」サブカテゴリ
│   │   ├── overview.md                          # 「Claude Code概要」のindexページ
│   │   ├── what-is-claude-code.md               # 「Claude Codeとは何か」
│   │   ├── comparison-with-ai-tools.md          # 「他のAIツールとの比較」
│   │   ├── introduction-benefits-roi.md         # 「導入メリット・ROI」
│   │   └── system-requirements.md              # 「システム要件」
│   ├── installation/                           # 「インストールガイド」サブカテゴリ
│   │   ├── installation.md                     # 「インストールガイド」のindexページ
│   │   ├── macos-installation.md               # 「macOS版インストール」
│   │   ├── windows-installation.md             # 「Windows版インストール」
│   │   ├── linux-installation.md               # 「Linux版インストール」
│   │   ├── authentication-setup.md             # 「認証設定」
│   │   └── update-procedures.md                # 「アップデート手順」
│   ├── basic-tutorial/                         # 「基本操作チュートリアル」サブカテゴリ
│   │   ├── basic-tutorial.md                   # 「基本操作チュートリアル」のindexページ
│   │   ├── first-startup-setup.md              # 「初回起動と設定」
│   │   ├── basic-commands-intro.md             # 「基本コマンド入門」
│   │   ├── file-operations-basics.md           # 「ファイル操作の基礎」
│   │   ├── simple-code-generation.md           # 「簡単なコード生成」
│   │   └── common-initial-issues.md            # 「よくある初期設定の問題」
│   └── initial-setup/                          # 「初回設定完全ガイド」サブカテゴリ
│       ├── initial-setup.md                    # 「初回設定完全ガイド」のindexページ
│       ├── claude-md-setup.md                  # 「CLAUDE.mdファイルの設定」
│       ├── project-specific-settings.md        # 「プロジェクト固有設定」
│       ├── team-settings.md                    # 「チーム設定」
│       └── security-settings.md               # 「セキュリティ設定」
├── practical-techniques/                      # 「実践テクニック」のカテゴリ
│   ├── practical-techniques.md                 # 「実践テクニック」のindexページ
│   ├── best-practices/                         # 「ベストプラクティス集」サブカテゴリ
│   │   ├── best-practices.md                   # 「ベストプラクティス集」のindexページ
│   │   ├── effective-prompt-design.md          # 「効果的なプロンプト設計」
│   │   ├── context-management.md               # 「コンテキスト管理手法」
│   │   ├── quality-management-review.md        # 「品質管理とレビュー」
│   │   ├── performance-optimization.md         # 「パフォーマンス最適化」
│   │   └── security-considerations.md          # 「セキュリティ考慮事項」
│   ├── prompt-patterns/                        # 「プロンプト設計パターン」サブカテゴリ
│   │   ├── prompt-patterns.md                  # 「プロンプト設計パターン」のindexページ
│   │   ├── few-shot-prompting.md               # 「Few-shotプロンプティング」
│   │   ├── chain-of-thought.md                 # 「Chain-of-thoughtプロンプト」
│   │   ├── task-specific-prompts.md            # 「タスク特化型プロンプト」
│   │   ├── error-handling-prompts.md           # 「エラー処理プロンプト」
│   │   └── domain-specific-prompts.md          # 「ドメイン特化プロンプト」
│   ├── workflow-optimization/                  # 「ワークフロー最適化」サブカテゴリ
│   │   ├── workflow-optimization.md            # 「ワークフロー最適化」のindexページ
│   │   ├── development-flow-integration.md     # 「開発フロー統合」
│   │   ├── git-integration-workflow.md         # 「Git連携ワークフロー」
│   │   ├── test-driven-development.md          # 「テスト駆動開発（TDD）」
│   │   ├── code-review-automation.md           # 「コードレビュー自動化」
│   │   └── documentation-automation.md         # 「ドキュメント自動生成」
│   └── troubleshooting/                        # 「トラブルシューティング」サブカテゴリ
│       ├── troubleshooting.md                  # 「トラブルシューティング」のindexページ
│       ├── common-errors-solutions.md          # 「よくあるエラーと解決法」
│       ├── performance-diagnostics.md          # 「パフォーマンス問題診断」
│       ├── auth-connection-issues.md           # 「認証・接続問題」
│       ├── memory-resource-management.md       # 「メモリ・リソース管理」
│       └── debugging-methods.md               # 「デバッグ手法」
├── advanced-usage/                            # 「高度な活用」のカテゴリ
│   ├── advanced-usage.md                       # 「高度な活用」のindexページ
│   ├── mcp-integration/                        # 「MCP統合ガイド」サブカテゴリ
│   │   ├── mcp-integration.md                  # 「MCP統合ガイド」のindexページ
│   │   ├── mcp-protocol-basics.md              # 「MCPプロトコル基礎」
│   │   ├── custom-server-construction.md       # 「カスタムサーバー構築」
│   │   ├── external-service-integration.md     # 「外部サービス統合」
│   │   ├── database-integration.md             # 「データベース連携」
│   │   └── api-integration-patterns.md         # 「API統合パターン」
│   ├── custom-commands/                        # 「カスタムコマンド作成」サブカテゴリ
│   │   ├── custom-commands.md                  # 「カスタムコマンド作成」のindexページ
│   │   ├── slash-commands-basics.md            # 「スラッシュコマンド基礎」
│   │   ├── advanced-command-design.md          # 「高度なコマンド設計」
│   │   ├── arguments-parameters.md             # 「引数とパラメータ活用」
│   │   ├── conditional-logic.md                # 「条件分岐とロジック」
│   │   ├── error-handling.md                   # 「エラーハンドリング」
│   │   ├── practical-examples/                 # 「実践的コマンド例」サブサブカテゴリ
│   │   │   ├── practical-examples.md           # 「実践的コマンド例」のindexページ
│   │   │   ├── code-review-command.md          # 「コードレビューコマンド」
│   │   │   ├── refactoring-command.md          # 「リファクタリングコマンド」
│   │   │   ├── test-generation-command.md      # 「テスト生成コマンド」
│   │   │   ├── doc-generation-command.md       # 「ドキュメント生成コマンド」
│   │   │   └── security-check-command.md       # 「セキュリティチェックコマンド」
│   │   └── command-distribution.md             # 「コマンド配布・共有」
│   ├── enterprise-deployment/                  # 「エンタープライズ導入」サブカテゴリ
│   │   ├── enterprise-deployment.md            # 「エンタープライズ導入」のindexページ
│   │   ├── large-team-deployment.md            # 「大規模チーム展開」
│   │   ├── access-control.md                   # 「権限管理・アクセス制御」
│   │   ├── audit-compliance.md                 # 「監査ログ・コンプライアンス」
│   │   ├── proxy-network-settings.md           # 「プロキシ・ネットワーク設定」
│   │   ├── sso-auth-integration.md             # 「SSO・認証統合」
│   │   └── security-policies.md               # 「セキュリティポリシー」
│   └── cicd-integration/                       # 「CI/CD統合」サブカテゴリ
│       ├── cicd-integration.md                 # 「CI/CD統合」のindexページ
│       ├── github-actions-integration.md       # 「GitHub Actions統合」
│       ├── jenkins-integration.md              # 「Jenkins統合」
│       ├── azure-devops-integration.md         # 「Azure DevOps統合」
│       ├── automated-test-pipeline.md          # 「自動テストパイプライン」
│       └── deployment-automation.md           # 「デプロイ自動化」
├── awesome-claude-code/                       # 「Awesome Claude Code」のカテゴリ
│   ├── awesome-claude-code.md                  # 「Awesome Claude Code」のindexページ
│   ├── community-resources/                   # 「コミュニティリソース」サブカテゴリ
│   │   ├── community-resources.md             # 「コミュニティリソース」のindexページ
│   │   ├── awesome-overview.md                # 「Awesome Claude Code概要」
│   │   ├── contribution-guide.md              # 「コミュニティ貢献ガイド」
│   │   └── resource-submission.md             # 「リソース投稿方法」
│   ├── slash-commands/                        # 「スラッシュコマンドコレクション」サブカテゴリ
│   │   ├── slash-commands.md                  # 「スラッシュコマンドコレクション」のindexページ
│   │   ├── version-control-commands.md        # 「バージョン管理コマンド」
│   │   ├── code-analysis-commands.md          # 「コード解析コマンド」
│   │   ├── context-loading-commands.md        # 「コンテキスト読み込みコマンド」
│   │   ├── project-management-commands.md     # 「プロジェクト管理コマンド」
│   │   ├── ci-deploy-commands.md              # 「CI/デプロイコマンド」
│   │   ├── productivity-commands.md           # 「開発効率化コマンド」
│   │   └── custom-workflow-commands.md        # 「カスタムワークフローコマンド」
│   ├── claude-md-templates/                   # 「CLAUDE.mdテンプレート集」サブカテゴリ
│   │   ├── claude-md-templates.md             # 「CLAUDE.mdテンプレート集」のindexページ
│   │   ├── language-templates/                # 「言語別設定テンプレート」サブサブカテゴリ
│   │   │   ├── language-templates.md          # 「言語別設定テンプレート」のindexページ
│   │   │   ├── javascript-typescript.md       # 「JavaScript/TypeScript設定」
│   │   │   ├── python-template.md             # 「Python設定」
│   │   │   ├── java-template.md               # 「Java設定」
│   │   │   ├── csharp-dotnet-template.md      # 「C#/.NET設定」
│   │   │   ├── go-template.md                 # 「Go設定」
│   │   │   └── rust-template.md               # 「Rust設定」
│   │   ├── domain-templates/                  # 「ドメイン別設定テンプレート」サブサブカテゴリ
│   │   │   ├── domain-templates.md            # 「ドメイン別設定テンプレート」のindexページ
│   │   │   ├── web-development.md             # 「Web開発設定」
│   │   │   ├── mobile-development.md          # 「モバイル開発設定」
│   │   │   ├── devops-infrastructure.md       # 「DevOps/インフラ設定」
│   │   │   ├── data-science.md                # 「データサイエンス設定」
│   │   │   └── game-development.md            # 「ゲーム開発設定」
│   │   ├── project-templates/                 # 「プロジェクト構成テンプレート」サブサブカテゴリ
│   │   │   ├── project-templates.md           # 「プロジェクト構成テンプレート」のindexページ
│   │   │   ├── monorepo-template.md           # 「モノレポ設定」
│   │   │   ├── microservices-template.md      # 「マイクロサービス設定」
│   │   │   ├── library-development.md         # 「ライブラリ開発設定」
│   │   │   └── saas-development.md            # 「SaaS開発設定」
│   │   └── organization-templates/            # 「企業・チーム設定テンプレート」サブサブカテゴリ
│   │       ├── organization-templates.md      # 「企業・チーム設定テンプレート」のindexページ
│   │       ├── startup-template.md            # 「スタートアップ向け設定」
│   │       ├── enterprise-template.md         # 「エンタープライズ向け設定」
│   │       ├── opensource-template.md         # 「オープンソース向け設定」
│   │       └── educational-template.md        # 「教育機関向け設定」
│   ├── cli-tools/                             # 「CLIツール・統合ツール」サブカテゴリ
│   │   ├── cli-tools.md                       # 「CLIツール・統合ツール」のindexページ
│   │   ├── development-tools/                 # 「開発ツール」サブサブカテゴリ
│   │   │   ├── development-tools.md           # 「開発ツール」のindexページ
│   │   │   ├── cc-tools.md                    # 「cc-tools（Go実装ツール）」
│   │   │   ├── ccexp.md                       # 「ccexp（設定探索CLI）」
│   │   │   ├── cchistory.md                   # 「cchistory（履歴追跡）」
│   │   │   └── custom-build-tools.md          # 「カスタムビルドツール」
│   │   ├── ide-integrations/                  # 「IDE統合」サブサブカテゴリ
│   │   │   ├── ide-integrations.md            # 「IDE統合」のindexページ
│   │   │   ├── vscode-extension.md            # 「VS Code拡張機能」
│   │   │   ├── emacs-integration.md           # 「Emacs統合（claude-code.el）」
│   │   │   ├── neovim-plugin.md               # 「Neovim プラグイン（claude-code.nvim）」
│   │   │   ├── intellij-integration.md        # 「IntelliJ IDEA統合」
│   │   │   └── sublime-integration.md         # 「Sublime Text統合」
│   │   ├── monitoring-tools/                  # 「使用状況監視ツール」サブサブカテゴリ
│   │   │   ├── monitoring-tools.md            # 「使用状況監視ツール」のindexページ
│   │   │   ├── cc-usage.md                    # 「CC Usage（CLI使用分析）」
│   │   │   ├── ccflare.md                     # 「ccflare（Web使用ダッシュボード）」
│   │   │   ├── usage-reports.md               # 「使用量レポート」
│   │   │   └── performance-monitoring.md      # 「パフォーマンス監視」
│   │   └── automation-tools/                  # 「自動化・統合ツール」サブサブカテゴリ
│   │       ├── automation-tools.md            # 「自動化・統合ツール」のindexページ
│   │       ├── cicd-integration-tools.md      # 「CI/CD統合ツール」
│   │       ├── deployment-automation-tools.md # 「デプロイメント自動化」
│   │       ├── test-automation-tools.md       # 「テスト自動化ツール」
│   │       └── monitoring-integration.md      # 「モニタリング統合」
│   ├── workflows/                             # 「ワークフロー・知識ガイド」サブカテゴリ
│   │   ├── workflows.md                       # 「ワークフロー・知識ガイド」のindexページ
│   │   ├── ab-method.md                       # 「ABメソッド（仕様駆動ワークフロー）」
│   │   ├── project-management-workflow.md     # 「プロジェクト管理ワークフロー」
│   │   ├── blog-platform-instructions.md     # 「ブログプラットフォーム指示書」
│   │   ├── design-review-workflow.md          # 「デザインレビューワークフロー」
│   │   ├── code-review-automation-workflow.md # 「コードレビュー自動化ワークフロー」
│   │   ├── documentation-workflow.md          # 「ドキュメント生成ワークフロー」
│   │   └── quality-assurance-workflow.md     # 「品質保証ワークフロー」
│   └── plugins-extensions/                    # 「プラグイン・拡張機能」サブカテゴリ
│       ├── plugins-extensions.md              # 「プラグイン・拡張機能」のindexページ
│       ├── development-extensions.md          # 「開発環境拡張」
│       ├── build-system-integration.md        # 「ビルドシステム統合」
│       ├── version-control-extensions.md      # 「バージョン管理拡張」
│       ├── external-service-integrations.md   # 「外部サービス連携」
│       └── custom-extension-development.md    # 「カスタム拡張開発ガイド」
├── case-studies/                              # 「実例・ケーススタディ」のカテゴリ
│   ├── case-studies.md                         # 「実例・ケーススタディ」のindexページ
│   ├── industry-cases/                         # 「業界別活用事例」サブカテゴリ
│   │   ├── industry-cases.md                   # 「業界別活用事例」のindexページ
│   │   ├── web-development-companies.md        # 「Web開発企業の事例」
│   │   ├── mobile-app-development.md           # 「モバイルアプリ開発の事例」
│   │   ├── saas-companies.md                   # 「SaaS企業の事例」
│   │   ├── enterprise-companies.md             # 「エンタープライズ企業の事例」
│   │   └── startup-cases.md                   # 「スタートアップの事例」
│   ├── project-success/                        # 「プロジェクト成功事例」サブカテゴリ
│   │   ├── project-success.md                  # 「プロジェクト成功事例」のindexページ
│   │   ├── legacy-system-renewal.md            # 「レガシーシステム刷新」
│   │   ├── new-product-development.md          # 「新規プロダクト開発」
│   │   ├── development-speed-improvement.md    # 「開発速度向上プロジェクト」
│   │   ├── quality-improvement.md              # 「品質改善プロジェクト」
│   │   └── team-productivity-improvement.md    # 「チーム生産性向上」
│   ├── roi-measurement/                        # 「ROI・効果測定」サブカテゴリ
│   │   ├── roi-measurement.md                  # 「ROI・効果測定」のindexページ
│   │   ├── development-time-reduction.md       # 「開発時間短縮効果」
│   │   ├── quality-improvement-effects.md      # 「品質向上効果」
│   │   ├── cost-reduction-effects.md           # 「コスト削減効果」
│   │   ├── learning-cost-evaluation.md         # 「学習コスト評価」
│   │   └── roi-calculation-methods.md          # 「ROI計算方法」
│   └── failure-lessons/                        # 「失敗事例から学ぶ」サブカテゴリ
│       ├── failure-lessons.md                  # 「失敗事例から学ぶ」のindexページ
│       ├── deployment-failure-patterns.md      # 「導入失敗パターン」
│       ├── operational-challenges.md           # 「運用課題と対策」
│       ├── team-resistance-handling.md         # 「チーム抵抗への対処」
│       └── improvement-processes.md           # 「改善・修正プロセス」
├── training-certification/                    # 「トレーニング・認定」のカテゴリ（有料導線）
│   ├── training-certification.md               # 「トレーニング・認定」のindexページ
│   ├── online-courses/                         # 「オンライン基礎コース」サブカテゴリ
│   │   ├── online-courses.md                   # 「オンライン基礎コース」のindexページ
│   │   ├── basic-mastery-course.md             # 「基礎習得コース」
│   │   ├── practical-usage-course.md           # 「実践活用コース」
│   │   ├── advanced-master-course.md           # 「上級マスターコース」
│   │   └── free-trial-lessons.md              # 「無料体験レッスン」
│   ├── corporate-training/                     # 「企業向け研修プログラム」サブカテゴリ
│   │   ├── corporate-training.md               # 「企業向け研修プログラム」のindexページ
│   │   ├── team-deployment-training.md         # 「チーム導入研修」
│   │   ├── enterprise-deployment-support.md    # 「エンタープライズ展開支援」
│   │   ├── custom-training-programs.md         # 「カスタム研修プログラム」
│   │   └── deployment-consulting.md           # 「導入コンサルティング」
│   ├── certification/                          # 「認定試験・資格取得」サブカテゴリ
│   │   ├── certification.md                    # 「認定試験・資格取得」のindexページ
│   │   ├── claude-code-certification.md        # 「Claude Code認定試験」
│   │   ├── enterprise-certification.md         # 「企業認定プログラム」
│   │   ├── trainer-certification.md            # 「トレーナー認定制度」
│   │   └── continuing-education.md            # 「継続教育プログラム」
│   └── workshops-events/                       # 「ワークショップ・イベント」サブカテゴリ
│       ├── workshops-events.md                 # 「ワークショップ・イベント」のindexページ
│       ├── regular-webinars.md                 # 「定期ウェビナー」
│       ├── hands-on-workshops.md               # 「ハンズオンワークショップ」
│       ├── user-conference.md                  # 「ユーザーカンファレンス」
│       └── technical-seminars.md              # 「技術セミナー」
└── resources-support/                         # 「リソース・サポート」のカテゴリ
    ├── resources-support.md                    # 「リソース・サポート」のindexページ
    ├── api-reference/                          # 「API/機能リファレンス」サブカテゴリ
    │   ├── api-reference.md                    # 「API/機能リファレンス」のindexページ
    │   ├── command-reference.md                # 「コマンドリファレンス」
    │   ├── mcp-api-documentation.md            # 「MCP APIドキュメント」
    │   ├── config-file-reference.md            # 「設定ファイルリファレンス」
    │   └── prompt-template-collection.md       # 「プロンプトテンプレート集」
    ├── faq/                                    # 「FAQ・よくある質問」サブカテゴリ
    │   ├── faq.md                              # 「FAQ・よくある質問」のindexページ
    │   ├── installation-setup-faq.md           # 「インストール・設定関連」
    │   ├── basic-operations-faq.md             # 「基本操作関連」
    │   ├── troubleshooting-faq.md              # 「トラブルシューティング」
    │   ├── enterprise-faq.md                   # 「エンタープライズ関連」
    │   └── license-pricing-faq.md             # 「ライセンス・料金関連」
    ├── community/                              # 「コミュニティフォーラム」サブカテゴリ
    │   ├── community.md                        # 「コミュニティフォーラム」のindexページ
    │   ├── qa-forum.md                         # 「質問・回答フォーラム」
    │   ├── case-sharing-community.md           # 「事例共有コミュニティ」
    │   ├── command-sharing-library.md          # 「コマンド共有ライブラリ」
    │   └── developer-community.md             # 「開発者コミュニティ」
    └── updates/                                # 「アップデート情報」サブカテゴリ
        ├── updates.md                          # 「アップデート情報」のindexページ
        ├── release-notes.md                    # 「リリースノート」
        ├── new-features.md                     # 「新機能解説」
        ├── important-announcements.md          # 「重要なお知らせ」
        └── roadmap.md                         # 「ロードマップ」
```