import {
  ArrowUpRight,
  Globe,
  LayoutDashboard,
  Activity,
  FileText,
  Compass,
  Monitor,
} from "lucide-react";

const NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Realtime", icon: Activity },
  { label: "Pages", icon: FileText },
  { label: "Sources", icon: Compass },
  { label: "Devices", icon: Monitor },
];

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-md border border-border bg-card/90 shadow-2xl shadow-black/40 backdrop-blur">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-border/70 bg-background/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-amber-500/60" />
            <span className="size-2.5 rounded-full bg-primary/70" />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-muted-foreground">
            <Globe className="h-3 w-3" />
            app.metrix.io/sites/example
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:inline">
            v2.1
          </span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 gap-px bg-border/60">
          {/* Sidebar */}
          <aside className="col-span-3 hidden flex-col gap-4 bg-background/70 px-3 py-4 md:flex">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
                Workspace
              </span>
              <span className="grid size-5 place-items-center rounded-sm border border-border bg-surface text-[9px] font-medium text-foreground/70">
                D
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="px-2 pb-1 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
                Analyze
              </p>
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`relative flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                      item.active
                        ? "bg-surface text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.active && (
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-r bg-primary"
                      />
                    )}
                    <Icon className={`h-3 w-3 ${item.active ? "text-primary" : ""}`} />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-auto flex items-center gap-2 rounded-md border border-border/70 bg-card px-2.5 py-2">
              <span className="live-dot" />
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                142 active
              </span>
            </div>
          </aside>

          {/* Main */}
          <div className="col-span-12 flex flex-col gap-3 bg-background/40 p-4 md:col-span-9 md:p-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="display text-lg tracking-tight text-foreground md:text-xl">
                  Overview
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Last 7 days
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
                  All pages
                </span>
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
                  7d ▾
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-md border border-border/70 bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Pageviews
                  </p>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-primary">
                    +9.4%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-chart-1" /> PV
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-chart-2" /> Visitors
                  </span>
                </div>
              </div>
              <MiniChart />
              <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Bottom split */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border/70 bg-card p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Top pages
                  </p>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <ul className="flex flex-col gap-2">
                  {[
                    ["/", "8,431", 100],
                    ["/pricing", "3,107", 37],
                    ["/blog/how-we-built", "1,924", 23],
                  ].map(([path, n, pct]) => (
                    <li key={path as string} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate font-mono text-foreground/85">{path}</span>
                        <span className="font-medium text-foreground">{n}</span>
                      </div>
                      <div className="h-0.5 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full bg-primary/60"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md border border-border/70 bg-card p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Live now
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-primary">
                    <span className="live-dot" />
                    142
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {[
                    ["🇺🇸", "United States", "64"],
                    ["🇬🇧", "United Kingdom", "31"],
                    ["🇩🇪", "Germany", "27"],
                    ["🇳🇬", "Nigeria", "20"],
                  ].map(([flag, country, n]) => (
                    <li
                      key={country as string}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-2 text-foreground/85">
                        <span className="text-sm leading-none">{flag}</span>
                        {country}
                      </span>
                      <span className="font-medium text-foreground">{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function MiniChart() {
  const points1 = "0,40 12,32 24,38 36,22 48,28 60,18 72,24 84,10 96,16 108,8 120,14";
  const points2 = "0,52 12,48 24,50 36,42 48,46 60,40 72,42 84,32 96,38 108,30 120,34";
  return (
    <svg
      viewBox="0 0 120 60"
      className="h-32 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="fillPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 15, 30, 45].map((y) => (
        <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="hsl(var(--border))" strokeWidth="0.3" />
      ))}
      <polygon points={`0,60 ${points1} 120,60`} fill="url(#fillPv)" />
      <polyline points={points1} fill="none" stroke="hsl(var(--chart-1))" strokeWidth="1.2" />
      <polyline
        points={points2}
        fill="none"
        stroke="hsl(var(--chart-2))"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      {/* Highlighted last point */}
      <circle cx="120" cy="14" r="1.8" fill="hsl(var(--chart-1))" />
      <circle cx="120" cy="14" r="3.5" fill="hsl(var(--chart-1))" fillOpacity="0.25" />
    </svg>
  );
}
