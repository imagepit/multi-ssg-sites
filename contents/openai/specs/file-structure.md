# コンテンツのディレクトリ・ファイル構造定義

```files
contents/openai/contents/
├── home.md                                # トップページ
├── sidebars.md                            # サイドバー定義
├── getting-started/                       # 「はじめに」
│   ├── getting-started.md                 # 「はじめに」indexページ
│   ├── overview.md                        # 概要
│   ├── what-is-chatgpt.md                 # ChatGPTとは
│   ├── account-setup.md                   # アカウント作成
│   └── first-setup.md                     # 初回セットアップ
├── level1-chatgpt-basics/                 # ChatGPT基礎
│   ├── level1-chatgpt-basics.md           # レベル1 indexページ
│   ├── basic-operations/                  # 基本操作
│   │   ├── basic-operations.md            # 基本操作 indexページ
│   │   ├── interface.md                   # インターフェース操作
│   │   ├── prompt-basics.md               # 基本的なプロンプト作成
│   │   ├── conversation-tips.md           # 会話継続のコツ
│   │   └── history-management.md          # 履歴管理
│   ├── prompt-fundamentals/               # プロンプト基礎
│   │   ├── prompt-fundamentals.md         # プロンプト基礎 indexページ
│   │   ├── prompt-structure.md            # プロンプトの構造
│   │   ├── instructions.md                # 指示の与え方
│   │   ├── context-setting.md             # コンテキスト設定
│   │   ├── output-format.md               # 出力形式指定
│   │   └── improvement-techniques.md      # 改善テクニック
│   ├── usage-patterns/                    # 活用パターン
│   │   ├── usage-patterns.md              # 活用パターン indexページ
│   │   ├── writing-support.md             # 文書作成支援
│   │   ├── idea-generation.md             # アイデア発想
│   │   ├── learning-support.md            # 学習サポート
│   │   ├── translation-summary.md         # 翻訳・要約
│   │   └── qna.md                         # Q&A活用
│   └── troubleshooting/                   # よくある問題と解決法
│       ├── troubleshooting.md             # よくある問題と解決法 indexページ
│       ├── no-expected-answer.md          # 期待した答えが得られない
│       ├── accuracy-issues.md             # 情報の正確性について
│       ├── long-prompts.md                # プロンプトが長すぎる
│       └── response-speed.md              # 応答速度の改善
├── level2-models/                         # OpenAIモデル理解
│   ├── level2-models.md                   # レベル2 indexページ
│   ├── gpt-history.md                     # GPTシリーズの歴史
│   ├── gpt4o-and-mini.md                  # GPT-4oとGPT-4o mini
│   ├── whisper.md                         # Whisper（音声認識）
│   ├── dalle.md                           # DALL·E（画像生成）
│   ├── tts.md                             # TTS（音声合成）
│   ├── embeddings.md                      # Embeddings（検索・推薦）
│   └── moderation.md                      # Moderation（コンテンツ安全性）
├── level3-api/                            # API活用
│   ├── level3-api.md                      # レベル3 indexページ
│   ├── api-basics/                        # APIの基本
│   │   ├── api-basics.md                  # APIの基本 indexページ
│   │   ├── api-key.md                     # APIキー取得
│   │   ├── python.md                      # Pythonでの利用
│   │   ├── nodejs.md                      # Node.jsでの利用
│   │   └── cost-management.md             # コスト管理
│   ├── chat-completions.md                # Chat Completions
│   ├── embeddings-api.md                  # Embeddings活用
│   ├── images-api.md                      # Images API（DALL·E）
│   ├── audio-api.md                       # Audio API（Whisper/TTS）
│   ├── realtime-api.md                    # Realtime API
│   └── moderation-api.md                  # Moderation API
├── level4-advanced/                       # 応用とツール開発
│   ├── level4-advanced.md                 # レベル4 indexページ
│   ├── prompt-engineering.md              # プロンプトエンジニアリング実践
│   ├── langchain.md                       # LangChain入門
│   ├── llamaindex.md                      # LlamaIndex入門
│   ├── slack-discord-bot.md               # Slack/Discord Bot開発
│   ├── n8n-zapier.md                      # n8n/Zapier連携
│   └── app-examples.md                    # 自作アプリ事例
├── level5-enterprise/                     # 法人・教育向け利用
│   ├── level5-enterprise.md               # レベル5 indexページ
│   ├── chatgpt-enterprise.md              # ChatGPT Enterprise
│   ├── chatgpt-edu.md                     # ChatGPT Edu
│   ├── azure-openai.md                    # Azure OpenAI Service
│   ├── security-compliance.md             # セキュリティとコンプライアンス
│   └── case-studies.md                    # 導入事例
├── level6-future/                         # 最新研究と未来
│   ├── level6-future.md                   # レベル6 indexページ
│   ├── sora.md                            # Sora（動画生成）
│   ├── codex.md                           # Codex（過去のコード特化モデル）
│   ├── multimodal.md                      # マルチモーダルAIの進化
│   ├── open-source-comparison.md          # オープンソース系モデルとの比較
│   └── future-trends.md                   # 今後の展望
└── appendix/                              # 付録
    ├── appendix.md                        # 付録 indexページ
    ├── glossary.md                        # 用語集
    ├── faq.md                             # よくある質問（FAQ）
    ├── cost-sheet.md                      # コスト試算シート
    └── links.md                           # リンク集（公式Docs, コミュニティ, GitHubなど）
```