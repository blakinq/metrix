import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage({ params }: { params: { siteId: string } }) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const site = await getSiteForUser(params.siteId, user.id);
  if (!site) notFound();

  const trackerUrl = process.env.TRACKER_CDN_URL || `${process.env.APP_URL ?? ""}/tracker.js`;

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
