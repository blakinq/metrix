/**
 * Conversion goal matching — see §14.
 * Given a freshly stored event, check each active goal and create matching
 * conversion_event rows. Designed to run synchronously after ingestion.
 */
import type { Event, ConversionGoal } from "@prisma/client";
import { prisma } from "@/lib/db";

type Rule = Record<string, unknown> & {
  eventType?: string;
  eventName?: string;
  pagePath?: string;
  pageUrlContains?: string;
};

function matchGoal(event: Event, goal: ConversionGoal): boolean {
  const rule = (goal.matchingRule ?? {}) as Rule;
  if (rule.eventType && rule.eventType !== event.eventType) return false;
  if (rule.eventName && rule.eventName !== event.eventName) return false;
  if (rule.pagePath && rule.pagePath !== event.pagePath) return false;
  if (rule.pageUrlContains && (!event.pageUrl || !event.pageUrl.includes(rule.pageUrlContains))) return false;
  return true;
}

export async function processConversions(event: Event): Promise<void> {
  const goals = await prisma.conversionGoal.findMany({
    where: { siteId: event.siteId, isActive: true },
  });
  const matched = goals.filter((g) => matchGoal(event, g));
  if (matched.length === 0) return;

  await prisma.conversionEvent.createMany({
    data: matched.map((g) => ({
      siteId: event.siteId,
      goalId: g.id,
      eventId: event.id,
      visitorId: event.visitorId,
      sessionId: event.sessionId,
      source: event.source,
      medium: event.medium,
      campaign: event.campaign,
      occurredAt: event.occurredAt,
    })),
  });
}
