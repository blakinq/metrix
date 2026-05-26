import { Star } from "lucide-react";
import { TestimonialsCarousel } from "./testimonials-carousel";

const METRICS: { value: string; label: string; sub?: string; accent?: boolean }[] = [
  { value: "4.9", label: "Avg. rating", sub: "out of 5", accent: true },
  { value: "2,400+", label: "Sites tracking" },
  { value: "48M", label: "Events / month" },
  { value: "<1kb", label: "Tracker size" },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative border-t border-border/30 bg-card/20"
    >
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="mb-14 max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="font-mono text-foreground/50">05</span>
            <span className="h-px w-6 bg-border" aria-hidden />
            Testimonials
          </p>
          <h2 className="display mt-4 text-balance text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Loved by people who&rsquo;d rather be{" "}
            <em className="not-italic font-normal text-primary">building</em>.
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Indie hackers, agencies, growth marketers, and small business
            owners, all running on Metrix.
          </p>
        </div>

        <TestimonialsCarousel />

        {/* Metrics */}
        <div className="mt-16 overflow-hidden rounded-md border border-border bg-card/40">
          <div className="grid grid-cols-2 divide-x divide-border/60 md:grid-cols-4 md:[&>*:nth-child(-n+2)]:border-b-0 [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-border/60 md:[&>*]:border-b-0">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="relative flex flex-col items-start gap-1.5 px-6 py-7 md:px-7 md:py-8"
              >
                {m.accent && (
                  <span
                    aria-hidden
                    className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
                  />
                )}
                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {m.label}
                </span>
                <span className="flex items-baseline gap-1">
                  <span
                    className={`stat-num text-3xl font-medium md:text-4xl ${
                      m.accent ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {m.value}
                  </span>
                  {m.sub && (
                    <span className="text-xs text-muted-foreground">{m.sub}</span>
                  )}
                </span>
                {m.accent && (
                  <span className="flex items-center gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
