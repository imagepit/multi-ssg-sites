---
title: ナビゲーション（Navbar/Sidebar/Tabs）
slug: navigation
parent: "components"
file_path: contents/v0/contents/components/navigation.md
target_user: フロントエンド開発者、UI/UXデザイナー、Reactエンジニア
goal: "v0で生成したナビゲーションコンポーネントをReactとTailwind CSSで実装し、アクセシブルでレスポンシブなNavbar、Sidebar、Tabsを構築する方法を学ぶ"
status: published
post_type: pages
seo_title: v0ナビゲーションコンポーネント実装ガイド | React+Tailwindで学ぶUI開発
seo_description: "v0で生成したナビゲーションコンポーネントをReactとTailwind CSSで実装する完全ガイド。Navbar、Sidebar、Tabsの作り方からレスポンシブ対応、アクセシビリティまで実践的に学べます。"
seo_keywords: "v0, Reactナビゲーション, Tailwind CSS, Navbar, Sidebar, Tabs, shadcn/ui, アクセシビリティ, レスポンシブデザイン"
handson_overview: "v0で生成したナビゲーションデザインをReactコンポーネントとして実装し、Next.jsのルーティングと統合するハンズオン。実際のプロジェクトで使えるナビゲーションコンポーネントを構築します。"
---

## はじめに

🧭 ナビゲーションコンポーネントは、ユーザーがサイト内を移動するための重要なUI要素です。v0で生成したNavbar、Sidebar、Tabsを、Reactとshadcn/uiを使って実践的に実装する方法を学びましょう。

### このページで学べる事

このセクションでは、ナビゲーションコンポーネントの設計から実装までを学びます。

:::note

- v0で生成したNavbarのレスポンシブ実装とモバイルメニュー
- Sidebarの展開/折りたたみ機能とネストされたナビゲーション
- Tabsの状態管理と動的コンテンツ切り替え
- ナビゲーションのアクセシビリティ対応
- ルーティングとの統合とアクティブ状態の管理

:::

## 🎯 Navbarコンポーネントの基礎

Navbarはサイトのヘッダーに配置される主要なナビゲーション要素です。ロゴ、メニュー項目、検索バー、ユーザーメニューなどを含み、レスポンシブデザインが重要です。

### Navbarの基本構造とレスポンシブ対応

:::note Navbarコンポーネントとは

Navbarコンポーネントは、ウェブサイトの最上部に配置される水平ナビゲーションバーです。ブランドロゴ、主要なナビゲーションリンク、検索機能、ユーザーアカウントメニューなどを含み、デスクトップとモバイルの両方で最適な表示を提供します。

:::

### Navbarコンポーネントを動かして確認してみよう

実際にNavbarコンポーネントを実装し、レスポンシブ機能を試してみましょう。

:::step

1. shadcn/ui関連コンポーネントのインストール

```bash
npx shadcn-ui@latest add button sheet navigation-menu avatar dropdown-menu
```

2. レスポンシブNavbarコンポーネントの作成

`src/components/ui/responsive-navbar.tsx`ファイルを作成します：

```tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Menu, Search, Bell, Settings, LogOut, ChevronDown } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  description?: string
  children?: NavItem[]
}

export interface ResponsiveNavbarProps {
  logo?: React.ReactNode
  navItems: NavItem[]
  userMenu?: {
    name: string
    email: string
    avatar?: string
    items: {
      label: string
      icon?: React.ReactNode
      onClick: () => void
    }[]
  }
  actions?: React.ReactNode
  className?: string
}

export function ResponsiveNavbar({
  logo,
  navItems,
  userMenu,
  actions,
  className
}: ResponsiveNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // スクロール時のスタイル変更
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <div className="flex items-center">
            {logo || (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">V0</span>
                </div>
                <span className="font-bold text-xl">Site</span>
              </div>
            )}
          </div>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="h-9">
                          {item.label}
                          <ChevronDown className="h-4 w-4" />
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-4 w-[400px]">
                            {item.children.map((child, childIndex) => (
                              <NavigationMenuLink
                                key={childIndex}
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {child.label}
                                </div>
                                {child.description && (
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {child.description}
                                  </p>
                                )}
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 右側アクション */}
          <div className="flex items-center space-x-2">
            {/* 検索ボタン */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* 通知ボタン */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-4 w-4" />
            </Button>

            {/* ユーザーメニュー */}
            {userMenu && (
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userMenu.avatar} alt={userMenu.name} />
                        <AvatarFallback>
                          {userMenu.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userMenu.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userMenu.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenu.items.map((item, index) => (
                      <DropdownMenuItem key={index} onClick={item.onClick}>
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* カスタムアクション */}
            {actions}

            {/* モバイルメニューボタン */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">V0</span>
                    </div>
                    <span className="font-bold text-xl">Site</span>
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item, index) => (
                      <div key={index}>
                        {item.children ? (
                          <div className="space-y-2">
                            <div className="font-medium text-sm text-muted-foreground">
                              {item.label}
                            </div>
                            <div className="ml-4 space-y-1">
                              {item.children.map((child, childIndex) => (
                                <a
                                  key={childIndex}
                                  href={child.href}
                                  className="block py-2 text-sm hover:text-primary"
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <a
                            href={item.href}
                            className="block py-2 text-sm font-medium hover:text-primary"
                          >
                            {item.label}
                          </a>
                        )}
                      </div>
                    ))}
                  </nav>

                  {userMenu && (
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userMenu.avatar} alt={userMenu.name} />
                          <AvatarFallback>
                            {userMenu.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{userMenu.name}</p>
                          <p className="text-xs text-muted-foreground">{userMenu.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {userMenu.items.map((item, index) => (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className="w-full text-left py-2 text-sm hover:text-primary flex items-center"
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

3. Navbarコンポーネントの使用例

```tsx
import { ResponsiveNavbar, type NavItem } from "@/components/ui/responsive-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, Settings, User, LogOut, Moon } from "lucide-react"

export function NavbarDemo() {
  const navItems: NavItem[] = [
    { label: "ホーム", href: "/" },
    {
      label: "製品",
      href: "/products",
      children: [
        { label: "すべての製品", href: "/products", description: "製品一覧を表示" },
        { label: "新着製品", href: "/products/new", description: "最新の製品情報" },
        { label: "人気製品", href: "/products/popular", description: "人気の製品ランキング" },
        { label: "カテゴリー", href: "/products/categories", description: "製品カテゴリー別表示" }
      ]
    },
    {
      label: "サービス",
      href: "/services",
      children: [
        { label: "コンサルティング", href: "/services/consulting", description: "専門的なコンサルティングサービス" },
        { label: "サポート", href: "/services/support", description: "技術サポートと保守" },
        { label: "トレーニング", href: "/services/training", description: "製品トレーニングプログラム" }
      ]
    },
    { label: "会社情報", href: "/about" },
    { label: "ブログ", href: "/blog" },
    { label: "お問い合わせ", href: "/contact" }
  ]

  const userMenu = {
    name: "山田太郎",
    email: "yamada@example.com",
    avatar: "https://ui-avatars.com/api/?name=Yamada&background=random",
    items: [
      { label: "プロフィール", icon: <User className="h-4 w-4" />, onClick: () => console.log("Profile") },
      { label: "設定", icon: <Settings className="h-4 w-4" />, onClick: () => console.log("Settings") },
      { label: "ダークモード", icon: <Moon className="h-4 w-4" />, onClick: () => console.log("Dark mode") },
      { label: "ログアウト", icon: <LogOut className="h-4 w-4" />, onClick: () => console.log("Logout") }
    ]
  }

  const actions = (
    <div className="hidden md:flex items-center space-x-2">
      <Input placeholder="検索..." className="w-64" />
      <Button size="sm">
        <Search className="h-4 w-4 mr-2" />
        検索
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar
        logo={
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">V0</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Navigation Demo
            </span>
          </div>
        }
        navItems={navItems}
        userMenu={userMenu}
        actions={actions}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">レスポンシブNavbarデモ</h1>
          <p className="text-muted-foreground">
            ウィンドウサイズを変更して、デスクトップとモバイルの表示を確認してください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">🖥️ デスクトップ表示</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 水平ナビゲーションバー</li>
              <li>• ドロップダウンメニュー</li>
              <li>• 検索バーとアクションボタン</li>
              <li>• ユーザーアバタードロップダウン</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">📱 モバイル表示</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• ハンバーガーメニュー</li>
              <li>• スライドインサイドバー</li>
              <li>• タッチ操作に最適化</li>
              <li>• 縦型ナビゲーション</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">✨ 高度な機能</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• スクロール時のスタイル変更</li>
              <li>• バックドロップブラー効果</li>
              <li>• スムーズなアニメーション</li>
              <li>• アクセシビリティ対応</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
```

:::

これでレスポンシブ対応のNavbarコンポーネントを実装できました。

## 📁 Sidebarコンポーネントの実装

Sidebarはアプリケーションの側面に配置される垂直ナビゲーション要素です。ダッシュボードや管理画面でよく使用され、展開/折りたたみ機能が重要です。

### Sidebarの状態管理とレスポンシブ対応

:::note Sidebarコンポーネントとは

Sidebarコンポーネントは、アプリケーションの左側または右側に配置される垂直ナビゲーションパネルです。階層的なナビゲーション構造をサポートし、ユーザーが関連機能に素早くアクセスできるようにします。

:::

### Sidebarコンポーネントを動かして確認してみよう

状態管理とレスポンシブ機能を持つSidebarコンポーネントを実装してみましょう。

:::step

1. shadcn/ui関連コンポーネントのインストール

```bash
npx shadcn-ui@latest add sheet button tooltip
```

2. サイドバーコンテキストの作成

`src/components/ui/sidebar-context.tsx`ファイルを作成します：

```tsx
import { createContext, useContext, useState, ReactNode } from "react"

type SidebarContext = {
  isCollapsed: boolean
  toggleCollapse: () => void
  isMobile: boolean
  setIsMobile: (isMobile: boolean) => void
  isOpen: boolean
  toggleOpen: () => void
}

const SidebarContext = createContext<SidebarContext | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <SidebarContext.Provider value={{
      isCollapsed,
      toggleCollapse,
      isMobile,
      setIsMobile,
      isOpen,
      toggleOpen,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
```

3. Sidebarコンポーネントの作成

`src/components/ui/collapsible-sidebar.tsx`ファイルを作成します：

```tsx
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"

export interface SidebarItem {
  icon: React.ReactNode
  label: string
  href?: string
  badge?: string | number
  children?: SidebarItem[]
  isActive?: boolean
  disabled?: boolean
}

export interface CollapsibleSidebarProps {
  items: SidebarItem[]
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  variant?: "default" | "inset" | "floating"
}

export function CollapsibleSidebar({
  items,
  header,
  footer,
  className,
  variant = "default"
}: CollapsibleSidebarProps) {
  const { isCollapsed, isMobile, isOpen, toggleCollapse, toggleOpen } = useSidebar()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // レスポンシブ検出
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [setIsMobile])

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  const renderNavItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.label)

    return (
      <div key={item.label}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.label)
            } else if (item.href) {
              window.location.href = item.href
            }
          }}
          disabled={item.disabled}
          className={cn(
            "w-full flex items-center justify-between p-2 rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            item.isActive && "bg-accent text-accent-foreground",
            item.disabled && "opacity-50 cursor-not-allowed",
            level > 0 && "ml-4"
          )}
        >
          <div className="flex items-center min-w-0">
            {item.icon && (
              <span className="flex-shrink-0 mr-2">
                {item.icon}
              </span>
            )}
            <span className={cn(
              "truncate",
              isCollapsed && "hidden"
            )}>
              {item.label}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {item.badge && (
              <span className={cn(
                "flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full",
                "bg-primary text-primary-foreground",
                isCollapsed && "hidden"
              )}>
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <span className={cn(
                "flex-shrink-0 transition-transform",
                isExpanded && "rotate-90",
                isCollapsed && "hidden"
              )}>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </button>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className={cn(
      "h-full flex flex-col bg-background border-r",
      variant === "floating" && "rounded-lg m-2 shadow-lg",
      variant === "inset" && "border-l-0 border-t-0 border-b-0 rounded-r-lg",
      isCollapsed ? "w-16" : "w-64",
      "transition-all duration-300"
    )}>
      {/* ヘッダー */}
      {header && (
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isCollapsed && "justify-center"
        )}>
          <div className={cn(
            "flex items-center space-x-2",
            isCollapsed && "hidden"
          )}>
            {header}
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-6 w-6"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* ナビゲーションアイテム */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <TooltipProvider>
          {items.map(item => (
            <Tooltip key={item.label} delayDuration={0}>
              <TooltipTrigger asChild>
                {renderNavItem(item)}
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      {/* フッター */}
      {footer && (
        <div className={cn(
          "p-4 border-t",
          isCollapsed && "hidden"
        )}>
          {footer}
        </div>
      )}
    </div>
  )

  // モバイル表示
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={toggleOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                {header}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleOpen}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {items.map(item => renderNavItem(item))}
            </nav>
            {footer && (
              <div className="p-4 border-t">
                {footer}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // デスクトップ表示
  return (
    <div className={cn("h-full", className)}>
      {sidebarContent}
    </div>
  )
}
```

4. Sidebarコンポーネントの使用例

```tsx
import { SidebarProvider, CollapsibleSidebar } from "@/components/ui/collapsible-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  HelpCircle,
  LogOut,
  Database,
  Shield,
  Bell,
  Package,
  Activity
} from "lucide-react"

export function SidebarDemo() {
  const sidebarItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "ダッシュボード",
      href: "/dashboard",
      isActive: true
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "ユーザー管理",
      href: "/users",
      children: [
        {
          icon: <Users className="h-4 w-4" />,
          label: "すべてのユーザー",
          href: "/users/all"
        },
        {
          icon: <Shield className="h-4 w-4" />,
          label: "管理者",
          href: "/users/admins"
        },
        {
          icon: <Activity className="h-4 w-4" />,
          label: "アクティブユーザー",
          href: "/users/active"
        }
      ]
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "製品管理",
      href: "/products",
      badge: "新"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "コンテンツ",
      href: "/content",
      children: [
        {
          icon: <FileText className="h-4 w-4" />,
          label: "記事",
          href: "/content/articles"
        },
        {
          icon: <Database className="h-4 w-4" />,
          label: "メディア",
          href: "/content/media"
        }
      ]
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "分析",
      href: "/analytics"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "設定",
      href: "/settings",
      children: [
        {
          icon: <Settings className="h-4 w-4" />,
          label: "一般設定",
          href: "/settings/general"
        },
        {
          icon: <Bell className="h-4 w-4" />,
          label: "通知設定",
          href: "/settings/notifications"
        }
      ]
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "ヘルプ",
      href: "/help"
    }
  ]

  const sidebarHeader = (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold">V0</span>
      </div>
      <span className="font-bold text-lg">Dashboard</span>
    </div>
  )

  const sidebarFooter = (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 h-auto">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="https://ui-avatars.com/api/?name=Yamada&background=random" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">山田太郎</p>
              <p className="text-xs text-muted-foreground">管理者</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">山田太郎</p>
              <p className="text-xs leading-none text-muted-foreground">
                yamada@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            設定
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <CollapsibleSidebar
          items={sidebarItems}
          header={sidebarHeader}
          footer={sidebarFooter}
          variant="default"
        />

        <div className="flex-1 overflow-auto">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">ダッシュボード</h1>
                <p className="text-sm text-muted-foreground">
                  サイドバーの展開/折りたたみ機能を試してみてください
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  通知
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">🔄 折りたたみ機能</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  サイドバー左下の矢印ボタンで折りたたみ/展開を切り替えられます
                </p>
                <ul className="text-sm space-y-1">
                  <li>• アイコンのみの表示</li>
                  <li>• ツールチップサポート</li>
                  <li>• スムーズなアニメーション</li>
                </ul>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">📱 レスポンシブ対応</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  モバイルデバイスでは自動的にメニューボタンに切り替わります
                </p>
                <ul className="text-sm space-y-1">
                  <li>• スライドインパネル</li>
                  <li>• タッチ操作対応</li>
                  <li>• オーバーレイ表示</li>
                </ul>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">🔀 階層ナビゲーション</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ネストされたメニュー項目をサポートしています
                </p>
                <ul className="text-sm space-y-1">
                  <li>• 展開/折りたたみ可能</li>
                  <li>• インジケーター表示</li>
                  <li>• 状態の保持</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 使用方法</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• ウィンドウサイズを768px以下にするとモバイルモードに切り替わります</li>
                <li>• サイドバーの幅は64px（折りたたみ時）〜256px（展開時）です</li>
                <li>• 各メニュー項目はホバー効果とフォーカス状態を持ちます</li>
                <li>• バッジ数値やアクティブ状態の表示が可能です</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
```

:::

これで高度な機能を持つSidebarコンポーネントを実装できました。

## 📑 Tabsコンポーネントの実装

Tabsはコンテンツをタブ形式で切り替えるためのUI要素です。状態管理、アクセシビリティ、アニメーションが重要です。

### Tabsの状態管理とアニメーション

:::note Tabsコンポーネントとは

Tabsコンポーネントは、関連するコンテンツをタブ形式で整理表示するUI要素です。ユーザーはクリックやキーボード操作で異なるコンテンツセクションを切り替えることができ、限られたスペースで多くの情報を効率的に表示します。

:::

### Tabsコンポーネントを動かして確認してみよう

状態管理とアニメーション機能を持つTabsコンポーネントを実装してみましょう。

:::step

1. shadcn/ui tabsコンポーネントのインストール

```bash
npx shadcn-ui@latest add tabs
```

2. 拡張Tabsコンポーネントの作成

`src/components/ui/advanced-tabs.tsx`ファイルを作成します：

```tsx
import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  badge?: string | number
  closable?: boolean
}

export interface AdvancedTabsProps {
  items: TabItem[]
  defaultValue?: string
  variant?: "default" | "line" | "pills"
  size?: "sm" | "default" | "lg"
  orientation?: "horizontal" | "vertical"
  collapsible?: boolean
  addable?: boolean
  onTabChange?: (tabId: string) => void
  onTabAdd?: () => void
  onTabClose?: (tabId: string) => void
  className?: string
}

export function AdvancedTabs({
  items,
  defaultValue,
  variant = "default",
  size = "default",
  orientation = "horizontal",
  collapsible = false,
  addable = false,
  onTabChange,
  onTabAdd,
  onTabClose,
  className
}: AdvancedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.id)
  const [tabsList, setTabsList] = useState(items)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  useEffect(() => {
    setTabsList(items)
  }, [items])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }, [onTabChange])

  const handleTabClose = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onTabClose?.(tabId)

    const updatedTabs = tabsList.filter(tab => tab.id !== tabId)
    setTabsList(updatedTabs)

    if (activeTab === tabId && updatedTabs.length > 0) {
      const newActiveTab = updatedTabs[0].id
      setActiveTab(newActiveTab)
      onTabChange?.(newActiveTab)
    }
  }, [activeTab, tabsList, onTabChange, onTabClose])

  const handleTabAdd = useCallback(() => {
    onTabAdd?.()
  }, [onTabAdd])

  // スクロールボタンの表示制御
  const checkScrollOverflow = useCallback((element: HTMLElement) => {
    if (element) {
      setShowScrollButtons(element.scrollWidth > element.clientWidth)
    }
  }, [])

  const scrollTabs = useCallback((direction: "left" | "right") => {
    const tabsListElement = document.querySelector('[role="tablist"]') as HTMLElement
    if (tabsListElement) {
      const scrollAmount = 200
      tabsListElement.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }, [])

  const getVariantStyles = () => {
    switch (variant) {
      case "line":
        return "border-b-0 data-[state=active]:border-b-2 data-[state=active]:border-primary"
      case "pills":
        return "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      default:
        return ""
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-xs"
      case "lg":
        return "h-12 px-6 text-base"
      default:
        return "h-10 px-4 py-2 text-sm"
    }
  }

  if (tabsList.length === 0) {
    return (
      <div className={cn("text-center p-8 text-muted-foreground", className)}>
        タブがありません
      </div>
    )
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      orientation={orientation}
      className={cn("w-full", className)}
    >
      <div className="relative">
        {showScrollButtons && orientation === "horizontal" && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6"
              onClick={() => scrollTabs("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6"
              onClick={() => scrollTabs("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <TabsList
          className={cn(
            "relative w-full bg-muted p-1",
            orientation === "vertical" && "flex-col h-auto",
            variant === "line" && "border-b border-transparent p-0 bg-transparent",
            collapsible && "overflow-x-auto overflow-y-hidden scrollbar-hide"
          )}
          ref={(element) => {
            if (element) {
              checkScrollOverflow(element)
            }
          }}
        >
          {tabsList.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                getVariantStyles(),
                getSizeStyles(),
                variant === "line" && "border-b-2 border-transparent data-[state=active]:bg-background",
                tab.disabled && "cursor-not-allowed"
              )}
            >
              <div className="flex items-center space-x-2">
                {tab.icon && (
                  <span className="flex-shrink-0">
                    {tab.icon}
                  </span>
                )}
                <span className="truncate">{tab.label}</span>
                {tab.badge && (
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    {tab.badge}
                  </Badge>
                )}
                {tab.closable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => handleTabClose(tab.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </TabsTrigger>
          ))}

          {addable && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 flex-shrink-0",
                getSizeStyles()
              )}
              onClick={handleTabAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </TabsList>
      </div>

      {tabsList.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className="mt-4 focus:outline-none"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

// 動的タブ管理フック
export function useDynamicTabs(initialTabs: TabItem[]) {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs)
  const [activeTab, setActiveTab] = useState(initialTabs[0]?.id || "")

  const addTab = useCallback((newTab: TabItem) => {
    setTabs(prev => [...prev, newTab])
    setActiveTab(newTab.id)
  }, [])

  const removeTab = useCallback((tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTab === tabId && tabs.length > 1) {
      const newActiveTab = tabs.find(tab => tab.id !== tabId)?.id || ""
      setActiveTab(newActiveTab)
    }
  }, [activeTab, tabs])

  const updateTab = useCallback((tabId: string, updates: Partial<TabItem>) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, ...updates } : tab
    ))
  }, [])

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prev => {
      const newTabs = [...prev]
      const [removed] = newTabs.splice(fromIndex, 1)
      newTabs.splice(toIndex, 0, removed)
      return newTabs
    })
  }, [])

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    removeTab,
    updateTab,
    reorderTabs
  }
}
```

3. Tabsコンポーネントの使用例

```tsx
import { AdvancedTabs, useDynamicTabs, type TabItem } from "@/components/ui/advanced-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Settings,
  User,
  FileText,
  Database,
  BarChart3,
  Plus,
  Trash2,
  Edit
} from "lucide-react"

export function TabsDemo() {
  const [tabCounter, setTabCounter] = useState(3)

  const initialTabs: TabItem[] = [
    {
      id: "overview",
      label: "概要",
      icon: <Home className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">ダッシュボード概要</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">総ユーザー数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">+12% 前月比</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">アクティブ率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.4%</div>
                <p className="text-xs text-muted-foreground">+5% 前月比</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">収益</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥2.4M</div>
                <p className="text-xs text-muted-foreground">+8% 前月比</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "users",
      label: "ユーザー",
      icon: <User className="h-4 w-4" />,
      badge: "23",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">ユーザー管理</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">U{i}</span>
                  </div>
                  <div>
                    <p className="font-medium">ユーザー {i}</p>
                    <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                  </div>
                </div>
                <Badge variant={i % 3 === 0 ? "secondary" : "default"}>
                  {i % 3 === 0 ? "非アクティブ" : "アクティブ"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "settings",
      label: "設定",
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">システム設定</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">一般設定</CardTitle>
                <CardDescription>
                  アプリケーションの基本設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>ダークモード</span>
                  <Button variant="outline" size="sm">
                    有効化
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>通知</span>
                  <Button variant="outline" size="sm">
                    設定
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">セキュリティ</CardTitle>
                <CardDescription>
                  アカウントのセキュリティ設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>2要素認証</span>
                  <Button variant="outline" size="sm">
                    有効化
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>パスワード変更</span>
                  <Button variant="outline" size="sm">
                    変更
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ]

  const { tabs, activeTab, setActiveTab, addTab, removeTab } = useDynamicTabs(initialTabs)

  const handleAddTab = () => {
    const newTab: TabItem = {
      id: `custom-${tabCounter}`,
      label: `カスタムタブ ${tabCounter}`,
      icon: <FileText className="h-4 w-4" />,
      badge: "新",
      closable: true,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">カスタムタブ {tabCounter}</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">新しいタブ</CardTitle>
              <CardDescription>
                これは動的に追加されたタブです
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>このタブは実行時に追加されました</p>
                <p>タブの追加、削除、状態管理が可能です</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </Button>
                  <Button size="sm" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    addTab(newTab)
    setTabCounter(prev => prev + 1)
  }

  const handleTabClose = (tabId: string) => {
    removeTab(tabId)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    console.log(`タブが変更されました: ${tabId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold">高度なTabsコンポーネント</h1>
        <p className="text-muted-foreground">
          状態管理、アニメーション、動的タブ操作を試してみてください
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🔄 動的タブ管理</CardTitle>
            <CardDescription>
              タブの追加、削除、状態変更が可能な高度なタブコンポーネント
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedTabs
              items={tabs}
              defaultValue={activeTab}
              variant="default"
              size="default"
              collapsible={true}
              addable={true}
              onTabChange={handleTabChange}
              onTabAdd={handleAddTab}
              onTabClose={handleTabClose}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 主な機能</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 動的タブの追加・削除</li>
                <li>• スクロール可能なタブリスト</li>
                <li>• タブのクローズ機能</li>
                <li>• バッジ表示</li>
                <li>• アイコンサポート</li>
                <li>• 状態管理</li>
                <li>• アニメーション効果</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 バリエーション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">ラインスタイル</h4>
                  <AdvancedTabs
                    items={[
                      { id: "line1", label: "タブ1", content: "ラインスタイルのコンテンツ1" },
                      { id: "line2", label: "タブ2", content: "ラインスタイルのコンテンツ2" }
                    ]}
                    variant="line"
                    size="sm"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">ピルスタイル</h4>
                  <AdvancedTabs
                    items={[
                      { id: "pill1", label: "タブ1", content: "ピルスタイルのコンテンツ1" },
                      { id: "pill2", label: "タブ2", content: "ピルスタイルのコンテンツ2" }
                    ]}
                    variant="pills"
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">🔧 アクセシビリティ機能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 space-y-2">
              <p>このTabsコンポーネントは以下のアクセシビリティ機能をサポートしています：</p>
              <ul className="text-sm space-y-1">
                <li>• キーボードナビゲーション（Tab/Shift+Tab）</li>
                <li>• 方向キーでのタブ移動（左右矢印）</li>
                <li>• Home/Endキーでの先頭/末尾移動</li>
                <li>• スクリーンリーダー対応</li>
                <li>• 適切なARIA属性</li>
                <li>• フォーカス管理</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

:::

これで高度な機能を持つTabsコンポーネントを実装できました。

## ♿ アクセシビリティの考慮

ナビゲーションコンポーネントは、すべてのユーザーがサイト内を移動できるようにアクセシビリティ対応が特に重要です。

### アクセシブルなナビゲーションの実装

:::note ナビゲーションのアクセシビリティ

ナビゲーションコンポーネントのアクセシビリティでは、キーボード操作、スクリーンリーダー対応、適切なARIA属性の使用が不可欠です。特に視覚障害のあるユーザーがコンテンツの構造を理解できるように設計する必要があります。

:::

### アクセシブルなナビゲーションを動かして確認してみよう

アクセシビリティ対応を強化したナビゲーションコンポーネントを実装してみましょう。

:::step

1. アクセシブルなナビゲーションコンポーネントの作成

`src/components/ui/accessible-navigation.tsx`ファイルを作成します：

```tsx
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AccessibleNavItem {
  id: string
  label: string
  href: string
  description?: string
  children?: AccessibleNavItem[]
  current?: boolean
}

export interface AccessibleNavigationProps {
  items: AccessibleNavItem[]
  orientation?: "horizontal" | "vertical"
  label: string
  description?: string
  className?: string
}

export function AccessibleNavigation({
  items,
  orientation = "horizontal",
  label,
  description,
  className
}: AccessibleNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const navRef = useRef<HTMLElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const item = items[index]

    switch (event.key) {
      case "Enter":
      case " ":
        if (item.children) {
          toggleExpanded(item.id)
        } else if (item.href) {
          window.location.href = item.href
        }
        event.preventDefault()
        break

      case "ArrowRight":
        if (orientation === "horizontal") {
          const nextIndex = (index + 1) % items.length
          setFocusedIndex(nextIndex)
          event.preventDefault()
        }
        break

      case "ArrowLeft":
        if (orientation === "horizontal") {
          const prevIndex = (index - 1 + items.length) % items.length
          setFocusedIndex(prevIndex)
          event.preventDefault()
        }
        break

      case "ArrowDown":
        if (orientation === "vertical") {
          const nextIndex = (index + 1) % items.length
          setFocusedIndex(nextIndex)
          event.preventDefault()
        }
        break

      case "ArrowUp":
        if (orientation === "vertical") {
          const prevIndex = (index - 1 + items.length) % items.length
          setFocusedIndex(prevIndex)
          event.preventDefault()
        }
        break

      case "Home":
        setFocusedIndex(0)
        event.preventDefault()
        break

      case "End":
        setFocusedIndex(items.length - 1)
        event.preventDefault()
        break

      case "Escape":
        if (item.children && expandedItems.has(item.id)) {
          toggleExpanded(item.id)
          event.preventDefault()
        }
        break
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // フォーカス外クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setExpandedItems(new Set())
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const renderNavItem = (item: AccessibleNavItem, index: number, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isFocused = focusedIndex === index

    return (
      <div key={item.id} className="relative">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left",
            level > 0 && "ml-4",
            item.current && "bg-accent text-accent-foreground",
            isFocused && "ring-2 ring-ring"
          )}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-haspopup={hasChildren ? "true" : undefined}
          aria-current={item.current ? "page" : undefined}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else if (item.href) {
              window.location.href = item.href
            }
          }}
        >
          {item.label}
          {hasChildren && (
            <span className="ml-auto transition-transform" aria-hidden="true">
              {isExpanded ? "▼" : "►"}
            </span>
          )}
        </Button>

        {hasChildren && isExpanded && (
          <div
            role="menu"
            className={cn(
              "absolute left-full top-0 ml-1 w-48 bg-background border rounded-md shadow-lg z-50",
              orientation === "vertical" && "left-full top-0",
              orientation === "horizontal" && "top-full left-0 mt-1"
            )}
          >
            {item.children.map((child, childIndex) => (
              <Button
                key={child.id}
                variant="ghost"
                className="w-full justify-start text-left"
                role="menuitem"
                aria-current={child.current ? "page" : undefined}
                onClick={() => {
                  if (child.href) {
                    window.location.href = child.href
                  }
                }}
              >
                {child.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label={label}
      aria-describedby={description ? `${label}-description` : undefined}
      className={cn(
        orientation === "horizontal" && "flex space-x-1",
        orientation === "vertical" && "space-y-1",
        className
      )}
    >
      {description && (
        <p id={`${label}-description`} className="sr-only">
          {description}
        </p>
      )}

      {items.map((item, index) => renderNavItem(item, index))}
    </nav>
  )
}

// スキップリンクコンポーネント
export function SkipLinks() {
  const [showSkipLinks, setShowSkipLinks] = useState(false)

  useEffect(() => {
    const handleTabPress = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setShowSkipLinks(true)
        setTimeout(() => setShowSkipLinks(false), 5000)
      }
    }

    document.addEventListener("keydown", handleTabPress)
    return () => document.removeEventListener("keydown", handleTabPress)
  }, [])

  if (!showSkipLinks) return null

  return (
    <div className="fixed top-0 left-0 z-[9999] bg-background border-b">
      <a
        href="#main-content"
        className="block px-4 py-2 text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        メインコンテンツにスキップ
      </a>
      <a
        href="#navigation"
        className="block px-4 py-2 text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        ナビゲーションにスキップ
      </a>
    </div>
  )
}

// ブレッドクラムコンポーネント
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export function AccessibleBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="パンくずリスト" className="flex items-center space-x-1 text-sm">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="mx-2">
                  /
                </span>
              )}

              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-primary underline"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={isLast ? "font-medium text-foreground" : "text-muted-foreground"}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

2. アクセシビリティテストの使用例

```tsx
import {
  AccessibleNavigation,
  SkipLinks,
  AccessibleBreadcrumb,
  type AccessibleNavItem
} from "@/components/ui/accessible-navigation"

export function AccessibilityDemo() {
  const navItems: AccessibleNavItem[] = [
    {
      id: "home",
      label: "ホーム",
      href: "/",
      description: "サイトのトップページに移動します",
      current: true
    },
    {
      id: "products",
      label: "製品",
      href: "/products",
      description: "製品一覧ページに移動します",
      children: [
        { id: "software", label: "ソフトウェア", href: "/products/software" },
        { id: "hardware", label: "ハードウェア", href: "/products/hardware" },
        { id: "services", label: "サービス", href: "/products/services" }
      ]
    },
    {
      id: "company",
      label: "会社情報",
      href: "/about",
      description: "会社情報ページに移動します"
    },
    {
      id: "contact",
      label: "お問い合わせ",
      href: "/contact",
      description: "お問い合わせページに移動します"
    }
  ]

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "製品", href: "/products" },
    { label: "アクセシビリティ", href: "/products/accessibility", current: true }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />

      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">アクセシブルナビゲーションデモ</h1>
          <p className="text-muted-foreground">
            キーボード操作でナビゲーションを試してください（Tab, 矢印キー, Enter, Space）
          </p>
        </div>
      </header>

      <nav id="navigation" className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <AccessibleBreadcrumb items={breadcrumbItems} />
        </div>
      </nav>

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">水平ナビゲーション</h2>
            <div className="p-6 border rounded-lg">
              <AccessibleNavigation
                items={navItems}
                orientation="horizontal"
                label="メインナビゲーション"
                description="サイトの主要なセクションへのリンクです"
                className="max-w-md"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">垂直ナビゲーション</h2>
            <div className="p-6 border rounded-lg">
              <AccessibleNavigation
                items={navItems}
                orientation="vertical"
                label="サイドナビゲーション"
                description="サイドバーのナビゲーションリンクです"
                className="w-64"
              />
            </div>
          </section>

          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">♿ アクセシビリティ機能</h2>
            <div className="text-green-800 space-y-4">
              <div>
                <h3 className="font-medium mb-2">キーボード操作</h3>
                <ul className="text-sm space-y-1">
                  <li>• <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>: フォーカス移動</li>
                  <li>• <kbd>Enter</kbd> / <kbd>Space</kbd>: リンク選択・メニュー展開</li>
                  <li>• <kbd>矢印キー</kbd>: メニュー項目間移動</li>
                  <li>• <kbd>Home</kbd> / <kbd>End</kbd>: 先頭・末尾に移動</li>
                  <li>• <kbd>Escape</kbd>: メニューを閉じる</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">スクリーンリーダー対応</h3>
                <ul className="text-sm space-y-1">
                  <li>• 適切なARIA属性（role, aria-label, aria-expanded）</li>
                  <li>• 現在のページを示すaria-current属性</li>
                  <li>• メニューの階層構造の正確な伝達</li>
                  <li>• スキップリンクによる主要コンテンツへの直接アクセス</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">視覚的アクセシビリティ</h3>
                <ul className="text-sm space-y-1">
                  <li>• 十分なコントラスト比</li>
                  <li>• 明確なフォーカスインジケーター</li>
                  <li>• ホバー状態の視覚的フィードバック</li>
                  <li>• 一貫したインタラクションパターン</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">テスト手順</h2>
            <div className="p-6 border rounded-lg space-y-4">
              <div>
                <h3 className="font-medium mb-2">キーボードナビゲーションテスト</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li><kbd>Tab</kbd>キーでナビゲーションにフォーカス</li>
                  <li><kbd>矢印キー</kbd>でメニュー項目間を移動</li>
                  <li><kbd>Enter</kbd>または<kbd>Space</kbd>でリンクを選択</li>
                  <li><kbd>Escape</kbd>で開いたメニューを閉じる</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium mb-2">スクリーンリーダーテスト</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>スクリーンリーダーを起動</li>
                  <li><kbd>Tab</kbd>キーで各要素に移動</li>
                  <li>要素のラベルや状態が正しく読み上げられるか確認</li>
                  <li>ナビゲーションの階層構造が理解できるか確認</li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
```

:::

これでアクセシビリティ対応のナビゲーションコンポーネントを実装できました。

## 🎨 v0プロンプトの最適化

v0で高品質なナビゲーションコンポーネントを生成するためのプロンプト設計テクニックを学びましょう。

### 効果的なプロンプトパターン

:::note ナビゲーションコンポーネントのプロンプト設計

ナビゲーションコンポーネントのプロンプト設計では、レスポンシブ要件、状態管理、アクセシビリティ要件、アニメーション要件を具体的に記述することが重要です。複数のデバイスやユーザー操作を考慮した設計を明確に伝えましょう。

:::

### v0プロンプトを動かして確認してみよう

実際のプロンプト例を使って、v0でコンポーネントを生成してみましょう。

:::step

1. Navbarコンポーネント生成プロンプト

```bash
Create a responsive navigation bar component with React and Tailwind CSS. The navbar should include:

1. Core Features:
- Logo/branding section
- Main navigation links with dropdown support
- User menu with avatar and dropdown
- Search functionality
- Mobile hamburger menu
- Notification bell icon
- Responsive design (desktop/tablet/mobile)

2. Dropdown Menu Support:
- Multi-level dropdown menus
- Hover and click triggers
- Smooth animations
- Keyboard navigation support
- Accessible ARIA attributes

3. Mobile Features:
- Slide-in mobile menu
- Touch-friendly interface
- Overlay when menu is open
- Smooth transitions
- Backdrop blur effect

4. Responsive Behavior:
- Desktop: Full horizontal navbar
- Tablet: Condensed navigation
- Mobile: Hamburger menu with vertical navigation

5. Accessibility:
- Keyboard navigation (Tab, arrows, Enter, Escape)
- Screen reader support
- Focus management
- Skip links
- ARIA labels and roles

Please use shadcn/ui components where appropriate, implement with TypeScript, and include proper documentation and examples.
```

2. Sidebarコンポーネント生成プロンプト

```bash
Create a collapsible sidebar navigation component with React and TypeScript. The sidebar should include:

1. Core Functionality:
- Expandable/collapsible sidebar
- Nested navigation items
- Icons and labels
- Badges and indicators
- Active state management
- User profile section in footer

2. Interaction Features:
- Click to expand/collapse
- Hover tooltips for collapsed state
- Smooth width transitions
- Nested menu expansion
- Keyboard navigation support

3. Responsive Design:
- Desktop: Persistent sidebar
- Tablet: Auto-collapse on smaller screens
- Mobile: Hidden behind menu button with slide-in panel

4. Visual Features:
- Different variants (default, inset, floating)
- Collapsed state with icons only
- Expand/collapse animation
- Hover effects and focus states
- Backdrop shadow effects

5. State Management:
- Context-based state management
- Local storage for user preferences
- Responsive state handling
- Active item tracking
- Expanded/collapsed state persistence

Use modern React patterns with hooks, implement proper TypeScript interfaces, and ensure full accessibility compliance.
```

3. Tabsコンポーネント生成プロンプト

```bash
Create an advanced tabs component with React and Tailwind CSS. The tabs should support:

1. Core Tab Features:
- Multiple tab variants (default, line, pills)
- Dynamic tab management (add/remove tabs)
- Tab content lazy loading
- Tab reordering with drag-and-drop
- Disabled tab states
- Tab badges and icons

2. Advanced Interactions:
- Scrollable tab lists for many tabs
- Tab overflow indicators
- Closeable tabs with X button
- Keyboard navigation between tabs
- Tab persistence and state management

3. Visual Features:
- Smooth tab transitions
- Active/inactive states
- Hover effects
- Focus indicators
- Loading states for tab content

4. Accessibility Features:
- Full keyboard navigation support
- Screen reader compatibility
- ARIA tab panel pattern
- Focus management
- Tab list roles and properties

5. Responsive Design:
- Horizontal tabs for desktop
- Vertical tabs for mobile
- Wrap behavior for small screens
- Touch-friendly interface

Implement with React hooks for state management, use shadcn/ui as base, and include comprehensive examples and documentation.
```

4. 統合ナビゲーションシステム生成プロンプト

```bash
Create a comprehensive navigation system that combines navbar, sidebar, and tabs. The system should include:

1. Main Navigation Components:
- Responsive header with logo and main menu
- Collapsible sidebar with nested navigation
- Tab-based content switching
- Breadcrumb navigation
- Skip links for accessibility

2. State Management:
- Unified navigation state
- Active route tracking
- User preferences (sidebar collapsed state)
- Tab state persistence
- Mobile menu state management

3. Responsive Behavior:
- Different layouts for different screen sizes
- Seamless transitions between layouts
- Consistent navigation patterns
- Touch-optimized interactions

4. Advanced Features:
- Search functionality across navigation
- User notifications integration
- Quick access menu
- Recently visited items
- Favorites/bookmarks support

5. Performance & Accessibility:
- Lazy loading of navigation content
- Efficient re-renders
- Full keyboard navigation
- Screen reader support
- Focus trap management

Use Next.js for routing, implement with TypeScript, and create a fully functional demo showcasing all navigation patterns.
```

:::

これでv0で効果的なナビゲーションコンポーネントを生成するためのプロンプト設計を学びました。

## 🚀 ベストプラクティスとパフォーマンス

ナビゲーションコンポーネントを実装する際のベストプラクティスとパフォーマンス最適化テクニックを学びましょう。

### ナビゲーションの最適化戦略

:::note ナビゲーションのパフォーマンス

ナビゲーションコンポーネントは頻繁に使用されるため、パフォーマンス最適化が重要です。メモ化、効率的な状態管理、最適なレンダリング戦略を使用して、スムーズなユーザー体験を提供する必要があります。

:::

### 最適化されたナビゲーションを実装してみよう

パフォーマンスを考慮したナビゲーションコンポーネントを実装してみましょう。

:::step

1. メモ化されたナビゲーションコンポーネント

```tsx
import React, { memo, useMemo, useCallback, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// メモ化されたナビゲーションアイテム
interface OptimizedNavItem {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  exact?: boolean
}

export const OptimizedNavItem = memo(function OptimizedNavItem({
  item,
  isActive,
  onClick
}: {
  item: OptimizedNavItem
  isActive: boolean
  onClick: (href: string) => void
}) {
  const handleClick = useCallback(() => {
    onClick(item.href)
  }, [item.href, onClick])

  // メモ化されたスタイル計算
  const itemClasses = useMemo(() => cn(
    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring",
    isActive && "bg-accent text-accent-foreground",
    !isActive && "text-muted-foreground"
  ), [isActive])

  return (
    <button
      className={itemClasses}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="flex-shrink-0 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  )
})

// ルートベースのアクティブ状態検出フック
export function useRouteActive() {
  const pathname = usePathname()

  const isActive = useCallback((href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }, [pathname])

  return { isActive }
}

// 最適化されたナビゲーションコンポーネント
export function OptimizedNavigation({ items }: { items: OptimizedNavItem[] }) {
  const { isActive } = useRouteActive()
  const [mounted, setMounted] = useState(false)

  // クライアントサイドでのみレンダリングを保証
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleItemClick = useCallback((href: string) => {
    // ルート変更の処理
    console.log(`Navigating to: ${href}`)
  }, [])

  // メモ化されたアクティブアイテムの計算
  const activeItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      isActive: isActive(item.href, item.exact)
    }))
  }, [items, isActive])

  if (!mounted) {
    return <div className="h-10 bg-muted animate-pulse" />
  }

  return (
    <nav className="flex items-center space-x-1" aria-label="Main navigation">
      {activeItems.map((item) => (
        <OptimizedNavItem
          key={item.id}
          item={item}
          isActive={item.isActive}
          onClick={handleItemClick}
        />
      ))}
    </nav>
  )
}

// リソースプリローディング機能
export function useNavigationPrefetch() {
  const prefetch = useCallback((href: string) => {
    // Next.jsのプリフェッチ機能
    if (typeof window !== "undefined") {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = href
      document.head.appendChild(link)

      // 5秒後にクリーンアップ
      setTimeout(() => {
        document.head.removeChild(link)
      }, 5000)
    }
  }, [])

  return { prefetch }
}

// ナビゲーションパフォーマンスモニタリング
export function useNavigationPerf() {
  const [navigationTimes, setNavigationTimes] = useState<number[]>([])

  const measureNavigation = useCallback((callback: () => void) => {
    const startTime = performance.now()
    callback()
    const endTime = performance.now()

    setNavigationTimes(prev => {
      const newTimes = [...prev, endTime - startTime]
      // 最新10回のみ保持
      return newTimes.slice(-10)
    })
  }, [])

  const averageTime = useMemo(() => {
    if (navigationTimes.length === 0) return 0
    return navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length
  }, [navigationTimes])

  return { measureNavigation, averageTime, navigationTimes }
}
```

2. 最適化されたナビゲーションシステムの実装

```tsx
import { OptimizedNavigation, useRouteActive, useNavigationPrefetch } from "./optimized-navigation"
import { useMemo, useCallback } from "react"

interface NavigationSystemProps {
  mainNavItems: OptimizedNavItem[]
  sidebarItems: OptimizedNavItem[]
  userMenuItems: OptimizedNavItem[]
}

export function NavigationSystem({
  mainNavItems,
  sidebarItems,
  userMenuItems
}: NavigationSystemProps) {
  const { isActive } = useRouteActive()
  const { prefetch } = useNavigationPrefetch()

  // メモ化されたナビゲーションアイテムの準備
  const processedMainNav = useMemo(() => {
    return mainNavItems.map(item => ({
      ...item,
      isActive: isActive(item.href, item.exact)
    }))
  }, [mainNavItems, isActive])

  const processedSidebar = useMemo(() => {
    return sidebarItems.map(item => ({
      ...item,
      isActive: isActive(item.href, item.exact)
    }))
  }, [sidebarItems, isActive])

  // ホバー時のプリフェッチ処理
  const handleHover = useCallback((href: string) => {
    prefetch(href)
  }, [prefetch])

  // クリック処理
  const handleClick = useCallback((href: string) => {
    // ナビゲーション処理
    console.log(`Navigation clicked: ${href}`)
  }, [])

  return (
    <div className="navigation-system">
      {/* メインナビゲーション */}
      <header className="main-header">
        <OptimizedNavigation items={processedMainNav} />
      </header>

      {/* サイドバーナビゲーション */}
      <aside className="sidebar">
        <OptimizedNavigation items={processedSidebar} />
      </aside>

      {/* ユーザーメニー */}
      <div className="user-menu">
        <OptimizedNavigation items={userMenuItems} />
      </div>
    </div>
  )
}
```

3. 使用例とパフォーマンステスト

```tsx
import {
  NavigationSystem,
  useNavigationPerf,
  type OptimizedNavItem
} from "@/components/ui/optimized-navigation-system"
import { Home, Settings, User, FileText, Database } from "lucide-react"

export function NavigationPerfDemo() {
  const { measureNavigation, averageTime } = useNavigationPerf()

  const mainNavItems: OptimizedNavItem[] = [
    { id: "home", label: "ホーム", href: "/", icon: <Home className="h-4 w-4" />, exact: true },
    { id: "products", label: "製品", href: "/products", icon: <FileText className="h-4 w-4" /> },
    { id: "services", label: "サービス", href: "/services", icon: <Database className="h-4 w-4" /> },
    { id: "about", label: "会社情報", href: "/about" },
    { id: "contact", label: "お問い合わせ", href: "/contact" }
  ]

  const sidebarItems: OptimizedNavItem[] = [
    { id: "dashboard", label: "ダッシュボード", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
    { id: "users", label: "ユーザー管理", href: "/users", icon: <User className="h-4 w-4" />, badge: "23" },
    { id: "settings", label: "設定", href: "/settings", icon: <Settings className="h-4 w-4" /> },
    { id: "reports", label: "レポート", href: "/reports", icon: <FileText className="h-4 w-4" /> }
  ]

  const userMenuItems: OptimizedNavItem[] = [
    { id: "profile", label: "プロフィール", href: "/profile", icon: <User className="h-4 w-4" /> },
    { id: "settings", label: "設定", href: "/settings", icon: <Settings className="h-4 w-4" /> }
  ]

  const handleNavigation = (href: string) => {
    measureNavigation(() => {
      console.log(`Navigating to: ${href}`)
      // 実際のナビゲーション処理
    })
  }

  return (
    <div className="space-y-8">
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">最適化されたナビゲーションシステム</h3>
        <NavigationSystem
          mainNavItems={mainNavItems}
          sidebarItems={sidebarItems}
          userMenuItems={userMenuItems}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h4 className="font-medium mb-2">🚀 パフォーマンス最適化</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• メモ化されたコンポーネント</li>
            <li>• 効率的な再レンダリング</li>
            <li>• リソースプリフェッチ</li>
            <li>• 遅延読み込み</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h4 className="font-medium mb-2">📊 パフォーマンス情報</h4>
          <div className="text-sm space-y-1">
            <div>平均ナビゲーション時間: {averageTime.toFixed(2)}ms</div>
            <div>メモ化されたアイテム: {mainNavItems.length + sidebarItems.length + userMenuItems.length}</div>
            <div>最適化技術: React.memo, useMemo, useCallback</div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-medium text-green-900 mb-2">💡 最適化のベネフィット</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• 不要な再レンダリングの削減によるパフォーマンス向上</li>
          <li>• ユーザー操作に対する応答性の改善</li>
          <li>• メモリ使用量の最適化</li>
          <li>• 大規模アプリケーションでのスケーラビリティ向上</li>
        </ul>
      </div>
    </div>
  )
}
```

:::

これでパフォーマンス最適化されたナビゲーションコンポーネントを実装できました。

## まとめ

このページでは、ナビゲーションコンポーネントの実装について学びました。v0で生成したコンポーネントを基に、実践的なカスタマイズと最適化の手法を習得しました。

:::note 要点のまとめ

- Navbarはレスポンシブデザインとモバイルメニューが重要
- Sidebarは展開/折りたたみ機能と状態管理がカギ
- Tabsは動的なタブ管理とアニメーションが特徴
- アクセシビリティ対応はすべてのナビゲーションコンポーネントに必須
- パフォーマンス最適化により、スムーズなユーザー体験を提供
- v0プロンプトの設計により、高品質なナビゲーションコンポーネントを生成可能

:::

これらのナビゲーションコンポーネントは、ユーザーがサイト内を効果的に移動するための基礎となります。次は[モーダル/ダイアログ/ドロワー](./modals-dialogs-drawers.md)を学び、ユーザー対話のためのコンポーネントの実装方法を習得していきましょう。

## 関連リンク

- [shadcn/ui Navigation Menuコンポーネント](https://ui.shadcn.com/docs/components/navigation-menu)
- [shadcn/ui Tabsコンポーネント](https://ui.shadcn.com/docs/components/tabs)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Routerドキュメント](https://reactrouter.com/)
- [アクセシブルなナビゲーション設計](https://www.w3.org/WAI/WCAG21/quickref/#navigation)
- [Next.jsルーティング](https://nextjs.org/docs/app/building-your-application/routing)

## さらに深く学習したい方へ

このコンテンツは、v0とReactコンポーネント開発の基礎を学ぶための導入編です。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **v0実践コース**: プロンプト設計から本番環境へのデプロイまで
- **Reactデザインシステム構築**: エンタープライズ向けコンポーネント開発
- **アクセシビリティ実践講座**: 包括的UI開発の専門知識
- **パフォーマンス最適化コース**: 高速なReactアプリケーション開発

詳細はお問い合わせください。