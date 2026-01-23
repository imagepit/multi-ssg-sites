'use client'

import { usePathname } from 'next/navigation'
import { LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginButtonProps {
  className?: string
  variant?: 'icon' | 'full'
}

export function LoginButton({ className, variant = 'full' }: LoginButtonProps) {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-8 w-8 animate-pulse rounded-full bg-fd-muted" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    if (variant === 'icon') {
      return (
        <div className={`flex items-center gap-2 ${className || ''}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-fd-border bg-fd-secondary text-fd-foreground">
            <User className="h-4 w-4" />
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-fd-border bg-fd-secondary text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            aria-label="ログアウト"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )
    }

    return (
      <div className={`flex items-center gap-3 ${className || ''}`}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-fd-border bg-fd-secondary text-fd-foreground">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm text-fd-muted-foreground max-w-[120px] truncate">
            {user.email}
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          ログアウト
        </button>
      </div>
    )
  }

  // 未ログイン時: 現在のパスをnextパラメータに含める
  const loginUrl = pathname && pathname !== '/login'
    ? `/login?next=${encodeURIComponent(pathname)}`
    : '/login'

  if (variant === 'icon') {
    return (
      <a
        href={loginUrl}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-fd-border bg-fd-secondary text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground ${className || ''}`}
        aria-label="ログイン"
      >
        <LogIn className="h-4 w-4" />
      </a>
    )
  }

  return (
    <a
      href={loginUrl}
      className={`inline-flex items-center gap-1.5 rounded-md border border-fd-border px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground ${className || ''}`}
    >
      <LogIn className="h-3.5 w-3.5" />
      ログイン
    </a>
  )
}
