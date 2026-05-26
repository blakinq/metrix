# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Next.js dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Run production build
npm run lint             # ESLint (next lint)
npm run typecheck        # tsc --noEmit, no test runner in this repo

# Database (Prisma + Postgres)
npm run db:push          # Push schema to DB without a migration (dev convenience)
npm run db:migrate       # Create + run a dev migration
npm run db:generate      # Regenerate Prisma client (also runs postinstall)
npm run db:seed          # tsx prisma/seed.ts

# Background work
npm run worker:aggregate                       # Aggregate yesterday's events
npm run worker:aggregate -- --date=2026-05-24  # Aggregate a specific day
npm run smoke                                  # tsx scripts/smoke-test.ts — end-to-end ingest+query check
```

There is no test runner. Verification is done via `npm run typecheck`, `npm run lint`, and `npm run smoke`.

## Architecture

Metrix is a privacy-friendly web analytics product. The canonical design doc is `metrix_app_architecture.md` — read it for product intent and schema rationale; the section numbers (`§7`, `§22`, etc.) are referenced from comments throughout the code.

The repo is a **modular monolith** on Next.js 14 (App Router) with Prisma + Postgres. There are no microservices.

### Two surfaces, one app

- **Public surface** — consumed by tracked websites:
  - `GET /tracker.js` — static file served from `public/tracker.js` with permissive CORS (configured in `next.config.mjs`).
  - `POST /api/track` — ingestion endpoint. Open to any origin (`Access-Control-Allow-Origin: *`).
- **Private surface** — consumed by the logged-in dashboard:
  - All routes under `/sites/*` and `/admin/*` are gated by `middleware.ts` (NextAuth).
  - All `/api/sites/[siteId]/**` routes are owned-site-scoped.

### Ingestion flow (`/api/track`)

`app/api/track/route.ts` is hot-path code. The contract: **fast in, no heavy computation**. Order matters:

1. Validate payload with `trackEventSchema` (`lib/validation.ts`).
2. Look up site by `trackingId`; silently 204 if missing or paused (don't leak existence).
3. Rate-limit by `(siteId, ip)` via `lib/rate-limit.ts` (Upstash Redis when configured, in-memory fallback otherwise).
4. Light enrichment: user-agent → device (`lib/device.ts`), IP → geo (`lib/geo.ts`), referrer/UTM → attribution (`lib/attribution.ts`), bot signals (`lib/bot-filter.ts`).
5. In a Prisma transaction: upsert `Session`, then create `Event`. Session counters (`pageviewCount`, `eventCount`, `durationSeconds`, `exitPage`) are updated in the same transaction.
6. **`processConversions(event)` is fire-and-forget after the response** — never `await` it on the request path.

Aggregation is deliberately **not** done on ingest. See `workers/aggregate-events.ts` and the Vercel cron in `vercel.json` (`/api/cron/aggregate` daily at 02:00 UTC, auth'd via `CRON_SECRET`).

### IDOR protection is centralized

Every private API route that touches a site **must** call `assertSiteAccess(siteId, userId)` from `lib/ownership.ts`. It scopes the query to the user's workspace memberships. There is no other place this check is enforced — if you skip it, you've created an IDOR.

Pattern for private API routes:

```ts
import { requireUser, route } from "@/lib/get-user";
import { assertSiteAccess } from "@/lib/ownership";

export const GET = route<{ siteId: string }>(async (req, { params }) => {
  const user = await requireUser();          // throws HttpError(401)
  const site = await assertSiteAccess(params.siteId, user.id); // throws HttpError(404)
  // ...query using site.id (the internal id, not the tracking_id)
});
```

`route()` from `lib/get-user.ts` wraps the handler so thrown `HttpError`s become proper responses and Next.js's `DYNAMIC_SERVER_USAGE` bail-out is re-thrown rather than swallowed. Use it for all private API routes.

### Tracking ID vs. site ID

These are two different identifiers and mixing them is a bug:

- `Site.trackingId` (e.g. `mx_abc123`) — public, sent from `tracker.js` in `data-site-id`, used to look up sites on ingest.
- `Site.id` (cuid) — internal, used for foreign keys and ownership checks. Always resolve `trackingId → site.id` before joining other tables.

### Data model groups

The Prisma schema (`prisma/schema.prisma`) has four logical groups:

- **Identity**: `User`, `Workspace`, `WorkspaceMember` (workspaces exist even though MVP is one-user-per-workspace).
- **Tracking config**: `Site`, `ConversionGoal`.
- **Raw events**: `Session`, `Event`, `ConversionEvent`. Indexed for `(siteId, occurredAt)` queries.
- **Daily aggregates**: `DailySiteStats`, `DailyPageStats`, `DailySourceStats`, `DailyDeviceStats`. The dashboard reads these for date-range queries; only the realtime view hits raw events.

Sites use soft-delete (`status = "deleted"`), so add `status: { not: "deleted" }` to queries that should hide them.

### Tracker script (`public/tracker.js`)

Hand-written vanilla JS, no build step. Three consent modes via `data-consent` attribute:

- `basic` (default) — sets `metrix_visitor_id` cookie for 365 days.
- `cookieless` — no cookies, ephemeral visitor IDs per page.
- `required` — waits for `window.metrix.consent(true)`.

Sends via `navigator.sendBeacon` with a `fetch({ keepalive: true })` fallback. Respects DNT. Fails silently — never throws into the host page.

### Routing layout

- `app/(landing)` is implicit — `app/page.tsx` is the marketing landing.
- `app/sites/[siteId]/` is the per-site dashboard (overview / realtime / pages / sources / devices / countries / events / conversions / settings). Each page has a matching API route under `app/api/sites/[siteId]/analytics/`.
- `app/admin/` is the internal admin surface (super-admin only; check `User.isSuperAdmin`).
- API routes mirror the dashboard routes 1:1 — when adding a dashboard view, expect to add a matching `/api/sites/[siteId]/analytics/<view>/route.ts`.

### Auth

NextAuth with Credentials provider + JWT sessions (`lib/auth.ts`). `lib/get-user.ts` exposes `getCurrentUser()` (nullable) and `requireUser()` (throws 401). The session user's id is on `(session.user as { id }).id`, not a top-level field.

## Conventions

- Server components are the default; mark client components with `"use client"`.
- Use `prisma` from `lib/db.ts` — it's the singleton; do not `new PrismaClient()`.
- Validation lives in `lib/validation.ts` (Zod). Don't validate at the route level ad-hoc.
- Rate limiting: `rateLimitIngest(siteId, ip)` for the public tracker, `rateLimitDashboard(userId)` for the private API. Both fall back to in-memory if Upstash env vars are absent.
- Logging: `log.error/info/warn` from `lib/logger.ts`. Don't log raw event payloads.
- Aliases: `@/*` resolves to the repo root (see `tsconfig.json`).
- UI: shadcn/ui in `components/ui/` (config in `components.json`), Tailwind, lucide-react icons, Recharts.
