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
    <Card>
      <CardHeader>
        <CardTitle>Realtime visitors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-6xl font-semibold">{active ?? "—"}</div>
        <p className="mt-2 text-sm text-muted-foreground">Active in the last 5 minutes. Updates every 10s.</p>
      </CardContent>
    </Card>
  );
}
