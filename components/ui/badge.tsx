import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-foreground/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        success:
          "border-primary/25 bg-primary/10 text-primary",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
