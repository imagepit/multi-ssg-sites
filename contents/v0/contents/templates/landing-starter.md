---
title: "ランディングページスターター | v0で高コンバージョンLPを作成"
slug: landing-starter
parent: "templates"
file_path: templates/landing-starter
target_user: "Web開発者、マーケティング担当者、スタートアップ創業者"
goal: "v0を使って高コンバージョン率のランディングページを作成する方法を学び、マーケティングキャンペーンの効果を最大化する"
status: publish
post_type: pages
seo_title: "ランディングページスターター | v0で高コンバージョンLPを作成"
seo_description: "v0 by Vercelを使って高コンバージョン率のランディングページを作成する方法を解説。ヒーローセクション、CTA、フォーム、SNS証明などマーケティングに最適化されたLPテンプレートを提供します。"
seo_keywords: "v0, ランディングページ, LP, コンバージョン率, マーケティング, CTA, SEO, A/Bテスト"
handson_overview: "実際の高コンバージョンランディングページをv0で作成し、ヒーローセクション、機能説明、CTAボタン、フォームを実装するハンズオンを行います。"
---

## 🎯 ランディングページスターター

現代のマーケティングにおいて、ランディングページはコンバージョン率を左右する最も重要な要素です。v0を使って、視覚的に魅力的でユーザー行動を促進する高コンバージョンランディングページを効率的に構築する方法を学びましょう。

### このページで学べること

:::note

このページでは、v0を使った高コンバージョンランディングページの作成方法を学びます。

- ヒーローセクションの設計と実装
- CTA（コールトゥアクション）の最適化
- 顧客証明と信頼性の構築
- リード獲得フォームの実装
- A/Bテストと最適化戦略
- SEO対策とパフォーマンス最適化

:::

## 🎨 高コンバージョンLPの基本構造

効果的なランディングページには、訪問者の注意を引き、信頼を築き、行動を促すための戦略的な構造が必要です。

### 必須セクション

- **ヒーローセクション**: 最初の印象と価値提案
- **問題提起**: ユーザーの課題を明確化
- **ソリューション**: 製品/サービスの解決策を提示
- **機能紹介**: 主要な機能とベネフィット
- **顧客証明**: 社会的証明と信頼性
- **CTAセクション**: 行動を促す強力な呼びかけ
- **FAQ**: よくある質問と回答

:::note コンバージョン率とは

コンバージョン率は、訪問者のうちどれだけの割合が目標のアクション（購入、登録、問い合わせなど）を実行したかを示す指標です。高コンバージョンLPは以下の要素を実装します：

- **明確な価値提案**: ユーザーが得られるベネフィットを明確に伝える
- **信頼性の構築**: 顧客の声、実績、認証などで信頼を獲得
- **行動の容易化**: フォームやCTAをシンプルで直感的に設計
- **緊急性の創出**: 限定性や時間的制約で行動を促進
- **パーソナライゼーション**: ユーザーの属性や行動に応じて表示を最適化

:::

## 📝 プロンプト設計パターン

ランディングページの各セクションを作成するためのプロンプト例を見ていきましょう。

### ヒーローセクションのプロンプト

```bash
SaaSツールのヒーローセクションを作成してください。

製品情報:
- 製品名: TaskFlow Pro
- カテゴリ: プロジェクト管理ツール
- 主要な価値提案: 「チームの生産性を2倍にする直感的なプロジェクト管理」
- ターゲットユーザー: 中小企業のチームリーダー

レイアウト構成:
- 左側: テキストコンテンツ（見出し、説明文、CTAボタン群）
- 右側: 製品のスクリーンショットまたはデモ動画
- 背景: グラデーション（紫から青）または抽象的なジオメトリックパターン

テキスト要素:
- メイン見出し（H1）: 大きく、太字でインパクトのあるコピー
- サブ見出し（H2）: 具体的なベネフィットを説明
- 説明文: 3-4行で主要な特徴を簡潔に説明
- CTAボタン群:
  - 主要CTA: 「14日間無料トライアルを開始」（プライマリカラー）
  - セカンダリCTA: 「デモを予約」（アウトラインスタイル）
- 信頼性要素: 「2,000+社が導入」「G2評価4.8/5」

デザイン要件:
- Tailwind CSSを使用
- レスポンシブ対応（モバイルでは縦積み）
- アニメーション: フェードイン、スクロール連動
- インタラクティブ: ホバー効果、スムーズスクロール
- パフォーマンス: 画像の最適化、遅延読み込み

機能:
- A/Bテスト用のコンポーネント構造
- ページロード時のアニメーション
- スクロール連動での表示効果
- ダークモード対応
```

### 顧客証明セクションのプロンプト

```bash
説得力のある顧客証明セクションを作成してください。

セクション構成:
- セクション見出し: 「信頼されている理由」
- サブ見出し: 「世界中のリーダーが選ぶTaskFlow Pro」

顧客事例カード（3件）:
- 企業名とロゴ
- 顧客の役職と名前
- 採用規模（従業員数）
- 評価（5段階評価で星表示）
- 評価コメント（2-3行）
- 具体的な成果（「生産性が40%向上」など）

統計データ（4つの数字）:
- 導入企業数: 2,500+
- ユーザー数: 50,000+
- 時間節約: 平均3時間/日
- 顧客満足度: 96%

デザイン:
- カードグリッドレイアウト（デスクトップ3列、タブレット2列、モバイル1列）
- カードのホバー効果
- 統計データのアニメーションカウンター
- レスポンシブ対応

追加要素:
- G2、Capterraなどのレビューサイトロゴ
- 「詳細な事例を見る」CTAボタン
- ソーシャル証明の埋め込み（Twitter、LinkedIn）
```

## 🛠️ 高コンバージョンLPを作成してみよう

実際にv0を使ってランディングページを作成してみましょう。

:::step

1. ヒーローセクションの作成

まずは最も重要なヒーローセクションを作成します。

```bash
AI-powered SEOツールのヒーローセクションを作成してください。

製品情報:
- 製品名: SEOBoost AI
- 主要な価値提案: 「AIで上位表示を自動化する次世代SEOツール」
- 価格: 月額$29（30日間返金保証）

デザイン要求:
- 背景に動的なグラデーションアニメーション
- 左右スプリットレイアウト（モバイルで縦積み）
- 製品スクリーンショットにインタラクティブなホバー効果
- CTAボタンに脈動アニメーション

コンテンツ構成:
- メイン見出し: 「SEO対策の未来がここに」
- サブ見出し: 「AIが自動でキーワード分析、コンテンツ最適化、順位監視を完遂」
- 特徴リスト: 3つの主要機能をアイコン付きで表示
- CTAボタン: 「今すぐ無料トライアルを開始」
- 信頼性: 「500+サイトが導入」「平均順位向上67%」

技術要件:
- Framer Motionでスムーズなアニメーション
- インターセクションオブザーバーで表示制御
- パフォーマンス最適化（画像遅延読み込み）
- アクセシビリティ対応（ARIAラベル）
```

2. CTAセクションの実装

コンバージョンを最大化するCTAセクションを作成します。

```typescript
// src/components/landing/CTASection.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CTASectionProps {
  heading: string;
  subheading: string;
  primaryCta: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  trustBadges?: string[];
  urgencyText?: string;
}

export default function CTASection({
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  trustBadges,
  urgencyText
}: CTASectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // カウントダウンタイマー
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds;
        if (totalSeconds <= 0) return prev;

        const newTotal = totalSeconds - 1;
        return {
          hours: Math.floor(newTotal / 3600),
          minutes: Math.floor((newTotal % 3600) / 60),
          seconds: newTotal % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {heading}
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subheading}
          </motion.p>

          {/* CTAボタン群 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={primaryCta.onClick}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg
                         hover:bg-blue-50 transform hover:scale-105 transition-all duration-200
                         shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                {primaryCta.text}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>

            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg
                           hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                {secondaryCta.text}
              </a>
            )}
          </motion.div>

          {/* 緊急性表示 */}
          {urgencyText && (
            <motion.div
              className="mb-8 p-4 bg-yellow-400 bg-opacity-20 rounded-lg border border-yellow-400"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-center gap-4">
                <svg className="w-6 h-6 text-yellow-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{urgencyText}</span>
                <div className="flex gap-2 font-mono">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 信頼性バッジ */}
          {trustBadges && (
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 opacity-80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{badge}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
```

3. リード獲得フォームの実装

コンバージョンを促進するリード獲得フォームを作成します。

```typescript
// src/components/landing/LeadForm.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  interest: string;
  budget: string;
}

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.company.trim()) {
      newErrors.company = '会社名を入力してください';
    }

    if (!formData.interest) {
      newErrors.interest = '興味のある分野を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 実際の実装ではAPIエンドポイントに送信
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // コンバージョンイベントを送信
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID',
            'event_callback': () => {
              console.log('Conversion tracked');
            }
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        className="text-center p-8 bg-green-50 rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          ご登録ありがとうございます！
        </h3>
        <p className="text-green-700">
          詳細な資料をメールでお送りしました。専門スタッフが24時間以内にご連絡いたします。
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        無料相談を予約
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お名前 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="山田 太郎"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="yamada@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            会社名 *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="株式会社サンプル"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            電話番号（任意）
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="03-1234-5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            興味のある分野 *
          </label>
          <select
            value={formData.interest}
            onChange={(e) => handleInputChange('interest', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       ${errors.interest ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">選択してください</option>
            <option value="seo">SEO対策</option>
            <option value="content">コンテンツマーケティング</option>
            <option value="social">ソーシャルメディアマーケティング</option>
            <option value="email">メールマーケティング</option>
            <option value="analytics">ウェブ分析</option>
          </select>
          {errors.interest && (
            <p className="text-red-500 text-sm mt-1">{errors.interest}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            予算規模
          </label>
          <select
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="small">10万円未満</option>
            <option value="medium">10-50万円</option>
            <option value="large">50-100万円</option>
            <option value="enterprise">100万円以上</option>
          </select>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
            <a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>
            に同意する
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              送信中...
            </span>
          ) : (
            '無料相談を予約する'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          送信すると、当社の利用規約とプライバシーポリシーに同意したことになります。
        </p>
      </form>
    </motion.div>
  );
}
```

4. A/Bテスト機能の実装

コンバージョン率を最適化するA/Bテスト機能を実装します。

```typescript
// src/lib/ab-testing.ts
interface Variant {
  id: string;
  name: string;
  weight: number; // 0-1の間の重み付け
  config: Record<string, any>;
}

interface Test {
  id: string;
  name: string;
  variants: Variant[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
}

export class ABTesting {
  private static instance: ABTesting;
  private tests: Map<string, Test> = new Map();
  private userAssignments: Map<string, string> = new Map();

  static getInstance(): ABTesting {
    if (!ABTesting.instance) {
      ABTesting.instance = new ABTesting();
    }
    return ABTesting.instance;
  }

  // テストを登録
  registerTest(test: Test): void {
    this.tests.set(test.id, test);
  }

  // ユーザーにバリアントを割り当て
  assignVariant(testId: string, userId?: string): string {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'active') {
      return 'control';
    }

    // ユーザーIDが指定されていない場合、一時的なIDを生成
    const effectiveUserId = userId || this.generateTempUserId();
    const cacheKey = `${testId}_${effectiveUserId}`;

    // すでに割り当てられている場合
    if (this.userAssignments.has(cacheKey)) {
      return this.userAssignments.get(cacheKey)!;
    }

    // 重み付けに基づいてバリアントを選択
    const random = Math.random();
    let accumulated = 0;

    for (const variant of test.variants) {
      accumulated += variant.weight;
      if (random <= accumulated) {
        this.userAssignments.set(cacheKey, variant.id);
        return variant.id;
      }
    }

    // フォールバック
    this.userAssignments.set(cacheKey, 'control');
    return 'control';
  }

  // バリアント設定を取得
  getVariantConfig(testId: string, variantId: string): Record<string, any> | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    const variant = test.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  // コンバージョンを記録
  trackConversion(testId: string, variantId: string, value?: number): void {
    // 実際の実装では分析サービスに送信
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'event_category': 'ab_test',
        'event_label': `${testId}_${variantId}`,
        'value': value
      });
    }

    // カスタムイベントを発火
    window.dispatchEvent(new CustomEvent('ab_conversion', {
      detail: { testId, variantId, value }
    }));
  }

  // 一時的なユーザーIDを生成
  private generateTempUserId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Reactフック
export function useABTest(testId: string, userId?: string) {
  const [variant, setVariant] = useState<string>('control');
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    const abTesting = ABTesting.getInstance();
    const assignedVariant = abTesting.assignVariant(testId, userId);
    const variantConfig = abTesting.getVariantConfig(testId, assignedVariant);

    setVariant(assignedVariant);
    setConfig(variantConfig || {});
  }, [testId, userId]);

  const trackConversion = (value?: number) => {
    const abTesting = ABTesting.getInstance();
    abTesting.trackConversion(testId, variant, value);
  };

  return { variant, config, trackConversion };
}

// コンポーネントラッパー
interface ABTestComponentProps {
  testId: string;
  children: (variant: string, config: Record<string, any>) => React.ReactNode;
}

export function ABTestComponent({ testId, children }: ABTestComponentProps) {
  const { variant, config } = useABTest(testId);

  return <>{children(variant, config)}</>;
}
```

5. SEO最適化の実装

検索エンジン最適化のための機能を実装します。

```typescript
// src/components/landing/SEOHead.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: any;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  structuredData
}: SEOHeadProps) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const fullUrl = canonicalUrl || `${siteUrl}${router.asPath}`;
  const defaultImage = ogImage || `${siteUrl}/images/og-default.jpg`;

  const jsonLd = structuredData ? JSON.stringify(structuredData) : undefined;

  return (
    <Head>
      {/* 基本的なメタタグ */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Your Site Name" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />

      {/* 追加のSEOタグ */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* 構造化データ */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd
          }}
        />
      )}

      {/* ファビコン */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </Head>
  );
}

// ランディングページ用の構造化データ生成
export function generateLandingPageStructuredData(data: {
  name: string;
  description: string;
  url: string;
  image: string;
  price?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "image": data.image,
    ...(data.price && {
      "offers": {
        "@type": "Offer",
        "price": data.price,
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock"
      }
    }),
    ...(data.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.rating.ratingValue,
        "reviewCount": data.rating.reviewCount
      }
    })
  };
}
```

:::

## 🎨 高度なLP最適化テクニック

さらに高度なランディングページ最適化のテクニックを紹介します。

### パーソナライゼーションエンジン

```typescript
// src/lib/personalization.ts
interface UserProfile {
  location?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  visitCount?: number;
  previousConversions?: string[];
}

interface PersonalizationRule {
  id: string;
  condition: (profile: UserProfile) => boolean;
  actions: {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    backgroundColor?: string;
    image?: string;
  };
}

export class PersonalizationEngine {
  private rules: PersonalizationRule[] = [];
  private profile: UserProfile;

  constructor() {
    this.profile = this.buildUserProfile();
    this.loadRules();
  }

  private buildUserProfile(): UserProfile {
    return {
      location: this.getUserLocation(),
      deviceType: this.getDeviceType(),
      referrer: document.referrer,
      utmSource: this.getUTMParameter('utm_source'),
      utmMedium: this.getUTMParameter('utm_medium'),
      utmCampaign: this.getUTMParameter('utm_campaign'),
      visitCount: this.getVisitCount(),
      previousConversions: this.getPreviousConversions()
    };
  }

  private getUserLocation(): string | undefined {
    // 実際の実装ではGeolocation APIまたはIPベースの位置情報サービスを使用
    return undefined;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(userAgent)) return 'mobile';
    if (/tablet|ipad/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private getUTMParameter(param: string): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || undefined;
  }

  private getVisitCount(): number {
    const visits = localStorage.getItem('visit_count');
    const count = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem('visit_count', count.toString());
    return count;
  }

  private getPreviousConversions(): string[] {
    const conversions = localStorage.getItem('conversions');
    return conversions ? JSON.parse(conversions) : [];
  }

  private loadRules(): void {
    this.rules = [
      {
        id: 'returning_visitor',
        condition: (profile) => (profile.visitCount || 0) > 1,
        actions: {
          heading: 'お帰りなさい！',
          subheading: '前回の続きから始めましょう'
        }
      },
      {
        id: 'mobile_user',
        condition: (profile) => profile.deviceType === 'mobile',
        actions: {
          ctaText: '今すぐアプリをダウンロード',
          backgroundColor: '#4F46E5'
        }
      },
      {
        id: 'paid_traffic',
        condition: (profile) => profile.utmSource === 'google' || profile.utmSource === 'facebook',
        actions: {
          heading: '特別オファー！',
          subheading: '広告経由でご訪問の方限定'
        }
      }
    ];
  }

  getPersonalizedContent(): Record<string, any> {
    const personalized: Record<string, any> = {};

    for (const rule of this.rules) {
      if (rule.condition(this.profile)) {
        Object.assign(personalized, rule.actions);
      }
    }

    return personalized;
  }

  trackConversion(conversionId: string): void {
    const conversions = [...this.profile.previousConversions, conversionId];
    localStorage.setItem('conversions', JSON.stringify(conversions));
    this.profile.previousConversions = conversions;
  }
}

// Reactフック
export function usePersonalization() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [engine] = useState(() => new PersonalizationEngine());

  useEffect(() => {
    const personalized = engine.getPersonalizedContent();
    setContent(personalized);
  }, [engine]);

  return { content, engine };
}
```

### リターゲティングスクリプト統合

```typescript
// src/components/landing/RetargetingScripts.tsx
interface RetargetingScriptsProps {
  facebookPixelId?: string;
  googleAdsId?: string;
  twitterPixelId?: string;
  linkedinPartnerId?: string;
}

export default function RetargetingScripts({
  facebookPixelId,
  googleAdsId,
  twitterPixelId,
  linkedinPartnerId
}: RetargetingScriptsProps) {
  return (
    <>
      {/* Facebook Pixel */}
      {facebookPixelId && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${facebookPixelId}');
                fbq('track', 'PageView');
              `
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* Google Ads */}
      {googleAdsId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('config', '${googleAdsId}');
            `
          }}
        />
      )}

      {/* Twitter Pixel */}
      {twitterPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('init','${twitterPixelId}');twq('track','PageView');
            `
          }}
        />
      )}

      {/* LinkedIn Insight Tag */}
      {linkedinPartnerId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "${linkedinPartnerId}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(){var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);})();
            `
          }}
        />
      )}
    </>
  );
}
```

## まとめ

v0を使えば、高コンバージョン率のランディングページも効率的に実装できます。適切なプロンプト設計とマーケティングベストプラクティスを組み合わせることで、訪問者を行動に促す効果的なLPを構築できます。

:::note 要点のまとめ

- ヒーローセクションは第一印象と価値提案を明確に伝える
- CTAの配置とデザインがコンバージョン率を大きく左右する
- 顧客証明と社会的証明で信頼性を構築する
- A/Bテストで継続的に最適化を行う
- パーソナライゼーションでユーザー体験を向上させる
- SEO対策とパフォーマンス最適化は必須

:::

次は「[コンポーネントスニペット](./component-snippets.md)」で、再利用可能なUIコンポーネント集を学びましょう。

## 📚 関連リンク

- [A/Bテストのベストプラクティス](../level5-designsystem-ops/performance.md)
- [SEO対策ガイド](../level6-integration-deploy/vercel-deploy.md)
- [アクセシビリティの実装](../level3-components/accessibility.md)