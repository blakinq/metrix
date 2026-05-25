import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";
import { parseRange } from "@/lib/session";
import { customEvents } from "@/lib/analytics";

type Params = { siteId: string };

export const GET = route<Params>(async (req, { params }) => {
  const user = await requireUser();
  const site = await assertSiteAccess(params.siteId, user.id);
  const range = parseRange(new URL(req.url).searchParams);
  const events = await customEvents({ siteId: site.id, ...range });
  return NextResponse.json({ events });
});
