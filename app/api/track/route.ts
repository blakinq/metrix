/**
 * Event ingestion endpoint — see §8. Must be fast.
 * Validates, enriches lightly, stores, updates session, returns.
 * Conversion matching runs after response is sent (fire-and-forget).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackEventSchema } from "@/lib/validation";
import { parseUserAgent } from "@/lib/device";
import { geoFromRequest, clientIp } from "@/lib/geo";
import { attribute, parseUtmFromUrl } from "@/lib/attribution";
import { isBot } from "@/lib/bot-filter";
import { rateLimitIngest } from "@/lib/rate-limit";
import { processConversions } from "@/lib/conversions";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = trackEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400, headers: CORS });
  }
  const input = parsed.data;

  const site = await prisma.site.findUnique({ where: { trackingId: input.siteId } });
  if (!site) return NextResponse.json({ ok: true }, { status: 204, headers: CORS });
  if (site.status !== "active") return NextResponse.json({ ok: true }, { status: 204, headers: CORS });

  const ip = clientIp(req) ?? "0.0.0.0";
  const rl = await rateLimitIngest(site.id, ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429, headers: CORS });
  }

  const ua = req.headers.get("user-agent");
  const device = parseUserAgent(ua);
  const geo = geoFromRequest(req);
  const utm = input.utm ?? parseUtmFromUrl(input.pageUrl) ?? undefined;
  const attribution = attribute({ utm, referrer: input.referrer, pageUrl: input.pageUrl });
  const bot = isBot(ua, input.screenWidth ?? null);

  const occurredAt = input.occurredAt ? new Date(input.occurredAt) : new Date();

  try {
    const event = await prisma.$transaction(async (tx) => {
      // Upsert session.
      const session = await tx.session.upsert({
        where: { id: input.sessionId },
        update: {
          lastSeenAt: occurredAt,
          eventCount: { increment: 1 },
          ...(input.eventType === "page_view"
            ? { pageviewCount: { increment: 1 }, exitPage: input.pagePath ?? undefined }
            : {}),
        },
        create: {
          id: input.sessionId,
          siteId: site.id,
          visitorId: input.visitorId,
          startedAt: occurredAt,
          lastSeenAt: occurredAt,
          entryPage: input.pagePath ?? null,
          exitPage: input.pagePath ?? null,
          referrer: input.referrer ?? null,
          source: attribution.source,
          medium: attribution.medium,
          campaign: attribution.campaign,
          country: geo.country,
          region: geo.region,
          city: geo.city,
          deviceType: device.deviceType,
          browser: device.browser,
          os: device.os,
          pageviewCount: input.eventType === "page_view" ? 1 : 0,
          eventCount: 1,
          isBot: bot,
        },
      });

      // Update duration on every event.
      const duration = Math.max(0, Math.floor((occurredAt.getTime() - session.startedAt.getTime()) / 1000));
      if (duration > session.durationSeconds) {
        await tx.session.update({
          where: { id: session.id },
          data: { durationSeconds: duration },
        });
      }

      return tx.event.create({
        data: {
          siteId: site.id,
          visitorId: input.visitorId,
          sessionId: input.sessionId,
          eventType: input.eventType,
          eventName: input.eventName ?? null,
          pageUrl: input.pageUrl ?? null,
          pagePath: input.pagePath ?? null,
          pageTitle: input.title ?? input.pageTitle ?? null,
          referrer: input.referrer ?? null,
          source: attribution.source,
          medium: attribution.medium,
          campaign: attribution.campaign,
          country: geo.country,
          region: geo.region,
          city: geo.city,
          deviceType: device.deviceType,
          browser: device.browser,
          os: device.os,
          screenWidth: input.screenWidth ?? null,
          screenHeight: input.screenHeight ?? null,
          language: input.language ?? null,
          metadata: input.metadata ?? {},
          isBot: bot,
          occurredAt,
        },
      });
    });

    // Fire-and-forget conversion matching.
    processConversions(event).catch((err) => log.error("conversion_match_failed", { err: String(err) }));
  } catch (err) {
    log.error("ingest_failed", { err: String(err), siteId: site.id });
    return NextResponse.json({ error: "Internal error" }, { status: 500, headers: CORS });
  }

  return NextResponse.json({ ok: true }, { status: 200, headers: CORS });
}
