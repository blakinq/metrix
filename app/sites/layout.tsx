import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/get-user";
import { getUserSites } from "@/lib/get-user-sites";
import { unreadCount } from "@/lib/notifications";

export default async function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const sites = user ? await getUserSites(user.id) : [];
  const initialUnread = user ? await unreadCount(user.id) : 0;
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <DashboardHeader sites={sites} initialUnread={initialUnread} />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
