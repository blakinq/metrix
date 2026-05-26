"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const NAV = [
  { group: "Analyze", items: [
    { href: "overview", label: "Overview", icon: LayoutDashboard },
    { href: "realtime", label: "Realtime", icon: Activity },
  ]},
  { group: "Breakdowns", items: [
    { href: "pages", label: "Pages", icon: FileText },
    { href: "sources", label: "Sources", icon: Compass },
    { href: "devices", label: "Devices", icon: Monitor },
    { href: "countries", label: "Countries", icon: Globe },
  ]},
  { group: "Outcomes", items: [
    { href: "events", label: "Events", icon: MousePointerClick },
    { href: "conversions", label: "Conversions", icon: Target },
  ]},
  { group: "Manage", items: [
    { href: "settings", label: "Settings", icon: Settings },
  ]},
];

export function SiteSidebar({ siteId }: { siteId: string }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-border/70 bg-background/50 px-3 py-6 md:block">
      <nav className="flex flex-col gap-6">
        {NAV.map((section) => (
          <div key={section.group} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
              {section.group}
            </p>
            {section.items.map((item) => {
              const href = `/sites/${siteId}/${item.href}`;
              const active = pathname?.startsWith(href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-surface text-foreground"
                      : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-primary"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
