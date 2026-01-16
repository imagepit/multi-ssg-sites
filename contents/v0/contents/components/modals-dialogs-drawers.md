---
title: モーダル/ダイアログ/ドロワー実装 | React+shadcn/uiで学ぶ対話型UI
slug: modals-dialogs-drawers
parent: components
file_path: components/modals-dialogs-drawers.md
target_user: フロントエンド開発者、UI/UXデザイナー、Reactエンジニア
goal: "v0で生成した対話型UIコンポーネントの実装とカスタマイズ方法を学び、shadcn/uiとTailwind CSSを活用したアクセシブルでパフォーマンスの良いモーダル、ダイアログ、ドロワーを習得する"
status: published
post_type: pages
seo_title: v0モーダル/ダイアログ/ドロワー実装ガイド | React+shadcn/uiで学ぶ対話型UI
seo_description: "v0で生成した対話型UIコンポーネントをReactとshadcn/uiで実装する完全ガイド。モーダル、ダイアログ、ドロワーのアクセシビリティ対応とパフォーマンス最適化を習得できます。"
seo_keywords: "v0, Reactモーダル, ダイアログ, ドロワー, shadcn/ui, アクセシビリティ, フォーカストラッピング, パフォーマンス最適化, UIコンポーネント"
handson_overview: "v0で生成した対話型UIコンポーネントを実装するハンズオン。モーダル、ダイアログ、ドロワーの実装方法を実際のコードで学び、アクセシビリティとパフォーマンスを最適化します。"
---

## 🎭 はじめに

モーダル、ダイアログ、ドロワーは、ユーザーとの対話を促す重要なUIコンポーネントです。v0を使ってこれらのコンポーネントを効果的に生成し、shadcn/uiと統合することで、アクセシブルでパフォーマンスの良い対話型UIを実装する方法を学びましょう。

### このページで学べる事

このセクションでは、v0とshadcn/uiを活用した対話型UIコンポーネントの実装手法を学びます。

:::note

- v0で生成した対話型UIコンポーネントの実装方法
- モーダル、ダイアログ、ドロワーのアクセシビリティ対応
- フォーカストラッピングとキーボードナビゲーション
- パフォーマンス最適化とアニメーション制御
- 複雑な状態管理とイベント処理

:::

## 🔄 対話型UIの基本概念

モーダル、ダイアログ、ドロワーは、ユーザーの注目を集め、特定のアクションを促すためのUIパターンです。それぞれの特徴と適切な使用場面を理解することが重要です。

### モーダルの特徴と使用場面

モーダルは、メインコンテンツの上に表示されるオーバーレイで、ユーザーの操作を一時的に制限します。

**使用場面:**
- 確認ダイアログ（削除、保存など）
- フォーム入力（ログイン、登録など）
- 詳細情報の表示
- 警告やエラーメッセージ

:::note フォーカストラッピングとは

フォーカストラッピングは、キーボード操作時にフォーカスを特定の領域内に制限するアクセシビリティ機能です。モーダルが開いている間、フォーカスがモーダル内から外れないようにすることで、スクリーンリーダーユーザーやキーボードユーザーの操作性を向上させます。

:::

### ダイアログの種類と選択基準

ダイアログには以下の種類があり、目的に応じて適切に選択する必要があります。

1. **Alertダイアログ**: 重要な情報の通知
2. **Confirmダイアログ**: ユーザーの確認を求める
3. **Promptダイアログ**: ユーザーに入力を求める
4. **Choiceダイアログ**: 複数の選択肢から選択を求める

### ドロワーの利点と実装方法

ドロワーは画面の端からスライドして表示されるパネルで、モバイルアプリでよく使用されます。

**利点:**
- 画面の有効活用
- スムーズなユーザーエクスペリエンス
- コンテキストの維持
- レスポンシブデザインとの親和性

## 🚀 モーダルコンポーネントの実装

### 基本的なモーダルコンポーネント

まずはv0で生成した基本的なモーダルコンポーネントを実装してみましょう。

:::step

1. v0でモーダルコンポーネントを生成

以下のプロンプトでv0にモーダルコンポーネントを生成させます：

```
shadcn/uiとTailwind CSSを使用したアクセシブルなモーダルコンポーネントを作成してください。以下の機能を実装してください：
- オーバーレイとフォーカストラッピング
- キーボード操作（ESCキーで閉じる）
- アニメーション効果
- サイズオプション（sm, md, lg, xl）
- カスタムコンテンツエリア
```

2. 生成されたコードをカスタマイズ

```tsx
// components/ui/modal.tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Modal = DialogPrimitive.Root

const ModalTrigger = DialogPrimitive.Trigger

const ModalPortal = DialogPrimitive.Portal

const ModalClose = DialogPrimitive.Close

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
ModalHeader.displayName = "ModalHeader"

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
ModalFooter.displayName = "ModalFooter"

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
}
```

3. サイズオプションの追加

```tsx
// components/ui/modal-sizes.tsx
import { ModalContent } from "./modal"
import { cn } from "@/lib/utils"

interface ModalSizesProps {
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
  children: React.ReactNode
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
}

export const ModalContentWithSize = React.forwardRef<
  React.ElementRef<typeof ModalContent>,
  React.ComponentPropsWithoutRef<typeof ModalContent> & ModalSizesProps
>(({ size = "md", className, children, ...props }, ref) => (
  <ModalContent
    ref={ref}
    className={cn(sizeClasses[size], className)}
    {...props}
  >
    {children}
  </ModalContent>
))

ModalContentWithSize.displayName = "ModalContentWithSize"
```

4. 使用例

```tsx
// examples/modal-example.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal"
import { ModalContentWithSize } from "@/components/ui/modal-sizes"

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalTrigger asChild>
          <Button>基本モーダルを開く</Button>
        </ModalTrigger>
        <ModalContent className="sm:max-w-[425px]">
          <ModalHeader>
            <ModalTitle>プロフィール編集</ModalTitle>
            <ModalDescription>
              プロフィール情報を更新します。変更内容は自動的に保存されます。
            </ModalDescription>
          </ModalHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                名前
              </label>
              <input
                id="name"
                defaultValue="田中太郎"
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right">
                ユーザー名
              </label>
              <input
                id="username"
                defaultValue="@tanaka"
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">キャンセル</Button>
            </ModalClose>
            <Button type="submit">保存する</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* サイズ違いのモーダル */}
      <Modal>
        <ModalTrigger asChild>
          <Button variant="outline">大きいモーダルを開く</Button>
        </ModalTrigger>
        <ModalContentWithSize size="lg">
          <ModalHeader>
            <ModalTitle>詳細設定</ModalTitle>
            <ModalDescription>
              アプリケーションの詳細設定を変更します。
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">通知設定</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>メール通知を受け取る</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>プッシュ通知を受け取る</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">テーマ設定</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>ライト</option>
                <option>ダーク</option>
                <option>システム</option>
              </select>
            </div>
          </div>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">キャンセル</Button>
            </ModalClose>
            <Button>設定を保存</Button>
          </ModalFooter>
        </ModalContentWithSize>
      </Modal>
    </div>
  )
}
```

:::

### アクセシビリティ対応のモーダル

アクセシビリティを重視したモーダルコンポーネントの実装方法です。

:::step

1. アクセシビリティ機能の追加

```tsx
// components/ui/accessible-modal.tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import { useEscapeKey } from "@/hooks/use-escape-key"

interface AccessibleModalProps {
  children: React.ReactNode
  title: string
  description?: string
  onClose: () => void
  className?: string
}

const AccessibleModal = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AccessibleModalProps
>(({ children, title, description, onClose, className, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement>(null)

  // フォーカストラップの設定
  useFocusTrap(contentRef, {
    activateOnOpen: true,
    deactivateOnClose: true,
    returnFocusOnDeactivate: true,
  })

  // ESCキーで閉じる機能
  useEscapeKey(onClose)

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg",
          className
        )}
        {...props}
      >
        <div ref={contentRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">閉じる</span>
            </DialogPrimitive.Close>
          </div>

          {description && (
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}

          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})

AccessibleModal.displayName = "AccessibleModal"

// フォーカストラップ用カスタムフック
export function useFocusTrap(
  elementRef: React.RefObject<HTMLElement>,
  options: {
    activateOnOpen?: boolean
    deactivateOnClose?: boolean
    returnFocusOnDeactivate?: boolean
  } = {}
) {
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!elementRef.current || !options.activateOnOpen) return

    // 現在のフォーカス要素を保存
    previousActiveElement.current = document.activeElement as HTMLElement

    // フォーカス可能な要素を取得
    const focusableElements = elementRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      // 最初のフォーカス可能な要素にフォーカス
      (focusableElements[0] as HTMLElement).focus()
    }

    return () => {
      if (options.returnFocusOnDeactivate && previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [options.activateOnOpen, options.returnFocusOnDeactivate])
}

// ESCキーハンドリング用カスタムフック
export function useEscapeKey(onEscape: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onEscape])
}

export { AccessibleModal }
```

2. 使用例

```tsx
// examples/accessible-modal-example.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AccessibleModal } from "@/components/ui/accessible-modal"

export function AccessibleModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        アクセシブルなモーダルを開く
      </Button>

      {isOpen && (
        <AccessibleModal
          title="削除の確認"
          description="この操作は元に戻せません。本当に削除しますか？"
          onClose={() => setIsOpen(false)}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              削除する項目: プロジェクト「新機能開発」
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // 削除処理を実行
                  setIsOpen(false)
                }}
              >
                削除する
              </Button>
            </div>
          </div>
        </AccessibleModal>
      )}
    </div>
  )
}
```

:::

## 🗨️ ダイアログコンポーネントの実装

### Alertダイアログの実装

Alertダイアログは、重要な情報をユーザーに通知するためのシンプルなダイアログです。

:::step

1. Alertダイアログコンポーネントの作成

```tsx
// components/ui/alert-dialog.tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

2. Confirmダイアログの使用例

```tsx
// examples/confirm-dialog-example.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ConfirmDialogExample() {
  return (
    <div className="space-y-4">
      {/* 基本的な確認ダイアログ */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>アカウントを削除</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は元に戻せません。アカウントに関連するすべてのデータが永久に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => console.log("Account deleted")}>
              削除を確認
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 危険な操作用の確認ダイアログ */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">データベースをリセット</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              警告: データベースのリセット
            </AlertDialogTitle>
            <AlertDialogDescription>
              すべてのデータが削除され、初期状態に戻ります。この操作は取り消せません。
              続行する前に、必ずバックアップを作成してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => console.log("Database reset")}
            >
              リセットを確認
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 情報提供用のダイアログ */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">機能の詳細</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>プレミアム機能</AlertDialogTitle>
            <AlertDialogDescription>
              プレミアムプランでは、以下の機能が利用できます：
              <ul className="mt-2 space-y-1 text-left">
                <li>• 無制限のストレージ容量</li>
                <li>• 高度な分析機能</li>
                <li>• 24時間サポート</li>
                <li>• カスタムテーマ</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>後で</AlertDialogCancel>
            <AlertDialogAction>アップグレード</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
```

:::

## 📤 ドロワーコンポーネントの実装

### 基本的なドロワーコンポーネント

ドロワーは画面の端からスライドして表示されるコンポーネントです。

:::step

1. ドロワーコンポーネントの作成

```tsx
// components/ui/drawer.tsx
"use client"

import * as React from "react"
import * as DrawerPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Drawer = DrawerPrimitive.Root

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  side?: "left" | "right" | "top" | "bottom"
  size?: "sm" | "md" | "lg" | "xl"
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ side = "right", size = "md", className, children, ...props }, ref) => {
  const sideClasses = {
    left: "inset-y-0 left-0 h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
    top: "inset-x-0 top-0 h-auto data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    bottom: "inset-x-0 bottom-0 h-auto data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  }

  const sizeClasses = {
    sm: side === "left" || side === "right" ? "sm:max-w-xs" : "sm:max-h-[25vh]",
    md: side === "left" || side === "right" ? "sm:max-w-sm" : "sm:max-h-[50vh]",
    lg: side === "left" || side === "right" ? "sm:max-w-md" : "sm:max-h-[75vh]",
    xl: side === "left" || side === "right" ? "sm:max-w-lg" : "sm:max-h-[90vh]",
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClasses[side],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        <DrawerPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">閉じる</span>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = DrawerPrimitive.Content.displayName

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
```

2. ドロワーの使用例

```tsx
// examples/drawer-example.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function DrawerExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* 右サイドドロワー */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button>設定を開く</Button>
        </DrawerTrigger>
        <DrawerContent className="w-[400px] sm:max-w-[540px]">
          <DrawerHeader>
            <DrawerTitle>アプリケーション設定</DrawerTitle>
            <DrawerDescription>
              アプリケーションの動作をカスタマイズします。
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">アプリケーション名</Label>
              <Input id="name" defaultValue="マイアプリ" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theme">テーマ</Label>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>ライト</option>
                <option>ダーク</option>
                <option>システム</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">言語</Label>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>日本語</option>
                <option>English</option>
                <option>中文</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="notifications" defaultChecked />
              <Label htmlFor="notifications">通知を有効にする</Label>
            </div>
          </div>
          <DrawerFooter>
            <Button>設定を保存</Button>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 下部ドロワー（モバイル向け） */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">フィルターを追加</Button>
        </DrawerTrigger>
        <DrawerContent side="bottom" className="h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>フィルター設定</DrawerTitle>
            <DrawerDescription>
              データの表示条件を設定します。
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4 overflow-y-auto">
            <div className="grid gap-2">
              <Label>日付範囲</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" placeholder="開始日" />
                <Input type="date" placeholder="終了日" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>カテゴリー</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>ワーク</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>個人</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>その他</span>
                </label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="search">検索キーワード</Label>
              <Input id="search" placeholder="キーワードを入力..." />
            </div>
          </div>
          <DrawerFooter>
            <Button>フィルターを適用</Button>
            <DrawerClose asChild>
              <Button variant="outline">リセット</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 左サイドドロワー（ナビゲーション） */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost">メニュー</Button>
        </DrawerTrigger>
        <DrawerContent side="left" className="w-[300px]">
          <DrawerHeader>
            <DrawerTitle>ナビゲーション</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ダッシュボード
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              プロジェクト
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              チーム
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
```

:::

### ネストされた対話型UIの実装

モーダル内にさらにダイアログを表示する、複雑な対話型UIの実装方法です。

:::step

1. ネストされた対話型UIの実装

```tsx
// examples/nested-dialogs-example.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function NestedDialogsExample() {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleSave = () => {
    // 保存処理
    setIsMainDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* メインダイアログ */}
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild>
          <Button>プロジェクト作成</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>新しいプロジェクトを作成</DialogTitle>
            <DialogDescription>
              プロジェクトの基本情報を入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">プロジェクト名</Label>
              <Input
                id="project-name"
                placeholder="マイプロジェクト"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">説明</Label>
              <Textarea
                id="project-description"
                placeholder="プロジェクトの詳細を入力..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-template">テンプレート</Label>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>空のプロジェクト</option>
                <option>Webアプリケーション</option>
                <option>モバイルアプリ</option>
                <option>APIプロジェクト</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  詳細設定
                </Button>
              </DrawerTrigger>
              <DrawerContent side="right" className="w-[400px]">
                <DrawerHeader>
                  <DrawerTitle>詳細設定</DrawerTitle>
                  <DrawerDescription>
                    プロジェクトの追加設定を行います。
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="enable-git" defaultChecked />
                    <Label htmlFor="enable-git">Gitリポジトリを有効化</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="enable-ci" />
                    <Label htmlFor="enable-ci">CI/CDを有効化</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="team-size">チームサイズ</Label>
                    <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>1-5人</option>
                      <option>6-20人</option>
                      <option>21-50人</option>
                      <option>50人以上</option>
                    </select>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>設定を適用</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button type="submit" className="w-full sm:w-auto">
                  プロジェクトを作成
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>プロジェクト作成の確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    以下の内容でプロジェクトを作成します。
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p><strong>プロジェクト名:</strong> マイプロジェクト</p>
                      <p><strong>テンプレート:</strong> Webアプリケーション</p>
                    </div>
                    よろしいですか？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>
                    作成を確認
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ワークフロー例 */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">複雑なワークフロー</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ユーザー登録 → プロフィール設定 → チーム招待 → 設定確認
        </p>
        <Button
          onClick={() => setIsMainDialogOpen(true)}
          className="w-full"
        >
          ワークフローを開始
        </Button>
      </div>
    </div>
  )
}
```

:::

## ⚡ パフォーマンス最適化

### 動的インポートとコード分割

対話型UIコンポーネントは、動的インポートを使用してパフォーマンスを最適化できます。

:::step

1. 動的インポートの実装

```tsx
// components/ui/lazy-modal.tsx
"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"

// ローディングコンポーネント
const ModalLoading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-background rounded-lg p-6 shadow-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="mt-2 text-sm text-muted-foreground">読み込み中...</p>
    </div>
  </div>
)

// 動的インポートされたモーダルコンポーネント
const LazyModalContent = dynamic(() => import("./modal-content"), {
  loading: ModalLoading,
  ssr: false,
})

interface LazyModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  // その他のprops...
}

export function LazyModal({ isOpen, onClose, title, ...props }: LazyModalProps) {
  if (!isOpen) return null

  return (
    <Suspense fallback={<ModalLoading />}>
      <LazyModalContent
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        {...props}
      />
    </Suspense>
  )
}

// 大きなコンポーネントを動的インポート
const LazyHeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <div>コンポーネントを読み込み中...</div>,
  ssr: false,
})

// 使用例
export function LazyModalExample() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        動的モーダルを開く
      </button>

      <LazyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="動的に読み込まれたモーダル"
      >
        <LazyHeavyComponent />
      </LazyModal>
    </div>
  )
}
```

2. 条件付きレンダリングの最適化

```tsx
// components/ui/optimized-dialogs.tsx
"use client"

import React, { useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// 高価な計算をメモ化
const useExpensiveCalculation = (data: any) => {
  return useMemo(() => {
    // 高価な計算処理
    return data.map((item: any) => ({
      ...item,
      processed: true,
    }))
  }, [data])
}

// コールバックのメモ化
const useDialogHandlers = (onClose: () => void) => {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(() => {
    // フォーム送信処理
    console.log("Form submitted")
    onClose()
  }, [onClose])

  return { handleClose, handleSubmit }
}

interface OptimizedDialogProps {
  isOpen: boolean
  onClose: () => void
  data: any[]
  title: string
}

export function OptimizedDialog({
  isOpen,
  onClose,
  data,
  title,
}: OptimizedDialogProps) {
  const processedData = useExpensiveCalculation(data)
  const { handleClose, handleSubmit } = useDialogHandlers(onClose)

  // ダイアログが開いていない場合は何もレンダリングしない
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {processedData.map((item, index) => (
            <div key={index} className="p-2 border rounded">
              {item.name}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>
            送信
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

:::

### メモ化と仮想化の最適化

大量のデータを扱う対話型UIでは、メモ化と仮想化が重要です。

:::step

1. メモ化の最適化

```tsx
// components/ui/memoized-dialog.tsx
"use client"

import React, { memo, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// メモ化されたアイテムコンポーネント
const DialogItem = memo(({ item, onAction }: { item: any; onAction: (id: string) => void }) => {
  const handleClick = useCallback(() => {
    onAction(item.id)
  }, [item.id, onAction])

  return (
    <div className="p-3 border rounded hover:bg-muted cursor-pointer" onClick={handleClick}>
      <h4 className="font-medium">{item.title}</h4>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </div>
  )
})

DialogItem.displayName = "DialogItem"

// メモ化されたダイアログコンポーネント
export const MemoizedDialog = memo(({
  isOpen,
  onClose,
  items,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  items: any[]
  title: string
}) => {
  const handleItemAction = useCallback((id: string) => {
    console.log("Item action:", id)
    // アイテムのアクション処理
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(item => item.isActive)
  }, [items])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <DialogItem
              key={item.id}
              item={item}
              onAction={handleItemAction}
            />
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})

MemoizedDialog.displayName = "MemoizedDialog"
```

2. 仮想化の最適化

```tsx
// components/ui/virtualized-drawer.tsx
"use client"

import React, { useCallback, useMemo } from "react"
import { FixedSizeList as List } from "react-window"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

// 仮想化されたアイテムコンポーネント
const VirtualizedItem = ({ index, style, data }: { index: number; style: any; data: any[] }) => {
  const item = data[index]

  return (
    <div style={style} className="p-2 border-b">
      <h4 className="font-medium">{item.title}</h4>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </div>
  )
}

interface VirtualizedDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: any[]
  title: string
}

export function VirtualizedDrawer({
  isOpen,
  onClose,
  items,
  title,
}: VirtualizedDrawerProps) {
  const itemHeight = 80 // 各アイテムの高さ

  const handleItemClick = useCallback((index: number) => {
    const item = items[index]
    console.log("Item clicked:", item)
    // アイテムクリック処理
  }, [items])

  if (!isOpen) return null

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <List
            height={600} // リストの高さ
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
            itemData={items}
            onItemRendered={({ index }) => {
              // アイテムがレンダリングされた時の処理
            }}
          >
            {VirtualizedItem}
          </List>
        </div>
        <div className="p-4 border-t">
          <Button onClick={onClose} className="w-full">
            閉じる
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

:::

## 🎨 v0プロンプト最適化

### 効果的なv0プロンプトの作成

対話型UIコンポーネントをv0で効果的に生成するためのプロンプト例です。

:::step

1. モーダルコンポーネントのプロンプト例

```
shadcn/uiとTailwind CSSを使用した高度なモーダルコンポーネントを作成してください。

必須機能：
- フォーカストラッピングとキーボードナビゲーション
- ESCキーとオーバーレイクリックで閉じる
- サイズオプション（sm, md, lg, xl）
- アニメーション効果（fade-in/slide-in）
- アクセシビリティ対応（ARIA属性）
- モバイルレスポンシブデザイン

オプション機能：
- スクロール可能なコンテンツエリア
- カスタムヘッダーとフッター
- 背景のぼかし効果
- ドラッグ可能な位置調整

デザイン要件：
- 現代的なUIデザイン
- 一貫性のあるスタイリング
- 柔軟なカスタマイズ性
- パフォーマンスの最適化

使用例：
- フォーム入力モーダル
- 確認ダイアログ
- 詳細情報表示
- 画像プレビュー
```

2. ダイアログコンポーネントのプロンプト例

```
shadcn/uiを使用したプロフェッショナルなダイアログコンポーネントを作成してください。

ダイアログタイプ：
- Alert: 重要な情報通知
- Confirm: ユーザー確認
- Prompt: ユーザー入力
- Choice: 選択肢提示

機能要件：
- タイプごとの最適なUIレイアウト
- アイコンとカラーの統一
- アクションボタンの配置
- キーボード操作サポート
- アニメーション効果

アクセシビリティ：
- スクリーンリーダー対応
- フォーカス管理
- キーボードナビゲーション
- 適切なARIA属性

スタイリング：
- プロフェッショナルなカラースキーム
- 一貫性のあるタイポグラフィ
- 適切なスペーシング
- ホバー効果とトランジション

パフォーマンス：
- 軽量なコンポーネント構造
- 動的インポート対応
- メモ化による最適化
- 条件付きレンダリング
```

3. ドロワーコンポーネントのプロンプト例

```
shadcn/uiとTailwind CSSを使用したモダンなドロワーコンポーネントを作成してください。

仕様：
- 4方向対応（left, right, top, bottom）
- サイズオプション（sm, md, lg, xl）
- スムーズなアニメーション
- オーバーレイ効果
- レスポンシブデザイン

機能：
- タッチ操作サポート（モバイル）
- ドラッグで開閉
- 固定ヘッダー/フッター
- スクロール可能なコンテンツ
- ネストされたドロワー対応

パフォーマンス最適化：
- 動的インポート
- 仮想化サポート
- メモ化
- レイジーローディング

使用シナリオ：
- サイドナビゲーション
- 設定パネル
- フィルター画面
- 詳細情報表示
- フォーム入力

デザイン：
- 現代的なUIデザイン
- 一貫性のあるスタイリング
- アニメーション効果
- カスタマイズ可能なテーマ
```

:::

## 🎯 ベストプラクティス

### 対話型UIの設計原則

効果的な対話型UIを設計するための重要な原則を学びましょう。

:::note 対話型UIのベストプラクティス

**ユーザーエクスペリエンス**
- 必要なときだけ表示する
- ユーザーの操作を中断しない
- 明確な目的を持たせる
- 簡単に閉じられるようにする

**アクセシビリティ**
- フォーカストラッピングを実装
- キーボード操作をサポート
- 適切なARIA属性を使用
- スクリーンリーダー対応

**パフォーマンス**
- 動的インポートを活用
- 不要なレンダリングを避ける
- メモ化による最適化
- 仮想化で大量データ対応

**デザイン**
- 一貫性のあるスタイリング
- 適切なアニメーション
- レスポンシブデザイン
- ブランドガイドラインの遵守

:::

### 状態管理の最適化

複雑な対話型UIにおける状態管理のベストプラクティスです。

```tsx
// examples/optimized-state-management.tsx
"use client"

import React, { createContext, useContext, useReducer, useCallback } from "react"

// 状態管理用のコンテキスト
interface DialogState {
  openDialogs: Set<string>
  dialogData: Map<string, any>
}

type DialogAction =
  | { type: 'OPEN_DIALOG'; id: string; data?: any }
  | { type: 'CLOSE_DIALOG'; id: string }
  | { type: 'UPDATE_DIALOG_DATA'; id: string; data: any }
  | { type: 'CLOSE_ALL_DIALOGS' }

const initialState: DialogState = {
  openDialogs: new Set(),
  dialogData: new Map(),
}

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'OPEN_DIALOG':
      const newOpenDialogs = new Set(state.openDialogs)
      newOpenDialogs.add(action.id)

      const newDialogData = new Map(state.dialogData)
      if (action.data) {
        newDialogData.set(action.id, action.data)
      }

      return {
        openDialogs: newOpenDialogs,
        dialogData: newDialogData,
      }

    case 'CLOSE_DIALOG':
      const closedOpenDialogs = new Set(state.openDialogs)
      closedOpenDialogs.delete(action.id)

      return {
        ...state,
        openDialogs: closedOpenDialogs,
      }

    case 'UPDATE_DIALOG_DATA':
      const updatedDialogData = new Map(state.dialogData)
      updatedDialogData.set(action.id, action.data)

      return {
        ...state,
        dialogData: updatedDialogData,
      }

    case 'CLOSE_ALL_DIALOGS':
      return {
        openDialogs: new Set(),
        dialogData: new Map(),
      }

    default:
      return state
  }
}

const DialogContext = createContext<{
  state: DialogState
  dispatch: React.Dispatch<DialogAction>
  openDialog: (id: string, data?: any) => void
  closeDialog: (id: string) => void
  updateDialogData: (id: string, data: any) => void
  closeAllDialogs: () => void
} | null>(null)

// プロバイダーコンポーネント
export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dialogReducer, initialState)

  const openDialog = useCallback((id: string, data?: any) => {
    dispatch({ type: 'OPEN_DIALOG', id, data })
  }, [])

  const closeDialog = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_DIALOG', id })
  }, [])

  const updateDialogData = useCallback((id: string, data: any) => {
    dispatch({ type: 'UPDATE_DIALOG_DATA', id, data })
  }, [])

  const closeAllDialogs = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_DIALOGS' })
  }, [])

  return (
    <DialogContext.Provider value={{
      state,
      dispatch,
      openDialog,
      closeDialog,
      updateDialogData,
      closeAllDialogs,
    }}>
      {children}
    </DialogContext.Provider>
  )
}

// フック
export function useDialog(id: string) {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }

  const {
    state,
    openDialog,
    closeDialog,
    updateDialogData,
  } = context

  const isOpen = state.openDialogs.has(id)
  const data = state.dialogData.get(id)

  return {
    isOpen,
    data,
    open: (dialogData?: any) => openDialog(id, dialogData),
    close: () => closeDialog(id),
    updateData: (newData: any) => updateDialogData(id, newData),
  }
}

// 使用例
export function OptimizedDialogExample() {
  const userDialog = useDialog('user')
  const settingsDialog = useDialog('settings')

  return (
    <div className="space-y-4">
      <button onClick={() => userDialog.open({ userId: 123 })}>
        ユーザーダイアログを開く
      </button>

      <button onClick={() => settingsDialog.open({ theme: 'dark' })}>
        設定ダイアログを開く
      </button>

      {userDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3>ユーザー情報</h3>
            <p>ユーザーID: {userDialog.data?.userId}</p>
            <button onClick={userDialog.close}>閉じる</button>
          </div>
        </div>
      )}

      {settingsDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3>設定</h3>
            <p>テーマ: {settingsDialog.data?.theme}</p>
            <button onClick={settingsDialog.close}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## まとめ

このセクションでは、v0とshadcn/uiを使用した対話型UIコンポーネントの実装方法について学びました。モーダル、ダイアログ、ドロワーの基本的な実装から、アクセシビリティ対応、パフォーマンス最適化まで、幅広いトピックをカバーしました。

:::note 要点のまとめ

- **モーダル**はユーザーの注意を集中させるための強力なUIパターン
- **ダイアログ**はAlert、Confirm、Prompt、Choiceの各タイプで適切に使い分ける
- **ドロワー**はモバイルフレンドリーな対話型UIとして効果的
- **アクセシビリティ**対応はフォーカストラッピングとキーボード操作が重要
- **パフォーマンス最適化**には動的インポートとメモ化が有効
- **v0プロンプト**の最適化により、高品質なコンポーネントを効率的に生成

:::

対話型UIコンポーネントは、ユーザーエクスペリエンスを大きく左右する重要な要素です。ここで学んだ技術を実践し、アクセシブルでパフォーマンスの良い対話型UIを構築してください。

## 関連リンク

- [shadcn/ui Dialogコンポーネント](https://ui.shadcn.com/docs/components/dialog)
- [Radix UI Dialogドキュメント](https://www.radix-ui.com/primitives/docs/components/dialog)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/WAI/ARIA/apg/)
- [React Performance Optimization](https://react.dev/reference/react/useMemo)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)

## さらに深く学習したい方へ

このコンテンツは、対話型UIコンポーネント開発の基礎を学ぶための導入編です。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **v0プロンプト設計コース**: AIコンポーネント生成の最適化技術
- **アクセシビリティ実践講座**: 包括的UI開発の専門知識
- **Reactパフォーマンス最適化**: 高速なアプリケーション開発
- **デザインシステム構築**: エンタープライズ向けコンポーネント開発

詳細はお問い合わせください。