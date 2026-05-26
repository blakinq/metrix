import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "size-5" : size === "lg" ? "size-8" : "size-6";
  const text =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <span
        className={cn(
          "relative grid place-items-center rounded-md border border-border bg-surface text-primary",
          dims,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-3.5"
          aria-hidden="true"
        >
          <path d="M4 18 L4 10 L9 14 L12 6 L15 14 L20 10 L20 18" />
        </svg>
      </span>
      <span className={cn("display tracking-tight", text)}>
        Metrix<span className="text-primary">.</span>
      </span>
    </span>
  );
}
