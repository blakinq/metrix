import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { parseRange } from "@/lib/session";
import { overviewMetrics, topPages, topSources } from "@/lib/analytics";
import { rateLimitDashboard } from "@/lib/rate-limit";

type Params = { siteId: string };

export const GET = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const rl = await rateLimitDashboard(user.id);
  if (!rl.success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const site = await assertSiteAccess(params.siteId, user.id);
  const range = parseRange(new URL(req.url).searchParams);
  const args = { siteId: site.id, ...range };

  const [metrics, pages, sources] = await Promise.all([
    overviewMetrics(args),
    topPages(args, 5),
    topSources(args, 5),
  ]);

  return NextResponse.json({
    range: { from: range.from.toISOString(), to: range.to.toISOString() },
    metrics,
    topPage: pages[0] ?? null,
    topSource: sources[0] ?? null,
  });
});
