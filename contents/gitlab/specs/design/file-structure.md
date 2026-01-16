# コンテンツのディレクトリ・ファイル構造定義

```text
contents/gitlab/contents/
├── home.md                                    # トップページ
├── sidebars.md                               # サイドバー
├── getting-started/                          # 「はじめに」のカテゴリ（11ページ）
│   ├── getting-started.md                       # 「はじめに」のindexページ
│   ├── gitlab-overview.md                       # 「GitLab概要」ページ
│   ├── basic-setup/                             # 「基本セットアップ」サブカテゴリ
│   │   ├── account-creation.md                   # 「アカウント作成」
│   │   ├── ssh-key-setup.md                     # 「SSH鍵設定」
│   │   └── first-project.md                     # 「初回プロジェクト作成」
│   ├── basic-operations/                        # 「基本操作」サブカテゴリ
│   │   ├── git-basics.md                        # 「Git基本操作」
│   │   ├── issue-management.md                  # 「Issue管理」
│   │   └── merge-requests.md                    # 「マージリクエスト」
│   └── github-comparison.md                     # 「GitHub比較」ページ
├── cicd-master/                              # 「CI/CDマスター」のカテゴリ（35ページ）
│   ├── cicd-master.md                           # 「CI/CDマスター」のindexページ
│   ├── cicd-basics/                             # 「CI/CD基礎」サブカテゴリ
│   │   ├── gitlab-ci-yml-intro.md               # 「.gitlab-ci.yml入門」
│   │   ├── jobs-and-stages.md                   # 「ジョブとステージ」
│   │   ├── variable-management.md               # 「変数管理」
│   │   └── artifacts.md                         # 「アーティファクト」
│   ├── gitlab-runner/                           # 「GitLab Runner」サブカテゴリ
│   │   ├── gitlab-runner.md                     # 「GitLab Runner」のindexページ
│   │   ├── runner-installation.md               # 「Runnerインストール」
│   │   ├── executor-setup/                      # 「Executor設定」サブカテゴリ
│   │   │   ├── docker-executor.md               # 「Docker Executor」
│   │   │   ├── kubernetes-executor.md           # 「Kubernetes Executor」
│   │   │   └── shell-executor.md                # 「Shell Executor」
│   │   ├── shared-vs-dedicated.md               # 「共有Runner vs 専用Runner」
│   │   └── runner-optimization.md               # 「Runner最適化」
│   ├── language-specific/                       # 「言語別CI/CD」サブカテゴリ
│   │   ├── nodejs-cicd.md                       # 「Node.js CI/CD」
│   │   ├── python-cicd.md                       # 「Python CI/CD」
│   │   ├── java-cicd.md                         # 「Java CI/CD」
│   │   ├── go-cicd.md                           # 「Go CI/CD」
│   │   └── docker-cicd.md                       # 「Docker CI/CD」
│   ├── advanced-pipelines/                     # 「高度なパイプライン」サブカテゴリ
│   │   ├── multi-stage-builds.md                # 「マルチステージビルド」
│   │   ├── parallel-execution.md                # 「並列実行」
│   │   ├── cache-strategy.md                    # 「キャッシュ戦略」
│   │   ├── conditional-execution.md             # 「条件付き実行」
│   │   └── pipeline-optimization.md             # 「パイプライン最適化」
│   └── deployment/                              # 「デプロイメント」サブカテゴリ
│       ├── environment-deployment.md            # 「環境別デプロイ」
│       ├── kubernetes-deployment.md             # 「Kubernetesデプロイ」
│       ├── cloud-deployment.md                  # 「クラウドデプロイ」
│       └── approval-workflow.md                 # 「承認ワークフロー」
├── devsecops/                               # 「DevSecOps実装」のカテゴリ（15ページ）
│   ├── devsecops.md                             # 「DevSecOps実装」のindexページ
│   ├── security-basics/                         # 「セキュリティ基礎」サブカテゴリ
│   │   ├── devsecops-overview.md                # 「DevSecOps概要」
│   │   ├── shift-left-security.md               # 「セキュリティシフトレフト」
│   │   └── gitlab-security-features.md          # 「GitLabセキュリティ機能」
│   ├── security-scanning/                       # 「セキュリティスキャン」サブカテゴリ
│   │   ├── sast-setup.md                        # 「SAST設定」
│   │   ├── dast-setup.md                        # 「DAST設定」
│   │   ├── container-scanning.md                # 「コンテナスキャン」
│   │   ├── dependency-scanning.md               # 「依存関係スキャン」
│   │   └── secret-detection.md                  # 「シークレット検知」
│   ├── vulnerability-management/               # 「脆弱性管理」サブカテゴリ
│   │   ├── vulnerability-reports.md             # 「脆弱性レポート」
│   │   ├── remediation-guide.md                 # 「修復ガイド」
│   │   └── policy-settings.md                   # 「ポリシー設定」
│   └── compliance/                              # 「コンプライアンス」サブカテゴリ
│       ├── audit-logs.md                        # 「監査ログ」
│       ├── branch-protection.md                 # 「ブランチ保護」
│       └── access-control.md                    # 「アクセス制御」
├── enterprise/                              # 「エンタープライズ運用」のカテゴリ（20ページ）
│   ├── enterprise.md                            # 「エンタープライズ運用」のindexページ
│   ├── self-hosted/                             # 「セルフホスト構築」サブカテゴリ
│   │   ├── installation-requirements.md         # 「インストール要件」
│   │   ├── installation-procedure.md            # 「インストール手順」
│   │   ├── high-availability.md                 # 「高可用性構成」
│   │   ├── backup-setup.md                      # 「バックアップ設定」
│   │   └── monitoring-setup.md                  # 「監視設定」
│   ├── kubernetes-integration/                  # 「Kubernetes統合」サブカテゴリ
│   │   ├── gitlab-agent-setup.md                # 「GitLab Agent設定」
│   │   ├── gitops-workflow.md                   # 「GitOpsワークフロー」
│   │   ├── multi-cluster-management.md          # 「マルチクラスター管理」
│   │   └── hybrid-environments.md               # 「ハイブリッド環境」
│   ├── organization-management/                 # 「組織管理」サブカテゴリ
│   │   ├── user-group-management.md             # 「ユーザー・グループ管理」
│   │   ├── permission-design.md                 # 「権限設計」
│   │   ├── ldap-integration.md                  # 「LDAP統合」
│   │   └── saml-integration.md                  # 「SAML統合」
│   └── system-integration/                      # 「システム統合」サブカテゴリ
│       ├── jira-integration.md                  # 「Jira連携」
│       ├── slack-integration.md                 # 「Slack統合」
│       ├── external-tools.md                    # 「外部ツール連携」
│       └── api-utilization.md                   # 「API活用」
├── migration/                               # 「移行ガイド」のカテゴリ（12ページ）
│   ├── migration.md                             # 「移行ガイド」のindexページ
│   ├── migration-planning/                      # 「移行計画」サブカテゴリ
│   │   ├── assessment.md                        # 「アセスメント」
│   │   ├── migration-strategy.md                # 「移行戦略」
│   │   └── team-preparation.md                  # 「チーム準備」
│   ├── github-migration/                        # 「GitHub移行」サブカテゴリ
│   │   ├── repository-migration.md              # 「リポジトリ移行」
│   │   ├── cicd-migration.md                    # 「CI/CD移行」
│   │   ├── issue-pr-migration.md                # 「Issue・PR移行」
│   │   └── settings-migration.md                # 「設定移行」
│   ├── jenkins-migration/                       # 「Jenkins移行」サブカテゴリ
│   │   ├── pipeline-conversion.md               # 「パイプライン変換」
│   │   ├── plugin-mapping.md                    # 「プラグイン対応」
│   │   └── agent-migration.md                   # 「エージェント移行」
│   └── data-migration/                          # 「データ移行」サブカテゴリ
│       ├── code-migration.md                    # 「コード移行」
│       ├── history-preservation.md              # 「履歴保持」
│       └── verification-procedure.md            # 「検証手順」
├── best-practices/                          # 「ベストプラクティス」のカテゴリ（16ページ）
│   ├── best-practices.md                        # 「ベストプラクティス」のindexページ
│   ├── cicd-optimization/                       # 「CI/CD最適化」サブカテゴリ
│   │   ├── pipeline-design-principles.md        # 「パイプライン設計原則」
│   │   ├── performance-improvement.md           # 「パフォーマンス改善」
│   │   ├── cost-reduction.md                    # 「コスト削減」
│   │   └── quality-improvement.md               # 「品質向上」
│   ├── security-enhancement/                    # 「セキュリティ強化」サブカテゴリ
│   │   ├── secure-coding.md                     # 「セキュアコーディング」
│   │   ├── secret-management.md                 # 「シークレット管理」
│   │   ├── access-control-bp.md                 # 「アクセス制御」
│   │   └── audit-compliance.md                  # 「監査対応」
│   ├── team-operations/                         # 「チーム運用」サブカテゴリ
│   │   ├── workflow-design.md                   # 「ワークフロー設計」
│   │   ├── review-process.md                    # 「レビュープロセス」
│   │   ├── branch-strategy.md                   # 「ブランチ戦略」
│   │   └── release-management.md                # 「リリース管理」
│   └── monitoring-metrics/                      # 「監視・メトリクス」サブカテゴリ
│       ├── performance-monitoring.md            # 「パフォーマンス監視」
│       ├── quality-metrics.md                   # 「品質メトリクス」
│       ├── deploy-metrics.md                    # 「デプロイメトリクス」
│       └── alert-setup.md                       # 「アラート設定」
├── troubleshooting/                         # 「トラブルシューティング」のカテゴリ（16ページ）
│   ├── troubleshooting.md                       # 「トラブルシューティング」のindexページ
│   ├── pipeline-issues/                         # 「パイプライン問題」サブカテゴリ
│   │   ├── failure-diagnosis.md                 # 「失敗診断」
│   │   ├── debugging-techniques.md              # 「デバッグ手法」
│   │   ├── log-analysis.md                      # 「ログ分析」
│   │   └── performance-issues.md                # 「パフォーマンス問題」
│   ├── runner-issues/                           # 「Runner問題」サブカテゴリ
│   │   ├── connection-problems.md               # 「接続問題」
│   │   ├── resource-shortage.md                 # 「リソース不足」
│   │   ├── permission-issues.md                 # 「権限問題」
│   │   └── configuration-errors.md              # 「設定エラー」
│   ├── security-issues/                         # 「セキュリティ問題」サブカテゴリ
│   │   ├── scan-failures.md                     # 「スキャン失敗」
│   │   ├── false-positive-handling.md           # 「誤検知対応」
│   │   └── access-problems.md                   # 「アクセス問題」
│   └── faq/                                     # 「よくある質問」サブカテゴリ
│       ├── beginner-faq.md                      # 「初心者FAQ」
│       ├── cicd-faq.md                          # 「CI/CD FAQ」
│       ├── operations-faq.md                    # 「運用FAQ」
│       └── migration-faq.md                     # 「移行FAQ」
└── community/                               # 「コミュニティ」のカテゴリ（16ページ）
    ├── community.md                             # 「コミュニティ」のindexページ
    ├── official-resources/                      # 「公式リソース」サブカテゴリ
    │   ├── official-docs.md                     # 「公式ドキュメント」
    │   ├── gitlab-university.md                 # 「GitLab University」
    │   ├── blogs-articles.md                    # 「ブログ・記事」
    │   └── event-info.md                        # 「イベント情報」
    ├── tools-templates/                         # 「ツール・テンプレート」サブカテゴリ
    │   ├── cicd-templates.md                    # 「CI/CDテンプレート」
    │   ├── config-files.md                      # 「設定ファイル集」
    │   ├── automation-scripts.md                # 「自動化スクリプト」
    │   └── sample-projects.md                   # 「サンプルプロジェクト」
    ├── learning-resources/                      # 「学習リソース」サブカテゴリ
    │   ├── certifications.md                    # 「認定資格」
    │   ├── training-platform.md                 # 「研修プラットフォーム」
    │   ├── video-tutorials.md                   # 「ビデオチュートリアル」
    │   └── workshops.md                         # 「ワークショップ」
    └── contribution/                            # 「コントリビューション」サブカテゴリ
        ├── site-improvement.md                  # 「サイト改善」
        ├── content-proposal.md                  # 「コンテンツ提案」
        ├── feedback.md                          # 「フィードバック」
        └── community-participation.md           # 「コミュニティ参加」
```

## ファイル数

合計約120ファイル
- トップページ・サイドバー: 2ファイル
- はじめに: 11ファイル
- CI/CDマスター: 35ファイル
- DevSecOps実装: 15ファイル
- エンタープライズ運用: 20ファイル
- 移行ガイド: 12ファイル
- ベストプラクティス: 16ファイル
- トラブルシューティング: 16ファイル
- コミュニティ: 16ファイル