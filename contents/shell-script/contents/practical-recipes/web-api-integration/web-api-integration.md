---
title: Web API統合の実践レシピ | シェルスクリプト開発ガイド
slug: web-api-integration
status: publish
post_type: page
seo_keywords: "シェルスクリプト, Web API, curl, jq, JSON処理, API連携"
seo_description: "シェルスクリプトによるWeb API統合の実践的なレシピ集。curlとjqを使ったAPI連携からJSONデータ処理まで、外部システムとの連携スキルを習得できます。"
tags: ["シェルスクリプト", "Web API", "curl", "jq", "JSON処理", "API連携"]
image: "/images/shell-script/web-api-integration.png"
parent: "practical-recipes"
---

## 🌐 Web API統合の実践レシピ

現代のシステム開発では、外部サービスとの連携が不可欠です。シェルスクリプトを使えば、REST APIやWebサービスとの連携を効率的に実現できます。このセクションでは、curlとjqを使った実践的なAPI統合レシピを紹介します。

### このカテゴリで学べる事

:::note このカテゴリで学べる事

- curlを使ったHTTPリクエストの送信
- JSONデータの解析と処理
- API認証とセキュリティ
- エラーハンドリングとリトライ処理
- 実際のWebサービスとの連携例

:::

## 🎯 なぜWeb API統合スキルが重要か？

:::note Web API統合の重要性

現代のシステム運用では、以下のようなAPI連携が頻繁に必要です：

- **クラウドサービスとの連携**: AWS、Azure、GCPなどの管理API
- **監視システムとの統合**: Slack通知、メール送信、アラート管理
- **データ同期**: 異なるシステム間でのデータ同期
- **自動化タスク**: 外部サービスの操作や情報取得

シェルスクリプトによるAPI統合により、**軽量**かつ**効率的**な自動化ソリューションを構築できます。

:::

## 📖 実践レシピ一覧

### 📡 curlを使ったHTTPリクエスト

[curl HTTPリクエストの詳細ガイド](./curl-get-data.md)

curlは、シェルスクリプトからHTTPリクエストを送信するための強力なツールです。GET、POST、PUT、DELETEなどのHTTPメソッドを使いこなし、様々なAPIと連携する方法を学びます。

**主な内容:**
- 基本的なHTTPリクエストの送信
- ヘッダーとパラメータの設定
- 認証情報の扱い方
- ファイルのアップロードとダウンロード
- SSL/TLS通信の設定

```bash
# 基本的なGETリクエスト
curl https://api.example.com/users

# ヘッダーを指定したリクエスト
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/data

# POSTリクエストでデータを送信
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"name": "John", "email": "john@example.com"}' \
     https://api.example.com/users
```

### 🔧 jqによるJSONデータ処理

[jq JSON処理の詳細ガイド](./jq-parse-json.md)

jqは、JSONデータを処理するためのコマンドラインツールです。APIから取得したJSONデータの解析、フィルタリング、変換など、実務で役立つ処理を学びます。

**主な内容:**
- JSONデータの基本的な操作
- フィルタリングとクエリ
- データの変換と整形
- 複雑なJSON構造の処理
- 他のツールとの連携

```bash
# JSONデータの整形
curl -s https://api.example.com/users | jq '.'

# 特定のフィールドを抽出
curl -s https://api.example.com/users | jq '.[].name'

# 条件に基づくフィルタリング
curl -s https://api.example.com/users | jq '.[] | select(.age > 30)'

# データの集計
curl -s https://api.example.com/orders | jq 'group_by(.category) | map({category: .[0].category, count: length})'
```

## 🛠️ 実践的な活用シーン

### クラウドサービスとの連携

**AWS EC2インスタンスの情報取得**
```bash
#!/bin/bash
# AWS EC2インスタンス情報取得スクリプト

AWS_REGION="ap-northeast-1"
INSTANCE_ID="i-1234567890abcdef0"

# AWS CLIを使ったインスタンス情報取得
get_instance_info() {
    aws ec2 describe-instances \
        --region $AWS_REGION \
        --instance-ids $INSTANCE_ID \
        --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' \
        --output json | jq '.[][]'
}

# インスタンス情報を表示
echo "インスタンス情報:"
get_instance_info
```

**Slackへの通知送信**
```bash
#!/bin/bash
# Slack通知スクリプト

WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
MESSAGE="$1"

send_slack_notification() {
    payload=$(cat <<EOF
{
    "text": "$MESSAGE",
    "channel": "#alerts",
    "username": "monitoring-bot",
    "icon_emoji": ":warning:"
}
EOF
)

    curl -X POST \
         -H "Content-Type: application/json" \
         -d "$payload" \
         "$WEBHOOK_URL"
}

# 使用例
send_slack_notification "システムアラート: CPU使用率が90%を超えました"
```

### 監視システムとの統合

**Webサイトの死活監視**
```bash
#!/bin/bash
# Webサイト監視スクリプト

URLS=("https://example.com" "https://api.example.com" "https://admin.example.com")
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

check_website() {
    local url=$1
    local response_code=$(curl -o /dev/null -s -w "%{http_code}" "$url")

    if [ "$response_code" -ne 200 ]; then
        send_alert "$url が応答していません (HTTP $response_code)"
        return 1
    fi
    return 0
}

send_alert() {
    local message="$1"
    local payload="{\"text\": \"$message\", \"channel\": \"#alerts\"}"

    curl -X POST \
         -H "Content-Type: application/json" \
         -d "$payload" \
         "$SLACK_WEBHOOK"
}

# 全サイトを監視
for url in "${URLS[@]}"; do
    check_website "$url"
done
```

### データ同期と自動化

**GitHubリポジトリの統計情報取得**
```bash
#!/bin/bash
# GitHubリポジトリ統計取得スクリプト

GITHUB_TOKEN="your_github_token"
REPO_OWNER="example"
REPO_NAME="myproject"

get_repo_stats() {
    # リポジトリ情報取得
    repo_info=$(curl -s \
        -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME")

    # 統計情報を抽出
    stars=$(echo "$repo_info" | jq '.stargazers_count')
    forks=$(echo "$repo_info" | jq '.forks_count')
    open_issues=$(echo "$repo_info" | jq '.open_issues_count')

    echo "リポジトリ統計:"
    echo "⭐ Stars: $stars"
    echo "🍴 Forks: $forks"
    echo "🐛 Open Issues: $open_issues"
}

# コミット情報取得
get_commit_stats() {
    commits=$(curl -s \
        -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/commits?per_page=100" | \
        jq '.[].commit.author | {date: .date, author: .name}')

    echo "最近のコミット:"
    echo "$commits" | head -10
}

get_repo_stats
get_commit_stats
```

## 💡 ベストプラクティス

### セキュリティの確保

1. **認証情報の管理**
   - APIキーやトークンをスクリプトに直接記述しない
   - 環境変数や設定ファイルを使用
   - 機密情報は暗号化して保存

2. **安全な通信**
   - 常にHTTPSを使用
   - SSL証明書の検証を有効化
   - 認証局の信頼性を確認

3. **アクセス制御**
   - 必要最小限の権限でAPIを使用
   - トークンの有効期限を管理
   - アクセスログを記録

### エラーハンドリング

1. **HTTPステータスコードの確認**
   - 200番台以外のレスポンスを適切に処理
   - リトライメカニズムの実装
   - タイムアウトの設定

2. **データの検証**
   - 受信したJSONの構造を確認
   - 必要なフィールドが存在するか検証
   - データ型のチェック

3. **ログ記録**
   - リクエストとレスポンスを記録
   - エラー発生時の詳細情報を保存
   - 監査用のログを残す

### パフォーマンスの最適化

1. **リクエストの最適化**
   - 必要なデータだけを要求
   - キャッシュを活用
   - 並列リクエストで効率化

2. **データ処理の効率化**
   - jqのクエリを最適化
   - 中間ファイルを避ける
   - パイプラインで処理を連結

## 🔗 関連リンク

- [curl公式ドキュメント](https://curl.se/docs/)
- [jq公式ドキュメント](https://stedolan.github.io/jq/)
- [REST APIの基礎](https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP)
- [JSONフォーマットの詳細](https://www.json.org/json-ja.html)

## まとめ

Web API統合スキルは、現代のシステム運用者にとって不可欠な能力です。シェルスクリプトと適切なツールを使いこなすことで、外部サービスとの連携を効率的に実現できます。

:::note 要点のまとめ

- curlはHTTPリクエスト送信の基本ツール
- jqはJSONデータ処理に最適
- セキュリティとエラーハンドリングが重要
- 実際のサービス連携で即戦力となる
- ツールの組み合わせで高度な処理を実現

:::

このカテゴリで学んだスキルを使えば、様々なWebサービスとの連携を実現できます。次は、より複雑な[システム管理のベストプラクティス](../best-practices/)に進み、より高度な自動化スキルを習得しましょう。

### [Web API連携を動かして確認してみよう]

実際にSlackへの通知スクリプトを作成し、API連携の基本を学びましょう。このハンズオンでは、curlとjqを使ったAPI通信、エラーハンドリング、実際のサービス連携を体験できます。

:::step

1. Slack Webhook URLの取得

Slackで通知先チャンネルのIncoming Webhook URLを取得してください：
- Slackワークスペースにアクセス
- チャンネルを右クリック → 「Incoming Webhookを追加」
- Webhook URLをコピー

2. 通知スクリプトの作成

以下の内容で `slack_notifier.sh` を作成してください：

```bash
#!/bin/bash

# Slack通知スクリプト
WEBHOOK_URL="YOUR_WEBHOOK_URL_HERE"
CHANNEL="#general"
USERNAME="shell-script-bot"
ICON_EMOJI=":robot_face:"

# ヘルプメッセージ
show_help() {
    echo "使用方法: $0 'メッセージ' [チャンネル]"
    echo "例: $0 'テストメッセージです' #alerts"
}

# メッセージ送信関数
send_message() {
    local message="$1"
    local target_channel="${2:-$CHANNEL}"

    # メッセージが空かチェック
    if [ -z "$message" ]; then
        echo "エラー: メッセージが指定されていません"
        show_help
        exit 1
    fi

    # JSONペイロードを作成
    local payload=$(cat <<EOF
{
    "channel": "$target_channel",
    "username": "$USERNAME",
    "icon_emoji": "$ICON_EMOJI",
    "text": "$message"
}
EOF
)

    # Slackに送信
    echo "メッセージを送信しています..."
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$WEBHOOK_URL")

    # レスポンスを確認
    if echo "$response" | jq -e '.ok' > /dev/null 2>&1; then
        echo "✅ メッセージが正常に送信されました"
        echo "チャンネル: $target_channel"
        echo "メッセージ: $message"
    else
        echo "❌ メッセージの送信に失敗しました"
        echo "レスポンス: $response"
        exit 1
    fi
}

# コマンドライン引数の処理
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# メッセージ送信
send_message "$1" "$2"
```

3. スクリプトの実行権限を付与

```bash
chmod +x slack_notifier.sh
```

4. テストメッセージの送信

```bash
# 基本的なメッセージ送信
./slack_notifier.sh "シェルスクリプトからのテストメッセージです"

# 特定チャンネルへの送信
./slack_notifier.sh "アラート: CPU使用率が高いです" #alerts
```

5. システム監視との連携

```bash
#!/bin/bash
# システム監視とSlack通知の連携

SLACK_SCRIPT="./slack_notifier.sh"
CPU_THRESHOLD=80

check_system() {
    # CPU使用率を取得
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

    echo "CPU使用率: ${CPU_USAGE}%"

    # 閾値を超えたら通知
    if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
        $SLACK_SCRIPT "⚠️ CPU使用率が ${CPU_USAGE}% です (閾値: ${CPU_THRESHOLD}%)" #alerts
    fi
}

# 監視実行
check_system
```

6. 高度な機能の追加

```bash
#!/bin/bash
# 拡張版Slack通知スクリプト

# 色付きメッセージ送信
send_colored_message() {
    local message="$1"
    local color="$2"
    local target_channel="${3:-$CHANNEL}"

    local payload=$(cat <<EOF
{
    "channel": "$target_channel",
    "username": "$USERNAME",
    "icon_emoji": "$ICON_EMOJI",
    "attachments": [
        {
            "color": "$color",
            "text": "$message"
        }
    ]
}
EOF
)

    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$WEBHOOK_URL" > /dev/null
}

# 使用例
send_colored_message "成功: バックアップが完了しました" "good"
send_colored_message "警告: ディスク容量が不足しています" "warning"
send_colored_message "エラー: サービスが停止しています" "danger"
```

:::

このハンズオンで作成したSlack通知スクリプトは、実際のシステム運用で活用できます。他のWebサービスとも同様の方法で連携できるので、様々な自動化シーンに応用してください。