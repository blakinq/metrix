import { ArrowRight, Globe } from "lucide-react";

type Event = {
  path: string;
  flag: string;
  country: string;
  time: string;
};

const EVENTS: Event[] = [
  { path: "/pricing", flag: "🇺🇸", country: "United States", time: "4s" },
  { path: "/", flag: "🇬🇧", country: "United Kingdom", time: "11s" },
  { path: "/blog/launch", flag: "🇩🇪", country: "Germany", time: "18s" },
  { path: "/pricing", flag: "🇺🇸", country: "United States", time: "26s" },
  { path: "/contact", flag: "🇫🇷", country: "France", time: "42s" },
  { path: "/docs", flag: "🇨🇦", country: "Canada", time: "1m" },
];

export function RealtimeCard() {
  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-card shadow-2xl shadow-black/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="live-dot" />
          Live event feed
        </span>
        <span className="flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>
            <span className="stat-num text-foreground">142</span> active
          </span>
          <span className="hidden sm:inline">refreshes 10s</span>
        </span>
      </div>

      {/* Feed rows */}
      <ul className="divide-y divide-border/40">
        {EVENTS.map((e, i) => (
          <li
            key={i}
            className={`flex items-center justify-between gap-4 px-5 py-3 text-sm transition-colors ${
              i === 0 ? "bg-primary/[0.04]" : ""
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <ArrowRight
                className={`h-3.5 w-3.5 shrink-0 ${
                  i === 0 ? "text-primary" : "text-muted-foreground/60"
                }`}
              />
              <span className="truncate font-mono text-foreground/85">{e.path}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="text-sm leading-none">{e.flag}</span>
                <span className="hidden text-xs sm:inline">{e.country}</span>
              </span>
              <span className="stat-num min-w-[2.5rem] text-right text-xs tabular-nums">
                {e.time}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between bg-surface/30 px-5 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Globe className="h-3 w-3" />
          12 countries · last hour
        </span>
        <span>updated 3s ago</span>
      </div>
    </div>
  );
}
