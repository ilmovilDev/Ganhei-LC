export function DaysTableSkeleton() {
  return (
    <div className="flex h-full min-h-0 animate-pulse flex-col gap-2 p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted/40 h-16 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
