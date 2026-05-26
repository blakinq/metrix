import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Target,
  Code2,
  BarChart3,
  Check,
  X,
  Minus,
  ClipboardPaste,
  Flag,
  Eye,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { RealtimeCard } from "@/components/landing/realtime-card";
import { FaqItem } from "@/components/landing/faq-item";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Cookieless mode",
    body: "Opt in with one attribute and the tracker stops writing cookies entirely. Do Not Track is always respected.",
  },
  {
    icon: Zap,
    title: "Lightweight tracker",
    body: "A single async script. No jQuery, no dependencies, no render blocking.",
  },
  {
    icon: Activity,
    title: "Realtime view",
    body: "See visitors as they arrive. No 24 hour delay, no sampling.",
  },
  {
    icon: Target,
    title: "Conversion goals",
    body: "Track button clicks, form submits, page visits, or any custom event you fire.",
  },
  {
    icon: BarChart3,
    title: "Built for clarity",
    body: "The metrics that inform decisions: visitors, sources, pages, conversions. Nothing else.",
  },
  {
    icon: Code2,
    title: "Your data, exported",
    body: "CSV export for events, sessions, pages, sources, and conversions. No lock in.",
  },
];

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste the snippet",
    body: "One <script> tag in your <head>. Async, loads after your page.",
  },
  {
    icon: Flag,
    title: "Set your goals",
    body: "Pick what counts as a conversion: page visits, clicks, form submits. No code required.",
  },
  {
    icon: Eye,
    title: "Watch the data land",
    body: "Visitors and conversions appear live in the dashboard.",
  },
];

const COMPARISON = [
  { feature: "Cookies (default)", us: "Optional", them: "Multiple" },
  { feature: "Cookie banner required", us: false, them: true },
  { feature: "Time to first insight", us: "Seconds", them: "Up to 24 hours" },
  { feature: "Data sampling", us: false, them: true },
  { feature: "CSV export", us: true, them: false },
  { feature: "Setup", us: "One <script> tag", them: "Tag Manager + config" },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "For a single landing page or side project.",
    features: ["1 site", "10k events / month", "30 day history", "Realtime view", "CSV export"],
    cta: "Start tracking",
    href: "/signup",
    accent: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/ month",
    blurb: "For agencies and founders running multiple sites.",
    features: [
      "10 sites",
      "100k events / month",
      "Unlimited history",
      "Conversion goals",
      "Email reports",
    ],
    cta: "Start 14 day trial",
    href: "/signup",
    accent: true,
  },
  {
    name: "Business",
    price: "$79",
    cadence: "/ month",
    blurb: "Team seats and API access.",
    features: [
      "Unlimited sites",
      "1M events / month",
      "Team seats",
      "REST API access",
      "Custom retention",
    ],
    cta: "Start 14 day trial",
    href: "/signup",
    accent: false,
  },
];

const FAQS = [
  {
    q: "Does Metrix use cookies?",
    a: "By default, the tracker sets a first party cookie (metrix_visitor_id) to recognise returning visitors. Add data-consent=\"cookieless\" to the script tag and no cookies are written. Visitor IDs become ephemeral per page. Do Not Track is always respected.",
  },
  {
    q: "How is this different from Google Analytics?",
    a: "Metrix focuses on a small set of metrics that inform decisions: visitors, sources, pages, conversions. No 24 hour processing delay, no sampling, and no Tag Manager required.",
  },
  {
    q: "Can I track conversions?",
    a: "Yes. Define goals for page visits (e.g. /thank-you), clicks, form submits, or any custom event fired with window.metrix.track(). Counts and rates appear in the dashboard.",
  },
  {
    q: "Can I export my data?",
    a: "Anytime. Every site has CSV exports for events, sessions, pages, sources, and conversions.",
  },
  {
    q: "Do you offer a free plan?",
    a: "Yes. 1 site, 10k events per month, 30 day history, realtime view. No credit card required.",
  },
  {
    q: "Can I self host the tracker?",
    a: "Yes. /tracker.js is a single file you can copy to your own CDN if you want full control over delivery.",
  },
];

function SectionEyebrow({ label }: { label: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 text-center md:pt-28">
          <h1
            className="display animate-fade-up text-balance text-5xl leading-[1.05] tracking-tight md:text-7xl"
          >
            The analytics you&rsquo;ll
            <br className="hidden md:block" />{" "}
            <em className="not-italic font-normal text-primary">actually</em>{" "}
            open.
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl animate-fade-up text-balance text-base text-muted-foreground md:text-lg"
            style={{ animationDelay: "80ms" }}
          >
            Realtime visitors, sources, and conversions. Without cookies,
            sampling, or a 24 hour wait.
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "160ms" }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start tracking for free
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
            style={{ animationDelay: "200ms" }}
          >
            Free forever for 1 site · No card required
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto mt-4 max-w-7xl px-6 pb-24 md:mt-8 md:px-10">
          <div className="animate-fade-up" style={{ animationDelay: "260ms" }}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ──────────────────────────  FEATURES  ─────────────────────────── */}
      <section id="features" className="relative border-t border-border/30">
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-14 max-w-2xl">
            <SectionEyebrow label="Features" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Everything you need.
              <br />
              <em className="not-italic font-normal text-primary">Nothing</em> you don&rsquo;t.
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative flex flex-col gap-3 bg-card p-7 transition-colors hover:bg-surface/40"
                >
                  <span className="grid size-9 place-items-center rounded-md border border-border bg-surface text-primary transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-2 text-base font-medium text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
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
            <SectionEyebrow label="How it works" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Three steps.
            </h2>
          </div>

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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────  SETUP / CODE  ────────────────────────── */}
      <section className="relative border-t border-border/30">
        <div className="relative mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32">
          <div className="text-center">
            <SectionEyebrow label="Setup" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Add one <em className="not-italic font-normal text-primary">script tag</em>.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
              Pageviews, sessions, sources, and devices are tracked automatically.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-md border border-border bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-foreground/5">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                index.html
              </span>
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-destructive/60" />
                <span className="size-1.5 rounded-full bg-amber-500/60" />
                <span className="size-1.5 rounded-full bg-primary/60" />
              </div>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed md:p-8">
<code><span className="text-foreground/80">{`<`}<span className="text-primary">{`script`}</span>{` `}<span className="text-chart-3">{`async`}</span>{` `}<span className="text-chart-3">{`src`}</span>{`=`}<span className="text-foreground">{`"https://cdn.metrix.io/tracker.js"`}</span></span>
{`        `}<span className="text-chart-3">data-site-id</span>=<span className="text-foreground">{`"mx_demo123"`}</span><span className="text-foreground/80">{`>`}</span><span className="text-foreground/80">{`</`}<span className="text-primary">{`script`}</span>{`>`}</span></code>
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" />
              Async, never blocks render
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" />
              Zero dependencies
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" />
              Self hostable
            </span>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <p className="mb-3 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Track a custom event
            </p>
            <div className="overflow-hidden rounded-md border border-border/70 bg-card/60">
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed">
<code>{`window.`}<span className="text-primary">metrix</span>.<span className="text-chart-3">track</span>(<span className="text-foreground">{`"whatsapp_click"`}</span>, {`{ plan: `}<span className="text-foreground">{`"pro"`}</span>{` }`});</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────  REAL-TIME  ───────────────────────────── */}
      <section className="relative border-t border-border/30 bg-card/10">
        <div className="relative mx-auto max-w-4xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-12 text-center">
            <SectionEyebrow label="Realtime" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Watch your launch <em className="not-italic font-normal text-primary">live</em>.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
              No 24 hour delays. Visitors appear in the feed as they arrive.
            </p>
          </div>

          <RealtimeCard />
        </div>
      </section>

      {/* ───────────────────────  COMPARE  ─────────────────────────────── */}
      <section id="compare" className="relative border-t border-border/30 bg-card/20">
        <div className="relative mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-12 text-center">
            <SectionEyebrow label="Compare" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Metrix vs. Google Analytics 4.
            </h2>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-card/60 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-foreground/5 backdrop-blur">
            <div className="grid grid-cols-3 border-b border-border bg-surface/60 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <div className="p-4 text-center">Feature</div>
              <div className="flex items-center justify-center gap-2 border-l border-primary/30 bg-primary/[0.04] p-4">
                <Logo size="sm" />
              </div>
              <div className="flex items-center justify-center gap-2 border-l border-border p-4 text-muted-foreground/80">
                Google Analytics 4
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 border-b border-border/60 text-sm last:border-b-0 ${i % 2 === 0 ? "bg-card/50" : "bg-card/20"}`}
              >
                <div className="p-4 text-center text-foreground/85">{row.feature}</div>
                <div className="flex items-center justify-center gap-2 border-l border-primary/30 bg-primary/[0.04] p-4">
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
                <div className="flex items-center justify-center gap-2 border-l border-border p-4 text-muted-foreground">
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
          <div className="mb-14">
            <SectionEyebrow label="Pricing" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Plain pricing.
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Switch plans or cancel from the dashboard. Prices in USD.
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
                  <span className="absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-primary/30 bg-card px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                    Most popular
                  </span>
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
        </div>
      </section>

      {/* ─────────────────────────  FAQ  ───────────────────────────────── */}
      <section id="faq" className="relative border-t border-border/30 bg-card/20">
        <div className="relative mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32">
          <div className="mb-10 text-center">
            <SectionEyebrow label="FAQ" />
            <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Questions, answered.
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

      {/* ─────────────────────────  FOOTER  ────────────────────────────── */}
      <footer className="relative border-t border-border/30 bg-card/30">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Metrix
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
            <Link href="/login" className="transition-colors hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
