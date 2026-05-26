import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-user";
import { SiteSidebar } from "@/components/dashboard/sidebar";
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

  return (
    <>
      <SiteSidebar siteId={site.id} />
      <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/sites"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-3 w-3" />
              All sites
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="display text-3xl tracking-tight">{site.name}</h1>
              <Badge variant={site.status === "active" ? "success" : "outline"}>
                {site.status === "active" && <span className="size-1.5 rounded-full bg-primary" />}
                {site.status}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        {children}
      </main>
    </>
  );
}
