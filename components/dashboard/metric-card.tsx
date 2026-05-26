import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type AccentColor = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  accentColor?: AccentColor;
  delta?: { value: string; up: boolean; good?: boolean };
  deltaLabel?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  sub,
  accent,
  accentColor,
  delta,
  deltaLabel = "vs prev period",
  className,
}: MetricCardProps) {
  const good = delta ? (delta.good ?? delta.up) : false;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border border-border/70 bg-card p-5",
        "transition-colors hover:border-foreground/15",
        className,
      )}
    >
      {accentColor ? (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-[2px] w-full opacity-80"
          style={{ background: `hsl(var(--${accentColor}))` }}
        />
      ) : accent ? (
        <span
          aria-hidden
          className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
      ) : null}

      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

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

      <div className="mt-2 flex min-h-[1.25rem] items-center gap-1.5 text-[10px]">
        {delta ? (
          <>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-[1px]",
                good
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {delta.up ? (
                <TrendingUp className="h-2.5 w-2.5" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5" />
              )}
              {delta.value}
            </span>
            <span className="text-muted-foreground/70">{deltaLabel}</span>
          </>
        ) : sub ? (
          <span className="text-muted-foreground">{sub}</span>
        ) : null}
      </div>
    </div>
  );
}
