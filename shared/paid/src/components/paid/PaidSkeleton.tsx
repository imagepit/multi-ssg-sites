'use client'

/**
 * 有料コンテンツローディング用Skeleton UI
 */
export interface PaidSkeletonProps {
  /** 高さ（デフォルト: 200px） */
  height?: number
}

export function PaidSkeleton({ height = 200 }: PaidSkeletonProps) {
  return (
    <div
      className="animate-pulse rounded-lg border border-fd-border bg-fd-muted/30 p-6 my-4"
      style={{ minHeight: height }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-fd-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-fd-muted rounded w-1/3" />
          <div className="h-3 bg-fd-muted rounded w-2/3" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 bg-fd-muted rounded w-full" />
        <div className="h-3 bg-fd-muted rounded w-5/6" />
        <div className="h-3 bg-fd-muted rounded w-4/6" />
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-10 bg-fd-muted rounded-lg w-32" />
        <div className="h-10 bg-fd-muted rounded-lg w-32" />
      </div>
    </div>
  )
}

