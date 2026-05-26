import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm",
        "text-foreground placeholder:text-muted-foreground/70",
        "transition-colors",
        "focus-visible:outline-none focus-visible:border-foreground/30 focus-visible:bg-surface focus-visible:ring-1 focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
