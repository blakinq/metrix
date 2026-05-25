"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Site {
  id: string;
  name: string;
  domain: string;
  trackingId: string;
  status: string;
  timezone: string;
}

export function SettingsClient({ site, trackerUrl }: { site: Site; trackerUrl: string }) {
  const router = useRouter();
  const [name, setName] = useState(site.name);
  const [domain, setDomain] = useState(site.domain);
  const [status, setStatus] = useState(site.status);
  const [busy, setBusy] = useState(false);

  const snippet = `<script async src="${trackerUrl}" data-site-id="${site.trackingId}"></script>`;

  async function save() {
    setBusy(true);
    await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain, status: status === "active" ? "active" : "paused" }),
    });
    setBusy(false);
    router.refresh();
  }

  async function destroy() {
    if (!confirm("Delete this site? Analytics data will be hidden but kept for recovery.")) return;
    setBusy(true);
    await fetch(`/api/sites/${site.id}`, { method: "DELETE" });
    setBusy(false);
    router.push("/sites");
  }

  async function toggleStatus() {
    const next = status === "active" ? "paused" : "active";
    setStatus(next);
    await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tracking snippet</CardTitle>
          <CardDescription>Paste this in the <code>&lt;head&gt;</code> of your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md border bg-muted p-4 text-xs">
            <code>{snippet}</code>
          </pre>
          <Button
            className="mt-3"
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(snippet)}
          >
            Copy snippet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-name">Name</Label>
            <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-domain">Domain</Label>
            <Input id="s-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
          </div>
          <Button onClick={save} disabled={busy}>
            {busy ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking status</CardTitle>
          <CardDescription>Pause to temporarily stop accepting events.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm">
            Currently: <strong>{status}</strong>
          </span>
          <Button variant="outline" onClick={toggleStatus} disabled={busy}>
            {status === "active" ? "Pause tracking" : "Resume tracking"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Soft-deletes the site. Data is retained for recovery.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={destroy} disabled={busy}>
            Delete site
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Download your analytics data as CSV.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["events", "sessions", "pages", "sources", "conversions"].map((type) => (
            <Button key={type} asChild variant="outline">
              <a href={`/api/sites/${site.id}/export/${type}?range=30d`}>{type} CSV</a>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
