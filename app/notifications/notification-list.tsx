"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Bell, BellOff, Globe, Target, Zap, type LucideIcon } from "lucide-react";
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

const ICON_BY_TYPE: Record<string, LucideIcon> = {
  site_created: Globe,
  goal_created: Target,
  first_event: Zap,
  milestone: Zap,
  system: Bell,
};

type Filter = "all" | "unread";

function dayBucket(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (today.getTime() - start.getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  if (diffDays < 30) return "This month";
  return "Earlier";
}

function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - t);
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function NotificationList({ items: initial }: { items: Notification[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState(false);

  const visible = useMemo(
    () => (filter === "unread" ? items.filter((i) => !i.isRead) : items),
    [items, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Notification[]>();
    for (const n of visible) {
      const k = dayBucket(n.createdAt);
      const arr = map.get(k);
      if (arr) arr.push(n);
      else map.set(k, [n]);
    }
    return Array.from(map.entries());
  }, [visible]);

  const unread = items.filter((i) => !i.isRead).length;

  async function onItemClick(n: Notification) {
    if (n.isRead) return;
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
    );
    try {
      await fetch(`/api/notifications/${n.id}/read`, { method: "POST" });
    } catch {
      // swallow; next page load will resync
    }
  }

  async function markAll() {
    if (unread === 0) return;
    setBusy(true);
    const prev = items;
    setItems((p) => p.map((x) => ({ ...x, isRead: true })));
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      router.refresh();
    } catch {
      setItems(prev);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-md border border-border/70 bg-surface/40 p-0.5 text-xs">
          {(["all", "unread"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-[5px] px-3 py-1 capitalize transition-colors",
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
              {f === "unread" && unread > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/15 px-1.5 font-mono text-[10px] text-primary">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={markAll}
          disabled={unread === 0 || busy}
          className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        >
          Mark all as read
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border/70 bg-surface/30 px-6 py-12 text-center">
          <span className="grid size-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground">
            <BellOff className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {filter === "unread"
                ? "Nothing unread"
                : "No notifications yet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Milestones and updates about your sites will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([bucket, group]) => (
            <section key={bucket} className="flex flex-col gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                {bucket}
              </p>
              <ul className="overflow-hidden rounded-md border border-border/70 bg-card/60">
                {group.map((n) => {
                  const Icon = ICON_BY_TYPE[n.type] ?? Bell;
                  const content = (
                    <div
                      className={cn(
                        "group flex items-start gap-3 border-b border-border/40 px-4 py-3 transition-colors last:border-b-0",
                        n.isRead
                          ? "hover:bg-surface/40"
                          : "bg-primary/[0.05] hover:bg-primary/[0.08]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-border/60 bg-surface text-muted-foreground",
                          !n.isRead && "border-primary/30 text-primary",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span
                              aria-hidden
                              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                            />
                          )}
                        </div>
                        {n.body && (
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {n.body}
                          </p>
                        )}
                        <p className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
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
                          onClick={() => onItemClick(n)}
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
