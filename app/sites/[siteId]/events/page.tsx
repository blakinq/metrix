import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { customEvents } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { ShareRow } from "@/components/dashboard/share-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const range = parseRange(
    new URLSearchParams(searchParams as Record<string, string>),
  );
  const events = await customEvents({ siteId: site.id, ...range });
  const total = events.reduce((s, e) => s + e.count, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Events
        </p>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Custom events</CardTitle>
          {events.length > 0 && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {formatNumber(total)} fired · {events.length} distinct
            </span>
          )}
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="flex flex-col gap-3 rounded-md border border-dashed border-border/70 bg-surface/30 p-6 text-sm text-muted-foreground">
              <p>
                No custom events yet. Fire one from your site to start tracking:
              </p>
              <pre className="overflow-x-auto rounded-md border border-border/60 bg-card/60 p-3 font-mono text-xs leading-relaxed text-foreground/90">
{`window.metrix.track("whatsapp_click", { plan: "pro" });`}
              </pre>
              <p>
                Or use the{" "}
                <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                  data-metrix-event
                </code>{" "}
                attribute on any element.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {events.map((e) => (
                <li key={`${e.eventType}/${e.eventName}`}>
                  <ShareRow
                    label={
                      <span className="flex items-center gap-2">
                        <span className="shrink-0 rounded-sm border border-border/60 bg-surface/60 px-1 py-px font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                          {e.eventType}
                        </span>
                        <span className="truncate text-foreground/90">
                          {e.eventName}
                        </span>
                      </span>
                    }
                    value={formatNumber(e.count)}
                    share={e.count / total}
                    variant="chart-5"
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
