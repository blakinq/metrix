/**
 * Traffic attribution — see metrix_app_architecture.md §10.
 * Priority: UTM → click IDs → referrer → direct.
 */

export interface Utm {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  term?: string | null;
  content?: string | null;
}

export interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  category: string;
}

const CATEGORY = {
  DIRECT: "Direct",
  ORGANIC_SEARCH: "Organic Search",
  PAID_SEARCH: "Paid Search",
  ORGANIC_SOCIAL: "Organic Social",
  PAID_SOCIAL: "Paid Social",
  REFERRAL: "Referral",
  EMAIL: "Email",
  CAMPAIGN: "Campaign",
  UNKNOWN: "Unknown",
} as const;

interface RefRule {
  pattern: RegExp;
  name: string;
  category: string;
}

const REFERRER_RULES: RefRule[] = [
  { pattern: /(^|\.)google\./i, name: "Google", category: CATEGORY.ORGANIC_SEARCH },
  { pattern: /(^|\.)bing\.com$/i, name: "Bing", category: CATEGORY.ORGANIC_SEARCH },
  { pattern: /(^|\.)duckduckgo\.com$/i, name: "DuckDuckGo", category: CATEGORY.ORGANIC_SEARCH },
  { pattern: /(^|\.)yahoo\.com$/i, name: "Yahoo", category: CATEGORY.ORGANIC_SEARCH },
  { pattern: /(^|\.)yandex\./i, name: "Yandex", category: CATEGORY.ORGANIC_SEARCH },
  { pattern: /(^|\.)facebook\.com$|^fb\.com$|^m\.facebook\.com$/i, name: "Facebook", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)instagram\.com$/i, name: "Instagram", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)linkedin\.com$/i, name: "LinkedIn", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/i, name: "Twitter/X", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)tiktok\.com$/i, name: "TikTok", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)youtube\.com$|^youtu\.be$/i, name: "YouTube", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)pinterest\.com$/i, name: "Pinterest", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /(^|\.)reddit\.com$/i, name: "Reddit", category: CATEGORY.ORGANIC_SOCIAL },
  { pattern: /^wa\.me$|^api\.whatsapp\.com$|^web\.whatsapp\.com$/i, name: "WhatsApp", category: CATEGORY.REFERRAL },
  { pattern: /(^|\.)gmail\.com$|^mail\./i, name: "Email", category: CATEGORY.EMAIL },
];

const CLICK_ID_RULES: { param: string; source: string; category: string }[] = [
  { param: "gclid", source: "Google", category: CATEGORY.PAID_SEARCH },
  { param: "fbclid", source: "Facebook", category: CATEGORY.PAID_SOCIAL },
  { param: "ttclid", source: "TikTok", category: CATEGORY.PAID_SOCIAL },
  { param: "msclkid", source: "Bing", category: CATEGORY.PAID_SEARCH },
  { param: "li_fat_id", source: "LinkedIn", category: CATEGORY.PAID_SOCIAL },
];

export function attribute(input: {
  utm?: Utm | null;
  referrer?: string | null;
  pageUrl?: string | null;
}): Attribution {
  const { utm, referrer, pageUrl } = input;

  if (utm?.source && utm.source.trim()) {
    const source = utm.source.trim();
    const medium = (utm.medium ?? "").trim();
    return {
      source,
      medium: medium || "(none)",
      campaign: utm.campaign?.trim() || "(none)",
      category: classifyUtm(source, medium),
    };
  }

  const clickIdMatch = matchClickId(pageUrl);
  if (clickIdMatch) {
    return {
      source: clickIdMatch.source,
      medium: clickIdMatch.category.includes("Paid") ? "paid" : "referral",
      campaign: "(none)",
      category: clickIdMatch.category,
    };
  }

  if (referrer) {
    const domain = safeDomain(referrer);
    if (domain) {
      for (const rule of REFERRER_RULES) {
        if (rule.pattern.test(domain)) {
          return {
            source: rule.name,
            medium: rule.category === CATEGORY.ORGANIC_SEARCH ? "organic" : "referral",
            campaign: "(none)",
            category: rule.category,
          };
        }
      }
      return {
        source: domain,
        medium: "referral",
        campaign: "(none)",
        category: CATEGORY.REFERRAL,
      };
    }
  }

  return {
    source: "(direct)",
    medium: "(none)",
    campaign: "(none)",
    category: CATEGORY.DIRECT,
  };
}

function classifyUtm(source: string, medium: string): string {
  const m = medium.toLowerCase();
  const s = source.toLowerCase();
  if (m === "cpc" || m === "ppc" || m === "paid" || m === "paidsearch") {
    if (/google|bing|yahoo|duck/.test(s)) return CATEGORY.PAID_SEARCH;
    return CATEGORY.PAID_SOCIAL;
  }
  if (m === "paid-social" || m === "paidsocial" || m === "social-paid") return CATEGORY.PAID_SOCIAL;
  if (m === "social" || m === "social-organic") return CATEGORY.ORGANIC_SOCIAL;
  if (m === "email" || m === "newsletter") return CATEGORY.EMAIL;
  if (m === "referral") return CATEGORY.REFERRAL;
  if (m === "organic") return CATEGORY.ORGANIC_SEARCH;
  if (m === "campaign" || m === "affiliate") return CATEGORY.CAMPAIGN;
  return CATEGORY.CAMPAIGN;
}

function matchClickId(pageUrl?: string | null) {
  if (!pageUrl) return null;
  try {
    const url = new URL(pageUrl);
    for (const rule of CLICK_ID_RULES) {
      if (url.searchParams.has(rule.param)) return rule;
    }
  } catch {
    return null;
  }
  return null;
}

function safeDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function parseUtmFromUrl(pageUrl?: string | null): Utm | null {
  if (!pageUrl) return null;
  try {
    const url = new URL(pageUrl);
    const utm: Utm = {
      source: url.searchParams.get("utm_source"),
      medium: url.searchParams.get("utm_medium"),
      campaign: url.searchParams.get("utm_campaign"),
      term: url.searchParams.get("utm_term"),
      content: url.searchParams.get("utm_content"),
    };
    if (!utm.source && !utm.medium && !utm.campaign) return null;
    return utm;
  } catch {
    return null;
  }
}
