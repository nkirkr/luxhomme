import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface CardSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-lg border p-4', className)}>
      <Skeleton className="mb-3 h-40 w-full rounded-md" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function BlogCardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-lg border', className)}>
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <div className="p-4">
        <Skeleton className="mb-2 h-3 w-20" />
        <Skeleton className="mb-2 h-5 w-4/5" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function ProductCardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-lg border', className)}>
      <Skeleton className="aspect-square w-full rounded-t-lg" />
      <div className="p-4">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-3 h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function DashboardCardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn('bg-card rounded-lg border p-6', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="mt-3 h-8 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="mb-1 h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}
