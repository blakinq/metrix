import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { topSources } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  const range = parseRange(new URLSearchParams(searchParams as Record<string, string>));
  const sources = await topSources({ siteId: site.id, ...range }, 50);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Sources</p>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top sources</CardTitle>
        </CardHeader>
        <CardContent>
          <SourcesBar data={sources.slice(0, 10)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All sources</CardTitle>
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
  );
}
