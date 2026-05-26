import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function MetricCard({ label, value, sub, accent, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border border-border/70 bg-card p-5",
        "transition-colors hover:border-foreground/15",
        className,
      )}
    >
      {accent && (
        <span
          aria-hidden
          className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={cn(
            "stat-num truncate text-3xl font-medium text-foreground",
            accent && "text-primary",
          )}
          title={value}
        >
          {value}
        </span>
      </div>
      {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
