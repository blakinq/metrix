import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { customEvents } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";

export default async function EventsPage({
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
  const events = await customEvents({ siteId: site.id, ...range });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Events</p>
        <DateRangePicker />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Custom events</CardTitle>
        </CardHeader>
        <CardContent className={events.length === 0 ? undefined : "px-0 pt-0"}>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No custom events yet. Use{" "}
              <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                window.metrix.track()
              </code>{" "}
              or{" "}
              <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                data-metrix-event
              </code>{" "}
              attributes to start tracking.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="pr-6 text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => (
                  <TableRow key={`${e.eventType}/${e.eventName}`}>
                    <TableCell className="pl-6">
                      <span className="font-mono text-xs text-foreground/85">
                        {e.eventType}
                      </span>
                    </TableCell>
                    <TableCell>{e.eventName}</TableCell>
                    <TableCell className="pr-6 text-right font-medium">
                      {formatNumber(e.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
