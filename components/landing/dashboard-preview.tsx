import {
  ArrowUpRight,
  Globe,
  LayoutDashboard,
  Activity,
  FileText,
  Compass,
  Monitor,
  Target,
  Zap,
  ChevronDown,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Realtime", icon: Activity, badge: "47" },
  { label: "Pages", icon: FileText },
  { label: "Sources", icon: Compass },
  { label: "Devices", icon: Monitor },
  { label: "Events", icon: Zap },
  { label: "Goals", icon: Target },
];

const KPIS = [
  { label: "Visitors", value: "12,847", delta: "+9.4%", up: true, good: true, accent: "chart-1" },
  { label: "Pageviews", value: "24,396", delta: "+12.1%", up: true, good: true, accent: "chart-2" },
  { label: "Bounce rate", value: "41.8%", delta: "−4.3%", up: false, good: true, accent: "chart-3" },
  { label: "Avg. duration", value: "1m 52s", delta: "+3.7%", up: true, good: true, accent: "chart-4" },
];

const TOP_PAGES: [string, string, number][] = [
  ["/", "3,214", 100],
  ["/pricing", "1,108", 34],
  ["/blog/how-we-built", "612", 19],
  ["/docs/quickstart", "384", 12],
];

const TOP_SOURCES: { name: string; pct: number; bar: number }[] = [
  { name: "google.com", pct: 41, bar: 100 },
  { name: "Direct", pct: 28, bar: 68 },
  { name: "x.com", pct: 12, bar: 29 },
  { name: "producthunt.com", pct: 8, bar: 20 },
];

const TOP_COUNTRIES: [string, string, string, number][] = [
  ["🇺🇸", "United States", "2,431", 100],
  ["🇬🇧", "United Kingdom", "1,182", 49],
  ["🇩🇪", "Germany", "824", 34],
  ["🇳🇬", "Nigeria", "511", 21],
];

const SITES: [string, boolean][] = [
  ["example.com", true],
  ["launch.example.io", false],
  ["docs.example.com", false],
];

export function DashboardPreview() {
  return (
    <div className="relative">
      {/* Ambient glow behind the window */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -top-16 bottom-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, hsl(var(--primary) / 0.18), transparent 70%), radial-gradient(40% 60% at 90% 80%, hsl(188 85% 60% / 0.10), transparent 70%), radial-gradient(40% 60% at 10% 80%, hsl(268 75% 68% / 0.08), transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <div className="relative overflow-hidden rounded-xl border border-border bg-card/85 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-foreground/5 backdrop-blur-xl">
        {/* Window chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-gradient-to-b from-background/80 to-background/40 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-amber-500/60" />
            <span className="size-2.5 rounded-full bg-primary/70" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="flex max-w-md items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="truncate">app.metrix.io/sites/example.com</span>
              <span className="size-1 rounded-full bg-primary/70" />
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-surface/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              <span>⌘</span>K
            </span>
            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 gap-px bg-border/40">
          {/* Sidebar */}
          <aside className="col-span-3 hidden flex-col gap-5 bg-background/70 px-3.5 py-4 md:flex">
            <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/80 px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-sm bg-primary text-[10px] font-semibold text-primary-foreground">
                  D
                </span>
                <span className="text-[11px] font-medium text-foreground">Decode Labs</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="px-2 pb-1 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground/60">
                Analyze
              </p>
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`relative flex items-center justify-between rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${
                      item.active ? "bg-surface text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.active && (
                      <span
                        aria-hidden
                        className="absolute -left-3.5 top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-r bg-primary"
                      />
                    )}
                    <span className="flex items-center gap-2">
                      <Icon className={`h-3 w-3 ${item.active ? "text-primary" : ""}`} />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="flex items-center gap-1 text-[9px] text-primary">
                        <span className="size-1 animate-pulse-soft rounded-full bg-primary" />
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between px-2 pb-1">
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground/60">
                  Sites
                </p>
                <Plus className="h-2.5 w-2.5 text-muted-foreground" />
              </div>
              {SITES.map(([s, active]) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 rounded-md px-2 py-1 text-[11px] ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${
                      active ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span className="truncate">{s}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2 rounded-md border border-border/70 bg-card px-2.5 py-2">
              <span className="live-dot" />
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                47 active now
              </span>
            </div>
          </aside>

          {/* Main */}
          <div className="col-span-12 flex flex-col gap-4 bg-background/40 p-4 md:col-span-9 md:p-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="display text-xl tracking-tight text-foreground md:text-2xl">
                  Overview
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:inline">
                  May 19 — May 25
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-md border border-border bg-surface/70 px-2 py-1 text-[10px] text-muted-foreground">
                  All pages
                  <ChevronDown className="h-2.5 w-2.5" />
                </span>
                <span className="flex items-center gap-1 rounded-md border border-border bg-surface/70 px-2 py-1 text-[10px] text-muted-foreground">
                  Last 7 days
                  <ChevronDown className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/70 bg-border/40 lg:grid-cols-4">
              {KPIS.map((k, i) => (
                <div key={k.label} className="relative bg-card/90 p-3.5">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-[2px] w-full"
                    style={{
                      background: `hsl(var(--${k.accent}))`,
                      opacity: i === 0 ? 0.9 : 0.3,
                    }}
                  />
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {k.label}
                  </p>
                  <div className="mt-1.5">
                    <span className="stat-num text-2xl font-medium text-foreground md:text-[28px]">
                      {k.value}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-[1px] ${
                        k.good
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {k.up ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      {k.delta}
                    </span>
                    <span className="text-muted-foreground/70">vs prev 7d</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-md border border-border/70 bg-card/95 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/80">
                    Traffic
                  </p>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-primary">
                    +9.4%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-[2px] w-3 rounded-full bg-chart-1" />
                    Pageviews
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-[2px] w-3 rounded-full"
                      style={{
                        background:
                          "repeating-linear-gradient(to right, hsl(var(--chart-2)) 0 3px, transparent 3px 5px)",
                      }}
                    />
                    Visitors
                  </span>
                </div>
              </div>
              <MainChart />
              <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70">
                <span>May 19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span className="text-foreground/80">May 25</span>
              </div>
            </div>

            {/* Bottom 3-col split */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Top pages */}
              <div className="rounded-md border border-border/70 bg-card/95 p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Top pages
                  </p>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <ul className="flex flex-col gap-2.5">
                  {TOP_PAGES.map(([path, n, pct]) => (
                    <li key={path} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate font-mono text-foreground/85">{path}</span>
                        <span className="stat-num font-medium text-foreground">{n}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full bg-primary/55"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top sources */}
              <div className="rounded-md border border-border/70 bg-card/95 p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Top sources
                  </p>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <ul className="flex flex-col gap-2.5">
                  {TOP_SOURCES.map((s) => (
                    <li key={s.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 truncate text-foreground/85">
                          <span className="grid size-3.5 shrink-0 place-items-center rounded-sm border border-border bg-surface text-[8px] text-muted-foreground">
                            {s.name[0]?.toUpperCase()}
                          </span>
                          <span className="truncate">{s.name}</span>
                        </span>
                        <span className="stat-num font-medium text-foreground">{s.pct}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full bg-chart-2/60"
                          style={{ width: `${s.bar}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top countries */}
              <div className="rounded-md border border-border/70 bg-card/95 p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Top countries
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-primary">
                    <span className="live-dot" />
                    47
                  </span>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {TOP_COUNTRIES.map(([flag, country, n, pct]) => (
                    <li key={country} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 truncate text-foreground/85">
                          <span className="text-sm leading-none">{flag}</span>
                          <span className="truncate">{country}</span>
                        </span>
                        <span className="stat-num font-medium text-foreground">{n}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full bg-chart-4/55"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
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

// Catmull-Rom-to-Bezier smoothing for a nicer line.
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = x1 + (x2 - x0) / 6;
    const cp1y = y1 + (y2 - y0) / 6;
    const cp2x = x2 - (x3 - x1) / 6;
    const cp2y = y2 - (y3 - y1) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }
  return d;
}

function MainChart() {
  const W = 700;
  const H = 220;
  const PAD_TOP = 18;
  const PAD_BOTTOM = 14;
  const innerH = H - PAD_TOP - PAD_BOTTOM;

  const pv = [0.32, 0.44, 0.38, 0.55, 0.62, 0.78, 0.95];
  const vs = [0.2, 0.3, 0.25, 0.42, 0.48, 0.62, 0.75];

  const xAt = (i: number) => (i * W) / (pv.length - 1);
  const yAt = (v: number) => PAD_TOP + (1 - v) * innerH;

  const pvPts: [number, number][] = pv.map((v, i) => [xAt(i), yAt(v)]);
  const vsPts: [number, number][] = vs.map((v, i) => [xAt(i), yAt(v)]);

  const pvPath = smoothPath(pvPts);
  const vsPath = smoothPath(vsPts);
  const pvArea = `${pvPath} L ${W} ${H} L 0 ${H} Z`;

  const lastX = xAt(pv.length - 1);
  const lastY = yAt(pv[pv.length - 1]);
  const lastYPct = (lastY / H) * 100;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-44 w-full md:h-56"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="fillPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.32" />
            <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={0}
            y1={PAD_TOP + p * innerH}
            x2={W}
            y2={PAD_TOP + p * innerH}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* area fill */}
        <path d={pvArea} fill="url(#fillPv)" />

        {/* visitors (dashed) */}
        <path
          d={vsPath}
          fill="none"
          stroke="hsl(var(--chart-2))"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
          opacity="0.9"
          vectorEffect="non-scaling-stroke"
        />

        {/* pageviews — soft halo + crisp line */}
        <path
          d={pvPath}
          fill="none"
          stroke="hsl(var(--chart-1))"
          strokeWidth="5"
          strokeOpacity="0.22"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pvPath}
          fill="none"
          stroke="hsl(var(--chart-1))"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* vertical guide at last point */}
        <line
          x1={lastX}
          y1={PAD_TOP}
          x2={lastX}
          y2={H - PAD_BOTTOM}
          stroke="hsl(var(--chart-1))"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Highlighted last-point marker (HTML so it stays circular regardless of stretch) */}
      <span
        className="pointer-events-none absolute"
        style={{ right: 0, top: `${lastYPct}%`, transform: "translate(50%, -50%)" }}
        aria-hidden
      >
        <span className="relative grid place-items-center">
          <span className="absolute size-5 animate-pulse-soft rounded-full bg-chart-1/20" />
          <span className="size-2.5 rounded-full bg-chart-1 ring-2 ring-background" />
        </span>
      </span>

      {/* Floating tooltip — HTML overlay so text/box don't distort */}
      <div className="pointer-events-none absolute right-2 top-2 hidden flex-col gap-1 rounded-md border border-border bg-card/95 px-2.5 py-1.5 text-left shadow-lg backdrop-blur sm:flex">
        <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">May 25</p>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="size-1.5 rounded-full bg-chart-1" />
          <span className="stat-num text-foreground">4,128</span>
          <span className="text-muted-foreground">pageviews</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className="size-1.5 rounded-full"
            style={{ background: "hsl(var(--chart-2))" }}
          />
          <span className="stat-num text-foreground">2,612</span>
          <span className="text-muted-foreground">visitors</span>
        </div>
      </div>
    </div>
  );
}
