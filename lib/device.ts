import { UAParser } from "ua-parser-js";

export interface DeviceInfo {
  deviceType: string;
  browser: string;
  browserVersion: string | null;
  os: string;
  osVersion: string | null;
}

export function parseUserAgent(userAgent: string | null): DeviceInfo {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      browser: "unknown",
      browserVersion: null,
      os: "unknown",
      osVersion: null,
    };
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const deviceType = device.type ?? (looksMobile(userAgent) ? "mobile" : "desktop");

  return {
    deviceType,
    browser: browser.name ?? "unknown",
    browserVersion: browser.version ?? null,
    os: os.name ?? "unknown",
    osVersion: os.version ?? null,
  };
}

function looksMobile(ua: string): boolean {
  return /Mobi|Android|iPhone|iPad/i.test(ua);
}
