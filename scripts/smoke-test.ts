/**
 * End-to-end smoke test against the running dev server.
 *
 * Asserts:
 *   1. /api/track accepts a page_view, a button_click, and a conversion event.
 *   2. Session, visitor, and event rows are created in the DB.
 *   3. A matching conversion goal triggers a conversion_event row.
 *   4. The daily aggregation worker produces daily_site_stats rows.
 *
 * Run:  npx tsx scripts/smoke-test.ts
 */
import { prisma } from "@/lib/db";
import { aggregateDay } from "@/workers/aggregate-events";

const API_BASE = process.env.API_URL ?? "http://localhost:3000";
const TRACKING_ID = "mx_demo123"; // from seed
const VISITOR_ID = `v_smoke_${Date.now()}`;
const SESSION_ID = `s_smoke_${Date.now()}`;

function log(step: string, info?: unknown) {
  console.log(`\n[smoke] ${step}`);
  if (info) console.log(JSON.stringify(info, null, 2));
}

async function post(payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 SmokeTest/1.0" },
    body: JSON.stringify(payload),
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`POST /api/track failed: ${res.status} ${await res.text()}`);
  }
}

async function ensureConversionGoal(siteId: string) {
  const existing = await prisma.conversionGoal.findFirst({
    where: { siteId, name: "Smoke Test WhatsApp" },
  });
  if (existing) return existing;
  return prisma.conversionGoal.create({
    data: {
      siteId,
      name: "Smoke Test WhatsApp",
      goalType: "button_click",
      matchingRule: { eventType: "button_click", eventName: "whatsapp_click" },
      isActive: true,
    },
  });
}

async function main() {
  log("Resolving seeded site");
  const site = await prisma.site.findUnique({ where: { trackingId: TRACKING_ID } });
  if (!site) throw new Error(`Seeded site ${TRACKING_ID} not found. Run npm run db:seed.`);

  log("Ensuring conversion goal exists");
  const goal = await ensureConversionGoal(site.id);
  log("Goal", { id: goal.id, name: goal.name });

  log("POST /api/track — pageview");
  await post({
    siteId: TRACKING_ID,
    visitorId: VISITOR_ID,
    sessionId: SESSION_ID,
    eventType: "page_view",
    pageUrl: "https://example.com/?utm_source=facebook&utm_medium=paid&utm_campaign=launch",
    pagePath: "/",
    title: "Home",
    referrer: "https://google.com/",
    screenWidth: 1440,
    screenHeight: 900,
    language: "en-US",
  });

  log("POST /api/track — pageview on pricing");
  await post({
    siteId: TRACKING_ID,
    visitorId: VISITOR_ID,
    sessionId: SESSION_ID,
    eventType: "page_view",
    pageUrl: "https://example.com/pricing",
    pagePath: "/pricing",
    title: "Pricing",
    screenWidth: 1440,
    screenHeight: 900,
    language: "en-US",
  });

  log("POST /api/track — button click (should match goal)");
  await post({
    siteId: TRACKING_ID,
    visitorId: VISITOR_ID,
    sessionId: SESSION_ID,
    eventType: "button_click",
    eventName: "whatsapp_click",
    pageUrl: "https://example.com/pricing",
    pagePath: "/pricing",
    metadata: { location: "hero_section" },
    screenWidth: 1440,
    screenHeight: 900,
  });

  // Give the fire-and-forget conversion matcher a beat to finish.
  await new Promise((r) => setTimeout(r, 500));

  log("Verifying session row");
  const session = await prisma.session.findUnique({ where: { id: SESSION_ID } });
  if (!session) throw new Error("Session not stored");
  log("Session", {
    visitorId: session.visitorId,
    pageviewCount: session.pageviewCount,
    eventCount: session.eventCount,
    source: session.source,
    medium: session.medium,
    campaign: session.campaign,
    browser: session.browser,
    deviceType: session.deviceType,
  });
  if (session.pageviewCount !== 2) throw new Error(`Expected pageviewCount=2, got ${session.pageviewCount}`);
  if (session.eventCount !== 3) throw new Error(`Expected eventCount=3, got ${session.eventCount}`);
  if (session.source !== "facebook") throw new Error(`Expected source=facebook, got ${session.source}`);

  log("Verifying event rows");
  const events = await prisma.event.findMany({
    where: { sessionId: SESSION_ID },
    orderBy: { occurredAt: "asc" },
    select: { eventType: true, eventName: true, pagePath: true, source: true },
  });
  log("Events", events);
  if (events.length !== 3) throw new Error(`Expected 3 events, got ${events.length}`);

  log("Verifying conversion event");
  const conversions = await prisma.conversionEvent.findMany({
    where: { sessionId: SESSION_ID, goalId: goal.id },
  });
  log("Conversions", conversions.map((c) => ({ goalId: c.goalId, source: c.source })));
  if (conversions.length !== 1) throw new Error(`Expected 1 conversion, got ${conversions.length}`);

  log("Running aggregation worker for today");
  const result = await aggregateDay(new Date());
  log("Aggregation result", result);

  log("Verifying daily_site_stats row");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daily = await prisma.dailySiteStats.findUnique({
    where: { siteId_date: { siteId: site.id, date: today } },
  });
  log("DailySiteStats", daily ? {
    pageviews: daily.pageviews,
    uniqueVisitors: daily.uniqueVisitors,
    sessions: daily.sessions,
    events: daily.events,
    bounceRate: daily.bounceRate,
  } : null);
  if (!daily) throw new Error("daily_site_stats not populated");
  if (daily.pageviews < 2) throw new Error(`Expected daily.pageviews >= 2, got ${daily.pageviews}`);

  console.log("\n[smoke] ✅ ALL CHECKS PASSED");
}

main()
  .catch((err) => {
    console.error("\n[smoke] ❌ FAILED:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
