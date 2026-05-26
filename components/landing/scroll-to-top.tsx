"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll to top"
      className={cn(
        "group fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-full",
        "border border-border bg-card/90 text-foreground backdrop-blur",
        "shadow-xl shadow-black/40 transition-all duration-300",
        "hover:border-primary/40 hover:bg-primary hover:text-primary-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-primary/0 transition-colors duration-300 group-hover:bg-primary/20 group-hover:blur"
      />
    </button>
  );
}
