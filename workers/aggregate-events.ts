/**
 * Daily aggregation worker — see §12.
 *
 * Computes daily_site_stats, daily_page_stats, daily_source_stats,
 * daily_device_stats for the given day (defaults to yesterday).
 *
 * CLI usage:
 *   npm run worker:aggregate
 *   npm run worker:aggregate -- --date=2026-05-24
 *
 * Also exported as `aggregateDay()` for use from the cron API route.
 */
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, subDays, parseISO, formatISO } from "date-fns";

async function aggregateSiteStats(siteId: string, day: Date) {
  const from = startOfDay(day);
  const to = endOfDay(day);

  const sessions = await prisma.session.findMany({
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
    select: { id: true, pageviewCount: true, durationSeconds: true, visitorId: true },
  });
  const events = await prisma.event.count({
    where: { siteId, occurredAt: { gte: from, lte: to }, isBot: false },
  });
  const pageviews = await prisma.event.count({
    where: { siteId, eventType: "page_view", occurredAt: { gte: from, lte: to }, isBot: false },
  });
  const uniqueVisitors = new Set(sessions.map((s) => s.visitorId)).size;
  const bounces = sessions.filter((s) => s.pageviewCount <= 1).length;
  const bounceRate = sessions.length === 0 ? 0 : bounces / sessions.length;
  const avgSessionDuration =
    sessions.length === 0 ? 0 : sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / sessions.length;

  await prisma.dailySiteStats.upsert({
    where: { siteId_date: { siteId, date: from } },
    create: {
      siteId,
      date: from,
      pageviews,
      uniqueVisitors,
      sessions: sessions.length,
      events,
      bounces,
      bounceRate,
      avgSessionDuration,
    },
    update: {
      pageviews,
      uniqueVisitors,
      sessions: sessions.length,
      events,
      bounces,
      bounceRate,
      avgSessionDuration,
    },
  });
}

async function aggregatePageStats(siteId: string, day: Date) {
  const from = startOfDay(day);
  const to = endOfDay(day);

  const rows = await prisma.event.groupBy({
    by: ["pagePath"],
    where: { siteId, eventType: "page_view", occurredAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
  });

  for (const r of rows) {
    const pagePath = r.pagePath ?? "/";
    const uniqueVisitors = await prisma.event.findMany({
      where: {
        siteId,
        pagePath,
        eventType: "page_view",
        occurredAt: { gte: from, lte: to },
        isBot: false,
      },
      distinct: ["visitorId"],
      select: { visitorId: true },
    });
    const entrances = await prisma.session.count({ where: { siteId, startedAt: { gte: from, lte: to }, entryPage: pagePath, isBot: false } });
    const exits = await prisma.session.count({ where: { siteId, startedAt: { gte: from, lte: to }, exitPage: pagePath, isBot: false } });

    await prisma.dailyPageStats.upsert({
      where: { siteId_date_pagePath: { siteId, date: from, pagePath } },
      create: {
        siteId,
        date: from,
        pagePath,
        pageviews: r._count._all,
        uniqueVisitors: uniqueVisitors.length,
        entrances,
        exits,
      },
      update: {
        pageviews: r._count._all,
        uniqueVisitors: uniqueVisitors.length,
        entrances,
        exits,
      },
    });
  }
}

async function aggregateSourceStats(siteId: string, day: Date) {
  const from = startOfDay(day);
  const to = endOfDay(day);

  const rows = await prisma.session.groupBy({
    by: ["source", "medium", "campaign"],
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
  });

  for (const r of rows) {
    const source = r.source ?? "(direct)";
    const medium = r.medium ?? "(none)";
    const campaign = r.campaign ?? "(none)";
    const visitors = await prisma.session.findMany({
      where: { siteId, startedAt: { gte: from, lte: to }, source, medium, campaign, isBot: false },
      distinct: ["visitorId"],
      select: { visitorId: true },
    });
    const pageviews = await prisma.event.count({
      where: { siteId, eventType: "page_view", occurredAt: { gte: from, lte: to }, source, medium, campaign, isBot: false },
    });
    const conversions = await prisma.conversionEvent.count({
      where: { siteId, occurredAt: { gte: from, lte: to }, source, medium, campaign },
    });

    await prisma.dailySourceStats.upsert({
      where: { siteId_date_source_medium_campaign: { siteId, date: from, source, medium, campaign } },
      create: {
        siteId,
        date: from,
        source,
        medium,
        campaign,
        sessions: r._count._all,
        visitors: visitors.length,
        pageviews,
        conversions,
      },
      update: {
        sessions: r._count._all,
        visitors: visitors.length,
        pageviews,
        conversions,
      },
    });
  }
}

async function aggregateDeviceStats(siteId: string, day: Date) {
  const from = startOfDay(day);
  const to = endOfDay(day);

  const rows = await prisma.session.groupBy({
    by: ["deviceType", "browser", "os"],
    where: { siteId, startedAt: { gte: from, lte: to }, isBot: false },
    _count: { _all: true },
  });

  for (const r of rows) {
    const deviceType = r.deviceType ?? "unknown";
    const browser = r.browser ?? "unknown";
    const os = r.os ?? "unknown";
    const visitors = await prisma.session.findMany({
      where: { siteId, startedAt: { gte: from, lte: to }, deviceType, browser, os, isBot: false },
      distinct: ["visitorId"],
      select: { visitorId: true },
    });
    const pageviews = await prisma.event.count({
      where: { siteId, eventType: "page_view", occurredAt: { gte: from, lte: to }, deviceType, browser, os, isBot: false },
    });

    await prisma.dailyDeviceStats.upsert({
      where: { siteId_date_deviceType_browser_os: { siteId, date: from, deviceType, browser, os } },
      create: { siteId, date: from, deviceType, browser, os, sessions: r._count._all, visitors: visitors.length, pageviews },
      update: { sessions: r._count._all, visitors: visitors.length, pageviews },
    });
  }
}

export interface AggregationResult {
  date: string;
  sites: number;
}

export async function aggregateDay(day: Date = subDays(new Date(), 1)): Promise<AggregationResult> {
  const sites = await prisma.site.findMany({ where: { status: "active" }, select: { id: true } });
  for (const site of sites) {
    await aggregateSiteStats(site.id, day);
    await aggregatePageStats(site.id, day);
    await aggregateSourceStats(site.id, day);
    await aggregateDeviceStats(site.id, day);
  }
  return { date: formatISO(day, { representation: "date" }), sites: sites.length };
}

function dateFromArgs(): Date {
  const arg = process.argv.find((a) => a.startsWith("--date="));
  if (arg) return parseISO(arg.split("=")[1]);
  return subDays(new Date(), 1);
}

async function main() {
  const day = dateFromArgs();
  console.log(`Aggregating for ${formatISO(day, { representation: "date" })}`);
  const result = await aggregateDay(day);
  console.log(`Done. Processed ${result.sites} sites for ${result.date}.`);
}

// Only run main() when invoked as a CLI, not when imported.
if (require.main === module) {
  main()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
