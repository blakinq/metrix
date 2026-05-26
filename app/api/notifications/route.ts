import { NextResponse } from "next/server";
import { requireUser, route } from "@/lib/get-user";
import { listNotifications, unreadCount } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  const user = await requireUser();
  const [items, unread] = await Promise.all([
    listNotifications(user.id, 20),
    unreadCount(user.id),
  ]);
  return NextResponse.json({ items, unread });
});
