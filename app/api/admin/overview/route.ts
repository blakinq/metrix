import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, route, HttpError } from "@/lib/get-user";
import { startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export const GET = route(async (_req) => {
  const user = await requireUser();
  const me = await prisma.user.findUnique({ where: { id: user.id } });
  if (!me?.isSuperAdmin) throw new HttpError(403, "Forbidden");

  const today = startOfDay(new Date());

  const [users, workspaces, sites, eventsToday, topSites] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.site.count({ where: { status: { not: "deleted" } } }),
    prisma.event.count({ where: { occurredAt: { gte: today } } }),
    prisma.event.groupBy({
      by: ["siteId"],
      where: { occurredAt: { gte: today } },
      _count: { _all: true },
      orderBy: { _count: { siteId: "desc" } },
      take: 10,
    }),
  ]);

  const siteMap = await prisma.site.findMany({
    where: { id: { in: topSites.map((s) => s.siteId) } },
    select: { id: true, name: true, domain: true },
  });
  const lookup = new Map(siteMap.map((s) => [s.id, s]));

  return NextResponse.json({
    users,
    workspaces,
    sites,
    eventsToday,
    topSites: topSites.map((s) => ({
      siteId: s.siteId,
      name: lookup.get(s.siteId)?.name ?? s.siteId,
      domain: lookup.get(s.siteId)?.domain ?? "",
      events: s._count._all,
    })),
  });
});
