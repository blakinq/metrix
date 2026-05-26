import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { unreadCount } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  const user = await requireUser();
  const unread = await unreadCount(user.id);
  return NextResponse.json({ unread });
});
