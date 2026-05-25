/**
 * Daily aggregation cron — hit by Vercel Cron (see vercel.json) at 02:00 UTC.
 * Protected by Authorization: Bearer ${CRON_SECRET}.
 *
 * Optional ?date=YYYY-MM-DD to backfill a specific day; defaults to yesterday.
 */
import { NextResponse } from "next/server";
import { parseISO, subDays } from "date-fns";
import { aggregateDay } from "@/workers/aggregate-events";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dateParam = new URL(req.url).searchParams.get("date");
  const day = dateParam ? parseISO(dateParam) : subDays(new Date(), 1);

  try {
    const result = await aggregateDay(day);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron] aggregation failed", err);
    return NextResponse.json({ error: "Aggregation failed" }, { status: 500 });
  }
}
