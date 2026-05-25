"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="flex-1 px-6 py-8">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Add a website</CardTitle>
          <CardDescription>We&apos;ll generate a unique tracking ID for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="My landing page" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" required value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create site"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
