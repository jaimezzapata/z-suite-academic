type SkeletonCardProps = {
  lines?: number;
};

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-2/5 rounded-md bg-slate-100" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            className="h-4 rounded-md bg-slate-100"
            key={`skeleton-line-${index}`}
            style={{
              width: index === lines - 1 ? "70%" : "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
}
