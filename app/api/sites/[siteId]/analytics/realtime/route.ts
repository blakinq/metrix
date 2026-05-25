import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { realtimeVisitors } from "@/lib/analytics";

type Params = { siteId: string };

export const GET = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const data = await realtimeVisitors(site.id);
  return NextResponse.json(data);
});
