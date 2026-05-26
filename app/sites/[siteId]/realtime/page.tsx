"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, MousePointerClick, Smartphone, Monitor, Tablet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareRow } from "@/components/dashboard/share-row";
import { countryName, formatNumber } from "@/lib/utils";
import { CountryFlag } from "@/components/dashboard/country-flag";

interface RecentEvent {
  id: string;
  type: string;
  name: string | null;
  path: string;
  at: string;
  country: string | null;
  device: string | null;
  browser: string | null;
}

interface Data {
  activeVisitors: number;
  recent: RecentEvent[];
  byPage: { path: string; views: number }[];
  byCountry: { country: string; sessions: number }[];
}

function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - t);
  if (diff < 5_000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function DeviceIcon({ kind }: { kind: string | null }) {
  if (kind === "mobile") return <Smartphone className="h-3 w-3" />;
  if (kind === "tablet") return <Tablet className="h-3 w-3" />;
  return <Monitor className="h-3 w-3" />;
}

export default function RealtimePage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const res = await fetch(`/api/sites/${siteId}/analytics/realtime`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const next = await res.json();
        if (alive) setData(next);
      } catch {}
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [siteId]);

  const active = data?.activeVisitors ?? null;
  const totalPv =
    data?.byPage.reduce((s, p) => s + p.views, 0) || 1;
  const totalCountry =
    data?.byCountry.reduce((s, c) => s + c.sessions, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Realtime
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Refreshes every 10s
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitors active right now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3">
            <span className="stat-num text-6xl font-medium text-foreground">
              {active ?? "—"}
            </span>
            <span className="text-sm text-muted-foreground">currently</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Active in the last 5 minutes · {formatNumber(data?.recent.length ?? 0)} events
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top pages — last 5 min</CardTitle>
          </CardHeader>
          <CardContent>
            {!data || data.byPage.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Waiting for traffic…
              </p>
            ) : (
              <ul className="flex flex-col gap-3.5">
                {data.byPage.map((p) => (
                  <li key={p.path}>
                    <ShareRow
                      label={
                        <span className="font-mono text-xs text-foreground/85">
                          {p.path}
                        </span>
                      }
                      value={formatNumber(p.views)}
                      share={p.views / totalPv}
                      variant="primary"
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top countries — last 5 min</CardTitle>
          </CardHeader>
          <CardContent>
            {!data || data.byCountry.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Waiting for traffic…
              </p>
            ) : (
              <ul className="flex flex-col gap-3.5">
                {data.byCountry.map((c) => (
                  <li key={c.country}>
                    <ShareRow
                      label={
                        <span className="flex items-center gap-2.5">
                          <CountryFlag
                            code={c.country}
                            name={countryName(c.country)}
                            size="md"
                          />
                          <span className="truncate text-foreground/90">
                            {countryName(c.country)}
                          </span>
                        </span>
                      }
                      value={formatNumber(c.sessions)}
                      share={c.sessions / totalCountry}
                      variant="chart-4"
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Live activity</CardTitle>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="live-dot" /> Streaming
          </span>
        </CardHeader>
        <CardContent>
          {!data || data.recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No events in the last 5 minutes.
            </p>
          ) : (
            <ul className="flex flex-col">
              {data.recent.map((e) => {
                const isPv = e.type === "page_view";
                return (
                  <li
                    key={e.id}
                    className="group flex items-center gap-3 border-b border-border/40 py-2.5 last:border-b-0"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border/60 bg-surface/60 text-muted-foreground transition-colors group-hover:border-foreground/15 group-hover:text-foreground">
                      {isPv ? (
                        <FileText className="h-3 w-3" />
                      ) : (
                        <MousePointerClick className="h-3 w-3 text-primary" />
                      )}
                    </span>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="truncate font-mono text-xs text-foreground/90">
                        {isPv ? e.path : e.name ?? e.type}
                      </span>
                      {!isPv && (
                        <span className="shrink-0 rounded-sm border border-border/60 bg-surface/60 px-1 py-px font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                          {e.type}
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-[11px] text-muted-foreground">
                      {e.country && (
                        <span className="flex items-center gap-1.5">
                          <CountryFlag code={e.country} name={e.country} />
                          <span className="hidden md:inline">{e.country}</span>
                        </span>
                      )}
                      <span className="hidden items-center gap-1 md:flex">
                        <DeviceIcon kind={e.device} />
                        <span className="capitalize">{e.device ?? "—"}</span>
                      </span>
                      <span className="tabular-nums text-muted-foreground/70">
                        {relativeTime(e.at)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
