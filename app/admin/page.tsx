import { prisma } from "@/lib/db";
import { startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";

export default async function AdminPage() {
  const today = startOfDay(new Date());
  const [users, workspaces, sites, eventsToday, topSites, audit] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.site.count({ where: { status: { not: "deleted" } } }),
    prisma.event.count({ where: { occurredAt: { gte: today } } }),
    prisma.event.groupBy({
      by: ["siteId"],
      where: { occurredAt: { gte: today } },
      _count: { _all: true },
      orderBy: { _count: { siteId: "desc" } },
      take: 10,
    }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const siteMeta = await prisma.site.findMany({
    where: { id: { in: topSites.map((s) => s.siteId) } },
    select: { id: true, name: true, domain: true },
  });
  const lookup = new Map(siteMeta.map((s) => [s.id, s]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Users" value={formatNumber(users)} />
        <MetricCard label="Workspaces" value={formatNumber(workspaces)} />
        <MetricCard label="Sites" value={formatNumber(sites)} />
        <MetricCard label="Events today" value={formatNumber(eventsToday)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top sites by event volume today</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSites.map((s) => (
                <TableRow key={s.siteId}>
                  <TableCell>{lookup.get(s.siteId)?.name ?? s.siteId}</TableCell>
                  <TableCell className="text-muted-foreground">{lookup.get(s.siteId)?.domain ?? ""}</TableCell>
                  <TableCell className="text-right">{formatNumber(s._count._all)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent audit log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audit.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-xs text-muted-foreground">{a.createdAt.toISOString()}</TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {a.targetType}:{a.targetId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
