---
title: "コンテナセキュリティ：イメージスキャンからランタイム保護までの多層防御"
slug: "container-security-image-scan-runtime-protection-defense"
date: "2025-04-01"
categories: ["セキュリティ"]
tags: ["コンテナセキュリティ", "Docker", "Kubernetes", "イメージスキャン", "ランタイム保護", "DevSecOps", "SBOM", "脆弱性管理", "ゼロトラスト", "クラウドネイティブ"]
status: "publish"
description: "コンテナセキュリティの多層防御を解説。イメージスキャンからランタイム保護まで、ビルド段階から運用段階までの包括的なセキュリティ戦略、DevSecOpsへの統合方法を紹介。"
---

コンテナ技術はアプリケーション開発・運用の標準となり、企業のDX推進において中核的な役割を果たしています。RedHatの調査によれば、企業の90%以上がコンテナ技術を本番環境で利用しており、その市場規模は2027年までに83億ドルに達すると予測されています。

しかし、コンテナの急速な普及に伴い、セキュリティリスクも増大しています。伝統的なセキュリティアプローチでは、短命で動的なコンテナ環境を適切に保護できません。NSAとCISAが2022年に発表した共同レポートでは、コンテナを標的とした攻撃が前年比で71%増加したことが報告されています。

本記事では、コンテナライフサイクル全体をカバーする多層防御アプローチについて解説し、ビルド段階からランタイム保護まで、包括的なコンテナセキュリティ戦略の構築方法を紹介します。

## コンテナセキュリティの基本概念

### コンテナとは何か

コンテナは、アプリケーションとその依存関係を含む軽量で独立した実行環境です。仮想マシン（VM）と違い、ホストOSのカーネルを共有するため、高効率かつ高速な展開が可能です。主なコンテナ技術には、Docker、containerd、CRI-Oなどがあります。

### コンテナセキュリティの特徴と課題

コンテナセキュリティは従来のセキュリティと異なる特徴を持ち、固有の課題があります：

**特徴**:
- イミュータブルインフラストラクチャ（不変基盤）
- 短いライフサイクル
- 宣言的な構成
- 高度な自動化

**課題**:
- 広い攻撃対象領域
- 共有カーネルによるセキュリティ境界の薄さ
- 動的環境での可視性確保
- 従来のセキュリティツールとの互換性

### コンテナセキュリティの多層防御モデル

効果的なコンテナセキュリティは、以下の4つの層で構成される多層防御アプローチで実現します：

1. **ビルド時セキュリティ**：脆弱性スキャン、コンプライアンスチェック、SBOM生成
2. **デプロイ時セキュリティ**：アドミッションコントロール、ポリシー強制、署名検証
3. **ランタイムセキュリティ**：コンテナ分離、異常検知、ネットワークセグメンテーション
4. **インフラストラクチャセキュリティ**：ホストOS保護、クラスタセキュリティ、認証・認可

## ビルド時セキュリティ：安全なコンテナイメージの作成

### セキュアなベースイメージの選択

コンテナセキュリティはベースイメージの選択から始まります。以下の原則を守りましょう：

1. **最小限のベースイメージを使用**
   ディストロレスイメージ（Alpine、Slim、Distroless）を優先し、攻撃対象領域を縮小します。

2. **信頼できるソースからのイメージ取得**
   公式リポジトリや検証済みのイメージを使用し、サプライチェーン攻撃を防ぎます。

3. **マルチステージビルドの活用**
   ビルドツールとランタイム環境を分離し、最終イメージを軽量化します。

**Dockerfileの実装例（マルチステージビルド）**:

```dockerfile
# ビルドステージ
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 実行ステージ
FROM node:18-alpine
# 非root特権ユーザーを作成
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup
# セキュリティ強化
RUN apk add --no-cache dumb-init
WORKDIR /app
# 必要なファイルのみコピー
COPY --from=build --chown=appuser:appgroup /app/dist /app/dist
COPY --from=build --chown=appuser:appgroup /app/node_modules /app/node_modules
COPY --from=build --chown=appuser:appgroup /app/package.json /app

# 非root特権ユーザーに切り替え
USER appuser
# dumb-initをentrypointとして使用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### コンテナイメージスキャンの実装

イメージ内の脆弱性を早期に発見するため、以下のスキャン方法を導入します：

1. **静的イメージスキャン**
   ビルドパイプラインに組み込み、脆弱なイメージのデプロイを防止します。

2. **動的スキャン**
   定期的なスキャンで新たに発見された脆弱性を検出します。

3. **SBOMの生成と活用**
   Software Bill of Materials（部品表）を作成し、依存関係を可視化します。

**GitHub Actionsによるイメージスキャン例**:

```yaml
name: Container Image Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  scan:
    name: Scan Docker image
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
          ignore-unfixed: true

      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
          
      - name: Generate SBOM
        uses: anchore/sbom-action@v0
        with:
          image: myapp:${{ github.sha }}
          format: spdx-json
          output-file: ./sbom.json

      - name: Archive SBOM
        uses: actions/upload-artifact@v3
        with:
          name: sbom
          path: ./sbom.json
```

### コンテナイメージの署名と検証

コンテナイメージの整合性と出所を確保するために、イメージ署名を実装します：

1. **Cosign/Sigstore**による署名
2. **署名検証ポリシー**の設定
3. **サプライチェーン証明書**の管理

**Cosignによるイメージ署名例**:

```bash
# キーペアの生成
cosign generate-key-pair

# イメージの署名
cosign sign --key cosign.key myregistry.com/myapp:latest

# 署名の検証
cosign verify --key cosign.pub myregistry.com/myapp:latest
```

## デプロイ時セキュリティ：ポリシーによる制御

### Kubernetes アドミッションコントロールの活用

コンテナのデプロイ前に、セキュリティポリシーに照らして評価を行います：

1. **OPA Gatekeeper/Kyverno**
   ポリシーエンジンによるアドミッションコントロール

2. **ポリシーの例**
   - 特権コンテナの禁止
   - リソース制限の強制
   - イメージレジストリの制限
   - 署名検証の要求

**Kyvernoポリシーの例（特権コンテナの禁止）**:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: restrict-privileged-containers
spec:
  validationFailureAction: enforce
  rules:
  - name: privileged-containers
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "特権コンテナは許可されていません"
      pattern:
        spec:
          containers:
          - name: "*"
            securityContext:
              privileged: false
```

### セキュアなコンテナレジストリの構築

コンテナイメージの安全な保管と配布のための対策：

1. **レジストリのアクセス制御**
   - RBAC（ロールベースアクセス制御）
   - イメージプルシークレット

2. **イメージ保持ポリシー**
   - 未使用イメージの自動クリーンアップ
   - イメージタグの不変性

3. **スキャンとプロモーション**
   - 環境間の安全なイメージプロモーション
   - スキャン結果に基づく昇格・降格

**Harbor レジストリでのスキャン自動化の設定例**:

```yaml
# Harbor V2.x プロジェクト自動スキャン設定
project:
  name: secured-apps
  metadata:
    auto_scan: "true"
    reuse_sys_cve_allowlist: "true"
    severity: "high"
  cve_allowlist:
    items:
    - cve_id: "CVE-2021-12345"
      description: "低リスクと評価された脆弱性"
```

## ランタイムセキュリティ：実行環境の保護

### コンテナランタイムセキュリティの基本

実行中コンテナを保護するための主な戦略：

1. **コンテナの分離強化**
   - gVisor, Kata Containersなどのセキュアランタイム
   - LinuxセキュリティモジュールとAppArmor/SELinuxの強化

2. **リソース制限の設定**
   - CPUとメモリの制限
   - ファイルシステムのマウントオプション制限

3. **最小権限の原則適用**
   - 非特権ユーザー実行
   - capabilities制限

**Kubernetes securityContextの設定例**:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:
    fsGroup: 2000
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: myapp:1.0.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
      runAsNonRoot: true
      runAsUser: 1000
      privileged: false
```

### 異常検知と脅威監視

コンテナ環境における異常行動を検知するためのアプローチ：

1. **システムコール監視**
   - Falco, Sysdigによるリアルタイム検知
   - 異常な挙動の可視化

2. **ネットワーク異常検知**
   - 予期しない通信パターンの検出
   - 水平移動の防止

3. **ファイルシステム整合性監視**
   - ランタイムでのファイル変更の検知
   - 不正実行ファイルの検出

**Falcoルールの例**:

```yaml
- rule: Terminal Shell in Container
  desc: >
    コンテナ内でのターミナルシェルの使用を検知します。
    コンテナは通常、アプリケーションのみを実行し、対話的シェルは使用しません。
  condition: >
    container.id != host and
    proc.name = bash and
    container
  output: >
    コンテナ内でシェルが実行されました (user=%user.name %container.info shell=%proc.name parent=%proc.pname cmdline=%proc.cmdline)
  priority: WARNING
  tags: [container, shell, mitre_execution]
```

### ネットワークセキュリティとセグメンテーション

コンテナ間通信のセキュリティ確保：

1. **ネットワークポリシー**
   - 明示的な通信ルールの定義
   - ゼロトラストモデルの実装

2. **サービスメッシュ**
   - mTLS（相互TLS）による暗号化
   - トラフィック可視化と制御

3. **マイクロセグメンテーション**
   - サービスレベルでの通信制限
   - 環境間の境界強化

**Kubernetes NetworkPolicyの例**:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

## Kubernetesクラスタセキュリティ

### クラスタ構成の強化

Kubernetesクラスタ自体のセキュリティを確保：

1. **APIサーバーセキュリティ**
   - 認証と認可の厳格な設定
   - 監査ロギングの有効化

2. **etcdデータの保護**
   - 暗号化と適切なバックアップ
   - アクセス制限の設定

3. **コントロールプレーンセキュリティ**
   - コンポーネント間通信の暗号化
   - ノードセキュリティの強化

**Kubernetesクラスタ暗号化設定の例**:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
metadata:
  name: encryption-config
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              secret: <BASE64_ENCODED_KEY>
      - identity: {}
```

### Pod Security Standards（PSS）の適用

Kubernetes 1.25以降のPodセキュリティ標準を活用：

1. **Privileged** - セキュリティ制約なし（開発環境向け）
2. **Baseline** - 極端な特権を禁止（最小限の制約）
3. **Restricted** - 強力なセキュリティ強制（本番環境推奨）

**Pod Security Admissionの設定例**:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "restricted"
      enforce-version: "latest"
      audit: "restricted"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      usernames: ["system:serviceaccount:kube-system:*"]
      namespaces: ["kube-system"]
```

### パイプラインでのセキュリティチェック自動化

CI/CDパイプラインにセキュリティを組み込みます：

1. **Infrastructure as Codeのスキャン**
   - Terraformファイル解析
   - Kubernetesマニフェスト検証

2. **コンプライアンスチェック**
   - CIS ベンチマーク適合性
   - PCI DSS/HIPAA要件の検証

3. **セキュリティスコアカード**
   - セキュリティポスチャーの継続的評価
   - 時系列での改善度の測定

**TerraformスキャンのGitHub Actions例**:

```yaml
name: Terraform Security Scan

on:
  push:
    paths:
      - '**.tf'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          soft_fail: false
          
      - name: checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: ./terraform
          framework: terraform
          soft_fail: false
```

## コンテナセキュリティの運用とベストプラクティス

### 継続的なモニタリングとアラート

効果的なコンテナ環境監視の実装：

1. **集中ログ管理**
   - 全コンテナログの集約
   - 相関分析とアラート設定

2. **メトリクス監視**
   - 異常なリソース使用の検知
   - パフォーマンス問題の早期発見

3. **セキュリティイベント管理**
   - SIEM連携
   - インシデント対応自動化

**Prometheus AlertManagerの設定例**:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: container-alerts
  namespace: monitoring
spec:
  groups:
  - name: container.rules
    rules:
    - alert: ContainerHighCPUUsage
      expr: sum(rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[5m])) by (namespace, pod, container) > 0.8
      for: 10m
      labels:
        severity: warning
      annotations:
        summary: "Container high CPU usage (namespace: {{ $labels.namespace }}, pod: {{ $labels.pod }})"
        description: "Container {{ $labels.container }} has high CPU usage for more than 10 minutes."
        
    - alert: ContainerExcessiveRestarts
      expr: increase(kube_pod_container_status_restarts_total[1h]) > 5
      for: 10m
      labels:
        severity: warning
      annotations:
        summary: "Container excessive restarts (namespace: {{ $labels.namespace }}, pod: {{ $labels.pod }})"
        description: "Container {{ $labels.container }} has restarted more than 5 times in the last hour."
```

### インシデント対応計画

コンテナ環境でのセキュリティインシデント対応：

1. **コンテナフォレンジック**
   - 疑わしいコンテナの隔離
   - 証拠収集と保全

2. **脅威ハンティング**
   - プロアクティブな脅威探索
   - 攻撃チェーンの分析

3. **プレイブックの整備**
   - 一般的な攻撃パターンへの対応手順
   - 自動修復プロセスの確立

**コンテナフォレンジック手順例**:

```bash
# 疑わしいコンテナの特定
CONTAINER_ID=$(docker ps | grep suspicious-service | awk '{print $1}')

# コンテナのネットワーク隔離
docker network disconnect bridge $CONTAINER_ID

# コンテナのフォレンジックスナップショット作成
docker commit $CONTAINER_ID forensic-image-$CONTAINER_ID
docker save -o forensic-image-$CONTAINER_ID.tar forensic-image-$CONTAINER_ID

# プロセスとファイルシステムの検査
mkdir -p evidence/$CONTAINER_ID
docker exec $CONTAINER_ID ps aux > evidence/$CONTAINER_ID/processes.txt
docker cp $CONTAINER_ID:/var/log/ evidence/$CONTAINER_ID/logs/
docker cp $CONTAINER_ID:/etc/ evidence/$CONTAINER_ID/etc/

# コンテナ実行履歴の取得
docker inspect $CONTAINER_ID > evidence/$CONTAINER_ID/inspect.json
docker logs $CONTAINER_ID > evidence/$CONTAINER_ID/container-logs.txt
```

### コンテナセキュリティの成熟度モデル

組織のコンテナセキュリティ成熟度を段階的に高めるアプローチ：

1. **レベル1: 基本**
   - 脆弱性スキャンの導入
   - 特権コンテナの禁止
   - 基本的なログ収集

2. **レベル2: 標準化**
   - ポリシー駆動型デプロイ
   - CI/CDへのセキュリティ統合
   - 包括的なランタイム監視

3. **レベル3: 最適化**
   - 自動修復メカニズム
   - ゼロトラストアーキテクチャ
   - 脅威インテリジェンス連携

**成熟度評価のチェックリスト例**:

```markdown
## コンテナセキュリティ成熟度チェックリスト

### ビルド時セキュリティ
- [ ] ベースイメージをスリム化し、不要なパッケージを削除
- [ ] すべてのイメージに対して自動的な脆弱性スキャンを実施
- [ ] イメージに対するSBOM（ソフトウェア部品表）を生成
- [ ] CI/CDパイプラインでのセキュリティゲートを設定

### デプロイ時セキュリティ
- [ ] イメージ署名と検証の仕組みを実装
- [ ] Kubernetes PSAを使用してPodセキュリティを強制
- [ ] アドミッションコントローラーによるポリシー検証
- [ ] シークレット管理のベストプラクティスを実施

### ランタイムセキュリティ
- [ ] コンテナの挙動を監視し、異常を検知
- [ ] NetworkPolicyによる最小限の通信のみを許可
- [ ] seccompとAppArmorプロファイルの適用
- [ ] 特権昇格やコンテナエスケープの防止策
```

## コンテナセキュリティツールの比較

### 代表的なツールとサービス

主要なコンテナセキュリティソリューションの比較：

| カテゴリ | ツール名 | 主な機能 | 利点 | 制約 |
|---------|---------|----------|------|------|
| **イメージスキャン** | Trivy | OSSの脆弱性スキャナー | 簡単な導入、高速スキャン | オフラインでの使用制限 |
|  | Clair | 静的解析とDB比較 | Quayとの統合、軽量 | False positiveが多い |
|  | Snyk | 依存関係分析とモニタリング | 詳細な修正情報、開発者向けUI | 無料版は機能制限あり |
| **ランタイム防御** | Falco | システムコール監視 | 豊富な検知ルール、カスタマイズ性 | チューニングが必要 |
|  | Aqua Security | コンテナファイアウォール | 包括的保護、エンタープライズ機能 | 高コスト |
|  | Sysdig Secure | 振る舞い分析と異常検知 | 詳細なフォレンジック機能 | リソース消費が大きい |
| **ポリシー強制** | OPA Gatekeeper | Kubernetesアドミッション制御 | 柔軟なポリシー言語、拡張性 | 学習曲線が急 |
|  | Kyverno | 宣言的ポリシー管理 | YAML形式で簡単記述、変異サポート | 複雑なロジックは制限あり |
|  | Istio | サービスメッシュセキュリティ | 通信の暗号化、アクセス制御 | オーバーヘッドとリソース消費 |

### ツール選定のガイドライン

組織に最適なコンテナセキュリティツールの選び方：

1. **環境適合性**
   - オンプレミス/クラウド/ハイブリッド
   - 使用中のオーケストレーションプラットフォーム

2. **統合性**
   - 既存のCI/CDツールとの連携
   - SIEMやその他セキュリティシステムとの統合

3. **スケーラビリティ**
   - 大量のコンテナ処理能力
   - 高速スキャンとパフォーマンス影響

4. **総所有コスト**
   - 初期導入コストと運用コスト
   - 必要な専門知識と学習曲線

## まとめ：コンテナセキュリティの未来

### DX時代のコンテナセキュリティ戦略

デジタルトランスフォーメーションにおけるコンテナセキュリティの位置づけ：

1. **シフトレフト**
   開発初期からセキュリティを組み込み、問題の早期発見と修正を促進します。

2. **自動化と統合**
   セキュリティプロセスを自動化し、開発フローに完全に組み込むことで摩擦を減らします。

3. **防御の深さ**
   単一の防御層に依存せず、複数の保護層でコンテナ環境を守ります。

4. **セキュリティカルチャーの育成**
   開発者からオペレーターまで、全員がセキュリティの責任を共有する文化を醸成します。

### コンテナセキュリティの発展動向

今後のコンテナセキュリティの方向性：

1. **AIを活用した脅威検知**
   機械学習モデルによる異常検知の精度向上と誤検知の削減。

2. **セキュリティメッシュアーキテクチャ**
   サービスメッシュ進化形としての分散型セキュリティ制御。

3. **PolyglotランタイムとWASM**
   WebAssemblyを活用した軽量で安全な実行環境の普及。

4. **サプライチェーンセキュリティの強化**
   SBOMとソフトウェア検証フレームワークの標準化と普及。

コンテナ技術の急速な普及により、セキュリティは後付けではなく、設計段階から考慮すべき重要な要素となっています。本記事で紹介した多層防御アプローチを実践することで、コンテナ環境の脆弱性を最小化し、セキュアなDX基盤の構築が可能になります。

コンテナセキュリティを確保するには技術的対策だけでなく、人材育成とプロセス改善も重要です。DevSecOpsの文化を育み、セキュリティと開発の壁を取り払うことが、真に安全なコンテナ環境実現の鍵となるでしょう。
