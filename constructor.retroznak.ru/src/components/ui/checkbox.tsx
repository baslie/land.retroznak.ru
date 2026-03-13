import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-5 w-5 rounded-md border border-border/70 bg-retro-charcoal/80 text-accent-platinum focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-platinum/70 focus-visible:ring-offset-2 focus-visible:ring-offset-retro-charcoal disabled:cursor-not-allowed disabled:opacity-50",
        "accent-accent-platinum",
        className,
      )}
      {...props}
    />
  ),
);

Checkbox.displayName = "Checkbox";
