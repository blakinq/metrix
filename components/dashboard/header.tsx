"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { cn } from "@/lib/utils";

interface Site {
  id: string;
  name: string;
  domain: string;
}

export function DashboardHeader({
  sites = [],
  initialUnread = 0,
}: {
  sites?: Site[];
  initialUnread?: number;
}) {
  const { data: session } = useSession();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const email = session?.user?.email ?? "";
  const initial = email[0]?.toUpperCase() ?? "·";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/70 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/sites"
            aria-label="Metrix home"
            className="transition-opacity hover:opacity-80"
          >
            <Logo size="md" />
          </Link>
          <span aria-hidden className="hidden h-4 w-px bg-border/70 sm:block" />
          <Link
            href="/sites"
            className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            All sites
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search sites"
            onClick={() => setPaletteOpen(true)}
            className="hidden w-72 items-center gap-2 rounded-md border border-border/70 bg-surface/60 px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search sites…</span>
            <kbd className="font-mono text-[10px] text-muted-foreground/70">
              ⌘K
            </kbd>
          </button>
          <NotificationBell initialUnread={initialUnread} />
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                "grid size-7 place-items-center rounded-full border bg-surface text-[11px] font-medium text-foreground/85 transition-colors hover:border-foreground/20 hover:text-foreground",
                menuOpen ? "border-foreground/25 text-foreground" : "border-border",
              )}
            >
              {initial}
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-9 z-40 w-60 overflow-hidden rounded-md border border-border bg-popover shadow-lg ring-1 ring-foreground/5 animate-fade-in"
              >
                <div className="border-b border-border/60 px-3 py-2.5">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                    Signed in as
                  </p>
                  <p className="mt-0.5 truncate text-xs text-foreground">
                    {email || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <CommandPalette
        sites={sites}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
      />
    </>
  );
}
