import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { parseRange } from "@/lib/session";
import { deviceBreakdown, browserBreakdown } from "@/lib/analytics";

export const dynamic = "force-dynamic";

type Params = { siteId: string };

export const GET = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const range = parseRange(new URL(req.url).searchParams);
  const args = { siteId: site.id, ...range };
  const [devices, browsers] = await Promise.all([deviceBreakdown(args), browserBreakdown(args, 20)]);
  return NextResponse.json({ devices, browsers });
});
