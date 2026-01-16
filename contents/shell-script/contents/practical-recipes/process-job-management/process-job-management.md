---
title: プロセス・ジョブ管理の実践レシピ | シェルスクリプト開発ガイド
slug: process-job-management
status: publish
post_type: page
seo_keywords: "シェルスクリプト, プロセス管理, ジョブ管理, バックグラウンド処理, 監視"
seo_description: "シェルスクリプトによるプロセス・ジョブ管理の実践的なレシピ集。バックグラウンドジョブの実行からプロセス監視まで、長時間処理を効率的に管理する方法を紹介します。"
tags: ["シェルスクリプト", "プロセス管理", "ジョブ管理", "バックグラウンド処理", "監視"]
image: "/images/shell-script/process-management.png"
parent: "practical-recipes"
---

## ⚙️ プロセス・ジョブ管理の実践レシピ

長時間実行する処理や複数のタスクを並行して実行する場合、プロセスとジョブの管理スキルが不可欠です。シェルスクリプトを使えば、バックグラウンド処理、ジョブスケジューリング、プロセス監視などを効率的に実現できます。このセクションでは、実務で役立つプロセス管理のレシピを紹介します。

### このカテゴリで学べる事

:::note このカテゴリで学べる事

- バックグラウンドジョブの実行と管理
- プロセスの状態監視と制御
- ジョブのスケジューリングと実行管理
- リソース使用量の監視と制限
- 複数プロセスの連携と管理

:::

## 🎯 なぜプロセス管理スキルが重要か？

:::note プロセス管理の重要性

システム運用では、以下のようなプロセス管理が頻繁に必要です：

- **長時間処理の実行**: データベースのバックアップや大量データの処理
- **定期処理の管理**: ログのローテーションやレポート生成
- **リソースの監視**: メモリやCPU使用量の監視と制御
- **異常処理の検出**: プロセスの停止やハングアップの検知

これらのタスクを適切に管理しないと、システムのパフォーマンス低下や予期せぬ障害につながります。シェルスクリプトによるプロセス管理で、**安定性**と**信頼性**を確保できます。

:::

## 📖 実践レシピ一覧

### 🔄 バックグラウンドジョブの実行と管理

[バックグラウンドジョブの詳細ガイド](./background-jobs.md)

長時間実行する処理をバックグラウンドで実行する方法を学びます。ジョブの状態管理、出力の処理、終了の待機など、実務で役立つバックグラウンド処理のテクニックを紹介します。

**主な内容:**
- `&` を使ったバックグラウンド実行
- `nohup` でログアウト後も継続するジョブ
- `screen` や `tmux` を使ったセッション管理
- ジョブの状態確認と制御
- 複数のバックグラウンドジョブの管理

```bash
# 基本的なバックグラウンド実行
long_running_script.sh &

# nohupでログアウト後も継続
nohup backup_script.sh > backup.log 2>&1 &

# バックグラウンドジョブの確認
jobs
ps aux | grep backup_script
```

### 📊 プロセスの監視と制御

[プロセス監視の詳細ガイド](./process-monitoring.md)

システム上のプロセスを監視し、異常な状態を検出・制御する方法を学びます。リソース使用量の監視、プロセスの停止・再起動、自動復旧など、システム運用に必須のスキルを紹介します。

**主な内容:**
- `ps`、`top`、`htop` を使ったプロセス監視
- リソース使用量の監視と制限
- プロセスの優先度制御（`nice`、`renice`）
- 異常プロセスの検出と停止
- 自動監視スクリプトの作成

```bash
# 特定プロセスの監視
ps aux | grep "nginx"

# CPU使用率が高いプロセスの検出
ps aux --sort=-%cpu | head -10

# メモリ使用量の監視
ps aux --sort=-%mem | head -10
```

## 🛠️ 実践的な活用シーン

### システム運用の自動化

**サービスの死活監視と自動再起動**
```bash
#!/bin/bash
# サービス監視スクリプト

SERVICE_NAME="nginx"
CHECK_INTERVAL=30

while true; do
    if ! pgrep -x "$SERVICE_NAME" > /dev/null; then
        echo "$(date): $SERVICE_NAME が停止しています。再起動します。"
        systemctl start $SERVICE_NAME

        # 再起動を通知
        echo "サービス $SERVICE_NAME を再起動しました。" | mail -s "サービスアラート" admin@example.com
    fi

    sleep $CHECK_INTERVAL
done
```

**リソース使用量の監視**
```bash
#!/bin/bash
# リソース監視スクリプト

CPU_THRESHOLD=80
MEM_THRESHOLD=80

check_resources() {
    # CPU使用率のチェック
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

    # メモリ使用率のチェック
    MEM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')

    if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
        echo "警告: CPU使用率が $CPU_USAGE% です"
    fi

    if (( $(echo "$MEM_USAGE > $MEM_THRESHOLD" | bc -l) )); then
        echo "警告: メモリ使用率が $MEM_USAGE% です"
    fi
}

while true; do
    check_resources
    sleep 60
done
```

### バッチ処理の効率化

**並列処理による処理時間の短縮**
```bash
#!/bin/bash
# 並列バッチ処理スクリプト

MAX_PARALLEL=5
tasks=("task1.sh" "task2.sh" "task3.sh" "task4.sh" "task5.sh" "task6.sh")

for task in "${tasks[@]}"; do
    # 最大並列数を制御
    while (( $(jobs | wc -l) >= MAX_PARALLEL )); do
        sleep 1
    done

    echo "$task を開始します"
    ./$task &
done

# すべてのジョブが完了するまで待機
wait
echo "すべてのタスクが完了しました"
```

**定期的なクリーンアップ処理**
```bash
#!/bin/bash
# 定期クリーンアップスクリプト

LOG_DIR="/var/log"
RETENTION_DAYS=30

# 古いログファイルの削除
find $LOG_DIR -name "*.log" -mtime +$RETENTION_DAYS -delete

# プロセスのクリーンアップ
kill_zombie_processes() {
    # ゾンビプロセスの検出と削除
    ZOMBIE_PIDS=$(ps aux | awk '$8 ~ /^Z/ {print $2}')

    if [ ! -z "$ZOMBIE_PIDS" ]; then
        echo "ゾンビプロセスを検出しました: $ZOMBIE_PIDS"
        # 親プロセスにSIGCHLDを送信
        ps aux | awk '$8 ~ /^Z/ {print $3}' | xargs -r kill -CHLD
    fi
}

kill_zombie_processes
```

## 💡 ベストプラクティス

### プロセス管理の安全性

1. **プロセスの適切な終了**
   - `kill` ではなく `kill -TERM` を優先使用
   - グレースフルシャットダウンの実装
   - 必要に応じて `kill -KILL` を使用

2. **リソースの監視と制限**
   - `ulimit` でリソース使用量を制限
   - メモリやCPUの過剰使用を防止
   - タイムアウトの設定

3. **ログの適切な管理**
   - 標準出力と標準エラーを適切に記録
   - ログローテーションの実装
   - エラー発生時の通知機構

### パフォーマンスの最適化

1. **並列処理の最適化**
   - システムリソースに応じた並列数の設定
   - ジョブの優先度制御
   - I/OバウンドとCPUバウンドの考慮

2. **監視の効率化**
   - 必要最小限の監視項目の選択
   - 効率的な監視間隔の設定
   - アラートの閾値の適切な設定

3. **スクリプトの安定性**
   - エラーハンドリングの実装
   - リトライメカニズムの導入
   - 依存関係のチェック

## 🔗 関連リンク

- [シグナルとプロセス制御](../basic-syntax/signals.md)
- [ファイル操作の実践レシピ](../file-directory-operations/)
- [エラーハンドリングのベストプラクティス](../best-practices/error-handling/)
- [システム管理の基礎](../system-management/)

## まとめ

プロセス・ジョブ管理スキルは、システム運用者にとって不可欠な能力です。適切なプロセス管理により、システムの安定性を維持し、効率的なリソース利用を実現できます。

:::note 要点のまとめ

- バックグラウンドジョブで長時間処理を効率化
- プロセス監視でシステムの健全性を維持
- 並列処理でパフォーマンスを最適化
- 適切なリソース管理でシステムを保護
- 自動化で運用コストを削減

:::

次は、より高度な[Web API統合の実践レシピ](../web-api-integration/)に進みましょう。外部システムとの連携スキルを身につけることで、より高度な自動化を実現できます。

### [プロセス監視を動かして確認してみよう]

実際にプロセス監視スクリプトを作成し、システムの状態を監視してみましょう。このハンズオンでは、プロセスの状態チェック、リソース監視、自動アラート機能を実装します。

:::step

1. 監視スクリプトの作成

以下の内容で `process_monitor.sh` を作成してください：

```bash
#!/bin/bash

# 監視設定
CPU_THRESHOLD=80
MEM_THRESHOLD=80
DISK_THRESHOLD=90
LOG_FILE="/var/log/process_monitor.log"
ALERT_EMAIL="admin@example.com"

# 監視関数
check_system() {
    # CPU使用率のチェック
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

    # メモリ使用率のチェック
    MEM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')

    # ディスク使用率のチェック
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    # 結果の出力
    echo "$(date): CPU=${CPU_USAGE}%, MEM=${MEM_USAGE}%, DISK=${DISK_USAGE}%"

    # アラートチェック
    if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
        send_alert "CPU使用率が ${CPU_USAGE}% です"
    fi

    if (( $(echo "$MEM_USAGE > $MEM_THRESHOLD" | bc -l) )); then
        send_alert "メモリ使用率が ${MEM_USAGE}% です"
    fi

    if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
        send_alert "ディスク使用率が ${DISK_USAGE}% です"
    fi
}

# アラート送信関数
send_alert() {
    local message="$1"
    echo "$(date): ALERT - $message" | tee -a "$LOG_FILE"
    # メール送信（設定が必要）
    # echo "$message" | mail -s "システムアラート" "$ALERT_EMAIL"
}

# メイン処理
echo "プロセス監視を開始します..."
while true; do
    check_system
    sleep 60
done
```

2. スクリプトの実行権限を付与

```bash
chmod +x process_monitor.sh
```

3. テスト実行

```bash
# テストモードで実行（1分間だけ）
timeout 60 ./process_monitor.sh
```

4. バックグラウンドで実行

```bash
nohup ./process_monitor.sh > monitor.log 2>&1 &
```

5. 監視の確認

```bash
# ログの確認
tail -f monitor.log

# プロセスの確認
ps aux | grep process_monitor
```

:::

このハンズオンで作成した監視スクリプトは、実際のシステム運用で活用できる実用的なものです。閾値や監視項目をカスタマイズして、あなたの環境に合わせて活用してください。