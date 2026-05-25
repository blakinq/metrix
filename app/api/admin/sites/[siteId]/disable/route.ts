import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, route, HttpError } from "@/lib/get-user";

type Params = { siteId: string };

export const POST = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const me = await prisma.user.findUnique({ where: { id: user.id } });
  if (!me?.isSuperAdmin) throw new HttpError(403, "Forbidden");

  await prisma.site.update({
    where: { id: params.siteId },
    data: { status: "paused" },
  });
  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "admin.site.disable",
      targetType: "site",
      targetId: params.siteId,
    },
  });
  return NextResponse.json({ ok: true });
});
