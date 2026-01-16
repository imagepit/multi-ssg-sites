'use client'

type StatusPillProps = {
  status?: string | null
}

const STATUS_CLASS: Record<string, string> = {
  active: 'admin-pill admin-pill--active',
  disabled: 'admin-pill admin-pill--disabled',
  archived: 'admin-pill admin-pill--archived',
  draft: 'admin-pill admin-pill--draft',
  publish: 'admin-pill admin-pill--active',
  published: 'admin-pill admin-pill--active',
}

export function StatusPill({ status }: StatusPillProps) {
  const value = status || 'unknown'
  const className = STATUS_CLASS[value] || 'admin-pill admin-pill--disabled'
  return <span className={className}>{value}</span>
}
