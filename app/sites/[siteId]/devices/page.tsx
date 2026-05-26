import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { deviceBreakdown, browserBreakdown } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { DevicesDonut } from "@/components/charts/devices-donut";
import { ShareRow } from "@/components/dashboard/share-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const range = parseRange(
    new URLSearchParams(searchParams as Record<string, string>),
  );
  const args = { siteId: site.id, ...range };
  const [devices, browsers] = await Promise.all([
    deviceBreakdown(args),
    browserBreakdown(args, 15),
  ]);

  const browserTotal = browsers.reduce((s, b) => s + b.sessions, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Devices
        </p>
        <DateRangePicker />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device types</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No sessions in this range.
              </p>
            ) : (
              <DevicesDonut data={devices} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Browsers</CardTitle>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {formatNumber(browserTotal)} sessions
            </span>
          </CardHeader>
          <CardContent>
            {browsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No sessions in this range.
              </p>
            ) : (
              <ul className="flex flex-col gap-3.5">
                {browsers.map((b) => (
                  <li key={b.browser}>
                    <ShareRow
                      label={
                        <span className="text-foreground/90">{b.browser}</span>
                      }
                      value={formatNumber(b.sessions)}
                      share={b.sessions / browserTotal}
                      variant="chart-3"
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
