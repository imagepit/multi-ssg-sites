---
title: フォーム（react-hook-form + zod）
slug: forms-rhf-zod
parent: components
file_path: components/forms-rhf-zod.md
target_user: フロントエンド開発者、Reactエンジニア、Webアプリケーション開発者
goal: "react-hook-formとzodを使用した堅牢なフォーム実装方法を学び、v0で生成したフォームコンポーネントを実際のプロジェクトに統合する技術を習得する"
status: published
post_type: pages
seo_title: "フォーム実装ガイド | react-hook-form + zodで学ぶ堅牢なバリデーション"
seo_description: "react-hook-formとzodを使用したReactフォームの実装方法を学ぶ完全ガイド。v0で生成したフォームコンポーネントをプロジェクトに統合し、型安全なバリデーションを実装する技術を習得できます。"
seo_keywords: "react-hook-form, zod, Reactフォーム, バリデーション, TypeScript, フォーム実装, v0, shadcn/ui, フロントエンド開発"
handson_overview: "v0で生成したフォームデザインをreact-hook-formとzodで実装するハンズオン。基本的な入力フォームから複雑なバリデーションまで、実際のコードを書きながらフォーム開発のベストプラクティスを学びます。"
---

## はじめに

📝 Webアプリケーション開発において、フォームはユーザーとの対話における最も重要なコンポーネントの一つです。このセクションでは、react-hook-formとzodを使用した堅牢で型安全なフォーム実装方法を学びます。v0で生成したフォームデザインを、実際のプロジェクトに統合する技術を習得しましょう。

### このページで学べる事

このセクションでは、現代的なReactフォーム開発のベストプラクティスを学びます。

:::note

- react-hook-formの基本的な概念と利点
- zodによる型安全なバリデーションスキーマ設計
- shadcn/uiコンポーネントとの統合方法
- フォーム状態管理とエラーハンドリング
- アクセシビリティ対応のフォーム実装
- 複雑なフォームの実践的な実装パターン

:::

## 🎯 react-hook-formとzodの組み合わせの利点

Reactアプリケーションでフォームを実装する際、react-hook-formとzodの組み合わせは多くの利点を提供します。これらのライブラリを理解することで、より堅牢でメンテナンス性の高いフォームを構築できます。

### react-hook-formとは

react-hook-formは、Reactアプリケーション向けの高性能なフォームライブラリです。

:::note react-hook-formとは

React Hook Formは、パフォーマンスと開発者体験を重視して設計されたフォームライブラリです。制御されたコンポーネントと非制御コンポーネントの両方をサポートし、最小限の再レンダリングで高速な動作を実現します。

:::

#### react-hook-formの主要な特徴

- **高性能**: 最小限の再レンダリングによる優れたパフォーマンス
- **小さいバンドルサイズ**: gzipで約12KBと軽量
- **TypeScript対応**: 完全な型安全性を提供
- **柔軟性**: HTML標準のバリデーションとカスタムバリデーションの両方をサポート
- **簡単な統合**: UIライブラリや他のフォームソリューションとの簡単な統合

### zodとは

zodは、TypeScriptファーストのスキーマ宣言・バリデーションライブラリです。

:::note zodとは

Zodは、TypeScriptのためのスキーマ宣言およびバリデーションライブラリです。スキーマを定義するだけで、自動的に型推論が行われ、実行時のバリデーションとコンパイル時の型安全性を同時に提供します。

:::

#### zodの主要な特徴

- **型安全**: スキーマから自動的にTypeScript型を生成
- **強力なバリデーション**: 複雑なバリデーションルールを簡潔に記述可能
- **エラーメッセージのカスタマイズ**: ユーザーフレンドリーなエラーメッセージ
- **変換機能**: データの変換と検証を同時に実行可能
- **軽量**: 小さなバンドルサイズで依存関係が少ない

## 🔧 基本的なフォーム実装

それでは、実際にreact-hook-formとzodを使用した基本的なフォームを実装していきましょう。ここでは、ユーザー登録フォームを例に実装方法を学びます。

### プロジェクトのセットアップ

まずは、必要なライブラリをインストールします。

:::step

1. 必要なパッケージのインストール

任意の場所（デスクトップなど）で`form-practice`フォルダを作成し、そのフォルダで以下のコマンドを実行します：

```bash
npm install react-hook-form @hookform/resolvers zod
npm install @radix-ui/react-label @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
```

2. shadcn/uiの初期化

shadcn/uiをまだ導入していない場合は、初期化を行います：

```bash
npx shadcn-ui@latest init
```

3. 基本コンポーネントの追加

フォームに必要な基本コンポーネントを追加します：

```bash
npx shadcn-ui@latest add form input button label card
```

:::

### 基本的なフォームコンポーネントの実装

それでは、基本的なユーザー登録フォームを実装してみましょう。

:::step

1. フォームスキーマの定義

`src/components/auth`ディレクトリを作成し、`register-schema.ts`ファイルを作成します：

```typescript
// src/components/auth/register-schema.ts
import { z } from "zod"

export const registerSchema = z.object({
  name: z.string()
    .min(2, "名前は2文字以上で入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string()
    .email("有効なメールアドレスを入力してください"),
  password: z.string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/[A-Z]/, "パスワードには少なくとも1つの大文字を含めてください")
    .regex(/[a-z]/, "パスワードには少なくとも1つの小文字を含めてください")
    .regex(/[0-9]/, "パスワードには少なくとも1つの数字を含めてください"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean()
    .refine(val => val === true, "利用規約に同意する必要があります")
}).refine(data => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"]
})

export type RegisterFormData = z.infer<typeof registerSchema>
```

2. フォームコンポーネントの作成

`src/components/auth`ディレクトリに`register-form.tsx`ファイルを作成します：

```tsx
// src/components/auth/register-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "./register-schema"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      // ここでAPI呼び出しを行う
      console.log("送信データ:", data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模擬的なAPI呼び出し

      // 成功時の処理
      alert("登録が完了しました！")
      form.reset()
    } catch (error) {
      console.error("登録エラー:", error)
      alert("登録に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
        <CardDescription>
          アカウントを作成してサービスを利用開始してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>お名前</FormLabel>
                  <FormControl>
                    <Input placeholder="山田 太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    8文字以上で、大文字・小文字・数字を含めてください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード（確認）</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      利用規約に同意する
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "登録中..." : "アカウント作成"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

3. フォームの使用

ページコンポーネントでフォームを使用します：

```tsx
// src/app/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />
      </div>
    </div>
  )
}
```

:::

このように、react-hook-formとzodを組み合わせることで、型安全で堅牢なフォームを簡単に実装できます。エラーメッセージも自動的に表示され、ユーザー体験が向上します。

## 🎨 v0で生成したフォームとの統合

v0で生成したフォームデザインを、実際のreact-hook-formとzodの実装に統合する方法を学びましょう。

### v0プロンプトの設計

まず、v0で適切なフォームデザインを生成するためのプロンプトを設計します。

:::step

1. v0でのフォーム生成プロンプト

以下のプロンプトをv0に入力して、フォームデザインを生成します：

```text
ユーザー登録フォームを作成してください。以下のフィールドを含めて：
- お名前（テキスト入力）
- メールアドレス（メール入力）
- パスワード（パスワード入力）
- パスワード確認（パスワード入力）
- 利用規約同意（チェックボックス）
- 登録ボタン

デザイン要件：
- モダンでクリーンなデザイン
- エラーメッセージ表示領域
- レスポンシブ対応
- アクセシビリティ対応
- shadcn/uiスタイルを使用
```

2. v0生成コードの確認

v0から生成されたコードを確認し、必要な部分を抽出します。

:::

### v0生成コードの変換

v0で生成されたコードをreact-hook-formとzodを使用した実装に変換します。

:::step

1. 生成されたコンポーネントの変換

v0で生成されたフォームコンポーネントを、以下のように変換します：

```tsx
// v0生成コードの例（変換前）
export default function RegisterForm() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">ユーザー登録</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            お名前
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="山田 太郎"
          />
        </div>
        {/* その他のフィールド... */}
      </form>
    </div>
  )
}

// react-hook-form + zodに変換後
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const registerSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  // その他のスキーマ...
})

export function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      // その他のデフォルト値...
    },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>お名前</FormLabel>
                  <FormControl>
                    <Input placeholder="山田 太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* その他のフィールド... */}
            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

2. スタイリングの調整

v0で生成されたスタイルをshadcn/uiのクラスに変換します：

```tsx
// 変換例
// v0生成のクラス
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

// shadcn/uiのクラスに変換
className="w-full"
// Inputコンポーネントがスタイルを管理
```

:::

## 🏗️ 高度なフォームパターン

より複雑なフォーム要件に対応するための高度なパターンを学びましょう。

### 動的フォームの実装

フィールドが動的に追加・削除されるフォームを実装します。

:::step

1. 動的フィールド用スキーマの定義

```typescript
// src/components/forms/dynamic-schema.ts
import { z } from "zod"

const educationItemSchema = z.object({
  school: z.string().min(1, "学校名を入力してください"),
  degree: z.string().min(1, "学位を入力してください"),
  year: z.string().min(4, "卒業年を入力してください"),
})

export const profileSchema = z.object({
  name: z.string().min(2, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  education: z.array(educationItemSchema).min(1, "少なくとも1つの学歴を入力してください"),
  skills: z.array(z.string()).min(1, "少なくとも1つのスキルを選択してください"),
})

export type ProfileFormData = z.infer<typeof profileSchema>
```

2. 動的フォームコンポーネントの実装

```tsx
// src/components/forms/dynamic-form.tsx
"use client"

import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileFormData } from "./dynamic-schema"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

export function DynamicProfileForm() {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      education: [{ school: "", degree: "", year: "" }],
      skills: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  })

  const onSubmit = (data: ProfileFormData) => {
    console.log("送信データ:", data)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()]
      setSkills(updatedSkills)
      form.setValue("skills", updatedSkills)
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill)
    setSkills(updatedSkills)
    form.setValue("skills", updatedSkills)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>プロフィール編集</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お名前</FormLabel>
                    <FormControl>
                      <Input placeholder="山田 太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 学歴（動的フィールド） */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>学歴</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ school: "", degree: "", year: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  学歴を追加
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">学歴 {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`education.${index}.school`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>学校名</FormLabel>
                            <FormControl>
                              <Input placeholder="東京大学" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>学位</FormLabel>
                            <FormControl>
                              <Input placeholder="学士" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>卒業年</FormLabel>
                            <FormControl>
                              <Input placeholder="2020" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* スキル（タグ形式） */}
            <div className="space-y-4">
              <FormLabel>スキル</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="スキルを入力"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill}>
                  追加
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {skill}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>

              {form.formState.errors.skills && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.skills.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              保存
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

:::

### マルチステップフォームの実装

複数のステップに分割されたフォームを実装します。

:::step

1. マルチステップフォームの実装

```tsx
// src/components/forms/multi-step-form.tsx
"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// ステップ1のスキーマ
const step1Schema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "名前を入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    phone: z.string().min(10, "電話番号を入力してください"),
  }),
})

// ステップ2のスキーマ
const step2Schema = z.object({
  address: z.object({
    street: z.string().min(1, "住所を入力してください"),
    city: z.string().min(1, "市区町村を入力してください"),
    zipCode: z.string().min(7, "郵便番号を入力してください"),
  }),
})

// ステップ3のスキーマ
const step3Schema = z.object({
  preferences: z.object({
    interests: z.array(z.string()).min(1, "少なくとも1つの興味を選択してください"),
    newsletter: z.boolean(),
  }),
})

// 完全なスキーマ
const multiStepSchema = step1Schema.merge(step2Schema).merge(step3Schema)

export type MultiStepFormData = z.infer<typeof multiStepSchema>

const interests = [
  "技術", "デザイン", "マーケティング", "ビジネス",
  "教育", "ヘルスケア", "エンターテイメント", "その他"
]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const methods = useForm<MultiStepFormData>({
    resolver: zodResolver(multiStepSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
      },
      address: {
        street: "",
        city: "",
        zipCode: "",
      },
      preferences: {
        interests: [],
        newsletter: false,
      },
    },
  })

  const { handleSubmit, formState: { errors }, trigger } = methods

  const nextStep = async () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = await trigger("personalInfo")
        break
      case 2:
        isValid = await trigger("address")
        break
      case 3:
        isValid = await trigger("preferences")
        break
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const toggleInterest = (interest: string) => {
    const updatedInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest]

    setSelectedInterests(updatedInterests)
    methods.setValue("preferences.interests", updatedInterests)
  }

  const onSubmit = (data: MultiStepFormData) => {
    console.log("最終データ:", data)
    alert("登録が完了しました！")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">個人情報</h3>
            <FormField
              control={methods.control}
              name="personalInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>お名前</FormLabel>
                  <FormControl>
                    <Input placeholder="山田 太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="personalInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="personalInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電話番号</FormLabel>
                  <FormControl>
                    <Input placeholder="090-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">住所情報</h3>
            <FormField
              control={methods.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>番地</FormLabel>
                  <FormControl>
                    <Input placeholder="1-2-3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>市区町村</FormLabel>
                  <FormControl>
                    <Input placeholder="渋谷区" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>郵便番号</FormLabel>
                  <FormControl>
                    <Input placeholder="150-0002" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">興味・関心</h3>
            <div>
              <FormLabel>興味のある分野（複数選択可）</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              {errors.preferences?.interests && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.preferences.interests.message}
                </p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>会員登録（{currentStep}/3）</CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  戻る
                </Button>
              )}

              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  次へ
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  登録完了
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
```

:::

## ♿ アクセシビリティ対応のフォーム実装

アクセシビリティを考慮したフォーム実装は、すべてのユーザーが使いやすいアプリケーションを作成するために重要です。

### アクセシビリティの基本原則

フォームのアクセシビリティを確保するための基本的な原則を学びましょう。

:::note フォームアクセシビリティとは

フォームアクセシビリティとは、障害のあるユーザーを含むすべてのユーザーが、支援技術（スクリーンリーダーなど）を使用してフォームを操作できるようにすることです。適切なラベリング、キーボード操作、エラー通知などが重要です。

:::

### アクセシブルなフォーム実装

:::step

1. アクセシブルなフォームコンポーネントの実装

```tsx
// src/components/forms/accessible-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().optional(),
  subject: z.string().min(1, "件名を選択してください"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
  contactMethod: z.array(z.string()).min(1, "連絡方法を少なくとも1つ選択してください"),
  agreeToPrivacy: z.boolean().refine(val => val === true, "プライバシーポリシーに同意する必要があります"),
})

export type ContactFormData = z.infer<typeof contactSchema>

const contactSubjects = [
  { value: "general", label: "一般お問い合わせ" },
  { value: "support", label: "技術サポート" },
  { value: "sales", label: "営業に関するお問い合わせ" },
  { value: "feedback", label: "フィードバック" },
]

const contactMethods = [
  { value: "email", label: "メール" },
  { value: "phone", label: "電話" },
  { value: "post", label: "郵送" },
]

export function AccessibleContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      contactMethod: [],
      agreeToPrivacy: false,
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // API呼び出しの模擬
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log("送信データ:", data)
      setSubmitStatus("success")
      form.reset()
    } catch (error) {
      console.error("送信エラー:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>お問い合わせフォーム</CardTitle>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <Alert className="mb-6" role="alert" aria-live="polite">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              お問い合わせありがとうございます。内容を確認の上、尽快ご連絡いたします。
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert variant="destructive" className="mb-6" role="alert" aria-live="polite">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              送信に失敗しました。時間をおいて再度お試しください。
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* 基本情報セクション */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-medium">基本情報</legend>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">お名前 *</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="山田 太郎"
                        aria-describedby="name-error"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="name-error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">メールアドレス *</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        aria-describedby="email-error"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="email-error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">電話番号（任意）</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        placeholder="090-1234-5678"
                        aria-describedby="phone-error"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="phone-error" />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* お問い合わせ内容セクション */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-medium">お問い合わせ内容</legend>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="subject">件名 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger aria-describedby="subject-error">
                          <SelectValue placeholder="件名を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactSubjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage id="subject-error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="message">メッセージ *</FormLabel>
                    <FormControl>
                      <Textarea
                        id="message"
                        placeholder="お問い合わせ内容を詳しくご記入ください"
                        rows={5}
                        aria-describedby="message-error"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="message-error" />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* 連絡方法セクション */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-medium">連絡方法 *</legend>

              <FormField
                control={form.control}
                name="contactMethod"
                render={() => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel>ご希望の連絡方法（複数選択可）</FormLabel>
                      {contactMethods.map((method) => (
                        <FormField
                          key={method.value}
                          control={form.control}
                          name="contactMethod"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={method.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    id={method.value}
                                    checked={field.value?.includes(method.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, method.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== method.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel htmlFor={method.value} className="font-normal">
                                  {method.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* プライバシーポリシー */}
            <FormField
              control={form.control}
              name="agreeToPrivacy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="privacy"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="privacy-error"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="privacy" className="font-normal">
                      プライバシーポリシーに同意する *
                    </FormLabel>
                  </div>
                  <FormMessage id="privacy-error" />
                </FormItem>
              )}
            />

            {/* 送信ボタン */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

:::

### アクセシビリティのベストプラクティス

フォームのアクセシビリティを向上させるための重要なポイントをまとめます。

:::note アクセシビリティベストプラクティス

- **適切なラベリング**: すべてのフォーム要素に対応するラベルを提供
- **キーボード操作**: タブキーでのナビゲーションと Enter/Space キーでの操作
- **ARIA属性**: 適切なARIA属性を使用してスクリーンリーダーに情報を伝達
- **エラー通知**: エラーメッセージを視覚的にもプログラム的にも伝達
- **ライブリージョン**: 動的なコンテンツ変更をスクリーンリーダーに通知
- **十分なコントラスト**: テキストと背景の間に十分な色のコントラストを確保
- **フォーカス管理**: フォーカスの可視化と適切なフォーカス移動

:::

## 🚀 パフォーマンス最適化

フォームのパフォーマンスを最適化するためのテクニックを学びましょう。

### react-hook-formのパフォーマンス最適化

:::step

1. 最適化されたフォームコンポーネントの実装

```tsx
// src/components/forms/optimized-form.tsx
"use client"

import { memo, useCallback } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// スキーマ定義
const formSchema = z.object({
  personal: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
  items: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1),
  notes: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>

// 個別の入力フィールドコンポーネント（メモ化）
const FormInput = memo(({
  label,
  placeholder,
  ...props
}: {
  label: string
  placeholder: string
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
})

FormInput.displayName = "FormInput"

// アイテム行コンポーネント（メモ化）
const ItemRow = memo(({
  index,
  onRemove,
  totalItems
}: {
  index: number
  onRemove: (index: number) => void
  totalItems: number
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
      <div className="col-span-4">
        <FormInput
          label="商品名"
          placeholder="商品名"
          name={`items.${index}.name`}
        />
      </div>
      <div className="col-span-2">
        <FormInput
          label="数量"
          placeholder="1"
          type="number"
          name={`items.${index}.quantity`}
        />
      </div>
      <div className="col-span-3">
        <FormInput
          label="価格"
          placeholder="1000"
          type="number"
          name={`items.${index}.price`}
        />
      </div>
      <div className="col-span-3 flex items-end">
        {totalItems > 1 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(index)}
          >
            削除
          </Button>
        )}
      </div>
    </div>
  )
})

ItemRow.displayName = "ItemRow"

// 合計金額コンポーネント（メモ化）
const TotalAmount = memo(({ items }: { items: Array<{ quantity: number; price: number }> }) => {
  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return (
    <div className="text-right">
      <p className="text-lg font-semibold">
        合計金額: ¥{total.toLocaleString()}
      </p>
    </div>
  )
})

TotalAmount.displayName = "TotalAmount"

// メインのフォームコンポーネント
export function OptimizedForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal: {
        name: "",
        email: "",
      },
      items: [
        { id: crypto.randomUUID(), name: "", quantity: 1, price: 0 }
      ],
      notes: "",
    },
    mode: "onBlur", // onBlurでバリデーションを実行
    reValidateMode: "onChange", // 変更時に再バリデーション
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "id", // カスタムキーを使用
  })

  // フォームの監視（合計金額計算用）
  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  })

  // メモ化されたコールバック
  const handleAddItem = useCallback(() => {
    append({
      id: crypto.randomUUID(),
      name: "",
      quantity: 1,
      price: 0,
    })
  }, [append])

  const handleRemoveItem = useCallback((index: number) => {
    remove(index)
  }, [remove])

  const onSubmit = useCallback((data: FormSchema) => {
    console.log("送信データ:", data)
    alert("送信が完了しました！")
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>最適化された注文フォーム</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 個人情報セクション */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">個人情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personal.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>お名前</FormLabel>
                      <FormControl>
                        <Input placeholder="山田 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personal.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 注文アイテムセクション */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">注文アイテム</h3>
                <Button type="button" onClick={handleAddItem}>
                  アイテムを追加
                </Button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <ItemRow
                    key={field.id}
                    index={index}
                    onRemove={handleRemoveItem}
                    totalItems={fields.length}
                  />
                ))}
              </div>
            </div>

            {/* 合計金額 */}
            <TotalAmount items={watchedItems} />

            {/* 備考 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考（任意）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ご要望があればご記入ください"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 送信ボタン */}
            <Button type="submit" className="w-full">
              注文を確定する
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

2. パフォーマンス最適化のポイント

```typescript
// 最適化のための重要なポイント

// 1. 適切なモード設定
const form = useForm({
  mode: "onBlur", // バリデーションのタイミングを制御
  reValidateMode: "onChange", // 再バリデーションのタイミング
  criteriaMode: "firstError", // 最初のエラーのみ表示
  shouldFocusError: true, // エラー時にフォーカスを移動
})

// 2. コンポーネントのメモ化
const ExpensiveComponent = memo(({ data }) => {
  // 高価なレンダリング処理
  return <div>{data}</div>
})

// 3. コールバックのメモ化
const handleSubmit = useCallback((data) => {
  // 送信処理
}, [])

// 4. useWatchの適切な使用
const watchedValue = useWatch({
  control: form.control,
  name: "specificField", // 必要なフィールドのみ監視
})

// 5. 条件付きレンダリングの最適化
const shouldShowAdvanced = form.watch("enableAdvanced")
return shouldShowAdvanced ? <AdvancedForm /> : null
```

:::

## 📋 ベストプラクティスとよくある問題

フォーム開発におけるベストプラクティスと、よくある問題の解決方法を学びましょう。

### フォーム設計のベストプラクティス

:::note フォーム設計ベストプラクティス

- **シンプルさ**: ユーザーが混乱しないように必要最小限のフィールドのみを要求
- **明確なラベリング**: すべてのフィールドに分かりやすいラベルとプレースホルダーを提供
- **適切な入力タイプ**: email、tel、numberなどの適切なinputタイプを使用
- **リアルタイムバリデーション**: ユーザーが入力中にフィードバックを提供
- **プログレッシブエンハンスメント**: JavaScriptが無効でも基本的な機能を提供
- **モバイルファースト**: 小さな画面でも使いやすいデザインを考慮
- **エラーメッセージの明確化**: 何が問題で、どう修正すれば良いかを具体的に説明

:::

### よくある問題と解決方法

:::step

1. パフォーマンスの問題と解決

```typescript
// 問題1: 大きなフォームの再レンダリング
// 解決: 適切なモード設定とコンポーネント分割

// 悪い例
const BigForm = () => {
  const form = useForm({ mode: "onChange" }) // 頻繁な再レンダリング
  return (
    <form>
      {/* 多くのフィールド */}
    </form>
  )
}

// 良い例
const OptimizedBigForm = () => {
  const form = useForm({ mode: "onBlur" }) // 適切なタイミングでバリデーション

  return (
    <form>
      <PersonalSection form={form} />
      <AddressSection form={form} />
      <PaymentSection form={form} />
    </form>
  )
}

// 個別のセクションコンポーネント
const PersonalSection = memo(({ form }) => {
  return (
    <div>
      {/* 個人情報フィールド */}
    </div>
  )
})
```

2. 複雑なバリデーションの問題

```typescript
// 問題2: 複雑な相互依存バリデーション
// 解決: カスタムバリデーションと条件付きスキーマ

const complexSchema = z.object({
  hasDiscount: z.boolean(),
  discountCode: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.hasDiscount && !data.discountCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "割引コードを入力してください",
      path: ["discountCode"],
    })
  }
})

// 条件付きバリデーションの実装
const conditionalSchema = z.object({
  paymentMethod: z.enum(["credit_card", "bank_transfer"]),
  creditCardNumber: z.string().optional(),
  bankAccount: z.string().optional(),
}).refine(data => {
  if (data.paymentMethod === "credit_card") {
    return !!data.creditCardNumber
  }
  return true
}, {
  message: "クレジットカード番号を入力してください",
  path: ["creditCardNumber"],
})
```

3. フォームのリセット問題

```typescript
// 問題3: フォームのリセットと初期値
// 解決: 適切なリセット方法

const FormWithReset = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
  })

  const form = useForm({
    defaultValues: initialValues,
  })

  const handleReset = useCallback(() => {
    form.reset(initialValues) // 初期値にリセット
  }, [form, initialValues])

  const handleUpdateInitialValues = useCallback(() => {
    const newValues = { name: "新しい名前", email: "new@email.com" }
    setInitialValues(newValues)
    form.reset(newValues) // 新しい初期値でリセット
  }, [form])

  return (
    <form>
      {/* フォームフィールド */}
      <button type="button" onClick={handleReset}>
        リセット
      </button>
    </form>
  )
}
```

:::

### デバッグとテスト

:::step

1. フォームのデバッグ方法

```typescript
// デバッグ用のフォーム実装
const DebugForm = () => {
  const form = useForm({
    mode: "all", // すべてのモードでバリデーション
    defaultValues: {
      name: "",
      email: "",
    },
  })

  // フォーム状態の監視
  const watchedValues = useWatch({
    control: form.control,
  })

  // エラー状態の監視
  const errors = form.formState.errors

  // デバッグ情報の表示
  console.log("フォーム状態:", {
    values: watchedValues,
    errors: errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    touchedFields: form.formState.touchedFields,
  })

  return (
    <form onSubmit={form.handleSubmit(data => {
      console.log("送信データ:", data)
    })}>
      {/* フォームフィールド */}
      <div className="debug-info">
        <pre>{JSON.stringify({ watchedValues, errors }, null, 2)}</pre>
      </div>
    </form>
  )
}
```

2. フォームのテスト方法

```typescript
// テスト用のユーティリティ関数
export const testFormSubmission = async (form: any, testData: any) => {
  // テストデータの設定
  Object.entries(testData).forEach(([key, value]) => {
    form.setValue(key, value)
  })

  // バリデーションの実行
  const isValid = await form.trigger()

  if (isValid) {
    const handleSubmit = form.handleSubmit((data) => data)
    return await handleSubmit()
  } else {
    return form.formState.errors
  }
}

// 使用例
const testData = {
  name: "テストユーザー",
  email: "test@example.com",
  password: "password123",
}

const result = await testFormSubmission(form, testData)
```

:::

## まとめ

このセクションでは、react-hook-formとzodを使用した堅牢なフォーム実装について学びました。基本的なフォームから高度なパターンまで、実践的なスキルを習得できたことでしょう。

:::note 要点のまとめ

- **react-hook-form**は高性能でTypeScript対応のフォームライブラリ
- **zod**は型安全なバリデーションとスキーマ定義を提供
- **shadcn/ui**との統合により、アクセシブルなUIコンポーネントを簡単に実装可能
- **動的フォーム**や**マルチステップフォーム**などの高度なパターンを実装可能
- **アクセシビリティ**対応はすべてのユーザーにとって重要
- **パフォーマンス最適化**により、大規模なフォームでも快適に動作
- **ベストプラクティス**に従うことで、メンテナンス性の高いコードを実現

:::

## 関連リンク

- [react-hook-form公式ドキュメント](https://react-hook-form.com/)
- [zod公式ドキュメント](https://zod.dev/)
- [shadcn/uiフォームコンポーネント](https://ui.shadcn.com/docs/components/form)
- [Reactフォームベストプラクティス](https://react.dev/learn/manipulating-the-dom-with-forms)
- [Webアクセシビリティinitiative(WAI)フォームガイド](https://www.w3.org/WAI/ARIA/apg/patterns/form/)

## さらに深く学習したい方へ

このコンテンツは、Reactフォーム開発の基礎を学ぶための包括的なガイドです。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **Reactフォームマスターコース**: エンタープライズ向けの複雑なフォーム開発技術
- **アクセシビリティ実践講座**: 包括的UI開発の専門知識
- **パフォーマンス最適化コース**: 高速なReactアプリケーション開発
- **テスト駆動開発コース**: フォームの品質保証と自動テスト

詳細はお問い合わせください。