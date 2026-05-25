"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GOAL_TYPES = [
  { value: "page_visit", label: "Page visit (e.g. /thank-you)" },
  { value: "button_click", label: "Button click (data-metrix-event)" },
  { value: "form_submit", label: "Form submit" },
  { value: "whatsapp_click", label: "WhatsApp click" },
  { value: "phone_click", label: "Phone number click" },
  { value: "email_click", label: "Email link click" },
  { value: "external_link", label: "External link click" },
  { value: "custom_event", label: "Custom event" },
];

export function ConversionGoalForm({ siteId }: { siteId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [goalType, setGoalType] = useState("page_visit");
  const [pagePath, setPagePath] = useState("");
  const [eventType, setEventType] = useState("button_click");
  const [eventName, setEventName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function buildRule() {
    switch (goalType) {
      case "page_visit":
        return { eventType: "page_view", pagePath };
      case "button_click":
      case "whatsapp_click":
      case "phone_click":
      case "email_click":
      case "external_link":
        return { eventType: "button_click", eventName };
      case "form_submit":
        return { eventType: "form_submit", eventName: eventName || undefined };
      case "custom_event":
      default:
        return { eventType, eventName: eventName || undefined };
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/sites/${siteId}/conversion-goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        goalType,
        matchingRule: buildRule(),
        isActive: true,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to create goal");
      setLoading(false);
      return;
    }
    setName("");
    setEventName("");
    setPagePath("");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a goal</CardTitle>
        <CardDescription>Track an action that signals buying interest.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="goal-name">Goal name</Label>
            <Input id="goal-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="WhatsApp CTA" />
          </div>
          <div className="space-y-2">
            <Label>Goal type</Label>
            <Select value={goalType} onValueChange={setGoalType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_TYPES.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {goalType === "page_visit" ? (
            <div className="space-y-2">
              <Label htmlFor="path">Page path</Label>
              <Input id="path" required value={pagePath} onChange={(e) => setPagePath(e.target.value)} placeholder="/thank-you" />
            </div>
          ) : goalType === "custom_event" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="event-type">Event type</Label>
                <Input id="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="button_click" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event-name">Event name</Label>
                <Input id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="whatsapp_click" />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="event-name">Event name (from data-metrix-event)</Label>
              <Input id="event-name" required value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="whatsapp_click" />
            </div>
          )}

          {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create goal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
