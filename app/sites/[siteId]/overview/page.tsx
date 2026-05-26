import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { overviewMetrics, timeseries, topPages, topSources } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { PageviewsChart } from "@/components/charts/pageviews-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration, formatNumber, formatPercent } from "@/lib/utils";

interface Props {
  params: { siteId: string };
  searchParams: Record<string, string | undefined>;
}

export default async function OverviewPage({ params, searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const site = await getSiteForUser(params.siteId, user.id);
  if (!site) notFound();

  const range = parseRange(new URLSearchParams(searchParams as Record<string, string>));
  const args = { siteId: site.id, ...range };

  const [metrics, series, pages, sources] = await Promise.all([
    overviewMetrics(args),
    timeseries(args),
    topPages(args, 8),
    topSources(args, 8),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Overview</p>
        <DateRangePicker />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Visitors" value={formatNumber(metrics.uniqueVisitors)} accent />
        <MetricCard label="Pageviews" value={formatNumber(metrics.pageviews)} />
        <MetricCard label="Sessions" value={formatNumber(metrics.sessions)} />
        <MetricCard label="Bounce rate" value={formatPercent(metrics.bounceRate)} />
        <MetricCard label="Avg. session" value={formatDuration(metrics.avgSessionDuration)} />
        <MetricCard label="Events" value={formatNumber(metrics.events)} />
        <MetricCard label="Top page" value={pages[0]?.pagePath ?? "—"} />
        <MetricCard label="Top source" value={sources[0]?.source ?? "—"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pageviews over time</CardTitle>
          <div className="mt-1 flex items-center gap-4 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-chart-1" />
              Pageviews
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-chart-2" />
              Visitors
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <PageviewsChart data={series} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Path</TableHead>
                  <TableHead className="pr-6 text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((p) => (
                  <TableRow key={p.pagePath}>
                    <TableCell className="pl-6 font-mono text-xs text-foreground/85">
                      {p.pagePath}
                    </TableCell>
                    <TableCell className="pr-6 text-right font-medium">
                      {formatNumber(p.pageviews)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top traffic sources</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Source</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead className="pr-6 text-right">Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((s) => (
                  <TableRow key={`${s.source}/${s.medium}`}>
                    <TableCell className="pl-6">{s.source}</TableCell>
                    <TableCell className="text-muted-foreground">{s.medium}</TableCell>
                    <TableCell className="pr-6 text-right font-medium">
                      {formatNumber(s.sessions)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
