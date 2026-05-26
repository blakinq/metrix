"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bell, BellOff, Globe, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

const ICON_BY_TYPE: Record<string, typeof Bell> = {
  site_created: Globe,
  goal_created: Target,
  first_event: Zap,
  milestone: Zap,
  system: Bell,
};

function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - t);
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function NotificationBell({
  initialUnread = 0,
}: {
  initialUnread?: number;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[] | null>(null);
  const [unread, setUnread] = useState(initialUnread);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) load();
  }

  // Background-poll the unread count so the badge stays fresh without the user
  // refreshing the page. Light call: returns a single integer.
  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const res = await fetch("/api/notifications/unread-count", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (alive) setUnread(data.unread ?? 0);
      } catch {
        // Best-effort; ignore.
      }
    }
    const id = setInterval(tick, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function onItemClick(n: Notification) {
    if (!n.isRead) {
      // Optimistic update.
      setItems((prev) =>
        prev ? prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)) : prev,
      );
      setUnread((u) => Math.max(0, u - 1));
      try {
        await fetch(`/api/notifications/${n.id}/read`, { method: "POST" });
      } catch {
        // Best effort; the user's next page load will re-sync.
      }
    }
    if (!n.link) setOpen(false);
  }

  async function markAll() {
    if (unread === 0) return;
    const prev = items;
    setItems((p) =>
      p ? p.map((x) => ({ ...x, isRead: true })) : p,
    );
    setUnread(0);
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
    } catch {
      setItems(prev);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={
          unread > 0 ? `Notifications (${unread} unread)` : "Notifications"
        }
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "relative grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface/60 hover:text-foreground",
          open && "bg-surface/60 text-foreground",
        )}
      >
        <Bell className="h-3.5 w-3.5" />
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute right-0.5 top-0.5 inline-flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] font-semibold text-primary-foreground ring-2 ring-background"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-40 w-80 overflow-hidden rounded-md border border-border bg-popover shadow-lg ring-1 ring-foreground/5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Notifications
            </p>
            <button
              type="button"
              onClick={markAll}
              disabled={unread === 0}
              className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && items === null ? (
              <div className="flex flex-col gap-2 px-3 py-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-md bg-surface/60"
                  />
                ))}
              </div>
            ) : !items || items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <span className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground">
                  <BellOff className="h-3.5 w-3.5" />
                </span>
                <p className="text-xs font-medium text-foreground">
                  You&rsquo;re all caught up
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Notifications about your sites and goals will appear here.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {items.map((n) => {
                  const Icon = ICON_BY_TYPE[n.type] ?? Bell;
                  const content = (
                    <div
                      className={cn(
                        "group flex items-start gap-2.5 border-b border-border/40 px-3 py-2.5 transition-colors last:border-b-0",
                        n.isRead
                          ? "bg-transparent hover:bg-surface/40"
                          : "bg-primary/[0.04] hover:bg-primary/[0.07]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border border-border/60 bg-surface text-muted-foreground",
                          !n.isRead && "border-primary/30 text-primary",
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium text-foreground">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span
                              aria-hidden
                              className="mt-1 size-1.5 shrink-0 rounded-full bg-primary"
                            />
                          )}
                        </div>
                        {n.body && (
                          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                            {n.body}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                          {relativeTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                  return (
                    <li key={n.id}>
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => {
                            onItemClick(n);
                            setOpen(false);
                          }}
                          className="block"
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onItemClick(n)}
                          className="block w-full text-left"
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-border/60 bg-background/40 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
