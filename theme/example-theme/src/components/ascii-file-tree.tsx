import React from 'react'

export function AsciiFileTree({ children }: { children?: React.ReactNode }) {
  // children is the raw text inside ```files code fence
  return (
    <pre className="fd-ascii-tree rounded-md border border-slate-200 bg-slate-50 p-3 overflow-auto text-sm leading-5">
      {typeof children === 'string' ? children : children as any}
    </pre>
  )
}

