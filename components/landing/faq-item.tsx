import { Plus } from "lucide-react";

export function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-border/60 py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
        <span className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
          {q}
        </span>
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-open:text-primary" />
      </summary>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  );
}
