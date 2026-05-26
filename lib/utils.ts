import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function formatPercent(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

const regionNames =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

/**
 * Resolve an ISO 3166-1 alpha-2 country code to its English display name
 * (e.g. "NG" → "Nigeria"). Falls back to the raw input for unknown codes.
 */
export function countryName(code: string | null | undefined): string {
  if (!code) return "Unknown";
  if (!regionNames) return code;
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/**
 * Percent change between two numbers. Returns null when the previous value is
 * zero (delta is undefined). Positive values mean growth.
 */
export function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
