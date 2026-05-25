import { randomBytes } from "crypto";

function base36(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

export function generateTrackingId(): string {
  return `mx_${base36(8)}`;
}

export function generateVisitorId(): string {
  return `v_${base36(8)}`;
}

export function generateSessionId(): string {
  return `s_${base36(8)}`;
}
