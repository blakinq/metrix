import { prisma } from "@/lib/db";

export type NotificationType =
  | "site_created"
  | "goal_created"
  | "first_event"
  | "milestone"
  | "system";

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}

export async function createNotification(input: NotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      link: input.link,
    },
  });
}

export async function listNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function unreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

export async function markRead(id: string, userId: string) {
  const result = await prisma.notification.updateMany({
    where: { id, userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  return result.count > 0;
}

export async function markAllRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  return result.count;
}

/**
 * Event-count thresholds that trigger a notification when crossed.
 * 1 = "first event received". Higher values are scale milestones.
 */
const MILESTONES = [1, 1_000, 10_000, 100_000, 1_000_000];

function formatMilestone(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}k`;
  return n.toString();
}

/**
 * Increment a site's lifetime event counter and fire a notification if the new
 * value crosses any milestone (1, 1k, 10k, 100k, 1M). Safe to call repeatedly
 * — `lastMilestone` on Site guards against double-firing.
 *
 * Designed to be called as fire-and-forget from /api/track.
 */
export async function processSiteMilestones(siteId: string) {
  const updated = await prisma.site.update({
    where: { id: siteId },
    data: { lifetimeEvents: { increment: 1 } },
    select: {
      id: true,
      name: true,
      workspaceId: true,
      lifetimeEvents: true,
      lastMilestone: true,
      firstEventAt: true,
    },
  });

  // Stamp firstEventAt on the very first event.
  if (updated.lifetimeEvents === 1 && !updated.firstEventAt) {
    await prisma.site.update({
      where: { id: siteId },
      data: { firstEventAt: new Date() },
    });
  }

  // Find the highest milestone newly crossed.
  const crossed = MILESTONES.filter(
    (m) => updated.lifetimeEvents >= m && updated.lastMilestone < m,
  );
  if (crossed.length === 0) return;
  const top = crossed[crossed.length - 1];

  // Mark this milestone as processed so we don't refire on subsequent events.
  await prisma.site.update({
    where: { id: siteId },
    data: { lastMilestone: top },
  });

  const isFirst = top === 1;
  const label = formatMilestone(top);
  const title = isFirst
    ? `First event from ${updated.name}`
    : `${label} events on ${updated.name}`;
  const body = isFirst
    ? `Tracking is live. Your dashboard will fill up as visitors arrive.`
    : `${updated.name} just crossed ${label} tracked events. Keep going.`;
  const type = isFirst ? "first_event" : "milestone";

  // Notify every workspace member.
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: updated.workspaceId },
    select: { userId: true },
  });
  for (const m of members) {
    await createNotification({
      userId: m.userId,
      type,
      title,
      body,
      link: `/sites/${updated.id}/overview`,
    });
  }
}
