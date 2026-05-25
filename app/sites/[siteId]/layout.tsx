import { notFound } from "next/navigation";
import Link from "next/link";
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
      <main className="flex-1 px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/sites" className="text-xs text-muted-foreground hover:underline">
              ← All sites
            </Link>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{site.name}</h1>
              <Badge>{site.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        {children}
      </main>
    </>
  );
}
