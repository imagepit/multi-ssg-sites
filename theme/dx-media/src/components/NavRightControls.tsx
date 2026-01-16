'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Monitor, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun } from 'lucide-react'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

type NavRightControlsProps = {
  variant?: 'lg' | 'sm'
}

const cn = (...inputs: Array<string | null | undefined | false>) => clsx(inputs)

const SIDEBAR_HIDDEN_CLASS = 'dx-sidebar-hidden'
const SIDEBAR_STORAGE_KEY = 'dx-sidebar-hidden'

function SearchToggleButton({ className }: { className?: string }) {
  const { setOpenSearch, enabled } = useSearchContext()
  if (!enabled) return null
  return (
    <button
      type="button"
      data-search=""
      aria-label="Open Search"
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-fd-border/70 bg-fd-secondary/50 p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      onClick={() => setOpenSearch(true)}
    >
      <Search className="size-4" />
    </button>
  )
}

function LargeSearchToggleButton({ className }: { className?: string }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext()
  const { text } = useI18n()
  if (!enabled) return null
  return (
    <button
      type="button"
      data-search-full=""
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-fd-border/70 bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      onClick={() => setOpenSearch(true)}
    >
      <Search className="size-4" />
      {text.search}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd key={i} className="rounded-md border bg-fd-background px-1.5">
            {k.display}
          </kbd>
        ))}
      </div>
    </button>
  )
}

function useSidebarToggleState() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [showSidebarToggle, setShowSidebarToggle] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const hasSidebar = Boolean(
      document.getElementById('nd-notebook-layout') ||
        document.getElementById('nd-docs-layout') ||
        document.getElementById('nd-sidebar'),
    )
    setShowSidebarToggle(hasSidebar)
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored === '1') {
      setSidebarHidden(true)
      return
    }
    if (stored === '0') {
      setSidebarHidden(false)
      return
    }
    setSidebarHidden(document.documentElement.classList.contains(SIDEBAR_HIDDEN_CLASS))
  }, [mounted, pathname])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle(SIDEBAR_HIDDEN_CLASS, sidebarHidden)
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarHidden ? '1' : '0')
  }, [mounted, sidebarHidden])

  return {
    showSidebarToggle,
    sidebarHidden,
    toggleSidebar: () => setSidebarHidden((prev) => !prev),
  }
}

function SidebarToggleButton({
  className,
  hidden,
  onToggle,
}: {
  className?: string
  hidden: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={hidden ? 'Show sidebar' : 'Hide sidebar'}
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-fd-border/70 bg-fd-secondary/50 p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      onClick={onToggle}
    >
      {hidden ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
    </button>
  )
}

function ThemeToggleControl({ className }: { className?: string }) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const value = mounted ? theme : null
  const display = mounted ? resolvedTheme : null

  return (
    <div
      data-theme-toggle=""
      className={cn('inline-flex items-center rounded-full border border-fd-border/70 p-1', className)}
    >
      {[
        { key: 'light', icon: Sun, active: display === 'light' || value === 'light' },
        { key: 'dark', icon: Moon, active: display === 'dark' || value === 'dark' },
        { key: 'system', icon: Monitor, active: value === 'system' },
      ].map(({ key, icon: Icon, active }) => (
        <button
          key={key}
          type="button"
          aria-label={key}
          className={cn(
            'size-7 rounded-full p-1.5 text-fd-muted-foreground transition-colors',
            active && 'bg-fd-accent text-fd-accent-foreground',
          )}
          onClick={() => setTheme(key)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  )
}

export function NavRightControls({ variant = 'lg' }: NavRightControlsProps) {
  const { showSidebarToggle, sidebarHidden, toggleSidebar } = useSidebarToggleState()

  if (variant === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <SearchToggleButton className="p-2" />
        {showSidebarToggle && (
          <SidebarToggleButton hidden={sidebarHidden} onToggle={toggleSidebar} />
        )}
        <ThemeToggleControl />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <LargeSearchToggleButton className="w-56 max-w-[220px] ps-2.5" />
      {showSidebarToggle && (
        <SidebarToggleButton hidden={sidebarHidden} onToggle={toggleSidebar} />
      )}
      <ThemeToggleControl />
    </div>
  )
}
