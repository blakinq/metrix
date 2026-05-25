"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { data: session } = useSession();
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <Link href="/sites" className="text-lg font-bold tracking-tight">
        Metrix
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
        <Button size="sm" variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
