import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { prisma } from "@/lib/db";
import { parseRange } from "@/lib/session";
import { toCsv } from "@/lib/csv";
import { topPages, topSources, customEvents as customEventsAgg } from "@/lib/analytics";

type Params = { siteId: string; type: string };

const MAX_ROWS = 50_000;

export const GET = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const range = parseRange(new URL(req.url).searchParams);
  const baseFilter = {
    siteId: site.id,
    occurredAt: { gte: range.from, lte: range.to },
    isBot: false,
  };

  let csv = "";
  let filename = "";

  switch (params.type) {
    case "events": {
      const rows = await prisma.event.findMany({
        where: baseFilter,
        orderBy: { occurredAt: "desc" },
        take: MAX_ROWS,
      });
      csv = toCsv(
        rows.map((r) => ({
          event_id: r.id,
          event_type: r.eventType,
          event_name: r.eventName,
          page_url: r.pageUrl,
          source: r.source,
          medium: r.medium,
          campaign: r.campaign,
          country: r.country,
          device_type: r.deviceType,
          browser: r.browser,
          visitor_id: r.visitorId,
          session_id: r.sessionId,
          occurred_at: r.occurredAt.toISOString(),
        })),
        [
          "event_id",
          "event_type",
          "event_name",
          "page_url",
          "source",
          "medium",
          "campaign",
          "country",
          "device_type",
          "browser",
          "visitor_id",
          "session_id",
          "occurred_at",
        ],
      );
      filename = `events-${site.trackingId}.csv`;
      break;
    }
    case "sessions": {
      const rows = await prisma.session.findMany({
        where: { siteId: site.id, startedAt: { gte: range.from, lte: range.to }, isBot: false },
        orderBy: { startedAt: "desc" },
        take: MAX_ROWS,
      });
      csv = toCsv(
        rows.map((r) => ({
          session_id: r.id,
          visitor_id: r.visitorId,
          started_at: r.startedAt.toISOString(),
          duration_seconds: r.durationSeconds,
          entry_page: r.entryPage,
          exit_page: r.exitPage,
          source: r.source,
          medium: r.medium,
          campaign: r.campaign,
          country: r.country,
          device_type: r.deviceType,
          browser: r.browser,
          pageviews: r.pageviewCount,
        })),
        [
          "session_id",
          "visitor_id",
          "started_at",
          "duration_seconds",
          "entry_page",
          "exit_page",
          "source",
          "medium",
          "campaign",
          "country",
          "device_type",
          "browser",
          "pageviews",
        ],
      );
      filename = `sessions-${site.trackingId}.csv`;
      break;
    }
    case "pages": {
      const rows = await topPages({ siteId: site.id, ...range }, 5000);
      csv = toCsv(rows as unknown as Record<string, unknown>[], ["pagePath", "pageviews"]);
      filename = `pages-${site.trackingId}.csv`;
      break;
    }
    case "sources": {
      const rows = await topSources({ siteId: site.id, ...range }, 5000);
      csv = toCsv(rows as unknown as Record<string, unknown>[], ["source", "medium", "sessions"]);
      filename = `sources-${site.trackingId}.csv`;
      break;
    }
    case "conversions": {
      const rows = await prisma.conversionEvent.findMany({
        where: { siteId: site.id, occurredAt: { gte: range.from, lte: range.to } },
        include: { goal: true },
        orderBy: { occurredAt: "desc" },
        take: MAX_ROWS,
      });
      csv = toCsv(
        rows.map((r) => ({
          goal_name: r.goal.name,
          goal_type: r.goal.goalType,
          visitor_id: r.visitorId,
          session_id: r.sessionId,
          source: r.source,
          medium: r.medium,
          campaign: r.campaign,
          occurred_at: r.occurredAt.toISOString(),
        })),
        ["goal_name", "goal_type", "visitor_id", "session_id", "source", "medium", "campaign", "occurred_at"],
      );
      filename = `conversions-${site.trackingId}.csv`;
      break;
    }
    case "custom-events": {
      const rows = await customEventsAgg({ siteId: site.id, ...range }, 5000);
      csv = toCsv(rows as unknown as Record<string, unknown>[], ["eventType", "eventName", "count"]);
      filename = `custom-events-${site.trackingId}.csv`;
      break;
    }
    default:
      return new Response("Unknown export type", { status: 400 });
  }

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
});
