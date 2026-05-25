import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { conversionGoalSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Params = { siteId: string; goalId: string };

export const PATCH = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const body = await req.json().catch(() => null);
  const parsed = conversionGoalSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const goal = await prisma.conversionGoal.findFirst({
    where: { id: params.goalId, siteId: site.id },
  });
  if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.conversionGoal.update({
    where: { id: goal.id },
    data: {
      ...parsed.data,
      matchingRule: parsed.data.matchingRule ? (parsed.data.matchingRule as object) : undefined,
    },
  });
  return NextResponse.json({ goal: updated });
});

export const DELETE = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const goal = await prisma.conversionGoal.findFirst({
    where: { id: params.goalId, siteId: site.id },
  });
  if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.conversionGoal.delete({ where: { id: goal.id } });
  return NextResponse.json({ ok: true });
});
