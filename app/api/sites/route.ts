import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/get-user";
import { createSiteSchema } from "@/lib/validation";
import { generateTrackingId } from "@/lib/ids";

export const GET = route(async (_req) => {
  const user = await requireUser();
  const sites = await prisma.site.findMany({
    where: {
      status: { not: "deleted" },
      workspace: { members: { some: { userId: user.id } } },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      domain: true,
      trackingId: true,
      status: true,
      timezone: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ sites });
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = createSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id, role: { in: ["owner", "admin"] } },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return NextResponse.json({ error: "No workspace available" }, { status: 400 });
  }

  const site = await prisma.site.create({
    data: {
      workspaceId: membership.workspaceId,
      name: parsed.data.name,
      domain: parsed.data.domain,
      timezone: parsed.data.timezone ?? "UTC",
      trackingId: generateTrackingId(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "site.create",
      targetType: "site",
      targetId: site.id,
    },
  });

  return NextResponse.json({ site });
});
