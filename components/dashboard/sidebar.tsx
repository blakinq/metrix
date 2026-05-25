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
  { href: "overview", label: "Overview", icon: LayoutDashboard },
  { href: "realtime", label: "Realtime", icon: Activity },
  { href: "pages", label: "Pages", icon: FileText },
  { href: "sources", label: "Sources", icon: Compass },
  { href: "devices", label: "Devices", icon: Monitor },
  { href: "countries", label: "Countries", icon: Globe },
  { href: "events", label: "Events", icon: MousePointerClick },
  { href: "conversions", label: "Conversions", icon: Target },
  { href: "settings", label: "Settings", icon: Settings },
];

export function SiteSidebar({ siteId }: { siteId: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 border-r bg-card px-3 py-6 md:block">
      <nav className="space-y-1">
        {NAV.map((item) => {
          const href = `/sites/${siteId}/${item.href}`;
          const active = pathname?.startsWith(href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-accent font-medium text-accent-foreground" : "hover:bg-accent/60",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
