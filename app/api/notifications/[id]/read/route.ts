import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { markRead } from "@/lib/notifications";

export const dynamic = "force-dynamic";

type Params = { id: string };

export const POST = route<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const ok = await markRead(params.id, user.id);
  return NextResponse.json({ ok });
});
