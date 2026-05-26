"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RealtimePage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const res = await fetch(`/api/sites/${siteId}/analytics/realtime`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (alive) setActive(data.activeVisitors);
      } catch {}
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [siteId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <span className="live-dot" />
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Realtime</p>
      </div>

      <Card className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <CardHeader>
          <CardTitle>Visitors active right now</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-baseline gap-3">
            <span className="stat-num text-7xl font-medium text-foreground">
              {active ?? "—"}
            </span>
            <span className="text-sm text-muted-foreground">currently</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Active in the last 5 minutes · refreshes every 10s
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
