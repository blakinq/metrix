"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Download, Pause, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyableId } from "@/components/dashboard/copyable-id";

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
  const [copied, setCopied] = useState(false);

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

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Settings</p>

      <Card>
        <CardHeader>
          <CardTitle>Tracking snippet</CardTitle>
          <CardDescription>
            Paste this in the <code className="font-mono text-foreground/80">&lt;head&gt;</code> of your website. Your site ID is{" "}
            <CopyableId value={site.trackingId} label="tracking id" className="align-baseline" />.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-lg border border-border bg-surface/60 shadow-[0_1px_0_0_hsl(var(--foreground)/0.04)_inset]">
            <pre className="overflow-x-auto px-4 py-3.5 pr-24 font-mono text-xs leading-relaxed text-foreground/90">
              <code>{snippet}</code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              onClick={copySnippet}
              className="absolute right-2 top-2"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site details</CardTitle>
          <CardDescription>Used in the dashboard and reports.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-name">Name</Label>
              <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-domain">Domain</Label>
              <Input id="s-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
          </div>
          <div>
            <Button onClick={save} disabled={busy}>
              {busy ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking status</CardTitle>
          <CardDescription>Pause to temporarily stop accepting events.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm">
            {status === "active" ? (
              <span className="live-dot" />
            ) : (
              <span className="size-2 rounded-full bg-muted-foreground/60" />
            )}
            Currently <strong className="text-foreground">{status}</strong>
          </span>
          <Button variant="outline" onClick={toggleStatus} disabled={busy}>
            {status === "active" ? (
              <>
                <Pause className="h-4 w-4" /> Pause tracking
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Resume tracking
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Download the last 30 days of data as CSV.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["events", "sessions", "pages", "sources", "conversions"].map((type) => (
            <Button key={type} asChild variant="secondary" size="sm">
              <a href={`/api/sites/${site.id}/export/${type}?range=30d`}>
                <Download className="h-3.5 w-3.5" />
                {type}
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Soft deletes the site. Data is retained for recovery.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={destroy}
            disabled={busy}
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete site
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
