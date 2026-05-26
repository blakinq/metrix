import { TrendingUp, Globe } from "lucide-react";

const PAGES: [string, number][] = [
  ["/", 64],
  ["/pricing", 41],
  ["/blog/launch", 27],
  ["/contact", 10],
];

const COUNTRIES: [string, string, number][] = [
  ["🇺🇸", "United States", 64],
  ["🇬🇧", "United Kingdom", 31],
  ["🇩🇪", "Germany", 27],
];

// 12 bars representing the last hour (5-min buckets), normalized 0–1.
const ACTIVITY = [0.32, 0.41, 0.28, 0.52, 0.47, 0.61, 0.55, 0.72, 0.68, 0.83, 0.78, 0.96];

export function RealtimeCard() {
  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-card shadow-2xl shadow-black/30">
      {/* HEADER — live counter */}
      <div className="border-b border-border/60 p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="live-dot" />
            Live
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-primary">
            <TrendingUp className="h-2.5 w-2.5" />
            +18 last min
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <p className="stat-num text-3xl font-medium leading-none text-foreground">
              142
            </p>
            <p className="text-xs text-muted-foreground">
              visitors active right now
            </p>
          </div>
          <ActivityBars />
        </div>
      </div>

      {/* BODY — active pages */}
      <div className="flex flex-col gap-2 border-b border-border/60 p-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Active pages</span>
          <span>Visitors</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {PAGES.map(([path, n]) => (
            <li key={path} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate font-mono text-foreground/85">{path}</span>
                <span className="stat-num font-medium text-foreground">{n}</span>
              </div>
              <div className="h-0.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full bg-primary/70 transition-all"
                  style={{ width: `${(n / 64) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* BODY — countries */}
      <div className="flex flex-col gap-2 border-b border-border/60 p-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            By country
          </span>
          <span>Visitors</span>
        </div>
        <ul className="flex flex-col gap-1">
          {COUNTRIES.map(([flag, name, n]) => (
            <li
              key={name}
              className="flex items-center justify-between text-xs"
            >
              <span className="flex items-center gap-2 text-foreground/85">
                <span className="text-sm leading-none">{flag}</span>
                {name}
              </span>
              <span className="stat-num font-medium text-foreground">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between bg-surface/30 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-primary" />
          Auto-refresh every 10s
        </span>
        <span>Updated 3s ago</span>
      </div>
    </div>
  );
}

function ActivityBars() {
  return (
    <div
      aria-hidden
      className="flex h-8 items-end gap-1"
      title="Activity in the last hour"
    >
      {ACTIVITY.map((v, i) => (
        <span
          key={i}
          className="w-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary"
          style={{ height: `${Math.max(8, v * 100)}%`, opacity: 0.35 + v * 0.65 }}
        />
      ))}
    </div>
  );
}
