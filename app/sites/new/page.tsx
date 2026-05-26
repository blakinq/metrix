"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewSitePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to create site");
      setLoading(false);
      return;
    }
    const { site } = await res.json();
    router.push(`/sites/${site.id}/settings?new=1`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link
        href="/sites"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-3 w-3" />
        All sites
      </Link>
      <h1 className="display mt-3 text-3xl tracking-tight">Add a website</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        We&rsquo;ll generate a unique tracking ID for you.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Site details</CardTitle>
          <CardDescription>You can rename it later from settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Site name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My landing page"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
              />
            </div>
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
            <div className="mt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : (
                  <>
                    Create site
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
