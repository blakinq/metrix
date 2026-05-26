import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/get-user";
import { listNotifications, unreadCount } from "@/lib/notifications";
import { DashboardHeader } from "@/components/dashboard/header";
import { getUserSites } from "@/lib/get-user-sites";
import { NotificationList } from "./notification-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [items, sites, unread] = await Promise.all([
    listNotifications(user.id, 100),
    getUserSites(user.id),
    unreadCount(user.id),
  ]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <DashboardHeader sites={sites} initialUnread={unread} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 md:px-10">
        <Link
          href="/sites"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3 w-3" />
          All sites
        </Link>
        <div className="mt-3 flex items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Notifications
            </p>
            <h1 className="display mt-1 text-3xl tracking-tight">All updates</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Milestones, new goals, and site events. {unread > 0 ? `${unread} unread.` : "All caught up."}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <NotificationList items={items.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body,
            link: n.link,
            isRead: n.isRead,
            createdAt: n.createdAt.toISOString(),
          }))} />
        </div>
      </main>
    </div>
  );
}
