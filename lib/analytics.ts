/**
 * Analytics query helpers. Queries raw events for MVP (with bot exclusion).
 * As volume grows, swap these for queries against daily_* aggregate tables.
 */
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface RangeArgs {
  siteId: string;
  from: Date;
  to: Date;
}

const notBot = { isBot: false };

/**
 * Returns the overview metrics for the requested window plus the immediately
 * preceding window of the same length, so the dashboard can show deltas.
 *
 * Intentionally runs the two periods sequentially: when the database is fronted
 * by a pgbouncer transaction pooler (Supabase's default) the `connection_limit`
 * is usually 1, so parallel fan-out queues queries at the pool level and trips
 * the 10s acquisition timeout. Sequential is the same wall-clock speed there.
 */
export async function overviewMetricsCompared(args: RangeArgs) {
  const span = args.to.getTime() - args.from.getTime();
  const prevTo = new Date(args.from.getTime());
  const prevFrom = new Date(args.from.getTime() - span);
  const current = await overviewMetrics(args);
  const previous = await overviewMetrics({
    siteId: args.siteId,
    from: prevFrom,
    to: prevTo,
  });
  return { current, previous };
}

export async function overviewMetrics({ siteId, from, to }: RangeArgs) {
  const where = { siteId, occurredAt: { gte: from, lte: to }, ...notBot };

  const [pageviews, uniqueVisitorsAgg, sessionsAgg, eventCount, bounceData] = await Promise.all([
    prisma.event.count({ where: { ...where, eventType: "page_view" } }),
    prisma.event.findMany({ where, distinct: ["visitorId"], select: { visitorId: true } }),
    prisma.session.findMany({
      where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
      select: { id: true, pageviewCount: true, durationSeconds: true },
    }),
    prisma.event.count({ where }),
    Promise.resolve(null),
  ]);

  void bounceData;

  const sessions = sessionsAgg.length;
  const bounces = sessionsAgg.filter((s) => s.pageviewCount <= 1).length;
  const bounceRate = sessions === 0 ? 0 : bounces / sessions;
  const avgSessionDuration =
    sessions === 0 ? 0 : sessionsAgg.reduce((sum, s) => sum + s.durationSeconds, 0) / sessions;

  return {
    pageviews,
    uniqueVisitors: uniqueVisitorsAgg.length,
    sessions,
    events: eventCount,
    bounceRate,
    avgSessionDuration,
  };
}

export async function timeseries({ siteId, from, to }: RangeArgs) {
  const rows = await prisma.$queryRaw<{ day: Date; pageviews: bigint; visitors: bigint }[]>(
    Prisma.sql`
      SELECT date_trunc('day', "occurredAt") AS day,
             COUNT(*) FILTER (WHERE "eventType" = 'page_view') AS pageviews,
             COUNT(DISTINCT "visitorId") AS visitors
      FROM "Event"
      WHERE "siteId" = ${siteId}
        AND "isBot" = false
        AND "occurredAt" >= ${from}
        AND "occurredAt" <= ${to}
      GROUP BY 1
      ORDER BY 1 ASC
    `,
  );
  return rows.map((r) => ({
    date: r.day.toISOString().slice(0, 10),
    pageviews: Number(r.pageviews),
    visitors: Number(r.visitors),
  }));
}

export async function topPages({ siteId, from, to }: RangeArgs, limit = 20) {
  const rows = await prisma.event.groupBy({
    by: ["pagePath"],
    where: { siteId, eventType: "page_view", occurredAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
    orderBy: { _count: { pagePath: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({ pagePath: r.pagePath ?? "/", pageviews: r._count._all }));
}

export async function topSources({ siteId, from, to }: RangeArgs, limit = 20) {
  const rows = await prisma.session.groupBy({
    by: ["source", "medium"],
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
    orderBy: { _count: { source: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({
    source: r.source ?? "(direct)",
    medium: r.medium ?? "(none)",
    sessions: r._count._all,
  }));
}

export async function deviceBreakdown({ siteId, from, to }: RangeArgs) {
  const rows = await prisma.session.groupBy({
    by: ["deviceType"],
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
  });
  return rows.map((r) => ({ deviceType: r.deviceType ?? "unknown", sessions: r._count._all }));
}

export async function browserBreakdown({ siteId, from, to }: RangeArgs, limit = 20) {
  const rows = await prisma.session.groupBy({
    by: ["browser"],
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
    orderBy: { _count: { browser: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({ browser: r.browser ?? "unknown", sessions: r._count._all }));
}

export async function countryBreakdown({ siteId, from, to }: RangeArgs, limit = 50) {
  const rows = await prisma.session.groupBy({
    by: ["country"],
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false, country: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { country: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({ country: r.country ?? "Unknown", sessions: r._count._all }));
}

export async function customEvents({ siteId, from, to }: RangeArgs, limit = 50) {
  const rows = await prisma.event.groupBy({
    by: ["eventType", "eventName"],
    where: {
      siteId,
      occurredAt: { gte: from, lte: to },
      isBot: false,
      eventType: { not: "page_view" },
    },
    _count: { _all: true },
    orderBy: { _count: { eventName: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({
    eventType: r.eventType,
    eventName: r.eventName ?? "(unnamed)",
    count: r._count._all,
  }));
}

export async function conversionMetrics({ siteId, from, to }: RangeArgs) {
  const goals = await prisma.conversionGoal.findMany({ where: { siteId } });
  const counts = await prisma.conversionEvent.groupBy({
    by: ["goalId"],
    where: { siteId, occurredAt: { gte: from, lte: to } },
    _count: { _all: true },
  });
  const byGoal = new Map(counts.map((c) => [c.goalId, c._count._all]));
  return goals.map((g) => ({
    id: g.id,
    name: g.name,
    goalType: g.goalType,
    isActive: g.isActive,
    conversions: byGoal.get(g.id) ?? 0,
  }));
}

export async function realtimeVisitors(siteId: string) {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const baseWhere = { siteId, occurredAt: { gte: fiveMinAgo }, isBot: false } as const;

  // Sequential: with a transaction-pooler `connection_limit=1`, fanning out
  // four queries in parallel just queues them and risks pool-acquisition
  // timeouts. Each query targets a small 5-minute window so total time stays
  // well under any reasonable budget.
  const active = await prisma.event.findMany({
    where: baseWhere,
    distinct: ["visitorId"],
    select: { visitorId: true },
  });
  const recent = await prisma.event.findMany({
    where: baseWhere,
    orderBy: { occurredAt: "desc" },
    take: 20,
    select: {
      id: true,
      eventType: true,
      eventName: true,
      pagePath: true,
      occurredAt: true,
      country: true,
      deviceType: true,
      browser: true,
    },
  });
  const byPage = await prisma.event.groupBy({
    by: ["pagePath"],
    where: { ...baseWhere, eventType: "page_view" },
    _count: { _all: true },
    orderBy: { _count: { pagePath: "desc" } },
    take: 8,
  });
  const byCountry = await prisma.event.groupBy({
    by: ["country"],
    where: { ...baseWhere, country: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { country: "desc" } },
    take: 8,
  });

  return {
    activeVisitors: active.length,
    recent: recent.map((r) => ({
      id: r.id,
      type: r.eventType,
      name: r.eventName,
      path: r.pagePath ?? "/",
      at: r.occurredAt.toISOString(),
      country: r.country,
      device: r.deviceType,
      browser: r.browser,
    })),
    byPage: byPage.map((p) => ({
      path: p.pagePath ?? "/",
      views: p._count._all,
    })),
    byCountry: byCountry.map((c) => ({
      country: c.country ?? "??",
      sessions: c._count._all,
    })),
  };
}
