import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { markAllRead } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export const POST = route(async () => {
  const user = await requireUser();
  const count = await markAllRead(user.id);
  return NextResponse.json({ count });
});
