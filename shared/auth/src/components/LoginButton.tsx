'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export interface LoginButtonClassNames {
  container?: string
  loadingContainer?: string
  loadingIndicator?: string
  userContainer?: string
  userIcon?: string
  userEmail?: string
  logoutButton?: string
  logoutIcon?: string
  loginLink?: string
  loginIcon?: string
}

export interface LoginButtonProps {
  className?: string
  classNames?: LoginButtonClassNames
  variant?: 'icon' | 'full'
  icons?: {
    user?: ReactNode
    login?: ReactNode
    logout?: ReactNode
  }
  labels?: {
    login?: string
    logout?: string
    loading?: string
  }
}

export function LoginButton({
  className,
  classNames = {},
  variant = 'full',
  icons,
  labels = {},
}: LoginButtonProps) {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const {
    login: loginLabel = 'ログイン',
    logout: logoutLabel = 'ログアウト',
  } = labels

  if (isLoading) {
    return (
      <div className={classNames.loadingContainer || className}>
        <div className={classNames.loadingIndicator} />
      </div>
    )
  }

  if (isAuthenticated && user) {
    if (variant === 'icon') {
      return (
        <div className={classNames.userContainer || className}>
          <div className={classNames.userIcon}>
            {icons?.user}
          </div>
          <button
            type="button"
            onClick={logout}
            className={classNames.logoutButton}
            aria-label={logoutLabel}
          >
            {icons?.logout}
          </button>
        </div>
      )
    }

    return (
      <div className={classNames.userContainer || className}>
        <div className={classNames.userIcon}>
          {icons?.user}
        </div>
        <span className={classNames.userEmail}>
          {user.email}
        </span>
        <button
          type="button"
          onClick={logout}
          className={classNames.logoutButton}
        >
          {icons?.logout}
          {logoutLabel}
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
        className={classNames.loginLink || className}
        aria-label={loginLabel}
      >
        {icons?.login}
      </a>
    )
  }

  return (
    <a
      href={loginUrl}
      className={classNames.loginLink || className}
    >
      {icons?.login}
      {loginLabel}
    </a>
  )
}
