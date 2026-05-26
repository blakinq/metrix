"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Compass,
  MousePointerClick,
  Target,
  Settings,
  Monitor,
  Globe,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";

const NAV = [
  {
    group: "Analyze",
    items: [
      { href: "overview", label: "Overview", icon: LayoutDashboard },
      { href: "realtime", label: "Realtime", icon: Activity },
    ],
  },
  {
    group: "Breakdowns",
    items: [
      { href: "pages", label: "Pages", icon: FileText },
      { href: "sources", label: "Sources", icon: Compass },
      { href: "devices", label: "Devices", icon: Monitor },
      { href: "countries", label: "Countries", icon: Globe },
    ],
  },
  {
    group: "Outcomes",
    items: [
      { href: "events", label: "Events", icon: MousePointerClick },
      { href: "conversions", label: "Conversions", icon: Target },
    ],
  },
  {
    group: "Manage",
    items: [{ href: "settings", label: "Settings", icon: Settings }],
  },
];

interface Site {
  id: string;
  name: string;
  domain: string;
}

interface SiteSidebarProps {
  siteId: string;
  siteName?: string;
  sites?: Site[];
}

export function SiteSidebar({ siteId, siteName, sites = [] }: SiteSidebarProps) {
  const pathname = usePathname();
  const [active, setActive] = useState<number | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const res = await fetch(`/api/sites/${siteId}/analytics/realtime`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (alive) setActive(data.activeVisitors ?? 0);
      } catch {
        // Silent: keep showing previous value (or em-dash).
      }
    }
    tick();
    const id = setInterval(tick, 15_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [siteId]);

  useEffect(() => {
    if (!switcherOpen) return;
    function onClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setSwitcherOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [switcherOpen]);

  const initial = (siteName ?? "M").trim()[0]?.toUpperCase() ?? "M";

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r border-border/70 bg-background/50 px-3 py-4 md:flex">
      <div ref={switcherRef} className="relative mb-5">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={switcherOpen}
          onClick={() => setSwitcherOpen((o) => !o)}
          className={cn(
            "flex w-full items-center justify-between rounded-md border bg-card/70 px-2 py-1.5 transition-colors",
            switcherOpen
              ? "border-foreground/20"
              : "border-border/60 hover:border-foreground/15",
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-primary text-[10px] font-semibold text-primary-foreground">
              {initial}
            </span>
            <span className="truncate text-[11px] font-medium text-foreground">
              {siteName ?? "Workspace"}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 shrink-0 text-muted-foreground/60 transition-transform",
              switcherOpen && "rotate-180",
            )}
          />
        </button>

        {switcherOpen && (
          <div
            role="menu"
            className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-lg ring-1 ring-foreground/5 animate-fade-in"
          >
            <p className="border-b border-border/60 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
              Switch site
            </p>
            <ul className="max-h-72 overflow-y-auto p-1">
              {sites.length === 0 ? (
                <li className="px-2 py-2 text-xs text-muted-foreground">
                  No sites yet.
                </li>
              ) : (
                sites.map((s) => {
                  const isCurrent = s.id === siteId;
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/sites/${s.id}/overview`}
                        role="menuitem"
                        onClick={() => setSwitcherOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                          isCurrent
                            ? "bg-surface text-foreground"
                            : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
                        )}
                      >
                        <span className="grid size-4 shrink-0 place-items-center rounded-sm bg-surface text-[9px] font-semibold text-foreground/80">
                          {s.name[0]?.toUpperCase() ?? "·"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {s.name}
                          </span>
                          <span className="block truncate font-mono text-[9px] text-muted-foreground">
                            {s.domain}
                          </span>
                        </span>
                        {isCurrent && (
                          <Check className="h-3 w-3 shrink-0 text-primary" />
                        )}
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
            <div className="border-t border-border/60 p-1">
              <Link
                href="/sites/new"
                role="menuitem"
                onClick={() => setSwitcherOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
                Add a site
              </Link>
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.group} className="flex flex-col gap-0.5">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
              {section.group}
            </p>
            {section.items.map((item) => {
              const href = `/sites/${siteId}/${item.href}`;
              const isActive = pathname?.startsWith(href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-surface text-foreground"
                      : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute -left-3 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-primary"
                    />
                  )}
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    {item.label}
                  </span>
                  {item.href === "realtime" && active != null && active > 0 && (
                    <span className="flex items-center gap-1 text-[9px] text-primary">
                      <span className="size-1 animate-pulse-soft rounded-full bg-primary" />
                      {active}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-5 flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-2">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {active != null && active > 0 ? (
            <span className="live-dot" />
          ) : (
            <span className="size-2 rounded-full bg-muted-foreground/40" />
          )}
          Live
        </span>
        <span className="stat-num text-xs font-medium text-foreground">
          {active != null ? active : "—"}
        </span>
      </div>
    </aside>
  );
}
