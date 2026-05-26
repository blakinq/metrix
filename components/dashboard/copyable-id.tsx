"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyableId({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access denied — silently ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      title={`Copy ${label ?? "value"}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-surface/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
        className,
      )}
    >
      <span>{value}</span>
      {copied ? (
        <Check className="h-3 w-3 text-primary" />
      ) : (
        <Copy className="h-3 w-3 opacity-60" />
      )}
    </button>
  );
}
