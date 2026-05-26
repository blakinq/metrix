import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { topPages } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { ShareRow } from "@/components/dashboard/share-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export default async function PagesPage({
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
  const pages = await topPages({ siteId: site.id, ...range }, 100);
  const total = pages.reduce((s, p) => s + p.pageviews, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Pages
        </p>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>All pages</CardTitle>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {formatNumber(total)} pageviews · {pages.length} paths
          </span>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No pageviews in this range.
            </p>
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
                    share={p.pageviews / total}
                    variant="primary"
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
