# コンテンツのディレクトリ・ファイル構造定義

```text
contents/chatgpt/contents/
├── home.md                                         # トップページ
├── getting-started/                                # 「はじめに」のカテゴリ（4ページ）
│   ├── getting-started.md                          # 「はじめに」のindexページ
│   ├── overview.md                                 # 「概要」ページ
│   ├── what-is-chatgpt.md                          # 「ChatGPTとは」ページ
│   ├── account-setup.md                            # 「アカウント作成」ページ
│   └── initial-setup.md                            # 「初回セットアップ」ページ
├── chatgpt-basics/                                 # 「ChatGPT基礎」のカテゴリ（20ページ）
│   ├── chatgpt-basics.md                           # 「ChatGPT基礎」のindexページ
│   ├── basic-operations/                           # 「基本操作」サブカテゴリ
│   │   ├── basic-operations.md                     # 「基本操作」のindexページ
│   │   ├── interface-operations.md                 # 「インターフェース操作」
│   │   ├── basic-prompts.md                        # 「基本的なプロンプト作成」
│   │   ├── conversation-continuation.md            # 「会話継続のコツ」
│   │   └── history-management.md                   # 「履歴管理」
│   ├── prompt-basics/                              # 「プロンプト基礎」サブカテゴリ
│   │   ├── prompt-basics.md                        # 「プロンプト基礎」のindexページ
│   │   ├── prompt-structure.md                     # 「プロンプトの構造」
│   │   ├── instruction-methods.md                  # 「指示の与え方」
│   │   ├── context-setting.md                      # 「コンテキスト設定」
│   │   ├── output-format.md                        # 「出力形式指定」
│   │   └── improvement-techniques.md               # 「改善テクニック」
│   ├── usage-patterns/                             # 「活用パターン」サブカテゴリ
│   │   ├── usage-patterns.md                       # 「活用パターン」のindexページ
│   │   ├── document-creation.md                    # 「文書作成支援」
│   │   ├── idea-generation.md                      # 「アイデア発想」
│   │   ├── learning-support.md                     # 「学習サポート」
│   │   ├── translation-summary.md                  # 「翻訳・要約」
│   │   └── qa-utilization.md                       # 「Q&A活用」
│   └── common-issues/                              # 「よくある問題と解決法」サブカテゴリ
│       ├── common-issues.md                        # 「よくある問題と解決法」のindexページ
│       ├── unexpected-answers.md                   # 「期待した答えが得られない」
│       ├── information-accuracy.md                 # 「情報の正確性について」
│       ├── long-prompts.md                         # 「プロンプトが長すぎる」
│       └── response-speed.md                       # 「応答速度の改善」
├── gpt5-latest-features/                           # 「GPT-5・最新機能活用」のカテゴリ（30ページ）
│   ├── gpt5-latest-features.md                     # 「GPT-5・最新機能活用」のindexページ
│   ├── gpt5-overview/                              # 「GPT-5概要」サブカテゴリ
│   │   ├── gpt5-overview.md                        # 「GPT-5概要」のindexページ
│   │   ├── differences-from-gpt4.md                # 「GPT-4との違い」
│   │   ├── performance-improvements.md             # 「パフォーマンス向上点」
│   │   ├── new-features-list.md                    # 「新機能一覧」
│   │   └── available-plans.md                      # 「利用可能プラン」
│   ├── thinking-mode/                              # 「思考モード」サブカテゴリ
│   │   ├── thinking-mode.md                        # 「思考モード」のindexページ
│   │   ├── mode-switching.md                       # 「使い分けのポイント」
│   │   ├── complex-reasoning.md                    # 「複雑な推論」
│   │   ├── math-logic-problems.md                  # 「数学・論理問題」
│   │   └── creative-planning.md                    # 「創作・企画立案」
│   ├── non-thinking-mode/                          # 「非思考モード」サブカテゴリ
│   │   ├── non-thinking-mode.md                    # 「非思考モード」のindexページ
│   │   ├── fast-response.md                        # 「高速レスポンス活用」
│   │   ├── routine-automation.md                   # 「定型業務の自動化」
│   │   └── realtime-dialogue.md                    # 「リアルタイム対話」
│   ├── multimodal/                                 # 「マルチモーダル活用」サブカテゴリ
│   │   ├── multimodal.md                           # 「マルチモーダル活用」のindexページ
│   │   ├── image-analysis.md                       # 「画像解析・生成」
│   │   ├── voice-recognition.md                    # 「音声認識・合成」
│   │   ├── code-analysis.md                        # 「コード解析・生成」
│   │   └── data-visualization.md                   # 「データ可視化」
│   ├── sora-video-generation/                      # 「Sora動画生成」サブカテゴリ
│   │   ├── sora-video-generation.md                # 「Sora動画生成」のindexページ
│   │   ├── sora-basics.md                          # 「Soraの基本概念」
│   │   ├── video-prompt-techniques.md              # 「動画生成プロンプト技法」
│   │   ├── creative-applications.md                # 「クリエイティブ活用法」
│   │   ├── business-use-cases.md                   # 「ビジネス活用事例」
│   │   └── quality-improvement.md                  # 「品質向上テクニック」
│   └── million-token/                              # 「100万トークン処理」サブカテゴリ
│       ├── million-token.md                        # 「100万トークン処理」のindexページ
│       ├── large-document-processing.md            # 「大容量文書処理」
│       ├── multiple-file-analysis.md               # 「複数ファイル同時解析」
│       ├── long-text-summary.md                    # 「長文要約テクニック」
│       └── performance-optimization.md             # 「パフォーマンス最適化」
├── prompt-engineering/                             # 「プロンプトエンジニアリング」のカテゴリ（25ページ）
│   ├── prompt-engineering.md                       # 「プロンプトエンジニアリング」のindexページ
│   ├── advanced-techniques/                        # 「高度なプロンプト技術」サブカテゴリ
│   │   ├── advanced-techniques.md                  # 「高度なプロンプト技術」のindexページ
│   │   ├── chain-of-thought.md                     # 「Chain-of-Thought」
│   │   ├── few-shot-learning.md                    # 「Few-shot Learning」
│   │   ├── zero-shot-prompting.md                  # 「Zero-shot Prompting」
│   │   ├── role-setting.md                         # 「役割設定テクニック」
│   │   └── system-prompt-design.md                 # 「システムプロンプト設計」
│   ├── prompt-templates/                           # 「プロンプトテンプレート」サブカテゴリ
│   │   ├── prompt-templates.md                     # 「プロンプトテンプレート」のindexページ
│   │   ├── business-documents.md                   # 「ビジネス文書作成」
│   │   ├── analysis-reports.md                     # 「分析・レポート」
│   │   ├── proposals.md                            # 「企画書・提案書」
│   │   ├── marketing.md                            # 「マーケティング」
│   │   └── technical-documentation.md              # 「技術文書作成」
│   ├── evaluation-improvement/                     # 「評価・改善手法」サブカテゴリ
│   │   ├── evaluation-improvement.md               # 「評価・改善手法」のindexページ
│   │   ├── evaluation-metrics.md                   # 「プロンプト評価指標」
│   │   ├── ab-testing.md                           # 「A/Bテスト手法」
│   │   ├── continuous-improvement.md               # 「継続的改善プロセス」
│   │   ├── version-management.md                   # 「バージョン管理」
│   │   └── effectiveness-measurement.md            # 「効果測定」
│   ├── api-utilization/                            # 「API活用」サブカテゴリ
│   │   ├── api-utilization.md                      # 「API活用」のindexページ
│   │   ├── openai-api-basics.md                    # 「OpenAI API基礎」
│   │   ├── parameter-adjustment.md                 # 「パラメータ調整」
│   │   ├── batch-processing.md                     # 「バッチ処理」
│   │   ├── error-handling.md                       # 「エラーハンドリング」
│   │   └── cost-optimization.md                    # 「コスト最適化」
│   └── career-development/                         # 「プロンプトエンジニアとしてのキャリア」サブカテゴリ
│       ├── career-development.md                   # 「プロンプトエンジニアとしてのキャリア」のindexページ
│       ├── required-skills.md                      # 「必要スキル・知識」
│       ├── portfolio-creation.md                   # 「ポートフォリオ作成」
│       ├── project-acquisition.md                  # 「案件獲得方法」
│       ├── pricing-negotiation.md                  # 「単価設定・交渉」
│       └── continuous-learning.md                  # 「継続学習」
├── security-governance/                            # 「セキュリティ・ガバナンス」のカテゴリ（25ページ）
│   ├── security-governance.md                      # 「セキュリティ・ガバナンス」のindexページ
│   ├── security-risks/                             # 「セキュリティリスク」サブカテゴリ
│   │   ├── security-risks.md                       # 「セキュリティリスク」のindexページ
│   │   ├── information-leakage.md                  # 「情報漏洩リスク」
│   │   ├── data-training-usage.md                  # 「データ学習利用」
│   │   ├── shadow-it-problems.md                   # 「Shadow IT問題」
│   │   ├── prompt-injection.md                     # 「プロンプトインジェクション」
│   │   └── model-attacks.md                        # 「モデル攻撃」
│   ├── enterprise-security/                        # 「企業導入のセキュリティ対策」サブカテゴリ
│   │   ├── enterprise-security.md                  # 「企業導入のセキュリティ対策」のindexページ
│   │   ├── chatgpt-enterprise.md                   # 「ChatGPT Enterprise」
│   │   ├── azure-openai-service.md                 # 「Azure OpenAI Service」
│   │   ├── data-encryption.md                      # 「データ暗号化」
│   │   ├── access-control.md                       # 「アクセス制御」
│   │   └── audit-logs.md                           # 「監査ログ」
│   ├── usage-policies/                             # 「利用ポリシー策定」サブカテゴリ
│   │   ├── usage-policies.md                       # 「利用ポリシー策定」のindexページ
│   │   ├── guideline-creation.md                   # 「ガイドライン作成」
│   │   ├── prohibition-rules.md                    # 「禁止事項設定」
│   │   ├── approval-process.md                     # 「承認プロセス」
│   │   ├── training-system.md                      # 「研修体制」
│   │   └── violation-response.md                   # 「違反時対応」
│   ├── compliance/                                 # 「コンプライアンス」サブカテゴリ
│   │   ├── compliance.md                           # 「コンプライアンス」のindexページ
│   │   ├── gdpr-compliance.md                      # 「GDPR対応」
│   │   ├── privacy-protection.md                   # 「個人情報保護法」
│   │   ├── industry-regulations.md                 # 「業界規制対応」
│   │   ├── internal-controls.md                    # 「内部統制」
│   │   └── risk-assessment.md                      # 「リスク評価」
│   └── incident-response/                          # 「インシデント対応」サブカテゴリ
│       ├── incident-response.md                    # 「インシデント対応」のindexページ
│       ├── accident-response.md                    # 「事故発生時対応」
│       ├── damage-assessment.md                    # 「被害範囲調査」
│       ├── recovery-procedures.md                  # 「復旧手順」
│       ├── prevention-measures.md                  # 「再発防止策」
│       └── reporting-notification.md               # 「報告・通知」
├── industry-applications/                          # 「業界別実践活用」のカテゴリ（30ページ）
│   ├── industry-applications.md                    # 「業界別実践活用」のindexページ
│   ├── manufacturing/                              # 「製造業」サブカテゴリ
│   │   ├── manufacturing.md                        # 「製造業」のindexページ
│   │   ├── quality-management.md                   # 「品質管理AI活用」
│   │   ├── production-efficiency.md                # 「生産効率化」
│   │   ├── supply-chain-optimization.md            # 「サプライチェーン最適化」
│   │   ├── equipment-maintenance.md                # 「設備保全支援」
│   │   └── technical-documentation.md              # 「技術文書管理」
│   ├── education/                                  # 「教育機関」サブカテゴリ
│   │   ├── education.md                            # 「教育機関」のindexページ
│   │   ├── chatgpt-edu-implementation.md           # 「ChatGPT Edu導入」
│   │   ├── personalized-learning.md                # 「個別最適化学習」
│   │   ├── academic-ethics.md                      # 「学術倫理ガイドライン」
│   │   ├── evaluation-support.md                   # 「評価・採点支援」
│   │   └── material-creation.md                    # 「教材作成効率化」
│   ├── healthcare/                                 # 「医療・ヘルスケア」サブカテゴリ
│   │   ├── healthcare.md                           # 「医療・ヘルスケア」のindexページ
│   │   ├── medical-documentation.md                # 「医療文書作成」
│   │   ├── patient-support.md                      # 「患者対応支援」
│   │   ├── research-data-analysis.md               # 「研究データ分析」
│   │   ├── medical-ethics-ai.md                    # 「医療倫理とAI」
│   │   └── diagnostic-support.md                   # 「診断支援ツール」
│   ├── finance-insurance/                          # 「金融・保険」サブカテゴリ
│   │   ├── finance-insurance.md                    # 「金融・保険」のindexページ
│   │   ├── customer-service.md                     # 「顧客サービス向上」
│   │   ├── risk-analysis.md                        # 「リスク分析支援」
│   │   ├── report-automation.md                    # 「レポート自動生成」
│   │   ├── compliance-support.md                   # 「コンプライアンス対応」
│   │   └── investment-support.md                   # 「投資判断支援」
│   └── marketing-advertising/                      # 「マーケティング・広告」サブカテゴリ
│       ├── marketing-advertising.md                # 「マーケティング・広告」のindexページ
│       ├── content-creation.md                     # 「コンテンツ制作」
│       ├── campaign-planning.md                    # 「キャンペーン企画」
│       ├── customer-analysis.md                    # 「顧客分析」
│       ├── seo-optimization.md                     # 「SEO対策」
│       └── social-media-management.md              # 「SNS運用」
├── gpts-custom-ai/                                 # 「GPTs・カスタムAI構築」のカテゴリ（25ページ）
│   ├── gpts-custom-ai.md                           # 「GPTs・カスタムAI構築」のindexページ
│   ├── gpts-overview/                              # 「GPTs概要」サブカテゴリ
│   │   ├── gpts-overview.md                        # 「GPTs概要」のindexページ
│   │   ├── what-are-gpts.md                        # 「GPTsとは何か」
│   │   ├── chatgpt-differences.md                  # 「ChatGPTとの違い」
│   │   ├── utilization-benefits.md                 # 「活用メリット」
│   │   ├── pricing-plans.md                        # 「料金・プラン」
│   │   └── getting-started.md                      # 「利用開始方法」
│   ├── custom-gpt-creation/                        # 「カスタムGPT作成」サブカテゴリ
│   │   ├── custom-gpt-creation.md                  # 「カスタムGPT作成」のindexページ
│   │   ├── gpt-creation-basics.md                  # 「GPT作成の基本」
│   │   ├── settings-customization.md               # 「設定・カスタマイズ」
│   │   ├── knowledge-base-construction.md          # 「ナレッジベース構築」
│   │   ├── function-tool-integration.md            # 「機能・ツール連携」
│   │   └── testing-debugging.md                    # 「テスト・デバッグ」
│   ├── advanced-gpt-development/                   # 「高度なGPT開発」サブカテゴリ
│   │   ├── advanced-gpt-development.md             # 「高度なGPT開発」のindexページ
│   │   ├── actions-configuration.md                # 「Actions設定」
│   │   ├── api-schema-design.md                    # 「APIスキーマ設計」
│   │   ├── authentication-security.md              # 「認証・セキュリティ」
│   │   ├── error-handling.md                       # 「エラーハンドリング」
│   │   └── performance-optimization.md             # 「パフォーマンス最適化」
│   ├── gpts-operations-management/                 # 「GPTs運用・管理」サブカテゴリ
│   │   ├── gpts-operations-management.md           # 「GPTs運用・管理」のindexページ
│   │   ├── publish-share-settings.md               # 「公開・共有設定」
│   │   ├── version-management.md                   # 「バージョン管理」
│   │   ├── usage-statistics-analysis.md            # 「利用統計・分析」
│   │   ├── maintenance.md                          # 「メンテナンス」
│   │   └── improvement-updates.md                  # 「改善・アップデート」
│   └── gpts-business-utilization/                  # 「GPTsビジネス活用」サブカテゴリ
│       ├── gpts-business-utilization.md            # 「GPTsビジネス活用」のindexページ
│       ├── business-efficiency-gpt.md              # 「業務効率化GPT」
│       ├── customer-support-gpt.md                 # 「顧客サポートGPT」
│       ├── education-training-gpt.md               # 「教育・研修GPT」
│       ├── marketing-gpt.md                        # 「マーケティングGPT」
│       └── monetization-strategy.md                # 「収益化戦略」
├── industry-codex-applications/                    # 「業界別実践活用・Codex」のカテゴリ（40ページ）
│   ├── industry-codex-applications.md              # 「業界別実践活用・Codex」のindexページ
│   ├── manufacturing/                              # 「製造業」サブカテゴリ
│   │   ├── manufacturing.md                        # 「製造業」のindexページ
│   │   ├── quality-management.md                   # 「品質管理AI活用」
│   │   ├── production-efficiency.md                # 「生産効率化」
│   │   ├── supply-chain-optimization.md            # 「サプライチェーン最適化」
│   │   ├── equipment-maintenance.md                # 「設備保全支援」
│   │   └── technical-documentation.md              # 「技術文書管理」
│   ├── education/                                  # 「教育機関」サブカテゴリ
│   │   ├── education.md                            # 「教育機関」のindexページ
│   │   ├── chatgpt-edu-implementation.md           # 「ChatGPT Edu導入」
│   │   ├── personalized-learning.md                # 「個別最適化学習」
│   │   ├── academic-ethics.md                      # 「学術倫理ガイドライン」
│   │   ├── evaluation-support.md                   # 「評価・採点支援」
│   │   └── material-creation.md                    # 「教材作成効率化」
│   ├── healthcare/                                 # 「医療・ヘルスケア」サブカテゴリ
│   │   ├── healthcare.md                           # 「医療・ヘルスケア」のindexページ
│   │   ├── medical-documentation.md                # 「医療文書作成」
│   │   ├── patient-support.md                      # 「患者対応支援」
│   │   ├── research-data-analysis.md               # 「研究データ分析」
│   │   ├── medical-ethics-ai.md                    # 「医療倫理とAI」
│   │   └── diagnostic-support.md                   # 「診断支援ツール」
│   ├── finance-insurance/                          # 「金融・保険」サブカテゴリ
│   │   ├── finance-insurance.md                    # 「金融・保険」のindexページ
│   │   ├── customer-service.md                     # 「顧客サービス向上」
│   │   ├── risk-analysis.md                        # 「リスク分析支援」
│   │   ├── report-automation.md                    # 「レポート自動生成」
│   │   ├── compliance-support.md                   # 「コンプライアンス対応」
│   │   └── investment-support.md                   # 「投資判断支援」
│   ├── marketing-advertising/                      # 「マーケティング・広告」サブカテゴリ
│   │   ├── marketing-advertising.md                # 「マーケティング・広告」のindexページ
│   │   ├── content-creation.md                     # 「コンテンツ制作」
│   │   ├── campaign-planning.md                    # 「キャンペーン企画」
│   │   ├── customer-analysis.md                    # 「顧客分析」
│   │   ├── seo-optimization.md                     # 「SEO対策」
│   │   └── social-media-management.md              # 「SNS運用」
│   └── it-software-codex/                          # 「IT・ソフトウェア開発・Codex」サブカテゴリ
│       ├── it-software-codex.md                    # 「IT・ソフトウェア開発・Codex」のindexページ
│       ├── codex-overview-basics.md                # 「Codex概要・基本活用」
│       ├── code-generation-completion.md           # 「コード生成・補完」
│       ├── refactoring-support.md                  # 「リファクタリング支援」
│       ├── test-auto-generation.md                 # 「テスト自動生成」
│       ├── bug-analysis-fix-support.md             # 「バグ解析・修正支援」
│       ├── documentation-auto-generation.md        # 「ドキュメント自動生成」
│       ├── multilingual-development.md             # 「多言語対応開発」
│       ├── legacy-code-conversion.md               # 「レガシーコード変換」
│       ├── devops-cicd-integration.md              # 「DevOps・CI/CD統合」
│       └── technical-research-learning.md          # 「技術調査・学習支援」
├── automation-integration/                         # 「自動化・ツール連携」のカテゴリ（20ページ）
│   ├── automation-integration.md                   # 「自動化・ツール連携」のindexページ
│   ├── business-automation/                        # 「業務自動化」サブカテゴリ
│   │   ├── business-automation.md                  # 「業務自動化」のindexページ
│   │   ├── rpa-integration.md                      # 「RPA連携」
│   │   ├── workflow-design.md                      # 「ワークフロー設計」
│   │   ├── batch-processing.md                     # 「バッチ処理」
│   │   ├── scheduled-execution.md                  # 「定期実行設定」
│   │   └── monitoring-notification.md              # 「監視・通知」
│   ├── tool-integration/                           # 「他ツール連携」サブカテゴリ
│   │   ├── tool-integration.md                     # 「他ツール連携」のindexページ
│   │   ├── office-integration.md                   # 「Microsoft Office連携」
│   │   ├── google-workspace.md                     # 「Google Workspace連携」
│   │   ├── slack-teams-integration.md              # 「Slack/Teams統合」
│   │   ├── crm-sfa-integration.md                  # 「CRM・SFA連携」
│   │   └── bi-analytics-integration.md             # 「BI・分析ツール連携」
│   ├── custom-development/                         # 「カスタムツール開発」サブカテゴリ
│   │   ├── custom-development.md                   # 「カスタムツール開発」のindexページ
│   │   ├── python-utilization.md                   # 「Python活用」
│   │   ├── web-api-development.md                  # 「Web API開発」
│   │   ├── chrome-extension.md                     # 「Chrome拡張機能」
│   │   ├── desktop-applications.md                 # 「デスクトップアプリ」
│   │   └── mobile-applications.md                  # 「モバイルアプリ」
│   └── operations-maintenance/                     # 「運用・保守」サブカテゴリ
│       ├── operations-maintenance.md               # 「運用・保守」のindexページ
│       ├── performance-monitoring.md               # 「パフォーマンス監視」
│       ├── error-handling.md                       # 「エラー対応」
│       ├── version-management.md                   # 「バージョン管理」
│       ├── troubleshooting.md                      # 「障害対応」
│       └── improvement-optimization.md             # 「改善・最適化」
├── best-practices/                                 # 「事例・ベストプラクティス」のカテゴリ（20ページ）
│   ├── best-practices.md                           # 「事例・ベストプラクティス」のindexページ
│   ├── success-cases/                              # 「成功事例集」サブカテゴリ
│   │   ├── success-cases.md                        # 「成功事例集」のindexページ
│   │   ├── efficiency-improvement.md               # 「業務効率化事例」
│   │   ├── cost-reduction.md                       # 「コスト削減事例」
│   │   ├── revenue-increase.md                     # 「売上向上事例」
│   │   ├── quality-improvement.md                  # 「品質改善事例」
│   │   └── innovation-creation.md                  # 「イノベーション創出事例」
│   ├── failure-lessons/                            # 「失敗事例・教訓」サブカテゴリ
│   │   ├── failure-lessons.md                      # 「失敗事例・教訓」のindexページ
│   │   ├── common-failure-patterns.md              # 「よくある失敗パターン」
│   │   ├── security-incidents.md                   # 「セキュリティ事故事例」
│   │   ├── implementation-failure.md               # 「導入失敗要因」
│   │   ├── countermeasures-prevention.md           # 「対策・予防法」
│   │   └── improvement-approaches.md               # 「改善アプローチ」
│   ├── organizational-implementation/              # 「組織導入ガイド」サブカテゴリ
│   │   ├── organizational-implementation.md        # 「組織導入ガイド」のindexページ
│   │   ├── implementation-roadmap.md               # 「導入ロードマップ」
│   │   ├── organizational-structure.md             # 「体制構築」
│   │   ├── budget-planning.md                      # 「予算計画」
│   │   ├── effectiveness-measurement.md            # 「効果測定」
│   │   └── continuous-improvement.md               # 「継続改善」
│   └── trends-predictions/                         # 「最新動向・未来予測」サブカテゴリ
│       ├── trends-predictions.md                   # 「最新動向・未来予測」のindexページ
│       ├── ai-technology-trends.md                 # 「AI技術トレンド」
│       ├── market-trend-analysis.md                # 「市場動向分析」
│       ├── competitor-trends.md                    # 「競合他社動向」
│       ├── regulations-legislation.md              # 「規制・法制度」
│       └── future-outlook.md                       # 「将来展望」
└── troubleshooting/                                # 「レベル10: トラブルシューティング・FAQ」のカテゴリ（4ページ）
    ├── troubleshooting.md                          # 「レベル10: トラブルシューティング・FAQ」のindexページ
    ├── frequently-asked-questions.md               # 「よくある質問」
    ├── error-solutions.md                          # 「エラー対処法」
    ├── performance-improvement.md                  # 「パフォーマンス改善」
    └── support-community.md                        # 「サポート・コミュニティ」
```

## ファイル数

約243ページ