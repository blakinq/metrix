import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import {
  countryBreakdown,
  overviewMetricsCompared,
  timeseries,
  topPages,
  topSources,
} from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ShareRow } from "@/components/dashboard/share-row";
import { CountryFlag } from "@/components/dashboard/country-flag";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { PageviewsChart } from "@/components/charts/pageviews-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  countryName,
  deltaPct,
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/utils";

interface Props {
  params: { siteId: string };
  searchParams: Record<string, string | undefined>;
}

function formatDelta(
  curr: number,
  prev: number,
  opts: { invertGood?: boolean } = {},
): { value: string; up: boolean; good: boolean } | undefined {
  const d = deltaPct(curr, prev);
  if (d === null) return undefined;
  const up = d >= 0;
  const sign = up ? "+" : "−";
  const good = opts.invertGood ? !up : up;
  return { value: `${sign}${Math.abs(d).toFixed(1)}%`, up, good };
}

export default async function OverviewPage({ params, searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const site = await getSiteForUser(params.siteId, user.id);
  if (!site) notFound();

  const range = parseRange(
    new URLSearchParams(searchParams as Record<string, string>),
  );
  const args = { siteId: site.id, ...range };

  const [{ current, previous }, series, pages, sources, countries] =
    await Promise.all([
      overviewMetricsCompared(args),
      timeseries(args),
      topPages(args, 6),
      topSources(args, 6),
      countryBreakdown(args, 6),
    ]);

  const totalPv = pages.reduce((s, p) => s + p.pageviews, 0) || 1;
  const totalSessions = sources.reduce((s, x) => s + x.sessions, 0) || 1;
  const totalCountryS =
    countries.reduce((s, c) => s + c.sessions, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Overview
        </p>
        <DateRangePicker />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Visitors"
          value={formatNumber(current.uniqueVisitors)}
          accentColor="chart-1"
          delta={formatDelta(current.uniqueVisitors, previous.uniqueVisitors)}
        />
        <MetricCard
          label="Pageviews"
          value={formatNumber(current.pageviews)}
          accentColor="chart-2"
          delta={formatDelta(current.pageviews, previous.pageviews)}
        />
        <MetricCard
          label="Sessions"
          value={formatNumber(current.sessions)}
          accentColor="chart-3"
          delta={formatDelta(current.sessions, previous.sessions)}
        />
        <MetricCard
          label="Bounce rate"
          value={formatPercent(current.bounceRate)}
          accentColor="chart-4"
          delta={formatDelta(current.bounceRate, previous.bounceRate, {
            invertGood: true,
          })}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Avg. session"
          value={formatDuration(current.avgSessionDuration)}
          delta={formatDelta(
            current.avgSessionDuration,
            previous.avgSessionDuration,
          )}
        />
        <MetricCard
          label="Events"
          value={formatNumber(current.events)}
          delta={formatDelta(current.events, previous.events)}
        />
        <MetricCard
          label="Top page"
          value={pages[0]?.pagePath ?? "—"}
          sub={pages[0] ? formatNumber(pages[0].pageviews) + " views" : undefined}
        />
        <MetricCard
          label="Top source"
          value={sources[0]?.source ?? "—"}
          sub={
            sources[0]
              ? formatNumber(sources[0].sessions) + " sessions"
              : undefined
          }
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Pageviews over time</CardTitle>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-chart-1" />
                Pageviews
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-chart-2" />
                Visitors
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PageviewsChart data={series} />
        </CardContent>
      </Card>

      {/* Ranked lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
          </CardHeader>
          <CardContent>
            {pages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pageviews yet.</p>
            ) : (
              <ul className="flex flex-col gap-3.5">
                {pages.map((p) => (
                  <li key={p.pagePath}>
                    <ShareRow
                      label={
                        <span className="font-mono text-xs text-foreground/85">
                          {p.pagePath}
                        </span>
                      }
                      value={formatNumber(p.pageviews)}
                      share={p.pageviews / totalPv}
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
            <CardTitle>Top sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions yet.</p>
            ) : (
              <ul className="flex flex-col gap-3.5">
                {sources.map((s) => (
                  <li key={`${s.source}/${s.medium}`}>
                    <ShareRow
                      label={
                        <span className="flex items-center gap-2">
                          <span className="truncate text-foreground/90">
                            {s.source}
                          </span>
                          <span className="shrink-0 rounded-sm border border-border/60 bg-surface/60 px-1 py-px font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                            {s.medium}
                          </span>
                        </span>
                      }
                      value={formatNumber(s.sessions)}
                      share={s.sessions / totalSessions}
                      variant="chart-2"
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top countries</CardTitle>
          </CardHeader>
          <CardContent>
            {countries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No country data yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3.5">
                {countries.map((c) => (
                  <li key={c.country}>
                    <ShareRow
                      label={
                        <span className="flex items-center gap-2.5">
                          <CountryFlag
                            code={c.country}
                            name={countryName(c.country)}
                          />
                          <span className="truncate text-foreground/90">
                            {countryName(c.country)}
                          </span>
                        </span>
                      }
                      value={formatNumber(c.sessions)}
                      share={c.sessions / totalCountryS}
                      variant="chart-4"
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
