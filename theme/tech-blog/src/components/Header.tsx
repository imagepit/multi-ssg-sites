"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function Header({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="tb-header">
      <div className="tb-container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" className="tb-brand" style={{ flex: 1 }}>{siteName}</Link>
        <nav className="tb-nav">
          <Link href="/">Home</Link>
          <Link href="/tags">Tags</Link>
          <Link href="/categories">Categories</Link>
        </nav>
        {/* Placeholder search button; hook up to static search later */}
        <button aria-label="Search" className="search-btn" onClick={() => setOpen(!open)} style={{ marginLeft: 8 }}>
          🔎
        </button>
      </div>
    </header>
  )
}

