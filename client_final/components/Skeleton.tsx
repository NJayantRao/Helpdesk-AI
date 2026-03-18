import { cn } from "@/lib/utils";

// ── Base ─────────────────────────────────────────────────────────────────────
export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-200 rounded-xl animate-pulse", className)} />
  );
}

// ── Stat Cards Row ────────────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-2xl p-5 h-28 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <SkeletonBox className="w-24 h-3" />
            <SkeletonBox className="w-10 h-10 rounded-xl" />
          </div>
          <SkeletonBox className="w-16 h-6 mb-1.5" />
          <SkeletonBox className="w-20 h-2.5 bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

// ── Chart ─────────────────────────────────────────────────────────────────────
export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="bg-slate-200 rounded-xl animate-pulse w-full"
      style={{ height }}
    />
  );
}

// ── Table Row ─────────────────────────────────────────────────────────────────
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
      <SkeletonBox className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBox className="w-32 h-3" />
        <SkeletonBox className="w-24 h-2.5 bg-slate-100" />
      </div>
      <SkeletonBox className="w-16 h-5 rounded-full" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-1.5">
        <SkeletonBox className="w-40 h-6" />
        <SkeletonBox className="w-56 h-3.5 bg-slate-100" />
      </div>
      <StatCardSkeleton />
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <ChartSkeleton height={200} />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ── System Dashboard Skeleton ─────────────────────────────────────────────────
export function SystemDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Warning banner */}
      <SkeletonBox className="h-12 w-full rounded-xl" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <SkeletonBox className="w-48 h-6" />
          <SkeletonBox className="w-64 h-3.5 bg-slate-100" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="w-36 h-9 rounded-xl" />
          <SkeletonBox className="w-32 h-9 rounded-xl" />
        </div>
      </div>
      {/* Stats */}
      <StatCardSkeleton />
      {/* Two-col grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <SkeletonBox className="w-40 h-4" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <SkeletonBox className="w-32 h-4" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
      {/* Departments */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <SkeletonBox className="w-44 h-4 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonBox key={i} className="w-28 h-8 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Named aliases matching per-page usage ────────────────────────────────────
export const DashboardSkeleton = PageSkeleton;
export const ResultsSkeleton = PageSkeleton;
export const DocumentsSkeleton = PageSkeleton;
export const AdminDashboardSkeleton = PageSkeleton;
