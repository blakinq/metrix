import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { topPages } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  const range = parseRange(new URLSearchParams(searchParams as Record<string, string>));
  const pages = await topPages({ siteId: site.id, ...range }, 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Pages</p>
        <DateRangePicker />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All pages</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Path</TableHead>
                <TableHead className="pr-6 text-right">Pageviews</TableHead>
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
    </div>
  );
}
