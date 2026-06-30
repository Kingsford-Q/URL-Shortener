export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-ink-100 bg-[linear-gradient(110deg,theme(colors.ink.100)_8%,theme(colors.ink.50)_18%,theme(colors.ink.100)_33%)] bg-[length:800px_100%] ${className}`}
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-ink-100 px-5 py-4 last:border-0">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-3 w-10" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
