import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your sites</h1>
          <p className="text-sm text-muted-foreground">All websites tracked in this workspace.</p>
        </div>
        <Button asChild>
          <Link href="/sites/new">Add website</Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No sites yet</CardTitle>
            <CardDescription>Add your first website to start tracking visitors.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/sites/new">Add website</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link key={site.id} href={`/sites/${site.id}/overview`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>{site.name}</CardTitle>
                    <CardDescription>{site.domain}</CardDescription>
                  </div>
                  <Badge>{site.status}</Badge>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Tracking ID: <code className="font-mono">{site.trackingId}</code>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
