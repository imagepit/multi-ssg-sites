---
title: 国際化/i18n/RTL対応 | Next.jsアプリ開発実践ガイド
slug: i18n-rtl
parent: "app-assembly"
file_path: app-assembly/i18n-rtl
target_user: "経験2年以内のフロントエンドエンジニア"
goal: "Next.jsアプリケーションにおける国際化（i18n）とRTL（右から左）言語対応の実装方法を習得する"
status: publish
post_type: pages
seo_title: Next.js国際化完全ガイド | 多言語対応とRTLサポートの実装方法
seo_description: Next.jsアプリケーションでの国際化対応からRTL言語サポートまで。多言語対応、ローカライゼーション、アクセシビリティを含む実践的な実装方法を学びます。
seo_keywords: "Next.js, 国際化, i18n, RTL, 多言語対応, ローカライゼーション, アクセシビリティ, グローバル対応"
handson_overview: "Todoアプリを多言語対応させ、RTL言語サポートを実装するハンズオン。国際化のベストプラクティスを学びます"
---

## 🌍 はじめに

国際化（i18n）は、グローバルなユーザーに対応するための重要な機能です。このセクションでは、Next.jsアプリケーションにおける多言語対応、ローカライゼーション、RTL言語サポートの実装方法を学びます。

### このページで学べる事

:::note このページで学べること

- **Next.js i18n**の基本設定とルーティング
- **多言語対応**のための翻訳管理
- **RTL（Right-to-Left）**言語の実装方法
- **日付・数値・通貨**のローカライゼーション
- **動的コンテンツ**の国際化対応
- **アクセシビリティ**と国際化のベストプラクティス

:::

## 🎯 国際化の基本概念

### 国際化 vs ローカライゼーション

:::note 国際化の基本用語

- **国際化（i18n）**：アプリケーションを多言語・多文化対応可能にする設計
- **ローカライゼーション（L10n）**：特定の言語・地域に合わせた翻訳・適応
- **RTL（Right-to-Left）**：アラビア語、ヘブライ語などの右から左に書く言語
- **ロケール**：言語と地域の組み合わせ（例: ja-JP, en-US, ar-SA）

:::

### Next.jsにおける国際化アプローチ

Next.jsでは、以下の国際化戦略が利用可能です：

1. **静的サイト生成（SSG）**：ビルド時に各言語のページを生成
2. **サーバーサイドレンダリング（SSR）**：リクエスト時に言語を判定
3. **クライアントサイド**：ブラウザの言語設定を使用
4. **ハイブリッド**：静的 + 動的の組み合わせ

## 🛠️ Next.js i18nの設定

### 依存関係のインストール

```bash
npm install next-intl
```

### 基本設定

```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // その他の設定
};

module.exports = withNextIntl(nextConfig);
```

### メッセージファイルの構成

```typescript
// messages/ja.json
{
  "common": {
    "save": "保存",
    "cancel": "キャンセル",
    "delete": "削除",
    "edit": "編集",
    "loading": "読み込み中...",
    "error": "エラーが発生しました"
  },
  "todo": {
    "title": "Todo管理",
    "addTodo": "新しいTodoを追加",
    "searchPlaceholder": "Todoを検索...",
    "filters": {
      "status": "ステータス",
      "priority": "優先度",
      "sortBy": "並び替え",
      "all": "すべて",
      "pending": "未完了",
      "completed": "完了",
      "low": "低",
      "medium": "中",
      "high": "高"
    },
    "form": {
      "title": "タイトル",
      "titleRequired": "タイトルは必須です",
      "description": "説明",
      "priority": "優先度",
      "dueDate": "期限日",
      "addButton": "Todoを追加",
      "editButton": "更新",
      "saveButton": "保存"
    },
    "stats": {
      "total": "合計",
      "completed": "完了",
      "pending": "未完了",
      "overdue": "期限切れ"
    }
  }
}
```

```typescript
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "todo": {
    "title": "Todo Management",
    "addTodo": "Add New Todo",
    "searchPlaceholder": "Search todos...",
    "filters": {
      "status": "Status",
      "priority": "Priority",
      "sortBy": "Sort By",
      "all": "All",
      "pending": "Pending",
      "completed": "Completed",
      "low": "Low",
      "medium": "Medium",
      "high": "High"
    },
    "form": {
      "title": "Title",
      "titleRequired": "Title is required",
      "description": "Description",
      "priority": "Priority",
      "dueDate": "Due Date",
      "addButton": "Add Todo",
      "editButton": "Update",
      "saveButton": "Save"
    },
    "stats": {
      "total": "Total",
      "completed": "Completed",
      "pending": "Pending",
      "overdue": "Overdue"
    }
  }
}
```

```typescript
// messages/ar.json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "loading": "جاري التحميل...",
    "error": "حدث خطأ"
  },
  "todo": {
    "title": "إدارة المهام",
    "addTodo": "إضافة مهمة جديدة",
    "searchPlaceholder": "البحث في المهام...",
    "filters": {
      "status": "الحالة",
      "priority": "الأولوية",
      "sortBy": "الترتيب حسب",
      "all": "الكل",
      "pending": "معلقة",
      "completed": "مكتملة",
      "low": "منخفضة",
      "medium": "متوسطة",
      "high": "عالية"
    },
    "form": {
      "title": "العنوان",
      "titleRequired": "العنوان مطلوب",
      "description": "الوصف",
      "priority": "الأولوية",
      "dueDate": "تاريخ الاستحقاق",
      "addButton": "إضافة مهمة",
      "editButton": "تحديث",
      "saveButton": "حفظ"
    },
    "stats": {
      "total": "المجموع",
      "completed": "مكتمل",
      "pending": "معلق",
      "overdue": "متأخر"
    }
  }
}
```

### i18n設定ファイル

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ja', 'ar'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

## 🌐 ルーティング設定

### ミドルウェアの設定

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ja', 'ar'],
  defaultLocale: 'ja',
  localePrefix: 'as-needed' // 'always' | 'as-needed' | 'never'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### ロケールプロバイダーの設定

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { dir } from 'i18next';

const locales = ['en', 'ja', 'ar'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## 🎨 翻訳の利用方法

### 基本的な翻訳の使用

```typescript
// src/components/ui/TranslatedText.tsx
'use client';

import { useTranslations } from 'next-intl';

interface TranslatedTextProps {
  translationKey: string;
  values?: Record<string, string | number>;
}

export default function TranslatedText({
  translationKey,
  values
}: TranslatedTextProps) {
  const t = useTranslations();

  return (
    <span>
      {values ? t(translationKey, values) : t(translationKey)}
    </span>
  );
}
```

### フォームコンポーネントの国際化

```typescript
// src/components/forms/IntlTodoForm.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

interface IntlTodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>;
  initialData?: Partial<TodoFormData>;
}

type TodoFormData = z.infer<typeof todoSchema>;

export default function IntlTodoForm({
  onSubmit,
  initialData
}: IntlTodoFormProps) {
  const t = useTranslations('todo.form');
  const commonT = useTranslations('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todoSchema = z.object({
    title: z.string()
      .min(1, t('titleRequired'))
      .max(100),
    description: z.string()
      .max(500)
      .optional(),
    priority: z.enum(['low', 'medium', 'high'], {
      required_error: t('priorityRequired')
    }),
    dueDate: z.string()
      .optional()
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      dueDate: initialData?.dueDate || ''
    },
    mode: 'onChange'
  });

  const priorityOptions = [
    { value: 'low', label: t('priorityLow') },
    { value: 'medium', label: t('priorityMedium') },
    { value: 'high', label: t('priorityHigh') }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* タイトル入力 */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('title')} *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('titlePlaceholder')}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* 説明入力 */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('description')}
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('descriptionPlaceholder')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* 優先度選択 */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('priority')} *
        </label>
        <select
          {...register('priority')}
          id="priority"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.priority ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">{t('selectPriority')}</option>
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
      </div>

      {/* 期限日入力 */}
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('dueDate')}
        </label>
        <input
          {...register('dueDate')}
          type="date"
          id="dueDate"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.dueDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      {/* ボタン群 */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
            !isValid || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? commonT('loading') : t('addButton')}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          {commonT('cancel')}
        </button>
      </div>
    </form>
  );
}
```

## 🔄 RTL対応の実装

### CSSでのRTL対応

```typescript
// src/styles/rtl.css
/* RTL対応のための共通スタイル */

[dir="rtl"] {
  /* テキストの方向性 */
  text-align: right;

  /* マージンの反転 */
  .ml-4 {
    margin-left: 0;
    margin-right: 1rem;
  }

  .mr-4 {
    margin-right: 0;
    margin-left: 1rem;
  }

  /* パディングの反転 */
  .pl-4 {
    padding-left: 0;
    padding-right: 1rem;
  }

  .pr-4 {
    padding-right: 0;
    padding-left: 1rem;
  }

  /* フレックスボックスの反転 */
  .flex-row-reverse {
    flex-direction: row-reverse;
  }

  /* ボーダーの反転 */
  .border-l-4 {
    border-left: none;
    border-right: 4px solid;
  }

  .border-r-4 {
    border-right: none;
    border-left: 4px solid;
  }

  /* 位置指定の反転 */
  .left-0 {
    left: auto;
    right: 0;
  }

  .right-0 {
    right: auto;
    left: 0;
  }
}

/* RTL対応のユーティリティクラス */
.rtl-aware {
  position: relative;
}

.rtl-aware::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}
```

### RTL対応コンポーネント

```typescript
// src/components/ui/RTLNavigation.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';

interface RTLNavigationProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export default function RTLNavigation({
  currentLocale,
  onLocaleChange
}: RTLNavigationProps) {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);

  const locales = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ja', name: '日本語', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' }
  ];

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('todos'), href: '/todos' },
    { name: t('about'), href: '/about' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b" dir="auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Todo App
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 言語切り替え */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={currentLocale}
                onChange={(e) => onLocaleChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locales.map((locale) => (
                  <option key={locale.code} value={locale.code}>
                    {locale.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Globe className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* モバイルメニューボタン */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

### RTL対応のTodoカード

```typescript
// src/components/ui/RTLAwareTodoCard.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Todo } from '@/types';
import { useState } from 'react';

interface RTLAwareTodoCardProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export default function RTLAwareTodoCard({
  todo,
  onUpdate,
  onDelete
}: RTLAwareTodoCardProps) {
  const t = useTranslations('todo');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: Todo['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority];
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 rtl:space-x-reverse">
          <input
            type="checkbox"
            checked={todo.status === 'completed'}
            onChange={(e) => onUpdate(todo.id, {
              status: e.target.checked ? 'completed' : 'pending'
            })}
            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />

          <div className="flex-1">
            <h3 className={`font-medium ${
              todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>

            {todo.description && (
              <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
            )}

            <div className="flex items-center space-x-3 mt-3 rtl:space-x-reverse">
              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                {t(`filters.priority.${todo.priority}`)}
              </span>

              {todo.dueDate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-600 hover:text-red-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">
                {t('createdAt')}:
              </span>
              <span className="ml-2 rtl:mr-2 rtl:ml-0 text-gray-600">
                {new Date(todo.createdAt).toLocaleString()}
              </span>
            </div>
            {todo.dueDate && (
              <div>
                <span className="font-medium text-gray-700">
                  {t('dueDate')}:
                </span>
                <span className="ml-2 rtl:mr-2 rtl:ml-0 text-gray-600">
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 📅 日付・数値のローカライゼーション

### 書式設定ユーティリティ

```typescript
// src/lib/formatters.ts
import { useLocale } from 'next-intl';

export function useFormattedDate() {
  const locale = useLocale();

  return {
    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
      }).format(dateObj);
    },

    formatDateTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options
      }).format(dateObj);
    },

    formatRelativeTime: (date: Date | string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();

      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      if (diff < 60000) { // 1分以内
        return rtf.format(-Math.floor(diff / 1000), 'second');
      } else if (diff < 3600000) { // 1時間以内
        return rtf.format(-Math.floor(diff / 60000), 'minute');
      } else if (diff < 86400000) { // 1日以内
        return rtf.format(-Math.floor(diff / 3600000), 'hour');
      } else {
        return rtf.format(-Math.floor(diff / 86400000), 'day');
      }
    }
  };
}

export function useFormattedNumber() {
  const locale = useLocale();

  return {
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(num);
    },

    formatCurrency: (amount: number, currency: string, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        ...options
      }).format(amount);
    },

    formatPercent: (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        ...options
      }).format(value);
    }
  };
}
```

### 書式設定コンポーネント

```typescript
// src/components/ui/FormattedContent.tsx
'use client';

import { useFormattedDate, useFormattedNumber } from '@/lib/formatters';

interface FormattedDateProps {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
  type?: 'date' | 'datetime' | 'relative';
}

export function FormattedDate({
  date,
  options,
  type = 'date'
}: FormattedDateProps) {
  const { formatDate, formatDateTime, formatRelativeTime } = useFormattedDate();

  switch (type) {
    case 'datetime':
      return <span>{formatDateTime(date, options)}</span>;
    case 'relative':
      return <span>{formatRelativeTime(date)}</span>;
    default:
      return <span>{formatDate(date, options)}</span>;
  }
}

interface FormattedNumberProps {
  value: number;
  options?: Intl.NumberFormatOptions;
  type?: 'number' | 'currency' | 'percent';
  currency?: string;
}

export function FormattedNumber({
  value,
  options,
  type = 'number',
  currency
}: FormattedNumberProps) {
  const { formatNumber, formatCurrency, formatPercent } = useFormattedNumber();

  switch (type) {
    case 'currency':
      if (!currency) throw new Error('Currency is required for currency formatting');
      return <span>{formatCurrency(value, currency, options)}</span>;
    case 'percent':
      return <span>{formatPercent(value, options)}</span>;
    default:
      return <span>{formatNumber(value, options)}</span>;
  }
}
```

## 🌐 言語切り替え機能

### 言語切り替えコンポーネント

```typescript
// src/components/ui/LanguageSwitcher.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Globe, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Globe className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.flag} {currentLanguage?.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                  language.code === locale ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{language.flag}</span>
                  <span>{language.nativeName}</span>
                </div>
                {language.code === locale && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🛠️ Todoアプリで実践してみよう

それでは、学習した内容を踏まえてTodoアプリを国際化対応させてみましょう。

:::step

1. 必要なパッケージのインストール

```bash
npm install next-intl
```

2. i18n設定の作成

`i18n.ts`を作成し、前述の設定を追加してください。

3. メッセージファイルの作成

`messages/`ディレクトリを作成し、`ja.json`、`en.json`、`ar.json`を作成してください。

4. ミドルウェアの作成

`src/middleware.ts`を作成し、前述のミドルウェア設定を追加してください。

5. レイアウトの更新

`src/app/[locale]/layout.tsx`を作成し、国際化対応のレイアウトを実装してください。

6. メインページの更新

`src/app/[locale]/page.tsx`を更新し、翻訳対応を実装してください。

```typescript
// src/app/[locale]/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import TodoForm from '@/components/forms/IntlTodoForm';
import TodoList from '@/components/ui/RTLAwareTodoList';
import { createTodoAction } from '@/lib/actions/todo-actions';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const t = useTranslations('todo');

  const createTodoMutation = useMutation({
    mutationFn: createTodoAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error || 'エラーが発生しました');
      }
    },
    onError: () => {
      toast.error('予期せぬエラーが発生しました');
    }
  });

  const handleSubmit = async (formData: any) => {
    await createTodoMutation.mutateAsync(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* フォームセクション */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('addTodo')}
            </h2>
            <TodoForm onSubmit={handleSubmit} />
          </div>
        </div>

        {/* リストセクション */}
        <div className="xl:col-span-2">
          <TodoList />
        </div>
      </div>
    </div>
  );
}
```

7. CSSスタイルの追加

`src/styles/rtl.css`を作成し、RTL対応のスタイルを追加してください。

8. 言語切り替えコンポーネントの追加

ナビゲーションに言語切り替え機能を追加してください。

9. 開発サーバーの起動

```bash
npm run dev
```

10. 動作確認

ブラウザで以下のURLにアクセスし、多言語対応を確認してください：
- `http://localhost:3000/ja` (日本語)
- `http://localhost:3000/en` (英語)
- `http://localhost:3000/ar` (アラビア語)

11. RTL表示の確認

アラビア語版で、テキストが右から左に表示されること、レイアウトが反転していることを確認してください。

12. コミット

```bash
git add .
git commit -m "Add internationalization and RTL support"
```

:::

このように、Next.jsアプリケーションを国際化対応させ、多言語・RTLサポートを実装できます。

## ✅ アクセシビリティとベストプラクティス

### アクセシビリティの考慮

:::note 国際化とアクセシビリティ

- **言語属性**：`lang`属性と`dir`属性の正しい設定
- **フォント**：各言語に適したフォントの選択
- **色のコントラスト**：すべての言語で十分なコントラスト比の確保
- **キーボードナビゲーション**：RTL環境でも正しく動作すること
- **スクリーンリーダー**：適切なARIAラベルの提供
- **フォールバック**：翻訳がない場合の代替テキスト

:::

### パフォーマンス最適化

```typescript
// 翻訳ファイルの最適化
// 必要な翻訳のみをロード
export async function getMessages(locale: string) {
  const commonMessages = (await import(`./messages/${locale}/common.json`)).default;
  const pageMessages = (await import(`./messages/${locale}/${currentPage}.json`)).default;

  return {
    ...commonMessages,
    ...pageMessages
  };
}

// 動的インポートによるバンドルサイズの最適化
const getTranslations = async (locale: string) => {
  const [common, todo, form] = await Promise.all([
    import(`./messages/${locale}/common.json`),
    import(`./messages/${locale}/todo.json`),
    import(`./messages/${locale}/form.json`)
  ]);

  return { common, todo, form };
};
```

## 🎉 まとめ

このページでは、Next.jsアプリケーションにおける国際化とRTL対応の実装方法を学びました。多言語対応、ローカライゼーション、アクセシビリティを考慮したグローバル対応アプリケーション開発のスキルを習得しました。

:::note 要点のまとめ

- **next-intl**はNext.jsアプリケーションの国際化に最適なライブラリ
- **ルーティングベース**の言語切り替えでSEOとユーザビリティを向上
- **RTL対応**にはCSSの`dir`属性と適切なスタイル調整が必要
- **日付・数値・通貨**の書式設定はIntl APIでローカライズ
- **アクセシビリティ**と**パフォーマンス**を常に考慮する必要がある
- **v0コンポーネント**は国際化設計を考慮してカスタマイズ

:::

これで、**v0コンポーネントで作るWebアプリケーション開発**の全ての章が完了しました。基本的なコンポーネント作成から、実際のアプリケーション構築、国際化対応まで、一連の開発フローを学びました。

## 🔗 関連リンク

- [next-intlドキュメント](https://next-intl-docs.vercel.app/)
- [Intl APIドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [W3C国際化ベストプラクティス](https://www.w3.org/International/i18n-articles/)
- [RTLスタイリングガイド](https://rtlstyling.com/)
- [Webアクセシビリティと国際化](https://www.w3.org/WAI/international/i18n/)

## 📚 さらに深く学習したい方へ

このチュートリアルで学んだ内容は、現代のWebアプリケーション開発において重要な基礎スキルです。より深く学習したい方は、以下のトピックも参照してください：

- 高度な国際化戦略（ドメインベース、サブドメインなど）
- 翻訳管理システムと連携
- SEOと国際化の最適化
- 多地域対応（タイムゾーン、通貨、住所形式など）
- 自動翻訳と機械学習の活用
- 国際化対応のテスト戦略