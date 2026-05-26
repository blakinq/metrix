/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  code: string | null | undefined;
  name?: string;
  className?: string;
  size?: "sm" | "md";
}

export function CountryFlag({ code, name, className, size = "sm" }: CountryFlagProps) {
  const valid = code && /^[a-zA-Z]{2}$/.test(code);
  const dims = size === "md" ? "h-4 w-[22px]" : "h-3 w-[18px]";

  if (!valid) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block shrink-0 rounded-[2px] bg-surface ring-1 ring-border/60",
          dims,
          className,
        )}
      />
    );
  }

  const lc = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/${lc}.svg`}
      alt={name ?? code}
      width={size === "md" ? 22 : 18}
      height={size === "md" ? 16 : 12}
      loading="lazy"
      className={cn(
        "inline-block shrink-0 rounded-[2px] object-cover ring-1 ring-foreground/10",
        dims,
        className,
      )}
    />
  );
}
