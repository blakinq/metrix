# Metrix — Detailed App Architecture & Systems Design

**Product Name:** Metrix  
**Product Type:** Privacy-friendly web analytics and conversion-tracking platform  
**Version:** 1.0  
**Prepared For:** Product and Engineering Planning  
**Date:** 25 May 2026  

---

## 1. Product Summary

Metrix is a lightweight analytics and conversion-tracking platform designed for small businesses, landing pages, campaign websites, product pages, and service-based businesses.

Metrix helps users understand:

- Where website visitors come from
- Which pages visitors view
- What actions visitors take
- Which channels produce meaningful engagement
- Which calls-to-action generate buying interest
- Which campaigns are actually working

Metrix should not begin as a bloated Google Analytics clone. That would be a weak strategy. The smarter direction is to build a focused, easy-to-understand analytics tool that makes visitor behaviour and buyer actions clearer for non-technical users.

### Core Product Promise

> Metrix helps website owners see where visitors come from, what they do, and which actions show real buying interest.

---

## 2. High-Level Architecture

### Core Flow

```text
Visitor Website
     ↓
Metrix Tracking Script
     ↓
Event Ingestion API
     ↓
Validation + Enrichment
     ↓
Event Storage
     ↓
Aggregation Engine
     ↓
Dashboard API
     ↓
Metrix Web Dashboard
```

### Expanded System View

```text
┌─────────────────────────┐
│ Client Website          │
│ examplebusiness.com     │
└───────────┬─────────────┘
            │
            │ Loads tracker.js
            ↓
┌─────────────────────────┐
│ Metrix Tracking Script  │
│ Page views, clicks,     │
│ forms, custom events    │
└───────────┬─────────────┘
            │
            │ POST /api/track
            ↓
┌─────────────────────────┐
│ Event Ingestion Layer   │
│ Validate, rate-limit,   │
│ clean, normalize        │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│ Enrichment Layer        │
│ Device, browser, OS,    │
│ referrer, UTM, geo      │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│ Event Database          │
│ Raw analytics events    │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│ Aggregation Engine      │
│ Daily stats, top pages, │
│ sessions, conversions   │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│ Dashboard API           │
│ Queries analytics data  │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│ Metrix Dashboard        │
│ Charts, reports, export │
└─────────────────────────┘
```

---

## 3. Recommended Technical Stack

### MVP Stack

| Layer | Recommended Tool |
|---|---|
| Frontend | Next.js + TypeScript |
| Dashboard UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Backend API | Next.js API routes, Express, or Fastify |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth, Clerk, or Supabase Auth |
| Cache / Rate Limiting | Redis |
| Hosting | Vercel, Render, Fly.io, or Railway |
| Database Hosting | Supabase, Neon, Railway, or Render Postgres |
| Error Tracking | Sentry |
| Export | Server-generated CSV |

### Later Scale Stack

| Need | Upgrade |
|---|---|
| High-volume event storage | ClickHouse |
| Event queue | Kafka, Redpanda, or BullMQ |
| Background jobs | Worker services |
| Real-time analytics | WebSockets or Server-Sent Events |
| CDN script delivery | Cloudflare or Bunny CDN |

### Architecture Recommendation

Metrix v1 should be built as a **modular monolith** with clean internal system boundaries.

Do not start with microservices. That would create unnecessary operational complexity before the product has enough traffic to justify it.

---

## 4. Core Systems

Metrix should be divided into the following core systems:

1. Identity & Access System
2. Workspace & Site Management System
3. Tracking Script System
4. Event Ingestion System
5. Visitor & Session System
6. Traffic Attribution System
7. Event Storage System
8. Aggregation & Reporting System
9. Dashboard System
10. Conversion Tracking System
11. Export System
12. Admin & Operations System
13. Privacy & Consent System
14. Observability System

---

## 5. Identity & Access System

### Purpose

The Identity & Access System controls users, authentication, permissions, account ownership, and access to analytics data.

Users must only access analytics for websites they own or have been invited to manage.

### Core Entities

```text
User
Workspace
Workspace Member
Role
```

### Recommended Ownership Model

```text
User → Workspace → Sites → Events
```

Even if MVP starts with one user per workspace, workspaces should exist from the beginning to avoid painful refactoring later.

### Roles

| Role | Permissions |
|---|---|
| Owner | Full access, billing, workspace deletion, site management |
| Admin | Site management and analytics access |
| Analyst | Analytics viewing only |
| Developer | Tracking code and integration access |

For MVP, Metrix can start with only the `Owner` role while keeping the schema ready for future roles.

### Users Table

```sql
users
- id
- name
- email
- password_hash
- email_verified_at
- created_at
- updated_at
```

### Workspaces Table

```sql
workspaces
- id
- name
- owner_id
- created_at
- updated_at
```

### Workspace Members Table

```sql
workspace_members
- id
- workspace_id
- user_id
- role
- created_at
```

---

## 6. Workspace & Site Management System

### Purpose

This system allows users to add, manage, pause, and delete websites inside Metrix.

### User Capabilities

Users should be able to:

- Create a workspace
- Add a website
- Generate a unique tracking ID
- Copy a tracking script
- Pause tracking
- Delete a site
- View analytics for a selected site

### Sites Table

```sql
sites
- id
- workspace_id
- name
- domain
- tracking_id
- status
- timezone
- created_at
- updated_at
```

### Site Statuses

```text
active
paused
deleted
```

Sites should not be hard-deleted immediately. Use soft deletion first so analytics recovery is possible.

### Site Creation Flow

```text
User logs in
↓
Clicks “Add Website”
↓
Inputs site name and domain
↓
Metrix generates tracking_id
↓
User receives JavaScript snippet
↓
User installs snippet on website
↓
Metrix begins collecting events
```

### Tracking Snippet Example

```html
<script async src="https://cdn.metrix.app/tracker.js" data-site-id="mx_abc123"></script>
```

---

## 7. Tracking Script System

### Purpose

The tracking script collects anonymous visitor and behaviour data from client websites.

This is one of the most important parts of the product. If the tracking script is heavy, slow, or unreliable, Metrix fails.

### Requirements

The script must:

- Load asynchronously
- Be lightweight
- Avoid blocking page rendering
- Create anonymous visitor IDs
- Create session IDs
- Capture page views
- Capture referrers
- Capture UTM parameters
- Capture device and browser information
- Support custom events
- Respect Do Not Track where configured
- Fail silently if blocked
- Work without breaking the client website

### Tracker File

```text
tracker.js
```

### Script Responsibilities on Page Load

```text
1. Read site ID from script tag
2. Check Do Not Track preference
3. Create or read visitor ID
4. Create or continue session
5. Capture current page URL
6. Capture page title
7. Capture referrer
8. Capture UTM parameters
9. Send page_view event to Metrix
```

### Event Sending Method

Use `navigator.sendBeacon()` where possible.

```javascript
navigator.sendBeacon("https://api.metrix.app/api/track", JSON.stringify(payload));
```

Fallback to `fetch()`:

```javascript
fetch("https://api.metrix.app/api/track", {
  method: "POST",
  keepalive: true,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});
```

### Custom Event Tracking

Client websites should be able to call:

```javascript
window.metrix.track("button_click", {
  label: "WhatsApp CTA",
  location: "hero_section"
});
```

### Example Custom Event Payload

```json
{
  "eventType": "button_click",
  "eventName": "WhatsApp CTA",
  "pageUrl": "https://example.com/",
  "metadata": {
    "location": "hero_section"
  }
}
```

### Auto-Tracking Elements

Metrix should support simple HTML attributes for non-technical users.

```html
<button data-metrix-event="whatsapp_click">
  Chat on WhatsApp
</button>
```

The tracker should automatically detect clicks on elements with:

```text
data-metrix-event
```

This is especially useful for small business owners, campaign pages, and landing pages.

---

## 8. Event Ingestion System

### Purpose

The Event Ingestion System receives analytics events from websites, validates them, enriches them, stores them, and returns a fast response.

### Main Endpoint

```http
POST /api/track
```

### Ingestion Flow

```text
Receive event
↓
Validate site ID
↓
Check site status
↓
Apply rate limit
↓
Reject or flag known bots
↓
Normalize payload
↓
Extract temporary IP for geo lookup
↓
Hash or discard IP
↓
Store event
↓
Update session
↓
Return success
```

### Critical Rule

The ingestion endpoint must be fast.

Do not run heavy analytics calculations during ingestion. That is poor architecture.

The ingestion endpoint should only:

- Validate
- Normalize
- Enrich lightly
- Store
- Return

Aggregation should happen separately.

### Accepted Event Payload

```json
{
  "siteId": "mx_abc123",
  "visitorId": "v_123",
  "sessionId": "s_456",
  "eventType": "page_view",
  "eventName": null,
  "pageUrl": "https://example.com/pricing",
  "pagePath": "/pricing",
  "referrer": "https://google.com",
  "title": "Pricing - Example",
  "screenWidth": 1440,
  "screenHeight": 900,
  "language": "en-US",
  "timezone": "Africa/Lagos",
  "utm": {
    "source": "facebook",
    "medium": "paid",
    "campaign": "june-launch",
    "term": null,
    "content": "creative-a"
  },
  "metadata": {}
}
```

### Server-Enriched Fields

The server should add:

- IP hash
- Country
- Region
- City
- User agent
- Browser
- Browser version
- Operating system
- Device type
- Received timestamp

### Privacy Rule

Do not store raw IP addresses long-term.

Better options:

- Do not store IP
- Store hashed IP
- Use IP temporarily for geo lookup, then discard it

---

## 9. Visitor & Session System

### Purpose

This system determines who counts as a unique visitor and what counts as a session.

### Visitor ID

Stored in cookie:

```text
metrix_visitor_id
```

Example:

```text
v_01HX9R4Y2K7M
```

### Session ID

Stored in session storage or cookie:

```text
metrix_session_id
```

Example:

```text
s_01HX9R4Y2K7M
```

### Session Timeout

Default session timeout:

```text
30 minutes of inactivity
```

If a visitor returns after 30 minutes, Metrix should create a new session.

### Visitor Identity Rules

| Situation | Expected Behaviour |
|---|---|
| New user visits site | Create visitor ID and session ID |
| Same user refreshes page | Same visitor ID, same session |
| User returns after 10 minutes | Same visitor ID, same session |
| User returns after 2 hours | Same visitor ID, new session |
| Cookies blocked | Use sessionStorage fallback |
| All storage blocked | Track anonymous event only |

### Sessions Table

```sql
sessions
- id
- site_id
- visitor_id
- started_at
- last_seen_at
- duration_seconds
- entry_page
- exit_page
- referrer
- source
- medium
- campaign
- country
- device_type
- browser
- pageview_count
- event_count
```

### Session Update Logic

On every event:

```text
Find current session
↓
Update last_seen_at
↓
Increment event_count
↓
If page_view, increment pageview_count
↓
Update exit_page
```

---

## 10. Traffic Attribution System

### Purpose

Traffic attribution tells users where their visitors came from.

Without attribution, Metrix becomes a basic counter. That is weak.

### Attribution Categories

Metrix should classify traffic into:

- Direct
- Organic Search
- Paid Search
- Organic Social
- Paid Social
- Referral
- Email
- WhatsApp
- LinkedIn
- Facebook
- Instagram
- TikTok
- Twitter/X
- YouTube
- Campaign/UTM
- Unknown

### Attribution Priority

Use this order:

```text
1. UTM parameters
2. Click IDs
3. Referrer domain
4. Direct fallback
```

### UTM Fields

```text
utm_source
utm_medium
utm_campaign
utm_term
utm_content
```

### Click IDs to Detect

```text
gclid
fbclid
ttclid
msclkid
li_fat_id
```

### Source Classification Examples

```text
utm_source=facebook + utm_medium=paid
→ Paid Social

referrer=google.com and no UTM
→ Organic Search

no referrer and no UTM
→ Direct
```

### Referrer Rules Table

```sql
referrer_rules
- id
- domain_pattern
- source_name
- source_category
```

Example rules:

| Domain Pattern | Source Name | Source Category |
|---|---|---|
| google.com | Google | Organic Search |
| bing.com | Bing | Organic Search |
| facebook.com | Facebook | Organic Social |
| instagram.com | Instagram | Organic Social |
| linkedin.com | LinkedIn | Organic Social |
| t.co | Twitter/X | Organic Social |
| wa.me | WhatsApp | Referral |

---

## 11. Event Storage System

### MVP Recommendation

Use PostgreSQL for MVP.

### Core Tables

- users
- workspaces
- workspace_members
- sites
- visitors
- sessions
- events
- conversion_goals
- conversion_events
- daily_site_stats
- daily_page_stats
- daily_source_stats
- daily_device_stats
- audit_logs

### Events Table

```sql
events
- id
- site_id
- visitor_id
- session_id
- event_type
- event_name
- page_url
- page_path
- page_title
- referrer
- source
- medium
- campaign
- country
- region
- city
- device_type
- browser
- os
- screen_width
- screen_height
- language
- metadata
- is_bot
- occurred_at
- received_at
```

### Important Indexes

```sql
CREATE INDEX events_site_time_idx ON events(site_id, occurred_at);
CREATE INDEX events_site_type_time_idx ON events(site_id, event_type, occurred_at);
CREATE INDEX events_site_page_idx ON events(site_id, page_path);
CREATE INDEX events_session_idx ON events(session_id);
CREATE INDEX events_visitor_idx ON events(visitor_id);
```

Without proper indexes, the dashboard will become slow once data volume grows.

---

## 12. Aggregation & Reporting System

### Purpose

The Aggregation & Reporting System turns raw events into fast, dashboard-ready metrics.

### Why Aggregation Matters

Querying raw events directly works for small volumes. It becomes inefficient as traffic grows.

Metrix should support aggregation tables early, even if the MVP still queries raw events for some reports.

### Aggregated Tables

#### daily_site_stats

```sql
daily_site_stats
- id
- site_id
- date
- pageviews
- unique_visitors
- sessions
- events
- bounce_rate
- avg_session_duration
```

#### daily_page_stats

```sql
daily_page_stats
- id
- site_id
- date
- page_path
- pageviews
- unique_visitors
- entrances
- exits
```

#### daily_source_stats

```sql
daily_source_stats
- id
- site_id
- date
- source
- medium
- campaign
- sessions
- visitors
- pageviews
- conversions
```

#### daily_device_stats

```sql
daily_device_stats
- id
- site_id
- date
- device_type
- browser
- os
- sessions
- visitors
- pageviews
```

### Aggregation Worker Flow

```text
Fetch new events
↓
Group by site, date, page, source, and device
↓
Update aggregate tables
↓
Mark events as processed where necessary
```

### Job Options

| Stage | Recommended Job System |
|---|---|
| MVP | Cron job |
| Better MVP | BullMQ + Redis |
| Scale | Kafka/Redpanda + ClickHouse materialized views |

---

## 13. Dashboard System

### Purpose

The Dashboard System presents analytics data in a clear, commercial, and action-focused way.

The dashboard should not overwhelm users with useless metrics. It should help them understand performance quickly.

### Core Dashboard Routes

```text
/sites
/sites/:siteId/overview
/sites/:siteId/realtime
/sites/:siteId/pages
/sites/:siteId/sources
/sites/:siteId/events
/sites/:siteId/conversions
/sites/:siteId/settings
```

### Main Navigation

- Overview
- Realtime
- Pages
- Traffic Sources
- Devices
- Countries
- Events
- Conversions
- Settings

### Overview Metrics

| Metric | Description |
|---|---|
| Visitors | Unique visitors in selected date range |
| Pageviews | Total page_view events |
| Sessions | Total sessions |
| Bounce Rate | Sessions with only one pageview |
| Average Session Duration | Average time from first to last event |
| Top Source | Highest traffic source |
| Top Page | Most viewed page |
| Conversions | Number of goal completions |

### Date Filters

- Today
- Yesterday
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range

### Chart Types

| Data | Chart Type |
|---|---|
| Pageviews over time | Line chart |
| Top pages | Table |
| Traffic sources | Bar chart |
| Devices | Donut chart |
| Countries | Table or map |
| Events | Table + bar chart |
| Conversions | Funnel-style list later |

### Dashboard API Pattern

Avoid one giant dashboard endpoint.

Use focused endpoints:

```http
GET /api/sites/:siteId/analytics/overview
GET /api/sites/:siteId/analytics/timeseries
GET /api/sites/:siteId/analytics/pages
GET /api/sites/:siteId/analytics/sources
GET /api/sites/:siteId/analytics/devices
GET /api/sites/:siteId/analytics/events
GET /api/sites/:siteId/analytics/conversions
```

---

## 14. Conversion Tracking System

### Purpose

This is where Metrix becomes commercially valuable.

Pageviews are not enough. Users need to know which actions suggest buying interest.

### Conversion Goal Types

- Button click
- Form submit
- Page visit
- Custom event
- External link click
- WhatsApp click
- Phone number click
- Email click

### Conversion Goals Table

```sql
conversion_goals
- id
- site_id
- name
- goal_type
- matching_rule
- is_active
- created_at
```

### Matching Rule Example: Button Click

```json
{
  "eventType": "button_click",
  "eventName": "whatsapp_click"
}
```

### Matching Rule Example: Thank-You Page

```json
{
  "eventType": "page_view",
  "pagePath": "/thank-you"
}
```

### Conversion Events Table

```sql
conversion_events
- id
- site_id
- goal_id
- event_id
- visitor_id
- session_id
- source
- medium
- campaign
- occurred_at
```

### Conversion Flow

```text
Event received
↓
Check if event matches active goal
↓
If matched, create conversion event
↓
Attribute conversion to source/campaign
↓
Show conversion in dashboard
```

### MVP Conversion Examples

These are especially valuable for small businesses and landing pages:

- WhatsApp button clicked
- Call button clicked
- Lead form submitted
- Checkout button clicked
- Thank-you page viewed
- Registration completed

---

## 15. Export System

### Purpose

Users should be able to download their analytics data for reports, offline analysis, or client updates.

### Export Types

- Events CSV
- Sessions CSV
- Top pages CSV
- Sources CSV
- Conversions CSV

### Export Endpoint Example

```http
GET /api/sites/:siteId/export/events?from=2026-05-01&to=2026-05-25
```

### Export Rules

- User must own or have access to the site
- Date range should be required
- Export size should be limited for free users later
- CSV should be generated server-side
- Large exports should use background jobs later

### Events CSV Columns

```text
event_id
event_type
event_name
page_url
source
medium
campaign
country
device_type
browser
visitor_id
session_id
occurred_at
```

---

## 16. Admin & Operations System

### Purpose

This is the internal system for monitoring and managing Metrix.

### Admin Dashboard Should Show

- Total users
- Total workspaces
- Total sites
- Total events today
- Top sites by event volume
- Failed ingestion requests
- API error rate
- Storage usage
- Suspicious traffic spikes

### Admin Actions

- Disable abusive site
- View system logs
- Inspect failed events
- Manage user accounts
- View event volume
- Pause tracking for a site

### Audit Logs Table

```sql
audit_logs
- id
- actor_user_id
- action
- target_type
- target_id
- metadata
- created_at
```

---

## 17. Privacy & Consent System

### Purpose

Analytics products handle behavioural data. Metrix must be designed with privacy in mind from the beginning.

### Privacy Rules

Metrix should:

- Avoid storing personal data by default
- Avoid storing raw IP addresses
- Use anonymous visitor IDs
- Support Do Not Track
- Allow sites to disable cookies
- Allow users to delete site data
- Allow users to export their own analytics data

### Consent Modes

| Mode | Behaviour |
|---|---|
| Cookieless | No persistent visitor ID |
| Basic Anonymous | Anonymous visitor cookie |
| Consent Required | Tracker waits until consent is granted |

### Tracker Consent API

```javascript
window.metrix.consent(true);
```

or:

```javascript
window.metrix.consent(false);
```

### Data Retention

MVP default:

```text
Keep raw events for 12 months
Keep aggregated stats indefinitely
```

Later, allow users to configure retention.

---

## 18. Observability System

### Purpose

If Metrix breaks silently, users lose trust. Observability must be part of the architecture.

### Track Internally

- API errors
- Event ingestion success rate
- Failed events
- Dashboard query time
- Database latency
- Worker failures
- Script load failures
- Rate-limit events

### Recommended Tools

| Need | Tool |
|---|---|
| Error monitoring | Sentry |
| Uptime monitoring | BetterStack or UptimeRobot |
| Database monitoring | Hosting provider metrics |
| Logs | Platform logs or structured logging |
| Queue monitoring | BullMQ dashboard if using BullMQ |

### Logs to Capture

```text
tracking_id
endpoint
status_code
error_type
timestamp
request_id
```

Do not log full event payloads with sensitive data unless necessary.

---

## 19. API Architecture

### Public API

Used by client websites.

```http
GET /tracker.js
POST /api/track
```

### Private App API

Used by logged-in Metrix users.

```http
GET /api/sites
POST /api/sites
GET /api/sites/:siteId
PATCH /api/sites/:siteId
DELETE /api/sites/:siteId

GET /api/sites/:siteId/analytics/overview
GET /api/sites/:siteId/analytics/pages
GET /api/sites/:siteId/analytics/sources
GET /api/sites/:siteId/analytics/devices
GET /api/sites/:siteId/analytics/events
GET /api/sites/:siteId/analytics/conversions

POST /api/sites/:siteId/conversion-goals
GET /api/sites/:siteId/conversion-goals
PATCH /api/sites/:siteId/conversion-goals/:goalId
DELETE /api/sites/:siteId/conversion-goals/:goalId
```

### Admin API

```http
GET /api/admin/overview
GET /api/admin/sites
GET /api/admin/events-volume
POST /api/admin/sites/:siteId/disable
```

---

## 20. Recommended Folder Structure

### Next.js MVP Structure

```text
metrix/
├── app/
│   ├── dashboard/
│   │   ├── sites/
│   │   ├── overview/
│   │   ├── sources/
│   │   ├── events/
│   │   └── conversions/
│   ├── login/
│   ├── signup/
│   └── api/
│       ├── track/
│       ├── sites/
│       ├── analytics/
│       └── export/
├── components/
│   ├── dashboard/
│   ├── charts/
│   ├── tables/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── analytics.ts
│   ├── attribution.ts
│   ├── device.ts
│   ├── geo.ts
│   └── validation.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── tracker.js
├── workers/
│   └── aggregate-events.ts
└── scripts/
    └── seed.ts
```

### Better Long-Term Structure

```text
apps/
  web/          Metrix dashboard
  api/          Ingestion and private API
  tracker/      Tracker script package

packages/
  database/
  analytics-core/
  attribution/
  shared-types/

workers/
  aggregation-worker/
```

---

## 21. Data Flow Details

### Page View Flow

```text
Visitor opens website
↓
tracker.js loads
↓
tracker reads site ID
↓
tracker creates visitor/session IDs
↓
tracker captures page data
↓
tracker sends page_view event
↓
API validates tracking ID
↓
API enriches event
↓
Event saved to database
↓
Session updated
↓
Aggregation worker updates stats
↓
Dashboard displays pageview
```

### Button Click Flow

```text
Visitor clicks CTA button
↓
tracker detects data-metrix-event
↓
tracker sends button_click event
↓
API stores event
↓
Conversion checker checks matching goals
↓
If matched, conversion_event is created
↓
Dashboard conversion count increases
```

### Dashboard Load Flow

```text
User opens Metrix dashboard
↓
Frontend requests overview API
↓
API checks user owns site
↓
API queries aggregate tables
↓
API returns metrics
↓
Frontend renders charts and tables
```

---

## 22. Security Architecture

### Security Requirements

Metrix must:

- Require authentication for dashboard routes
- Ensure users only access sites within their workspace
- Validate tracking IDs on event ingestion
- Rate-limit public tracking endpoints
- Sanitize all inputs
- Use parameterized queries through ORM
- Protect against IDOR vulnerabilities
- Enforce HTTPS
- Use secure cookies

### IDOR Protection

Bad pattern:

```text
User requests /api/sites/site_123 and gets data without ownership check.
```

Correct pattern:

```text
Check site belongs to the authenticated user's workspace before returning data.
```

Every private endpoint must enforce:

```text
user → workspace membership → site ownership
```

---

## 23. Rate Limiting

### Public Tracking Endpoint

Rate-limit by:

- Site ID
- IP hash
- User agent

Example limits:

```text
Max 300 events/minute per IP per site
Max 20,000 events/day per free site later
```

### Dashboard API

Rate-limit by authenticated user ID.

Example:

```text
100 requests/minute per user
```

---

## 24. Bot Filtering System

### MVP Bot Filtering

Start with simple bot filtering. Do not overbuild it early.

### Filter Signals

- Known bot user agents
- Missing browser APIs
- Very high event frequency
- No screen size
- Suspicious referrer spam
- Datacenter IP ranges later

### Known Bot User-Agent Keywords

```text
bot
crawler
spider
Googlebot
Bingbot
AhrefsBot
SemrushBot
MJ12bot
```

### Bot Flag

Instead of deleting suspicious traffic immediately, store:

```sql
is_bot BOOLEAN DEFAULT false
```

Exclude bots from dashboard metrics by default.

---

## 25. Deployment Architecture

### MVP Deployment

```text
Vercel
- Dashboard frontend
- API routes if traffic is light

Supabase / Neon
- PostgreSQL database

Upstash Redis
- Rate limiting
- Simple background queues

Cloudflare
- CDN for tracker.js
- Basic WAF protection
```

### Better Production Deployment

```text
Cloudflare CDN
↓
API server on Fly.io / Render / Railway
↓
PostgreSQL primary database
↓
Redis for queues/rate limits
↓
Worker service for aggregation
↓
Object storage for exports if needed
```

### Suggested Subdomains

```text
cdn.metrix.app        → tracker.js
api.metrix.app        → ingestion + private API
app.metrix.app        → dashboard
admin.metrix.app      → internal admin
```

---

## 26. Environments

Use three environments:

```text
development
staging
production
```

### Environment Variables

```env
DATABASE_URL=
REDIS_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
APP_URL=
API_URL=
TRACKER_CDN_URL=
SENTRY_DSN=
GEOIP_API_KEY=
```

---

## 27. MVP Build Sequence

Do not build everything at once. That is how projects collapse.

### Phase 1 — Foundation

- Authentication
- Workspace creation
- Site creation
- Tracking ID generation
- Basic dashboard shell

### Phase 2 — Tracking

- tracker.js
- /api/track endpoint
- page_view tracking
- visitor/session IDs
- events table

### Phase 3 — Dashboard

- Overview metrics
- Top pages
- Traffic sources
- Devices
- Countries
- Date filters

### Phase 4 — Events & Conversions

- Custom event tracking
- data-metrix-event support
- Conversion goals
- Conversion dashboard

### Phase 5 — Reliability

- Rate limiting
- Bot filtering
- Aggregation worker
- CSV export
- Admin dashboard
- Error monitoring

---

## 28. MVP Feature List

### Must-Have

- User signup/login
- Create site
- Generate tracking script
- Track page views
- Track sessions
- Track unique visitors
- Track referrers
- Track UTM campaigns
- Track devices/browsers
- Dashboard overview
- Top pages report
- Traffic source report
- Basic event tracking
- CSV export

### Should-Have

- Conversion goals
- WhatsApp click tracking
- Form submit tracking
- Bot filtering
- Admin dashboard
- Aggregation worker

### Not Needed Yet

- AI insights
- Heatmaps
- Session recording
- Complex funnels
- Team permissions
- Billing
- Public dashboards
- A/B testing

These features should wait. Adding them too early will slow development and weaken the MVP.

---

## 29. MVP Database Schema Overview

```text
users
workspaces
workspace_members
sites
visitors
sessions
events
conversion_goals
conversion_events
daily_site_stats
daily_page_stats
daily_source_stats
daily_device_stats
audit_logs
```

---

## 30. Final Architecture Verdict

The best architecture for Metrix v1 is:

```text
A modular monolith with clean system boundaries.
```

Metrix should not begin as a microservices system or a Google Analytics clone.

Build:

- Next.js dashboard
- PostgreSQL database
- Lightweight tracker.js
- Fast ingestion endpoint
- Clean event schema
- Simple aggregation worker
- Conversion-focused dashboard

The product becomes valuable when it answers this question better than Google Analytics for small users:

> What happened on my website, where did people come from, and what actions show buying interest?

That is the heart of Metrix.

