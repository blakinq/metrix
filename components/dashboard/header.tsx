"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export function DashboardHeader() {
  const { data: session } = useSession();
  const initial = session?.user?.email?.[0]?.toUpperCase() ?? "·";
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/70 bg-background/80 px-6 backdrop-blur-md">
      <Link href="/sites" aria-label="Metrix home" className="transition-opacity hover:opacity-80">
        <Logo size="md" />
      </Link>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {session?.user?.email}
        </span>
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-full border border-border bg-surface text-[11px] font-medium text-foreground/80"
        >
          {initial}
        </span>
        <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
