/**
 * MVP bot detection — see §24. Stays simple; flags is_bot rather than dropping.
 */

const BOT_KEYWORDS = [
  "bot",
  "crawler",
  "spider",
  "googlebot",
  "bingbot",
  "ahrefsbot",
  "semrushbot",
  "mj12bot",
  "duckduckbot",
  "yandexbot",
  "applebot",
  "facebookexternalhit",
  "twitterbot",
  "slackbot",
  "headlesschrome",
  "phantomjs",
  "puppeteer",
  "playwright",
  "lighthouse",
];

export function isBot(userAgent: string | null | undefined, screenWidth?: number | null): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  if (BOT_KEYWORDS.some((kw) => ua.includes(kw))) return true;
  if (screenWidth === 0) return true;
  return false;
}
