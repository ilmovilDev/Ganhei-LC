export function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted/40 h-14 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
