# 選び方ガイド（設計メモ）

本ガイドは、要件に応じてユーザーが「どのGemini関連ツール/サービスを使うべきか」を即断できるよう、サイト内コンテンツの編集方針と導線を定義する設計メモです。実装ページ（/introduction/which-to-choose）に反映します。

## 判断フロー（簡易）

1) 目的は何か？
- 個人向けの調べ物/文章作成 → Gemini（Web/モバイル）
- 高性能モデルで長文や高度なタスク → Gemini Advanced
- 会社/チームでの文書・表・スライドの生産性向上 → Gemini for Google Workspace
- アプリ開発・API連携の検証 → Google AI Studio + Gemini API（試作）
- 企業向け本番/セキュリティ・データ統合 → Vertex AI（Gemini on Google Cloud）
- コーディング支援 → Gemini Code Assist
- デバイス上での軽量AI → Gemini Nano（Android AICore）
- 画像生成・編集 → Images/Imagen（Images API）

2) 必須要件は？
- 企業データの安全な接続/ガバナンス → Vertex AI（Agent Builder, Grounding, Connectors）
- 長文・多数ファイル入力 → Gemini 1.5（Files API/長文コンテキスト）
- JSON/構造化出力 → 構造化出力（JSON Schema）対応のGemini API/Vertex AI
- ツール実行/外部API呼び出し → Function Calling（Tool Use）
- ストリーミング応答 → ストリーミングAPI（Node/Python/Vertex）

3) 運用要件は？
- セキュリティ/コンプライアンス → Vertex AI（企業向けSLA/ガードレール/ログ）
- 監視・評価・安全性 → Vertex AI の評価/安全設定、コンテンツフィルタ
- コスト最適化 → モデル選択（Flash/Pro）、キャッシュ/バッチ、クォータ設計

## おすすめ構成（代表パターン）

- 個人/小規模PoC: AI Studio + Gemini API → 迅速な試作とコード生成
- 社内ナレッジQ&A: Vertex AI（Search/Agent Builder + Grounding + Gemini 1.5）
- エージェント/ワークフロー: Vertex AI（Agent Builder + Function Calling + Connectors）
- 生成アプリの本番運用: Vertex AI（Model Garden/Gemini + 監視/評価 + セキュリティ）
- コーディング向上: Gemini Code Assist（IDE連携）
- 画像生成ワークフロー: Images/Imagen API（生成/編集/スタイル転移）
- モバイル体験: Gemini Nano（AICore, オンデバイス）

## 比較の観点（サイトで明示）

- AI Studio vs Vertex AI（料金/権限/運用/地域/SLA）
- Gemini 1.5 Pro vs 1.5 Flash（品質/速度/コスト）
- Gemini API vs Images API（テキスト/マルチモーダル vs 画像生成）
- Code Assist vs 他社（Copilot等）
- Gemini（個人/Advanced） vs Workspace（業務）

## ページ反映方針

- 入門セクションに「選び方ガイド」を配置し、上記フロー図と用途別カードで誘導。
- 各用途ページの冒頭に「この用途に最適なモデル/サービス」短縮版を明示。
- 比較/リソースにクォータ/制限/セキュリティ/日本語最適化/評価を集約し、導線を統一。
