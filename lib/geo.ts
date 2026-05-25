/**
 * Read geo info from CDN/proxy headers (Cloudflare, Vercel).
 * Falls back to nulls when not present — Metrix never depends on raw IPs.
 */
import type { NextRequest } from "next/server";

export interface GeoInfo {
  country: string | null;
  region: string | null;
  city: string | null;
}

export function geoFromRequest(req: NextRequest | Request): GeoInfo {
  const headers = (req as NextRequest).headers ?? new Headers();
  const country =
    headers.get("cf-ipcountry") ??
    headers.get("x-vercel-ip-country") ??
    null;
  const region = headers.get("x-vercel-ip-country-region") ?? null;
  const city = headers.get("cf-ipcity") ?? headers.get("x-vercel-ip-city") ?? null;
  return { country, region, city };
}

export function clientIp(req: NextRequest | Request): string | null {
  const headers = (req as NextRequest).headers ?? new Headers();
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? null;
  return headers.get("x-real-ip") ?? null;
}
