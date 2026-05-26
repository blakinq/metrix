import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { SettingsClient } from "./settings-client";

function deriveOrigin(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : "";
}

export default async function SettingsPage({ params }: { params: { siteId: string } }) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const site = await getSiteForUser(params.siteId, user.id);
  if (!site) notFound();

  const origin = process.env.TRACKER_CDN_URL
    ? process.env.TRACKER_CDN_URL.replace(/\/tracker\.js$/, "")
    : process.env.APP_URL || deriveOrigin();
  const trackerUrl = `${origin.replace(/\/$/, "")}/tracker.js`;

  return (
    <SettingsClient
      site={{
        id: site.id,
        name: site.name,
        domain: site.domain,
        trackingId: site.trackingId,
        status: site.status,
        timezone: site.timezone,
      }}
      trackerUrl={trackerUrl}
    />
  );
}
