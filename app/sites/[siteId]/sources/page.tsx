import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { topSources } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { ShareRow } from "@/components/dashboard/share-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourcesBar } from "@/components/charts/sources-bar";
import { formatNumber } from "@/lib/utils";

export default async function SourcesPage({
  params,
  searchParams,
}: {
  params: { siteId: string };
  searchParams: Record<string, string | undefined>;
}) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const site = await getSiteForUser(params.siteId, user.id);
  if (!site) notFound();

  const range = parseRange(
    new URLSearchParams(searchParams as Record<string, string>),
  );
  const sources = await topSources({ siteId: site.id, ...range }, 50);
  const total = sources.reduce((s, x) => s + x.sessions, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Sources
        </p>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top sources</CardTitle>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No sessions in this range.
            </p>
          ) : (
            <SourcesBar data={sources.slice(0, 10)} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>All sources</CardTitle>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {formatNumber(total)} sessions · {sources.length} sources
          </span>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No sessions in this range.
            </p>
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
                    share={s.sessions / total}
                    variant="chart-2"
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
