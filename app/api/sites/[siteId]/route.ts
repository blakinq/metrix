import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { updateSiteSchema } from "@/lib/validation";

type Params = { siteId: string };

export const GET = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  return NextResponse.json({ site });
});

export const PATCH = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const body = await req.json().catch(() => null);
  const parsed = updateSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const updated = await prisma.site.update({
    where: { id: site.id },
    data: parsed.data,
  });
  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "site.update",
      targetType: "site",
      targetId: site.id,
      metadata: parsed.data as object,
    },
  });
  return NextResponse.json({ site: updated });
});

export const DELETE = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  await prisma.site.update({
    where: { id: site.id },
    data: { status: "deleted" },
  });
  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "site.delete",
      targetType: "site",
      targetId: site.id,
    },
  });
  return NextResponse.json({ ok: true });
});
