---
title: "コンポーネントスニペット | v0で作る再利用可能UIコンポーネント集"
slug: component-snippets
parent: "templates"
file_path: templates/component-snippets
target_user: "Web開発者、フロントエンドエンジニア、UIデザイナー"
goal: "v0を使って再利用可能なUIコンポーネントを作成する方法を学び、開発効率とデザインの一貫性を向上させる"
status: publish
post_type: pages
seo_title: "コンポーネントスニペット | v0で作る再利用可能UIコンポーネント集"
seo_description: "v0 by Vercelを使って再利用可能なUIコンポーネントを作成する方法を解説。ボタン、フォーム、カード、ナビゲーションなど、すぐに使えるコンポーネントスニペットを提供します。"
seo_keywords: "v0, UIコンポーネント, React, TypeScript, Tailwind CSS, 再利用可能, デザインシステム, コンポーネント設計"
handson_overview: "実際のプロジェクトで使えるUIコンポーネントをv0で作成し、コンポーネント設計のベストプラクティスを学ぶハンズオンを行います。"
---

## 🔧 コンポーネントスニペット

モダンなWeb開発において、再利用可能なUIコンポーネントは開発効率とデザインの一貫性を保つ鍵となります。v0を使って、高品質でアクセシブルなコンポーネントを効率的に作成する方法を学びましょう。

### このページで学べること

:::note

このページでは、v0を使った再利用可能UIコンポーネントの作成方法を学びます。

- 基本的なUIコンポーネントの設計パターン
- フォームと入力コンポーネントの実装
- データ表示とテーブルコンポーネント
- ナビゲーションとレイアウトコンポーネント
- アニメーションとインタラクション
- コンポーネントのドキュメンテーション手法

:::

## 🎨 コンポーネント設計の基本原則

効果的なコンポーネント設計には、いくつかの重要な原則があります。

### 設計原則

- **単一責任**: 各コンポーネントは1つの明確な責任を持つ
- **再利用性**: propsによるカスタマイズ性を高める
- **構成可能**: 小さなコンポーネントを組み合わせて複雑なUIを構築
- **アクセシビリティ**: すべてのユーザーが利用できる設計
- **パフォーマンス**: 不要な再レンダリングを避ける

:::note アトミックデザインとは

アトミックデザインは、UIを原子、分子、有機体、テンプレート、ページの5つの階層に分ける設計手法です：

- **Atoms（原子）**: 最小単位の要素（ボタン、入力フィールドなど）
- **Molecules（分子）**: 原子の組み合わせ（検索ボックス、フォームなど）
- **Organisms（有機体）**: 分子の組み合わせ（ヘッダー、カードなど）
- **Templates（テンプレート）**: 有機体のレイアウト
- **Pages（ページ）**: 実際のページコンテンツ

この考え方を取り入れることで、一貫性のある再利用可能なコンポーネントを設計できます。

:::

## 📝 プロンプト設計パターン

各種コンポーネントを作成するためのプロンプト例を見ていきましょう。

### ボタンコンポーネントのプロンプト

```bash
再利用可能なボタンコンポーネントを作成してください。

要件:
- 複数のバリアント（primary, secondary, outline, ghost, link）
- 複数のサイズ（sm, md, lg, xl）
- ローディング状態の表示
- 無効状態のサポート
- アイコン付きボタン
- フルワイドオプション
- アクセシビリティ対応（ARIA属性）

機能:
- クリックハンドラーのサポート
- カスタムスタイルの上書き
- ツールチップの統合
- ドロップダウンメニューとの連携
- ホバーとフォーカスの視覚的フィードバック

技術要件:
- TypeScriptで型安全なprops定義
- Tailwind CSSクラスの動的生成
- React.forwardRefによるref転送
- ストーリーブック用のドキュメンテーション
- テスト用のモック実装

使用例:
```tsx
<Button variant="primary" size="md" isLoading>
  保存する
</Button>
<Button variant="outline" size="sm" icon={<PlusIcon />}>
  新規作成
</Button>
```
```

### フォームコンポーネントのプロンプト

```bash
包括的なフォームコンポーネントセットを作成してください。

コンポーネントセット:
1. TextInput: テキスト入力フィールド
   - ラベルとプレースホルダー
   - バリデーションエラー表示
   - ヘルプテキスト
   - 文字数カウンター
   - クリアボタン

2. SelectInput: 選択フィールド
   - 単一/複数選択
   - 検索機能付き
   - グループ化オプション
   - カスタムレンダリング

3. CheckboxGroup: チェックボックスグループ
   - 水平/垂直レイアウト
   - 全選択/全解除
   - インデeterminate状態

4. RadioGroup: ラジオボタングループ
   - カスタムスタイル
   - アクセシビリティ対応

5. TextArea: テキストエリア
   - 自動リサイズ
   - シンタックスハイライト（オプション）

バリデーション統合:
- React Hook Formとの連携
- Zodスキーマによる型安全なバリデーション
- リアルタイムバリデーション
- エラーメッセージのカスタマイズ

アクセシビリティ:
- WAI-ARIA準拠
- キーボードナビゲーション
- スクリーンリーダー対応
- フォーカス管理

デザインシステム:
- 一貫したスペーシングとタイポグラフィ
- カスタムカラー設定のサポート
- ダークモード対応
- レスポンシブデザイン
```

## 🛠️ UIコンポーネントを作成してみよう

実際にv0を使って再利用可能なUIコンポーネントを作成してみましょう。

:::step

1. 基本的なボタンコンポーネント

まずは最も基本的なボタンコンポーネントから始めます。

```typescript
// src/components/ui/Button.tsx
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

2. 入力フィールドコンポーネント

フォームの基本となる入力フィールドを作成します。

```typescript
// src/components/ui/Input.tsx
import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, required, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error && 'text-destructive'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

3. カードコンポーネント

コンテンツをグループ化するカードコンポーネントを作成します。

```typescript
// src/components/ui/Card.tsx
import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

4. モーダルコンポーネント

ダイアログ表示に使うモーダルコンポーネントを作成します。

```typescript
// src/components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md'
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-lg shadow-xl transform transition-all',
          'w-full',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="閉じる"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // Portalを使用してbodyの直下にレンダリング
  return createPortal(modalContent, document.body);
};

export { Modal };
```

5. データテーブルコンポーネント

データを一覧表示するテーブルコンポーネントを作成します。

```typescript
// src/components/ui/DataTable.tsx
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

function DataTable<T>({
  data,
  columns,
  onRowClick,
  className,
  loading = false,
  emptyMessage = 'データがありません'
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className={cn('w-full overflow-hidden', className)}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.sortable && 'cursor-pointer hover:bg-gray-100',
                  column.className
                )}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && sortColumn === column.key && (
                    <svg
                      className={cn(
                        'w-4 h-4',
                        sortDirection === 'desc' && 'transform rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable };
```

6. トースト通知コンポーネント

ユーザーへのフィードバックを表示するトーストコンポーネントを作成します。

```typescript
// src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  const styles = typeStyles[type];

  return (
    <div
      className={cn(
        'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
        styles.bg,
        styles.border
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm text-gray-500">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(id)}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// トーストコンテナコンポーネント
interface ToastContainerProps {
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export { Toast, ToastContainer };
```

7. ツールチップコンポーネント

補足情報を表示するツールチップコンポーネントを作成します。

```typescript
// src/components/ui/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip = ({ content, children, placement = 'top', className }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }

      // ウィンドウ境界内に収まるように調整
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (left < 0) left = 8;
      if (left + tooltipRect.width > windowWidth) left = windowWidth - tooltipRect.width - 8;
      if (top < 0) top = 8;
      if (top + tooltipRect.height > windowHeight) top = windowHeight - tooltipRect.height - 8;

      setPosition({ top, left });
    }
  }, [isVisible, placement]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      className={cn(
        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
        'pointer-events-none whitespace-nowrap',
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="tooltip"
    >
      {content}
      {/* 矢印 */}
      <div
        className={cn(
          'absolute w-2 h-2 bg-gray-900 transform rotate-45',
          placement === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1',
          placement === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1',
          placement === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-1',
          placement === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-1'
        )}
      />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-block"
      >
        {children}
      </div>
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
};

export { Tooltip };
```

:::

## 🎨 高度なコンポーネントパターン

さらに高度なコンポーネント設計パターンを紹介します。

### コンポーネントコンポジションパターン

```typescript
// src/components/ui/Menu.tsx
import React, { createContext, useContext, useState } from 'react';

interface MenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within a Menu component');
  }
  return context;
};

interface MenuProps {
  children: React.ReactNode;
}

const Menu = ({ children }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </MenuContext.Provider>
  );
};

interface MenuButtonProps {
  children: React.ReactNode;
}

const MenuButton = ({ children }: MenuButtonProps) => {
  const { toggle } = useMenu();

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
    >
      {children}
      <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

interface MenuItemsProps {
  children: React.ReactNode;
}

const MenuItems = ({ children }: MenuItemsProps) => {
  const { isOpen } = useMenu();

  if (!isOpen) return null;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItem = ({ children, onClick, disabled = false }: MenuItemProps) => {
  const { setIsOpen } = useMenu();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'block w-full text-left px-4 py-2 text-sm',
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  );
};

export { Menu, MenuButton, MenuItems, MenuItem };
```

### レンダープロップスパターン

```typescript
// src/components/ui/Tabs.tsx
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string, setActiveTab: (tabId: string) => void) => React.ReactNode;
}

const Tabs = ({ tabs, defaultTab, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                tab.disabled && 'text-gray-400 cursor-not-allowed'
              )}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {children(activeTab, setActiveTab)}
      </div>
    </div>
  );
};

// 使用例
const ExampleTabs = () => {
  const tabs = [
    { id: 'profile', label: 'プロフィール' },
    { id: 'settings', label: '設定' },
    { id: 'billing', label: '請求情報' },
  ];

  return (
    <Tabs tabs={tabs}>
      {(activeTab, setActiveTab) => (
        <div>
          {activeTab === 'profile' && <ProfileContent />}
          {activeTab === 'settings' && <SettingsContent />}
          {activeTab === 'billing' && <BillingContent />}
        </div>
      )}
    </Tabs>
  );
};

export { Tabs };
```

### カスタムフックとの連携

```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormProps<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false
  });

  const setValue = useCallback((name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      touched: { ...prev.touched, [name]: true }
    }));
  }, []);

  const setError = useCallback((name: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error }
    }));
  }, []);

  const clearError = useCallback((name: keyof T) => {
    setState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[name];
      return { ...prev, errors: newErrors };
    });
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const errors = validate(state.values);
    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [validate, state.values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) return;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit(state.values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [validateForm, onSubmit, state.values]);

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false
    });
  }, [initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    setValue,
    setError,
    clearError,
    handleSubmit,
    reset
  };
}

// フォームコンポーネントとの連携
interface FormFieldProps<T> {
  name: keyof T;
  label: string;
  type?: string;
  required?: boolean;
  form: ReturnType<typeof useForm<T>>;
}

const FormField = <T extends Record<string, any>>({
  name,
  label,
  type = 'text',
  required = false,
  form
}: FormFieldProps<T>) => {
  const { values, errors, touched, setValue } = form;

  return (
    <div className="space-y-2">
      <label htmlFor={name as string} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name as string}
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        className={cn(
          'w-full px-3 py-2 border rounded-md',
          errors[name] && touched[name]
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500'
        )}
      />
      {errors[name] && touched[name] && (
        <p className="text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export { FormField };
```

## まとめ

v0を使えば、再利用可能で高品質なUIコンポーネントも効率的に作成できます。適切な設計パターンとベストプラクティスを組み合わせることで、開発効率と保守性を大幅に向上させることができます。

:::note 要点のまとめ

- コンポーネントは単一責任の原則に従って設計する
- Propsによるカスタマイズ性を高め再利用性を向上させる
- アクセシビリティと型安全性を確保する
- コンポジションパターンで柔軟なコンポーネントを実装する
- カスタムフックと連携してロジックを分離する
- ドキュメンテーションとテストを充実させる

:::

これでv0テンプレート/スターターコレクションは完了です。次のセクション「[トラブルシューティング](../troubleshooting/troubleshooting.md)」では、v0開発で遭遇する可能性のある問題とその解決方法を学びましょう。

## 📚 関連リンク

- [コンポーネント設計パターン](../level3-components/buttons-badges-tags.md)
- [アクセシビリティガイドライン](../level3-components/accessibility.md)
- [状態管理のベストプラクティス](../level4-app-assembly/state-management.md)