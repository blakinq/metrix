import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { deviceBreakdown, browserBreakdown } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { DevicesDonut } from "@/components/charts/devices-donut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";

export default async function DevicesPage({
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
  const args = { siteId: site.id, ...range };
  const [devices, browsers] = await Promise.all([deviceBreakdown(args), browserBreakdown(args, 15)]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Devices</p>
        <DateRangePicker />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device types</CardTitle>
          </CardHeader>
          <CardContent>
            <DevicesDonut data={devices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Browser</TableHead>
                  <TableHead className="pr-6 text-right">Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {browsers.map((b) => (
                  <TableRow key={b.browser}>
                    <TableCell className="pl-6">{b.browser}</TableCell>
                    <TableCell className="pr-6 text-right font-medium">
                      {formatNumber(b.sessions)}
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
