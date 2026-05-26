import { notFound } from "next/navigation";
import { Target } from "lucide-react";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { conversionMetrics } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversionGoalForm } from "./goal-form";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

export default async function ConversionsPage({
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
  const conversions = await conversionMetrics({ siteId: site.id, ...range });
  const total = conversions.reduce((s, c) => s + c.conversions, 0);
  const maxCount = Math.max(1, ...conversions.map((c) => c.conversions));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Conversions
        </p>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Conversion goals</CardTitle>
          {conversions.length > 0 && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {formatNumber(total)} total · {conversions.length} goals
            </span>
          )}
        </CardHeader>
        <CardContent>
          {conversions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border/70 bg-surface/30 px-6 py-10 text-center">
              <span className="grid size-9 place-items-center rounded-full border border-border bg-surface text-primary">
                <Target className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  No goals yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create your first one below to start measuring outcomes.
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {conversions.map((c) => {
                const share = c.conversions / maxCount;
                return (
                  <li
                    key={c.id}
                    className="flex flex-col gap-2 rounded-md border border-border/60 bg-card/60 p-4 transition-colors hover:border-foreground/15"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {c.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                          {c.goalType}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge
                          variant={c.isActive ? "success" : "outline"}
                          className="text-[10px]"
                        >
                          {c.isActive ? "active" : "paused"}
                        </Badge>
                        <span className="stat-num text-lg font-medium text-foreground">
                          {formatNumber(c.conversions)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full bg-primary/55"
                        style={{ width: `${Math.max(2, share * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <ConversionGoalForm siteId={site.id} />
    </div>
  );
}
