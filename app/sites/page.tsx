import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Plus, Globe } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SitesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sites = await prisma.site.findMany({
    where: {
      status: { not: "deleted" },
      workspace: { members: { some: { userId: user.id } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
          <h1 className="display mt-1 text-4xl tracking-tight">Your sites</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All websites tracked in this workspace.
          </p>
        </div>
        <Button asChild>
          <Link href="/sites/new">
            <Plus className="h-4 w-4" />
            Add website
          </Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border bg-card/30 px-6 py-16 text-center">
          <div className="grid size-12 place-items-center rounded-full border border-border bg-surface text-muted-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium">No sites yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first website to start tracking visitors.
            </p>
          </div>
          <Button asChild>
            <Link href="/sites/new">
              <Plus className="h-4 w-4" />
              Add your first site
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/sites/${site.id}/overview`}
              className="group relative flex flex-col gap-5 rounded-md border border-border/70 bg-card p-5 transition-all hover:border-foreground/20 hover:bg-surface/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-medium text-foreground">{site.name}</h3>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{site.domain}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs">
                <span className="font-mono text-muted-foreground">{site.trackingId}</span>
                <Badge variant={site.status === "active" ? "success" : "outline"}>
                  {site.status === "active" && <span className="size-1.5 rounded-full bg-primary" />}
                  {site.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
