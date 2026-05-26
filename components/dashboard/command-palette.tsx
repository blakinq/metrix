"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Site {
  id: string;
  name: string;
  domain: string;
}

interface CommandPaletteProps {
  sites: Site[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ sites, open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = sites.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q),
    );
    return [
      ...matches.map((s) => ({
        kind: "site" as const,
        id: s.id,
        label: s.name,
        sub: s.domain,
        href: `/sites/${s.id}/overview`,
      })),
      {
        kind: "action" as const,
        id: "__new",
        label: "Add a site",
        sub: "Create a new tracking site",
        href: "/sites/new",
      },
    ];
  }, [sites, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = items[active];
      if (sel) go(sel.href);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 p-4 pt-[18vh] backdrop-blur-sm animate-fade-in"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-foreground/5"
      >
        <div className="flex items-center gap-2.5 border-b border-border/60 px-3.5 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search sites…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="grid size-6 shrink-0 place-items-center rounded text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-1.5">
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No matches.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {items.map((item, i) => {
                const Icon = item.kind === "site" ? Globe : Plus;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                        i === active
                          ? "bg-surface text-foreground"
                          : "text-foreground/85",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          i === active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {item.label}
                      </span>
                      <span className="shrink-0 truncate font-mono text-[10px] text-muted-foreground">
                        {item.sub}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border/70 bg-surface/60 px-1 py-px font-mono normal-case">
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border/70 bg-surface/60 px-1 py-px font-mono normal-case">
              ↵
            </kbd>
            Select
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-border/70 bg-surface/60 px-1 py-px font-mono normal-case">
              esc
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
