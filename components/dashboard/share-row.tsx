import { cn } from "@/lib/utils";

type Variant = "primary" | "chart-2" | "chart-3" | "chart-4" | "chart-5";

interface ShareRowProps {
  label: React.ReactNode;
  value: string;
  share: number;
  variant?: Variant;
  className?: string;
}

const FILL: Record<Variant, string> = {
  primary: "bg-primary/55",
  "chart-2": "bg-chart-2/55",
  "chart-3": "bg-chart-3/55",
  "chart-4": "bg-chart-4/55",
  "chart-5": "bg-chart-5/55",
};

export function ShareRow({
  label,
  value,
  share,
  variant = "primary",
  className,
}: ShareRowProps) {
  const pct = Math.max(0, Math.min(1, share)) * 100;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-foreground/90">{label}</span>
        <div className="flex shrink-0 items-baseline gap-2">
          <span className="stat-num font-medium text-foreground">{value}</span>
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface">
        <div
          className={cn("h-full transition-[width]", FILL[variant])}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
    </div>
  );
}
