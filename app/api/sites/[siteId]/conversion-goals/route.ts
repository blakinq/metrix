import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { conversionGoalSchema } from "@/lib/validation";

type Params = { siteId: string };

export const GET = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const goals = await prisma.conversionGoal.findMany({
    where: { siteId: site.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ goals });
});

export const POST = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const body = await req.json().catch(() => null);
  const parsed = conversionGoalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const goal = await prisma.conversionGoal.create({
    data: {
      siteId: site.id,
      name: parsed.data.name,
      goalType: parsed.data.goalType,
      matchingRule: parsed.data.matchingRule as object,
      isActive: parsed.data.isActive ?? true,
    },
  });
  return NextResponse.json({ goal });
});
