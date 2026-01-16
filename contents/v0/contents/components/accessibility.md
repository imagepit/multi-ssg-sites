---
title: アクセシビリティ実践（ARIA/focus-visible）
slug: accessibility
parent: "components"
file_path: components/accessibility.md
target_user: フロントエンド開発者、UI/UXデザイナー、Reactエンジニア
goal: "v0で生成したUIコンポーネントのアクセシビリティ実装方法を学び、ARIA属性やfocus-visible、キーボードナビゲーションなどの実践的なアクセシビリティ対応技術を習得する"
status: published
post_type: pages
seo_title: v0アクセシビリティ実践ガイド | ARIA/focus-visibleで学ぶ包括的UI開発
seo_description: "v0で生成したReactコンポーネントのアクセシビリティ対応を学ぶ完全ガイド。ARIA属性、focus-visible、スクリーンリーダー対応、キーボードナビゲーションなど実践的なアクセシビリティ技術を習得できます。"
seo_keywords: "v0, アクセシビリティ, ARIA, focus-visible, キーボードナビゲーション, スクリーンリーダー, 色覚多様性, Reactコンポーネント, 包括的UI"
handson_overview: "v0で生成したコンポーネントにアクセシビリティ機能を実装するハンズオン。ARIA属性の追加、キーボード操作の対応、スクリーンリーダー対応などを実際のコードで学びます。"
---

## はじめに

♿ v0で生成したUIコンポーネントを、すべてのユーザーが利用できるアクセシブルなUIにする方法を学ぶセクションです。アクセシビリティ対応は、単なる技術要件ではなく、より多くのユーザーに価値を届けるための重要な設計思想です。

### このページで学べる事

このセクションでは、v0とReactを活用した実践的なアクセシビリティ対応手法を学びます。

:::note

- v0で生成したコンポーネントのアクセシビリティ課題を特定する方法
- ARIA属性の適切な使用と実装パターン
- focus-visibleとキーボードナビゲーションの最適化
- スクリーンリーダー対応と意味的なマークアップ
- 色覚多様性と視覚的アクセシビリティの考慮
- アクセシビリティテストと検証手法

:::

## 🎯 アクセシビリティの基礎と重要性

アクセシビリティ対応は、Webサイトやアプリケーションをすべてのユーザーにとって利用しやすくするための取り組みです。視覚障害、聴覚障害、運動障害、色覚異常など、様々な状況にあるユーザーが等しくサービスを利用できるようにすることが目的です。

### Webアクセシビリティの4つの原則

WCAG（Web Content Accessibility Guidelines）では、アクセシビリティを4つの原則で定義しています：

1. **知覚可能**: ユーザーが情報を知覚できること
2. **操作可能**: ユーザーがインターフェースを操作できること
3. **理解可能**: ユーザーが情報を理解できること
4. **堅牢性**: 様々な技術環境で利用できること

:::note WCAG（Web Content Accessibility Guidelines）とは

Webコンテンツのアクセシビリティに関する国際的なガイドラインで、W3C（World Wide Web Consortium）によって策定されています。レベルA（最低限の対応）、レベルAA（推奨レベル）、レベルAAA（最高レベル）の3段階で構成されています。

:::

### v0におけるアクセシビリティの課題

v0で生成されたコンポーネントは、視覚的には美しく機能的ですが、アクセシビリティ対応が不足している場合があります。主な課題としては：

- **セマンティックHTMLの不足**: 適切なHTML要素の使用
- **ARIA属性の欠如**: スクリーンリーダー向けの情報提供
- **キーボードナビゲーション未対応**: Tabキーでの操作
- **コントラスト比の問題**: 視覚的な識別性の不足
- **フォーカス管理の不備**: フォーカスの視覚的表示

## 🏷️ ARIA属性と使用パターン

ARIA（Accessible Rich Internet Applications）は、スクリーンリーダーなどの支援技術に追加情報を提供するための属性です。v0で生成したコンポーネントにARIA属性を適切に追加することで、アクセシビリティを大幅に向上させることができます。

### 主要なARIA属性

ARIA属性は主に以下のカテゴリに分類されます：

- **ロール属性**: 要素の役割を定義（`role="button"`、`role="navigation"`など）
- **ステート属性**: 要素の状態を表現（`aria-expanded`、`aria-selected`など）
- **プロパティ属性**: 要素の特性を定義（`aria-label`、`aria-describedby`など）

### v0で生成されたボタンへのARIA実装

v0で生成された基本的なボタンコンポーネントにアクセシビリティ機能を追加してみましょう。

```tsx
// v0生成の基本ボタン
export default function BasicButton({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  )
}

// アクセシビリティ対応ボタン
interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  ariaLabel,
  ariaDescribedBy
}: AccessibleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      className={`
        px-4 py-2 bg-blue-500 text-white rounded
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
    >
      {isLoading ? <span aria-hidden="true">処理中...</span> : children}
    </button>
  )
}
```

### フォームコンポーネントのARIA実装

フォームコンポーネントでは、ラベルと入力フィールドの関連付けが特に重要です。

```tsx
interface AccessibleInputProps {
  label: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
  description?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AccessibleInput({
  label,
  type = "text",
  placeholder,
  error,
  required = false,
  description,
  value,
  onChange
}: AccessibleInputProps) {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const descriptionId = description ? `${inputId}-description` : undefined

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="必須">*</span>}
      </label>

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId || descriptionId}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />

      {description && (
        <div id={descriptionId} className="text-sm text-gray-500">
          {description}
        </div>
      )}

      {error && (
        <div id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
```

### [ARIA属性]を動かして確認してみよう

v0で生成したコンポーネントにARIA属性を実装し、スクリーンリーダーで動作を確認してみましょう。

:::step

1. アクセシビリティテスト用のプロジェクト作成

任意の場所（デスクトップなど）で`v0-accessibility-test`フォルダを作成し、Next.jsプロジェクトを初期化します。

```bash
npx create-next-app@latest v0-accessibility-test --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd v0-accessibility-test
```

2. ARIA対応ボタンコンポーネントの作成

`src/components/ui/AccessibleButton.tsx`を作成します。

```tsx
'use client'

import React from 'react'

interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  variant?: 'primary' | 'secondary' | 'danger'
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  ariaLabel,
  ariaDescribedBy,
  variant = 'primary'
}: AccessibleButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200"

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? (
        <span aria-hidden="true">
          <svg className="animate-spin h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          処理中...
        </span>
      ) : children}
    </button>
  )
}
```

3. フォームコンポーネントの作成

`src/components/ui/AccessibleForm.tsx`を作成します。

```tsx
'use client'

import { useState } from 'react'
import { AccessibleButton } from './AccessibleButton'

interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  description?: string
  placeholder?: string
}

export function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fields: FormField[] = [
    {
      id: 'name',
      label: 'お名前',
      type: 'text',
      required: true,
      description: 'フルネームで入力してください'
    },
    {
      id: 'email',
      label: 'メールアドレス',
      type: 'email',
      required: true,
      placeholder: 'example@email.com'
    },
    {
      id: 'password',
      label: 'パスワード',
      type: 'password',
      required: true,
      description: '8文字以上で入力してください'
    }
  ]

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // エラーをクリア
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください'
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // フォーム送信処理
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    alert('フォームが正常に送信されました！')
    setFormData({ name: '', email: '', password: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md"
      noValidate
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">アクセシビリティ対応フォーム</h2>

      {fields.map((field) => {
        const errorId = errors[field.id] ? `${field.id}-error` : undefined
        const descriptionId = field.description ? `${field.id}-description` : undefined
        const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined

        return (
          <div key={field.id} className="space-y-2">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && (
                <span className="text-red-500 ml-1" aria-label="必須">*</span>
              )}
            </label>

            <input
              id={field.id}
              type={field.type}
              value={formData[field.id as keyof typeof formData]}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              aria-invalid={!!errors[field.id]}
              aria-describedby={ariaDescribedBy}
              className={`
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}
              `}
            />

            {field.description && (
              <div id={descriptionId} className="text-sm text-gray-500">
                {field.description}
              </div>
            )}

            {errors[field.id] && (
              <div id={errorId} className="text-sm text-red-500" role="alert">
                {errors[field.id]}
              </div>
            )}
          </div>
        )
      })}

      <AccessibleButton
        type="submit"
        isLoading={isSubmitting}
        ariaDescribedBy={Object.keys(errors).length > 0 ? 'form-errors' : undefined}
      >
        {isSubmitting ? '送信中...' : '送信'}
      </AccessibleButton>
    </form>
  )
}
```

4. テストページの作成

`src/app/page.tsx`を修正してアクセシビリティテストページを作成します。

```tsx
import { AccessibleForm } from '@/components/ui/AccessibleForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            アクセシビリティ実践テスト
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            v0で生成したコンポーネントのアクセシビリティ対応を確認するためのデモページです。
            スクリーンリーダーやキーボード操作で各コンポーネントをテストしてみてください。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">アクセシビリティ対応フォーム</h2>
            <AccessibleForm />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">テスト手順</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h3 className="font-semibold text-gray-700">キーボード操作テスト</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Tabキーでフォームフィールド間を移動</li>
                <li>Shift+Tabで逆方向に移動</li>
                <li>Enterキーでフォームを送信</li>
                <li>Spaceキーでボタンを操作</li>
              </ul>

              <h3 className="font-semibold text-gray-700">スクリーンリーダーテスト</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>VoiceOver (Mac) や NVDA (Windows) を起動</li>
                <li>各要素を読み上げて内容を確認</li>
                <li>エラーメッセージが適切に通知されるか確認</li>
                <li>ラベルと入力フィールドの関連性を確認</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
```

5. 開発サーバーの起動とテスト

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、以下のテストを実施します：

- **キーボード操作**: Tabキーでフォームフィールドを移動
- **スクリーンリーダー**: 各要素が適切に読み上げられるか確認
- **エラー表示**: バリデーションエラーがARIAで適切に伝わるか確認

:::

## ⌨️ focus-visibleとキーボードナビゲーション

キーボードナビゲーションはアクセシビリティにおいて重要な要素です。マウスを使用できないユーザーがWebサイトを操作するために、キーボードのみですべての機能にアクセスできる必要があります。

### focus-visibleの重要性

`focus-visible`は、キーボード操作時にのみフォーカスインジケーターを表示するCSSの疑似クラスです。これにより、マウスユーザーには不要なフォーカス表示をせず、キーボードユーザーには必要な視覚的フィードバックを提供できます。

### キーボードナビゲーションの実装

```tsx
// focus-visible対応のナビゲーションコンポーネント
interface NavigationItem {
  id: string
  label: string
  href: string
  description?: string
}

export function AccessibleNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav aria-label="メインナビゲーション" role="navigation">
      <ul className="flex space-x-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-label={item.label}
              aria-describedby={item.description ? `${item.id}-desc` : undefined}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                text-gray-700 hover:text-gray-900 hover:bg-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus-visible:ring-2 focus-visible:ring-blue-500
                focus-visible:ring-offset-2
                transition-colors duration-200
              `}
            >
              {item.label}
              {item.description && (
                <span id={`${item.id}-desc`} className="sr-only">
                  {item.description}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### キーボードショートカットの実装

```tsx
// キーボードショートカット対応のコンポーネント
export function KeyboardShortcutDemo() {
  const [showHelp, setShowHelp] = useState(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    // Alt + ? でヘルプ表示
    if (e.altKey && e.key === '?') {
      e.preventDefault()
      setShowHelp(!showHelp)
    }

    // Escapeでヘルプ非表示
    if (e.key === 'Escape') {
      setShowHelp(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp])

  return (
    <div className="p-4">
      <button
        onClick={() => setShowHelp(!showHelp)}
        aria-label="ヘルプを表示"
        aria-expanded={showHelp}
        aria-controls="help-panel"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ヘルプ (Alt+?)
      </button>

      {showHelp && (
        <div
          id="help-panel"
          role="region"
          aria-label="ヘルプパネル"
          className="mt-4 p-4 bg-gray-100 rounded-md"
        >
          <h3 className="font-semibold mb-2">キーボードショートカット</h3>
          <ul className="space-y-1 text-sm">
            <li><kbd className="px-2 py-1 bg-gray-200 rounded">Alt</kbd> + <kbd className="px-2 py-1 bg-gray-200 rounded">?</kbd>: ヘルプ表示</li>
            <li><kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd>: ヘルプ非表示</li>
            <li><kbd className="px-2 py-1 bg-gray-200 rounded">Tab</kbd>: 次の要素に移動</li>
            <li><kbd className="px-2 py-1 bg-gray-200 rounded">Shift</kbd> + <kbd className="px-2 py-1 bg-gray-200 rounded">Tab</kbd>: 前の要素に移動</li>
          </ul>
        </div>
      )}
    </div>
  )
}
```

### [focus-visible]を動かして確認してみよう

focus-visibleとキーボードナビゲーションの実装を実際に試してみましょう。

:::step

1. フォーカス対応コンポーネントの作成

`src/components/ui/FocusDemo.tsx`を作成します。

```tsx
'use client'

import { useState } from 'react'

export function FocusDemo() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    { id: 'tab1', label: 'タブ1', content: 'タブ1のコンテンツです。キーボード操作でタブを切り替えてみてください。' },
    { id: 'tab2', label: 'タブ2', content: 'タブ2のコンテンツです。focus-visibleの動作を確認できます。' },
    { id: 'tab3', label: 'タブ3', content: 'タブ3のコンテンツです。スクリーンリーダーでも正しく読み上げられます。' }
  ]

  return (
    <div className="space-y-8">
      {/* ボタングループ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">ボタングループ（矢印キー操作対応）</h3>
        <div className="flex gap-2" role="group" aria-label="ボタングループ">
          {['オプション1', 'オプション2', 'オプション3'].map((option, index) => (
            <button
              key={option}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const buttons = Array.from(e.currentTarget.parentElement?.children || [])
                  const currentIndex = buttons.indexOf(e.currentTarget)
                  let nextIndex

                  if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % buttons.length
                  } else {
                    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
                  }

                  ;(buttons[nextIndex] as HTMLElement).focus()
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* タブインターフェース */}
      <div>
        <h3 className="text-lg font-semibold mb-4">アクセシブルなタブインターフェース</h3>
        <div className="border border-gray-200 rounded-lg">
          <div className="flex border-b border-gray-200" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault()
                    const currentIndex = tabs.findIndex(t => t.id === activeTab)
                    let nextIndex

                    if (e.key === 'ArrowRight') {
                      nextIndex = (currentIndex + 1) % tabs.length
                    } else {
                      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
                    }

                    setActiveTab(tabs[nextIndex].id)
                    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus()
                  }
                }}
                className={`
                  px-4 py-2 font-medium text-sm border-b-2 -mb-px
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                id={`panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                tabIndex={0}
                className={activeTab === tab.id ? 'block' : 'hidden'}
              >
                <p className="text-gray-700">{tab.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* モーダルデモ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">キーボード操作対応モーダル</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          モーダルを開く
        </button>

        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 id="modal-title" className="text-xl font-semibold mb-4">
                アクセシブルなモーダル
              </h2>
              <p className="text-gray-600 mb-6">
                このモーダルはキーボード操作に完全対応しています。Tabキーでフォーカスを移動し、Escapeキーで閉じることができます。
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

2. テストページの更新

`src/app/page.tsx`にFocusDemoコンポーネントを追加します。

```tsx
import { AccessibleForm } from '@/components/ui/AccessibleForm'
import { FocusDemo } from '@/components/ui/FocusDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            アクセシビリティ実践テスト
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            v0で生成したコンポーネントのアクセシビリティ対応を確認するためのデモページです。
            スクリーンリーダーやキーボード操作で各コンポーネントをテストしてみてください。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">アクセシビリティ対応フォーム</h2>
            <AccessibleForm />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">フォーカスとキーボードナビゲーション</h2>
            <FocusDemo />
          </div>
        </div>
      </div>
    </main>
  )
}
```

3. CSSでfocus-visibleを有効化

`src/app/globals.css`にfocus-visibleのスタイルを追加します。

```css
/* 既存のスタイルに追加 */

/* focus-visibleの基本的なスタイル */
.focus-visible\:ring-2:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

/* キーボードユーザーにはフォーカスインジケーターを表示 */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* マウスユーザーにはフォーカスインジケーターを非表示 */
button:focus:not(:focus-visible),
input:focus:not(:focus-visible),
select:focus:not(:focus-visible),
textarea:focus:not(:focus-visible) {
  outline: none;
}

/* スキップリンク用のスタイル */
.sr-only:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  background: white;
  color: black;
  clip: auto;
  white-space: normal;
}
```

4. 動作確認

```bash
npm run dev
```

ブラウザでページを開き、以下の操作をテストします：

- **Tabキー**: 各要素間を移動
- **Shift+Tab**: 逆方向に移動
- **矢印キー**: タブ間の移動
- **Enter/Space**: ボタンの操作
- **Escape**: モーダルの閉じる
- **フォーカス表示**: キーボード操作時のみフォーカスインジケーターが表示されるか確認

:::

## 🎧 スクリーンリーダー対応

スクリーンリーダーは、視覚障害のあるユーザーがWebコンテンツを利用するための重要なツールです。v0で生成したコンポーネントがスクリーンリーダーで正しく読み上げられるようにすることが重要です。

### スクリーンリーダーの基本

主なスクリーンリーダーには以下のものがあります：

- **NVDA**: Windows向けの無料スクリーンリーダー
- **JAWS**: Windows向けの商用スクリーンリーダー
- **VoiceOver**: macOS/iOSに標準搭載
- **TalkBack**: Androidに標準搭載

### 意味的なマークアップの重要性

```tsx
// 悪い例: 意味的でないマークアップ
<div className="text-xl font-bold mb-4">重要な見出し</div>

// 良い例: 適切な見出し要素の使用
<h2 className="text-xl font-bold mb-4">重要な見出し</h2>
```

### 動的コンテンツの対応

```tsx
// 動的コンテンツのスクリーンリーダー対応
interface LiveRegionProps {
  messages: string[]
  ariaLive?: 'polite' | 'assertive' | 'off'
}

export function LiveRegion({ messages, ariaLive = 'polite' }: LiveRegionProps) {
  return (
    <div
      aria-live={ariaLive}
      aria-atomic="true"
      className="sr-only"
    >
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  )
}

// 使用例
export function NotificationSystem() {
  const [notifications, setNotifications] = useState<string[]>([])

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 5000)
  }

  return (
    <div>
      <LiveRegion messages={notifications} ariaLive="polite" />
      <button onClick={() => addNotification('新しい通知が届きました')}>
        通知を追加
      </button>
    </div>
  )
}
```

### [スクリーンリーダー対応]を動かして確認してみよう

スクリーンリーダー対応の実装を試してみましょう。

:::step

1. スクリーンリーダーデモコンポーネントの作成

`src/components/ui/ScreenReaderDemo.tsx`を作成します。

```tsx
'use client'

import { useState, useEffect } from 'react'

export function ScreenReaderDemo() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // 通知を追加する関数
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    // 5秒後に通知を削除
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 5000)
  }

  // プログレスバーの処理
  const startProcessing = () => {
    setIsProcessing(true)
    setProgress(0)
    addNotification('処理を開始しました')

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          addNotification('処理が完了しました')
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  return (
    <div className="space-y-8">
      {/* ライブリージョンデモ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">ライブリージョン通知</h3>
        <div className="space-y-4">
          <button
            onClick={() => addNotification('情報が更新されました')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            情報更新通知
          </button>
          <button
            onClick={() => addNotification('警告：重要な変更があります')}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            警告通知
          </button>
          <button
            onClick={() => addNotification('エラーが発生しました')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            エラー通知
          </button>
        </div>

        {/* スクリーンリーダー用ライブリージョン */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {notifications.map((notification, index) => (
            <div key={index}>{notification}</div>
          ))}
        </div>

        {/* 視覚的な通知表示 */}
        <div className="mt-4 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800"
              role="status"
              aria-live="polite"
            >
              {notification}
            </div>
          ))}
        </div>
      </div>

      {/* プログレスバーデモ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">アクセシブルなプログレスバー</h3>
        <div className="space-y-4">
          <button
            onClick={startProcessing}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? '処理中...' : '処理開始'}
          </button>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`処理進捗: ${progress}%`}
            >
              <span className="sr-only">{progress}% 完了</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            進捗: {progress}%
          </div>
        </div>
      </div>

      {/* 意味的なマークアップデモ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">意味的なマークアップの比較</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">悪い例: 非意味的マークアップ</h4>
            <div className="p-4 bg-gray-50 rounded border">
              <div className="text-lg font-bold mb-2">製品情報</div>
              <div className="mb-1">
                <span className="font-semibold">名前:</span> 高性能ノートPC
              </div>
              <div className="mb-1">
                <span className="font-semibold">価格:</span> ¥150,000
              </div>
              <div className="text-blue-600 cursor-pointer hover:underline">
                詳細を見る
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">良い例: 意味的マークアップ</h4>
            <article className="p-4 bg-gray-50 rounded border">
              <h3 className="text-lg font-bold mb-2">製品情報</h3>
              <dl className="space-y-1">
                <div>
                  <dt className="font-semibold">名前:</dt>
                  <dd>高性能ノートPC</dd>
                </div>
                <div>
                  <dt className="font-semibold">価格:</dt>
                  <dd>¥150,000</dd>
                </div>
              </dl>
              <a
                href="#"
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                詳細を見る
              </a>
            </article>
          </div>
        </div>
      </div>

      {/* スキップリンクデモ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">スキップリンク</h3>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          メインコンテンツにスキップ
        </a>
        <div className="p-4 bg-gray-100 rounded">
          <p>ここにはナビゲーションリンクなどが配置されます...</p>
        </div>
        <div id="main-content" className="p-4 bg-white rounded border mt-4">
          <p>メインコンテンツがここから始まります。スクリーンリーダーユーザーはスキップリンクを使ってここに直接ジャンプできます。</p>
        </div>
      </div>
    </div>
  )
}
```

2. テストページの更新

`src/app/page.tsx`にScreenReaderDemoコンポーネントを追加します。

```tsx
import { AccessibleForm } from '@/components/ui/AccessibleForm'
import { FocusDemo } from '@/components/ui/FocusDemo'
import { ScreenReaderDemo } from '@/components/ui/ScreenReaderDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            アクセシビリティ実践テスト
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            v0で生成したコンポーネントのアクセシビリティ対応を確認するためのデモページです。
            スクリーンリーダーやキーボード操作で各コンポーネントをテストしてみてください。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">アクセシビリティ対応フォーム</h2>
            <AccessibleForm />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">フォーカスとキーボードナビゲーション</h2>
            <FocusDemo />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">スクリーンリーダー対応</h2>
            <ScreenReaderDemo />
          </div>
        </div>
      </div>
    </main>
  )
}
```

3. スクリーンリーダーテストの実行

```bash
npm run dev
```

ブラウザでページを開き、スクリーンリーダーを起動してテストします：

- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (Ctrl + Alt + N)

テスト項目：
- フォーム要素が正しく読み上げられるか
- 動的コンテンツの変更が通知されるか
- プログレスバーの進捗が適切に伝わるか
- スキップリンクが機能するか
- 意味的なマークアップと非意味的なマークアップの違いを比較

:::

## 🎨 色コントラストと視覚的アクセシビリティ

視覚的アクセシビリティは、色覚異常や低視力のユーザーにもコンテンツが見えるようにするための重要な要素です。

### コントラスト比の基準

WCAGでは、テキストと背景のコントラスト比について以下の基準を定めています：

- **レベルAA**: 通常テキスト 4.5:1、大きいテキスト 3:1
- **レベルAAA**: 通常テキスト 7:1、大きいテキスト 4.5:1

### 色だけに依存しない設計

```tsx
// 悪い例: 色だけで状態を示す
<div className={isActive ? 'text-green-600' : 'text-red-600'}>
  {isActive ? 'アクティブ' : '非アクティブ'}
</div>

// 良い例: 色 + アイコン + テキストで状態を示す
<div className="flex items-center gap-2">
  <div className={isActive ? 'text-green-600' : 'text-red-600'}>
    {isActive ? (
      <span className="flex items-center gap-1">
        <CheckIcon className="w-4 h-4" />
        アクティブ
      </span>
    ) : (
      <span className="flex items-center gap-1">
        <XIcon className="w-4 h-4" />
        非アクティブ
      </span>
    )}
  </div>
</div>
```

### 高コントラストモード対応

```tsx
// 高コントラストモード対応コンポーネント
export function HighContrastButton({ children, variant = 'primary' }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white border-blue-600 forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:border-[ButtonText]'
      case 'secondary':
        return 'bg-gray-200 text-gray-800 border-gray-300 forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:border-[ButtonText]'
      default:
        return ''
    }
  }

  return (
    <button
      className={`
        px-4 py-2 rounded-md font-medium border
        hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${getVariantStyles()}
      `}
    >
      {children}
    </button>
  )
}
```

### [色コントラスト]を動かして確認してみよう

色コントラストと視覚的アクセシビリティの実装を試してみましょう。

:::step

1. 色コントラストデモコンポーネントの作成

`src/components/ui/ColorContrastDemo.tsx`を作成します。

```tsx
'use client'

import { useState } from 'react'

// 簡易的なアイコンコンポーネント
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export function ColorContrastDemo() {
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [highContrastMode, setHighContrastMode] = useState(false)

  const themes = {
    default: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-500 text-black',
      error: 'bg-red-600 text-white',
      background: 'bg-white',
      text: 'text-gray-900'
    },
    dark: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-700 text-gray-200',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-600 text-black',
      error: 'bg-red-500 text-white',
      background: 'bg-gray-900',
      text: 'text-gray-100'
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]

  // コントラスト比を計算する簡易関数（実際の使用時は専用ライブラリを推奨）
  const calculateContrast = (color1: string, color2: string): number => {
    // 簡易的な計算（実際はもっと複雑な計算が必要）
    return 4.5 // サンプル値
  }

  return (
    <div className={`p-6 rounded-lg ${currentTheme.background} ${currentTheme.text}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">視覚的アクセシビリティデモ</h3>

        <div className="flex gap-4 mb-4">
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">ライトテーマ</option>
            <option value="dark">ダークテーマ</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={highContrastMode}
              onChange={(e) => setHighContrastMode(e.target.checked)}
              className="w-4 h-4"
            />
            高コントラストモード
          </label>
        </div>
      </div>

      {/* 色だけで状態を示す悪い例 */}
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">悪い例: 色だけで状態を示す</h4>
        <div className="grid grid-cols-2 gap-4 p-4 border rounded">
          <div className="p-3 bg-green-100 rounded">
            <span className="text-green-600">✓ 成功</span>
          </div>
          <div className="p-3 bg-red-100 rounded">
            <span className="text-red-600">✗ エラー</span>
          </div>
          <div className="p-3 bg-yellow-100 rounded">
            <span className="text-yellow-600">⚠ 警告</span>
          </div>
          <div className="p-3 bg-blue-100 rounded">
            <span className="text-blue-600">ℹ 情報</span>
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-600">
          色覚異常のあるユーザーは状態の違いを認識できません
        </p>
      </div>

      {/* 色以外も使う良い例 */}
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">良い例: 色 + アイコン + テキスト</h4>
        <div className="grid grid-cols-2 gap-4 p-4 border rounded">
          <div className="p-3 bg-green-100 rounded">
            <span className="flex items-center gap-2 text-green-700">
              <CheckIcon className="w-4 h-4" />
              <span className="font-medium">成功</span>
            </span>
          </div>
          <div className="p-3 bg-red-100 rounded">
            <span className="flex items-center gap-2 text-red-700">
              <XIcon className="w-4 h-4" />
              <span className="font-medium">エラー</span>
            </span>
          </div>
          <div className="p-3 bg-yellow-100 rounded">
            <span className="flex items-center gap-2 text-yellow-700">
              <span className="text-lg">⚠</span>
              <span className="font-medium">警告</span>
            </span>
          </div>
          <div className="p-3 bg-blue-100 rounded">
            <span className="flex items-center gap-2 text-blue-700">
              <span className="text-lg">ℹ</span>
              <span className="font-medium">情報</span>
            </span>
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-600">
          アイコンとテキストも併用することで、より多くのユーザーに状態が伝わります
        </p>
      </div>

      {/* コントラスト比のデモ */}
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">コントラスト比のデモ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>良い例 (5.3:1)</span>
              <span className="text-sm text-green-600">✓ AA合格</span>
            </div>
            <div className="p-4 bg-gray-900 text-white rounded">
              このテキストはコントラスト比が十分で読みやすいです
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>悪い例 (2.1:1)</span>
              <span className="text-sm text-red-600">✗ AA不合格</span>
            </div>
            <div className="p-4 bg-gray-300 text-gray-400 rounded">
              このテキストはコントラスト比が低く読みにくいです
            </div>
          </div>
        </div>
      </div>

      {/* リンクの識別性デモ */}
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">リンクの識別性</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-2">悪い例: 色だけのリンク</h5>
            <p className="p-4 border rounded">
              これは<a href="#" className="text-blue-600">リンクです</a>。色だけでリンクだと識別しにくい場合があります。
            </p>
          </div>

          <div>
            <h5 className="font-medium mb-2">良い例: 下線 + 色 + ホバー効果</h5>
            <p className="p-4 border rounded">
              これは<a href="#" className="text-blue-600 underline hover:text-blue-800 hover:underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">リンクです</a>。下線と色の組み合わせで識別しやすくなっています。
            </p>
          </div>
        </div>
      </div>

      {/* フォーム要素の視覚的フィードバック */}
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">フォーム要素の視覚的フィードバック</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名前</label>
            <input
              type="text"
              placeholder="名前を入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">メールアドレス</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <p className="text-sm text-red-600 mt-1">有効なメールアドレスを入力してください</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">メッセージ</label>
            <textarea
              placeholder="メッセージを入力"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">最大500文字</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

2. テストページの更新

`src/app/page.tsx`にColorContrastDemoコンポーネントを追加します。

```tsx
import { AccessibleForm } from '@/components/ui/AccessibleForm'
import { FocusDemo } from '@/components/ui/FocusDemo'
import { ScreenReaderDemo } from '@/components/ui/ScreenReaderDemo'
import { ColorContrastDemo } from '@/components/ui/ColorContrastDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            アクセシビリティ実践テスト
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            v0で生成したコンポーネントのアクセシビリティ対応を確認するためのデモページです。
            スクリーンリーダーやキーボード操作で各コンポーネントをテストしてみてください。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">アクセシビリティ対応フォーム</h2>
            <AccessibleForm />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">フォーカスとキーボードナビゲーション</h2>
            <FocusDemo />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">スクリーンリーダー対応</h2>
            <ScreenReaderDemo />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">色コントラストと視覚的アクセシビリティ</h2>
            <ColorContrastDemo />
          </div>
        </div>
      </div>
    </main>
  )
}
```

3. 動作確認とテスト

```bash
npm run dev
```

ブラウザでページを開き、以下のテストを実施します：

- **テーマ切り替え**: ライト/ダークテーマでの視認性を確認
- **高コントラストモード**: 設定から高コントラストモードを有効にして表示を確認
- **色覚フィルター**: 開発者ツールの色覚フィルター機能を使用して確認
- **コントラスト比**: 開発者ツールでコントラスト比を測定

:::

## 🔧 アクセシビリティテストと検証

アクセシビリティ対応を実装した後は、実際にテストを行い、すべてのユーザーが利用できることを確認する必要があります。

### 自動テストツール

```tsx
// jest-axeによる自動テストの例
import { axe, toHaveNoViolations } from 'jest-axe'
import { render, screen } from '@testing-library/react'
import { AccessibleButton } from './AccessibleButton'

expect.extend(toHaveNoViolations)

describe('AccessibleButton', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <AccessibleButton>Click me</AccessibleButton>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be accessible via keyboard', () => {
    const handleClick = jest.fn()
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)

    const button = screen.getByRole('button', { name: 'Click me' })
    button.focus()
    fireEvent.keyDown(button, { key: 'Enter' })

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 手動テストチェックリスト

```tsx
// アクセシビリティテストチェックリストコンポーネント
export function AccessibilityChecklist() {
  const checks = [
    {
      category: 'キーボードナビゲーション',
      items: [
        'Tabキーですべての対話要素にアクセスできる',
        'フォーカス順序が論理的である',
        'フォーカスインジケーターが視認できる',
        'Enter/Spaceキーでボタンを操作できる',
        'Escapeキーでモーダル/ドロワーを閉じられる'
      ]
    },
    {
      category: 'スクリーンリーダー',
      items: [
        'すべての対話要素に適切なロールがある',
        'ラベルと入力フィールドが関連付けられている',
        '状態の変化が適切に通知される',
        'エラーメッセージが読み上げられる',
        '代替テキストが適切に設定されている'
      ]
    },
    {
      category: '視覚的アクセシビリティ',
      items: [
        'テキストのコントラスト比が基準を満たしている',
        '色だけで情報を伝えていない',
        'フォーカスインジケーターが視認できる',
        '文字サイズが調整可能である',
        'レスポンシブデザインが機能している'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">アクセシビリティテストチェックリスト</h3>

      {checks.map((category) => (
        <div key={category.category} className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">{category.category}</h4>
          <ul className="space-y-2">
            {category.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`${category.category}-${index}`}
                  className="mt-1"
                />
                <label htmlFor={`${category.category}-${index}`} className="text-sm">
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

### [アクセシビリティテスト]を動かして確認してみよう

アクセシビリティテストの実践方法を学びましょう。

:::step

1. テストツールのインストール

プロジェクトにアクセシビリティテストツールをインストールします。

```bash
# ESLintのアクセシビリティプラグイン
npm install --save-dev eslint-plugin-jsx-a11y

# Jestとaxe-core
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-axe

# PlaywrightによるE2Eテスト
npm install --save-dev @playwright/test
```

2. ESLint設定の更新

`.eslintrc.json`にアクセシビリティルールを追加します。

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/interactive-supports-focus": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/no-autofocus": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/role-has-required-aria-props": "error"
  }
}
```

3. テストファイルの作成

`src/components/__tests__/Accessibility.test.tsx`を作成します。

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AccessibleButton } from '../ui/AccessibleButton'
import { AccessibleForm } from '../ui/AccessibleForm'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  describe('AccessibleButton', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <AccessibleButton>Click me</AccessibleButton>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn()
      render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)

      const button = screen.getByRole('button', { name: 'Click me' })

      // Tabキーでフォーカス
      button.focus()
      expect(button).toHaveFocus()

      // Enterキーでクリック
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)

      // Spaceキーでクリック
      fireEvent.keyDown(button, { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('should handle loading state correctly', () => {
      const { rerender } = render(
        <AccessibleButton isLoading={true}>Loading</AccessibleButton>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toBeDisabled()

      rerender(<AccessibleButton isLoading={false}>Ready</AccessibleButton>)
      expect(button).not.toHaveAttribute('aria-busy', 'true')
      expect(button).not.toBeDisabled()
    })
  })

  describe('AccessibleForm', () => {
    it('should have proper form labels and associations', () => {
      render(<AccessibleForm />)

      const nameInput = screen.getByLabelText('お名前')
      const emailInput = screen.getByLabelText('メールアドレス')
      const passwordInput = screen.getByLabelText('パスワード')

      expect(nameInput).toBeInTheDocument()
      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()

      expect(nameInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('required')
    })

    it('should show validation errors', async () => {
      render(<AccessibleForm />)

      const submitButton = screen.getByRole('button', { name: '送信' })
      fireEvent.click(submitButton)

      // エラーメッセージが表示されることを確認
      expect(await screen.findByText('お名前を入力してください')).toBeInTheDocument()
      expect(await screen.findByText('メールアドレスを入力してください')).toBeInTheDocument()
      expect(await screen.findByText('パスワードを入力してください')).toBeInTheDocument()
    })

    it('should have no accessibility violations', async () => {
      const { container } = render(<AccessibleForm />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
```

4. PlaywrightによるE2Eテスト

`tests/accessibility.spec.ts`を作成します。

```typescript
import { test, expect } from '@playwright/test'

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('keyboard navigation should work properly', async ({ page }) => {
    // Tabキーでナビゲート
    await page.keyboard.press('Tab')

    // フォームにフォーカスが当たるまでTabを押す
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    while (focusedElement !== 'INPUT') {
      await page.keyboard.press('Tab')
      focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    }

    // フォームに値を入力
    await page.keyboard.type('テストユーザー')

    // 次のフィールドに移動
    await page.keyboard.press('Tab')
    await page.keyboard.type('test@example.com')

    await page.keyboard.press('Tab')
    await page.keyboard.type('password123')

    // Enterで送信
    await page.keyboard.press('Enter')

    // フォームが送信されたことを確認
    await expect(page.locator('text=フォームが正常に送信されました！')).toBeVisible()
  })

  test('focus management should be visible', async ({ page }) => {
    // フォームにフォーカス
    await page.click('input[placeholder="フルネームで入力してください"]')

    // フォーカスインジケーターが表示されることを確認
    const input = page.locator('input[placeholder="フルネームで入力してください"]')
    await expect(input).toBeFocused()

    // CSSクラスの確認
    const hasFocusClass = await input.evaluate((el) => {
      return el.classList.contains('focus:ring-2')
    })
    expect(hasFocusClass).toBe(true)
  })

  test('should handle screen reader announcements', async ({ page }) => {
    // 通知を追加
    await page.click('text=情報更新通知')

    // ライブリージョンに通知が表示されることを確認
    await expect(page.locator('text=情報が更新されました')).toBeVisible()
  })

  test('color contrast should meet WCAG standards', async ({ page }) => {
    // コントラスト比のテスト（実際のプロジェクトでは専用ライブラリを使用）
    const textElement = page.locator('text=アクセシビリティ実践テスト')
    const backgroundColor = await textElement.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.backgroundColor
    })
    const textColor = await textElement.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.color
    })

    // 色が設定されていることを確認
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(textColor).not.toBe('rgba(0, 0, 0, 0)')
  })
})
```

5. テストの実行

```bash
# ESLintの実行
npm run lint

# Jestユニットテストの実行
npm test

# Playwright E2Eテストの実行
npx playwright test

# ブラウザでアクセシビリティインスペクタを確認
npm run dev
```

6. アクセシビリティ監査の実行

ブラウザの開発者ツールを使用してアクセシビリティ監査を実行します：

- **Chrome**: Lighthouseタブ → Accessibilityセクション
- **Firefox**: Accessibilityタブ
- **Edge**: Lighthouse拡張機能

:::

## 🎯 v0プロンプトのアクセシビリティ最適化

v0でアクセシブルなコンポーネントを生成するためのプロンプト設計のコツを学びます。

### アクセシビリティ対応のプロンプト例

```
アクセシブルなログインフォームを作成してください。

要件：
- ReactとTypeScriptで実装
- Tailwind CSSを使用
- 以下のアクセシビリティ機能を実装：
  * 各入力フィールドに適切なlabelと関連付け
  * バリデーションエラーをARIAで通知
  * キーボードナビゲーション対応
  * フォーカス管理の最適化
  * ローディング状態の表示

含める要素：
- メールアドレス入力（必須）
- パスワード入力（必須）
- 送信ボタン
- パスワード忘れリンク

デザイン要件：
- レスポンシブデザイン
- コントラスト比4.5:1以上
- フォーカスインジケーターの表示
- エラー状態の視覚的表示
```

### プロンプトの最適化ポイント

1. **明確なアクセシビリティ要件の指定**
2. **具体的なARIA属性の要求**
3. **キーボード操作の明示**
4. **視覚的アクセシビリティの考慮**
5. **テスト容易性の確保**

### [v0プロンプト最適化]を動かして確認してみよう

v0でアクセシブルなコンポーネントを生成するためのプロンプトを実践してみましょう。

:::step

1. アクセシビリティ対応プロンプトの作成

`prompts/accessible-components.md`ファイルを作成します。

```markdown
# アクセシブルなコンポーネント生成プロンプト

## 基本フォームコンポーネント

```
アクセシブルなユーザー登録フォームを作成してください。

要件：
- ReactとTypeScriptで実装
- Tailwind CSSを使用
- 以下のアクセシビリティ機能を実装：
  * 各入力フィールドに適切なlabelと関連付け（htmlForとid）
  * バリデーションエラーをaria-invalidとaria-describedbyで通知
  * 必須フィールドをaria-requiredで明示
  * キーボードナビゲーション完全対応（Tab, Shift+Tab, Enter, Escape）
  * focus-visibleによるフォーカスインジケーターの表示
  * ローディング状態をaria-busyで通知

含める要素：
- お名前（テキスト、必須）
- メールアドレス（email、必須）
- パスワード（password、必須、8文字以上）
- 電話番号（tel、任意）
- 送信ボタン（ローディング状態対応）
- キャンセルボタン

バリデーションルール：
- お名前：必須、2文字以上
- メールアドレス：必須、形式チェック
- パスワード：必須、8文字以上、大文字小文字数字を含む
- 電話番号：任意、形式チェック（半角数字とハイフンのみ）

デザイン要件：
- レスポンシブデザイン（モバイルファースト）
- コントラスト比4.5:1以上（AAレベル準拠）
- フォーカスインジケーター（青いアウトライン）
- エラー状態の視覚的表示（赤い枠とテキスト）
- 成功状態の視覚的表示（緑のチェックマーク）
```

## アクセシブルなモーダルコンポーネント

```
アクセシブルな確認ダイアログを作成してください。

要件：
- ReactとTypeScriptで実装
- Tailwind CSSを使用
- 以下のアクセシビリティ機能を実装：
  * role="dialog"とaria-modal="true"
  * 適切なフォーカストラップ（モーダル内で循環）
  * Escapeキーで閉じる機能
  * 背景クリックで閉じる機能
  * フォーカスがモーダル開閉時に適切に移動
  * aria-labelまたはaria-labelledbyによるタイトル設定

含める要素：
- タイトル
- メッセージ本文
- 確認ボタン（危険操作なので赤色）
- キャンセルボタン
- 閉じるボタン（Xアイコン）

動作要件：
- 開くとき：トリガーボタンにフォーカスが戻るように記憶
- 閉じるとき：元のフォーカス位置に戻る
- アニメーション：reduce-motion設定を尊重

使用例：
ユーザーが削除操作を行う際の確認ダイアログとして使用
```

## アクセシブルなナビゲーションコンポーネント

```
アクセシブルなレスポンシブナビゲーションを作成してください。

要件：
- ReactとTypeScriptで実装
- Tailwind CSSを使用
- 以下のアクセシビリティ機能を実装：
  * role="navigation"とaria-label
  * 現在のページをaria-current="page"で明示
  * モバイル用ハンバーガーメニュー（ボタンに適切なaria-label）
  * キーボード操作完全対応
  * スキップリンクの実装
  * ドロップダウンメニューの対応（展開/折りたたみ）

含める要素：
- ロゴ（ホームリンク）
- メインナビゲーションメニュー
- モバイル用メニューボタン
- ドロップダウンメニュー（少なくとも1つ）
- アクションボタン（ログイン/サインアップ）
- スキップリンク

レスポンシブ要件：
- デスクトップ：水平ナビゲーション
- タブレット：折りたたみメニュー
- モバイル：ハンバーガーメニュー
```

## アクセシブルなデータテーブルコンポーネント

```
アクセシブルなデータテーブルを作成してください。

要件：
- ReactとTypeScriptで実装
- Tailwind CSSを使用
- 以下のアクセシビリティ機能を実装：
  * 適切なtable構造（table, thead, tbody, th, td）
  * scope属性によるヘッダーセルの関連付け
  * captionによるテーブルの説明
  * ソート可能なカラム（aria-sort）
  * レスポンシブ対応（モバイルではカード表示）
  * キーボードナビゲーション対応

含める要素：
- テーブルキャプション
- ソート可能なヘッダー
- 行の選択機能（チェックボックス）
- ページネーション
- 検索機能
- 行のアクションボタン

データ構造：
- ユーザー一覧（ID、名前、メール、役割、ステータス、作成日）
- ソート機能：名前、メール、作成日
- フィルター機能：役割、ステータス
```

## アクセシブルなフォームコントロールコンポーネント

```
アクセシブルなカスタムフォームコントロールを作成してください。

要件：
- ReactとTypeScriptで実装
- Tailwind CSSを使用
- 以下のアクセシビリティ機能を実装：
  * カスタムチェックボックス（hidden input + visible label）
  * カスタムラジオボタン（hidden input + visible label）
  * カスタムセレクトボックス（button + listbox）
  * スイッチ（toggle button）
  * スライダー（range input）
  * すべてのコントロールに適切なroleとaria属性

含める要素：
- チェックボックスグループ（複数選択）
- ラジオボタングループ（単一選択）
- セレクトボックス（ドロップダウン）
- スイッチ（オン/オフ）
- スライダー（数値選択）
- ファイルアップロード

動作要件：
- すべてのコントロールがキーボード操作可能
- 視覚的状態がアクセシビリティAPIと同期
- フォーカス管理が適切
- エラー状態が適切に伝わる
```
```

2. プロンプト実践のためのテンプレート

`src/prompts/AccessibilityPromptTemplate.ts`を作成します。

```tsx
export interface AccessibilityPromptTemplate {
  componentType: 'form' | 'modal' | 'navigation' | 'table' | 'controls'
  title: string
  description: string
  requirements: string[]
  features: string[]
  designRequirements: string[]
  validationRules?: string[]
}

export const accessibilityPromptTemplates: Record<string, AccessibilityPromptTemplate> = {
  form: {
    componentType: 'form',
    title: 'アクセシブルなフォーム',
    description: 'ユーザー情報を入力するためのアクセシブルなフォームコンポーネント',
    requirements: [
      'ReactとTypeScriptで実装',
      'Tailwind CSSを使用',
      '適切なlabelと入力フィールドの関連付け',
      'バリデーションエラーをARIAで通知',
      'キーボードナビゲーション完全対応',
      'focus-visibleによるフォーカス表示',
      'ローディング状態をaria-busyで通知'
    ],
    features: [
      'お名前（テキスト、必須）',
      'メールアドレス（email、必須）',
      'パスワード（password、必須、8文字以上）',
      '送信ボタン（ローディング状態対応）',
      'リアルタイムバリデーション'
    ],
    designRequirements: [
      'レスポンシブデザイン（モバイルファースト）',
      'コントラスト比4.5:1以上',
      'フォーカスインジケーター',
      'エラー状態の視覚的表示',
      '成功状態の視覚的表示'
    ],
    validationRules: [
      'お名前：必須、2文字以上',
      'メールアドレス：必須、形式チェック',
      'パスワード：必須、8文字以上'
    ]
  },
  modal: {
    componentType: 'modal',
    title: 'アクセシブルなモーダル',
    description: '確認ダイアログとして使用するアクセシブルなモーダルコンポーネント',
    requirements: [
      'ReactとTypeScriptで実装',
      'Tailwind CSSを使用',
      'role="dialog"とaria-modal="true"',
      '適切なフォーカストラップ',
      'Escapeキーで閉じる機能',
      '背景クリックで閉じる機能',
      'フォーカスがモーダル開閉時に適切に移動'
    ],
    features: [
      'タイトル',
      'メッセージ本文',
      '確認ボタン',
      'キャンセルボタン',
      '閉じるボタン（Xアイコン）'
    ],
    designRequirements: [
      'オーバーレイによる背景の暗転',
      'フォーカスがモーダル内に閉じ込められる',
      'アニメーションはreduce-motionを尊重',
      'キーボード操作で全機能にアクセス可能'
    ]
  }
}

export function generateAccessibilityPrompt(templateKey: string): string {
  const template = accessibilityPromptTemplates[templateKey]
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`)
  }

  return `
${template.title}を作成してください。

要件：
${template.requirements.map(req => `- ${req}`).join('\n')}

含める要素：
${template.features.map(feature => `- ${feature}`).join('\n')}

${template.validationRules ? `
バリデーションルール：
${template.validationRules.map(rule => `- ${rule}`).join('\n')}
` : ''}

デザイン要件：
${template.designRequirements.map(req => `- ${req}`).join('\n')}

アクセシビリティ要件：
- WCAG 2.1 AAレベル準拠
- すべての対話要素がキーボード操作可能
- スクリーンリーダーで正しく読み上げ可能
- 色覚多様性を考慮したデザイン
- フォーカス管理が適切
  `.trim()
}
```

3. v0に送信するプロンプトの生成

`src/utils/generateV0Prompt.ts`を作成します。

```tsx
import { generateAccessibilityPrompt } from '../prompts/AccessibilityPromptTemplate'

export function createV0Prompt(componentType: string, customRequirements?: string[]): string {
  let prompt = generateAccessibilityPrompt(componentType)

  if (customRequirements && customRequirements.length > 0) {
    prompt += '\n\n追加要件：\n'
    prompt += customRequirements.map(req => `- ${req}`).join('\n')
  }

  // v0の最適化のための追加指示
  prompt += '\n\n実装上の注意点：\n'
  prompt += '- TypeScriptの型定義を明確に\n'
  prompt += '- 再利用可能なコンポーネント設計\n'
  prompt += '- パフォーマンスを考慮した実装\n'
  prompt += '- テスト容易性の確保\n'
  prompt += '- エラーハンドリングの実装\n'

  return prompt
}

// 使用例
export const formPrompt = createV0Prompt('form', [
  'GoogleとGitHubでのOAuthログイン機能',
  'パスワードの強度表示',
  'サインアップリンク'
])

export const modalPrompt = createV0Prompt('modal', [
  '削除確認の危険操作用スタイリング',
  'アニメーションのトランジション',
  'モーダル外クリックでの閉じる機能'
])
```

4. プロンプトのテストと検証

`src/utils/testPrompts.ts`を作成します。

```tsx
import { createV0Prompt } from './generateV0Prompt'

export function testPromptGeneration() {
  // フォームプロンプトのテスト
  const formPrompt = createV0Prompt('form')
  console.log('Form Prompt:')
  console.log(formPrompt)

  // モーダルプロンプトのテスト
  const modalPrompt = createV0Prompt('modal')
  console.log('\nModal Prompt:')
  console.log(modalPrompt)

  // カスタム要件付きプロンプトのテスト
  const customPrompt = createV0Prompt('form', [
    'リアルタイムバリデーション',
    'パスワードの表示/非表示切り替え',
    'フォーム送信の進捗表示'
  ])
  console.log('\nCustom Prompt:')
  console.log(customPrompt)

  // プロンプトの検証
  validatePrompt(formPrompt)
  validatePrompt(modalPrompt)
  validatePrompt(customPrompt)
}

function validatePrompt(prompt: string) {
  const requirements = [
    'ReactとTypeScript',
    'Tailwind CSS',
    'アクセシビリティ',
    'キーボード操作',
    'スクリーンリーダー',
    'フォーカス管理'
  ]

  requirements.forEach(req => {
    if (!prompt.includes(req)) {
      console.warn(`警告: プロンプトに '${req}' が含まれていません`)
    }
  })

  console.log('プロンプト検証完了')
}

// プロンプト生成の実行
if (require.main === module) {
  testPromptGeneration()
}
```

5. v0への実際のプロンプト送信

`src/utils/sendToV0.ts`を作成します。

```tsx
import { createV0Prompt } from './generateV0Prompt'

export async function sendToV0(prompt: string) {
  // ここでは実際のv0 APIとの連携を実装
  // 現時点ではプロンプトをコンソールに出力するだけ

  console.log('=== v0への送信プロンプト ===')
  console.log(prompt)
  console.log('==========================')

  // 実際の実装ではここでv0 APIを呼び出す
  // const response = await fetch('https://api.v0.dev/generate', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.V0_API_KEY}`
  //   },
  //   body: JSON.stringify({ prompt })
  // })
  // return response.json()

  return { success: true, message: 'プロンプトを準備しました' }
}

// 各コンポーネントタイプのプロンプトを生成
export async function generateAllPrompts() {
  const componentTypes = ['form', 'modal', 'navigation', 'table', 'controls']

  for (const type of componentTypes) {
    try {
      const prompt = createV0Prompt(type)
      const result = await sendToV0(prompt)
      console.log(`${type} プロンプト生成:`, result)
    } catch (error) {
      console.error(`${type} プロンプト生成エラー:`, error)
    }
  }
}
```

6. プロンプト生成の実行とテスト

```bash
# プロンプト生成のテスト
npx ts-node src/utils/testPrompts.ts

# v0へのプロンプト送信（デモ）
npx ts-node src/utils/sendToV0.ts
```

このようにして、v0にアクセシビリティ対応を考慮した最適なプロンプトを送信できます。生成されたコードは、アクセシビリティ対応が組み込まれた状態で出力されるため、後からの修正工数を大幅に削減できます。

:::

## まとめ

このセクションでは、v0で生成したコンポーネントのアクセシビリティ対応について実践的に学びました。ARIA属性、focus-visible、スクリーンリーダー対応、色コントラストなど、包括的なアクセシビリティ実装の技術を習得しました。

:::note 要点のまとめ

- **アクセシビリティの基礎**: WCAGの4原則（知覚可能、操作可能、理解可能、堅牢性）を理解
- **ARIA属性**: ロール、ステート、プロパティを適切に使用してスクリーンリーダー対応
- **キーボードナビゲーション**: Tab、矢印キー、Escapeなど完全なキーボード操作対応
- **focus-visible**: キーボードユーザーに適切なフォーカスインジケーターを提供
- **スクリーンリーダー**: 意味的なマークアップとライブリージョンで動的コンテンツに対応
- **視覚的アクセシビリティ**: コントラスト比、色覚多様性、視覚的フィードバックを考慮
- **テスト手法**: 自動テスト、手動テスト、E2Eテストを組み合わせて品質を保証
- **v0プロンプト最適化**: アクセシビリティ要件を明確に指定して高品質なコードを生成

:::

### 次のステップ

アクセシビリティ対応は一度実装して終わりではなく、継続的な改善とテストが必要です。次のステップとして、以下の取り組みをおすすめします：

1. **プロジェクトへの適用**: 既存のv0生成コンポーネントにアクセシビリティ機能を追加
2. **テストの自動化**: CI/CDパイプラインにアクセシビリティテストを組み込み
3. **チーム教育**: アクセシビリティの重要性と実装方法をチーム全体で学習
4. **ユーザーテスト**: 実際のアクセシビリティユーザーによるテストを実施
5. **継続的改善**: ユーザーフィードバックを基にアクセシビリティを向上

アクセシビリティ対応は、技術的な要件であると同時に、より多くのユーザーに価値を届けるための重要な設計思想です。v0とアクセシビリティのベストプラクティスを組み合わせることで、すべてのユーザーが利用できる高品質なWebアプリケーションを開発することができます。

## 関連リンク

- [WCAG 2.1 ガイドライン](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [axe-core ドキュメント](https://www.deque.com/axe/)
- [React アクセシビリティドキュメント](https://react.dev/learn/accessibility)
- [Tailwind CSS アクセシビリティガイド](https://tailwindcss.com/docs/accessibility)

## さらに深く学習したい方へ

このコンテンツは、v0とアクセシビリティ実践の基礎を学ぶための導入編です。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **v0アクセシビリティ専門コース**: 生成AIを活用したアクセシブルなUI開発の専門技術
- **WCAG 2.1認定アクセシビリティスペシャリスト**: 国際基準に準拠したアクセシビリティ専門知識
- **スクリーンリーダーテスト実践講座**: NVDA、VoiceOver、JAWSを使用した実践的テスト手法
- **包括的UIデザインコース**: アクセシビリティを考慮したUI/UXデザインの専門知識

詳細はお問い合わせください。