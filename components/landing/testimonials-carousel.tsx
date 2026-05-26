"use client";

import { useState } from "react";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  highlight?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We replaced GA4 across 14 client landing pages in one afternoon. The dashboards finally answer the questions our clients actually ask.",
    name: "Lena Okafor",
    role: "Founder, Northstar Studio",
    initials: "LO",
    highlight: "one afternoon",
  },
  {
    quote:
      "The real-time view is what sold me. We push a campaign, watch visitors arrive live, and adjust copy in the same hour.",
    name: "Daniel Park",
    role: "Growth lead, Saplink",
    initials: "DP",
    highlight: "adjust copy in the same hour",
  },
  {
    quote:
      "Finally — analytics that don't make me feel like I'm being audited. The numbers are clear, the script is invisible, and there's no cookie banner.",
    name: "Priya Raman",
    role: "Indie hacker",
    initials: "PR",
  },
  {
    quote:
      "Conversion goals took two minutes to set up. WhatsApp clicks, form submits, phone taps — all tracked, all in one place.",
    name: "Marco Bianchi",
    role: "Owner, Bianchi Property",
    initials: "MB",
    highlight: "two minutes",
  },
  {
    quote:
      "Switched from a tool that cost 12× more and gave us 12× more noise. Metrix is the entire dashboard I actually open every morning.",
    name: "Aisha Khan",
    role: "Marketing, Lumen Health",
    initials: "AK",
    highlight: "every morning",
  },
  {
    quote:
      "The script is so small I had to check twice. Page-speed score went up 4 points the day we migrated.",
    name: "Toby Ellis",
    role: "Engineer, Field Notes Co.",
    initials: "TE",
  },
];

const AVATAR_TINTS = [
  "from-primary/30 to-primary/10 text-primary",
  "from-chart-2/30 to-chart-2/10 text-chart-2",
  "from-chart-3/30 to-chart-3/10 text-chart-3",
  "from-chart-4/30 to-chart-4/10 text-chart-4",
  "from-chart-5/30 to-chart-5/10 text-chart-5",
  "from-primary/30 to-chart-2/10 text-primary",
];

export function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[idx];
  const tint = AVATAR_TINTS[idx % AVATAR_TINTS.length];

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <div className="flex flex-col gap-6">
      <figure
        key={idx}
        className="group relative flex animate-fade-in flex-col gap-6 rounded-md border border-border/70 bg-card p-7 md:p-10"
      >
        <Quote
          className="absolute right-6 top-6 h-8 w-8 text-primary/30 md:right-8 md:top-8"
          aria-hidden
        />

        <blockquote className="display max-w-3xl text-balance text-2xl leading-[1.25] tracking-tight text-foreground/90 md:text-3xl">
          <span className="text-primary">&ldquo;</span>
          {t.highlight ? (
            <>
              {t.quote.split(t.highlight)[0]}
              <em className="not-italic text-primary">{t.highlight}</em>
              {t.quote.split(t.highlight)[1]}
            </>
          ) : (
            t.quote
          )}
          <span className="text-primary">&rdquo;</span>
        </blockquote>

        <figcaption className="mt-auto flex items-center gap-3 border-t border-border/60 pt-5">
          <span
            className={cn(
              "grid size-11 place-items-center rounded-full border border-border bg-gradient-to-br text-sm font-medium",
              tint,
            )}
            aria-hidden
          >
            {t.initials}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-medium text-foreground">{t.name}</span>
            <span className="text-xs text-muted-foreground">{t.role}</span>
          </div>
        </figcaption>
      </figure>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === idx}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            <span className="stat-num text-foreground">{String(idx + 1).padStart(2, "0")}</span>
            <span className="mx-1.5 text-border">/</span>
            {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="grid size-9 place-items-center rounded-md border border-border bg-surface/40 text-foreground transition-colors hover:border-foreground/25 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="grid size-9 place-items-center rounded-md border border-border bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
