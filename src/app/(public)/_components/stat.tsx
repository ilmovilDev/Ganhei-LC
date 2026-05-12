interface StatProps {
  label: string;
  desc: string;
}

export function Stat({ label, desc }: StatProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-emerald-500 sm:text-base">
        {label}
      </p>
      <span className="text-muted-foreground text-[11px] sm:text-xs">
        {desc}
      </span>
    </div>
  );
}
