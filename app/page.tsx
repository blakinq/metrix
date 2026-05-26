import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Target,
  Code2,
  BarChart3,
  Check,
  X,
  Minus,
  Github,
  Twitter,
  ClipboardPaste,
  Flag,
  Eye,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { RealtimeCard } from "@/components/landing/realtime-card";
import { FaqItem } from "@/components/landing/faq-item";
import { Testimonials } from "@/components/landing/testimonials";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Privacy by default",
    body: "Cookie-free, anonymous, GDPR/CCPA compliant. We don't need a banner — and neither do you.",
  },
  {
    icon: Zap,
    title: "Under 1kb tracker",
    body: "A script so small you'll forget it's there. Loads async, never blocks render, no jQuery.",
  },
  {
    icon: Activity,
    title: "True real-time",
    body: "See visitors arriving as it happens. No 24-hour delays, no sampling, no guessing.",
  },
  {
    icon: Target,
    title: "Conversion goals",
    body: "Track WhatsApp clicks, form submits, button clicks, page visits — every action that matters.",
  },
  {
    icon: BarChart3,
    title: "Beautiful by design",
    body: "Built for clarity, not feature creep. Numbers you can actually read at a glance.",
  },
  {
    icon: Code2,
    title: "Yours forever",
    body: "Export raw CSV anytime. Self-host the tracker. You own your data — full stop.",
  },
];

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste the snippet",
    body: "One <script> tag in your <head>. Push to production. The tracker is under 1kb and loads async.",
    time: "~60 seconds",
  },
  {
    icon: Flag,
    title: "Set your goals",
    body: "Tell us what matters — page visits, button clicks, form submits, WhatsApp taps. No code required.",
    time: "~2 minutes",
  },
  {
    icon: Eye,
    title: "Watch the data land",
    body: "Visitors arrive live. Conversions count themselves. You ship the next campaign with conviction.",
    time: "From day one",
  },
];

const COMPARISON = [
  { feature: "Tracker size", us: "<1kb", them: "~45kb" },
  { feature: "Cookies set", us: "0", them: "Multiple" },
  { feature: "Cookie banner required", us: false, them: true },
  { feature: "Time to first insight", us: "Seconds", them: "24 hours" },
  { feature: "Data sampling", us: false, them: true },
  { feature: "Data ownership", us: "You", them: "Google" },
  { feature: "Setup complexity", us: "One <script> tag", them: "Tag Manager + config" },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Perfect for a single landing page or side project.",
    features: ["1 site", "10k events / month", "30-day history", "Real-time view", "CSV export"],
    cta: "Start tracking",
    href: "/signup",
    accent: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/ month",
    blurb: "For agencies, founders, and serious operators.",
    features: [
      "10 sites",
      "100k events / month",
      "Unlimited history",
      "Conversion goals",
      "Email reports",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    href: "/signup",
    accent: true,
  },
  {
    name: "Business",
    price: "$79",
    cadence: "/ month",
    blurb: "Scale, team seats, and the API.",
    features: [
      "Unlimited sites",
      "1M events / month",
      "Team seats",
      "REST API access",
      "Custom retention",
      "Slack + SLA support",
    ],
    cta: "Talk to us",
    href: "/signup",
    accent: false,
  },
];

const FAQS = [
  {
    q: "Does Metrix use cookies?",
    a: "No. We use a salted hash of IP + user-agent that rotates daily, so visitors are counted without setting any cookies or storing personal identifiers. No banner required.",
  },
  {
    q: "Is Metrix GDPR and CCPA compliant?",
    a: "Yes. We collect no personal data, set no cookies, and process visitor data anonymously. Hashes rotate every 24 hours, making cross-day tracking impossible by design.",
  },
  {
    q: "How is this different from Google Analytics?",
    a: "Metrix is a tiny, privacy-first replacement focused on the metrics that actually inform business decisions: visitors, pageviews, sources, conversions. No 45kb script, no cookie banner, no sampling, and no waiting 24 hours for data to appear.",
  },
  {
    q: "Can I track conversions?",
    a: "Yes. Define goals for page visits (e.g. /thank-you), button clicks, form submits, WhatsApp/phone clicks, or any custom event you fire from your code. You'll see conversion counts and rates in the dashboard.",
  },
  {
    q: "Can I export my data?",
    a: "Anytime. Every site has CSV exports for events, sessions, pages, sources, and conversions. There's no lock-in — your data belongs to you.",
  },
  {
    q: "Do you offer a free plan?",
    a: "Yes — the Free plan includes 1 site, 10k events per month, 30-day history, and real-time tracking. No credit card needed.",
  },
  {
    q: "Can I self-host the tracker script?",
    a: "Yes. The /tracker.js file is a single tiny script you can copy onto your own CDN if you'd like full control over delivery.",
  },
];

function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
      <span className="font-mono text-foreground/50">{num}</span>
      <span className="h-px w-6 bg-border" aria-hidden />
      {label}
    </p>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-transparent backdrop-blur-md transition-colors data-[scrolled=true]:border-border/60 data-[scrolled=true]:bg-background/75">
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Logo size="md" />
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#testimonials" className="transition-colors hover:text-foreground">Testimonials</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 text-center md:pt-24">
          <span className="mb-8 inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            Privacy-first analytics, built for small teams
          </span>

          <h1
            className="display animate-fade-up text-balance text-5xl leading-[1.05] tracking-tight md:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            See what actually <em className="not-italic font-normal text-primary">moves</em>
            <br className="hidden md:block" /> the needle.
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl animate-fade-up text-balance text-base text-muted-foreground md:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            Metrix is a lightweight, cookie-free analytics platform for landing
            pages, campaign sites, and small businesses that just want to know
            what&rsquo;s working.
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start tracking — free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-surface"
            >
              See how it works
            </Link>
          </div>

          <p
            className="mt-6 animate-fade-up text-xs text-muted-foreground"
            style={{ animationDelay: "260ms" }}
          >
            Free forever for 1 site · No credit card · Setup in 60 seconds
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto -mt-6 max-w-6xl px-6 pb-20 md:-mt-4 md:px-10">
          <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ─────────────────────────  STATS BAND  ─────────────────────────── */}
      <section className="relative border-y border-border/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border/30 px-0 md:grid-cols-4">
          {[
            { value: "<1kb", label: "Tracker size", sub: "Async, no jQuery" },
            { value: "0", label: "Cookies set", sub: "No banner required" },
            { value: "60s", label: "Setup time", sub: "One script tag" },
            { value: "100%", label: "Your data", sub: "Export anytime" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 px-6 py-7 md:px-8 md:py-9"
            >
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {s.label}
              </span>
              <span className="stat-num text-3xl font-medium text-foreground md:text-4xl">
                {s.value}
              </span>
              <span className="text-xs text-muted-foreground">{s.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────  FEATURES  ─────────────────────────── */}
      <section id="features" className="relative">
        <div className="bg-plus pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-spotlight-top opacity-60"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 max-w-2xl">
            <SectionEyebrow num="01" label="Features" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Everything you need.
              <br />
              <em className="not-italic font-normal text-primary">Nothing</em> you don&rsquo;t.
            </h2>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Metrix is opinionated. We picked the metrics that actually inform
              decisions and built around them — clearly, quickly, and quietly.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const featured = i === 0;
              return (
                <div
                  key={f.title}
                  className={`group relative flex flex-col gap-3 bg-card p-7 transition-colors hover:bg-surface/40 ${
                    featured ? "lg:col-span-2 lg:row-span-2 lg:gap-5 lg:p-9" : ""
                  }`}
                >
                  {featured ? (
                    <>
                      <div className="flex items-start justify-between">
                        <span className="grid size-11 place-items-center rounded-md border border-border bg-surface text-primary transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Cornerstone
                        </span>
                      </div>
                      <h3 className="display mt-2 text-balance text-3xl leading-[1.1] tracking-tight lg:text-4xl">
                        {f.title}.
                      </h3>
                      <p className="max-w-md text-sm leading-relaxed text-muted-foreground lg:text-base">
                        {f.body}
                      </p>
                      <div className="mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
                        {[
                          ["0", "Cookies"],
                          ["0", "Banners"],
                          ["0", "IPs stored"],
                        ].map(([n, l]) => (
                          <div key={l} className="flex flex-col items-start gap-0.5 bg-card px-4 py-3">
                            <span className="stat-num text-2xl font-medium text-primary">{n}</span>
                            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                              {l}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="grid size-9 place-items-center rounded-md border border-border bg-surface text-primary transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="mt-2 text-base font-medium text-foreground">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────  HOW IT WORKS  ────────────────────────── */}
      <section id="how" className="relative border-t border-border/30 bg-card/20">
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 max-w-2xl">
            <SectionEyebrow num="02" label="How it works" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Three steps.
              <br />
              <em className="not-italic font-normal text-primary">No theatrics.</em>
            </h2>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              From paste to first conversion in under an hour. No spreadsheets,
              no PMs, no GTM container someone has to maintain.
            </p>
          </div>

          {/* Step connector (desktop) */}
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
            />

            <div className="relative grid gap-4 md:grid-cols-3">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="group relative flex flex-col gap-4 rounded-md border border-border/70 bg-card p-7 transition-all hover:border-foreground/15 hover:bg-surface/30"
                  >
                    <span className="grid size-10 place-items-center rounded-md border border-border bg-background text-primary transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      <span className="size-1 rounded-full bg-primary" />
                      {step.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────  SETUP / CODE  ────────────────────────── */}
      <section className="relative border-t border-border/30">
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
          <div className="flex flex-col justify-center">
            <SectionEyebrow num="03" label="Setup" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              One line.
              <br />
              <em className="not-italic font-normal text-primary">That&rsquo;s it.</em>
            </h2>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Drop the snippet in your <code className="font-mono text-foreground">&lt;head&gt;</code>, push to production, and you&rsquo;re tracking. No GTM, no schemas, no PMs required.
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "Works with any framework — React, Vue, vanilla HTML, WordPress",
                "Auto-tracks pageviews, sessions, bounce, sources",
                "Custom events via data attributes or JS API",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  index.html
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-destructive/60" />
                  <span className="size-1.5 rounded-full bg-amber-500/60" />
                  <span className="size-1.5 rounded-full bg-primary/60" />
                </div>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed">
<code><span className="text-muted-foreground">{`<!-- Add to <head>, anywhere on the page -->`}</span>
{`\n`}<span className="text-foreground/80">{`<`}<span className="text-primary">{`script`}</span>{` `}<span className="text-chart-3">{`async`}</span>{` `}<span className="text-chart-3">{`src`}</span>{`=`}<span className="text-foreground">{`"https://cdn.metrix.io/t.js"`}</span></span>
{`        `}<span className="text-chart-3">data-site-id</span>=<span className="text-foreground">{`"mx_demo123"`}</span><span className="text-foreground/80">{`>`}</span>
<span className="text-foreground/80">{`</`}<span className="text-primary">{`script`}</span>{`>`}</span></code>
              </pre>
            </div>

            <div className="overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Track a conversion (optional)
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed">
<code><span className="text-muted-foreground">{`// In your code, fire a custom event`}</span>
{`\nwindow.`}<span className="text-primary">metrix</span>.<span className="text-chart-3">track</span>(<span className="text-foreground">{`"whatsapp_click"`}</span>, {`{`}
{`  `}plan: <span className="text-foreground">{`"pro"`}</span>,
{`  `}<span className="text-muted-foreground">{`// any custom props`}</span>
{`}`});</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────  REAL-TIME  ───────────────────────────── */}
      <section className="relative border-t border-border/30 bg-card/10">
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="relative order-2 md:order-1">
              <RealtimeCard />
            </div>

            <div className="order-1 md:order-2">
              <SectionEyebrow num="04" label="Real-time" />
              <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
                Watch your launch
                <br />
                <em className="not-italic font-normal text-primary">live</em>.
              </h2>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                No 24-hour delays. The moment a visitor lands, you see them — which page they&rsquo;re on, where they came from, and whether they converted.
              </p>
              <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
                {[
                  "Live counter refreshes every 10s",
                  "Per-page activity, sorted by visitors",
                  "Useful during launches, ad pushes, and crisis comms",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────  TESTIMONIALS  ──────────────────────────── */}
      <Testimonials />

      {/* ───────────────────────  COMPARE  ─────────────────────────────── */}
      <section id="compare" className="relative border-t border-border/30 bg-card/20">
        <div className="relative mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-12 text-center">
            <SectionEyebrow num="06" label="Compare" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Metrix vs.{" "}
              <em className="not-italic font-normal text-primary">the bloat</em>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              We&rsquo;re not trying to replace enterprise analytics. We&rsquo;re trying to replace the 95% of you who never needed it.
            </p>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-card/60 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="grid grid-cols-3 border-b border-border bg-surface/60 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <div className="p-4">Feature</div>
              <div className="flex items-center gap-2 border-l border-primary/30 bg-primary/[0.04] p-4">
                <Logo size="sm" />
              </div>
              <div className="flex items-center gap-2 border-l border-border p-4 text-muted-foreground/80">
                Google Analytics 4
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 border-b border-border/60 text-sm last:border-b-0 ${i % 2 === 0 ? "bg-card/50" : "bg-card/20"}`}
              >
                <div className="p-4 text-foreground/85">{row.feature}</div>
                <div className="flex items-center gap-2 border-l border-primary/30 bg-primary/[0.04] p-4">
                  {typeof row.us === "boolean" ? (
                    row.us ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : (
                    <span className="font-medium text-primary">{row.us}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 border-l border-border p-4 text-muted-foreground">
                  {typeof row.them === "boolean" ? (
                    row.them ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : (
                    <span>{row.them}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────  PRICING  ─────────────────────────────── */}
      <section id="pricing" className="relative border-t border-border/30">
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 text-center">
            <SectionEyebrow num="07" label="Pricing" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Plain pricing.
              <br />
              <em className="not-italic font-normal text-primary">No surprises.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Pick a plan, switch anytime, cancel from the dashboard. No phone calls, no &ldquo;contact sales,&rdquo; no hidden seats.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`group relative flex flex-col rounded-md border p-7 transition-all ${
                  plan.accent
                    ? "border-primary/40 bg-card md:scale-[1.02]"
                    : "border-border bg-card/60 hover:bg-card"
                }`}
              >
                {plan.accent && (
                  <>
                    <span
                      aria-hidden
                      className="absolute -top-px left-7 right-7 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                    <span className="absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-primary/30 bg-card px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                      <span className="size-1 rounded-full bg-primary" />
                      Most popular
                    </span>
                  </>
                )}
                <h3 className="text-sm font-medium text-foreground">{plan.name}</h3>
                <p className="mt-1 min-h-[2.5rem] text-xs text-muted-foreground">{plan.blurb}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="stat-num text-4xl font-medium text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.cadence}</span>
                </div>

                <ul className="mt-6 flex flex-col gap-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href={plan.href}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                      plan.accent
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border bg-surface/40 text-foreground hover:bg-surface"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            All plans include real-time, CSV export, and unlimited team viewers. Prices in USD.
          </p>
        </div>
      </section>

      {/* ─────────────────────────  FAQ  ───────────────────────────────── */}
      <section id="faq" className="relative border-t border-border/30 bg-card/20">
        <div className="relative mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-10 text-center">
            <SectionEyebrow num="08" label="FAQ" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Questions, <em className="not-italic font-normal text-primary">answered</em>.
            </h2>
          </div>

          <div className="rounded-md border border-border bg-card/60 backdrop-blur">
            <div className="px-6">
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────  FINAL CTA  ─────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border/30">
        <div className="mx-auto max-w-4xl px-6 py-28 text-center md:px-10 md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="live-dot" /> Get started in 60 seconds
          </span>
          <h2 className="display mt-6 text-balance text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Stop guessing.
            <br />
            Start <em className="not-italic font-normal text-primary">knowing</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
            Add Metrix to your site in 60 seconds. Watch the first visitor arrive live.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Create your free account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-surface"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  FOOTER  ────────────────────────────── */}
      <footer className="relative border-t border-border/30 bg-card/30">
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Logo size="md" />
              <p className="max-w-xs text-sm text-muted-foreground">
                Privacy-friendly analytics and conversion tracking for small businesses.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  aria-label="Metrix on X"
                  className="grid size-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  aria-label="Metrix on GitHub"
                  className="grid size-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {[
              {
                title: "Product",
                links: [
                  ["Features", "#features"],
                  ["How it works", "#how"],
                  ["Pricing", "#pricing"],
                  ["Compare", "#compare"],
                ],
              },
              {
                title: "Resources",
                links: [
                  ["Documentation", "#"],
                  ["API", "#"],
                  ["Status", "#"],
                  ["Support", "#"],
                ],
              },
              {
                title: "Company",
                links: [
                  ["About", "#"],
                  ["Privacy", "#"],
                  ["Terms", "#"],
                  ["Security", "#"],
                ],
              },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2 text-sm">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} Metrix. All rights reserved.</span>
            <span className="flex items-center gap-2">
              <span className="live-dot" /> All systems operational
            </span>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
