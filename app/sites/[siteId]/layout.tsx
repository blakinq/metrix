import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-user";
import { getUserSites } from "@/lib/get-user-sites";
import { SiteSidebar } from "@/components/dashboard/sidebar";
import { CopyableId } from "@/components/dashboard/copyable-id";
import { Badge } from "@/components/ui/badge";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { siteId: string };
}) {
  const user = await getCurrentUser();
  if (!user) notFound();

  const site = await prisma.site.findFirst({
    where: {
      id: params.siteId,
      status: { not: "deleted" },
      workspace: { members: { some: { userId: user.id } } },
    },
  });
  if (!site) notFound();

  const sites = await getUserSites(user.id);

  return (
    <>
      <SiteSidebar siteId={site.id} siteName={site.name} sites={sites} />
      <main className="min-w-0 flex-1 px-6 py-6 md:px-10">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/sites" className="transition-colors hover:text-foreground">
            Sites
          </Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span className="text-foreground/85">{site.name}</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="display text-3xl tracking-tight">{site.name}</h1>
              <Badge variant={site.status === "active" ? "success" : "outline"}>
                {site.status === "active" && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
                {site.status}
              </Badge>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
              <span className="font-mono">{site.domain}</span>
              <span aria-hidden className="size-1 rounded-full bg-muted-foreground/40" />
              <CopyableId value={site.trackingId} label="tracking id" />
            </div>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}
